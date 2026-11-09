"use client";

import { RotateCcw, X } from "lucide-react";
import { CAPACITY_RANGES, FAMILIES_BY_UNIT } from "@/lib/taxonomy";
import type { BusinessUnit } from "@/types/catalog";

interface ActiveFilterChipsProps {
  unit: BusinessUnit;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedMaterial: string;
  selectedThread: string;
  selectedCapacityRange: string;
  searchQuery: string;
  totalFiltered: number;
  onRemoveCategory: () => void;
  onRemoveSubcategory: () => void;
  onRemoveMaterial: () => void;
  onRemoveThread: () => void;
  onRemoveCapacityRange: () => void;
  onRemoveSearchQuery: () => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  unit,
  selectedCategory,
  selectedSubcategory,
  selectedMaterial,
  selectedThread,
  selectedCapacityRange,
  searchQuery,
  totalFiltered,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveMaterial,
  onRemoveThread,
  onRemoveCapacityRange,
  onRemoveSearchQuery,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasActiveFilters =
    selectedCategory !== "TODAS" ||
    selectedSubcategory !== "TODAS" ||
    selectedMaterial !== "TODOS" ||
    selectedThread !== "TODOS" ||
    selectedCapacityRange !== "TODAS" ||
    searchQuery.trim() !== "";

  if (!hasActiveFilters) {
    return null;
  }

  const categoryObj = FAMILIES_BY_UNIT[unit]?.find((f) => f.id === selectedCategory);
  const capacityObj = CAPACITY_RANGES.find((r) => r.id === selectedCapacityRange);

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white border border-[#E6E2DC] shadow-2xs mb-6 animate-fade-in">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] mr-1">
        Filtros activos ({totalFiltered} resultados):
      </span>

      {/* Chip Búsqueda */}
      {searchQuery.trim() && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2DC] text-xs font-medium text-[#141413]">
          <span className="text-[#8C827A]">Búsqueda:</span>
          <span className="font-bold truncate max-w-[120px]">"{searchQuery}"</span>
          <button
            type="button"
            onClick={onRemoveSearchQuery}
            aria-label="Eliminar filtro de búsqueda"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Chip Familia / Categoría */}
      {selectedCategory !== "TODAS" && categoryObj && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2DC] text-xs font-medium text-[#141413]">
          <span className="text-[#8C827A]">Familia:</span>
          <span className="font-bold">{categoryObj.label}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            aria-label="Eliminar filtro de categoría"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Chip Subcategoría */}
      {selectedSubcategory !== "TODAS" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2DC] text-xs font-medium text-[#141413]">
          <span className="text-[#8C827A]">Línea:</span>
          <span className="font-bold">{selectedSubcategory}</span>
          <button
            type="button"
            onClick={onRemoveSubcategory}
            aria-label="Eliminar filtro de subcategoría"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Chip Boca / Rosca */}
      {selectedThread !== "TODOS" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#9E734E]/30 text-xs font-medium text-[#141413]">
          <span className="text-[#9E734E] font-bold">Rosca:</span>
          <span className="font-mono font-bold">{selectedThread}</span>
          <button
            type="button"
            onClick={onRemoveThread}
            aria-label="Eliminar filtro de rosca"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Chip Material */}
      {selectedMaterial !== "TODOS" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2DC] text-xs font-medium text-[#141413]">
          <span className="text-[#8C827A]">Material:</span>
          <span className="font-bold">{selectedMaterial}</span>
          <button
            type="button"
            onClick={onRemoveMaterial}
            aria-label="Eliminar filtro de material"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Chip Capacidad */}
      {selectedCapacityRange !== "TODAS" && capacityObj && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2DC] text-xs font-medium text-[#141413]">
          <span className="text-[#8C827A]">Capacidad:</span>
          <span className="font-bold">{capacityObj.shortLabel}</span>
          <button
            type="button"
            onClick={onRemoveCapacityRange}
            aria-label="Eliminar filtro de capacidad"
            className="hover:text-rose-600 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Botón Borrar Todo */}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Limpiar filtros</span>
      </button>
    </div>
  );
}
