"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, Plus, Minus, MessageCircle, Store, Truck, AlertCircle, Sparkles } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    getItemUnitPrice,
    getItemDiscountPct,
    getItemSubtotal,
    getNextTierInfo,
    getTotalAmount,
    getTotalItemsCount,
    hasManualQuoteItems,
    generateWhatsAppMessage,
  } = useCartStore();

  const [deliveryMethod, setDeliveryMethod] = useState<"LOCAL" | "ENVIO">("LOCAL");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFERENCIA" | "TARJETA">("TRANSFERENCIA");
  const [customerName, setCustomerName] = useState<string>("");

  if (!isOpen) return null;

  const total = getTotalAmount();
  const totalItems = getTotalItemsCount();

  const handleSendWhatsApp = () => {
    const encoded = generateWhatsAppMessage({
      name: customerName,
      deliveryMethod,
      paymentMethod,
    });
    // WhatsApp oficial de OSSIL Envases Córdoba
    window.open(`https://wa.me/5493512440156?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E6E2DC] shadow-2xl flex flex-col justify-between">
          {/* Cabecera del Drawer */}
          <div className="p-6 border-b border-[#E6E2DC] bg-[#FFFFFF] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#141413] flex items-center gap-2">
                <span>Mi Pedido Mayorista / Minorista</span>
              </h2>
              <span className="text-xs text-[#66615B]">
                {totalItems} unidades en el carrito
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#66615B] hover:text-[#141413] hover:bg-[#F3EFEA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Productos con Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#66615B]">
                <div className="w-16 h-16 rounded-full bg-[#EBE7DF] flex items-center justify-center mb-3">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-bold text-[#141413]">El pedido está vacío</h3>
                <p className="text-xs max-w-xs mt-1">
                  Explorá el catálogo y seleccioná envases con sus escalas de descuento.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const discountPct = getItemDiscountPct(item);
                const subtotal = getItemSubtotal(item);
                const nextTier = getNextTierInfo(item);

                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#9E734E] uppercase">
                          {item.product.neckThread !== "N/A"
                            ? `Rosca ${item.product.neckThread}`
                            : item.product.material}
                        </span>
                        <h4 className="text-xs font-bold text-[#141413] leading-snug">
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[#A8A29E] hover:text-rose-600 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Precios y Cantidad */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-[#E6E2DC] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-[#EBE7DF] text-[#141413] transition-colors rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs font-bold text-[#141413]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-[#EBE7DF] text-[#141413] transition-colors rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#141413] block">
                          ${subtotal.toLocaleString("es-AR")}
                        </span>
                        <span className="text-[10px] text-[#66615B]">
                          ${unitPrice.toLocaleString("es-AR")} c/u{" "}
                          {discountPct > 0 && (
                            <span className="text-[#B45309] font-bold">
                              (-{discountPct}%)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Alerta de Incentivo de Escala Mayorista (Upsell) */}
                    {nextTier && (
                      <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[10px] text-amber-900 flex items-center justify-between">
                        <span>
                          Sumá <strong>{nextTier.neededUnits} u. más</strong> para desbloquear <strong>{nextTier.targetDiscountPct}% OFF</strong>
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, nextTier.targetTierQty)
                          }
                          className="font-bold underline text-[#9E734E] hover:text-[#835C3A] ml-2"
                        >
                          Saltar a {nextTier.targetTierQty}u
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Configuración de Entrega y Pago */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-[#E6E2DC] space-y-4">
                {/* Nombre de Cliente */}
                <div>
                  <label className="text-xs font-bold text-[#141413] block mb-1">
                    Tu Nombre o Empresa / Emprendimiento:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Laboratorio Alquimia / Sofía"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                  />
                </div>

                {/* Modalidad de Entrega */}
                <div>
                  <label className="text-xs font-bold text-[#141413] block mb-1">
                    Modalidad de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("LOCAL")}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                        deliveryMethod === "LOCAL"
                          ? "bg-[#FFFFFF] border-[#9E734E] shadow-2xs"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#141413]">
                        <Store className="w-3.5 h-3.5 text-[#9E734E]" />
                        <span>Retiro en Local</span>
                      </div>
                      <span className="text-[10px] text-[#66615B] mt-1">
                        Oncativo 69 (Sin cola)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("ENVIO")}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                        deliveryMethod === "ENVIO"
                          ? "bg-[#FFFFFF] border-[#9E734E] shadow-2xs"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#141413]">
                        <Truck className="w-3.5 h-3.5 text-[#9E734E]" />
                        <span>Envío por Expreso</span>
                      </div>
                      <span className="text-[10px] text-[#66615B] mt-1">
                        Interior / País
                      </span>
                    </button>
                  </div>
                </div>

                {/* Medio de Pago */}
                <div>
                  <label className="text-xs font-bold text-[#141413] block mb-1">
                    Preferencia de Pago:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("TRANSFERENCIA")}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        paymentMethod === "TRANSFERENCIA"
                          ? "bg-[#FFFFFF] border-[#9E734E] font-bold text-[#141413]"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      Transferencia (0% Recargo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("TARJETA")}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        paymentMethod === "TARJETA"
                          ? "bg-[#FFFFFF] border-[#9E734E] font-bold text-[#141413]"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      Tarjeta / Billetera
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pie del Carrito con Checkout a WhatsApp */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FFFFFF] border-t border-[#E6E2DC] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase font-bold text-[#66615B]">
                  Total Estimado:
                </span>
                <span className="font-mono text-2xl font-black text-[#141413]">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>

              {hasManualQuoteItems() && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  ⚠️ Incluye artículos que requieren cotización final por asesor.
                </p>
              )}

              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Pedido a WhatsApp Oficial</span>
              </button>

              <p className="text-[10px] text-center text-[#8C827A]">
                Te atenderá un vendedor de OSSIL Envases en Córdoba con tu lista codificada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
