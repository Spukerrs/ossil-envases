"use client";

import { useState } from "react";
import { Product } from "@/types/catalog";
import { useCartStore } from "@/store/useCartStore";
import { Check, Plus, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onFilterThread?: (thread: string) => void;
}

export function ProductCard({ product, onFilterThread }: ProductCardProps) {
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

  const handleAdd = () => {
    addItem(product, selectedQty);
    toast.success(
      `Agregaste ${selectedQty} u. de ${product.name}`,
      {
        description: `Subtotal: $${subtotal.toLocaleString("es-AR")} ${
          discountPct > 0 ? `(${discountPct}% OFF aplicado)` : ""
        }`,
      }
    );
  };

  return (
    <div className="group relative flex flex-col justify-between bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] hover:border-[#9E734E]/60 transition-all duration-200 hover:shadow-md p-5">
      {/* Cabecera de la tarjeta: Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#F3EFEA] text-[#141413] border border-[#E0D9CE]">
              {product.neckThread !== "N/A" ? `BOCA ${product.neckThread}` : product.material}
            </span>
            <span className="text-[11px] font-medium text-[#66615B] px-2 py-0.5 rounded-md bg-[#FAF8F5]">
              {product.capacity}
            </span>
          </div>

          {product.badge && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#B45309] text-white">
              {product.badge}
            </span>
          )}
        </div>

        {/* Acabado Visual y Nombre */}
        <div className="my-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E734E]">
            {product.finish}
          </span>
          <h3 className="text-base font-bold text-[#141413] leading-snug group-hover:text-[#9E734E] transition-colors mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-[#66615B] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Compatibilidad de Roscas Clickable */}
        {product.neckThread !== "N/A" && onFilterThread && (
          <button
            onClick={() => onFilterThread(product.neckThread)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#835C3A] hover:text-[#141413] mt-2 py-1 px-2 rounded-lg bg-[#FAF8F5] border border-dashed border-[#DCD6C9] transition-colors w-full justify-center"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver tapas y válvulas {product.neckThread} compatibles</span>
          </button>
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
                onClick={() => setShowTiers(!showTiers)}
                className="text-[11px] font-bold text-[#9E734E] underline hover:text-[#835C3A]"
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
                    className={`flex flex-col items-center py-1.5 rounded-lg border text-center transition-all ${
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
                  <div
                    key={t.minQty}
                    className="flex justify-between items-center text-[#141413]"
                  >
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

        {/* Precio Total y Botón Agregar */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#66615B] block">
              Unitario: ${effectiveUnitPrice.toLocaleString("es-AR")}
            </span>
            <span className="font-mono text-lg font-black text-[#141413]">
              ${subtotal.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
