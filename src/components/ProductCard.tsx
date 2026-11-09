"use client";

import { Layers, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getCapacityEquivalence } from "@/lib/capacity";
import { IVA_RATE } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
  onFilterThread?: (thread: string) => void;
  onOpenComboModal?: (product: Product) => void;
}

export function ProductCard({ product, onFilterThread, onOpenComboModal }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [showTiers, setShowTiers] = useState<boolean>(false);

  // Calcular precio unitario para la cantidad seleccionada
  const activeTier = [...product.priceTiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((t) => selectedQty >= t.minQty);

  const effectiveUnitPrice = activeTier ? activeTier.unitPrice : product.basePrice;
  const discountPct = activeTier ? activeTier.discountPct : 0;
  const subtotal = effectiveUnitPrice * selectedQty;
  const totalConIva = Math.round(subtotal * (1 + IVA_RATE));

  const handleAdd = () => {
    addItem(product, selectedQty);
    toast.success(`Agregaste ${selectedQty} u. de ${product.name}`, {
      description: `Neto: $${subtotal.toLocaleString("es-AR")} • Final c/IVA: $${totalConIva.toLocaleString("es-AR")}${discountPct > 0 ? ` (-${discountPct}% OFF)` : ""}`,
    });
  };

  const isBottleWithThread = product.neckThread !== "N/A" && product.category !== "accesorios";
  const capacityEquiv = getCapacityEquivalence(product.capacity, product.capacityValue);

  return (
    <div className="group relative flex flex-col justify-between liquid-glass liquid-glass-interactive rounded-2xl p-5">
      {/* Cabecera de la tarjeta: Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md frosted-well text-[#141413]">
              {product.neckThread !== "N/A" ? `BOCA ${product.neckThread}` : product.material}
            </span>
            {capacityEquiv?.isVolume ? (
              <span
                className="text-[11px] font-mono font-medium text-[#57534E] px-2 py-0.5 rounded-md bg-white/80"
                title={`Capacidad: ${product.capacity} • Equivalente a ${capacityEquiv.mlText} (${capacityEquiv.litersText})`}
              >
                {product.capacity} • {capacityEquiv.mlText} ({capacityEquiv.litersText})
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#57534E] px-2 py-0.5 rounded-md bg-white/70">
                {product.capacity}
              </span>
            )}
          </div>

          {product.badge && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#B45309] text-white">
              {product.badge}
            </span>
          )}
        </div>

        {/* Fotografía de Producto Real o Esquema de Boticario (Clickeable hacia pantalla dedicada) */}
        <Link
          href={`/producto/${product.id}`}
          className="relative w-full h-44 mb-3 rounded-xl frosted-well overflow-hidden flex items-center justify-center p-2 group-hover:bg-white/80 transition-colors block cursor-pointer"
        >
          {product.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300 motion-safe:transition-transform"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 text-[#8C827A]">
              <div className="w-12 h-12 rounded-full bg-[#EAE5DC] flex items-center justify-center mb-1 text-[#835C3A]">
                <Layers className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#8C827A]">
                {product.material} • {product.neckThread}
              </span>
            </div>
          )}
          {/* Identificador SKU técnico tipo inventario de boticario */}
          <span className="absolute bottom-1.5 right-2 font-mono text-[9px] text-[#8C827A] bg-[#FFFFFF]/95 px-1.5 py-0.5 rounded shadow-2xs border border-[#E6E2DC]">
            {product.sku}
          </span>
        </Link>

        {/* Acabado Visual y Nombre */}
        <div className="my-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E734E]">
            {product.finish}
          </span>
          <Link href={`/producto/${product.id}`} className="block">
            <h3 className="text-base font-bold text-[#141413] leading-snug group-hover:text-[#9E734E] transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#66615B] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Botón de Compatibilidad y Combo */}
        {isBottleWithThread && (
          <div className="mt-3 space-y-1.5">
            {onOpenComboModal && (
              <button
                type="button"
                onClick={() => onOpenComboModal(product)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E0D9CE] text-[#835C3A] hover:text-[#141413] text-xs font-bold flex items-center justify-center gap-1.5 transition-all group-hover:border-[#9E734E] cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#9E734E]" />
                <span>Armar Combo con Tapa Compatible</span>
              </button>
            )}

            {onFilterThread && (
              <button
                type="button"
                onClick={() => onFilterThread(product.neckThread)}
                className="w-full text-center text-[10px] font-semibold text-[#8C827A] hover:text-[#141413] transition-colors cursor-pointer"
              >
                Filtrar catálogo solo con rosca {product.neckThread}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selector de Escalas Mayoristas Interactivo */}
      <div className="mt-5 pt-4 border-t border-[#F0ECE4]">
        {product.requiresManualQuote ? (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-3">
            <span className="font-bold block">⚠️ Producto Especial:</span>
            Precio mayorista y flete a cotizar por asesor antes del pago.
          </div>
        ) : (
          <div className="mb-3.5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-[#66615B]">
                Escalas de Volumen:
              </span>
              <button
                type="button"
                onClick={() => setShowTiers(!showTiers)}
                className="text-[11px] font-bold text-[#9E734E] underline hover:text-[#835C3A] cursor-pointer"
              >
                {showTiers ? "Ocultar tabla" : "Ver descuentos"}
              </button>
            </div>

            {/* Selector Rápido de Cantidad */}
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 10, 25, 50, 100].map((qty) => {
                const tier = [...product.priceTiers]
                  .sort((a, b) => b.minQty - a.minQty)
                  .find((t) => qty >= t.minQty);
                const isSelected = selectedQty === qty;

                return (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSelectedQty(qty)}
                    className={`flex flex-col items-center py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#141413] border-[#141413] text-white shadow-xs"
                        : "bg-[#FAF8F5] border-[#E6E2DC] text-[#141413] hover:border-[#9E734E]"
                    }`}
                  >
                    <span className="text-xs font-black">{qty} u.</span>
                    <span
                      className={`text-[9px] font-bold ${
                        isSelected
                          ? "text-amber-300"
                          : tier && tier.discountPct > 0
                            ? "text-[#B45309]"
                            : "text-[#66615B]"
                      }`}
                    >
                      {tier && tier.discountPct > 0 ? `-${tier.discountPct}%` : "Base"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desglose de Tabla de Precios Expandible */}
            {showTiers && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2DC] text-[11px] space-y-1">
                {product.priceTiers.map((t) => (
                  <div key={t.minQty} className="flex justify-between items-center text-[#141413]">
                    <span>A partir de {t.minQty} unidades:</span>
                    <span className="font-mono font-bold">
                      ${t.unitPrice.toLocaleString("es-AR")}{" "}
                      <span className="text-[#B45309]">(-{t.discountPct}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Precio Total con IVA y Botón Agregar */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] font-bold text-[#66615B] block">
              Neto: ${subtotal.toLocaleString("es-AR")} (
              {effectiveUnitPrice.toLocaleString("es-AR")} u.)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-black text-[#141413]">
                ${totalConIva.toLocaleString("es-AR")}
              </span>
              <span className="text-[10px] font-semibold text-[#9E734E]">c/IVA</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
