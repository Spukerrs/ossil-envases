import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types/catalog";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers de cálculo dinámico mayorista
  getItemUnitPrice: (item: CartItem) => number;
  getItemDiscountPct: (item: CartItem) => number;
  getItemSubtotal: (item: CartItem) => number;
  getNextTierInfo: (item: CartItem) => {
    neededUnits: number;
    targetTierQty: number;
    targetDiscountPct: number;
    potentialSavingsUnit: number;
  } | null;

  getTotalAmount: () => number;
  getTotalItemsCount: () => number;
  hasManualQuoteItems: () => boolean;

  // Generador de mensaje de WhatsApp estructurado
  generateWhatsAppMessage: (customerData?: {
    name?: string;
    deliveryMethod: "LOCAL" | "ENVIO";
    paymentMethod: "TRANSFERENCIA" | "TARJETA";
  }) => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemUnitPrice: (item) => {
        if (item.product.requiresManualQuote || !item.product.priceTiers.length) {
          return item.product.basePrice;
        }
        // Buscar el tramo más alto alcanzado
        const sortedTiers = [...item.product.priceTiers].sort((a, b) => b.minQty - a.minQty);
        const match = sortedTiers.find((t) => item.quantity >= t.minQty);
        return match ? match.unitPrice : item.product.basePrice;
      },

      getItemDiscountPct: (item) => {
        if (item.product.requiresManualQuote || !item.product.priceTiers.length) {
          return 0;
        }
        const sortedTiers = [...item.product.priceTiers].sort((a, b) => b.minQty - a.minQty);
        const match = sortedTiers.find((t) => item.quantity >= t.minQty);
        return match ? match.discountPct : 0;
      },

      getItemSubtotal: (item) => {
        return get().getItemUnitPrice(item) * item.quantity;
      },

      getNextTierInfo: (item) => {
        if (item.product.requiresManualQuote || !item.product.priceTiers.length) {
          return null;
        }
        const sortedAsc = [...item.product.priceTiers].sort((a, b) => a.minQty - b.minQty);
        // Buscar el próximo tramo no alcanzado
        const nextTier = sortedAsc.find((t) => t.minQty > item.quantity);
        if (!nextTier) return null;

        const currentPrice = get().getItemUnitPrice(item);
        return {
          neededUnits: nextTier.minQty - item.quantity,
          targetTierQty: nextTier.minQty,
          targetDiscountPct: nextTier.discountPct,
          potentialSavingsUnit: currentPrice - nextTier.unitPrice,
        };
      },

      getTotalAmount: () => {
        return get().items.reduce((acc, item) => acc + get().getItemSubtotal(item), 0);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      hasManualQuoteItems: () => {
        return get().items.some((i) => i.product.requiresManualQuote);
      },

      generateWhatsAppMessage: (customerData) => {
        const { items, getTotalAmount, getItemUnitPrice, getItemDiscountPct, hasManualQuoteItems } =
          get();
        const total = getTotalAmount();
        const deliveryText =
          customerData?.deliveryMethod === "LOCAL"
            ? "🏪 Retiro Express en Local (Oncativo 69, Córdoba Capital)"
            : "🚚 Envío al Interior / País (Transporte a cotizar)";
        const paymentText =
          customerData?.paymentMethod === "TRANSFERENCIA"
            ? "💳 Transferencia Bancaria / Efectivo (Sin recargo - 0%)"
            : "💳 Tarjeta / Billetera Virtual (Recargo a confirmar)";

        let msg = `*NUEVO PEDIDO DIGITAL — OSSIL ENVASES*\n`;
        if (customerData?.name) {
          msg += `*Cliente:* ${customerData.name}\n`;
        }
        msg += `*Modalidad:* ${deliveryText}\n`;
        msg += `*Medio de Pago:* ${paymentText}\n\n`;
        msg += `📦 *DETALLE DE PRODUCTOS:*\n`;

        items.forEach((item, idx) => {
          const unitPrice = getItemUnitPrice(item);
          const discount = getItemDiscountPct(item);
          const subtotal = unitPrice * item.quantity;
          const discText = discount > 0 ? ` (${discount}% OFF por escala)` : "";
          const quoteText = item.product.requiresManualQuote ? " [A COTIZAR POR ASESOR]" : "";

          msg += `${idx + 1}. *${item.product.name}*\n`;
          msg += `   • Cantidad: ${item.quantity} u.\n`;
          msg += `   • Rosca/Cierre: ${item.product.neckThread}\n`;
          if (!item.product.requiresManualQuote) {
            msg += `   • Unitario: $${unitPrice.toLocaleString("es-AR")}${discText}\n`;
            msg += `   • Subtotal: $${subtotal.toLocaleString("es-AR")}\n`;
          } else {
            msg += `   • Precio: ${quoteText}\n`;
          }
        });

        msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `*TOTAL ESTIMADO:* $${total.toLocaleString("es-AR")}\n`;
        if (hasManualQuoteItems()) {
          msg += `⚠️ *Nota:* La orden incluye productos que requieren cotización final de flete/precio especial por asesor.\n`;
        }
        msg += `\n_Generado automáticamente desde la plataforma digital de OSSIL Envases_`;

        return encodeURIComponent(msg);
      },
    }),
    {
      name: "ossil-cart-storage",
    },
  ),
);
