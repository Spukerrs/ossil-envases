import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getStoreStatus } from "./storeHours";

describe("storeHours > getStoreStatus", () => {
  // Nota: Creamos fechas UTC que correspondan exactamente a la hora deseada en Córdoba (UTC-3)
  // Hora Córdoba = Hora UTC - 3h -> Hora UTC = Hora Córdoba + 3h

  it("Lunes antes de las 08:15 debe estar CERRADO y avisar que abre a las 08:15 hs", () => {
    // 2026-11-09 es un lunes. 08:10 hs Córdoba = 11:10 hs UTC
    const date = new Date(Date.UTC(2026, 10, 9, 11, 10, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, false);
    assert.strictEqual(status.statusLabel, "Cerrado Ahora");
    assert.ok(status.nextChangeText.includes("08:15 hs"));
  });

  it("Lunes a las 08:15 debe estar ABIERTO", () => {
    // 2026-11-09 lunes. 08:15 hs Córdoba = 11:15 hs UTC
    const date = new Date(Date.UTC(2026, 10, 9, 11, 15, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, true);
    assert.strictEqual(status.statusLabel, "Abierto Ahora");
    assert.ok(status.nextChangeText.includes("hasta las 17:15 hs"));
  });

  it("Martes a las 08:05 debe estar ABIERTO (abre a las 08:00 hs)", () => {
    // 2026-11-10 martes. 08:05 hs Córdoba = 11:05 hs UTC
    const date = new Date(Date.UTC(2026, 10, 10, 11, 5, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, true);
    assert.strictEqual(status.statusLabel, "Abierto Ahora");
  });

  it("Martes antes de las 08:00 debe estar CERRADO y avisar apertura a las 08:00 hs", () => {
    // 2026-11-10 martes. 07:45 hs Córdoba = 10:45 hs UTC
    const date = new Date(Date.UTC(2026, 10, 10, 10, 45, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, false);
    assert.ok(status.nextChangeText.includes("08:00 hs"));
  });

  it("Sábado por la tarde (15:00 hs) debe avisar apertura el lunes a las 08:15 hs", () => {
    // 2026-11-14 sábado. 15:00 hs Córdoba = 18:00 hs UTC
    const date = new Date(Date.UTC(2026, 10, 14, 18, 0, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, false);
    assert.ok(status.nextChangeText.includes("lunes a las 08:15 hs"));
  });

  it("Domingo debe estar CERRADO y avisar apertura el lunes a las 08:15 hs", () => {
    // 2026-11-15 domingo. 12:00 hs Córdoba = 15:00 hs UTC
    const date = new Date(Date.UTC(2026, 10, 15, 15, 0, 0));
    const status = getStoreStatus(date);
    assert.strictEqual(status.isOpen, false);
    assert.ok(status.nextChangeText.includes("lunes a las 08:15 hs"));
  });
});
