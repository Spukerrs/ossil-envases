"use client";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { StoreStatusBadge } from "@/components/StoreStatusBadge";
import { STORE_CONFIG } from "@/lib/constants";
import type { BusinessUnit, Product } from "@/types/catalog";

interface WelcomeLandingProps {
  featuredProducts: Product[];
  totalCatalogCount: number;
  onNavigateUnit: (unit: BusinessUnit | "B2B", category?: string, thread?: string) => void;
  onOpenComboModal: (product: Product) => void;
}

export function WelcomeLanding({
  featuredProducts,
  totalCatalogCount,
  onNavigateUnit,
  onOpenComboModal,
}: WelcomeLandingProps) {
  const quickIndustries = [
    {
      id: "cosmetica-botellas",
      unit: "ENVASES" as BusinessUnit,
      title: "Cosmética & Cuidado Personal",
      subtitle: "Botellas PET, PEAD, potes acrílicos y bombas cremeras",
      badge: "Rosca 24/410 • 28/410",
      image: "/images/products/venecia-250.webp",
      count: "320+ referencias",
    },
    {
      id: "perfumeria",
      unit: "ENVASES" as BusinessUnit,
      title: "Perfumería Fina & Esencias",
      subtitle: "Frascos vidrio cristal y satinado, válvulas spray y esencias puras",
      badge: "Boca B/E 15 • 18/415",
      image: "/images/products/equatone-30-satinado.webp",
      count: "180+ referencias",
    },
    {
      id: "medicinal",
      unit: "ENVASES" as BusinessUnit,
      title: "Laboratorio & Fitomedicina",
      subtitle: "Frascos ámbar UV, goteros con pipeta de vidrio, viales y potes PEAD",
      badge: "Boca B/R 18 • B/R 28",
      image: "/images/products/gotero-ambar.webp",
      count: "150+ referencias",
    },
    {
      id: "alimenticio",
      unit: "ENVASES" as BusinessUnit,
      title: "Alimentos, Conservas & Bebidas",
      subtitle: "Frascos boca axial, damajuanas, growlers, licoreras y tapas metálicas",
      badge: "Boca B/AX 63 • B/AX 70",
      image: "/images/products/sevilla-ambar.webp",
      count: "145+ referencias",
    },
    {
      id: "velas",
      unit: "HOME" as BusinessUnit,
      title: "Insumos para Velas & Aromas",
      subtitle: "Cera de soja pura, pabilos encerados, esencias, moldes y difusores",
      badge: "OSSIL Home • Artesanal",
      image: "/images/products/difusor-hexagonal.webp",
      count: "240+ referencias",
    },
    {
      id: "bazar",
      unit: "HOME" as BusinessUnit,
      title: "Bazar, Térmicos & Deco",
      subtitle: "Termos Stanley, mates imperiales, dispensers con canilla y cristalería",
      badge: "Hogar & Gastronomía",
      image: "/images/products/termo-stanley.webp",
      count: "280+ referencias",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-8 animate-fade-in-up">
      {/* ===================================================================== */}
      {/* 1. HERO DE BIENVENIDA EDITORIAL (SIN SATURACIÓN VISUAL)               */}
      {/* ===================================================================== */}
      <section className="relative pt-2 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna Editorial Izquierda */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex sm:inline-flex flex-wrap items-center gap-2 sm:gap-2.5 p-2 sm:p-1.5 sm:pr-3.5 rounded-2xl sm:rounded-full liquid-glass max-w-full">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#141413] px-2.5 py-1 rounded-full shrink-0">
                Bienvenidos a OSSIL
              </span>
              <span className="text-xs font-medium text-[#57534E] flex items-center gap-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#9E734E]" />
                <span>Oncativo 69, Córdoba Capital</span>
              </span>
              <div className="shrink-0">
                <StoreStatusBadge />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-[#141413] tracking-tight leading-[1.08]">
                El punto de partida para{" "}
                <span className="text-[#9E734E] underline decoration-[#E6E2DC] decoration-2 underline-offset-8">
                  envasar tu marca
                </span>{" "}
                y equipar tu proyecto.
              </h1>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl">
                Somos la distribuidora mayorista y minorista de referencia en Córdoba. Unimos{" "}
                <strong className="text-[#141413] font-bold">
                  1.316 artículos en stock inmediato
                </strong>{" "}
                —desde envases técnicos con compatibilidad milimétrica de roscas hasta insumos para
                velas de soja y bazar— con atención personalizada por sus propios dueños.
              </p>
            </div>

            {/* Botones de Acción Principal (Jerarquía Clara) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigateUnit("ENVASES")}
                className="px-6 py-4 rounded-2xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer group"
              >
                <span>Explorar Catálogo de Envases</span>
                <ArrowRight className="w-4 h-4 text-[#9E734E] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateUnit("HOME")}
                className="px-6 py-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F3EFEA] text-[#141413] border border-[#DCD6C9] hover:border-[#9E734E] text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#9E734E]" />
                <span>Ver OSSIL Home & Velas</span>
              </button>
            </div>

            {/* Tira de Respaldo y Confianza */}
            <div className="pt-4 border-t border-[#E6E2DC] grid grid-cols-3 gap-4 max-w-xl">
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-mono text-base sm:text-lg font-black text-[#141413]">
                    4.9 / 5.0
                  </span>
                </div>
                <p className="text-[11px] text-[#66615B] mt-0.5">7.466 reseñas en Google</p>
              </div>

              <div className="border-l border-[#E6E2DC] pl-4">
                <span className="font-mono text-base sm:text-lg font-black text-[#B45309] block">
                  Hasta -28% OFF
                </span>
                <p className="text-[11px] text-[#66615B] mt-0.5">Escalas automáticas (+10u)</p>
              </div>

              <div className="border-l border-[#E6E2DC] pl-4">
                <span className="font-mono text-base sm:text-lg font-black text-[#141413] block">
                  Sin Mínimo
                </span>
                <p className="text-[11px] text-[#66615B] mt-0.5">Compra minorista y mayorista</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Composición Visual Editorial en Liquid Glass */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl liquid-glass-strong p-4 sm:p-5 space-y-4">
              {/* Cabecera Técnica de Tarjeta */}
              <div className="flex items-center justify-between border-b border-[#E6E2DC]/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9E734E]" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141413]">
                    Muestrario Técnico OSSIL
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#57534E] frosted-well px-2.5 py-1 rounded-md">
                  Stock Real • Córdoba
                </span>
              </div>

              {/* Grilla 2x2 de Piezas Emblemáticas */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateUnit("ENVASES", "perfumeria")}
                  className="group relative rounded-2xl frosted-well liquid-glass-interactive p-3 text-left cursor-pointer overflow-hidden"
                >
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/85 border border-[#E6E2DC] text-[#141413] inline-block mb-1">
                    Rosca 18/415
                  </span>
                  <div className="relative h-28 w-full my-1">
                    <Image
                      src="/images/products/equatone-30-satinado.webp"
                      alt="Frasco Equatone Vidrio Satinado"
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#141413] truncate">Perfumería & Vidrio</p>
                  <span className="text-[10px] text-[#9E734E] font-medium">
                    Líneas Equatone & Vip →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateUnit("ENVASES", "medicinal")}
                  className="group relative rounded-2xl frosted-well liquid-glass-interactive p-3 text-left cursor-pointer overflow-hidden"
                >
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50/90 border border-amber-200 text-[#B45309] inline-block mb-1">
                    Ámbar UV • B/R 18
                  </span>
                  <div className="relative h-28 w-full my-1">
                    <Image
                      src="/images/products/gotero-ambar.webp"
                      alt="Gotero Medicinal Vidrio Ámbar"
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#141413] truncate">Goteros & Laboratorio</p>
                  <span className="text-[10px] text-[#9E734E] font-medium">
                    Pipetas y precintos →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateUnit("HOME", "velas")}
                  className="group relative rounded-2xl frosted-well liquid-glass-interactive p-3 text-left cursor-pointer overflow-hidden"
                >
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/85 border border-[#E6E2DC] text-[#141413] inline-block mb-1">
                    OSSIL Home
                  </span>
                  <div className="relative h-28 w-full my-1">
                    <Image
                      src="/images/products/difusor-hexagonal.webp"
                      alt="Insumos para Velas y Difusores"
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#141413] truncate">Velas & Aromaterapia</p>
                  <span className="text-[10px] text-[#9E734E] font-medium">
                    Cera de soja y esencias →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateUnit("ENVASES", "accesorios")}
                  className="group relative rounded-2xl frosted-well liquid-glass-interactive p-3 text-left cursor-pointer overflow-hidden"
                >
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/85 border border-[#E6E2DC] text-[#141413] inline-block mb-1">
                    24/410 • 28/410
                  </span>
                  <div className="relative h-28 w-full my-1">
                    <Image
                      src="/images/products/cremera-negra.webp"
                      alt="Válvulas, Bombas y Tapas"
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#141413] truncate">Válvulas & Cierres</p>
                  <span className="text-[10px] text-[#9E734E] font-medium">
                    Compatibilidad exacta →
                  </span>
                </button>
              </div>

              {/* Pie de Muestrario con Buscador de Roscas Rápido */}
              <div className="p-3 rounded-2xl frosted-well flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#4A4742]">
                  <strong className="text-[#141413] block">¿Buscás una rosca específica?</strong>
                  <span>Filtrá envases y tapas que encastran sin pérdidas.</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {["18/415", "24/410", "28/400"].map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => onNavigateUnit("ENVASES", "TODAS", th)}
                      className="px-2 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#141413] text-[#141413] hover:text-[#FAF8F5] font-mono text-[10px] font-bold border border-[#DCD6C9] transition-colors cursor-pointer"
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. LAS 3 UNIDADES DE NEGOCIO ( ORIENTACIÓN CLARA PARA EL VISITANTE )   */}
      {/* ===================================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E2DC] pb-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E]">
              Estructura Comercial OSSIL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
              ¿Qué estás buscando hoy? Elegí tu división
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#66615B] max-w-md">
            Organizamos nuestro inventario en tres áreas especializadas para que encuentres tus
            insumos sin perder tiempo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Unidad 1: OSSIL ENVASES */}
          <div className="p-6 sm:p-7 rounded-3xl liquid-glass liquid-glass-interactive flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-2xl frosted-well flex items-center justify-center text-xl">
                  📦
                </span>
                <span className="font-mono text-xs font-bold text-[#9E734E] frosted-well px-3 py-1 rounded-full">
                  796 Productos
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#141413]">1. OSSIL Envases</h3>
                <p className="text-xs font-bold text-[#9E734E] uppercase tracking-wider mt-0.5">
                  Packaging Industrial & Mayorista
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed">
                Botellas PET y PEAD, frascos de vidrio para perfumería y conservas, potes
                cosméticos, goteros medicinales, bidones de hasta 25 L y el sistema completo de
                tapas, válvulas spray y bombas dosificadoras.
              </p>
              <ul className="space-y-1.5 text-xs text-[#4A4742] pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Filtro inteligente de roscas (18/415, 24/410, 28/400, B/AX)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Descuentos por volumen automáticos en carrito</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigateUnit("ENVASES")}
              className="w-full py-3.5 px-4 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Abrir Catálogo de Envases</span>
              <ArrowRight className="w-4 h-4 text-[#9E734E]" />
            </button>
          </div>

          {/* Unidad 2: OSSIL HOME */}
          <div className="p-6 sm:p-7 rounded-3xl liquid-glass liquid-glass-interactive flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-2xl frosted-well flex items-center justify-center text-xl">
                  🕯️
                </span>
                <span className="font-mono text-xs font-bold text-[#9E734E] frosted-well px-3 py-1 rounded-full">
                  520 Productos
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#141413]">2. OSSIL Home</h3>
                <p className="text-xs font-bold text-[#9E734E] uppercase tracking-wider mt-0.5">
                  Insumos para Velas, Difusores & Bazar
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed">
                Todo para fabricar velas de soja y aromatizantes de autor (cera de soja CPF,
                esencias puras, pabilos, moldes de silicona y varillas), además de termos Stanley,
                mates, dispensers de vidrio y cristalería deco.
              </p>
              <ul className="space-y-1.5 text-xs text-[#4A4742] pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Insumos puros de alto rendimiento para emprendedores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Bazar gastronómico y línea térmica original</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigateUnit("HOME")}
              className="w-full py-3.5 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Abrir Catálogo OSSIL Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Unidad 3: SERVICIOS INDUSTRIALES B2B */}
          <div className="p-6 sm:p-7 rounded-3xl liquid-glass-dark text-[#FAF8F5] transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-2xl bg-[#222220] border border-[#3E3E38] flex items-center justify-center text-[#9E734E]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <span className="font-mono text-xs font-bold text-[#D4CEBF] bg-[#222220] px-3 py-1 rounded-full border border-[#3E3E38]">
                  Desde 500 u.
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">3. Personalización B2B</h3>
                <p className="text-xs font-bold text-[#9E734E] uppercase tracking-wider mt-0.5">
                  Serigrafía, Satinado & Tampografía
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#D4CEBF] leading-relaxed">
                Llevá la presentación de tu laboratorio o marca al siguiente nivel con impresión
                vitrificable horneada a 580°C sobre vidrio, esmerilado químico al ácido anti-huella
                y tampografía industrial en tapas.
              </p>
              <ul className="space-y-1.5 text-xs text-[#D4CEBF] pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Pinturas inorgánicas resistentes a alcohol y aceites</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9E734E] shrink-0" />
                  <span>Muestras previas en nuestro local de Córdoba</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigateUnit("B2B")}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#141413] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Ver Servicios de Personalización</span>
              <ArrowRight className="w-4 h-4 text-[#9E734E]" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. EXPLORACIÓN RÁPIDA POR RUBRO (ACCESO EN 1 CLIC)                    */}
      {/* ===================================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E2DC] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E]">
              Atajos por Industria
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
              Entrá directo a tu rubro de producción
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateUnit("ENVASES")}
            className="text-xs font-bold text-[#9E734E] hover:text-[#141413] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver las {totalCatalogCount} referencias cargadas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickIndustries.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateUnit(item.unit, item.id)}
              className="group p-5 rounded-3xl liquid-glass liquid-glass-interactive text-left flex items-center gap-4 cursor-pointer"
            >
              <div className="relative w-20 h-24 rounded-2xl frosted-well shrink-0 overflow-hidden p-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-contain group-hover:scale-108 transition-transform"
                />
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#9E734E] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E2DC]">
                    {item.badge}
                  </span>
                  <span className="font-mono text-[10px] text-[#8C827A]">{item.count}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#141413] group-hover:text-[#9E734E] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-[#66615B] line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. POR QUÉ ELEGIR OSSIL (BENEFICIOS REALES Y DIFERENCIALES TÉCNICOS)  */}
      {/* ===================================================================== */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-xs space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#EBE7DF] border border-[#DCD6C9]">
            Por qué elegirnos
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
            Diseñado para que comprar envases sea simple, exacto y rentable
          </h2>
          <p className="text-xs sm:text-sm text-[#66615B] leading-relaxed">
            Sabemos que un error en la medida de una rosca frena tu producción. Por eso combinamos
            asesoramiento técnico presencial con herramientas digitales pensadas para emprendedores
            y laboratorios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] flex items-center justify-center text-[#9E734E]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#141413]">
              Compatibilidad de Roscas Garantizada
            </h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Cada envase muestra automáticamente solo las tapas, gatillos y válvulas spray que
              coinciden con su cuello milimétrico (`18/415`, `24/410`, `28/400`, `B/AX`).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] flex items-center justify-center text-[#B45309]">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#141413]">Escalas Mayoristas Automáticas</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Sumá unidades en el carrito (+10u, +25u, +50u o +100u) y el sistema recalcula tu
              descuento al instante hasta un <strong>-28% OFF</strong> sin pedir cotización previa.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] flex items-center justify-center text-[#9E734E]">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#141413]">Retiro Express en Oncativo 69</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Armá tu pedido online, generá tu código de orden y retirá en nuestro mostrador del
              centro de Córdoba sin hacer fila ni esperar armado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] flex items-center justify-center text-[#9E734E]">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#141413]">Envíos a Todo el País & Factura A</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Despachamos embalados con protección reforzada por el expreso o transporte que elijas.
              Registrate como cliente Mayorista con tu CUIT para Factura A.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. SELECCIÓN CURADA DE DESTACADOS (4 PRODUCTOS PARA NO SATURAR)        */}
      {/* ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E2DC] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E]">
              Más Elegidos en Córdoba
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
              Artículos destacados de rotación diaria
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateUnit("ENVASES")}
            className="px-5 py-2.5 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ir al Catálogo Completo ({totalCatalogCount} productos)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9E734E]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFilterThread={(th) => onNavigateUnit("ENVASES", "TODAS", th)}
              onOpenComboModal={onOpenComboModal}
            />
          ))}
        </div>

        {/* Banner Inferior hacia el Catálogo Completo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EBE7DF] border border-[#DCD6C9] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-black text-[#141413]">
              ¿Querés explorar las {totalCatalogCount} referencias con filtros por material,
              capacidad y rosca?
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Accedé al buscador completo con precios por escala actualizados y armado de combos de
              envase + tapa.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateUnit("ENVASES")}
              className="px-6 py-3.5 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>Ver Catálogo OSSIL Envases</span>
              <ArrowRight className="w-4 h-4 text-[#9E734E]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateUnit("HOME")}
              className="px-5 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#141413] border border-[#DCD6C9] text-xs font-bold transition-all cursor-pointer"
            >
              Ver Catálogo OSSIL Home
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. CÓMO COMPRAR EN 3 PASOS + RESEÑAS REALES DE GOOGLE MAPS             */}
      {/* ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Cómo comprar en 3 pasos */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#141413] text-[#FAF8F5] flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9E734E]">
              Proceso Ágil B2B & Minorista
            </span>
            <h2 className="text-2xl font-black text-white">Cómo realizar tu pedido en 3 pasos</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-[#9E734E] text-white font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                01
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Elegí tus envases y combiná sus cierres
                </h3>
                <p className="text-xs text-[#D4CEBF] mt-0.5 leading-relaxed">
                  Usá el botón <em>“Elegir Tapa”</em> en cada tarjeta para sumar las válvulas o
                  tapas que coinciden milimétricamente con tu envase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-[#9E734E] text-white font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                02
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Aprovechá las escalas por cantidad</h3>
                <p className="text-xs text-[#D4CEBF] mt-0.5 leading-relaxed">
                  Al superar 10, 25, 50 o 100 unidades por modelo, el carrito aplica automáticamente
                  el precio mayorista correspondiente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-[#9E734E] text-white font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                03
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Confirmá por WhatsApp y retirá sin espera
                </h3>
                <p className="text-xs text-[#D4CEBF] mt-0.5 leading-relaxed">
                  Emití tu voucher digital hacia nuestro WhatsApp oficial (
                  {STORE_CONFIG.contact.phoneDisplay}) para coordinar retiro en Oncativo 69 o envío
                  a domicilio.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2C2B29] flex items-center justify-between gap-3">
            <div className="text-[11px] text-[#D4CEBF]">
              <strong className="text-white block">¿Necesitás asesoramiento directo?</strong>
              <span>Escribinos y te ayudamos a elegir el envase ideal.</span>
            </div>
            <a
              href={STORE_CONFIG.contact.whatsappUrl(
                "Hola OSSIL, entré a la web y quisiera asesoramiento sobre envases.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Reseñas verificadas de Google Maps */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6E2DC] flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE4] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E734E]">
                Reputación Comprobada
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#141413]">
                Lo que dicen nuestros clientes en Córdoba
              </h2>
            </div>
            <a
              href="https://maps.app.goo.gl/6mLg33JqzYa4pJsP8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D9CE] hover:border-[#9E734E] text-xs font-bold text-[#141413] transition-colors self-start"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>4.9 ★ (7.466 opiniones)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5 flex flex-col justify-between">
              <p className="text-xs text-[#4A4742] leading-relaxed italic">
                “Excelente atención de Silvia y Oscar en el local de Oncativo. Conseguí frascos
                goteros con rosca 18 exactos para mi laboratorio de cosmética natural, sin pérdidas
                ni derrames.”
              </p>
              <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#141413] block">Farm. Silvia M.</span>
                  <span className="text-[10px] text-[#8C827A]">Fitofarmacia & Cosmética</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Verificado
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5 flex flex-col justify-between">
              <p className="text-xs text-[#4A4742] leading-relaxed italic">
                “Compro la cera de soja pura, pabilos y esencias concentradas por mayor. Los precios
                por escala me permitieron triplicar el margen en mi taller de velas artesanales.”
              </p>
              <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#141413] block">Marcos G.</span>
                  <span className="text-[10px] text-[#8C827A]">Taller de Velas & Aromas</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Info de Local Físico */}
          <div className="p-4 rounded-2xl bg-[#F3EFEA] border border-[#E6E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#DCD6C9] flex items-center justify-center text-[#9E734E] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#141413] block">
                  Showroom y Retiro: Oncativo 69, Local 1 (Centro, Córdoba)
                </strong>
                <span className="text-[#66615B]">
                  Lunes a Viernes de 08:00 a 17:15 hs • Sábados de 09:00 a 13:30 hs
                </span>
              </div>
            </div>
            <StoreStatusBadge />
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. ¿DÓNDE LO RETIRO? - SHOWROOM, PICKUP Y MAPA INTERACTIVO GOOGLE MAPS */}
      {/* ===================================================================== */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E6E2DC] shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F0ECE4] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9E734E]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#9E734E]">
                Punto de Retiro Oficial en Córdoba Capital
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141413]">¿Dónde lo retiro?</h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1 max-w-2xl leading-relaxed">
              Showroom mayorista y depósito central en pleno centro de Córdoba. Retirá tu pedido
              armado sin demoras o vení a conocer las muestras físicas de envases, roscas y
              acabados.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StoreStatusBadge />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Tarjeta de Información y Beneficios del Retiro */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DCD6C9] flex items-center justify-center text-[#9E734E] shrink-0 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8C827A] block">
                      Dirección Showroom & Depósito
                    </span>
                    <strong className="text-sm font-bold text-[#141413] block">
                      Oncativo 69, Local 1
                    </strong>
                    <span className="text-xs text-[#57534E] block">
                      Entre calles Alvear y Maipú • Córdoba Capital (X5000)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE5DC] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DCD6C9] flex items-center justify-center text-[#9E734E] shrink-0 shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8C827A] block">
                      Horarios de Atención y Entrega
                    </span>
                    <strong className="text-xs font-bold text-[#141413] block">
                      Lunes a Viernes: 08:00 a 17:15 hs
                    </strong>
                    <span className="text-xs text-[#57534E] block">
                      Sábados: 09:00 a 13:30 hs (Domingos y Feriados cerrado)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Ventajas del retiro local */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl frosted-well flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#141413] block">0% Costo de Envío</strong>
                    <span className="text-[#57534E]">
                      Retirás tu compra 100% gratis, sin montos mínimos obligatorios de flete.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl frosted-well flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#141413] block">
                      Pase Express con tu Número de Orden
                    </strong>
                    <span className="text-[#57534E]">
                      Coordinando por WhatsApp, tu pedido te espera armado y chequeado en mostrador.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl frosted-well flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#141413] block">
                      Testeo de Roscas y Acabados en Vivo
                    </strong>
                    <span className="text-[#57534E]">
                      Probá la compatibilidad milimétrica de tus tapas y válvulas antes de
                      llevarlas.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>Cómo llegar en Google Maps ↗</span>
              </a>

              <a
                href={STORE_CONFIG.contact.whatsappUrl(
                  "Hola OSSIL, quiero consultar sobre el retiro de un pedido en el local de Oncativo 69.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar Retiro</span>
              </a>
            </div>
          </div>

          {/* Iframe Interactivo de Google Maps */}
          <div className="lg:col-span-7 h-full min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-[#E6E2DC] shadow-inner relative group bg-[#FAF8F5]">
            <iframe
              title="Ubicación oficial de OSSIL Envases - Oncativo 69, Córdoba"
              src="https://maps.google.com/maps?q=Oncativo%2069%2C%20X5000%20C%C3%B3rdoba%2C%20Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
