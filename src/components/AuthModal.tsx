"use client";

import {
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [clientType, setClientType] = useState<"minorista" | "mayorista">("minorista");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regCuit, setRegCuit] = useState("");

  const { login, register, loginDemo, isLoading, error, clearError } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      setSuccessMsg("¡Sesión iniciada con éxito!");
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 700);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const res = await register({
      email: regEmail,
      password: regPassword,
      fullName: regFullName,
      clientType,
      phone: regPhone || undefined,
      businessName: clientType === "mayorista" ? regBusinessName : undefined,
      cuit: clientType === "mayorista" ? regCuit : undefined,
    });
    if (res.success) {
      setSuccessMsg("¡Cuenta creada con éxito! Bienvenido a OSSIL.");
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E6E2DC] shadow-2xl overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Cabecera Apothecary */}
        <div className="p-6 pb-4 border-b border-[#E6E2DC] bg-[#FAF8F5]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#141413] text-[#FAF8F5] flex items-center justify-center font-mono font-bold text-sm">
              OS
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="text-base font-black text-[#141413] tracking-tight"
              >
                {tab === "login" ? "Acceso de Clientes OSSIL" : "Crear Cuenta de Cliente"}
              </h2>
              <p className="text-[11px] text-[#66615B]">
                Precios mayoristas, seguimiento y cotizaciones express
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C827A] hover:text-[#141413] hover:bg-[#EBE7DF] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestaña */}
        <div className="flex border-b border-[#E6E2DC] bg-[#FAF8F5]/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              clearError();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "login"
                ? "bg-[#FFFFFF] text-[#141413] shadow-xs border border-[#E6E2DC]"
                : "text-[#66615B] hover:text-[#141413]"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              clearError();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "register"
                ? "bg-[#FFFFFF] text-[#141413] shadow-xs border border-[#E6E2DC]"
                : "text-[#66615B] hover:text-[#141413]"
            }`}
          >
            Crear Cuenta Nueva
          </button>
        </div>

        {/* Mensajes de Alerta / Éxito */}
        <div className="px-6 pt-4">
          {error && (
            <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Formulario según Pestaña */}
        <div className="p-6 pt-1 max-h-[70vh] overflow-y-auto">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9E734E]" />
                  Correo Electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@laboratorio.com.ar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#9E734E]" />
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#141413] text-[#FAF8F5] text-xs font-bold hover:bg-[#2C2B29] transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Ingresando..." : "Ingresar a mi cuenta"}
              </button>

              {/* Acceso Rápido Demo Local */}
              <div className="pt-3 border-t border-[#E6E2DC] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block text-center">
                  Acceso Rápido de Prueba (Localhost / Demo)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginDemo("mayorista");
                      setSuccessMsg("Sesión Demo Mayorista iniciada.");
                      setTimeout(() => {
                        setSuccessMsg(null);
                        onClose();
                      }, 600);
                    }}
                    className="p-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] hover:bg-[#EBE7DF] hover:border-[#9E734E] text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#141413] group-hover:text-[#9E734E]">
                      <Building2 className="w-3.5 h-3.5 text-[#9E734E]" />
                      <span>Mayorista B2B</span>
                    </div>
                    <span className="text-[10px] text-[#8C827A] block truncate">
                      Laboratorio Central
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginDemo("minorista");
                      setSuccessMsg("Sesión Demo Minorista iniciada.");
                      setTimeout(() => {
                        setSuccessMsg(null);
                        onClose();
                      }, 600);
                    }}
                    className="p-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] hover:bg-[#EBE7DF] hover:border-[#9E734E] text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#141413] group-hover:text-[#9E734E]">
                      <User className="w-3.5 h-3.5 text-[#9E734E]" />
                      <span>Emprendedor</span>
                    </div>
                    <span className="text-[10px] text-[#8C827A] block truncate">Clara Aromas</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Tipo de Cliente */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#141413] block">Tipo de Cuenta:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClientType("minorista")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      clientType === "minorista"
                        ? "bg-[#FAF8F5] border-[#9E734E] ring-1 ring-[#9E734E]"
                        : "bg-[#FFFFFF] border-[#E6E2DC] hover:border-[#DCD6C9]"
                    }`}
                  >
                    <span className="font-bold text-xs text-[#141413] block">
                      Emprendedor / Minorista
                    </span>
                    <span className="text-[10px] text-[#66615B]">
                      Compras desde 1 unidad y por bulto chico
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClientType("mayorista")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      clientType === "mayorista"
                        ? "bg-[#FAF8F5] border-[#9E734E] ring-1 ring-[#9E734E]"
                        : "bg-[#FFFFFF] border-[#E6E2DC] hover:border-[#DCD6C9]"
                    }`}
                  >
                    <span className="font-bold text-xs text-[#141413] block flex items-center gap-1">
                      <span>Empresa / Mayorista</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                    </span>
                    <span className="text-[10px] text-[#66615B]">
                      Factura A, CUIT y escalas hasta -28%
                    </span>
                  </button>
                </div>
              </div>

              {/* Nombre completo */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-fullname"
                  className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#9E734E]" />
                  Nombre y Apellido del Responsable
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ej: Laura Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              {/* Campos extras para Mayoristas */}
              {clientType === "mayorista" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#EBE7DF]/50 border border-[#DCD6C9]">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reg-businessname"
                      className="text-xs font-bold text-[#141413] flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#9E734E]" />
                      Razón Social
                    </label>
                    <input
                      id="reg-businessname"
                      type="text"
                      required
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="Empresa S.A. o Fantasía"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-cuit" className="text-xs font-bold text-[#141413]">
                      CUIT / CUIL
                    </label>
                    <input
                      id="reg-cuit"
                      type="text"
                      required
                      value={regCuit}
                      onChange={(e) => setRegCuit(e.target.value)}
                      placeholder="30-12345678-9"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] text-xs font-mono font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E]"
                    />
                  </div>
                </div>
              )}

              {/* Email & Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-email"
                    className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#9E734E]" />
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contacto@tudominio.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-phone"
                    className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9E734E]" />
                    WhatsApp / Teléfono
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+54 351 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-password"
                  className="text-xs font-bold text-[#141413] flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#9E734E]" />
                  Contraseña (mínimo 6 caracteres)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FAF8F5] text-xs font-medium text-[#141413] focus:outline-hidden focus:ring-2 focus:ring-[#9E734E] focus:bg-[#FFFFFF]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#9E734E] text-[#FFFFFF] text-xs font-bold hover:bg-[#835C3A] transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta de Cliente"}
              </button>
            </form>
          )}
        </div>

        {/* Footer con info de seguridad */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E2DC] flex items-center justify-between text-[11px] text-[#8C827A]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#9E734E]" />
            Acceso seguro con Supabase Auth
          </span>
          <span>OSSIL Envases • Oncativo 69</span>
        </div>
      </div>
    </div>
  );
}
