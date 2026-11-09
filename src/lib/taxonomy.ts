// Taxonomía desacoplada y normalizada para OSSIL Envases & OSSIL Home
// Separa estrictamente Familias de Producto, Materiales, Roscas y Rangos de Capacidad

import type { BusinessUnit, Product } from "@/types/catalog";

export interface CategoryFamily {
  id: string;
  label: string;
  icon: string;
  unit: BusinessUnit;
}

export interface CapacityFilterRange {
  id: string;
  label: string;
  shortLabel: string;
  min?: number;
  max?: number;
}

export const CAPACITY_RANGES: CapacityFilterRange[] = [
  { id: "TODAS", label: "Todas las capacidades", shortLabel: "Capacidad: Todas" },
  { id: "mini", label: "Mini / Muestras (hasta 50 cc)", shortLabel: "≤ 50 cc", max: 50 },
  {
    id: "medianos",
    label: "Medianos (60 cc a 250 cc)",
    shortLabel: "60 - 250 cc",
    min: 51,
    max: 250,
  },
  {
    id: "grandes",
    label: "Grandes (300 cc a 1.000 cc)",
    shortLabel: "300 - 1.000 cc",
    min: 251,
    max: 1000,
  },
  { id: "industrial", label: "Industrial / Bidones (+1 L)", shortLabel: "> 1 L", min: 1001 },
];

export const FAMILIES_BY_UNIT: Record<BusinessUnit, CategoryFamily[]> = {
  ENVASES: [
    { id: "TODAS", label: "Todos los Envases", icon: "📦", unit: "ENVASES" },
    { id: "botellas", label: "Botellas", icon: "🧴", unit: "ENVASES" },
    { id: "potes-frascos", label: "Potes y Frascos", icon: "🥣", unit: "ENVASES" },
    { id: "bidones-baldes", label: "Bidones y Baldes", icon: "🛢️", unit: "ENVASES" },
    { id: "tapas-cierres", label: "Tapas y Cierres", icon: "🔘", unit: "ENVASES" },
    { id: "insumos-accesorios", label: "Insumos y Accesorios", icon: "🧪", unit: "ENVASES" },
  ],
  HOME: [
    { id: "TODAS", label: "Todo OSSIL Home", icon: "🏡", unit: "HOME" },
    { id: "velas-difusores", label: "Velas y Difusores", icon: "🕯️", unit: "HOME" },
    { id: "bazar-cocina", label: "Bazar y Cocina", icon: "☕", unit: "HOME" },
    { id: "decoracion-organizacion", label: "Decoración y Organización", icon: "🛋️", unit: "HOME" },
  ],
};

export const THREAD_GROUPS = [
  {
    name: "Línea 410 (Estándar Cosmético)",
    threads: ["20/410", "24/410", "28/410"],
  },
  {
    name: "Línea 400 & 415 (Perfil Bajo y Fino)",
    threads: ["18/415", "28/400"],
  },
  {
    name: "Perfumería & Medicinal",
    threads: ["B/E 15", "B/R 18", "B/R 28"],
  },
  {
    name: "Boca Axial (Conservas)",
    threads: ["B/AX 70", "B/AX 63"],
  },
  {
    name: "Cierres Especiales",
    threads: ["Canilla", "Corcho"],
  },
];

/**
 * Asigna una familia canónica a un producto desacoplada de materiales
 */
