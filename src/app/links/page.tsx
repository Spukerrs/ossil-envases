"use client";

import {
  ChevronRight,
  Clock,
  FileSpreadsheet,
  Home,
  type LucideIcon,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { STORE_CONFIG } from "@/lib/constants";

interface LinkItemData {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  featured: boolean;
  badge?: string;
  isExternal: boolean;
}

function LinkCard({ link }: { link: LinkItemData }) {
  const Icon = link.icon;
  const content = (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        link.featured
          ? "bg-[#141413] text-white border-[#141413] shadow-md hover:bg-[#2B2B28] active:scale-98"
          : "bg-[#FFFFFF] text-[#141413] border-[#E6E2DC] hover:border-[#9E734E] shadow-2xs active:scale-98"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            link.featured
              ? "bg-[#9E734E] text-white"
              : "bg-[#FAF8F5] text-[#9E734E] border border-[#E6E2DC]"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold leading-tight block">{link.title}</span>
            {link.badge && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                {link.badge}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] block mt-0.5 ${
              link.featured ? "text-[#D4CEBF]" : "text-[#66615B]"
            }`}
          >
            {link.subtitle}
          </span>
        </div>
      </div>

      <ChevronRight
        className={`w-4 h-4 shrink-0 ${link.featured ? "text-[#A8A29E]" : "text-[#8C827A]"}`}
      />
    </div>
  );

  if (link.isExternal) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className="block">
      {content}
    </Link>
  );
}

export default function LinksPage() {
  const links: LinkItemData[] = [
    {
      title: "WhatsApp Ventas & Pedidos Mostrador",
      subtitle: `Atención directa en Córdoba: ${STORE_CONFIG.contact.phoneDisplay}`,
      href: STORE_CONFIG.contact.whatsappUrl(
        "Hola OSSIL, quiero hacer un pedido o consultar stock.",
      ),
      icon: MessageCircle,
      featured: true,
      badge: "Respuesta en el día",
      isExternal: true,
    },
    {
      title: "Explorar Catálogo Digital con Escalas",
      subtitle: "Envases, goteros y cálculo automático de descuentos",
      href: "/",
      icon: Package,
      featured: false,
      isExternal: false,
    },
    {
      title: "Línea OSSIL Home & Velas",
      subtitle: "Bazar, ceras de soja, esencias y difusores",
      href: "/?unit=HOME",
      icon: Home,
      featured: false,
      isExternal: false,
    },
    {
      title: "Cotización B2B: Serigrafía y Satinado",
      subtitle: "Personalización horneada para tu marca",
      href: "/?unit=B2B",
      icon: Sparkles,
      featured: false,
      isExternal: false,
    },
    {
      title: "Cómo Llegar al Local (Google Maps)",
      subtitle: "Oncativo 69, Local 1 (Córdoba Capital)",
      href: "https://maps.app.goo.gl/6mLg33JqzYa4pJsP8",
      icon: MapPin,
      featured: false,
      isExternal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col justify-between py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Cabecera / Perfil de Marca Industrial Apothecary */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
            <Image
              src="/images/brand/logo-ossil.png"
              alt="OSSIL Envases"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl font-black text-[#141413] tracking-tight">
              OSSIL Envases & OSSIL Home
            </h1>
            <p className="text-xs text-[#66615B] font-medium mt-1">
              Distribuidora Mayorista y Minorista • Córdoba Capital
            </p>
          </div>

          {/* Social Proof: 4.9 estrellas */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs text-xs font-bold text-[#141413]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>4.9 en Google Maps</span>
            <span className="text-[#8C827A] font-normal">
              ({STORE_CONFIG.reputation.reviewsCount.toLocaleString("es-AR")} opiniones)
            </span>
          </div>
        </div>

        {/* Tarjeta de Horarios y Dirección sin error de ubicación */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] shadow-2xs space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#9E734E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#141413]">Oncativo 69, Local 1</strong>
              <span className="text-[#66615B] block">Zona Centro • Córdoba Capital</span>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1.5 border-t border-[#F0ECE4]">
            <Clock className="w-4 h-4 text-[#9E734E] shrink-0 mt-0.5" />
            <div className="text-[#66615B]">
              <span>Lun a Vie: 08:00 a 17:15 hs</span>
              <span className="block">Sáb: 09:00 a 13:30 hs</span>
            </div>
          </div>
        </div>

        {/* Lista de Enlaces Verticales Mobile-First */}
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard key={link.title} link={link} />
          ))}
        </div>

        {/* Acceso a Simulación de Precios para el Cliente */}
        <div className="pt-2 text-center">
          <Link
            href="/admin/precios"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#835C3A] hover:underline"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ver Demostrador de Ingesta Masiva ERP (Precios)</span>
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-center text-[11px] text-[#8C827A]">
        <span>© 2026 OSSIL Envases • Oncativo 69, Córdoba Capital</span>
      </footer>
    </div>
  );
}
