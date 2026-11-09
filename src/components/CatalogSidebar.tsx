"use client";

import {
  ChevronDown,
  ChevronUp,
  Filter,
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CAPACITY_RANGES } from "@/lib/taxonomy";
import type { BusinessUnit } from "@/types/catalog";

interface CatalogSidebarProps {
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
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CatalogSidebar({
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
  onClearFilters,
  hasActiveFilters,
}: CatalogSidebarProps) {
  const [threadSearch, setThreadSearch] = useState("");
  const [openThread, setOpenThread] = useState(true);
  const [openMaterial, setOpenMaterial] = useState(true);
  const [openCapacity, setOpenCapacity] = useState(true);

  // Lista de materiales disponibles según la unidad
  const availableMaterials = useMemo(() => {
    if (unit === "ENVASES") {
      return [
        { id: "TODOS", label: "Todos los materiales" },
        { id: "Vidrio", label: "Vidrio Cristal & Ámbar" },
        { id: "PET", label: "PET (Polietileno Tereftalato)" },
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

  // Lista plana de roscas con filtro de búsqueda rápida
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

  return (
    <aside
      aria-label="Filtros facetados de catálogo"
      className="w-72 shrink-0 hidden lg:block space-y-4"
    >
      {/* Encabezado Sidebar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#9E734E]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
            Filtros Facetados
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* ACORDEÓN 1: BOCA / ROSCA MILIMÉTRICA (Exclusivo Envases)     */}
      {/* ============================================================ */}
      {unit === "ENVASES" && (
        <div className="rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenThread(!openThread)}
            className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] transition-colors cursor-pointer border-b border-[#E6E2DC]"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#9E734E]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                Boca / Rosca
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {selectedThread !== "TODOS" && (
                <span className="text-[10px] font-mono font-bold bg-[#9E734E] text-white px-1.5 py-0.5 rounded">
                  {selectedThread}
                </span>
              )}
              {openThread ? (
                <ChevronUp className="w-4 h-4 text-[#8C827A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#8C827A]" />
              )}
            </div>
          </button>

          {openThread && (
            <div className="p-3.5 space-y-3">
              {/* Buscador Rápido de Roscas */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C827A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={threadSearch}
                  onChange={(e) => setThreadSearch(e.target.value)}
                  placeholder="Buscar boca (ej: 24/410, B/AX)..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-mono text-[#141413] placeholder:text-[#A8A29E] focus:outline-hidden focus:ring-1 focus:ring-[#9E734E]"
                />
              </div>

              {/* Botón Todas las Bocas */}
              <button
                type="button"
                onClick={() => onSelectThread("TODOS")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedThread === "TODOS"
                    ? "bg-[#141413] text-white font-bold"
                    : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#141413]"
                }`}
              >
                <span>Todas las bocas</span>
                <span className="text-[10px] opacity-70">
                  {Object.values(threadCounts).reduce((a, b) => a + b, 0)}
                </span>
              </button>

              {/* Lista filtrada de Roscas */}
              <div className="max-h-56 overflow-y-auto space-y-1 scrollbar-thin pr-1">
                {allKnownThreads.map((th) => {
                  const count = threadCounts[th] || 0;
                  const isSelected = selectedThread === th;
                  return (
                    <button
                      key={th}
                      type="button"
                      onClick={() => onSelectThread(isSelected ? "TODOS" : th)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#9E734E] text-white font-bold"
                          : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#141413]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-white" : "bg-[#DCD6C9]"
                          }`}
                        />
                        <span>Boca {th}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-[#F3EFEA] text-[#8C827A]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* ACORDEÓN 2: MATERIAL                                         */}
      {/* ============================================================ */}
      <div className="rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenMaterial(!openMaterial)}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] transition-colors cursor-pointer border-b border-[#E6E2DC]"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9E734E]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
              Material
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedMaterial !== "TODOS" && (
              <span className="text-[10px] font-bold bg-[#9E734E] text-white px-1.5 py-0.5 rounded">
                {selectedMaterial}
              </span>
            )}
            {openMaterial ? (
              <ChevronUp className="w-4 h-4 text-[#8C827A]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8C827A]" />
            )}
          </div>
        </button>

        {openMaterial && (
          <div className="p-3.5 space-y-1">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#141413] text-white font-bold"
                      : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#141413]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-[#9E734E]" : "bg-[#DCD6C9]"
                      }`}
                    />
                    <span className="truncate">{mat.label}</span>
                  </div>
                  {count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#F3EFEA] text-[#8C827A]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ACORDEÓN 3: CAPACIDAD / VOLUMEN                              */}
      {/* ============================================================ */}
      <div className="rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenCapacity(!openCapacity)}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] transition-colors cursor-pointer border-b border-[#E6E2DC]"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-[#9E734E]">cc/L</span>
            <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
              Capacidad
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedCapacityRange !== "TODAS" && (
              <span className="text-[10px] font-bold bg-[#9E734E] text-white px-1.5 py-0.5 rounded">
                {CAPACITY_RANGES.find((r) => r.id === selectedCapacityRange)?.shortLabel}
              </span>
            )}
            {openCapacity ? (
              <ChevronUp className="w-4 h-4 text-[#8C827A]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8C827A]" />
            )}
          </div>
        </button>

        {openCapacity && (
          <div className="p-3.5 space-y-1">
            {CAPACITY_RANGES.map((range) => {
              const isSelected = selectedCapacityRange === range.id;
              const count = range.id === "TODAS" ? null : capacityCounts[range.id] || 0;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() =>
                    onSelectCapacityRange(isSelected && range.id !== "TODAS" ? "TODAS" : range.id)
                  }
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#141413] text-white font-bold"
                      : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#141413]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-[#9E734E]" : "bg-[#DCD6C9]"
                      }`}
                    />
                    <span className="truncate">{range.label}</span>
                  </div>
                  {count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#F3EFEA] text-[#8C827A]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
