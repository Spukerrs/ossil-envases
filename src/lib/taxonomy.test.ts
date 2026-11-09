import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Product } from "@/types/catalog";
import { PRODUCTS_SEED } from "../data/catalog";
import {
  FAMILIES_BY_UNIT,
  getContextualSubcategories,
  getProductFamily,
  matchesCapacityRange,
} from "./taxonomy";

describe("Taxonomy & Decoupled Filtering", () => {
  it("FAMILIES_BY_UNIT contains defined families for ENVASES and HOME", () => {
    assert.ok(FAMILIES_BY_UNIT.ENVASES.length > 3);
    assert.ok(FAMILIES_BY_UNIT.HOME.length > 2);

    const envasesIds = FAMILIES_BY_UNIT.ENVASES.map((f) => f.id);
    assert.ok(envasesIds.includes("TODAS"));
    assert.ok(envasesIds.includes("botellas"));
    assert.ok(envasesIds.includes("tapas-cierres"));
    assert.ok(envasesIds.includes("potes-frascos"));

    const homeIds = FAMILIES_BY_UNIT.HOME.map((f) => f.id);
    assert.ok(homeIds.includes("TODAS"));
    assert.ok(homeIds.includes("velas-difusores"));
    assert.ok(homeIds.includes("bazar-cocina"));
  });

  it("getProductFamily maps products to canonical families regardless of material", () => {
    const venecia = PRODUCTS_SEED.find((p) => p.name.toLowerCase().includes("venecia"));
    assert.ok(venecia);
    if (venecia) {
      assert.strictEqual(getProductFamily(venecia), "botellas");
    }

    const cera = PRODUCTS_SEED.find((p) => p.name.toLowerCase().includes("cera de soja"));
    assert.ok(cera);
    if (cera) {
      assert.strictEqual(getProductFamily(cera), "velas-difusores");
    }

    const spray = PRODUCTS_SEED.find((p) => p.name.toLowerCase().includes("spray"));
    assert.ok(spray);
    if (spray) {
      assert.strictEqual(getProductFamily(spray), "tapas-cierres");
    }
  });

  it("matchesCapacityRange correctly identifies volume thresholds", () => {
    const p30 = {
      id: "test-30",
      name: "Gotero 30cc",
      capacity: "30 cc",
      capacityValue: 30,
      businessUnit: "ENVASES",
      material: "Vidrio",
    } as unknown as Product;

    const p250 = {
      id: "test-250",
      name: "Botella 250cc",
      capacity: "250 cc",
      capacityValue: 250,
      businessUnit: "ENVASES",
      material: "PET",
    } as unknown as Product;

    const p5000 = {
      id: "test-5L",
      name: "Bidón 5 Litros",
      capacity: "5 L",
      capacityValue: 5000,
      businessUnit: "ENVASES",
      material: "PEAD",
    } as unknown as Product;

    // "TODAS"
    assert.strictEqual(matchesCapacityRange(p30, "TODAS"), true);
    assert.strictEqual(matchesCapacityRange(p250, "TODAS"), true);
    assert.strictEqual(matchesCapacityRange(p5000, "TODAS"), true);

    // "mini" (≤ 50 cc)
    assert.strictEqual(matchesCapacityRange(p30, "mini"), true);
    assert.strictEqual(matchesCapacityRange(p250, "mini"), false);

    // "medianos" (60 a 250 cc)
    assert.strictEqual(matchesCapacityRange(p30, "medianos"), false);
    assert.strictEqual(matchesCapacityRange(p250, "medianos"), true);

    // "industrial" (> 1 L)
    assert.strictEqual(matchesCapacityRange(p5000, "industrial"), true);
    assert.strictEqual(matchesCapacityRange(p250, "industrial"), false);
  });

  it("getContextualSubcategories returns empty array when activeFamily is TODAS", () => {
    const subs = getContextualSubcategories(PRODUCTS_SEED, "TODAS");
    assert.deepStrictEqual(subs, []);
  });

  it("getContextualSubcategories returns non-empty array for specific family without embedded material duplicates", () => {
    const subs = getContextualSubcategories(PRODUCTS_SEED, "botellas");
    assert.ok(subs.length > 0);
    assert.ok(!subs.includes("Botellas PET"));
    assert.ok(!subs.includes("Botellas Vidrio"));
  });
});