export function getProductFamily(p: Product): string {
  const nameL = p.name.toLowerCase();

  if (p.businessUnit === "ENVASES") {
    // 1. Tapas y Cierres (Unifica Tapas, Corchos y Tapas, Válvulas, Bombas, Gatillos)
    if (
      p.category === "accesorios" ||
      p.category === "accesorios-cierres" ||
      nameL.includes("tapa") ||
      nameL.includes("válvula") ||
      nameL.includes("valvula") ||
      nameL.includes("bomba") ||
      nameL.includes("gatillo") ||
      nameL.includes("corcho") ||
      nameL.includes("inserto")
    ) {
      return "tapas-cierres";
    }

    // 2. Bidones y Baldes
    if (
      p.category === "cosmetica-bidones" ||
      nameL.includes("bidon") ||
      nameL.includes("bidón") ||
      nameL.includes("balde") ||
      nameL.includes("damajuana")
    ) {
      return "bidones-baldes";
    }

    // 3. Potes y Frascos
    if (
      p.category === "cosmetica-potes" ||
      p.category === "alimenticio" ||
      nameL.includes("pote") ||
      nameL.includes("frasco")
    ) {
      return "potes-frascos";
    }

    // 4. Insumos y Accesorios medicinales / laboratorio
    if (
      p.category === "medicinal" ||
      nameL.includes("gotero") ||
      nameL.includes("vial") ||
      nameL.includes("alcohol") ||
      nameL.includes("colirio")
    ) {
      return "insumos-accesorios";
    }

    // 5. Botellas
    if (
      p.category === "cosmetica-botellas" ||
      p.category === "perfumeria" ||
      nameL.includes("botella")
    ) {
      return "botellas";
    }

    return "insumos-accesorios";
  }

  // OSSIL HOME
  if (
    p.category === "velas" ||
    p.category === "velas-difusores" ||
    nameL.includes("cera") ||
    nameL.includes("pabilo") ||
    nameL.includes("esencia") ||
    nameL.includes("difusor") ||
    nameL.includes("molde")
  ) {
    return "velas-difusores";
  }

  if (
    p.category === "bazar" ||
    p.category === "bazar-cocina" ||
    nameL.includes("termo") ||
    nameL.includes("mate") ||
    nameL.includes("dispenser") ||
    nameL.includes("jarra") ||
    nameL.includes("vaso") ||
    nameL.includes("pava") ||
    nameL.includes("molinillo") ||
    nameL.includes("mortero")
  ) {
    return "bazar-cocina";
  }

  return "decoracion-organizacion";
}

/**
 * Evalúa si un producto pertenece a un rango de capacidad dado
 */
export function matchesCapacityRange(p: Product, rangeId: string): boolean {
  if (rangeId === "TODAS") return true;

  const range = CAPACITY_RANGES.find((r) => r.id === rangeId);
  if (!range) return true;

  // Obtener valor numérico de capacidad (en cc o ml o gramos)
  let val = p.capacityValue;
  if (!val || val <= 0) {
    const match = (p.capacity || "").match(/([\d.,]+)/);
    if (match) {
      val = parseFloat(match[1].replace(",", "."));
      if (p.capacity.toLowerCase().includes("l") && !p.capacity.toLowerCase().includes("ml")) {
        val *= 1000;
      }
    }
  }

  if (!val || val <= 0) return true; // Si no tiene volumen conocido, no se excluye arbitrariamente

  if (range.min !== undefined && val < range.min) return false;
  if (range.max !== undefined && val > range.max) return false;

  return true;
}

/**
 * Obtiene las subcategorías contextuales en memoria para la categoría padre activa
 * Si la categoría es "TODAS", retorna array vacío (cumple la regla de subcategorías condicionales)
 */
export function getContextualSubcategories(products: Product[], activeFamily: string): string[] {
  if (activeFamily === "TODAS") return [];

  const subcats = new Set<string>();

  for (const p of products) {
    const fam = getProductFamily(p);
    if (fam === activeFamily) {
      // Limpiar términos que tenían materiales incrustados
      let sub = p.subcategory || p.categoryLabel;
      // Normalizar nombres con material incrustado (ej: "Botellas PET" -> "Botellas Cilíndricas & Ovales")
      if (
        sub === "Botellas PET" ||
        sub === "Botellas PEAD" ||
        sub === "Botellas Vidrio" ||
        sub === "Botellas Aluminio"
      ) {
        sub = "Línea Standard & Cosmética";
      } else if (
        sub === "Potes Acrílico" ||
        sub === "Potes Plástico Varios" ||
        sub === "Potes Aluminio"
      ) {
        sub = "Potes Cosméticos";
      } else if (sub === "Corchos y Tapas" || sub === "Tapas") {
        sub = "Tapas a Rosca & Cierres";
      }
      if (sub) subcats.add(sub);
    }
  }

  return Array.from(subcats).sort();
}
