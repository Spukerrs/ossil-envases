import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  detectDelimiter,
  generateExcelTemplateCsv,
  parseExcelCsv,
  parsePriceNumber,
} from "./csvPriceParser.ts";

describe("parsePriceNumber", () => {
  it("debe parsear números enteros simples", () => {
    assert.equal(parsePriceNumber("1450"), 1450);
    assert.equal(parsePriceNumber("790"), 790);
    assert.equal(parsePriceNumber("0"), 0);
  });

  it("debe parsear decimales con coma (estilo Argentina/Excel)", () => {
    assert.equal(parsePriceNumber("1450,50"), 1450.5);
    assert.equal(parsePriceNumber("790,00"), 790);
    assert.equal(parsePriceNumber("12,5"), 12.5);
  });

  it("debe parsear separador de miles con punto (estilo Argentina/Excel)", () => {
    assert.equal(parsePriceNumber("1.450"), 1450);
    assert.equal(parsePriceNumber("12.500"), 12500);
    assert.equal(parsePriceNumber("1.450,50"), 1450.5);
    assert.equal(parsePriceNumber("1.450,00"), 1450);
    assert.equal(parsePriceNumber("1.250.000"), 1250000);
  });

  it("debe parsear formato anglosajón (miles con coma y decimal con punto)", () => {
    assert.equal(parsePriceNumber("1,450.00"), 1450);
    assert.equal(parsePriceNumber("1,450.50"), 1450.5);
    assert.equal(parsePriceNumber("1450.50"), 1450.5);
    assert.equal(parsePriceNumber("1450.5"), 1450.5);
  });

  it("debe limpiar signos monetarios ($ ARS USD) y espacios", () => {
    assert.equal(parsePriceNumber("$ 1.250"), 1250);
    assert.equal(parsePriceNumber("$790,00"), 790);
    assert.equal(parsePriceNumber("$ 1.450,50"), 1450.5);
    assert.equal(parsePriceNumber("  $  7.500  "), 7500);
    assert.equal(parsePriceNumber("1450 ARS"), 1450);
    assert.equal(parsePriceNumber("USD 25.50"), 25.5);
  });

  it("debe retornar NaN para valores inválidos o no numéricos", () => {
    assert.ok(Number.isNaN(parsePriceNumber("")));
    assert.ok(Number.isNaN(parsePriceNumber("   ")));
    assert.ok(Number.isNaN(parsePriceNumber("consultar")));
    assert.ok(Number.isNaN(parsePriceNumber("N/A")));
    assert.ok(Number.isNaN(parsePriceNumber("$")));
  });
});

describe("detectDelimiter", () => {
  it("debe detectar punto y coma ';' en CSVs de Excel en español", () => {
    const csv = "SKU;NuevoPrecioBase;Nombre\nHV-200;1450;Botella";
    assert.equal(detectDelimiter(csv), ";");
  });

  it("debe detectar coma ',' en CSVs estándar en inglés", () => {
    const csv = "SKU,Precio,Nombre\nHV-200,1450,Botella";
    assert.equal(detectDelimiter(csv), ",");
  });

  it("debe detectar tabulación '\\t' en datos copiados de celdas de Excel", () => {
    const tsv = "SKU\tNuevoPrecioBase\tNombre\nHV-200\t1450\tBotella";
    assert.equal(detectDelimiter(tsv), "\t");
  });

  it("debe ignorar el BOM de UTF-8 al detectar delimitadores", () => {
    const csvWithBom = "\uFEFFSKU;NuevoPrecioBase;Nombre\nHV-200;1450;Botella";
    assert.equal(detectDelimiter(csvWithBom), ";");
  });
});

