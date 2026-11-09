"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Minus,
  Plus,
  Sparkles,
  Store,
  Ticket,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PRODUCTS_SEED } from "@/data/catalog";
import { STORE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/catalog";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectThreadFilter?: (thread: string) => void;
}

export function CartDrawer({ isOpen, onClose, onSelectThreadFilter }: CartDrawerProps) {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getItemUnitPrice,
    getItemDiscountPct,
    getItemSubtotal,
    getNextTierInfo,
    getTotalAmount,
    getTotalSavings,
    getIvaAmount,
    getTotalWithIva,
    getTotalItemsCount,
    hasManualQuoteItems,
    generateWhatsAppMessage,
  } = useCartStore();

  const authUser = useAuthStore((s) => s.user);

  const [deliveryMethod, setDeliveryMethod] = useState<"LOCAL" | "ENVIO">("LOCAL");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFERENCIA" | "TARJETA">("TRANSFERENCIA");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  // Selección preferida de tapa por cada rosca con faltante
  const [selectedCapByThread, setSelectedCapByThread] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authUser && !customerName) {
      setCustomerName(authUser.fullName);
    }
  }, [authUser, customerName]);

  // Código de voucher express estable por sesión
  const expressVoucherCode = useMemo(() => {
    return `OS-${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  // Inteligencia de cruce de compatibilidad de roscas + sugerencia automática de tapas
  const threadAnalysis = useMemo(() => {
    const threadMap: Record<
      string,
      { bottles: number; accessories: number; bottleNames: string[] }
    > = {};

    for (const item of items) {
      const thread = item.product.neckThread;
      if (!thread || thread === "N/A") continue;

      if (!threadMap[thread]) {
        threadMap[thread] = { bottles: 0, accessories: 0, bottleNames: [] };
      }

      if (item.product.category === "accesorios") {
        threadMap[thread].accessories += item.quantity;
      } else {
        threadMap[thread].bottles += item.quantity;
        threadMap[thread].bottleNames.push(item.product.name);
      }
    }

    const issues: Array<{
      thread: string;
      bottles: number;
      accessories: number;
      missingQty: number;
      bottleNames: string[];
      compatibleCaps: Product[];
      type: "missing" | "unbalanced";
    }> = [];

    let hasMatches = false;

    for (const [thread, data] of Object.entries(threadMap)) {
      if (data.bottles > 0 && data.accessories < data.bottles) {
        const compatibleCaps = PRODUCTS_SEED.filter(
          (p) => p.category === "accesorios" && p.neckThread === thread,
        );
        issues.push({
          thread,
          bottles: data.bottles,
          accessories: data.accessories,
          missingQty: data.bottles - data.accessories,
          bottleNames: data.bottleNames,
          compatibleCaps,
          type: data.accessories === 0 ? "missing" : "unbalanced",
        });
      } else if (data.bottles > 0 && data.accessories >= data.bottles) {
        hasMatches = true;
      }
    }

    return { issues, hasMatches };
  }, [items]);

  if (!isOpen) return null;

  const subtotalNeto = getTotalAmount();
  const totalSavings = getTotalSavings();
  const ivaAmount = getIvaAmount();
  const totalWithIva = getTotalWithIva();
  const totalItems = getTotalItemsCount();

  const handleAutoAddMissingCaps = (thread: string, missingQty: number, caps: Product[]) => {
    const chosenId = selectedCapByThread[thread];
    const targetCap = caps.find((c) => c.id === chosenId) || caps[0];
    if (!targetCap) return;

    addItem(targetCap, missingQty);
    toast.success(`¡Roscas emparejadas! +${missingQty} u. añadidas`, {
      description: `Se agregaron ${missingQty} u. de "${targetCap.name}" para cubrir tus envases boca ${thread}.`,
    });
  };

  const handleSendWhatsApp = () => {
    const encoded = generateWhatsAppMessage({
      name: customerName || authUser?.fullName,
      cuit: authUser?.cuit,
      businessName: authUser?.businessName,
      voucherCode: deliveryMethod === "LOCAL" ? expressVoucherCode : undefined,
      deliveryMethod,
      paymentMethod,
      notes: customerNotes,
    });
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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md liquid-glass-strong border-l border-white/80 shadow-2xl flex flex-col justify-between">
          {/* Cabecera del Drawer */}
          <div className="p-5 border-b border-[#E6E2DC]/80 bg-white/80 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#141413] flex items-center gap-2">
                <span>Mi Pedido Mayorista / Minorista</span>
              </h2>
              <span className="text-xs text-[#66615B]">
                {totalItems} unidades • Precios con escala + IVA (21%)
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar carrito"
              className="p-2 rounded-xl frosted-well text-[#66615B] hover:text-[#141413] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Productos y Resumen con Scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Alertas Inteligentes de Compatibilidad con AUTO-AGREGADO EN 1 CLIC */}
            {items.length > 0 && threadAnalysis.issues.length > 0 && (
              <div className="space-y-2.5">
                {threadAnalysis.issues.map((issue) => {
                  const chosenId = selectedCapByThread[issue.thread];
                  const selectedCap =
                    issue.compatibleCaps.find((c) => c.id === chosenId) || issue.compatibleCaps[0];

                  // Calcular precio estimado de las tapas faltantes aplicando su escala
                  const capTier = selectedCap
                    ? [...selectedCap.priceTiers]
                        .sort((a, b) => b.minQty - a.minQty)
                        .find((t) => issue.missingQty >= t.minQty)
                    : null;
                  const capUnitNet = selectedCap
                    ? capTier
                      ? capTier.unitPrice
                      : selectedCap.basePrice
                    : 0;
                  const capSubtotalNet = capUnitNet * issue.missingQty;

                  return (
                    <div
                      key={issue.thread}
                      className="p-3.5 rounded-2xl bg-amber-50/95 border border-amber-300/80 text-amber-950 text-xs space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-black text-amber-900">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            {issue.type === "missing"
                              ? `Faltan ${issue.missingQty} cierres Boca ${issue.thread}`
                              : `Faltan ${issue.missingQty} cierres para igualar Boca ${issue.thread}`}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/70 text-amber-900">
                          {issue.accessories}/{issue.bottles} u.
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-amber-900/90">
                        {issue.type === "missing"
                          ? `Tenés ${issue.bottles} envase(s) con rosca ${issue.thread} sin tapas o válvulas asociadas.`
                          : `Llevás ${issue.bottles} envases y ${issue.accessories} cierres rosca ${issue.thread}. Sumá los ${issue.missingQty} restantes automáticamente:`}
                      </p>

                      {issue.compatibleCaps.length > 0 && selectedCap ? (
                        <div className="space-y-2 pt-1">
                          {issue.compatibleCaps.length > 1 && (
                            <div>
                              <label
                                htmlFor={`cap-select-${issue.thread}`}
                                className="text-[10px] font-bold uppercase text-amber-900/80 block mb-1"
                              >
                                Elegir tipo de tapa / válvula compatible ({issue.thread}):
                              </label>
                              <select
                                id={`cap-select-${issue.thread}`}
                                value={selectedCap.id}
                                onChange={(e) =>
                                  setSelectedCapByThread((prev) => ({
                                    ...prev,
                                    [issue.thread]: e.target.value,
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                              >
                                {issue.compatibleCaps.map((cap) => (
                                  <option key={cap.id} value={cap.id}>
                                    {cap.name} (${cap.basePrice.toLocaleString("es-AR")} base)
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleAutoAddMissingCaps(
                                issue.thread,
                                issue.missingQty,
                                issue.compatibleCaps,
                              )
                            }
                            className="w-full py-2.5 px-3 rounded-xl bg-[#141413] hover:bg-[#9E734E] text-white text-xs font-bold flex items-center justify-between gap-2 transition-all active:scale-98 cursor-pointer shadow-xs"
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">
                                Añadir {issue.missingQty} u. de {selectedCap.name}
                              </span>
                            </span>
                            <span className="font-mono text-[11px] bg-white/15 px-2 py-0.5 rounded shrink-0">
                              +${capSubtotalNet.toLocaleString("es-AR")}
                            </span>
                          </button>
                        </div>
                      ) : (
                        onSelectThreadFilter && (
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
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {items.length > 0 &&
              threadAnalysis.issues.length === 0 &&
              threadAnalysis.hasMatches && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-[11px]">
                    Roscas y tapas 100% compatibles y emparejadas en cantidad.
                  </span>
                </div>
              )}

            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#66615B]">
                <div className="w-16 h-16 rounded-2xl frosted-well flex items-center justify-center mb-3">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-bold text-[#141413]">Tu pedido está vacío</h3>
                <p className="text-xs max-w-xs mt-1">
                  Explorá el catálogo y seleccioná envases con descuentos mayoristas automáticos.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const discountPct = getItemDiscountPct(item);
                const subtotal = getItemSubtotal(item);
                const nextTier = getNextTierInfo(item);

                return (
                  <div key={item.product.id} className="p-4 rounded-2xl liquid-glass space-y-3">
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
                          SKU: {item.product.sku} • {item.product.capacity}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 rounded-lg text-[#8C827A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar artículo"
                        aria-label={`Eliminar ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selector de Cantidad y Precios Netos */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E6E2DC]/70">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#E6E2DC] rounded-lg bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-[#66615B] hover:text-[#141413] cursor-pointer"
                            aria-label="Restar unidad"
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
                            aria-label="Sumar unidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#66615B]">u.</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-[#141413] block">
                          ${subtotal.toLocaleString("es-AR")}{" "}
                          <span className="text-[9px] font-normal text-[#66615B]">neto</span>
                        </span>
                        <span className="text-[10px] text-[#66615B]">
                          ${unitPrice.toLocaleString("es-AR")} c/u
                          {discountPct > 0 && (
                            <span className="text-[#B45309] font-bold ml-1">(-{discountPct}%)</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Alerta de Incentivo de Escala Mayorista (Upsell) */}
                    {nextTier && (
                      <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 text-[10px] text-amber-900 flex items-center justify-between">
                        <span>
                          Sumá <strong>{nextTier.neededUnits} u. más</strong> para{" "}
                          <strong>-{nextTier.targetDiscountPct}% OFF</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, nextTier.targetTierQty)}
                          className="font-bold underline text-[#9E734E] hover:text-[#835C3A] ml-2 cursor-pointer"
                        >
                          Subir a {nextTier.targetTierQty}u
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Configuración de Entrega, Pago y Resumen Pre-WhatsApp */}
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2DC] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
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
                          ? "bg-white border-[#9E734E] ring-2 ring-[#9E734E]/20 shadow-2xs"
                          : "frosted-well text-[#66615B]"
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
                          ? "bg-white border-[#9E734E] ring-2 ring-[#9E734E]/20 shadow-2xs"
                          : "frosted-well text-[#66615B]"
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

                  {deliveryMethod === "LOCAL" ? (
                    <div className="mt-2.5 p-3 rounded-xl frosted-well text-xs text-[#141413] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-[#9E734E]">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Pase Express Mostrador:</span>
                        </span>
                        <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-[#E6E2DC]">
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
                    <div className="mt-2.5 p-3 rounded-xl frosted-well text-xs text-[#66615B]">
                      <p className="text-[11px]">
                        📦 Despachamos vía expresos (Vía Cargo, Andreani, Credifin o comisionista a
                        elección). El flete se abona en destino o al despachar.
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
                          ? "bg-white border-[#9E734E] font-bold text-[#141413] ring-1 ring-[#9E734E]/30"
                          : "frosted-well text-[#66615B]"
                      }`}
                    >
                      Transferencia (0% Recargo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("TARJETA")}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === "TARJETA"
                          ? "bg-white border-[#9E734E] font-bold text-[#141413] ring-1 ring-[#9E734E]/30"
                          : "frosted-well text-[#66615B]"
                      }`}
                    >
                      Tarjeta / Billetera
                    </button>
                  </div>
                </div>

                {/* Mensaje o Aclaración Extra para el Vendedor */}
                <div>
                  <label
                    htmlFor="customer-notes"
                    className="text-xs font-bold text-[#141413] flex items-center justify-between mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#9E734E]" />
                      Mensaje extra para el vendedor (opcional):
                    </span>
                    <span className="text-[10px] text-[#8C827A] font-normal">Máx. 250 car.</span>
                  </label>
                  <textarea
                    id="customer-notes"
                    rows={2}
                    maxLength={250}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Ej: ¿Tienen factura A? Horario en que puedo pasar a retirar, o indicaciones del transporte..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E6E2DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#9E734E]/30 focus:border-[#9E734E] text-[#141413] placeholder:text-[#A8A29E] transition-all resize-none"
                  />
                </div>

                {/* DETALLE COMPLETO PRE-ENVÍO A WHATSAPP CON DESGLOSE DE IVA */}
                <div className="p-4 rounded-2xl frosted-well space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-2">
                    <span className="font-black uppercase tracking-wider text-[#141413] flex items-center gap-1.5 text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-[#9E734E]" />
                      Detalle de lo que vas a comprar
                    </span>
                    <span className="font-mono text-[10px] text-[#66615B]">
                      {authUser?.cuit ? `Factura A (${authUser.cuit})` : "Consumidor Final / B"}
                    </span>
                  </div>

                  {/* Renglones resumidos */}
                  <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1 divide-y divide-[#E6E2DC]/50">
                    {items.map((item) => {
                      const sub = getItemSubtotal(item);
                      return (
                        <li
                          key={`summary-${item.product.id}`}
                          className="pt-1.5 first:pt-0 flex items-start justify-between gap-2 text-[11px]"
                        >
                          <span className="text-[#4A4742] leading-snug">
                            <strong className="font-mono text-[#141413]">{item.quantity}x</strong>{" "}
                            {item.product.name}
                            {item.product.neckThread !== "N/A" && (
                              <span className="text-[#9E734E] font-mono">
                                {" "}
                                [{item.product.neckThread}]
                              </span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-[#141413] shrink-0">
                            ${sub.toLocaleString("es-AR")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Subtotales e Impuestos */}
                  <div className="pt-2.5 border-t border-[#DCD6C9] space-y-1 text-xs">
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                        <span>Ahorro por escala mayorista:</span>
                        <span className="font-mono">-${totalSavings.toLocaleString("es-AR")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#57534E]">
                      <span>Subtotal Neto (sin IVA):</span>
                      <span className="font-mono font-semibold">
                        ${subtotalNeto.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#57534E]">
                      <span>IVA (21%):</span>
                      <span className="font-mono font-semibold">
                        ${ivaAmount.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pie Fijo con Total Final c/IVA y Envío a WhatsApp */}
          {items.length > 0 && (
            <div className="p-5 bg-white/95 border-t border-[#E6E2DC] space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-black text-[#141413] block">
                    Total Final (IVA 21% Incluido)
                  </span>
                  <span className="text-[10px] text-[#66615B]">
                    Neto ${subtotalNeto.toLocaleString("es-AR")} + IVA $
                    {ivaAmount.toLocaleString("es-AR")}
                  </span>
                </div>
                <span className="font-mono text-2xl font-black text-[#141413]">
                  ${totalWithIva.toLocaleString("es-AR")}
                </span>
              </div>

              {hasManualQuoteItems() && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  ⚠️ Incluye artículos especiales cuya cotización final confirma el asesor.
                </p>
              )}

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-97 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Orden Detallada a WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-[#8C827A]">
                Se enviará el detalle completo con SKU, roscas e IVA discriminado al{" "}
                {STORE_CONFIG.contact.phoneDisplay}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
