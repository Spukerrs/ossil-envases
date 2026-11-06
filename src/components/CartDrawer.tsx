"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Store,
  Ticket,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { STORE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectThreadFilter?: (thread: string) => void;
}

export function CartDrawer({ isOpen, onClose, onSelectThreadFilter }: CartDrawerProps) {
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

  // Código de voucher express aleatorio pero estable por sesión
  const expressVoucherCode = useMemo(() => {
    return `OS-${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  // Inteligencia de cruce de compatibilidad de roscas
  const threadAnalysis = useMemo(() => {
    const threadMap: Record<string, { bottles: number; accessories: number }> = {};

    items.forEach((item) => {
      const thread = item.product.neckThread;
      if (!thread || thread === "N/A") return;

      if (!threadMap[thread]) {
        threadMap[thread] = { bottles: 0, accessories: 0 };
      }

      if (item.product.category === "accesorios") {
        threadMap[thread].accessories += item.quantity;
      } else {
        threadMap[thread].bottles += item.quantity;
      }
    });

    const issues: Array<{
      thread: string;
      bottles: number;
      accessories: number;
      type: "missing" | "unbalanced";
    }> = [];

    let hasMatches = false;

    Object.entries(threadMap).forEach(([thread, data]) => {
      if (data.bottles > 0 && data.accessories === 0) {
        issues.push({
          thread,
          bottles: data.bottles,
          accessories: 0,
          type: "missing",
        });
      } else if (data.bottles > 0 && data.accessories < data.bottles) {
        issues.push({
          thread,
          bottles: data.bottles,
          accessories: data.accessories,
          type: "unbalanced",
        });
      } else if (data.bottles > 0 && data.accessories >= data.bottles) {
        hasMatches = true;
      }
    });

    return { issues, hasMatches };
  }, [items]);

  if (!isOpen) return null;

  const total = getTotalAmount();
  const totalItems = getTotalItemsCount();

  const handleSendWhatsApp = () => {
    const encoded = generateWhatsAppMessage({
      name: customerName,
      deliveryMethod,
      paymentMethod,
    });
    // WhatsApp comercial directo (+54 351 811-1868)
    window.open(`https://wa.me/${STORE_CONFIG.contact.whatsappClean}?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro backdrop accesible */}
      <button
        type="button"
        aria-label="Cerrar pedido"
        className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-xs transition-opacity cursor-default border-none p-0"
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
              <span className="text-xs text-[#66615B]">{totalItems} unidades en el carrito</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#66615B] hover:text-[#141413] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Productos con Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Alertas Inteligentes de Compatibilidad de Roscas */}
            {items.length > 0 && threadAnalysis.issues.length > 0 && (
              <div className="space-y-2">
                {threadAnalysis.issues.map((issue) => (
                  <div
                    key={issue.thread}
                    className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        {issue.type === "missing"
                          ? `Atención Boca ${issue.thread}: Envases sin tapas`
                          : `Boca ${issue.thread}: Cantidad despareja`}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      {issue.type === "missing"
                        ? `Llevás ${issue.bottles} frascos boca ${issue.thread} pero no agregaste tapas ni válvulas compatibles.`
                        : `Tenés ${issue.bottles} frascos y ${issue.accessories} tapas compatibles con rosca ${issue.thread}. Te faltan ${issue.bottles - issue.accessories} para cerrar el combo.`}
                    </p>
                    {onSelectThreadFilter && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectThreadFilter(issue.thread);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-[#835C3A] underline hover:text-[#141413] block pt-1 cursor-pointer"
                      >
                        Ver accesorios con boca {issue.thread} →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 &&
              threadAnalysis.issues.length === 0 &&
              threadAnalysis.hasMatches && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[11px]">
                    Roscas y accesorios 100% compatibles y emparejados.
                  </span>
                </div>
              )}

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
                            ? `Boca ${item.product.neckThread}`
                            : item.product.material}
                        </span>
                        <h4 className="text-xs font-bold text-[#141413] leading-snug">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-[#66615B] block mt-0.5">
                          {item.product.finish} • {item.product.capacity}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 rounded-lg text-[#8C827A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selector de Cantidad y Precios */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE4]">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#E6E2DC] rounded-lg bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-[#66615B] hover:text-[#141413] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold px-3 text-[#141413]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-[#66615B] hover:text-[#141413] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#66615B]">unidades</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-[#141413] block">
                          ${subtotal.toLocaleString("es-AR")}
                        </span>
                        <span className="text-[10px] text-[#66615B]">
                          ${unitPrice.toLocaleString("es-AR")} u.
                          {discountPct > 0 && (
                            <span className="text-[#B45309] font-bold ml-1">(-{discountPct}%)</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Alerta de Incentivo de Escala Mayorista (Upsell) */}
                    {nextTier && (
                      <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[10px] text-amber-900 flex items-center justify-between">
                        <span>
                          Sumá <strong>{nextTier.neededUnits} u. más</strong> para desbloquear{" "}
                          <strong>{nextTier.targetDiscountPct}% OFF</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, nextTier.targetTierQty)}
                          className="font-bold underline text-[#9E734E] hover:text-[#835C3A] ml-2 cursor-pointer"
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
                  <label
                    htmlFor="cart-customer-name"
                    className="text-xs font-bold text-[#141413] block mb-1"
                  >
                    Tu Nombre o Empresa / Emprendimiento:
                  </label>
                  <input
                    id="cart-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Laboratorio Alquimia / Sofía"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                  />
                </div>

                {/* Modalidad de Entrega */}
                <div>
                  <span className="text-xs font-bold text-[#141413] block mb-1">
                    Modalidad de Entrega:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("LOCAL")}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                        deliveryMethod === "LOCAL"
                          ? "bg-[#FFFFFF] border-[#9E734E] ring-2 ring-[#9E734E]/20 shadow-2xs"
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
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                        deliveryMethod === "ENVIO"
                          ? "bg-[#FFFFFF] border-[#9E734E] ring-2 ring-[#9E734E]/20 shadow-2xs"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#141413]">
                        <Truck className="w-3.5 h-3.5 text-[#9E734E]" />
                        <span>Envío por Expreso</span>
                      </div>
                      <span className="text-[10px] text-[#66615B] mt-1">
                        Interior / Todo el País
                      </span>
                    </button>
                  </div>

                  {/* Detalle Operativo de Retiro en Local sin LOCATION_DATA */}
                  {deliveryMethod === "LOCAL" ? (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] text-xs text-[#141413] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-[#9E734E]">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Pase Express Mostrador:</span>
                        </span>
                        <span className="font-mono font-bold text-xs bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E2DC]">
                          {expressVoucherCode}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-[#66615B]">
                        <MapPin className="w-3.5 h-3.5 text-[#9E734E] shrink-0 mt-0.5" />
                        <span>Oncativo 69, Local 1 (Córdoba Capital, Centro)</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-[#66615B]">
                        <Clock className="w-3.5 h-3.5 text-[#9E734E] shrink-0 mt-0.5" />
                        <span>Lun a Vie: 08:00 a 17:15 hs | Sáb: 09:00 a 13:30 hs</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] text-xs text-[#66615B]">
                      <p className="text-[11px]">
                        📦 Despachamos vía expresos (Vía Cargo, Andreani, Credifin o comisionista a
                        elección). El costo de flete se cotiza al armar el bulto.
                      </p>
                    </div>
                  )}
                </div>

                {/* Medio de Pago */}
                <div>
                  <span className="text-xs font-bold text-[#141413] block mb-1">
                    Preferencia de Pago:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("TRANSFERENCIA")}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === "TRANSFERENCIA"
                          ? "bg-[#FFFFFF] border-[#9E734E] font-bold text-[#141413] ring-1 ring-[#9E734E]/30"
                          : "bg-[#F3EFEA] border-transparent text-[#66615B]"
                      }`}
                    >
                      Transferencia (0% Recargo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("TARJETA")}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === "TARJETA"
                          ? "bg-[#FFFFFF] border-[#9E734E] font-bold text-[#141413] ring-1 ring-[#9E734E]/30"
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
                <span className="text-xs uppercase font-bold text-[#66615B]">Total Estimado:</span>
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
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
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
