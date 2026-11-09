// Utilidad de ingesta y parseo inteligente de CSV / Excel para el módulo ERP de OSSIL Envases
// Soporta exportaciones nativas de Excel en español (punto y coma ';'), CSV estándar (coma ','),
// y pegado directo de celdas de Excel (tabulaciones '\t').

export interface CsvRowResult {
  sku: string;
  price: number;
  rawSku: string;
  rawPrice: string;
  rowNumber: number;
  error?: string;
}

export interface CsvParseSummary {
  delimiter: string;
  totalRows: number;
  validRows: CsvRowResult[];
  invalidRows: CsvRowResult[];
  detectedColumns: {
    skuIndex: number;
    priceIndex: number;
    nameIndex?: number;
    hasHeader: boolean;
  };
}

/**
 * Limpia y normaliza un número de precio que puede venir en formatos variados:
 * - "1450" -> 1450
 * - "1450,50" -> 1450.5 (decimal con coma argentino)
 * - "1.450" o "1.450,00" -> 1450 (separador de miles con punto)
 * - "$ 1.450,00" o "$1450" -> 1450 (con signo pesos)
 * - "1,450.00" -> 1450 (formato anglosajón)
 */
export function parsePriceNumber(raw: string): number {
  if (!raw) return Number.NaN;

  // Eliminar comillas, signos monetarios, espacios y palabras
  let clean = raw
    .replace(/["']/g, "")
    .replace(/[$ARSusd\s]/gi, "")
    .trim();

  if (!clean) return Number.NaN;

  // Caso 1: Formato con punto y coma (ej: 1.450,50 o 1450,50)
  // Si contiene coma y está en las últimas posiciones (decimal), reemplazar coma por punto
  if (clean.includes(",") && clean.includes(".")) {
    const lastComma = clean.lastIndexOf(",");
    const lastDot = clean.lastIndexOf(".");

    if (lastComma > lastDot) {
      // 1.450,50 -> miles con punto, decimal con coma
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else {
      // 1,450.50 -> miles con coma, decimal con punto
      clean = clean.replace(/,/g, "");
    }
  } else if (clean.includes(",")) {
    // Solo coma (ej: 1450,50 o 1,450)
    // Si hay una coma seguida de 2 dígitos al final, es decimal: 1450,50 -> 1450.50
    const parts = clean.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      clean = `${parts[0]}.${parts[1]}`;
    } else {
      // Si son miles: 1,450 -> 1450
      clean = clean.replace(/,/g, "");
    }
  } else if (clean.includes(".")) {
    // Solo punto (ej: 1.450 o 1.450.000 o 1450.50 o 1450.5)
    const parts = clean.split(".");
    if (parts.length > 2) {
      // Múltiples separadores de miles: 1.250.000 -> 1250000
      clean = clean.replace(/\./g, "");
    } else if (parts.length === 2) {
      // Si tiene exactamente 3 dígitos tras el punto (1.450, 12.500) -> miles en formato argentino/español
      if (parts[1].length === 3) {
        clean = clean.replace(/\./g, "");
      }
      // Si tiene 1 o 2 dígitos tras el punto (1450.5, 1450.50) -> se conserva como decimal estándar
    }
  }

  const num = Number.parseFloat(clean);
  return Number.isNaN(num) ? Number.NaN : num;
}

/**
 * Detecta el delimitador más probable en el texto CSV: ';', ',', o '\t'
 */
export function detectDelimiter(text: string): string {
  // Limpiar posibles BOM de UTF-8 de Excel
  const sample = text
    .replace(/^\uFEFF/, "")
    .split("\n")
    .slice(0, 5)
    .join("\n");

  const semicolons = (sample.match(/;/g) || []).length;
  const commas = (sample.match(/,/g) || []).length;
  const tabs = (sample.match(/\t/g) || []).length;

  if (tabs > semicolons && tabs > commas) return "\t";
  if (semicolons >= commas && semicolons > 0) return ";";
  return ",";
}

/**
 * Parsea una línea respetando comillas CSV
 */
function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      insideQuotes = !insideQuotes;
    } else if (char === delimiter && !insideQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/^["']|["']$/g, ""));
  return result;
}

/**
 * Parsea un texto CSV completo exportado desde Excel o pegado desde el portapapeles.
 */
export function parseExcelCsv(csvContent: string): CsvParseSummary {
  // Eliminar BOM de Excel si existe
  const cleanContent = csvContent.replace(/^\uFEFF/, "").trim();
  const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return {
      delimiter: ",",
      totalRows: 0,
      validRows: [],
      invalidRows: [],
      detectedColumns: { skuIndex: 0, priceIndex: 1, hasHeader: false },
    };
  }

  const delimiter = detectDelimiter(cleanContent);
  const headerCols = splitCsvLine(lines[0], delimiter).map((c) => c.toLowerCase().trim());

  // Detectar encabezados por nombre
  let skuIndex = -1;
  let priceIndex = -1;
  let nameIndex: number | undefined;

  const skuAliases = ["sku", "codigo", "código", "cod", "articulo", "artículo", "id"];
  const priceAliases = [
    "nuevopreciobase",
    "nuevoprecio",
    "preciobase",
    "precio_base",
    "precio",
    "p.venta",
    "p_venta",
    "unitario",
    "costo",
    "importe",
    "precio lista",
    "preciolista",
  ];
  const nameAliases = ["nombre", "producto", "descripcion", "descripción", "detalle"];

  for (let i = 0; i < headerCols.length; i++) {
    const col = headerCols[i].replace(/[^a-z0-9áéíóú]/g, "");
    if (skuIndex === -1 && skuAliases.some((alias) => col.includes(alias))) {
      skuIndex = i;
    }
    if (priceIndex === -1 && priceAliases.some((alias) => col.includes(alias))) {
      priceIndex = i;
    }
    if (nameIndex === undefined && nameAliases.some((alias) => col.includes(alias))) {
      nameIndex = i;
    }
  }

  const hasHeader = skuIndex !== -1 || priceIndex !== -1;

  // Fallbacks si no se identificaron nombres de columna
  if (skuIndex === -1) skuIndex = 0;
  if (priceIndex === -1) {
    // Si la columna 0 es SKU y la columna 1 parece texto de nombre, el precio puede estar en la 2
    if (headerCols.length > 2 && nameIndex === 1) {
      priceIndex = 2;
    } else {
      priceIndex = headerCols.length > 1 ? 1 : 0;
    }
  }

  const startRow = hasHeader ? 1 : 0;
  const validRows: CsvRowResult[] = [];
  const invalidRows: CsvRowResult[] = [];

  for (let i = startRow; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const rowNumber = i + 1;
    const cols = splitCsvLine(rawLine, delimiter);

    const rawSku = cols[skuIndex] || "";
    const rawPrice = cols[priceIndex] || "";

    const skuClean = rawSku.trim();
    const price = parsePriceNumber(rawPrice);

    if (!skuClean) {
      invalidRows.push({
        sku: "",
        price: 0,
        rawSku,
        rawPrice,
        rowNumber,
        error: "SKU vacío o ausente",
      });
      continue;
    }

    if (Number.isNaN(price) || price < 0) {
      invalidRows.push({
        sku: skuClean,
        price: 0,
        rawSku,
        rawPrice,
        rowNumber,
        error: `Precio inválido: "${rawPrice}"`,
      });
      continue;
    }

    validRows.push({
      sku: skuClean,
      price,
      rawSku,
      rawPrice,
      rowNumber,
    });
  }

  return {
    delimiter,
    totalRows: lines.length - startRow,
    validRows,
    invalidRows,
    detectedColumns: {
      skuIndex,
      priceIndex,
      nameIndex,
      hasHeader,
    },
  };
}

/**
 * Genera el contenido de una plantilla CSV ideal para abrir en Excel en Argentina (con punto y coma)
 */
export function generateExcelTemplateCsv(): string {
  return [
    "SKU;NuevoPrecioBase;NombreReferencia",
    "HV-200-24410;790;Botella Heaven 200cc PET",
    "EQ-30-SAT;1450;Frasco Equatone 30cc Satinado",
    "MED-GOT-30;1250;Gotero Vidrio Ambar 30cc",
    "VEL-CER-SOJ-1K;7500;Cera de Soja Pura 1000gr",
    "TB-50-BR18;1680;Frasco Tubo Liso 50cc B/R 18",
  ].join("\r\n");
}
