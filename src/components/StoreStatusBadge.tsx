"use client";

import { Clock, MapPin, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoreStatus, type StoreStatus } from "@/lib/storeHours";

export function StoreStatusBadge() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<StoreStatus>(() => getStoreStatus());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(getStoreStatus());
    // Actualizar cada 60 segundos
    const timer = setInterval(() => {
      setStatus(getStoreStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
          mounted && status.isOpen
            ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
            : "bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200"
        }`}
        aria-label={`Estado de la tienda: ${mounted ? status.statusLabel : "OSSIL Envases Oncativo 69"}`}
      >
        <span className="relative flex h-2 w-2">
          {mounted && status.isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              mounted && status.isOpen ? "bg-emerald-600" : "bg-stone-400"
            }`}
          />
        </span>
        <span suppressHydrationWarning>{mounted ? status.statusLabel : "Showroom Córdoba"}</span>
        <span className="hidden sm:inline font-normal text-[11px] opacity-80">• Oncativo 69</span>
      </button>

      {/* Popover / Tooltip informativo */}
      {showTooltip && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-xl p-3.5 z-50 animate-scale-up text-left pointer-events-auto">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E6E2DC]">
            <Store className="w-4 h-4 text-[#9E734E]" />
            <div>
              <span className="text-xs font-bold text-[#141413] block">
                Local OSSIL Envases & Home
              </span>
              <span className="text-[10px] text-[#66615B] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#9E734E]" />
                Oncativo 69, Local 1 — Córdoba Capital
              </span>
            </div>
          </div>

          <div className="py-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#66615B]">Lunes:</span>
              <span className="font-mono font-bold text-[#141413]">08:15 a 17:15 hs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66615B]">Martes a Viernes:</span>
              <span className="font-mono font-bold text-[#141413]">08:00 a 17:15 hs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66615B]">Sábados:</span>
              <span className="font-mono font-bold text-[#141413]">09:00 a 13:30 hs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66615B]">Domingos:</span>
              <span className="font-mono text-stone-500">Cerrado</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6E2DC] bg-[#FAF8F5] -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
            <p className="text-[11px] text-[#8C827A] flex items-start gap-1.5 leading-snug">
              <Clock className="w-3.5 h-3.5 text-[#9E734E] shrink-0 mt-0.5" />
              <span>{status.nextChangeText}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
