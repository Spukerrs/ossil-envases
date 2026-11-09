import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatCapacityBadge, getCapacityEquivalence } from "./capacity.ts";

describe("getCapacityEquivalence", () => {
  const testCases = [
    { input: "10 cc", expectedMl: "10 ml", expectedLiters: "0,01 L", isVolume: true },
    { input: "12 cc", expectedMl: "12 ml", expectedLiters: "0,012 L", isVolume: true },
    { input: "30 cc", expectedMl: "30 ml", expectedLiters: "0,03 L", isVolume: true },
    { input: "100 cc", expectedMl: "100 ml", expectedLiters: "0,1 L", isVolume: true },
    { input: "250 cc", expectedMl: "250 ml", expectedLiters: "0,25 L", isVolume: true },
    { input: "500 cc", expectedMl: "500 ml", expectedLiters: "0,5 L", isVolume: true },
    { input: "1000 cc", expectedMl: "1.000 ml", expectedLiters: "1 L", isVolume: true },
    { input: "1400 cc", expectedMl: "1.400 ml", expectedLiters: "1,4 L", isVolume: true },
    { input: "2000 cc", expectedMl: "2.000 ml", expectedLiters: "2 L", isVolume: true },
    { input: "5000 cc", expectedMl: "5.000 ml", expectedLiters: "5 L", isVolume: true },
    { input: "12 Litros", expectedMl: "12.000 ml", expectedLiters: "12 L", isVolume: true },
    { input: "16 Litros", expectedMl: "16.000 ml", expectedLiters: "16 L", isVolume: true },
    { input: "250 gr", expectedMl: "250 gr", expectedLiters: "250 gr", isVolume: false },
    {
      input: "Rosca 24/410",
      expectedMl: "Rosca 24/410",
      expectedLiters: "Rosca 24/410",
      isVolume: false,
    },
  ];

  for (const { input, expectedMl, expectedLiters, isVolume } of testCases) {
    it(`debe procesar correctamente "${input}"`, () => {
      const res = getCapacityEquivalence(input);
      assert.ok(res, `Resultado no debe ser nulo para ${input}`);
      assert.equal(res.isVolume, isVolume, `isVolume no coincide para ${input}`);
      if (isVolume) {
        assert.equal(res.mlText, expectedMl, `mlText no coincide para ${input}`);
        assert.equal(res.litersText, expectedLiters, `litersText no coincide para ${input}`);
      }
    });
  }

  it("debe retornar null para valores vacíos o nulos", () => {
    assert.equal(getCapacityEquivalence(null), null);
    assert.equal(getCapacityEquivalence(undefined), null);
    assert.equal(getCapacityEquivalence(""), null);
  });

  it("debe generar badges legibles con formatCapacityBadge", () => {
    assert.equal(formatCapacityBadge("250 cc"), "250 cc (250 ml / 0,25 L)");
    assert.equal(formatCapacityBadge("1000 cc"), "1000 cc (1.000 ml / 1 L)");
    assert.equal(formatCapacityBadge("12 Litros"), "12.000 ml (12 L)");
    assert.equal(formatCapacityBadge("250 gr"), "250 gr");
    assert.equal(formatCapacityBadge("Rosca 24/410"), "Rosca 24/410");
  });
});
