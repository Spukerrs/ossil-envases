export type BusinessUnit = "ENVASES" | "HOME";

export type Category =
  | "todos"
  | "cosmetica"
  | "cosmetica-botellas"
  | "cosmetica-potes"
  | "cosmetica-bidones"
  | "perfumeria"
  | "medicinal"
  | "alimenticio"
  | "accesorios"
  | "accesorios-cierres"
  | "velas"
  | "velas-difusores"
  | "bazar"
  | "bazar-cocina"
  | "decoracion-hogar";

export type Material =
  | "Vidrio"
  | "PET"
  | "PEAD"
  | "Acrílico"
  | "Aluminio"
  | "PVC"
  | "Insumos"
  | "Acero/Metal"
  | "Mármol/Cerámica"
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
  | "B/AX 70"
  | "B/AX 63"
  | "Corcho"
  | "Canilla"
  | "N/A"
  | string;

export interface PriceTier {
  minQty: number;
  unitPrice: number;
  discountPct: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  cuit?: string;
  clientType: "minorista" | "mayorista";
  phone?: string;
  city?: string;
  role?: "customer" | "admin";
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  businessUnit: BusinessUnit;
  category: Category;
  categoryLabel: string;
  subcategory?: string;
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
  applications?: string[];
  dimensions?: string;
  features?: string[];
  compatibleAccessories?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
