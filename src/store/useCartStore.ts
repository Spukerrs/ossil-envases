import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IVA_RATE } from "@/lib/constants";
import type { CartItem, Product } from "@/types/catalog";

interface WhatsAppCheckoutOptions {
  name?: string;
  cuit?: string;
  businessName?: string;
  voucherCode?: string;
  deliveryMethod: "LOCAL" | "ENVIO";
  paymentMethod: "TRANSFERENCIA" | "TARJETA";
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers de cálculo dinámico mayorista e IVA
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
  getTotalSavings: () => number;
  getIvaAmount: () => number;
  getTotalWithIva: () => number;
  getTotalItemsCount: () => number;
  hasManualQuoteItems: () => boolean;

  // Generador de mensaje de WhatsApp estructurado con detalle e IVA
  generateWhatsAppMessage: (customerData?: WhatsAppCheckoutOptions) => string;
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

      getTotalSavings: () => {
        return get().items.reduce((acc, item) => {
          const baseTotal = item.product.basePrice * item.quantity;
          const discountedTotal = get().getItemSubtotal(item);
          return acc + Math.max(0, baseTotal - discountedTotal);
        }, 0);
      },

      getIvaAmount: () => {
        return Math.round(get().getTotalAmount() * IVA_RATE);
      },

      getTotalWithIva: () => {
        const net = get().getTotalAmount();
        return net + Math.round(net * IVA_RATE);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      hasManualQuoteItems: () => {
        return get().items.some((i) => i.product.requiresManualQuote);
      },

      generateWhatsAppMessage: (customerData) => {
        const {
          items,
          getTotalAmount,
          getTotalSavings,
          getIvaAmount,
          getTotalWithIva,
          getItemUnitPrice,
          getItemDiscountPct,
          hasManualQuoteItems,
        } = get();

        const subtotalNeto = getTotalAmount();
        const savings = getTotalSavings();
        const iva = getIvaAmount();
        const totalFinal = getTotalWithIva();

        const deliveryText =
          customerData?.deliveryMethod === "LOCAL"
            ? `🏪 Retiro Express en Local (Oncativo 69, Córdoba)${customerData.voucherCode ? ` — Pase #${customerData.voucherCode}` : ""}`
            : "🚚 Envío por Expreso / Transporte (a coordinar)";
        const paymentText =
          customerData?.paymentMethod === "TRANSFERENCIA"
            ? "💳 Transferencia Bancaria / Efectivo (0% Recargo)"
            : "💳 Tarjeta / Billetera Virtual";

        let msg = `*ORDEN DE COMPRA DIGITAL — OSSIL ENVASES & HOME*\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        if (customerData?.name) {
          msg += `*Cliente:* ${customerData.name}\n`;
        }
        if (customerData?.businessName) {
          msg += `*Razón Social:* ${customerData.businessName}\n`;
        }
        if (customerData?.cuit) {
          msg += `*CUIT (Factura A):* ${customerData.cuit}\n`;
        }
        msg += `*Entrega:* ${deliveryText}\n`;
        msg += `*Pago:* ${paymentText}\n\n`;
        msg += `📦 *DETALLE DE ARTÍCULOS A COMPRAR (${items.length} ítems):*\n`;

        items.forEach((item, idx) => {
          const unitPrice = getItemUnitPrice(item);
          const discount = getItemDiscountPct(item);
          const subtotal = unitPrice * item.quantity;
          const discText = discount > 0 ? ` (-${discount}% escala)` : "";
          const threadText =
            item.product.neckThread !== "N/A" ? ` | Boca ${item.product.neckThread}` : "";

          msg += `\n${idx + 1}. *${item.product.name}* (SKU: ${item.product.sku})\n`;
          msg += `   • Cant.: ${item.quantity} u.${threadText}\n`;
          if (!item.product.requiresManualQuote) {
            msg += `   • Unit. Neto: $${unitPrice.toLocaleString("es-AR")}${discText}\n`;
            msg += `   • Subtotal Neto: $${subtotal.toLocaleString("es-AR")}\n`;
          } else {
            msg += `   • Precio: Sujeto a cotización de asesor\n`;
          }
        });

        msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `🧾 *RESUMEN CONTABLE DEL PEDIDO:*\n`;
        if (savings > 0) {
          msg += `• Ahorro por Escala Mayorista: -$${savings.toLocaleString("es-AR")}\n`;
        }
        msg += `• Subtotal Neto (s/IVA): $${subtotalNeto.toLocaleString("es-AR")}\n`;
        msg += `• IVA (21%): $${iva.toLocaleString("es-AR")}\n`;
        msg += `*TOTAL FINAL (IVA Incluido): $${totalFinal.toLocaleString("es-AR")}*\n`;

        if (hasManualQuoteItems()) {
          msg += `\n⚠️ *Nota:* Incluye artículos sujetos a confirmación por asesor técnico.\n`;
        }
        msg += `\n_Enviado desde el catálogo web de OSSIL Envases Córdoba_`;

        return encodeURIComponent(msg);
      },
    }),
    {
      name: "ossil-cart-storage",
    },
  ),
);
