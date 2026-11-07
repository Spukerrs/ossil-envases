"use client";

import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  Layers,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ThreadInspectorDrawer } from "@/components/ThreadInspectorDrawer";
import { PRODUCTS_SEED } from "@/data/catalog";
import { IVA_RATE, STORE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = PRODUCTS_SEED.find((p) => p.id === id);

  const [quantity, setQuantity] = useState<number>(1);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [inspectedItem, setInspectedItem] = useState<Product | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    notFound();
  }

  // Encontrar accesorios o envases compatibles (mismo neckThread)
  const compatibleAccessories = useMemo(() => {
    if (product.neckThread === "N/A") return [];
    if (product.category === "accesorios") {
      return PRODUCTS_SEED.filter(
        (p) =>
          p.category !== "accesorios" && p.neckThread === product.neckThread && p.id !== product.id,
      );
    }
    return PRODUCTS_SEED.filter(
      (p) =>
        p.category === "accesorios" && p.neckThread === product.neckThread && p.id !== product.id,
    );
  }, [product]);

  // Productos relacionados de la misma categoría
  const relatedProducts = useMemo(() => {
    return PRODUCTS_SEED.filter(
      (p) => p.category === product.category && p.id !== product.id,
    ).slice(0, 4);
  }, [product]);

  // Calcular precio según la escala de volumen + IVA 21%
  const activeTier = [...product.priceTiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((t) => quantity >= t.minQty);

  const unitPrice = activeTier ? activeTier.unitPrice : product.basePrice;
  const discountPct = activeTier ? activeTier.discountPct : 0;
  const subtotalNeto = unitPrice * quantity;
  const ivaAmount = Math.round(subtotalNeto * IVA_RATE);
  const totalConIva = subtotalNeto + ivaAmount;
  const savings = Math.max(0, product.basePrice * quantity - subtotalNeto);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Agregaste ${quantity} u. al pedido`, {
      description: `${product.name} — Total c/IVA: $${totalConIva.toLocaleString("es-AR")}`,
    });
    setIsCartOpen(true);
  };

  const handleAddAccessory = (acc: Product) => {
    addItem(acc, quantity);
    toast.success(`Complemento agregado: ${acc.name}`, {
      description: `Se sumaron ${quantity} unidades compatibles con boca ${acc.neckThread}.`,
    });
    setIsCartOpen(true);
  };

  const openThreadInspector = (targetCompatible?: Product) => {
    setInspectedItem(targetCompatible || compatibleAccessories[0] || null);
    setInspectorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle flex flex-col justify-between selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
      <div>
        <Navbar activeUnit={product.businessUnit} onOpenCart={() => setIsCartOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          {/* Breadcrumb de Navegación Funcional */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#66615B] mb-6 flex-wrap"
          >
            <Link href="/" className="hover:text-[#141413] transition-colors font-bold">
              Bienvenida
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BDB2]" />
            <Link
              href={`/?unit=${product.businessUnit}`}
              className="hover:text-[#141413] transition-colors font-medium"
            >
              {product.businessUnit === "ENVASES" ? "Catálogo Envases" : "Catálogo Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BDB2]" />
            <span className="font-medium text-[#66615B]">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BDB2]" />
            <span className="font-bold text-[#141413] truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Fila Principal en Liquid Glass: Fotografía y Detalles Comerciales */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 liquid-glass rounded-3xl p-6 sm:p-10">
            {/* Columna Izquierda: Imagen del Producto */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="relative w-full aspect-4/3 rounded-2xl frosted-well overflow-hidden p-6 flex items-center justify-center group">
                {product.imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8C827A] space-y-2">
                    <Package className="w-16 h-16 text-[#9E734E]" />
                    <span className="font-mono text-xs uppercase font-bold">
                      {product.material} • {product.neckThread}
                    </span>
                  </div>
                )}

                {product.badge && (
                  <span className="absolute top-4 left-4 font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#B45309] text-white shadow-xs">
                    {product.badge}
                  </span>
                )}

                <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#57534E] liquid-glass px-2.5 py-0.5 rounded-md">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Badges Técnicos bajo la Fotografía (Boca/Rosca abre el Inspector Lateral) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl frosted-well">
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                    Material
                  </span>
                  <span className="text-xs font-bold text-[#141413]">{product.material}</span>
                </div>
                <div className="p-3 rounded-xl frosted-well">
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                    Capacidad
                  </span>
                  <span className="text-xs font-bold text-[#141413]">{product.capacity}</span>
                </div>
                {product.neckThread !== "N/A" ? (
                  <button
                    type="button"
                    onClick={() => openThreadInspector()}
                    className="p-3 rounded-xl frosted-well hover:border-[#9E734E] transition-all cursor-pointer group text-center"
                    title="Click para inspeccionar cómo es esta rosca y sus tapas"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#8C827A] block group-hover:text-[#141413]">
                      Boca / Rosca ↗
                    </span>
                    <span className="font-mono text-xs font-black text-[#9E734E] underline decoration-dotted underline-offset-2">
                      {product.neckThread}
                    </span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl frosted-well">
                    <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                      Boca / Rosca
                    </span>
                    <span className="font-mono text-xs font-black text-[#9E734E]">Estándar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Especificaciones, Escalas y Compra */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9E734E]">
                    {product.finish}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed pt-1">
                    {product.description}
                  </p>
                </div>

                {/* Tabla de Escalas Mayoristas Automáticas */}
                {product.priceTiers.length > 0 && (
                  <div className="p-4 rounded-2xl frosted-well space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                        Escalas de Precios Mayoristas (Neto):
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold">
                        Hasta -28% OFF por volumen
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                      {product.priceTiers.map((tier) => {
                        const isCurrent = quantity >= tier.minQty;
                        return (
                          <button
                            key={tier.minQty}
                            type="button"
                            onClick={() => setQuantity(tier.minQty)}
                            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#141413] text-white border-[#141413] shadow-xs"
                                : "bg-white/80 text-[#141413] border-[#E0D9CE] hover:border-[#9E734E]"
                            }`}
                          >
                            <span className="block font-mono text-[10px] text-[#A8A29E]">
                              +{tier.minQty} u.
                            </span>
                            <span className="font-mono font-bold block">
                              ${tier.unitPrice.toLocaleString("es-AR")}
                            </span>
                            {tier.discountPct > 0 && (
                              <span className="text-[10px] text-amber-500 font-bold block">
                                -{tier.discountPct}% OFF
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selector de Cantidad Dinámico y Total con IVA Discriminado */}
                <div className="p-5 rounded-2xl liquid-glass space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-xs text-[#66615B] block">
                        Precio Unitario Neto Aplicado:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-2xl font-black text-[#141413]">
                          ${unitPrice.toLocaleString("es-AR")}
                        </span>
                        <span className="text-[11px] text-[#66615B]">+ IVA</span>
                        {discountPct > 0 && (
                          <span className="text-xs text-emerald-700 font-bold">
                            ({discountPct}% OFF)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selector Numérico */}
                    <div className="flex items-center border border-[#DCD6C9] rounded-xl overflow-hidden bg-[#FAF8F5]">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 text-[#141413] hover:bg-[#EBE7DF] transition-colors cursor-pointer"
                        title="Disminuir"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        aria-label="Cantidad de unidades"
                        onChange={(e) =>
                          setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                        }
                        className="w-16 text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-hidden text-[#141413]"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2.5 text-[#141413] hover:bg-[#EBE7DF] transition-colors cursor-pointer"
                        title="Aumentar"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Desglose Neto + IVA 21% y Botones de Acción */}
                  <div className="pt-3 border-t border-[#E6E2DC]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-[#66615B] block font-mono">
                        Neto: ${subtotalNeto.toLocaleString("es-AR")} + IVA (21%): $
                        {ivaAmount.toLocaleString("es-AR")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-[#141413]">Total c/IVA:</span>
                        <span className="font-mono text-2xl font-black text-[#9E734E]">
                          ${totalConIva.toLocaleString("es-AR")}
                        </span>
                      </div>
                      {savings > 0 && (
                        <span className="text-[11px] text-emerald-700 font-bold block">
                          Ahorro mayorista neto: ${savings.toLocaleString("es-AR")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar al Pedido</span>
                      </button>

                      <a
                        href={STORE_CONFIG.contact.whatsappUrl(
                          `Hola OSSIL, quiero consultar stock del producto "${product.name}" (SKU: ${product.sku}) por ${quantity} u. (Total c/IVA est.: $${totalConIva.toLocaleString("es-AR")}).`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        title="Consultar por WhatsApp"
                        aria-label="Consultar producto por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Acceso rápido al Inspector de Rosca si corresponde */}
                {compatibleAccessories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openThreadInspector()}
                    className="w-full p-3.5 rounded-xl frosted-well hover:border-[#9E734E] flex items-center justify-between text-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#141413] font-bold">
                      <Layers className="w-4 h-4 text-[#9E734E]" />
                      <span>
                        Inspeccionar cómo es la Boca {product.neckThread} y ver{" "}
                        {compatibleAccessories.length} cierres compatibles
                      </span>
                    </div>
                    <span className="text-[#9E734E] font-bold group-hover:translate-x-0.5 transition-transform">
                      Abrir panel →
                    </span>
                  </button>
                )}

                {/* Retiro en Local sin Costo */}
                <div className="p-3.5 rounded-xl frosted-well flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#141413]">
                    <MapPin className="w-4 h-4 text-[#9E734E] shrink-0" />
                    <span>
                      Retiro inmediato en <strong>Oncativo 69, Local 1 (Córdoba)</strong>
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">0% RECARGO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Usos Recomendados y Ficha Técnica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9E734E]" />
                <h2 className="text-lg font-black text-[#141413]">Usos y Aplicaciones Sugeridas</h2>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Este artículo ha sido testeado y seleccionado por los principales laboratorios,
                emprendimientos botánicos y marcas de Córdoba:
              </p>

              <ul className="space-y-2.5">
                {(
                  product.applications || [
                    "Formulación de perfumería fina y esencias puras",
                    "Cosmética artesanal, geles y sérums faciales",
                    "Aromaterapia, fitoterapia y extractos vegetales",
                    "Líneas de packaging para regalos y puntos de venta",
                  ]
                ).map((app) => (
                  <li key={app} className="flex items-start gap-2.5 text-xs text-[#141413]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#9E734E]" />
                <h2 className="text-lg font-black text-[#141413]">Especificaciones Técnicas</h2>
              </div>

              <div className="divide-y divide-[#E6E2DC]/70 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#66615B]">Dimensiones:</span>
                  <strong className="text-[#141413] font-mono">
                    {product.dimensions || "Consultar milimetraje exacto"}
                  </strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#66615B]">Material Principal:</span>
                  <span className="text-[#141413] font-semibold">{product.material}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[#66615B]">Paso de Rosca / Boca:</span>
                  {product.neckThread !== "N/A" ? (
                    <button
                      type="button"
                      onClick={() => openThreadInspector()}
                      className="text-[#9E734E] hover:text-[#141413] font-mono font-bold underline cursor-pointer"
                    >
                      {product.neckThread} (Ver plano lateral)
                    </button>
                  ) : (
                    <span className="text-[#141413] font-mono font-bold">Cierre Directo</span>
                  )}
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#66615B]">Acabado Superficial:</span>
                  <span className="text-[#141413]">{product.finish}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#66615B]">Compatibilidad Química:</span>
                  <span className="text-emerald-700 font-medium">Apto alcoholes y aceites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Tapas y Accesorios Compatibles con Apertura en Panel Lateral o Nueva Pestaña */}
          {compatibleAccessories.length > 0 && (
            <section className="my-12 p-6 sm:p-8 rounded-3xl liquid-glass space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E2DC]/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-[#9E734E]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF]">
                      Match de Boca {product.neckThread}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#141413]">
                    {product.category === "accesorios"
                      ? "Envases y Botellas Compatibles con esta Tapa / Válvula"
                      : "Válvulas y Tapas Compatibles con este Envase"}
                  </h2>
                  <p className="text-xs text-[#66615B] mt-0.5">
                    Hacé click en cualquier tarjeta para inspeccionar cómo es la rosca en el panel
                    lateral o abrirla en una pestaña nueva.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openThreadInspector()}
                  className="px-4 py-2.5 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5 text-[#9E734E]" />
                  <span>Ver Plano de Rosca {product.neckThread}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {compatibleAccessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-2xl frosted-well liquid-glass-interactive flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] font-bold text-[#9E734E] bg-white/80 px-2 py-0.5 rounded border border-[#E6E2DC]">
                          Rosca {acc.neckThread}
                        </span>
                        <a
                          href={`/producto/${acc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir ficha de esta rosca/tapa en una pestaña nueva"
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-[#141413] text-[#66615B] hover:text-white border border-[#E6E2DC] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Área clickeable que abre el Panel Lateral de Inspección de Rosca */}
                      <button
                        type="button"
                        onClick={() => openThreadInspector(acc)}
                        className="w-full text-left cursor-pointer space-y-2 focus-visible:ring-2 focus-visible:ring-[#9E734E] rounded-xl"
                      >
                        <div className="relative w-full h-28 rounded-xl bg-white/80 border border-[#EBE7DF] flex items-center justify-center p-2 overflow-hidden">
                          {acc.imageUrl ? (
                            <Image
                              src={acc.imageUrl}
                              alt={acc.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 220px"
                              className="object-contain p-2 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-[#9E734E]">
                              <Layers className="w-7 h-7" />
                              <span className="font-mono text-[10px] font-bold mt-1">
                                {acc.neckThread}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-[#141413] group-hover:text-[#9E734E] transition-colors line-clamp-2">
                            {acc.name}
                          </h3>
                          <span className="text-[11px] text-[#9E734E] font-semibold inline-flex items-center gap-1 mt-0.5">
                            <Eye className="w-3 h-3" />
                            <span>Ver cómo es la rosca</span>
                          </span>
                        </div>

                        <div>
                          <span className="font-mono text-base font-black text-[#141413]">
                            ${acc.basePrice.toLocaleString("es-AR")}
                          </span>
                          <span className="text-[10px] text-[#66615B] ml-1">+ IVA</span>
                        </div>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E6E2DC]/70 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => openThreadInspector(acc)}
                        className="py-2 px-2.5 rounded-xl bg-white/90 hover:bg-[#EBE7DF] text-[#141413] border border-[#DCD6C9] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Ver Rosca
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddAccessory(acc)}
                        className="py-2 px-2.5 rounded-xl bg-[#141413] hover:bg-[#9E734E] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Sumar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Productos Relacionados */}
          {relatedProducts.length > 0 && (
            <section className="my-12 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#9E734E] uppercase tracking-wider block">
                    Más Opciones de la Línea
                  </span>
                  <h2 className="text-2xl font-black text-[#141413]">
                    Productos Relacionados en {product.categoryLabel}
                  </h2>
                </div>
                <Link
                  href={`/?unit=${product.businessUnit}`}
                  className="text-xs font-bold text-[#835C3A] hover:underline flex items-center gap-1"
                >
                  <span>Ver todo el catálogo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Panel Lateral Inspector de Rosca / Cierre */}
      <ThreadInspectorDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        baseProduct={product}
        selectedCompatible={inspectedItem}
        allCompatibles={compatibleAccessories}
        defaultQuantity={quantity}
        onSelectCompatible={(prod) => setInspectedItem(prod)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
