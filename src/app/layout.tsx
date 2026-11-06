import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OSSIL Envases & OSSIL Home | Distribuidora Mayorista y Minorista Córdoba",
  description:
    "Catálogo oficial de envases para cosmética, perfumería, medicina, alimentos y bazar. Precios mayoristas por escala en Oncativo 69, Córdoba Capital.",
  keywords: [
    "envases cordoba",
    "frascos de vidrio por mayor",
    "botellas pet cordoba",
    "valvulas spray perfumeria",
    "insumos para velas",
    "ossil envases",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
        {/* Banner Superior Sobrio */}
        <div className="bg-[#141413] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2C2B29]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="font-medium text-[#FAF8F5]/90">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <strong>Atención en Córdoba Capital:</strong> Oncativo 69, Local 1 • Lun a Vie 08:00 a 17:15 | Sáb 09:00 a 13:30 hs
            </p>
            <div className="flex items-center gap-4 text-[#D4CEBF] text-[11px]">
              <span>Efectivo / Transferencia: <strong>0% Recargo</strong></span>
              <span>•</span>
              <span>Envíos a todo el país</span>
            </div>
          </div>
        </div>

        {children}

        <Toaster position="bottom-right" richColors theme="light" />
      </body>
    </html>
  );
}
