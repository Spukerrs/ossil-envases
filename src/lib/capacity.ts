// Utilidad para cálculo y formateo de equivalencias de capacidad (cc, ml, L)
// Cumple con la directriz de OSSIL Envases: mostrar equivalencia en mililitros y en litros.

export interface CapacityEquivalence {
  original: string;
  isVolume: boolean;
  ml: number;
  mlText: string;
  liters: number;
  litersText: string;
  short: string;
  full: string;
}

/**
 * Parsea una cadena de capacidad (ej: "250 cc", "1000 cc", "12 Litros", "5 L")
 * y calcula su valor exacto en mililitros y litros.
 * Si es una unidad que no es de volumen (ej: "250 gr", "50 u.", "Rosca 24/410"),
 * retorna isVolume: false.
 */
export function getCapacityEquivalence(
  capacityStr?: string | null,
  capacityValue?: number,
): CapacityEquivalence | null {
  if (!capacityStr) return null;

  const trimmed = capacityStr.trim();
  const lower = trimmed.toLowerCase();

  // Descartar explícitamente unidades que no son de volumen líquido
  if (
    lower.includes("gr") ||
    lower.includes("gramos") ||
    lower.endsWith("g") ||
    lower.includes("u.") ||
    lower.includes("unid") ||
    lower.includes("cavidad") ||
    lower.includes("cm") ||
    lower.includes("mm") ||
    lower.includes("rosca") ||
    lower.includes("calabaza")
  ) {
    return {
      original: trimmed,
      isVolume: false,
      ml: 0,
      mlText: trimmed,
      liters: 0,
      litersText: trimmed,
      short: trimmed,
      full: trimmed,
    };
  }

  let ml = 0;

  // Caso 1: Especificado en Litros (ej: "12 Litros", "5 L", "2.5 lts")
  const literMatch = lower.match(/([\d.,]+)\s*(litros?|lts?|l\b)/i);
  if (literMatch) {
    const rawNum = parseFloat(literMatch[1].replace(",", "."));
    if (!Number.isNaN(rawNum) && rawNum > 0) {
      ml = Math.round(rawNum * 1000);
    }
  }

  // Caso 2: Especificado en cc o ml (ej: "250 cc", "500 ml")
  if (ml === 0) {
    const ccMatch = lower.match(/([\d.,]+)\s*(cc|cm3|ml)\b/i);
    if (ccMatch) {
      const rawNum = parseFloat(ccMatch[1].replace(",", "."));
      if (!Number.isNaN(rawNum) && rawNum > 0) {
        ml = Math.round(rawNum);
      }
    }
  }

  // Caso 3: Fallback usando capacityValue si está definido y no es en gramos
  if (ml === 0 && capacityValue && capacityValue > 0) {
    ml = Math.round(capacityValue);
  }

  // Si no pudimos determinar un volumen válido
  if (ml <= 0) {
    return {
      original: trimmed,
      isVolume: false,
      ml: 0,
      mlText: trimmed,
      liters: 0,
      litersText: trimmed,
      short: trimmed,
      full: trimmed,
    };
  }

  const liters = ml / 1000;

  // Formateo de mililitros
  const mlFormatted = ml >= 1000 ? `${ml.toLocaleString("es-AR")} ml` : `${ml} ml`;

  // Formateo de litros:
  // Si es entero (ej: 1, 2, 5, 10, 20) -> "1 L", "5 L"
  // Si tiene decimales (ej: 0.25, 0.5, 1.5, 0.03) -> "0,25 L" o "0.25 L"
  let litersFormatted: string;
  if (Number.isInteger(liters)) {
    litersFormatted = `${liters} L`;
  } else {
    // Redondear a un máximo de 3 decimales significativos
    const str = parseFloat(liters.toFixed(3)).toString().replace(".", ",");
    litersFormatted = `${str} L`;
  }

  return {
    original: trimmed,
    isVolume: true,
    ml,
    mlText: mlFormatted,
    liters,
    litersText: litersFormatted,
    // Formato conciso para tarjetas y píldoras
    short: `${mlFormatted} (${litersFormatted})`,
    // Formato completo para ficha técnica
    full: `${trimmed} (${mlFormatted} / ${litersFormatted})`,
  };
}

/**
 * Retorna la etiqueta para badges en tarjetas de catálogo:
 * Si es volumen: "250 cc • 250 ml (0,25 L)" o "250 ml (0,25 L)"
 * Si no es volumen: mantiene la original (ej: "250 gr", "Rosca 24/410")
 */
export function formatCapacityBadge(capacityStr?: string | null, capacityValue?: number): string {
  const equiv = getCapacityEquivalence(capacityStr, capacityValue);
  if (!equiv?.isVolume) {
    return capacityStr || "";
  }
  // Si el original ya era "250 cc", sumamos los equivalentes
  if (equiv.original.toLowerCase().includes("cc")) {
    return `${equiv.original} (${equiv.mlText} / ${equiv.litersText})`;
  }
  return equiv.short;
}
