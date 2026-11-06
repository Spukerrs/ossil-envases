export type BusinessUnit = "ENVASES" | "HOME";

export type Category =
  | "perfumeria"
  | "cosmetica-botellas"
  | "cosmetica-potes"
  | "medicinal"
  | "alimenticio"
  | "accesorios"
  | "bazar"
  | "velas";

export type Material =
  | "Vidrio"
  | "PET"
  | "PEAD"
  | "Acrílico"
  | "Aluminio"
  | "PVC"
  | "Insumos"
  | "Varios";

export type NeckThread =
  | "18/415"
  | "20/410"
  | "24/410"
  | "28/400"
  | "28/410"
  | "B/E 15"
  | "B/R 18"
  | "B/R 28"
  | "N/A";

export interface PriceTier {
  minQty: number;
  unitPrice: number;
  discountPct: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  businessUnit: BusinessUnit;
  category: Category;
  categoryLabel: string;
  material: Material;
  capacity: string;
  capacityValue?: number; // en cc o gramos
  neckThread: NeckThread;
  finish: string; // ej: "Satinado", "Cristal Incoloro", "Ámbar", "Blanco"
  basePrice: number;
  priceTiers: PriceTier[];
  requiresManualQuote: boolean;
  inStock: boolean;
  description: string;
  badge?: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