describe("parseExcelCsv", () => {
  it("1. Exportación típica de Excel en Argentina (separador ';' con comas decimales '1450,50' y miles '1.450')", () => {
    const csv = [
      "SKU;NuevoPrecioBase;NombreReferencia",
      "HV-200-24410;1450,50;Botella Heaven 200cc PET",
      "EQ-30-SAT;1.450;Frasco Equatone 30cc Satinado",
      "MED-GOT-30;1.450,00;Gotero Vidrio Ambar 30cc",
      "VEL-CER-SOJ-1K;7500;Cera de Soja Pura 1000gr",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.delimiter, ";");
    assert.equal(result.totalRows, 4);
    assert.equal(result.validRows.length, 4);
    assert.equal(result.invalidRows.length, 0);
    assert.equal(result.detectedColumns.hasHeader, true);
    assert.equal(result.detectedColumns.skuIndex, 0);
    assert.equal(result.detectedColumns.priceIndex, 1);
    assert.equal(result.detectedColumns.nameIndex, 2);

    assert.deepEqual(result.validRows[0], {
      sku: "HV-200-24410",
      price: 1450.5,
      rawSku: "HV-200-24410",
      rawPrice: "1450,50",
      rowNumber: 2,
    });
    assert.equal(result.validRows[1].sku, "EQ-30-SAT");
    assert.equal(result.validRows[1].price, 1450);
    assert.equal(result.validRows[2].sku, "MED-GOT-30");
    assert.equal(result.validRows[2].price, 1450);
    assert.equal(result.validRows[3].sku, "VEL-CER-SOJ-1K");
    assert.equal(result.validRows[3].price, 7500);
  });

  it("2. Exportación con BOM de UTF-8 (\\uFEFFSKU;NuevoPrecioBase...)", () => {
    const csvWithBom =
      "\uFEFFSKU;NuevoPrecioBase;NombreReferencia\n" +
      "HV-200-24410;790;Botella Heaven 200cc PET\n" +
      "EQ-30-SAT;1450;Frasco Equatone 30cc Satinado";

    const result = parseExcelCsv(csvWithBom);

    assert.equal(result.delimiter, ";");
    assert.equal(result.detectedColumns.hasHeader, true);
    assert.equal(result.detectedColumns.skuIndex, 0);
    assert.equal(result.validRows.length, 2);
    assert.equal(result.invalidRows.length, 0);
    assert.equal(result.validRows[0].sku, "HV-200-24410");
    assert.equal(result.validRows[0].price, 790);
    assert.equal(result.validRows[1].sku, "EQ-30-SAT");
    assert.equal(result.validRows[1].price, 1450);
  });

  it("3. Pegado directo desde celdas de Excel (separado por tabulaciones '\\t')", () => {
    const tsv = [
      "SKU\tNuevoPrecioBase\tNombreReferencia",
      "HV-200-24410\t790,50\tBotella Heaven 200cc PET",
      "EQ-30-SAT\t1450\tFrasco Equatone 30cc Satinado",
    ].join("\n");

    const result = parseExcelCsv(tsv);

    assert.equal(result.delimiter, "\t");
    assert.equal(result.totalRows, 2);
    assert.equal(result.validRows.length, 2);
    assert.equal(result.validRows[0].sku, "HV-200-24410");
    assert.equal(result.validRows[0].price, 790.5);
    assert.equal(result.validRows[1].sku, "EQ-30-SAT");
    assert.equal(result.validRows[1].price, 1450);
  });

  it("4. CSV estándar en inglés (separado por comas ',')", () => {
    const csv = [
      "SKU,Precio,Nombre",
      "HV-200-24410,790.50,Botella Heaven 200cc PET",
      'EQ-30-SAT,"1,450.00",Frasco Equatone 30cc Satinado',
      "MED-GOT-30,1250,Gotero Vidrio Ambar 30cc",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.delimiter, ",");
    assert.equal(result.totalRows, 3);
    assert.equal(result.validRows.length, 3);
    assert.equal(result.invalidRows.length, 0);
    assert.equal(result.validRows[0].sku, "HV-200-24410");
    assert.equal(result.validRows[0].price, 790.5);
    assert.equal(result.validRows[1].sku, "EQ-30-SAT");
    assert.equal(result.validRows[1].price, 1450);
    assert.equal(result.validRows[2].sku, "MED-GOT-30");
    assert.equal(result.validRows[2].price, 1250);
  });

  it("5. Celdas con signo pesos o espacios ('$ 1.250', '$790,00')", () => {
    const csv = [
      "SKU;NuevoPrecioBase",
      "MED-GOT-30;$ 1.250",
      "HV-200;$790,00",
      "VEL-SOJ;  $ 7.500,50  ",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.validRows.length, 3);
    assert.equal(result.invalidRows.length, 0);
    assert.equal(result.validRows[0].sku, "MED-GOT-30");
    assert.equal(result.validRows[0].price, 1250);
    assert.equal(result.validRows[1].sku, "HV-200");
    assert.equal(result.validRows[1].price, 790);
    assert.equal(result.validRows[2].sku, "VEL-SOJ");
    assert.equal(result.validRows[2].price, 7500.5);
  });

  it("6. Columnas ordenadas diferente ('Nombre;SKU;PrecioBase')", () => {
    const csv = [
      "Nombre;SKU;PrecioBase",
      "Botella Heaven 200cc;HV-200-24410;790,00",
      "Frasco Equatone 30cc;EQ-30-SAT;1450,50",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.detectedColumns.nameIndex, 0);
    assert.equal(result.detectedColumns.skuIndex, 1);
    assert.equal(result.detectedColumns.priceIndex, 2);
    assert.equal(result.validRows.length, 2);
    assert.equal(result.validRows[0].sku, "HV-200-24410");
    assert.equal(result.validRows[0].price, 790);
    assert.equal(result.validRows[1].sku, "EQ-30-SAT");
    assert.equal(result.validRows[1].price, 1450.5);
  });

  it("6b. Columnas con encabezados alternativos ('Precio;Detalle;Código')", () => {
    const csv = [
      "Precio;Detalle;Código",
      "1250;Gotero Vidrio Ambar 30cc;MED-GOT-30",
      "7500;Cera de Soja 1000gr;VEL-CER-SOJ",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.detectedColumns.priceIndex, 0);
    assert.equal(result.detectedColumns.nameIndex, 1);
    assert.equal(result.detectedColumns.skuIndex, 2);
    assert.equal(result.validRows.length, 2);
    assert.equal(result.validRows[0].sku, "MED-GOT-30");
    assert.equal(result.validRows[0].price, 1250);
    assert.equal(result.validRows[1].sku, "VEL-CER-SOJ");
    assert.equal(result.validRows[1].price, 7500);
  });

  it("7. Detección de filas inválidas (SKU vacío, precio no numérico, negativos)", () => {
    const csv = [
      "SKU;NuevoPrecioBase;Nombre",
      ";1450;Fila sin SKU",
      "HV-200;consultar;Precio como texto",
      "EQ-30;-500;Precio negativo",
      "   ;   ;Fila de espacios en blanco",
      "OK-100;1250;Fila totalmente válida",
    ].join("\n");

    const result = parseExcelCsv(csv);

    assert.equal(result.totalRows, 5);
    assert.equal(result.validRows.length, 1);
    assert.equal(result.invalidRows.length, 4);

    assert.equal(result.validRows[0].sku, "OK-100");
    assert.equal(result.validRows[0].price, 1250);
    assert.equal(result.validRows[0].rowNumber, 6);

    // Fila 2: SKU vacío
    assert.equal(result.invalidRows[0].rowNumber, 2);
    assert.equal(result.invalidRows[0].error, "SKU vacío o ausente");

    // Fila 3: Precio texto
    assert.equal(result.invalidRows[1].rowNumber, 3);
    assert.equal(result.invalidRows[1].sku, "HV-200");
    assert.equal(result.invalidRows[1].error, 'Precio inválido: "consultar"');

    // Fila 4: Precio negativo
    assert.equal(result.invalidRows[2].rowNumber, 4);
    assert.equal(result.invalidRows[2].sku, "EQ-30");
    assert.equal(result.invalidRows[2].error, 'Precio inválido: "-500"');

    // Fila 5: Fila vacía
    assert.equal(result.invalidRows[3].rowNumber, 5);
    assert.equal(result.invalidRows[3].error, "SKU vacío o ausente");
  });

  it("debe procesar correctamente la plantilla generada por generateExcelTemplateCsv", () => {
    const template = generateExcelTemplateCsv();
    const result = parseExcelCsv(template);

    assert.equal(result.delimiter, ";");
    assert.equal(result.detectedColumns.hasHeader, true);
    assert.equal(result.validRows.length, 5);
    assert.equal(result.invalidRows.length, 0);
  });

  it("debe manejar texto vacío sin fallar", () => {
    const result = parseExcelCsv("");
    assert.equal(result.totalRows, 0);
    assert.equal(result.validRows.length, 0);
    assert.equal(result.invalidRows.length, 0);
  });
});
