"use client";

import {
  CheckCircle2,
  ExternalLink,
  Layers,
  Package,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/QuantityStepper";
import { IVA_RATE } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import type { NeckThread, Product } from "@/types/catalog";

interface ThreadSpecInfo {
  diameterMm: string;
  standard: string;
  turns: string;
  sealType: string;
  summary: string;
}

const THREAD_SPECS: Record<string, ThreadSpecInfo> = {
  "18/415": {
    diameterMm: "18 mm",
    standard: "Norma GPI 415 (Cuello Alto)",
    turns: "2.0 vueltas de rosca profunda",
    sealType: "Junta EPE / Cono obturador anti-fuga",
    summary:
      "Cuello estilizado de faldón largo, estándar internacional para perfumería fina, sérums concentrados y válvulas atomizadoras de niebla fina.",
  },
  "20/410": {
    diameterMm: "20 mm",
    standard: "Norma GPI 410 (Paso Medio)",
    turns: "1.5 vueltas de ajuste continuo",
    sealType: "Liner espumado de polietileno",
    summary:
      "Boca versátil para envases cosméticos de 30 cc a 125 cc. Admite bombas cremeras dosificadoras, tapas flip-top y atomizadores.",
  },
  "24/410": {
    diameterMm: "24 mm",
    standard: "Norma GPI 410 (Estándar Cosmético)",
    turns: "1.5 vueltas continuas de alta fijación",
    sealType: "Guarnición interna estanca anti-goteo",
    summary:
      "La rosca más utilizada en cosmética capilar y corporal (100 cc a 500 cc). Compatible con bombas locioneras, válvulas spray, disk-top y gatillos mini.",
  },
  "28/400": {
    diameterMm: "28 mm",
    standard: "Norma GPI 400 (Cuello Bajo)",
    turns: "1.0 vuelta de cierre rápido",
    sealType: "Faja de seguridad / Precinto inviolable",
    summary:
      "Cuello ancho y robusto para botellas farmacéuticas, químicas y alimenticias. Fácil llenado y cierre seguro con precinto.",
  },
  "28/410": {
    diameterMm: "28 mm",
    standard: "Norma GPI 410 ( Servicio Pesado )",
    turns: "1.5 vueltas reforzadas",
    sealType: "Anillo de compresión para alta presión",
    summary:
      "Diseñada para soportar el torque de gatillos pulverizadores (triggers) y bombas dispensadoras de alto caudal en envases de 250 cc a 1.000 cc.",
  },
  "B/E 15": {
    diameterMm: "15 mm",
    standard: "Boca Engarce Perfumería (Crimp 15)",
    turns: "Fijación perimetral hermética (sin rosca)",
    sealType: "Virola de aluminio + junta elastomérica",
    summary:
      "Terminación de alta perfumería donde la válvula se engarza sobre el collarín del vidrio, impidiendo aperturas o evaporación de alcohol.",
  },
  "B/R 18": {
    diameterMm: "18 mm (DIN 18)",
    standard: "Boca Rosca Medicinal Europea DIN 18",
    turns: "1.5 vueltas calibradas sobre vidrio",
    sealType: "Cono obturador / Pipeta con bulbo",
    summary:
      "Estándar farmacéutico para frascos goteros de vidrio ámbar, cristal o satinado. Garantiza dosificación gota a gota exacta.",
  },
  "B/R 28": {
    diameterMm: "28 mm (PP 28)",
    standard: "Boca Rosca Jarabe / Farmacia PP28",
    turns: "1.5 vueltas con anillo precinto",
    sealType: "Tapa inviolable con liner de estanqueidad",
    summary:
      "Boca ancha medicinal para jarabes, soluciones orales, alcoholes y extractos fluidos de 100 cc a 1.000 cc.",
  },
  "B/AX 63": {
    diameterMm: "63 mm",
    standard: "Boca Axial Twist-Off 63 mm",
    turns: "1/4 de vuelta (4 uñas metálicas)",
    sealType: "Compuesto plastisol termo-sellable al vacío",
    summary:
      "Cierre metálico axial apto pasteurización y vacío alimenticio para mermeladas, conservas gourmet y velas de soja en frasco.",
  },
  "B/AX 70": {
    diameterMm: "70 mm",
    standard: "Boca Axial Twist-Off 70 mm",
    turns: "1/4 de vuelta (4 a 6 uñas de enganche)",
    sealType: "Banda interna plastisol apta calor y vacío",
    summary:
      "Boca ancha conservera para frascos de 360 cc a 3.000 cc. Permite fácil cuchareo y cierre hermético contra humedad y oxígeno.",
  },
  Canilla: {
    diameterMm: "Paso Rosca Bidón / Dispenser",
    standard: "Acople Esférico con Doble Arandela",
    turns: "Rosca pasante o tapa roscada perforada",
    sealType: "Doble junta de silicona grado alimenticio",
    summary:
      "Sistema de dispensado por gravedad sin goteo para bidones PEAD industriales (5 L a 25 L) y dispensers de vidrio para eventos.",
  },
  Corcho: {
    diameterMm: "Cuello Liso Cónico",
    standard: "Encastre por Compresión Elástica",
    turns: "Inserción directa a presión",
    sealType: "Corcho natural aglomerado o sintético",
    summary:
      "Cierre tradicional artesanal para botellas licoreras, aceiteras, sales de baño, difusores y frascos decorativos.",
  },
};

interface ThreadInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  baseProduct: Product;
  selectedCompatible: Product | null;
  allCompatibles: Product[];
  defaultQuantity?: number;
  onSelectCompatible: (prod: Product) => void;
}

