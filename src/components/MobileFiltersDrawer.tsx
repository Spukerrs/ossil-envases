"use client";

import {
  ChevronDown,
  ChevronUp,
  Filter,
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CAPACITY_RANGES } from "@/lib/taxonomy";
import type { BusinessUnit } from "@/types/catalog";

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unit: BusinessUnit;
  selectedMaterial: string;
  onSelectMaterial: (m: string) => void;
  selectedThread: string;
  onSelectThread: (th: string) => void;
  selectedCapacityRange: string;
  onSelectCapacityRange: (r: string) => void;
  threadCounts: Record<string, number>;
  materialCounts: Record<string, number>;
  capacityCounts: Record<string, number>;
  totalFiltered: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
  unit,
  selectedMaterial,
  onSelectMaterial,
  selectedThread,
  onSelectThread,
  selectedCapacityRange,
  onSelectCapacityRange,
  threadCounts,
  materialCounts,
  capacityCounts,
  totalFiltered,
  onClearFilters,
  hasActiveFilters,
}: MobileFiltersDrawerProps) {
  const [threadSearch, setThreadSearch] = useState("");
  const [openThread, setOpenThread] = useState(true);
  const [openMaterial, setOpenMaterial] = useState(true);
  const [openCapacity, setOpenCapacity] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const availableMaterials = useMemo(() => {
    if (unit === "ENVASES") {
      return [
        { id: "TODOS", label: "Todos los materiales" },
        { id: "Vidrio", label: "Vidrio Cristal & Ámbar" },
        { id: "PET", label: "PET (Polietileno)" },
        { id: "PEAD", label: "PEAD (Alta Densidad)" },
        { id: "Acrílico", label: "Acrílico & Poliestireno" },
        { id: "Aluminio", label: "Aluminio" },
        { id: "Insumos", label: "Insumos & Accesorios" },
      ];
    }
    return [
      { id: "TODOS", label: "Todos los materiales" },
      { id: "Vidrio", label: "Vidrio & Cristalería" },
      { id: "Acero/Metal", label: "Acero Inoxidable & Térmicos" },
      { id: "Insumos", label: "Ceras, Pabilos & Esencias" },
      { id: "Mármol/Cerámica", label: "Mármol & Cerámica" },
      { id: "Aluminio", label: "Aluminio & Hojalata" },
    ];
  }, [unit]);

  const allKnownThreads = useMemo(() => {
    const list = [
      "18/415",
      "20/410",
      "24/410",
      "28/400",
      "28/410",
      "B/R 18",
      "B/R 28",
      "B/AX 70",
      "B/AX 63",
      "B/E 15",
      "Canilla",
      "Corcho",
    ];
    if (!threadSearch.trim()) return list;
    const q = threadSearch.toLowerCase().trim();
    return list.filter((th) => th.toLowerCase().includes(q));
  }, [threadSearch]);

  const handleApply = () => {
    onClose();
    setTimeout(() => {
      const grid = document.getElementById("catalog-grid");
      if (grid) {
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-fade-in"
    >
      {/* Fondo oscuro backdrop accesible */}
      <button
        type="button"
        aria-label="Cerrar filtros"
        className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-xs cursor-default border-none p-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-h-[85vh] bg-[#FAF8F5] rounded-t-3xl border-t border-[#E6E2DC] shadow-2xl flex flex-col animate-slide-up overflow-hidden">
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6E2DC] bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#9E734E]" />
            <h2
              id="mobile-filters-title"
              className="text-sm font-black uppercase tracking-wider text-[#141413]"
            >
              Filtros de Catálogo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="p-1.5 rounded-full hover:bg-[#F3EFEA] text-[#141413] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable de filtros */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Boca / Rosca (solo en Envases) */}
          {unit === "ENVASES" && (
            <div className="rounded-2xl bg-white border border-[#E6E2DC] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenThread(!openThread)}
                className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] font-black text-xs uppercase tracking-wider text-[#141413] border-b border-[#E6E2DC]"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9E734E]" />
                  <span>Boca / Rosca</span>
                </div>
                {openThread ? (
                  <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                )}
              </button>

              {openThread && (
                <div className="p-3 space-y-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8C827A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={threadSearch}
                      onChange={(e) => setThreadSearch(e.target.value)}
                      placeholder="Buscar rosca (ej: 24/410)..."
                      className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-mono text-[#141413]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => onSelectThread("TODOS")}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        selectedThread === "TODOS"
                          ? "bg-[#141413] text-white font-bold"
                          : "bg-[#FAF8F5] text-[#57534E]"
                      }`}
                    >
                      Todas
                    </button>
                    {allKnownThreads.map((th) => {
                      const count = threadCounts[th] || 0;
                      const isSelected = selectedThread === th;
                      return (
                        <button
                          key={th}
                          type="button"
                          onClick={() => onSelectThread(isSelected ? "TODOS" : th)}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#9E734E] text-white font-bold"
                              : "bg-[#FAF8F5] text-[#57534E]"
                          }`}
                        >
                          <span>{th}</span>
                          <span className="text-[10px] opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Material */}
          <div className="rounded-2xl bg-white border border-[#E6E2DC] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenMaterial(!openMaterial)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] font-black text-xs uppercase tracking-wider text-[#141413] border-b border-[#E6E2DC]"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E734E]" />
                <span>Material</span>
              </div>
              {openMaterial ? (
                <ChevronUp className="w-4 h-4 text-[#8C827A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#8C827A]" />
              )}
            </button>

            {openMaterial && (
              <div className="p-3 grid grid-cols-1 gap-1.5">
                {availableMaterials.map((mat) => {
                  const isSelected = selectedMaterial === mat.id;
                  const count = mat.id === "TODOS" ? null : materialCounts[mat.id] || 0;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() =>
                        onSelectMaterial(isSelected && mat.id !== "TODOS" ? "TODOS" : mat.id)
                      }
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#141413] text-white font-bold"
                          : "bg-[#FAF8F5] text-[#57534E]"
                      }`}
                    >
                      <span>{mat.label}</span>
                      {count !== null && <span className="text-[10px] opacity-70">({count})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Capacidad */}
          <div className="rounded-2xl bg-white border border-[#E6E2DC] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenCapacity(!openCapacity)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] font-black text-xs uppercase tracking-wider text-[#141413] border-b border-[#E6E2DC]"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#9E734E]">cc/L</span>
                <span>Capacidad / Volumen</span>
              </div>
              {openCapacity ? (
                <ChevronUp className="w-4 h-4 text-[#8C827A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#8C827A]" />
              )}
            </button>

            {openCapacity && (
              <div className="p-3 grid grid-cols-1 gap-1.5">
                {CAPACITY_RANGES.map((range) => {
                  const isSelected = selectedCapacityRange === range.id;
                  const count = range.id === "TODAS" ? null : capacityCounts[range.id] || 0;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() =>
                        onSelectCapacityRange(
                          isSelected && range.id !== "TODAS" ? "TODAS" : range.id,
                        )
                      }
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#141413] text-white font-bold"
                          : "bg-[#FAF8F5] text-[#57534E]"
                      }`}
                    >
                      <span>{range.label}</span>
                      {count !== null && <span className="text-[10px] opacity-70">({count})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Fijo con CTA Ver Productos y Limpiar */}
        <div className="p-4 bg-white border-t border-[#E6E2DC] flex items-center gap-3 shrink-0">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-3.5 py-3 rounded-xl border border-[#E6E2DC] text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer text-center"
          >
            Ver {totalFiltered} productos
          </button>
        </div>
      </div>
    </div>
  );
}
