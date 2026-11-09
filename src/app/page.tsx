"use client";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { type B2BSample, B2BSampleLightboxModal } from "@/components/B2BSampleLightboxModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CatalogSidebar } from "@/components/CatalogSidebar";
import { MobileFiltersDrawer } from "@/components/MobileFiltersDrawer";
import { type ActiveView, Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { StoreStatusBadge } from "@/components/StoreStatusBadge";
import { ThreadComboModal } from "@/components/ThreadComboModal";
import { WelcomeLanding } from "@/components/WelcomeLanding";
import { PRODUCTS_SEED } from "@/data/catalog";
import { STORE_CONFIG } from "@/lib/constants";
import {
  CAPACITY_RANGES,
  FAMILIES_BY_UNIT,
  getContextualSubcategories,
  getProductFamily,
  matchesCapacityRange,
} from "@/lib/taxonomy";
import { useCartStore } from "@/store/useCartStore";
import type { BusinessUnit, Product } from "@/types/catalog";

const B2B_SAMPLES: B2BSample[] = [
  {
    title: "Satinado / Esmerilado",
    tech: "Inmersión Química al Ácido",
    image: "/images/services/satinado-esmerilado.webp",
    desc: "Otorga una textura suave tipo 'frosted glass' anti-huella. Te asesoramos sobre qué frascos de vidrio son aptos para satinado y coordinamos las tiradas con talleres especializados.",
    example:
      "Frascos de perfumería fina de 30cc a 100cc con acabado translúcido mate suave que difumina la luz y previene marcas de huellas dactilares.",
    leadTime: "7 a 10 días hábiles",
    minQty: "500 u.",
    materials: "Vidrio Cristal y Ámbar",
    features: [
      "Acabado anti-huella dactilar mate",
      "Textura suave al tacto y difusora de luz",
      "No altera la capacidad ni la rosca del envase",
    ],
  },
  {
    title: "Serigrafía Vitrificable",
    tech: "Horneado a 580°C",
    image: "/images/services/serigrafia-vitrificable.webp",
    desc: "Pinturas inorgánicas fusionadas con el vidrio en túnel continuo. Te orientamos técnicamente en el calce de tintas, espesores de línea y resistencia a alcoholes y fricción.",
    example:
      "Botellas y frascos de laboratorio con logotipo, graduación milimétrica o marca horneada. Resiste alcohol 96°, aceites y lavados.",
    leadTime: "10 a 14 días hábiles",
    minQty: "1.000 u.",
    materials: "Vidrio Cristal, Ámbar, Verde y Azul",
    features: [
      "Fusión molecular al vidrio a 580°C",
      "Resistencia total a solventes, alcohol 96° y fricción",
      "Hasta 4 tintas con calce de alta precisión",
    ],
  },
  {
    title: "Tampografía Industrial",
    tech: "Pad Printing 1-4 Colores",
    image: "/images/services/tampografia-acabado.webp",
    desc: "Transferencia de tinta mediante cabezal elástico de silicona. Te asesoramos en la personalización de tapas ciegas, bajorrelieves, válvulas y cremeras donde la serigrafía no llega.",
    example:
      "Tapas plásticas y metálicas a rosca 24/410, válvulas dosificadoras y pulsadores cremeros con isotipo de marca nítido en el bajorrelieve superior en 1 a 4 tintas epoxi.",
    leadTime: "5 a 7 días hábiles",
    minQty: "500 u.",
    materials: "PP, PEAD, Acrílico, Aluminio y Madera",
    features: [
      "Impresión sobre superficies curvas o bajorrelieves",
      "Tintas epoxi de alta adherencia y secado rápido",
      "Ideal para personalización de tapas y bombas",
    ],
  },
  {
    title: "Hot-Stamping Metalizado",
    tech: "Foil Térmico Oro / Plata",
    image: "/images/services/hotstamping-dorado.webp",
    desc: "Fijación por calor y presión de películas metalizadas reflectantes (foil térmico oro 24k o plata). Te guiamos en la elección del envase y matriz térmica para lograr un efecto espejo de alta gama.",
    example:
      "Frascos de perfumería fina, botellas ámbar y frascos satinados con tipografía, marcos lineales y filetes perimetrales dorados brillantes que destellan bajo iluminación de góndola.",
    leadTime: "10 a 12 días hábiles",
    minQty: "2.000 u.",
    materials: "Vidrio barnizado, Plásticos rígidos y Cajas",
    features: [
      "Brillo espejo oro brillante, plata u holográfico",
      "Realce táctil y visual de máxima gama",
      "Excelente contraste sobre bases ámbar y negras",
    ],
  },
];

function HomePageContent() {
  const searchParams = useSearchParams();
  const [activeUnit, setActiveUnit] = useState<ActiveView>("INICIO");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("TODAS");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("TODOS");
  const [selectedThread, setSelectedThread] = useState<string>("TODOS");
  const [selectedCapacityRange, setSelectedCapacityRange] = useState<string>("TODAS");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Estado para el modal de muestra B2B Lightbox
  const [b2bSelectedSample, setB2bSelectedSample] = useState<B2BSample | null>(null);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState<boolean>(false);

  // Sincronizar ?unit=ENVASES | HOME | B2B cuando se redirige desde /producto/[id] o /links
  useEffect(() => {
    const unitParam = searchParams.get("unit");
    const threadParam = searchParams.get("thread");
    if (unitParam === "ENVASES" || unitParam === "HOME" || unitParam === "B2B") {
      setActiveUnit(unitParam);
    } else if (!unitParam) {
      setActiveUnit("INICIO");
    }
    if (threadParam) {
      setSelectedThread(threadParam);
    }
  }, [searchParams]);

  // Totales para mobile sticky pill (con IVA incluido)
  const totalItemsCount = useCartStore((s) => s.getTotalItemsCount());
  const totalCartWithIva = useCartStore((s) => s.getTotalWithIva());

  // Estado para el modal de combo de tapas coincidentes
  const [comboProduct, setComboProduct] = useState<Product | null>(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState<boolean>(false);

  // Selección curada de 4 productos estrella para la portada de bienvenida
  const featuredProducts = useMemo(() => {
    const preferredIds = [
      "venecia-250-pet",
      "equatone-50-satinado",
      "gotero-30-ambar-vidrio",
      "cera-soja-1kg",
    ];
    const picked = PRODUCTS_SEED.filter((p) => preferredIds.includes(p.id));
    if (picked.length === 4) return picked;
    return PRODUCTS_SEED.slice(0, 4);
  }, []);

  // Navegación desde la Landing hacia el Catálogo con mapeo de categorías
  const handleNavigateFromLanding = (
    unit: BusinessUnit | "B2B",
    category = "TODAS",
    thread = "TODOS",
  ) => {
    setActiveUnit(unit);
    let mappedCat = category;
    if (category === "cosmetica-botellas" || category === "perfumeria") mappedCat = "botellas";
    else if (category === "cosmetica-potes" || category === "alimenticio")
      mappedCat = "potes-frascos";
    else if (category === "cosmetica-bidones") mappedCat = "bidones-baldes";
    else if (category === "medicinal" || category === "accesorios")
      mappedCat = "insumos-accesorios";
    else if (category === "velas") mappedCat = "velas-difusores";
    else if (category === "bazar") mappedCat = "bazar-cocina";

    setSelectedCategory(mappedCat);
    setSelectedSubcategory("TODAS");
    setSelectedMaterial("TODOS");
    setSelectedThread(thread);
    setSelectedCapacityRange("TODAS");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Productos de la unidad comercial activa
  const unitProducts = useMemo(() => {
    if (activeUnit !== "ENVASES" && activeUnit !== "HOME") return [];
    return PRODUCTS_SEED.filter((p) => p.businessUnit === activeUnit);
  }, [activeUnit]);

  // Conteos dinámicos en memoria por faceta para la unidad activa
  const threadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of unitProducts) {
      if (p.neckThread && p.neckThread !== "N/A") {
        counts[p.neckThread] = (counts[p.neckThread] || 0) + 1;
      }
    }
    return counts;
  }, [unitProducts]);

  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of unitProducts) {
      if (p.material) {
        counts[p.material] = (counts[p.material] || 0) + 1;
      }
    }
    return counts;
  }, [unitProducts]);

  const capacityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of CAPACITY_RANGES) {
      if (r.id === "TODAS") continue;
      counts[r.id] = unitProducts.filter((p) => matchesCapacityRange(p, r.id)).length;
    }
    return counts;
  }, [unitProducts]);

  // Subcategorías disponibles dinámicamente según productos de la familia activa
  const availableSubcategories = useMemo(() => {
    if (activeUnit !== "ENVASES" && activeUnit !== "HOME") return [];
    return getContextualSubcategories(unitProducts, selectedCategory);
  }, [activeUnit, unitProducts, selectedCategory]);

  // Cantidad de facetas activas para badge mobile
  const activeFacetsCount = useMemo(() => {
    let count = 0;
    if (selectedThread !== "TODOS") count++;
    if (selectedMaterial !== "TODOS") count++;
    if (selectedCapacityRange !== "TODAS") count++;
    return count;
  }, [selectedThread, selectedMaterial, selectedCapacityRange]);

  // Filtrado reactivo en memoria desacoplado
  const filteredProducts = useMemo(() => {
    if (activeUnit !== "ENVASES" && activeUnit !== "HOME") return [];
    return PRODUCTS_SEED.filter((p) => {
      // 1. Unidad de negocio
      if (p.businessUnit !== activeUnit) return false;

      // 2. Familia / Categoría canónica
      if (selectedCategory !== "TODAS") {
        const fam = getProductFamily(p);
        if (fam !== selectedCategory) return false;
      }

      // 3. Subcategoría contextual
      if (selectedSubcategory !== "TODAS") {
        const pSub = p.subcategory || p.categoryLabel;
        if (p.subcategory !== selectedSubcategory && pSub !== selectedSubcategory) {
          if (
            (selectedSubcategory === "Línea Standard & Cosmética" &&
              (p.subcategory === "Botellas PET" ||
                p.subcategory === "Botellas PEAD" ||
                p.subcategory === "Botellas Vidrio" ||
                p.subcategory === "Botellas Aluminio")) ||
            (selectedSubcategory === "Potes Cosméticos" &&
              (p.subcategory === "Potes Acrílico" ||
                p.subcategory === "Potes Plástico Varios" ||
                p.subcategory === "Potes Aluminio")) ||
            (selectedSubcategory === "Tapas a Rosca & Cierres" &&
              (p.subcategory === "Corchos y Tapas" || p.subcategory === "Tapas"))
          ) {
            // Coincide por regla de unificación
          } else {
            return false;
          }
        }
      }

      // 4. Material
      if (selectedMaterial !== "TODOS" && p.material !== selectedMaterial) {
        return false;
      }

      // 5. Rosca / Boca milimétrica
      if (selectedThread !== "TODOS" && p.neckThread !== selectedThread) {
        return false;
      }

      // 6. Rango de capacidad
      if (selectedCapacityRange !== "TODAS") {
        if (!matchesCapacityRange(p, selectedCapacityRange)) {
          return false;
        }
      }

      // 7. Búsqueda por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchFinish = p.finish.toLowerCase().includes(q);
        const matchThread = p.neckThread.toLowerCase().includes(q);
        const matchCat = p.categoryLabel.toLowerCase().includes(q);
        const matchSub = p.subcategory?.toLowerCase().includes(q) || false;
        const matchMaterial = p.material.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchSku &&
          !matchFinish &&
          !matchThread &&
          !matchCat &&
          !matchSub &&
          !matchMaterial
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeUnit,
    selectedCategory,
    selectedSubcategory,
    selectedMaterial,
    selectedThread,
    selectedCapacityRange,
    searchQuery,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("TODAS");
    setSelectedSubcategory("TODAS");
    setSelectedMaterial("TODOS");
    setSelectedThread("TODOS");
    setSelectedCapacityRange("TODAS");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "TODAS" ||
    selectedSubcategory !== "TODAS" ||
    selectedMaterial !== "TODOS" ||
    selectedThread !== "TODOS" ||
    selectedCapacityRange !== "TODAS";

  const categoriesForUnit =
    activeUnit === "ENVASES" || activeUnit === "HOME" ? FAMILIES_BY_UNIT[activeUnit] : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle flex flex-col justify-between selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
      <div>
        <Navbar
          activeUnit={activeUnit}
          onSelectUnit={(unit) => {
            setActiveUnit(unit);
            setSelectedMaterial("TODOS");
            setSelectedThread("TODOS");
            setSelectedCategory("TODAS");
            setSelectedSubcategory("TODAS");
            setSelectedCapacityRange("TODAS");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ============================================================ */}
          {/* PESTAÑA 0: PORTADA DE BIENVENIDA / LANDING PAGE              */}
          {/* ============================================================ */}
          {activeUnit === "INICIO" ? (
            <WelcomeLanding
              featuredProducts={featuredProducts}
              totalCatalogCount={PRODUCTS_SEED.length}
              onNavigateUnit={handleNavigateFromLanding}
              onOpenComboModal={(prod) => {
                setComboProduct(prod);
                setIsComboModalOpen(true);
              }}
            />
          ) : activeUnit !== "B2B" ? (
            /* ============================================================ */
            /* PESTAÑA 1 & 2: CATÁLOGO COMERCIAL (ENVASES / HOME)           */
            /* ============================================================ */
            <>
              {/* Barra de Retorno a Bienvenida */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveUnit("INICIO")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66615B] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#9E734E]" />
                  <span>Volver a la portada de bienvenida</span>
                </button>

                <div className="flex items-center gap-2 text-[11px] text-[#8C827A]">
                  <span>Cambiar unidad:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveUnit(activeUnit === "ENVASES" ? "HOME" : "ENVASES");
                      clearFilters();
                    }}
                    className="font-bold text-[#9E734E] hover:underline cursor-pointer"
                  >
                    {activeUnit === "ENVASES" ? "Ir a OSSIL Home →" : "Ir a OSSIL Envases →"}
                  </button>
                </div>
              </div>

              {/* Hero Editorial Apothecary con Entrada Suave */}
              <section className="mb-8 animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E6E2DC]">
                  <div className="max-w-2xl space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                        {activeUnit === "ENVASES"
                          ? "Catálogo Packaging & Laboratorio"
                          : "Catálogo Home & Insumos de Autor"}
                      </span>
                      <span className="text-xs text-[#8C827A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9E734E]" />
                        <span>Oncativo 69, Local 1 • Córdoba Capital</span>
                      </span>
                      <StoreStatusBadge />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight leading-tight">
                      {activeUnit === "ENVASES"
                        ? "Catálogo completo de Envases, Frascos y Cierres"
                        : "Catálogo completo de Insumos para Velas, Difusores y Bazar"}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed">
                      {activeUnit === "ENVASES"
                        ? "Filtrá por familia, material o medida de rosca para encontrar el envase y su tapa compatible con escalas mayoristas hasta -28% OFF."
                        : "Cera de soja, esencias concentradas, pabilos, frascos difusores, línea térmica y bazar gastronómico con stock inmediato."}
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

                {/* ============================================================ */}
                {/* BARRA SUPERIOR: FAMILIAS DE PRODUCTO (SIN SCROLLBAR MOLESTA) */}
                {/* ============================================================ */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#141413]">
                      Familias de Producto:
                    </span>
                    <span className="text-[11px] text-[#8C827A]">
                      {filteredProducts.length} productos coincidentes
                    </span>
                  </div>

                  {/* Desktop: wrap flexible sin scroll horizontal forzado */}
                  <div className="hidden lg:flex flex-wrap items-center gap-2">
                    {categoriesForUnit.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubcategory("TODAS");
                          }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#141413] text-[#FAF8F5] shadow-xs"
                              : "bg-[#FFFFFF] text-[#66615B] border border-[#E6E2DC] hover:border-[#9E734E] hover:text-[#141413]"
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile: horizontal scroll con fade y scroll suave */}
                  <div className="lg:hidden relative">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
                      {categoriesForUnit.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedSubcategory("TODAS");
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? "bg-[#141413] text-[#FAF8F5] shadow-xs"
                                : "bg-[#FFFFFF] text-[#66615B] border border-[#E6E2DC] hover:border-[#9E734E]"
                            }`}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ============================================================ */}
                  {/* SUBCATEGORÍAS CONTEXTUALES CONDICIONALES                     */}
                  {/* (Solo se renderizan cuando selectedCategory !== "TODAS")     */}
                  {/* ============================================================ */}
                  {selectedCategory !== "TODAS" && availableSubcategories.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-[#E6E2DC]/70 animate-fade-in">
                      <span className="text-[11px] font-bold text-[#8C827A] mr-1">
                        Línea / Subcategoría:
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSubcategory("TODAS")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedSubcategory === "TODAS"
                            ? "bg-[#9E734E] text-white font-bold"
                            : "bg-[#EBE7DF] text-[#66615B] hover:text-[#141413]"
                        }`}
                      >
                        Todas las líneas
                      </button>
                      {availableSubcategories.map((sub) => {
                        const isSelected = selectedSubcategory === sub;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setSelectedSubcategory(sub)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#9E734E] text-white font-bold"
                                : "bg-[#FFFFFF] text-[#66615B] border border-[#E6E2DC] hover:border-[#9E734E]"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* Botón Sticky Mobile para Abrir Cajón de Filtros Facetados */}
              <div className="lg:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl liquid-glass border border-[#E6E2DC] flex items-center justify-between text-xs font-bold text-[#141413] shadow-2xs hover:border-[#9E734E] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#9E734E]" />
                    <span>Filtros facetados (Boca, Material, Capacidad)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#141413] text-white text-[10px] font-mono">
                    {activeFacetsCount > 0 ? `${activeFacetsCount} activos` : "Filtrar"}
                  </span>
                </button>
              </div>

              {/* ============================================================ */}
              {/* ESTRUCTURA PRINCIPAL EN 2 COLUMNAS (DESKTOP SIDEBAR + GRID)  */}
              {/* ============================================================ */}
              <div className="flex items-start gap-8">
                {/* Columna Lateral Izquierda (Desktop 280px) */}
                <CatalogSidebar
                  unit={activeUnit as BusinessUnit}
                  selectedMaterial={selectedMaterial}
                  onSelectMaterial={setSelectedMaterial}
                  selectedThread={selectedThread}
                  onSelectThread={setSelectedThread}
                  selectedCapacityRange={selectedCapacityRange}
                  onSelectCapacityRange={setSelectedCapacityRange}
                  threadCounts={threadCounts}
                  materialCounts={materialCounts}
                  capacityCounts={capacityCounts}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />

                {/* Área Principal de Contenido y Grilla */}
                <div id="catalog-grid" className="flex-1 min-w-0">
                  {/* Chips de Filtros Activos con Botón de Eliminar */}
                  <ActiveFilterChips
                    unit={activeUnit as BusinessUnit}
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    selectedMaterial={selectedMaterial}
                    selectedThread={selectedThread}
                    selectedCapacityRange={selectedCapacityRange}
                    searchQuery={searchQuery}
                    totalFiltered={filteredProducts.length}
                    onRemoveCategory={() => {
                      setSelectedCategory("TODAS");
                      setSelectedSubcategory("TODAS");
                    }}
                    onRemoveSubcategory={() => setSelectedSubcategory("TODAS")}
                    onRemoveMaterial={() => setSelectedMaterial("TODOS")}
                    onRemoveThread={() => setSelectedThread("TODOS")}
                    onRemoveCapacityRange={() => setSelectedCapacityRange("TODAS")}
                    onRemoveSearchQuery={() => setSearchQuery("")}
                    onClearAll={clearFilters}
                  />

                  {/* Grilla de Productos */}
                  <section className="animate-fade-in-stagger-2">
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                </div>
              </div>

              {/* Drawer Bottom Sheet para Filtros en Mobile */}
              <MobileFiltersDrawer
                isOpen={isMobileFiltersOpen}
                onClose={() => setIsMobileFiltersOpen(false)}
                unit={activeUnit as BusinessUnit}
                selectedMaterial={selectedMaterial}
                onSelectMaterial={setSelectedMaterial}
                selectedThread={selectedThread}
                onSelectThread={setSelectedThread}
                selectedCapacityRange={selectedCapacityRange}
                onSelectCapacityRange={setSelectedCapacityRange}
                threadCounts={threadCounts}
                materialCounts={materialCounts}
                capacityCounts={capacityCounts}
                totalFiltered={filteredProducts.length}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </>
          ) : (
            /* ============================================================ */
            /* PESTAÑA 3: SERVICIOS INDUSTRIALES B2B                        */
            /* ============================================================ */
            <div className="space-y-12 animate-fade-in-up">
              <div>
                <button
                  type="button"
                  onClick={() => setActiveUnit("INICIO")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66615B] hover:text-[#141413] transition-colors cursor-pointer mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#9E734E]" />
                  <span>Volver a la portada de bienvenida</span>
                </button>

                {/* Header de la Unidad B2B */}
                <div className="border-b border-[#E6E2DC] pb-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
                      Asesoramiento Técnico B2B
                    </span>
                    <span className="text-xs text-[#8C827A]">
                      • Tiradas comerciales desde 500 unidades
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight">
                    Asesoramiento en Personalización y Acabados de Packaging
                  </h1>
                  <p className="text-xs sm:text-sm text-[#66615B] max-w-3xl leading-relaxed">
                    Te brindamos asesoramiento integral para personalizar tus envases: evaluamos la
                    compatibilidad técnica de cada material (vidrio, PET, PEAD o aluminio), te
                    orientamos en la técnica ideal (serigrafía vitrificable, satinado, tampografía
                    en tapas o hot-stamping) y articulamos el nexo con talleres especializados para
                    que tu marca logre el acabado exacto que necesita. Hacé click en cualquier
                    muestra para verla en detalle.
                  </p>
                </div>
              </div>

              {/* Grilla de Técnicas de Acabado B2B (Muestras Clickeables) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {B2B_SAMPLES.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => {
                      setB2bSelectedSample(s);
                      setIsB2BModalOpen(true);
                    }}
                    aria-label={`Ver muestra detallada de ${s.title}`}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs hover:border-[#9E734E] hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden cursor-pointer active:scale-99 text-left w-full focus-visible:ring-2 focus-visible:ring-[#9E734E]"
                  >
                    <div className="space-y-3">
                      {/* Fotografía de ejemplo del proceso con botón de zoom */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E6E2DC]/80">
                        <Image
                          src={s.image}
                          alt={`Ejemplo de ${s.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 motion-safe:transition-transform"
                        />
                        <span className="absolute bottom-2 left-2 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                          Muestra de Referencia
                        </span>
                        <span className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs group-hover:bg-[#9E734E] transition-colors">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#9E734E] uppercase tracking-wider block">
                          {s.tech}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#141413] mt-0.5 group-hover:text-[#9E734E] transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-xs text-[#66615B] mt-2 leading-relaxed">{s.desc}</p>
                      </div>

                      {/* Ejemplo destacado concreto */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] space-y-1">
                        <span className="font-bold text-[#141413] flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#9E734E]">
                          <Sparkles className="w-3 h-3 text-[#9E734E]" />
                          Ejemplo de Aplicación:
                        </span>
                        <p className="text-[#57534E] leading-snug">{s.example}</p>
                      </div>
                    </div>

                    <div className="pt-3.5 mt-3.5 border-t border-[#F0ECE4] text-[11px] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8C827A]">Tirada Mínima:</span>
                        <strong className="text-[#141413] font-mono">{s.minQty}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C827A]">Tiempo de Entrega:</span>
                        <span className="text-[#66615B] font-medium">{s.leadTime}</span>
                      </div>
                      <div className="pt-1.5 text-center">
                        <span className="text-[10px] font-bold text-[#9E734E] group-hover:underline flex items-center justify-center gap-1">
                          <span>Ver muestra en detalle</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Editorial y de Soporte Operativo */}
      <footer className="liquid-glass border-t border-white/70 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#66615B]">
            <div className="space-y-3">
              <span className="font-mono text-xl font-black text-[#141413] block">
                OSSIL ENVASES & HOME
              </span>
              <p className="text-xs leading-relaxed max-w-md">
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
          <div className="flex items-center gap-2">
            <a
              href={STORE_CONFIG.contact.whatsappUrl(
                "Hola OSSIL, tengo una consulta sobre el catálogo.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#242422] border border-[#3A3A36] text-xs font-bold text-emerald-400 flex items-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-black flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          >
            <span>Mi Pedido ({totalItemsCount})</span>
            <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.5 rounded">
              ${totalCartWithIva.toLocaleString("es-AR")} c/IVA
            </span>
          </button>
        </div>
      </div>

      {/* Modal Lightbox para Muestras B2B de Taller */}
      <B2BSampleLightboxModal
        sample={b2bSelectedSample}
        isOpen={isB2BModalOpen}
        onClose={() => {
          setIsB2BModalOpen(false);
          setB2bSelectedSample(null);
        }}
      />

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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <HomePageContent />
    </Suspense>
  );
}