export function ThreadInspectorDrawer({
  isOpen,
  onClose,
  baseProduct,
  selectedCompatible,
  allCompatibles,
  defaultQuantity = 1,
  onSelectCompatible,
}: ThreadInspectorDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState<number>(defaultQuantity);

  useEffect(() => {
    setQty(Math.max(1, defaultQuantity));
  }, [defaultQuantity]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const activeItem = selectedCompatible || allCompatibles[0] || null;
  const threadKey: NeckThread = activeItem?.neckThread || baseProduct.neckThread;
  const spec: ThreadSpecInfo = THREAD_SPECS[threadKey] || {
    diameterMm: threadKey,
    standard: "Estándar Técnico OSSIL",
    turns: "Ajuste calibrado",
    sealType: "Cierre hermético verificado",
    summary: "Compatibilidad verificada físicamente en nuestro depósito de Córdoba.",
  };

  const activeTier = activeItem
    ? [...activeItem.priceTiers].sort((a, b) => b.minQty - a.minQty).find((t) => qty >= t.minQty)
    : null;
  const unitPrice = activeItem ? (activeTier ? activeTier.unitPrice : activeItem.basePrice) : 0;
  const discountPct = activeTier ? activeTier.discountPct : 0;
  const subtotalNet = unitPrice * qty;
  const ivaAmount = Math.round(subtotalNet * IVA_RATE);
  const subtotalWithIva = subtotalNet + ivaAmount;

  const handleAddOnlyThis = () => {
    if (!activeItem) return;
    addItem(activeItem, qty);
    toast.success(`Sumaste ${qty} u. de ${activeItem.name}`, {
      description: `Rosca ${threadKey} — Total c/IVA: $${subtotalWithIva.toLocaleString("es-AR")}`,
    });
    onClose();
  };

  const handleAddFullCombo = () => {
    if (!activeItem) return;
    addItem(baseProduct, qty);
    addItem(activeItem, qty);
    toast.success(`Combo completo agregado (${qty} sets)`, {
      description: `${baseProduct.name} + ${activeItem.name} listos en tu pedido.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop translúcido */}
          <motion.button
            type="button"
            aria-label="Cerrar panel de rosca"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 w-full h-full bg-[#141413]/35 backdrop-blur-xs cursor-default border-none p-0"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-12">
            <motion.aside
              aria-label={`Inspector técnico de rosca ${threadKey}`}
              initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      x: 0,
                      transition: { type: "spring", bounce: 0, duration: 0.38 },
                    }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { x: "100%", transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] } }
              }
              className="w-screen max-w-lg liquid-glass-strong border-l border-white/80 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Cabecera Fija del Inspector */}
              <div className="p-5 sm:p-6 border-b border-[#E6E2DC]/80 bg-white/75 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#141413] text-[#FAF8F5]">
                      Inspector de Rosca {threadKey}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Encastre Exacto
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#141413] leading-snug">
                    Anatomía y Cierre Compatible
                  </h2>
                  <p className="text-xs text-[#66615B]">
                    Verificado para <strong>{baseProduct.name}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar inspector lateral"
                  className="p-2 rounded-xl frosted-well text-[#57534E] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido Desplazable */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* 1. Esquema Técnico Visual de la Boca / Rosca */}
                <div className="p-4 sm:p-5 rounded-2xl frosted-well space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-[#9E734E]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                        Plano Técnico de Boca {threadKey}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#9E734E]">
                      Ø {spec.diameterMm}
                    </span>
                  </div>

                  {/* Diagrama SVG de Cuello y Filetes de Rosca */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white/80 rounded-2xl p-4 border border-[#E6E2DC]">
                    <div className="sm:col-span-5 flex items-center justify-center">
                      <svg
                        viewBox="0 0 160 130"
                        className="w-36 h-28 text-[#141413]"
                        role="img"
                        aria-label={`Esquema milimétrico de cuello ${threadKey}`}
                      >
                        {/* Cota Superior de Diámetro */}
                        <line x1="44" y1="16" x2="116" y2="16" stroke="#9E734E" strokeWidth="1.5" />
                        <line x1="44" y1="11" x2="44" y2="21" stroke="#9E734E" strokeWidth="1.5" />
                        <line
                          x1="116"
                          y1="11"
                          x2="116"
                          y2="21"
                          stroke="#9E734E"
                          strokeWidth="1.5"
                        />
                        <text
                          x="80"
                          y="11"
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#9E734E"
                        >
                          Ø {spec.diameterMm}
                        </text>

                        {/* Tapa / Liner Superior */}
                        <rect
                          x="40"
                          y="24"
                          width="80"
                          height="10"
                          rx="3"
                          fill="#9E734E"
                          fillOpacity="0.18"
                          stroke="#9E734E"
                          strokeWidth="1.4"
                        />

                        {/* Cuello del Envase */}
                        <rect
                          x="46"
                          y="37"
                          width="68"
                          height="44"
                          rx="2"
                          fill="#FAF8F5"
                          stroke="#141413"
                          strokeWidth="1.8"
                        />

                        {/* Filetes de Rosca (Helicoide) */}
                        <path
                          d="M43 46 L117 42 M43 56 L117 52 M43 66 L117 62"
                          stroke="#B45309"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />

                        {/* Anillo / Collarín Base y Hombro del Envase */}
                        <rect
                          x="42"
                          y="76"
                          width="76"
                          height="6"
                          rx="2"
                          fill="#E6E2DC"
                          stroke="#141413"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M46 82 C30 92, 24 104, 24 122 L136 122 C136 104, 130 92, 114 82 Z"
                          fill="#FFFFFF"
                          stroke="#141413"
                          strokeWidth="1.8"
                        />
                        <text
                          x="80"
                          y="108"
                          textAnchor="middle"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#141413"
                        >
                          {threadKey}
                        </text>
                      </svg>
                    </div>

                    <div className="sm:col-span-7 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                          Norma / Estándar
                        </span>
                        <strong className="text-[#141413]">{spec.standard}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                          Giro y Traba
                        </span>
                        <span className="text-[#4A4742] font-medium">{spec.turns}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                          Sistema de Estanqueidad
                        </span>
                        <span className="text-emerald-800 font-semibold">{spec.sealType}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#57534E] leading-relaxed">{spec.summary}</p>
                </div>

                {/* 2. Selector Rápido entre Alternativas de la Misma Rosca */}
                {allCompatibles.length > 1 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#141413] block">
                      Variantes compatibles disponibles ({allCompatibles.length}):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                      {allCompatibles.map((comp) => {
                        const isSelected = activeItem?.id === comp.id;
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => onSelectCompatible(comp)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#141413] text-[#FAF8F5] border-[#141413] shadow-xs"
                                : "bg-white/80 text-[#57534E] border-[#E6E2DC] hover:border-[#9E734E]"
                            }`}
                          >
                            {comp.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Detalle Visual y Comercial de la Pieza Seleccionada */}
                {activeItem && (
                  <div className="p-5 rounded-2xl liquid-glass space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-28 h-28 rounded-2xl frosted-well shrink-0 flex items-center justify-center p-2 overflow-hidden">
                        {activeItem.imageUrl ? (
                          <Image
                            src={activeItem.imageUrl}
                            alt={activeItem.name}
                            fill
                            sizes="112px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-[#9E734E]">
                            <Package className="w-8 h-8" />
                            <span className="font-mono text-[9px] font-bold mt-1">
                              {activeItem.neckThread}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#EBE7DF] text-[#141413]">
                            SKU: {activeItem.sku}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-[#9E734E]">
                            {activeItem.finish}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-[#141413] leading-snug">
                          {activeItem.name}
                        </h3>
                        <p className="text-xs text-[#66615B] leading-relaxed">
                          {activeItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Escalas de precio de esta tapa/envase */}
                    {activeItem.priceTiers.length > 0 && (
                      <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-[#E6E2DC]/70">
                        {activeItem.priceTiers.map((tier) => {
                          const reached = qty >= tier.minQty;
                          return (
                            <button
                              key={tier.minQty}
                              type="button"
                              onClick={() => setQty(tier.minQty)}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                reached
                                  ? "bg-[#141413] text-white border-[#141413]"
                                  : "bg-white/80 text-[#141413] border-[#E6E2DC] hover:border-[#9E734E]"
                              }`}
                            >
                              <span className="block font-mono text-[9px] opacity-75">
                                +{tier.minQty}u
                              </span>
                              <span className="block font-mono text-xs font-bold">
                                ${tier.unitPrice.toLocaleString("es-AR")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Enlace opcional para abrir la ficha en pestaña nueva */}
                    <div className="pt-2 border-t border-[#E6E2DC]/70 flex items-center justify-between text-xs">
                      <span className="text-[#66615B] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Stock inmediato en Córdoba</span>
                      </span>
                      <a
                        href={`/producto/${activeItem.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#9E734E] hover:text-[#141413] underline"
                      >
                        <span>Abrir ficha en pestaña nueva</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Pie de Acción con Cantidad, Desglose IVA y Botones de Compra */}
              {activeItem && (
                <div className="p-5 sm:p-6 border-t border-[#E6E2DC] bg-white/90 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <QuantityStepper
                      value={qty}
                      onChange={setQty}
                      size="md"
                      ariaLabel="Cantidad de tapas o accesorios"
                    />

                    <div className="text-right">
                      <span className="text-[10px] text-[#66615B] block">
                        Neto: ${subtotalNet.toLocaleString("es-AR")} + IVA (21%): $
                        {ivaAmount.toLocaleString("es-AR")}
                        {discountPct > 0 ? ` • -${discountPct}%` : ""}
                      </span>
                      <span className="font-mono text-lg font-black text-[#141413]">
                        Total c/IVA: ${subtotalWithIva.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleAddOnlyThis}
                      className="py-3 px-4 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#9E734E]" />
                      <span>Sumar {qty} u. al Pedido</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddFullCombo}
                      className="py-3 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer shadow-xs"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Sumar Combo ({qty} Sets)</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
