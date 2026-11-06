"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Material3DDemo } from "@/components/Material3DDemo";
import { PRODUCTS_SEED } from "@/data/catalog";
import { BusinessUnit, Material, NeckThread } from "@/types/catalog";
import { Search, SlidersHorizontal, Sparkles, X, CheckCircle2, ShieldCheck, ArrowRight, Star, Eye } from "lucide-react";

export default function HomePage() {
  const [activeUnit, setActiveUnit] = useState<BusinessUnit | "B2B">("ENVASES");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("TODOS");
  const [selectedThread, setSelectedThread] = useState<string>("TODOS");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [show3DInspector, setShow3DInspector] = useState<boolean>(false);

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
        if (!matchName && !matchSku && !matchFinish && !matchThread) {
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
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
          {/* Si está en la pestaña B2B de Serigrafía y Personalización */}
          {activeUnit === "B2B" ? (
            <div className="py-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-black uppercase tracking-widest text-[#9E734E] px-3 py-1 bg-[#EBE7DF] rounded-full">
                  Servicio Industrial de Personalización
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight mt-3">
                  Satinado, Serigrafía y Vitrificado para tu Marca
                </h1>
                <p className="text-sm text-[#66615B] mt-3 leading-relaxed">
                  En OSSIL no solo te vendemos el envase: transformamos frascos de vidrio y botellas plásticas en productos con identidad terminada para laboratorios, marcas de autor y cosmética.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    title: "Satinado / Esmerilado",
                    desc: "Tratamiento químico al ácido que otorga al vidrio una textura sedosa difusa y mate de altísima elegancia.",
                    materials: "Vidrio cristal",
                  },
                  {
                    title: "Serigrafía Horneada",
                    desc: "Impresión de alta durabilidad indeleble con tintas cerámicas curadas a 600°C que no se rayan con alcohol ni solventes.",
                    materials: "Vidrio y PET",
                  },
                  {
                    title: "Tampografía de Precisión",
                    desc: "Ideal para tapas plásticas, hombros curvos y superficies irregulares con definición milimétrica.",
                    materials: "Tapas y Potes PEAD",
                  },
                  {
                    title: "Vitrificado y Oro/Plata",
                    desc: "Aplicación de metales preciosos horneados para sellos de alta perfumería y destilados premium.",
                    materials: "Vidrio exclusivo",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-[#9E734E]">
                        0{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-[#141413] mt-1">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#66615B] mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F0ECE4]">
                      <span className="text-[10px] font-bold text-[#8C827A] uppercase block">
                        Aplica sobre:
                      </span>
                      <span className="text-xs font-medium text-[#141413]">
                        {s.materials}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspector 3D Interactivo para B2B */}
              <Material3DDemo />

              {/* CTA Cotización B2B */}
              <div className="p-8 rounded-3xl bg-[#141413] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="text-xl font-bold">¿Tenés un proyecto o tirada mayorista?</h3>
                  <p className="text-xs text-[#D4CEBF] mt-1">
                    Cotizamos a partir de 500 unidades con muestras previas físicas en nuestro taller de Córdoba.
                  </p>
                </div>
                <a
                  href="https://wa.me/5493512440156?text=Hola%20OSSIL,%20quiero%20cotizar%20un%20servicio%20de%20serigraf%C3%ADa/satinado%20para%20mis%20envases."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap active:scale-95"
                >
                  <span>Consultar con Especialista B2B</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Hero Banner Editorial & Buscador */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#9E734E]">
                      {activeUnit === "ENVASES"
                        ? "Catálogo Técnico de Envases"
                        : "Bazar, Decoración e Insumos"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight mt-1">
                      {activeUnit === "ENVASES"
                        ? "Encontrá tu envase exacto con sus tapas compatibles"
                        : "Línea OSSIL Home, Velas y Bazar en Córdoba"}
                    </h1>
                  </div>

                  {/* Buscador Rápido */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por SKU, '18/415', 'satinado'..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs font-medium text-[#141413] placeholder:text-[#A8A29E] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#141413]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtros de Roscas Rápidos */}
                {activeUnit === "ENVASES" && (
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-3 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#9E734E]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                          Filtro Inteligente por Rosca / Boca:
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
                              onClick={() => setSelectedThread(thread)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                isSelected
                                  ? "bg-[#141413] text-white shadow-xs"
                                  : "bg-[#FAF8F5] text-[#66615B] hover:text-[#141413] border border-[#E6E2DC]"
                              }`}
                            >
                              {thread === "TODOS" ? "Cualquier Rosca" : `Rosca ${thread}`}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Filtro por Material */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <span className="text-xs font-bold text-[#66615B] mr-1 whitespace-nowrap">
                    Material:
                  </span>
                  {[
                    "TODOS",
                    ...(activeUnit === "ENVASES"
                      ? ["Vidrio", "PET", "PEAD", "Acrílico", "Aluminio"]
                      : ["Insumos", "Vidrio", "Varios"]),
                  ].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        selectedMaterial === mat
                          ? "bg-[#9E734E] text-white font-bold"
                          : "bg-[#EBE7DF] text-[#66615B] hover:text-[#141413]"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}

                  {(selectedMaterial !== "TODOS" ||
                    selectedThread !== "TODOS" ||
                    searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                      <X className="w-3 h-3" />
                      <span>Limpiar filtros</span>
                    </button>
                  )}
                </div>

                {/* Banner de acceso al Inspector Óptico 3D */}
                {activeUnit === "ENVASES" && (
                  <div className="mt-4 p-3 rounded-2xl bg-[#EBE7DF]/60 border border-[#E0DCD3] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#9E734E]/15 flex items-center justify-center text-[#9E734E]">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#141413] block">
                          Visualizador Óptico 3D de Materiales
                        </span>
                        <span className="text-[11px] text-[#66615B]">
                          Compará en tiempo real el vidrio cristal, esmerilado/satinado, ámbar UV y plástico PEAD
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShow3DInspector(!show3DInspector)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#141413] hover:bg-[#2B2B28] text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9E734E]" />
                      <span>{show3DInspector ? "Cerrar Inspector 3D" : "Probar Inspector 3D"}</span>
                    </button>
                  </div>
                )}

                {/* Render condicional del Visor 3D en Envases */}
                {activeUnit === "ENVASES" && show3DInspector && (
                  <Material3DDemo />
                )}
              </div>

              {/* Grilla de Catálogo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onFilterThread={(th) => setSelectedThread(th)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] p-8">
                  <p className="text-sm font-bold text-[#141413]">
                    No se encontraron productos para los filtros seleccionados
                  </p>
                  <p className="text-xs text-[#66615B] mt-1">
                    Probá cambiando el milimetraje de rosca o limpiando la búsqueda.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#141413] text-white text-xs font-bold"
                  >
                    Restablecer catálogo
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer Limpio y Profesional */}
      <footer className="bg-[#FFFFFF] border-t border-[#E6E2DC] mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#66615B]">
            <div>
              <span className="font-mono text-lg font-black text-[#141413] block">
                OSSIL ENVASES & HOME
              </span>
              <p className="mt-2 text-xs leading-relaxed">
                Distribuidora mayorista y minorista radicada en Córdoba Capital. Venta de packaging, frascos para perfumería, cosmética, goteros medicinales y bazar.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[#141413] font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>4.9 estrellas en Google Maps (7.466 opiniones)</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-[#141413] uppercase tracking-wider block mb-2">
                Atención al Cliente & Retiro
              </span>
              <p>📍 <strong>Local:</strong> Oncativo 69, Local 1 (Córdoba Capital)</p>
              <p className="mt-1">📞 <strong>WhatsApp:</strong> +54 9 351 244-0156 / +54 9 351 319-6225</p>
              <p className="mt-1">🕒 <strong>Horarios:</strong> Lun a Vie 08:00 a 17:15 | Sáb 09:00 a 13:30 hs</p>
            </div>

            <div>
              <span className="font-bold text-[#141413] uppercase tracking-wider block mb-2">
                Garantías de Compra
              </span>
              <p>✓ Efectivo / Transferencia: 0% de recargo</p>
              <p className="mt-1">✓ Precios escalonados automáticos por volumen (-11% a -28% OFF)</p>
              <p className="mt-1">✓ Despacho a expresos y transporte a todo el país</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E6E2DC] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C827A] gap-2">
            <span>© 2026 OSSIL Envases. Todos los derechos reservados.</span>
            <span>Desarrollado con Next.js 16 & Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Drawer del Carrito */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
