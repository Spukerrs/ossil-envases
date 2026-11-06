"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Star, MapPin, Sparkles } from "lucide-react";
import { BusinessUnit } from "@/types/catalog";

interface NavbarProps {
  activeUnit: BusinessUnit | "B2B";
  onSelectUnit: (unit: BusinessUnit | "B2B") => void;
  onOpenCart: () => void;
}

export function Navbar({ activeUnit, onSelectUnit, onOpenCart }: NavbarProps) {
  const itemsCount = useCartStore((s) => s.getTotalItemsCount());
  const totalAmount = useCartStore((s) => s.getTotalAmount());

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Marca */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-black tracking-tight text-[#141413]">
                OSSIL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E734E]">
                Envases & Home • Córdoba
              </span>
            </div>

            {/* Badge de Reseñas de Google Maps */}
            <a
              href="https://maps.app.goo.gl/6mLg33JqzYa4pJsP8"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E2DC] text-xs font-medium text-[#141413] hover:border-[#9E734E] transition-colors shadow-2xs"
              title="Ver reseñas reales en Google Maps"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-bold">4.9</span>
              <span className="text-[#66615B] text-[11px]">(7.466 reseñas)</span>
            </a>
          </div>

          {/* Selector de Unidades de Negocio */}
          <nav className="flex items-center p-1 bg-[#EBE7DF] rounded-xl border border-[#DCD6C9]">
            <button
              onClick={() => onSelectUnit("ENVASES")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeUnit === "ENVASES"
                  ? "bg-[#FFFFFF] text-[#141413] shadow-xs"
                  : "text-[#66615B] hover:text-[#141413]"
              }`}
            >
              📦 OSSIL ENVASES
            </button>
            <button
              onClick={() => onSelectUnit("HOME")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeUnit === "HOME"
                  ? "bg-[#FFFFFF] text-[#141413] shadow-xs"
                  : "text-[#66615B] hover:text-[#141413]"
              }`}
            >
              🏡 OSSIL HOME
            </button>
            <button
              onClick={() => onSelectUnit("B2B")}
              className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeUnit === "B2B"
                  ? "bg-[#9E734E] text-[#FFFFFF] shadow-xs"
                  : "text-[#835C3A] hover:text-[#141413]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Serigrafía B2B
            </button>
          </nav>

          {/* Botón Carrito / Cotizador */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141413] text-[#FAF8F5] hover:bg-[#2C2B29] transition-all shadow-sm active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#FAF8F5]" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B45309] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
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
