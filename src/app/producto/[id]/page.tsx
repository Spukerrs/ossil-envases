"use client";

import {
  CheckCircle2,
  ChevronRight,
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
import { PRODUCTS_SEED } from "@/data/catalog";
import { STORE_CONFIG } from "@/lib/constants";
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
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    notFound();
  }

  // Encontrar accesorios compatibles (mismo neckThread)
  const compatibleAccessories = useMemo(() => {
    if (product.neckThread === "N/A" || product.category === "accesorios") return [];
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

  // Calcular precio según la escala de volumen
  const activeTier = [...product.priceTiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((t) => quantity >= t.minQty);

  const unitPrice = activeTier ? activeTier.unitPrice : product.basePrice;
  const discountPct = activeTier ? activeTier.discountPct : 0;
  const subtotal = unitPrice * quantity;
  const savings = Math.max(0, product.basePrice * quantity - subtotal);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Agregaste ${quantity} u. al pedido`, {
      description: `${product.name} — Subtotal: $${subtotal.toLocaleString("es-AR")}`,
    });
    setIsCartOpen(true);
  };

  const handleAddAccessory = (acc: Product) => {
    addItem(acc, quantity);
    toast.success(`Combo armado: ${acc.name} agregado`, {
      description: `Se agregaron ${quantity} unidades para complementar tu envase.`,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle flex flex-col justify-between selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
      <div>
        <Navbar
          activeUnit={product.businessUnit}
          onSelectUnit={() => {}}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          {/* Breadcrumb de Navegación */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#8C827A] mb-6 flex-wrap"
          >
            <Link href="/" className="hover:text-[#141413] transition-colors font-medium">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BDB2]" />
            <span className="font-medium text-[#66615B]">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BDB2]" />
            <span className="font-bold text-[#141413] truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Fila Principal: Fotografía y Detalles Comerciales */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-[#FFFFFF] rounded-3xl border border-[#E6E2DC] p-6 sm:p-10 shadow-xs">
            {/* Columna Izquierda: Imagen del Producto */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="relative w-full aspect-4/3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden p-6 flex items-center justify-center group">
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

                <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#8C827A] bg-[#FFFFFF]/90 px-2 py-0.5 rounded shadow-2xs border border-[#E6E2DC]">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Badges de Confianza bajo la Fotografía */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                    Material
                  </span>
                  <span className="text-xs font-bold text-[#141413]">{product.material}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                    Capacidad
                  </span>
                  <span className="text-xs font-bold text-[#141413]">{product.capacity}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                    Boca / Rosca
                  </span>
                  <span className="font-mono text-xs font-black text-[#9E734E]">
                    {product.neckThread !== "N/A" ? product.neckThread : "Estándar"}
                  </span>
                </div>
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
                  <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed pt-1">
                    {product.description}
                  </p>
                </div>

                {/* Tabla de Escalas Mayoristas Automáticas */}
                {product.priceTiers.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2DC] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                        Escalas de Precios Mayoristas:
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
                                : "bg-[#FFFFFF] text-[#141413] border-[#E0D9CE] hover:border-[#9E734E]"
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

                {/* Selector de Cantidad Dinámico y Total */}
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-xs text-[#8C827A] block">
                        Precio Unitario Aplicado:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-2xl font-black text-[#141413]">
                          ${unitPrice.toLocaleString("es-AR")}
                        </span>
                        {discountPct > 0 && (
                          <span className="text-xs text-emerald-700 font-bold">
                            ({discountPct}% OFF aplicado)
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
                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
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

                  {/* Subtotal y Botones de Acción */}
                  <div className="pt-3 border-t border-[#F0ECE4] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#8C827A] block">Subtotal Estimado:</span>
                      <span className="font-mono text-2xl font-black text-[#9E734E]">
                        ${subtotal.toLocaleString("es-AR")}
                      </span>
                      {savings > 0 && (
                        <span className="text-[11px] text-emerald-700 font-bold block">
                          Ahorro por escala: ${savings.toLocaleString("es-AR")}
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
                          `Hola OSSIL, quiero consultar stock del producto "${product.name}" (SKU: ${product.sku}) por una cantidad de ${quantity} unidades.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        title="Consultar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Retiro en Local sin Costo */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2DC] flex items-center justify-between text-xs">
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
            {/* Usos Recomendados */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9E734E]" />
                <h2 className="text-lg font-black text-[#141413]">Usos y Aplicaciones Sugeridas</h2>
              </div>
              <p className="text-xs text-[#66615B] leading-relaxed">
                Este envase ha sido testeado y seleccionado por los principales laboratorios,
                emprendimientos botánicos y fábricas de fragancias de Córdoba:
              </p>

              <ul className="space-y-2.5">
                {(
                  product.applications || [
                    "Formulación de perfumería fina y esencias puras",
                    "Cosmética artesanal, geles y sérums faciales",
                    "Aromaterapia, fitoterapia y extractos vegetales",
                    "Líneas de packaging para regalos y recuerdos",
                  ]
                ).map((app) => (
                  <li key={app} className="flex items-start gap-2.5 text-xs text-[#141413]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ficha Técnica y Características */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#9E734E]" />
                <h2 className="text-lg font-black text-[#141413]">Especificaciones Técnicas</h2>
              </div>

              <div className="divide-y divide-[#F0ECE4] text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8C827A]">Dimensiones:</span>
                  <strong className="text-[#141413] font-mono">
                    {product.dimensions || "Consultar milimetraje exacto"}
                  </strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8C827A]">Material del Envase:</span>
                  <span className="text-[#141413] font-semibold">{product.material}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8C827A]">Paso de Rosca:</span>
                  <span className="text-[#141413] font-mono font-bold">
                    {product.neckThread !== "N/A" ? product.neckThread : "Cierre Directo"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8C827A]">Acabado Superficial:</span>
                  <span className="text-[#141413]">{product.finish}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8C827A]">Compatibilidad Química:</span>
                  <span className="text-emerald-700 font-medium">Apto alcoholes y aceites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Tapas y Accesorios Compatibles (Misma Rosca) */}
          {compatibleAccessories.length > 0 && (
            <section className="my-12 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE7DF] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-[#9E734E]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2 py-0.5 rounded bg-[#EBE7DF]">
                      Match de Boca {product.neckThread}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#141413]">
                    Válvulas y Tapas Compatibles con este Envase
                  </h2>
                </div>
                <span className="text-xs text-[#8C827A]">
                  Garantía de estanqueidad sin pérdidas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {compatibleAccessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex flex-col justify-between hover:border-[#9E734E] transition-all"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#8C827A] block">
                        Rosca {acc.neckThread}
                      </span>
                      <h3 className="text-sm font-bold text-[#141413] mt-1 line-clamp-2">
                        {acc.name}
                      </h3>
                      <span className="font-mono text-base font-black text-[#141413] block mt-2">
                        ${acc.basePrice.toLocaleString("es-AR")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddAccessory(acc)}
                      className="mt-4 w-full py-2 px-3 rounded-xl bg-[#141413] hover:bg-[#9E734E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Combo</span>
                    </button>
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
                  href="/"
                  className="text-xs font-bold text-[#835C3A] hover:underline flex items-center gap-1"
                >
                  <span>Ver todo</span>
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
