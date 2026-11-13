import { IVA_RATE } from "@/lib/constants";
import type { PriceTier, Product } from "@/types/catalog";

export type AccountMode = "minorista" | "mayorista";

export interface ProductPricingSummary {
  unitNetPrice: number;
  baseUnitPrice: number;
  discountPct: number;
  subtotalNeto: number;
  ivaAmount: number;
  totalConIva: number;
  unitPriceWithIva: number;
  savingsNeto: number;
  activeTier: PriceTier | null;
}

/**
 * Determina la cantidad sugerida inicial según el tipo de cuenta del usuario:
 * - Mayorista B2B: arranca en el pack mayorista estándar (25 u., ~17% OFF) salvo cotización manual.
 * - Minorista / Público general: arranca en 1 unidad.
 */
export function getRecommendedQtyForClientType(
  product: Pick<Product, "requiresManualQuote" | "priceTiers">,
  clientType?: AccountMode,
): number {
  if (clientType !== "mayorista" || product.requiresManualQuote || !product.priceTiers.length) {
    return 1;
  }

  const sortedAsc = [...product.priceTiers].sort((a, b) => a.minQty - b.minQty);
  const preferredB2BTier = sortedAsc.find((tier) => tier.minQty >= 25);
  if (preferredB2BTier) {
    return preferredB2BTier.minQty;
  }

  return sortedAsc[sortedAsc.length - 1]?.minQty ?? 1;
}

/**
 * Calcula precio unitario neto, descuento por volumen, IVA 21% y ahorro total
 * de manera uniforme entre catálogo, ficha técnica y carrito.
 */
export function computeProductPricing(
  product: Pick<Product, "basePrice" | "priceTiers" | "requiresManualQuote">,
  quantity: number,
): ProductPricingSummary {
  const safeQty = Math.max(1, Math.floor(Number.isFinite(quantity) ? quantity : 1));

  const activeTier =
    !product.requiresManualQuote && product.priceTiers.length > 0
      ? ([...product.priceTiers]
          .sort((a, b) => b.minQty - a.minQty)
          .find((tier) => safeQty >= tier.minQty) ?? null)
      : null;

  const unitNetPrice = activeTier ? activeTier.unitPrice : product.basePrice;
  const discountPct = activeTier ? activeTier.discountPct : 0;
  const subtotalNeto = unitNetPrice * safeQty;
  const ivaAmount = Math.round(subtotalNeto * IVA_RATE);
  const totalConIva = subtotalNeto + ivaAmount;
  const unitPriceWithIva = Math.round(unitNetPrice * (1 + IVA_RATE));
  const savingsNeto = Math.max(0, product.basePrice * safeQty - subtotalNeto);

  return {
    unitNetPrice,
    baseUnitPrice: product.basePrice,
    discountPct,
    subtotalNeto,
    ivaAmount,
    totalConIva,
    unitPriceWithIva,
    savingsNeto,
    activeTier,
  };
}
