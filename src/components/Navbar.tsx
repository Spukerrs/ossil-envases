"use client";

import {
  Building2,
  ChevronDown,
  FileSpreadsheet,
  Home,
  LogOut,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { StoreStatusBadge } from "@/components/StoreStatusBadge";
import { IVA_RATE } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import type { BusinessUnit } from "@/types/catalog";

export type ActiveView = "INICIO" | BusinessUnit | "B2B";

interface NavbarProps {
  activeUnit: ActiveView;
  onSelectUnit?: (unit: ActiveView) => void;
  onOpenCart: () => void;
}

export function Navbar({ activeUnit, onSelectUnit, onOpenCart }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const itemsCount = useCartStore((s) => s.getTotalItemsCount());
  const netAmount = useCartStore((s) => s.getTotalAmount());
  const totalWithIva = Math.round(netAmount * (1 + IVA_RATE));

  const { user, logout } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavigate = (unit: ActiveView) => {
    if (pathname === "/" && onSelectUnit) {
      startTransition(() => {
        onSelectUnit(unit);
      });
      if (unit === "INICIO") {
        window.history.replaceState(null, "", "/");
      } else {
        window.history.replaceState(null, "", `/?unit=${unit}`);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Si el usuario está en /producto/[id] u otra subruta, redirigir de inmediato a la home con la vista seleccionada
    const targetUrl = unit === "INICIO" ? "/" : `/?unit=${unit}`;
    startTransition(() => {
      router.push(targetUrl);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 liquid-glass-strong border-b border-white/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
            {/* Logo & Identidad de Marca */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={() => handleNavigate("INICIO")}
                className="flex items-center gap-2.5 group select-none text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#9E734E] rounded-xl p-1 -ml-1"
                aria-label="Volver a la página de bienvenida de OSSIL"
              >
                <div className="relative h-11 w-9 shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/brand/logo-ossil.png"
                    alt="OSSIL Envases & Home"
                    width={38}
                    height={46}
                    style={{ width: "auto", height: "auto" }}
                    className="object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-[#141413] group-hover:text-[#9E734E] transition-colors leading-none">
                    OSSIL
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#9E734E] mt-0.5">
                    Envases & Home • Córdoba
                  </span>
                </div>
              </button>

              {/* Badge de Reseñas de Google Maps en Liquid Glass */}
              <a
                href="https://maps.app.goo.gl/6mLg33JqzYa4pJsP8"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full frosted-well text-xs font-medium text-[#141413] hover:border-[#9E734E] transition-colors"
                title="Ver 7.466 reseñas reales en Google Maps"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="font-bold">4.9</span>
                <span className="text-[#66615B] text-[11px]">(7.466 opiniones)</span>
              </a>

              {/* Indicador de Estado de la Tienda (Abierto / Cerrado) */}
              <div className="hidden lg:block">
                <StoreStatusBadge />
              </div>
            </div>

            {/* Selector de Vistas y Unidades de Negocio (Desktop) */}
            <nav
              aria-label="Navegación Principal OSSIL"
              className="hidden md:flex items-center p-1 frosted-well rounded-2xl"
            >
              <button
                type="button"
                onClick={() => handleNavigate("INICIO")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-97 ${
                  pathname === "/" && activeUnit === "INICIO"
                    ? "bg-[#141413] text-[#FAF8F5] shadow-sm"
                    : "text-[#57534E] hover:text-[#141413] hover:bg-white/60"
                }`}
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span>Bienvenida</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("ENVASES")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-97 ${
                  pathname === "/" && activeUnit === "ENVASES"
                    ? "liquid-glass text-[#141413] shadow-xs"
                    : "text-[#57534E] hover:text-[#141413] hover:bg-white/60"
                }`}
              >
                📦 <span className="hidden lg:inline">Catálogo </span>Envases
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("HOME")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-97 ${
                  pathname === "/" && activeUnit === "HOME"
                    ? "liquid-glass text-[#141413] shadow-xs"
                    : "text-[#57534E] hover:text-[#141413] hover:bg-white/60"
                }`}
              >
                🏡 <span className="hidden lg:inline">Catálogo </span>Home
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("B2B")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-97 ${
                  pathname === "/" && activeUnit === "B2B"
                    ? "bg-[#9E734E] text-[#FFFFFF] shadow-sm"
                    : "text-[#835C3A] hover:text-[#141413] hover:bg-white/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Serigrafía B2B</span>
              </button>
              <Link
                href="/links"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-97 ${
                  pathname === "/links"
                    ? "bg-[#141413] text-[#FAF8F5] shadow-sm"
                    : "text-[#57534E] hover:text-[#141413] hover:bg-white/60"
                }`}
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span>Redes & Links</span>
              </Link>
            </nav>

            {/* Acciones: Auth / Mi Cuenta & Carrito */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón de Autenticación / Usuario */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl liquid-glass hover:border-[#9E734E] transition-all cursor-pointer"
                    aria-expanded={isUserMenuOpen}
                    aria-label="Menú de usuario"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#9E734E] text-white flex items-center justify-center font-bold text-xs">
                      {user.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-bold text-[#141413] leading-none truncate max-w-[110px]">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] text-[#B45309] font-mono font-bold leading-tight mt-0.5 flex items-center gap-1">
                        {user.clientType === "mayorista" ? (
                          <>
                            <ShieldCheck className="w-2.5 h-2.5 text-[#B45309]" />
                            <span>Mayorista B2B</span>
                          </>
                        ) : (
                          "Emprendedor"
                        )}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C827A]" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 liquid-glass-strong rounded-2xl p-2 z-50 animate-fade-in-up">
                      <div className="p-3 border-b border-[#E6E2DC] frosted-well rounded-xl mb-1.5 space-y-1">
                        <span className="text-xs font-bold text-[#141413] block">
                          {user.fullName}
                        </span>
                        <span className="text-[11px] text-[#66615B] block truncate">
                          {user.email}
                        </span>
                        {user.businessName && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#9E734E] pt-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{user.businessName}</span>
                          </div>
                        )}
                        {user.cuit && (
                          <span className="text-[10px] font-mono text-[#8C827A] block">
                            CUIT: {user.cuit}
                          </span>
                        )}
                      </div>

                      {user.role === "admin" && (
                        <Link
                          href="/admin/precios"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-[#9E734E] hover:bg-amber-50/80 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-[#9E734E]" />
                          <span>Panel ERP Precios (Admin)</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#141413] hover:bg-white/80 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#9E734E]" />
                        <span>Cambiar / Editar cuenta</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 px-3 sm:px-3.5 py-2.5 rounded-xl liquid-glass text-[#141413] hover:border-[#9E734E] transition-all cursor-pointer"
                  aria-label="Iniciar sesión o registrarse"
                >
                  <UserIcon className="w-4 h-4 text-[#9E734E]" />
                  <span className="hidden sm:inline text-xs font-bold">Ingresar</span>
                </button>
              )}

              {/* Botón Carrito / Cotizador con Total Final c/IVA */}
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl liquid-glass-dark text-[#FAF8F5] hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                aria-label="Abrir carrito de compras"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#FAF8F5]" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#B45309] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {itemsCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[9px] text-[#D4CEBF] uppercase font-bold leading-none">
                    Pedido (c/IVA)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FAF8F5] leading-tight">
                    ${totalWithIva.toLocaleString("es-AR")}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Barra de Navegación Adaptable para Smartphones y Tablets (< md) */}
          <div className="flex md:hidden items-center gap-1.5 pb-2.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleNavigate("INICIO")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                pathname === "/" && activeUnit === "INICIO"
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "frosted-well text-[#57534E]"
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Bienvenida</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("ENVASES")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                pathname === "/" && activeUnit === "ENVASES"
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "frosted-well text-[#57534E]"
              }`}
            >
              📦 Envases
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("HOME")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                pathname === "/" && activeUnit === "HOME"
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "frosted-well text-[#57534E]"
              }`}
            >
              🏡 Home & Velas
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("B2B")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                pathname === "/" && activeUnit === "B2B"
                  ? "bg-[#9E734E] text-white"
                  : "frosted-well text-[#835C3A]"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Serigrafía B2B</span>
            </button>
            <Link
              href="/links"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                pathname === "/links"
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "frosted-well text-[#57534E]"
              }`}
            >
              <Share2 className="w-3 h-3" />
              <span>Redes & Links</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Modal de Autenticación */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
