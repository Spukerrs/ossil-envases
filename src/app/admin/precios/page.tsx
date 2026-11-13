"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Info,
  Lock,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Upload,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Admin2FAGuard } from "@/components/Admin2FAGuard";
import { PRODUCTS_SEED } from "@/data/catalog";
import {
  type CsvParseSummary,
  generateExcelTemplateCsv,
  parseExcelCsv,
} from "@/lib/csvPriceParser";
import { useAuthStore } from "@/store/useAuthStore";

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
    "SKU;NuevoPrecioBase;NombreReferencia\nHV-200-24410;790;Botella Heaven 200cc PET\nEQ-30-SAT;1450;Frasco Equatone 30cc Satinado\nTB-50-BR18;1680;Frasco Tubo Liso 50cc\nMED-GOT-30;1250;Gotero Vidrio Ambar 30cc\nVEL-CER-SOJ-1K;7500;Cera de Soja Pura 1000gr",
  );
  const [percentageIncrease, setPercentageIncrease] = useState<number>(12);
  const [targetCategory, setTargetCategory] = useState<string>("ALL");
  const [previewList, setPreviewList] = useState<PriceChangePreview[]>([]);
  const [parseSummary, setParseSummary] = useState<CsvParseSummary | null>(null);
  const [unmatchedSkus, setUnmatchedSkus] = useState<string[]>([]);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Procesar cadena CSV con detección inteligente de Excel
  const processCsvContent = (content: string) => {
    const summary = parseExcelCsv(content);
    setParseSummary(summary);

    const previews: PriceChangePreview[] = [];
    const unmatched: string[] = [];

    for (const row of summary.validRows) {
      const existing = PRODUCTS_SEED.find((p) => p.sku.toLowerCase() === row.sku.toLowerCase());

      if (existing) {
        const pctChange = Math.round(((row.price - existing.basePrice) / existing.basePrice) * 100);
        previews.push({
          sku: existing.sku,
          name: existing.name,
          material: existing.material,
          currentBasePrice: existing.basePrice,
          newBasePrice: row.price,
          pctChange,
          newTiers: calculateTiers(row.price),
        });
      } else {
        unmatched.push(row.sku);
      }
    }

    setUnmatchedSkus(unmatched);

    if (previews.length === 0) {
      toast.error("No se encontraron coincidencias de SKU en el catálogo actual", {
        description:
          unmatched.length > 0
            ? `Revisá los SKUs ingresados: ${unmatched.slice(0, 3).join(", ")}...`
            : "Verificá que el archivo tenga datos.",
      });
      return;
    }

    setPreviewList(previews);
    setIsApplied(false);

    const delimiterName =
      summary.delimiter === ";"
        ? "Punto y coma (;)"
        : summary.delimiter === "\t"
          ? "Tabulaciones (Excel copiado)"
          : "Coma (,)";

    toast.success(`CSV procesado: ${previews.length} productos listos para actualizar`, {
      description: `Delimitador: ${delimiterName} • Encabezados: ${summary.detectedColumns.hasHeader ? "Detectados" : "Predeterminados"}`,
    });
  };

  const handleProcessCsv = () => {
    processCsvContent(csvText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvText(text);
        processCsvContent(text);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDownloadTemplate = () => {
    const content = generateExcelTemplateCsv();
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla-precios-ossil.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Plantilla descargada: plantilla-precios-ossil.csv", {
      description: "Abrila en Microsoft Excel, ajustá tus precios y guardala.",
    });
  };

  const handleApplyChanges = () => {
    setIsApplied(true);
    toast.success("¡Precios aplicados exitosamente a la base de datos!", {
      description: `Se actualizaron ${previewList.length} artículos con recálculo automático de escalas de volumen.`,
    });
  };

  const user = useAuthStore((s) => s.user);
  const loginDemo = useAuthStore((s) => s.loginDemo);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#E6E2DC] shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#9E734E] mx-auto shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF]">
              Acceso Restringido • Solo Administradores
            </span>
            <h1 className="text-xl font-black text-[#141413]">Módulo ERP Exclusivo</h1>
            <p className="text-xs text-[#66615B] leading-relaxed">
              El panel de actualización de precios e ingesta masiva está reservado únicamente para
              usuarios con permisos administrativos verificados. Podés probarlo activando el perfil
              demo de administrador o volver a la tienda.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                loginDemo("admin");
                toast.success("Perfil Demo Administrador activado.");
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Activar Perfil Demo Administrador
            </button>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-white text-xs font-bold transition-all shadow-md active:scale-98"
            >
              Volver a la Tienda Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Admin2FAGuard>
      <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col justify-between">
        <div>
          {/* Cabecera del Módulo ERP */}
          <header className="bg-[#FFFFFF] border-b border-[#E6E2DC]">
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
                    Ideal cuando una fábrica (ej: Cristalería o Plásticos) envía un incremento
                    directo de lista.
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

                {/* Panel de Opciones 2: Carga de CSV y Conexión con Excel */}
                <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-[#9E734E]" />
                      <h3 className="text-sm font-bold text-[#141413]">
                        Opción B: Importar CSV desde Excel / ERP
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#9E734E] hover:text-[#835C3A] bg-[#FAF8F5] hover:bg-[#F0ECE4] border border-[#E6E2DC] rounded-lg transition-colors cursor-pointer"
                      title="Descargar archivo modelo compatible con Excel en Argentina"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Plantilla Excel</span>
                    </button>
                  </div>

                  {/* Cómo acomodar las columnas en Excel */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#141413] text-[11px] uppercase tracking-wider text-[#9E734E]">
                      <Info className="w-3.5 h-3.5 text-[#9E734E]" />
                      <span>Cómo acomodar las columnas en tu Excel:</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center">
                      <div className="p-1.5 rounded-lg bg-white border border-[#E0D9CE]">
                        <span className="font-bold text-[#141413] block">Columna A</span>
                        <span className="text-[#9E734E]">SKU / Código</span>
                        <span className="text-[9px] text-[#8C827A] block">(Obligatorio)</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-[#E0D9CE]">
                        <span className="font-bold text-[#141413] block">Columna B</span>
                        <span className="text-[#9E734E]">NuevoPrecioBase</span>
                        <span className="text-[9px] text-[#8C827A] block">(Obligatorio)</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-[#E0D9CE]">
                        <span className="font-bold text-[#141413] block">Columna C</span>
                        <span className="text-[#66615B]">Nombre / Detalle</span>
                        <span className="text-[9px] text-[#8C827A] block">(Opcional)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#66615B] leading-relaxed pt-1">
                      💡 <strong>Tip Excel Argentina:</strong> Guardá como{" "}
                      <em>CSV (delimitado por comas) (*.csv)</em>. El sistema auto-detecta punto y
                      coma (<code>;</code>), comas (<code>,</code>), tabulaciones de celdas copiadas
                      (<code>Ctrl+C</code>), elimina signos pesos (<code>$</code>) y convierte
                      decimales con coma (<code>1450,50</code>) automáticamente.
                    </p>
                  </div>

                  {/* Acciones de carga: Archivo o Pegado */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="csv-textarea" className="text-xs font-bold text-[#141413]">
                        Pegar datos de Excel o escribir:
                      </label>

                      {/* Input de archivo oculto con botón estilizado */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,text/csv,text/plain"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141413] hover:text-[#9E734E] cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#9E734E]" />
                        <span>Subir archivo .CSV</span>
                      </button>
                    </div>

                    <textarea
                      id="csv-textarea"
                      rows={5}
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="SKU;NuevoPrecioBase&#10;HV-200-24410;790&#10;EQ-30-SAT;1450"
                      className="w-full p-3 font-mono text-xs rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                    />
                  </div>

                  {/* Estado de detección de parseo */}
                  {parseSummary && (
                    <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] text-[#66615B]">
                      <span>
                        Delimitador:{" "}
                        <strong className="text-[#141413]">
                          {parseSummary.delimiter === ";"
                            ? "Punto y coma (;)"
                            : parseSummary.delimiter === "\t"
                              ? "Tabulaciones (Excel copiado)"
                              : "Coma (,)"}
                        </strong>
                      </span>
                      <span>
                        Válidos:{" "}
                        <strong className="text-emerald-700">
                          {parseSummary.validRows.length}
                        </strong>
                      </span>
                    </div>
                  )}

                  {/* Advertencias de filas inválidas o SKUs no encontrados */}
                  {parseSummary && parseSummary.invalidRows.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {parseSummary.invalidRows.length} fila(s) con errores ignoradas:
                        </span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-amber-800 font-mono">
                        {parseSummary.invalidRows.slice(0, 3).map((r) => (
                          <li key={r.rowNumber}>
                            Fila {r.rowNumber}: {r.error} ({r.rawSku || "sin SKU"})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {unmatchedSkus.length > 0 && (
                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-[#57534E] space-y-1">
                      <span className="font-bold block">
                        ℹ️ {unmatchedSkus.length} SKU(s) no coinciden con productos del catálogo:
                      </span>
                      <p className="font-mono text-[10px] text-[#8C827A] truncate">
                        {unmatchedSkus.join(", ")}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProcessCsv}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Procesar y Comparar Precios</span>
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
                        Seleccioná un porcentaje a la izquierda o hacé clic en "Procesar Planilla
                        CSV" para ver la comparativa.
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
    </Admin2FAGuard>
  );
}
