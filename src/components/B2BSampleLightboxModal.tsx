"use client";

import {
  Check,
  Clock,
  Layers,
  Maximize2,
  MessageCircle,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { STORE_CONFIG } from "@/lib/constants";

export interface B2BSample {
  title: string;
  tech: string;
  image: string;
  desc: string;
  example: string;
  leadTime: string;
  minQty: string;
  materials?: string;
  features?: string[];
}

interface B2BSampleLightboxModalProps {
  sample: B2BSample | null;
  isOpen: boolean;
  onClose: () => void;
}

export function B2BSampleLightboxModal({
  sample,
  isOpen,
  onClose,
}: B2BSampleLightboxModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    if (sample || isOpen) {
      setZoomLevel(1);
      setMousePos({ x: 50, y: 50 });
      setIsFullScreen(false);
    }
  }, [sample, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullScreen, onClose]);

  if (!isOpen || !sample) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom suave continuo con rueda de ratón (de 1x hasta 7x)
    const step = e.deltaY < 0 ? 0.5 : -0.5;
    setZoomLevel((prev) => {
      const next = Math.round((prev + step) * 10) / 10;
      return Math.min(7, Math.max(1, next));
    });
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(7, Math.round((prev + 0.5) * 10) / 10));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(1, Math.round((prev - 0.5) * 10) / 10));
  };

  const cycleZoom = () => {
    if (zoomLevel < 1.8) setZoomLevel(2.5);
    else if (zoomLevel < 3.2) setZoomLevel(4.5);
    else if (zoomLevel < 5.5) setZoomLevel(7);
    else setZoomLevel(1);
  };

  const whatsappMessage = `Hola OSSIL, estoy interesado en el servicio de asesoramiento para ${sample.title} (${sample.tech}) en mis envases. ¿Podrían asesorarme con las opciones y cotizaciones?`;

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MODAL PRINCIPAL EDITORIAL B2B                             */}
      {/* ============================================================ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sample-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      >
        {/* Fondo oscuro backdrop accesible */}
        <button
          type="button"
          aria-label="Cerrar vista de muestra"
          className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-md cursor-default border-none p-0"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] border border-[#E6E2DC] shadow-2xl apothecary-grid-subtle flex flex-col lg:flex-row text-[#141413] animate-scale-up">
          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar vista de muestra"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#141413] shadow-md border border-[#E6E2DC] transition-all hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#9E734E]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Columna Visual / Visor de Inspección Macro */}
          <div className="w-full lg:w-7/12 p-5 sm:p-7 flex flex-col justify-between bg-[#F3EFEA] border-b lg:border-b-0 lg:border-r border-[#E6E2DC] relative">
            {/* Barra Superior de Controles de Zoom */}
            <div className="flex items-center justify-between gap-2 mb-3 z-10 flex-wrap">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-[#E6E2DC] shadow-2xs">
                <span className="text-[10px] font-bold text-[#8C827A] px-2 uppercase tracking-wider hidden sm:inline">
                  Zoom:
                </span>
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 rounded-lg text-[#57534E] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Reducir zoom (-0.5x)"
                  aria-label="Reducir zoom"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                {[1, 2, 3.5, 5, 7].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setZoomLevel(lvl)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      zoomLevel === lvl
                        ? "bg-[#9E734E] text-white shadow-2xs"
                        : "text-[#57534E] hover:bg-[#FAF8F5]"
                    }`}
                    title={`Zoom ${lvl}x`}
                  >
                    {lvl}x
                  </button>
                ))}
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 7}
                  className="p-1 rounded-lg text-[#57534E] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Aumentar zoom (+0.5x)"
                  aria-label="Aumentar zoom"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer ml-0.5"
                    title="Restablecer vista 1x"
                    aria-label="Restablecer zoom a 1x"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Botón Pantalla Completa */}
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-bold text-[#141413] border border-[#E6E2DC] shadow-2xs transition-all hover:border-[#9E734E] cursor-pointer"
                title="Ampliar a pantalla completa"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#9E734E]" />
                <span className="hidden sm:inline">Pantalla Completa</span>
              </button>
            </div>

            {/* Contenedor Interactivo con Lupa de Seguimiento y Zoom Rueda */}
            <div
              className={`relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-[#E6E2DC] bg-white select-none ${
                zoomLevel > 1 ? "cursor-crosshair" : "cursor-zoom-in"
              }`}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              onClick={cycleZoom}
              title={
                zoomLevel > 1
                  ? "Click para ciclar zoom, rueda del ratón para regular o mové el cursor para recorrer"
                  : "Click para activar zoom de alta definición (hasta 7x macro)"
              }
            >
              <div
                className="w-full h-full relative"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: zoomLevel === 1 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
                }}
              >
                <Image
                  src={sample.image}
                  alt={`Muestra de referencia: ${sample.title}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover pointer-events-none"
                  priority
                />
              </div>

              {/* Indicador Flotante de Lupa Activa */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 text-white font-mono text-[11px] backdrop-blur-md pointer-events-none shadow-md">
                {zoomLevel > 1 ? (
                  <>
                    <ZoomOut className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span className="font-bold text-[#FBBF24]">{zoomLevel}x</span>
                    <span className="text-[10px] text-white/80 hidden sm:inline">
                      • Rueda o cursor para macro
                    </span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-3.5 h-3.5 text-[#D4CEBF]" />
                    <span className="font-bold">Click o rueda para lupa (hasta 7x)</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#8C827A] mt-3 text-center">
              Muestra técnica de referencia para asesoramiento y cotización en Oncativo 69, Córdoba.
            </p>
          </div>

          {/* Columna de Especificaciones y Cotización */}
          <div className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                    {sample.tech}
                  </span>
                  <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#9E734E]" />
                    <span>Asesoramiento B2B</span>
                  </span>
                </div>
                <h2
                  id="sample-modal-title"
                  className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight mt-1.5"
                >
                  {sample.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">{sample.desc}</p>

              {/* Ejemplo Práctico de Aplicación */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs space-y-1.5">
                <span className="font-bold text-[#141413] flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#9E734E]">
                  <Sparkles className="w-3.5 h-3.5 text-[#9E734E]" />
                  Aplicación recomendada:
                </span>
                <p className="text-xs text-[#57534E] leading-relaxed">{sample.example}</p>
              </div>

              {/* Ficha Técnica Rápida */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                  <span className="text-[10px] text-[#8C827A] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#9E734E]" />
                    Tirada Mínima
                  </span>
                  <span className="font-mono font-bold text-sm text-[#141413] block">
                    {sample.minQty}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                  <span className="text-[10px] text-[#8C827A] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9E734E]" />
                    Plazo Estimado
                  </span>
                  <span className="font-medium text-xs text-[#141413] block pt-0.5">
                    {sample.leadTime}
                  </span>
                </div>
              </div>

              {/* Beneficios Clave */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#66615B] block">
                  Alcance del servicio de asesoramiento:
                </span>
                <ul className="space-y-1 text-xs text-[#57534E]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Orientación sobre compatibilidad de materiales, calor y tintas.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Articulación técnica de tiradas mayoristas con talleres especializados.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Muestra física previa aprobada antes de la producción completa.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA de Consulta en WhatsApp */}
            <div className="pt-4 border-t border-[#E6E2DC] space-y-2">
              <a
                href={STORE_CONFIG.contact.whatsappUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar Presupuesto por este Acabado</span>
              </a>
              <span className="text-[10px] text-[#8C827A] text-center block">
                Atención directa de lunes a viernes de 8:00 a 17:00 hs.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MODO TEATRO / PANTALLA COMPLETA MACRO ULTRA (HASTA 4X)    */}
      {/* ============================================================ */}
      {isFullScreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inspección a pantalla completa"
          className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
        >
          {/* Header Superior Fullscreen */}
          <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10 text-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#9E734E] font-bold">
                Inspección Macro {sample.title}
              </span>
              <span className="text-xs text-white/70 hidden md:inline">
                {sample.tech} • Resolución nativa 1200 px
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Selector de Aumentos Fullscreen */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Reducir zoom (-0.5x)"
                  aria-label="Reducir zoom"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                {[1, 2, 3.5, 5, 7].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setZoomLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      zoomLevel === lvl
                        ? "bg-[#9E734E] text-white shadow-sm"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {lvl === 7 ? "7x Ultra Macro" : `${lvl}x`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 7}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Aumentar zoom (+0.5x)"
                  aria-label="Aumentar zoom"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-white/10 cursor-pointer ml-1"
                    title="Restablecer vista 1x"
                    aria-label="Restablecer zoom a 1x"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                aria-label="Salir de pantalla completa"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ml-2 cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lienzo Central con Lupa de Seguimiento a Pantalla Completa */}
          <div
            className={`flex-1 w-full my-4 rounded-3xl overflow-hidden relative border border-white/10 bg-black/40 flex items-center justify-center select-none ${
              zoomLevel > 1 ? "cursor-crosshair" : "cursor-zoom-in"
            }`}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            onClick={cycleZoom}
          >
            <div
              className="w-full h-full relative"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transition: zoomLevel === 1 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
              }}
            >
              <Image
                src={sample.image}
                alt={sample.title}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain pointer-events-none"
                priority
              />
            </div>

            {/* Guía Flotante */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 text-white font-mono text-xs backdrop-blur-md border border-white/15 pointer-events-none">
              <span>Zoom {zoomLevel}x — Deslizá el cursor para inspeccionar cada detalle</span>
            </div>
          </div>

          {/* Footer Fullscreen con Botón de Salir */}
          <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
            <span>Presioná ESC o hacé click en el botón superior para regresar al detalle</span>
            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="text-[#9E734E] hover:text-white font-bold underline cursor-pointer"
            >
              Cerrar visor completo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
