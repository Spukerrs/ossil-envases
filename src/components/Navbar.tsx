"use client";

import { ShoppingBag, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import type { BusinessUnit } from "@/types/catalog";

interface NavbarProps {
  activeUnit: BusinessUnit | "B2B";
  onSelectUnit: (unit: BusinessUnit | "B2B") => void;
  onOpenCart: () => void;
}

export function Navbar({ activeUnit, onSelectUnit, onOpenCart }: NavbarProps) {
  const itemsCount = useCartStore((s) => s.getTotalItemsCount());
  const totalAmount = useCartStore((s) => s.getTotalAmount());

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E2DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Identidad de Marca */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group select-none">
              <div className="relative w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E6E2DC] p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#9E734E] transition-colors">
                <Image
                  src="/images/brand/logo-ossil.webp"
                  alt="OSSIL Envases & Home"
                  width={34}
                  height={34}
                  className="object-contain"
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
            </Link>

            {/* Badge de Reseñas de Google Maps */}
            <a
              href="https://maps.app.goo.gl/6mLg33JqzYa4pJsP8"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E2DC] text-xs font-medium text-[#141413] hover:border-[#9E734E] transition-colors shadow-2xs hover:shadow-xs"
              title="Ver 7.466 reseñas reales en Google Maps"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-bold">4.9</span>
              <span className="text-[#66615B] text-[11px]">(7.466 opiniones en Maps)</span>
            </a>
          </div>

          {/* Selector de Unidades de Negocio */}
          <nav
            aria-label="Unidades de Negocio OSSIL"
            className="flex items-center p-1 bg-[#EBE7DF] rounded-2xl border border-[#DCD6C9]"
          >
            <button
              type="button"
              onClick={() => onSelectUnit("ENVASES")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeUnit === "ENVASES"
                  ? "bg-[#FFFFFF] text-[#141413] shadow-xs"
                  : "text-[#66615B] hover:text-[#141413]"
              }`}
            >
              📦 <span className="hidden sm:inline">OSSIL </span>ENVASES
            </button>
            <button
              type="button"
              onClick={() => onSelectUnit("HOME")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeUnit === "HOME"
                  ? "bg-[#FFFFFF] text-[#141413] shadow-xs"
                  : "text-[#66615B] hover:text-[#141413]"
              }`}
            >
              🏡 <span className="hidden sm:inline">OSSIL </span>HOME
            </button>
            <button
              type="button"
              onClick={() => onSelectUnit("B2B")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeUnit === "B2B"
                  ? "bg-[#9E734E] text-[#FFFFFF] shadow-xs"
                  : "text-[#835C3A] hover:text-[#141413]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Serigrafía B2B</span>
            </button>
          </nav>

          {/* Botón Carrito / Cotizador */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#141413] text-[#FAF8F5] hover:bg-[#2C2B29] transition-all shadow-sm active:scale-95 cursor-pointer"
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
                <span className="text-[10px] text-[#A69F93] uppercase font-bold leading-none">
                  Mi Pedido
                </span>
                <span className="font-mono text-xs font-bold text-[#FAF8F5] leading-tight">
                  ${totalAmount.toLocaleString("es-AR")}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
