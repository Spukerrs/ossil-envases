import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/catalog";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    clientType: "minorista" | "mayorista";
    cuit?: string;
    phone?: string;
    businessName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: (type: "minorista" | "mayorista") => void;
  clearError: () => void;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return (
    url.length > 0 &&
    !url.includes("your-project") &&
    key.length > 0 &&
    !key.includes("placeholder")
  );
};

// Lista autorizada de correos de administración interna y gerencia de OSSIL Envases
export const ADMIN_EMAILS = [
  "admin@ossilenvases.com.ar",
  "gerencia@ossilenvases.com.ar",
  "direccion@ossil.com.ar",
  "oscar@ossilenvases.com.ar",
  "silvia@ossilenvases.com.ar",
  "cuello.shair@gmail.com",
  "spukerrs@gmail.com",
];

export function isUserAdmin(email?: string, appRole?: string): boolean {
  if (!email) return false;
  if (appRole === "admin") return true;
  const clean = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(clean) ||
    clean.startsWith("admin@") ||
    clean.includes("gerencia@") ||
    clean.includes("direccion@")
  );
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          if (isSupabaseConfigured()) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              set({ error: error.message, isLoading: false });
              return { success: false, error: error.message };
            }

            if (data.user) {
              const isAdmin = isUserAdmin(
                data.user.email || email,
                data.user.app_metadata?.role || data.user.user_metadata?.role,
              );
              const profile: UserProfile = {
                id: data.user.id,
                email: data.user.email || email,
                fullName: data.user.user_metadata?.full_name || email.split("@")[0],
                clientType: data.user.user_metadata?.client_type || "minorista",
                cuit: data.user.user_metadata?.cuit,
                businessName: data.user.user_metadata?.business_name,
                phone: data.user.user_metadata?.phone,
                role: isAdmin ? "admin" : "customer",
              };
              set({ user: profile, isLoading: false });
              return { success: true };
            }
          }

          // Fallback / Modo Local
          const existingUser = get().user;
          const isAdmin = isUserAdmin(email);
          const profile: UserProfile = {
            id: existingUser?.id || `user_${Date.now()}`,
            email,
            fullName: email.split("@")[0].replace(".", " "),
            clientType:
              email.toLowerCase().includes("b2b") || email.toLowerCase().includes("mayorista")
                ? "mayorista"
                : "minorista",
            businessName: email.toLowerCase().includes("b2b")
              ? "Distribuidora & Laboratorio"
              : undefined,
            role: isAdmin ? "admin" : "customer",
          };
          set({ user: profile, isLoading: false });
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          if (isSupabaseConfigured()) {
            const { data: authData, error } = await supabase.auth.signUp({
              email: data.email,
              password: data.password,
              options: {
                data: {
                  full_name: data.fullName,
                  client_type: data.clientType,
                  cuit: data.cuit,
                  business_name: data.businessName,
                  phone: data.phone,
                },
              },
            });

            if (error) {
              set({ error: error.message, isLoading: false });
              return { success: false, error: error.message };
            }

            if (authData.user) {
              const profile: UserProfile = {
                id: authData.user.id,
                email: data.email,
                fullName: data.fullName,
                clientType: data.clientType,
                cuit: data.cuit,
                businessName: data.businessName,
                phone: data.phone,
                role: "customer",
              };
              set({ user: profile, isLoading: false });
              return { success: true };
            }
          }

          // Fallback / Modo Local: Los registros desde la web son SIEMPRE de clientes
          const profile: UserProfile = {
            id: `usr_${Date.now()}`,
            email: data.email,
            fullName: data.fullName,
            clientType: data.clientType,
            cuit: data.cuit,
            businessName: data.businessName,
            phone: data.phone,
            role: "customer",
          };
          set({ user: profile, isLoading: false });
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Error al registrar cuenta";
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        if (isSupabaseConfigured()) {
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore
          }
        }
        set({ user: null, isLoading: false, error: null });
      },

      loginDemo: (type: "minorista" | "mayorista") => {
        if (type === "mayorista") {
          set({
            user: {
              id: "demo_mayorista_01",
              email: "compras@laboratoriocordoba.com.ar",
              fullName: "Laboratorio Cosmético del Centro",
              businessName: "Laboratorios del Centro S.R.L.",
              cuit: "30-71458923-8",
              clientType: "mayorista",
              phone: "+54 351 811-1868",
              city: "Córdoba Capital",
            },
            error: null,
          });
        } else {
          set({
            user: {
              id: "demo_minorista_01",
              email: "clara.velas@gmail.com",
              fullName: "Clara Aromas & Deco",
              businessName: "Emprendimiento Velas de Soja",
              clientType: "minorista",
              phone: "+54 351 811-1868",
              city: "Córdoba Capital",
            },
            error: null,
          });
        }
      },
    }),
    {
      name: "ossil-auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
