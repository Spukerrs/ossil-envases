"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS_SEED } from "@/data/catalog";

interface PriceChangePreview {
  sku: string;
  name: string;
  material: string;
  currentBasePrice: number;
  newBasePrice: number;
  pctChange: number;
  newTiers: { minQty: number; unitPrice: number; discountPct: number }[];
}

export default function AdminPreciosPage() {
  const [csvText, setCsvText] = useState<string>(
    "SKU,NuevoPrecioBase\nEQ-30-SAT,1450\nTB-50-BR18,1680\nHV-200-24410,790\nMED-GOT-30,1250\nVEL-CER-SOJ-1K,7500",
  );
  const [percentageIncrease, setPercentageIncrease] = useState<number>(12);
  const [targetCategory, setTargetCategory] = useState<string>("ALL");
  const [previewList, setPreviewList] = useState<PriceChangePreview[]>([]);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  // Generar cálculo de escalas mayoristas automáticas basadas en un nuevo precio base
  const calculateTiers = (basePrice: number) => {
    return [
      { minQty: 1, unitPrice: basePrice, discountPct: 0 },
      { minQty: 10, unitPrice: Math.round(basePrice * 0.89), discountPct: 11 },
      { minQty: 25, unitPrice: Math.round(basePrice * 0.83), discountPct: 17 },
      { minQty: 50, unitPrice: Math.round(basePrice * 0.78), discountPct: 22 },
      { minQty: 100, unitPrice: Math.round(basePrice * 0.72), discountPct: 28 },
    ];
  };

  // Simular incremento porcentual por regla masiva
  const handleSimulatePercentage = () => {
    const factor = 1 + percentageIncrease / 100;
    const previews: PriceChangePreview[] = PRODUCTS_SEED.filter((p) => {
      if (targetCategory === "ALL") return true;
      if (targetCategory === "VIDRIO") return p.material === "Vidrio";
      if (targetCategory === "PET") return p.material === "PET";
      if (targetCategory === "VELAS") return p.businessUnit === "HOME";
      return true;
    }).map((p) => {
      const newBase = Math.round(p.basePrice * factor);
      return {
        sku: p.sku,
        name: p.name,
        material: p.material,
        currentBasePrice: p.basePrice,
        newBasePrice: newBase,
        pctChange: percentageIncrease,
        newTiers: calculateTiers(newBase),
      };
    });

    setPreviewList(previews);
    setIsApplied(false);
    toast.info(`Simulación calculada para ${previews.length} productos (+${percentageIncrease}%)`);
  };

  // Procesar CSV pegado
  const handleProcessCsv = () => {
    const lines = csvText.trim().split("\n");
    const previews: PriceChangePreview[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const [sku, rawPrice] = line.split(",").map((s) => s.trim());
      const newPrice = Number.parseFloat(rawPrice);

      const existing = PRODUCTS_SEED.find((p) => p.sku.toLowerCase() === sku.toLowerCase());

      if (existing && !Number.isNaN(newPrice)) {
        const pctChange = Math.round(((newPrice - existing.basePrice) / existing.basePrice) * 100);
        previews.push({
          sku: existing.sku,
          name: existing.name,
          material: existing.material,
          currentBasePrice: existing.basePrice,
          newBasePrice: newPrice,
          pctChange,
          newTiers: calculateTiers(newPrice),
        });
      }
    }

    if (previews.length === 0) {
      toast.error("No se encontraron coincidencias de SKU en el CSV cargado");
      return;
    }

    setPreviewList(previews);
    setIsApplied(false);
    toast.success(`CSV procesado: ${previews.length} productos listos para actualizar`);
  };

  const handleApplyChanges = () => {
    setIsApplied(true);
    toast.success("¡Precios aplicados exitosamente a la base de datos!", {
      description: `Se actualizaron ${previewList.length} artículos con recálculo automático de escalas de volumen.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col justify-between">
      <div>
        {/* Cabecera del Módulo ERP */}
        <header className="bg-[#FFFFFF] border-b border-[#E6E2DC] sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl text-[#66615B] hover:text-[#141413] hover:bg-[#FAF8F5] border border-[#E6E2DC] flex items-center gap-1.5 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Tienda</span>
              </Link>
              <div>
                <span className="font-mono text-xs uppercase font-bold text-[#9E734E] tracking-widest block">
                  Back-Office OSSIL Córdoba
                </span>
                <h1 className="text-xl font-black text-[#141413] tracking-tight">
                  Módulo de Ingesta Masiva de Precios (ERP Oncativo 69)
                </h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#66615B]">
                Conexión ERP: Sincronizada
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Explicación Operativa para Silvia y Oscar */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#9E734E]" />
                <h2 className="text-base font-bold text-[#141413]">
                  Solución a la Inflación y Actualización Ágil en Argentina
                </h2>
              </div>
              <p className="text-xs text-[#66615B] max-w-3xl leading-relaxed">
                Este módulo resuelve el problema más crítico de OSSIL:{" "}
                <strong>no tener que cambiar precios manualmente de a uno</strong>. Podés pegar el
                archivo CSV exportado desde el sistema de Oncativo o aplicar aumentos porcentuales
                en bloque. El sistema recalcula automáticamente las 4 escalas mayoristas (-11%,
                -17%, -22%, -28% OFF).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#141413] block">
                  1.316 Productos
                </span>
                <span className="text-[11px] text-[#8C827A]">Catálogo Vivo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Panel de Opciones 1: Aumento Masivo Porcentual */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#9E734E]" />
                  <h3 className="text-sm font-bold text-[#141413]">
                    Opción A: Ajuste Porcentual por Rubro
                  </h3>
                </div>
                <p className="text-xs text-[#66615B]">
                  Ideal cuando una fábrica (ej: Cristalería o Plásticos) envía un incremento directo
                  de lista.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label
                      htmlFor="target-category-select"
                      className="text-xs font-bold text-[#141413] block mb-1"
                    >
                      Rubro a afectar:
                    </label>
                    <select
                      id="target-category-select"
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] font-medium"
                    >
                      <option value="ALL">Todo el catálogo (1.316 artículos)</option>
                      <option value="VIDRIO">Solo Vidrio (Frascos y Botellas)</option>
                      <option value="PET">Solo Envases PET / Plástico</option>
                      <option value="VELAS">Solo Línea Velas y Difusores Home</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pct-increase-input"
                      className="text-xs font-bold text-[#141413] block mb-1"
                    >
                      Porcentaje de Aumento:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="pct-increase-input"
                        type="number"
                        value={percentageIncrease}
                        onChange={(e) =>
                          setPercentageIncrease(Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-24 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#E6E2DC] bg-[#FAF8F5]"
                      />
                      <span className="text-xs font-bold text-[#66615B]">%</span>
                      <div className="flex gap-1.5 ml-auto">
                        {[8, 12, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setPercentageIncrease(pct)}
                            className="px-2 py-1 text-xs font-mono font-bold rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#FAF8F5] cursor-pointer"
                          >
                            +{pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePercentage}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#141413] hover:bg-[#2B2B28] text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#9E734E]" />
                    <span>Simular Impacto en Escalas</span>
                  </button>
                </div>
              </div>

              {/* Panel de Opciones 2: Carga de CSV */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#9E734E]" />
                  <h3 className="text-sm font-bold text-[#141413]">
                    Opción B: Pegar CSV desde ERP Local
                  </h3>
                </div>
                <p className="text-xs text-[#66615B]">
                  Copia y pega las columnas <code>SKU,NuevoPrecioBase</code> generadas desde Excel.
                </p>

                <textarea
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                />

                <button
                  type="button"
                  onClick={handleProcessCsv}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Procesar Planilla CSV</span>
                </button>
              </div>
            </div>

            {/* Panel de Resultados y Tabla Comparativa */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F0ECE4]">
                  <div>
                    <h3 className="text-sm font-bold text-[#141413]">
                      Vista Previa de Cambios ({previewList.length} productos)
                    </h3>
                    <span className="text-xs text-[#66615B]">
                      Verificá el antes y después antes de aplicar a la tienda pública.
                    </span>
                  </div>

                  {previewList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleApplyChanges}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isApplied
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-[#141413] hover:bg-[#2B2B28] text-white active:scale-95 shadow-md"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>¡Actualizado en Vivo!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#9E734E]" />
                          <span>Confirmar e Ingestar a la Web</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {previewList.length === 0 ? (
                  <div className="py-16 text-center text-[#66615B] space-y-2">
                    <FileSpreadsheet className="w-10 h-10 text-[#D4CEBF] mx-auto" />
                    <p className="text-xs font-bold text-[#141413]">No hay simulación activa</p>
                    <p className="text-[11px] max-w-sm mx-auto">
                      Seleccioná un porcentaje a la izquierda o hacé clic en "Procesar Planilla CSV"
                      para ver la comparativa.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E6E2DC] text-[10px] font-mono text-[#8C827A] uppercase">
                          <th className="py-2.5 px-2">SKU</th>
                          <th className="py-2.5 px-2">Producto</th>
                          <th className="py-2.5 px-2 text-right">Anterior</th>
                          <th className="py-2.5 px-2 text-right">Nuevo Base</th>
                          <th className="py-2.5 px-2 text-center">Variación</th>
                          <th className="py-2.5 px-2 text-right">Mayorista 100u (-28%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0ECE4]">
                        {previewList.slice(0, 8).map((item) => {
                          const tier100 = item.newTiers.find((t) => t.minQty === 100);
                          return (
                            <tr key={item.sku} className="hover:bg-[#FAF8F5]">
                              <td className="py-3 px-2 font-mono font-bold text-[#9E734E]">
                                {item.sku}
                              </td>
                              <td className="py-3 px-2 font-medium text-[#141413] max-w-[160px] truncate">
                                {item.name}
                              </td>
                              <td className="py-3 px-2 font-mono text-right text-[#8C827A] line-through">
                                ${item.currentBasePrice.toLocaleString("es-AR")}
                              </td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-[#141413]">
                                ${item.newBasePrice.toLocaleString("es-AR")}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-100 text-amber-800">
                                  +{item.pctChange}%
                                </span>
                              </td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-emerald-800">
                                ${tier100?.unitPrice.toLocaleString("es-AR")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {previewList.length > 8 && (
                      <p className="text-[11px] text-[#8C827A] pt-3 text-center">
                        ... y {previewList.length - 8} productos más en esta simulación.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-[#FFFFFF] border-t border-[#E6E2DC] py-6 text-center text-xs text-[#8C827A]">
        <span>Panel Administrativo de Demostración • OSSIL Envases & Home Córdoba</span>
      </footer>
    </div>
  );
}
