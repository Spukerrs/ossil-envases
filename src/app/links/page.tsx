"use client";

import {
  ArrowLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Globe,
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
import { StoreStatusBadge } from "@/components/StoreStatusBadge";
import { STORE_CONFIG } from "@/lib/constants";

interface LinkItemData {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  featured?: boolean;
  badge?: string;
  isExternal: boolean;
}

function LinkCard({ link }: { link: LinkItemData }) {
  const Icon = link.icon;
  const content = (
    <div
      className={`p-5 sm:p-5.5 rounded-2xl transition-all flex items-center justify-between gap-4 ${
        link.featured
          ? "liquid-glass-dark text-white hover:opacity-95 active:scale-98"
          : "liquid-glass liquid-glass-interactive text-[#141413]"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            link.featured ? "bg-[#9E734E] text-white shadow-sm" : "frosted-well text-[#9E734E]"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-black leading-snug block">{link.title}</span>
            {link.badge && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                {link.badge}
              </span>
            )}
          </div>
          <span
            className={`text-xs sm:text-sm block mt-1 leading-relaxed ${
              link.featured ? "text-[#E6E2DC]" : "text-[#57534E]"
            }`}
          >
            {link.subtitle}
          </span>
        </div>
      </div>

      <ChevronRight
        className={`w-5 h-5 shrink-0 ${link.featured ? "text-[#D4CEBF]" : "text-[#8C827A]"}`}
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
  const primaryLinks: LinkItemData[] = [
    {
      title: "WhatsApp Ventas & Pedidos",
      subtitle: `Atención directa en Córdoba: ${STORE_CONFIG.contact.phoneDisplay}`,
      href: STORE_CONFIG.contact.whatsappUrl(
        "Hola OSSIL, vengo desde sus enlaces oficiales y quiero hacer una consulta.",
      ),
      icon: MessageCircle,
      featured: true,
      badge: "Respuesta rápida",
      isExternal: true,
    },
    {
      title: "Catálogo OSSIL Envases",
      subtitle: "Perfumería, cosmética, laboratorio, alimentos y cierres por escala",
      href: "/?unit=ENVASES",
      icon: Package,
      isExternal: false,
    },
    {
      title: "Catálogo OSSIL Home & Velas",
      subtitle: "Cera de soja pura, esencias, pabilos, difusores y bazar térmico",
      href: "/?unit=HOME",
      icon: Home,
      isExternal: false,
    },
    {
      title: "Personalización B2B (Serigrafía)",
      subtitle: "Vitrificado horneado, satinado al ácido y tampografía desde 500 u.",
      href: "/?unit=B2B",
      icon: Sparkles,
      isExternal: false,
    },
    {
      title: "Cómo Llegar al Local (Google Maps)",
      subtitle: "Oncativo 69, Local 1 • Centro, Córdoba Capital",
      href: STORE_CONFIG.location.googleMapsUrl,
      icon: MapPin,
      isExternal: true,
    },
  ];

  const socialChannels = [
    {
      name: "Instagram Oficial",
      handle: STORE_CONFIG.socials.instagramHandle,
      desc: "Lanzamientos, reels de envases e ideas",
      href: STORE_CONFIG.socials.instagram,
      badgeBg: "bg-[#9E734E]/15 text-[#835C3A] border-[#9E734E]/30",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Facebook Oficial",
      handle: STORE_CONFIG.socials.facebookHandle,
      desc: "Comunidad mayorista y novedades",
      href: STORE_CONFIG.socials.facebook,
      badgeBg: "bg-stone-200/80 text-[#141413] border-stone-300",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "TikTok OSSIL",
      handle: STORE_CONFIG.socials.tiktokHandle,
      desc: "Tips de velas de soja, roscas y armado",
      href: STORE_CONFIG.socials.tiktok,
      badgeBg: "bg-[#141413] text-white border-[#141413]",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      name: "Sitio Institucional",
      handle: "ossilenvases.com.ar",
      desc: "Portal corporativo OSSIL Córdoba",
      href: STORE_CONFIG.socials.officialWeb,
      badgeBg: "bg-amber-100 text-[#B45309] border-amber-300",
      svg: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] apothecary-grid-subtle text-[#141413] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto w-full space-y-6 animate-fade-in-up">
        {/* BOTÓN PRINCIPAL DESTACADO Y GRANDE PARA VOLVER A LA HOME */}
        <Link
          href="/"
          className="w-full py-4 px-6 rounded-2xl bg-[#9E734E] hover:bg-[#835C3A] text-white shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <div className="text-left">
              <span className="text-base sm:text-lg font-black leading-tight block">
                Volver a la Página Principal
              </span>
              <span className="text-xs sm:text-sm text-white/90 font-medium block">
                Entrar a la tienda online y bienvenida de OSSIL
              </span>
            </div>
          </div>
          <Home className="w-6 h-6 shrink-0 opacity-90" />
        </Link>

        {/* Cabecera / Perfil de Marca en Liquid Glass */}
        <div className="liquid-glass rounded-3xl p-6 text-center space-y-3.5">
          <div className="w-20 h-20 mx-auto rounded-2xl frosted-well relative flex items-center justify-center p-2">
            <Image
              src="/images/brand/logo-ossil.png"
              alt="OSSIL Envases"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
              OSSIL Envases & Home
            </h1>
            <p className="text-sm text-[#57534E] font-medium mt-1">
              Distribuidora Mayorista y Minorista • Córdoba Capital
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full frosted-well text-xs sm:text-sm font-bold text-[#141413]">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>4.9 ★ en Google Maps</span>
              <span className="text-[#66615B] font-normal">
                ({STORE_CONFIG.reputation.reviewsCount.toLocaleString("es-AR")} reseñas)
              </span>
            </div>
            <StoreStatusBadge />
          </div>
        </div>

        {/* Tarjeta de Horarios y Dirección con Tipografía Clara */}
        <div className="p-5 rounded-2xl liquid-glass space-y-2.5 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#9E734E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#141413] text-sm sm:text-base">Oncativo 69, Local 1</strong>
              <span className="text-[#57534E] text-xs sm:text-sm block">
                Zona Centro • Córdoba Capital (Retiro Express sin fila)
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-2.5 border-t border-[#E6E2DC]/80">
            <Clock className="w-5 h-5 text-[#9E734E] shrink-0 mt-0.5" />
            <div className="text-[#57534E] text-xs sm:text-sm">
              <span className="font-semibold text-[#141413]">Lunes a Viernes:</span> 08:00 a 17:15
              hs • <span className="font-semibold text-[#141413]">Sábados:</span> 09:00 a 13:30 hs
            </div>
          </div>
        </div>

        {/* Lista de Accesos Principales con Botones Grandes */}
        <div className="space-y-3.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#9E734E] px-1">
            Tienda Online & Atención Directa
          </h2>
          {primaryLinks.map((link) => (
            <LinkCard key={link.title} link={link} />
          ))}
        </div>

        {/* Sección de Redes Sociales Oficiales */}
        <div className="space-y-3.5 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#9E734E] px-1">
            Nuestras Redes Sociales Oficiales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialChannels.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl liquid-glass liquid-glass-interactive flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${soc.badgeBg}`}
                  >
                    {soc.svg}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-black text-[#141413] group-hover:text-[#9E734E] transition-colors block truncate">
                      {soc.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#9E734E] block truncate">
                      {soc.handle}
                    </span>
                    <span className="text-[11px] text-[#66615B] block truncate">{soc.desc}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8C827A] shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Botón Inferior Adicional de Retorno y Acceso ERP */}
        <div className="pt-4 space-y-3">
          <Link
            href="/"
            className="w-full py-4 px-6 rounded-2xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-sm sm:text-base font-black flex items-center justify-center gap-2.5 shadow-md transition-all"
          >
            <Home className="w-5 h-5 text-[#9E734E]" />
            <span>Ir a la Bienvenida y Catálogo Completo</span>
          </Link>

          <div className="text-center pt-1">
            <Link
              href="/admin/precios"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl frosted-well text-xs sm:text-sm font-bold text-[#835C3A] hover:text-[#141413] transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Acceso Dirección: Módulo ERP Precios (2FA)</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-[#66615B]">
        <span>© 2026 OSSIL Envases & OSSIL Home • Oncativo 69, Córdoba Capital</span>
      </footer>
    </div>
  );
}
