"use client";

import {
  ArrowRight,
  Eye,
  Factory,
  FileSpreadsheet,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { Material3DDemo } from "@/components/Material3DDemo";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ThreadComboModal } from "@/components/ThreadComboModal";
import { PRODUCTS_SEED } from "@/data/catalog";
import { STORE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import type { BusinessUnit, Product } from "@/types/catalog";

export default function HomePage() {
  const [activeUnit, setActiveUnit] = useState<BusinessUnit | "B2B">("ENVASES");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("TODOS");
  const [selectedThread, setSelectedThread] = useState<string>("TODOS");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [show3DInspector, setShow3DInspector] = useState<boolean>(false);

  // Totales para mobile sticky pill
  const totalItemsCount = useCartStore((s) => s.getTotalItemsCount());
  const totalCartAmount = useCartStore((s) => s.getTotalAmount());

  // Estado para el modal de combo de tapas coincidentes
  const [comboProduct, setComboProduct] = useState<Product | null>(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState<boolean>(false);

  // Filtrado reactivo en memoria
  const filteredProducts = useMemo(() => {
    return PRODUCTS_SEED.filter((p) => {
      // Filtrar por unidad de negocio
      if (activeUnit !== "B2B" && p.businessUnit !== activeUnit) {
        return false;
      }

      // Filtrar por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchFinish = p.finish.toLowerCase().includes(q);
        const matchThread = p.neckThread.toLowerCase().includes(q);
        const matchCat = p.categoryLabel.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchFinish && !matchThread && !matchCat) {
          return false;
        }
      }

      // Filtrar por material
      if (selectedMaterial !== "TODOS" && p.material !== selectedMaterial) {
        return false;
      }

      // Filtrar por rosca
      if (selectedThread !== "TODOS" && p.neckThread !== selectedThread) {
        return false;
      }

      return true;
    });
  }, [activeUnit, searchQuery, selectedMaterial, selectedThread]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMaterial("TODOS");
    setSelectedThread("TODOS");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedMaterial !== "TODOS" || selectedThread !== "TODOS";

  return (
    <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle flex flex-col justify-between selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
      <div>
        <Navbar
          activeUnit={activeUnit}
          onSelectUnit={(unit) => {
            setActiveUnit(unit);
            setSelectedMaterial("TODOS");
            setSelectedThread("TODOS");
          }}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ============================================================ */}
          {/* PESTAÑA 1 & 2: CATÁLOGO COMERCIAL (ENVASES / HOME)           */}
          {/* ============================================================ */}
          {activeUnit !== "B2B" ? (
            <>
              {/* Hero Editorial Apothecary con Entrada Suave */}
              <section className="mb-10 animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E6E2DC]">
                  <div className="max-w-2xl space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                        {activeUnit === "ENVASES"
                          ? "División Packaging & Laboratorio"
                          : "División Home & Insumos de Autor"}
                      </span>
                      <span className="text-xs text-[#8C827A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9E734E]" />
                        <span>Oncativo 69, Local 1 • Córdoba Capital</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Atendido por sus dueños
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight leading-tight">
                      {activeUnit === "ENVASES"
                        ? "Envases y frascos con compatibilidad de roscas garantizada"
                        : "Ceras de soja, esencias y bazar mayorista para tu marca"}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed">
                      {activeUnit === "ENVASES"
                        ? "Accedé al stock más grande de Córdoba en vidrio cristal, ámbar UV y polímeros PEAD/PET con escalas mayoristas automáticas hasta -28% OFF."
                        : "Insumos premium para velas de soja, difusores aromáticos, dispensers de diseño y bazar para emprendimientos y locales comerciales."}
                    </p>
                  </div>

                  {/* Buscador Rápido con Icono y Clear */}
                  <div className="w-full lg:w-88 space-y-1.5 shrink-0">
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por SKU, '18/415', 'ámbar'..."
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs font-medium text-[#141413] placeholder:text-[#A8A29E] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] shadow-2xs transition-all"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#141413] p-0.5 cursor-pointer"
                          title="Limpiar búsqueda"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C827A] px-1">
                      <span>{filteredProducts.length} producto(s) en lista</span>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Restablecer filtros
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tira de Métricas Clave de Confianza (Anti-Slop) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 animate-fade-in-stagger-1">
                  <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs">
                    <span className="font-mono text-base font-black text-[#141413] block">
                      1.316 Modelos
                    </span>
                    <span className="text-[11px] text-[#66615B]">Stock inmediato en Córdoba</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs">
                    <span className="font-mono text-base font-black text-[#B45309] block">
                      Hasta -28% OFF
                    </span>
                    <span className="text-[11px] text-[#66615B]">
                      Escalas por volumen automáticas
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="font-mono text-base font-black text-[#141413]">
                        4.9 Estrellas
                      </span>
                    </div>
                    <span className="text-[11px] text-[#66615B]">
                      7.466 opiniones en Google Maps
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs">
                    <span className="font-mono text-base font-black text-[#141413] block">
                      0% Recargo
                    </span>
                    <span className="text-[11px] text-[#66615B]">
                      Efectivo o Transferencia bancaria
                    </span>
                  </div>
                </div>

                {/* Filtro Inteligente de Roscas Milimétricas (Exclusivo Envases) */}
                {activeUnit === "ENVASES" && (
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-3 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#9E734E]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                          Filtro Rápido por Boca / Rosca:
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66615B]">
                        Garantiza compatibilidad entre envases y accesorios
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {["TODOS", "18/415", "20/410", "24/410", "28/400", "28/410", "B/R 28"].map(
                        (thread) => {
                          const isSelected = selectedThread === thread;
                          return (
                            <button
                              key={thread}
                              type="button"
                              onClick={() => setSelectedThread(thread)}
                              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#141413] text-[#FAF8F5] shadow-xs"
                                  : "bg-[#F3EFEA] text-[#66615B] hover:text-[#141413] hover:bg-[#EBE7DF]"
                              }`}
                            >
                              {thread === "TODOS" ? "Ver Todas las Roscas" : `Boca ${thread}`}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {/* Filtro por Material */}
                <div className="flex items-center gap-2 flex-wrap pb-4">
                  <span className="text-xs font-bold text-[#66615B]">Material:</span>
                  {["TODOS", "Vidrio", "PET", "PEAD", "Acrílico", "Aluminio", "Insumos"].map(
                    (mat) => {
                      const isSelected = selectedMaterial === mat;
                      return (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#9E734E] text-white font-bold"
                              : "bg-[#FFFFFF] text-[#66615B] border border-[#E6E2DC] hover:border-[#9E734E]"
                          }`}
                        >
                          {mat}
                        </button>
                      );
                    },
                  )}

                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={() => setShow3DInspector(!show3DInspector)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        show3DInspector
                          ? "bg-[#141413] text-white border-[#141413]"
                          : "bg-[#FAF8F5] text-[#835C3A] border-[#E0D9CE] hover:border-[#9E734E]"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-[#9E734E]" />
                      <span>
                        {show3DInspector ? "Ocultar Visor 3D" : "Inspeccionar Materiales 3D"}
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Visor 3D Demostrador de Materiales Desplegable */}
              {show3DInspector && (
                <div className="mb-10 animate-fade-in-up">
                  <Material3DDemo />
                </div>
              )}

              {/* Grilla de Productos */}
              <section className="animate-fade-in-stagger-2">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onFilterThread={(th) => {
                          setSelectedThread(th);
                          setActiveUnit("ENVASES");
                        }}
                        onOpenComboModal={(prod) => {
                          setComboProduct(prod);
                          setIsComboModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] max-w-md mx-auto space-y-3">
                    <p className="font-bold text-[#141413] text-sm">
                      No encontramos productos con los filtros seleccionados.
                    </p>
                    <p className="text-xs text-[#66615B]">
                      Probá cambiando el material, la medida de rosca o limpiando la búsqueda.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-xl bg-[#9E734E] text-white text-xs font-bold hover:bg-[#835C3A] transition-colors cursor-pointer"
                    >
                      Ver todo el catálogo
                    </button>
                  </div>
                )}
              </section>

              {/* Sección de Testimonios y Reseñas Reales de Google Maps */}
              <section className="my-16 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EBE7DF]">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                        Comunidad de Fabricantes & Formuladores
                      </span>
                      <span className="text-xs text-[#8C827A]">• Oncativo 69, Córdoba</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#141413]">
                      Lo que opinan quienes producen con OSSIL
                    </h2>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/6mLg33JqzYa4pJsP8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D9CE] hover:border-[#9E734E] text-xs font-bold text-[#141413] transition-colors"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>4.9 / 5.0 en Google Maps (7.466 opiniones)</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {/* Review 1 */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <p className="text-xs text-[#4A4742] leading-relaxed italic">
                        “Excelente atención de Silvia y Oscar en el local de Oncativo. Conseguí
                        frascos goteros con rosca 18 exactos para mi laboratorio de cosmética
                        natural, sin pérdidas ni derrames.”
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#141413] block">
                          Farm. Silvia M.
                        </span>
                        <span className="text-[10px] text-[#8C827A]">
                          Cosmética Botánica & Fitofarmacia
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Cliente Verificado
                      </span>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <p className="text-xs text-[#4A4742] leading-relaxed italic">
                        “Compro la cera de soja pura y las esencias concentradas por mayor. Los
                        precios por escala automática me permitieron triplicar el margen en mi
                        taller de velas artesanales.”
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#141413] block">Marcos G.</span>
                        <span className="text-[10px] text-[#8C827A]">
                          Taller de Velas & Difusores
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Cliente Verificado
                      </span>
                    </div>
                  </div>

                  {/* Review 3 */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <p className="text-xs text-[#4A4742] leading-relaxed italic">
                        “Tienen stock físico real en el centro de Córdoba. Lo que ves en el catálogo
                        es lo que te entregan en el acto con el voucher sin dar vueltas ni sorpresas
                        de precios.”
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#141413] block">Nicolás F.</span>
                        <span className="text-[10px] text-[#8C827A]">Emprendedor Mayorista</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Cliente Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* ============================================================ */
            /* PESTAÑA 3: SERVICIOS INDUSTRIALES B2B                        */
            /* ============================================================ */
            <div className="space-y-12 animate-fade-in-up">
              {/* Header de la Unidad B2B */}
              <div className="border-b border-[#E6E2DC] pb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                    Planta Industrial Córdoba
                  </span>
                  <span className="text-xs text-[#8C827A]">• Tiradas desde 500 unidades</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight">
                  Personalización y Acabados de Packaging para Marcas
                </h1>
                <p className="text-xs sm:text-sm text-[#66615B] max-w-3xl leading-relaxed">
                  Transformá envases estándar en piezas exclusivas con serigrafía vitrificable
                  (horneada a alta temperatura), satinado químico al ácido y tampografía para tapas
                  y superficies curvas.
                </p>
              </div>

              {/* Grilla de Técnicas de Acabado B2B */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Satinado / Esmerilado",
                    tech: "Inmersión Química al Ácido",
                    desc: "Otorga una textura suave tipo 'frosted glass' anti-huella. Ideal para marcas premium de cosmética botánica y fragancias finas.",
                    leadTime: "7 a 10 días hábiles",
                    minQty: "500 u.",
                  },
                  {
                    title: "Serigrafía Vitrificable",
                    tech: "Horneado a 580°C",
                    desc: "Pinturas inorgánicas fusionadas con el vidrio en túnel continuo. Inalterable frente a alcohol, aceites y fricción mecánica.",
                    leadTime: "10 a 14 días hábiles",
                    minQty: "1.000 u.",
                  },
                  {
                    title: "Tampografía Industrial",
                    tech: "Pad Printing 1-4 Colores",
                    desc: "Impresión de alta definición para tapas ciegas, gatillos y cuellos cónicos donde la serigrafía cilíndrica no llega.",
                    leadTime: "5 a 7 días hábiles",
                    minQty: "500 u.",
                  },
                  {
                    title: "Hot-Stamping Metalizado",
                    tech: "Foil Térmico Oro / Plata",
                    desc: "Detalles brillantes metalizados que realzan el logotipo de la marca sobre frascos de perfumería o cajas de packaging.",
                    leadTime: "10 a 12 días hábiles",
                    minQty: "2.000 u.",
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs hover:border-[#9E734E] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#9E734E] uppercase tracking-wider block">
                        {s.tech}
                      </span>
                      <h3 className="text-lg font-black text-[#141413] mt-1">{s.title}</h3>
                      <p className="text-xs text-[#66615B] mt-2.5 leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#F0ECE4] text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#8C827A]">Tirada Mínima:</span>
                        <strong className="text-[#141413] font-mono">{s.minQty}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C827A]">Tiempo de Entrega:</span>
                        <span className="text-[#66615B] font-medium">{s.leadTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspector 3D Interactivo para la Vista B2B */}
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#9E734E] uppercase tracking-wider block">
                    Previsualización de Materiales Físicos
                  </span>
                  <h2 className="text-xl font-black text-[#141413]">
                    Comprobá cómo luce el vidrio satinado vs. cristal y sus tintes
                  </h2>
                </div>
                <Material3DDemo />
              </div>

              {/* Estimador de Tiradas y CTA WhatsApp B2B */}
              <div className="p-8 rounded-3xl bg-[#141413] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-[#9E734E]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#9E734E] font-bold">
                      Presupuestos Industriales en Córdoba
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    ¿Tenés un proyecto o lanzamiento de marca?
                  </h3>
                  <p className="text-xs text-[#D4CEBF] leading-relaxed">
                    Cotizamos a partir de 500 unidades con muestras físicas previas en nuestro
                    taller de Oncativo 69. Enviamos a expresos en toda Argentina.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <a
                    href={STORE_CONFIG.contact.whatsappUrl(
                      "Hola OSSIL, quiero cotizar un servicio de serigrafía/satinado para mis envases.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap active:scale-95 shadow-md cursor-pointer"
                  >
                    <span>Consultar Asesor Técnico B2B</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <Link
                    href="/admin/precios"
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-[#222220] hover:bg-[#2E2E2A] border border-[#3E3E38] text-xs font-bold text-[#D4CEBF] text-center"
                  >
                    Simulador Precios ERP
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Editorial y de Soporte Operativo */}
      <footer className="bg-[#FFFFFF] border-t border-[#E6E2DC] mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#66615B]">
            <div className="space-y-3">
              <span className="font-mono text-xl font-black text-[#141413] block">
                OSSIL ENVASES & HOME
              </span>
              <p className="text-xs leading-relaxed">
                Distribuidora mayorista y minorista radicada en Córdoba Capital. Venta de packaging,
                frascos para perfumería, cosmética, goteros medicinales y bazar.
              </p>
              <div className="flex items-center gap-1.5 text-[#141413] font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>4.9 estrellas en Google Maps (7.466 opiniones)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#141413] uppercase tracking-wider block mb-1">
                Atención al Cliente & Retiro
              </span>
              <p>
                📍 <strong>Local:</strong> {STORE_CONFIG.location.address} (
                {STORE_CONFIG.location.city})
              </p>
              <p>
                📞 <strong>WhatsApp:</strong>{" "}
                <a
                  href={STORE_CONFIG.contact.whatsappUrl("Hola OSSIL, tengo una consulta.")}
                  className="hover:text-[#9E734E] font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {STORE_CONFIG.contact.phoneDisplay}
                </a>
              </p>
              <p>
                🕒 <strong>Horarios:</strong> {STORE_CONFIG.hours.weekdays} |{" "}
                {STORE_CONFIG.hours.saturdays}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#141413] uppercase tracking-wider block mb-1">
                Accesos y Herramientas del Sistema
              </span>
              <div className="space-y-1.5">
                <Link href="/links" className="text-[#9E734E] hover:text-[#141413] font-bold block">
                  📱 Hub Mobile / Reemplazo Linktree (/links)
                </Link>
                <Link
                  href="/admin/precios"
                  className="text-[#835C3A] hover:text-[#141413] font-bold flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Módulo ERP: Ingesta Masiva de Precios CSV</span>
                </Link>
                <p className="text-[11px] text-[#8C827A] pt-1">
                  ✓ Descuentos escalonados automáticos por volumen (-11% a -28% OFF)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E6E2DC] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C827A] gap-2">
            <span>© 2026 OSSIL Envases & OSSIL Home. Todos los derechos reservados.</span>
            <span>Desarrollado con Next.js 16, React 19 & Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Barra Flotante de Acciones Rápidas para Smartphones y Tablets */}
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-40 lg:hidden">
        <div className="bg-[#141413]/95 text-white backdrop-blur-md rounded-2xl border border-[#2C2B29] p-2.5 shadow-2xl flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShow3DInspector(!show3DInspector)}
              className="px-3 py-2 rounded-xl bg-[#242422] border border-[#3A3A36] text-[11px] font-bold text-[#D4CEBF] flex items-center gap-1.5 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-[#9E734E]" />
              <span>3D</span>
            </button>

            <a
              href={STORE_CONFIG.contact.whatsappUrl(
                "Hola OSSIL, tengo una consulta sobre el catálogo.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-[#242422] border border-[#3A3A36] text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WA</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-black flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          >
            <span>Pedido ({totalItemsCount})</span>
            <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.5 rounded">
              ${totalCartAmount.toLocaleString("es-AR")}
            </span>
          </button>
        </div>
      </div>

      {/* Modal de Armado de Combo con Roscas Coincidentes */}
      <ThreadComboModal
        product={comboProduct}
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Drawer del Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onSelectThreadFilter={(th) => {
          setSelectedThread(th);
          setActiveUnit("ENVASES");
        }}
      />
    </div>
  );
}
