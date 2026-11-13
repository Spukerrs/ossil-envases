"use client";

import { Building2, FileSpreadsheet, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Banda de estado comercial que evidencia en tiempo real la diferencia entre
 * Tarifa Mayorista B2B, Lista Minorista/Emprendedor y Perfil Administrador.
 */
export function AccountModeBanner() {
  const { user, loginDemo } = useAuthStore();

  const isAdmin = user?.role === "admin";
  const isWholesale = user?.clientType === "mayorista";

  const handleQuickSwitch = (mode: "mayorista" | "minorista") => {
    loginDemo(mode);
    toast.success(
      mode === "mayorista"
        ? "Modo Mayorista B2B activado"
        : "Modo Minorista / Emprendedor activado",
      {
        description:
          mode === "mayorista"
            ? "Los productos priorizan precio neto s/IVA por volumen (pack sugerido 25u.) y Factura A."
            : "Los productos muestran precio final c/IVA por unidad (desde 1u.) y Consumidor Final / B.",
      },
    );
  };

  if (isWholesale) {
    return (
      <div className="mb-6 rounded-2xl bg-[#141413] text-[#FAF8F5] border border-[#2C2B29] p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9E734E]/20 border border-[#9E734E]/40 text-[#E5B88B] flex items-center justify-center shrink-0">
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#9E734E] text-white">
                  {isAdmin ? "Admin ERP + Tarifa Mayorista B2B" : "Tarifa Mayorista B2B Activa"}
                </span>
                {user?.businessName && (
                  <span className="text-xs font-bold text-[#FAF8F5]">{user.businessName}</span>
                )}
                {user?.cuit && (
                  <span className="font-mono text-[11px] text-[#D4CEBF]">CUIT {user.cuit}</span>
                )}
              </div>
              <p className="text-xs text-[#D4CEBF] leading-relaxed">
                Precios mostrados en <strong className="text-white">Neto s/IVA</strong> con{" "}
                <strong className="text-[#E5B88B]">pack B2B de 25 u. (-17% base)</strong>{" "}
                preseleccionado, comparación contra precio minorista tachado y{" "}
                <strong className="text-white">Factura A</strong> automática en tu orden.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {isAdmin && (
              <Link
                href="/admin/precios"
                className="px-3 py-1.5 rounded-xl bg-[#9E734E] hover:bg-[#835C3A] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Abrir Panel ERP</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => handleQuickSwitch("minorista")}
              className="px-3 py-1.5 rounded-xl bg-[#242321] hover:bg-[#33312E] border border-[#3A3835] text-[#FAF8F5] text-xs font-bold transition-colors cursor-pointer"
            >
              Cambiar a vista Minorista (1u.)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-[#FFFFFF] border border-[#E6E2DC] p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E2DC] text-[#9E734E] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EBE7DF] text-[#141413] border border-[#DCD6C9]">
                {user ? "Cuenta Minorista / Emprendedor" : "Modo Minorista / Público General"}
              </span>
              {user && <span className="text-xs font-bold text-[#141413]">{user.fullName}</span>}
            </div>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Precios mostrados con <strong className="text-[#141413]">IVA Final incluido</strong>{" "}
              para compra libre desde <strong className="text-[#141413]">1 unidad</strong>{" "}
              (Consumidor Final / Factura B). También podés sumar +10u o más para desbloquear
              descuentos por escala.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleQuickSwitch("mayorista")}
          className="px-3.5 py-2 rounded-xl bg-[#141413] hover:bg-[#2C2B29] text-[#FAF8F5] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start lg:self-auto"
        >
          <Building2 className="w-3.5 h-3.5 text-[#E5B88B]" />
          <span>Activar Tarifa Mayorista B2B</span>
        </button>
      </div>
    </div>
  );
}
