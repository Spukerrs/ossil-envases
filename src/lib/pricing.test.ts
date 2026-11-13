import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeProductPricing, getRecommendedQtyForClientType } from "./pricing";

const sampleProduct = {
  basePrice: 1000,
  requiresManualQuote: false,
  priceTiers: [
    { minQty: 1, unitPrice: 1000, discountPct: 0 },
    { minQty: 10, unitPrice: 890, discountPct: 11 },
    { minQty: 25, unitPrice: 830, discountPct: 17 },
    { minQty: 50, unitPrice: 770, discountPct: 23 },
    { minQty: 100, unitPrice: 720, discountPct: 28 },
  ],
};

describe("pricing helpers", () => {
  it("devuelve 1 unidad por defecto para cuentas minoristas o invitados", () => {
    assert.equal(getRecommendedQtyForClientType(sampleProduct, undefined), 1);
    assert.equal(getRecommendedQtyForClientType(sampleProduct, "minorista"), 1);
  });

  it("devuelve el pack B2B de 25 unidades por defecto para cuentas mayoristas", () => {
    assert.equal(getRecommendedQtyForClientType(sampleProduct, "mayorista"), 25);
  });

  it("devuelve 1 unidad para productos con cotización manual aunque sea mayorista", () => {
    assert.equal(
      getRecommendedQtyForClientType(
        { ...sampleProduct, requiresManualQuote: true },
        "mayorista",
      ),
      1,
    );
  });

  it("aplica la escala máxima (-28%) cuando el usuario ingresa 1000 unidades", () => {
    const summary = computeProductPricing(sampleProduct, 1000);
    assert.equal(summary.unitNetPrice, 720);
    assert.equal(summary.discountPct, 28);
    assert.equal(summary.subtotalNeto, 720000);
    assert.equal(summary.ivaAmount, 151200);
    assert.equal(summary.totalConIva, 871200);
    assert.equal(summary.savingsNeto, 280000);
  });

  it("calcula precio final minorista c/IVA para 1 unidad", () => {
    const summary = computeProductPricing(sampleProduct, 1);
    assert.equal(summary.unitNetPrice, 1000);
    assert.equal(summary.unitPriceWithIva, 1210);
    assert.equal(summary.totalConIva, 1210);
    assert.equal(summary.savingsNeto, 0);
  });
});
