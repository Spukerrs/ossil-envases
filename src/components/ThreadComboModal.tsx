"use client";

import { ArrowRight, Check, Layers, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS_SEED } from "@/data/catalog";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/catalog";

interface ThreadComboModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export function ThreadComboModal({ product, isOpen, onClose, onOpenCart }: ThreadComboModalProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [bottleQty, setBottleQty] = useState<number>(25);
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(null);
  const [accessoryQty, setAccessoryQty] = useState<number>(25);

  if (!isOpen || !product) return null;

  // Filtrar accesorios compatibles con la rosca exacta del envase
  const compatibleAccessories = PRODUCTS_SEED.filter(
    (p) =>
      p.category === "accesorios" && p.neckThread === product.neckThread && p.id !== product.id,
  );

  // Calcular precio del envase según escala
  const getUnitPrice = (p: Product, qty: number) => {
    if (p.requiresManualQuote || !p.priceTiers.length) return p.basePrice;
    const sorted = [...p.priceTiers].sort((a, b) => b.minQty - a.minQty);
    const tier = sorted.find((t) => qty >= t.minQty);
    return tier ? tier.unitPrice : p.basePrice;
  };

  const getDiscountPct = (p: Product, qty: number) => {
    if (p.requiresManualQuote || !p.priceTiers.length) return 0;
    const sorted = [...p.priceTiers].sort((a, b) => b.minQty - a.minQty);
    const tier = sorted.find((t) => qty >= t.minQty);
    return tier ? tier.discountPct : 0;
  };

  const bottleUnitPrice = getUnitPrice(product, bottleQty);
  const bottleDiscount = getDiscountPct(product, bottleQty);
  const bottleSubtotal = bottleUnitPrice * bottleQty;

  const accessoryUnitPrice = selectedAccessory ? getUnitPrice(selectedAccessory, accessoryQty) : 0;
  const accessorySubtotal = selectedAccessory ? accessoryUnitPrice * accessoryQty : 0;

  const grandTotal = bottleSubtotal + accessorySubtotal;

  const handleAddCombo = () => {
    // Agregar frasco
    addItem(product, bottleQty);

    // Agregar accesorio si fue seleccionado
    if (selectedAccessory && accessoryQty > 0) {
      addItem(selectedAccessory, accessoryQty);
      toast.success(`Combo rosca ${product.neckThread} armado con éxito`, {
        description: `${bottleQty}u. ${product.name} + ${accessoryQty}u. ${selectedAccessory.name}`,
      });
    } else {
      toast.success(`Agregaste ${bottleQty}u. de ${product.name}`);
    }

    onClose();
    onOpenCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl border border-[#E6E2DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#E6E2DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9E734E]/15 border border-[#9E734E]/30 flex items-center justify-center text-[#9E734E]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#141413] text-white">
                  ROSCA {product.neckThread}
                </span>
                <span className="text-[11px] font-bold text-[#9E734E] uppercase tracking-wider">
                  Match 100% Garantizado
                </span>
              </div>
              <h2 className="text-lg font-black text-[#141413] mt-1">
                Armar Combo con Tapa Compatible
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#66615B] hover:text-[#141413] hover:bg-[#EBE7DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Paso 1: Configurar Envase */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2DC] space-y-3">
            <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase tracking-wider block">
              Paso 1: Envase Seleccionado
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#141413] text-sm">{product.name}</h3>
                <span className="text-xs text-[#66615B]">
                  Capacidad: {product.capacity} • Acabado: {product.finish}
                </span>
              </div>

              {/* Selector de cantidad de envases con botones de escala */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#66615B]">Cantidad:</span>
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => {
                        setBottleQty(qty);
                        if (selectedAccessory) setAccessoryQty(qty);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        bottleQty === qty
                          ? "bg-[#141413] text-white"
                          : "bg-[#FFFFFF] text-[#66615B] border border-[#E6E2DC] hover:text-[#141413]"
                      }`}
                    >
                      {qty}u
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    value={bottleQty}
                    onChange={(e) =>
                      setBottleQty(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] text-xs font-mono text-center font-bold text-[#141413]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EBE7DF] flex items-center justify-between text-xs">
              <span className="text-[#66615B]">
                Precio unitario envase:{" "}
                <strong className="text-[#141413] font-mono">
                  ${bottleUnitPrice.toLocaleString("es-AR")}
                </strong>
                {bottleDiscount > 0 && (
                  <span className="text-emerald-700 font-bold ml-1">
                    ({bottleDiscount}% OFF aplicado)
                  </span>
                )}
              </span>
              <span className="font-bold text-[#141413] font-mono">
                Subtotal: ${bottleSubtotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Paso 2: Seleccionar Tapa o Válvula Compatible */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase tracking-wider block">
                  Paso 2: Elegí tu Tapa o Válvula (Boca {product.neckThread})
                </span>
                <p className="text-xs text-[#66615B]">
                  Solo mostramos accesorios que coinciden milimétricamente con este envase.
                </p>
              </div>

              {selectedAccessory && (
                <button
                  type="button"
                  onClick={() => setSelectedAccessory(null)}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Quitar tapa
                </button>
              )}
            </div>

            {compatibleAccessories.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-dashed border-[#E6E2DC] text-center text-xs text-[#66615B]">
                Actualmente no hay tapas sueltas registradas para la rosca {product.neckThread}.
                Podés solicitar cotización de accesorios a medida.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compatibleAccessories.map((acc) => {
                  const isSelected = selectedAccessory?.id === acc.id;
                  const accPrice = getUnitPrice(acc, accessoryQty);
                  const accDisc = getDiscountPct(acc, accessoryQty);

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setSelectedAccessory(acc);
                        setAccessoryQty(bottleQty);
                      }}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FAF8F5] border-[#9E734E] ring-2 ring-[#9E734E]/20 shadow-xs"
                          : "bg-[#FFFFFF] border-[#E6E2DC] hover:border-[#9E734E]/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#9E734E] uppercase">
                            Boca {acc.neckThread}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              isSelected ? "bg-[#9E734E] text-white" : "border border-[#D4CEBF]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-[#141413] leading-snug">
                          {acc.name}
                        </h4>
                        <span className="text-[11px] text-[#66615B] mt-0.5 block">
                          {acc.finish}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#F0ECE4] flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#141413]">
                          ${accPrice.toLocaleString("es-AR")}
                          {accDisc > 0 && (
                            <span className="text-[10px] text-emerald-700 ml-1">(-{accDisc}%)</span>
                          )}
                        </span>
                        <span className="text-[10px] text-[#8C827A]">Escalas hasta 100u</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ajuste de cantidad del accesorio si está seleccionado */}
          {selectedAccessory && (
            <div className="p-4 rounded-2xl bg-[#EBE7DF]/50 border border-[#DCD6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#141413] block">
                  Cantidad de {selectedAccessory.name}:
                </span>
                <span className="text-[11px] text-[#66615B]">
                  Recomendado: igualar las {bottleQty} unidades de frascos.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAccessoryQty(bottleQty)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#D4CEBF] text-xs font-bold text-[#141413] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Igualar a {bottleQty}u
                </button>
                <input
                  type="number"
                  min="1"
                  value={accessoryQty}
                  onChange={(e) =>
                    setAccessoryQty(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                  }
                  className="w-16 px-2 py-1 rounded-lg border border-[#D4CEBF] bg-[#FFFFFF] text-xs font-mono text-center font-bold text-[#141413]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer y CTA Final */}
        <div className="p-6 bg-[#FAF8F5] border-t border-[#E6E2DC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#66615B] block">Total Combo Estimado:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-[#141413]">
                ${grandTotal.toLocaleString("es-AR")}
              </span>
              <span className="text-xs text-[#8C827A]">
                ({bottleQty} frascos {selectedAccessory ? `+ ${accessoryQty} tapas` : "sin tapa"})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs font-bold text-[#66615B] hover:text-[#141413] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddCombo}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#141413] hover:bg-[#2B2B28] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <span>Agregar Combo al Pedido</span>
              <ArrowRight className="w-4 h-4 text-[#9E734E]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
