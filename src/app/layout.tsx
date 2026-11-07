import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { STORE_CONFIG } from "@/lib/constants";
import "./globals.css";
import { Toaster } from "sonner";
import { GlassIntroSplash } from "@/components/GlassIntroSplash";

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
    "Catálogo oficial de envases para cosmética, perfumería, medicina, alimentos y bazar. Precios mayoristas por escala en Oncativo 69, Córdoba Capital. 4.9 estrellas en Google Maps con 7.466 opiniones.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  keywords: [
    "envases cordoba",
    "frascos de vidrio por mayor",
    "botellas pet cordoba",
    "valvulas spray perfumeria",
    "insumos para velas cordoba",
    "ossil envases",
    "oncativo 69 cordoba",
  ],
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: STORE_CONFIG.name,
  image: "https://ossilenvases.com.ar/mods/html/fil/Model/Configuration/1414/logo-1.png.webp",
  "@id": "https://ossilenvases.com.ar",
  url: "https://ossilenvases.com.ar",
  telephone: STORE_CONFIG.contact.phoneDisplay,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Oncativo 69, Local 1",
    addressLocality: "Córdoba",
    addressRegion: "Córdoba",
    postalCode: "X5000",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -31.4135,
    longitude: -64.1775,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:15",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "7466",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data for Google SEO
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-[#9E734E]/20 selection:text-[#835C3A]">
        <GlassIntroSplash />
        {/* Banner Superior Sobrio */}
        <div className="bg-[#141413] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2C2B29]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="font-medium text-[#FAF8F5]/90">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <strong>Atención en Córdoba Capital:</strong> Oncativo 69, Local 1 • Lun a Vie 08:00 a
              17:15 | Sáb 09:00 a 13:30 hs
            </p>
            <div className="flex items-center gap-3 text-[#D4CEBF] text-[11px] flex-wrap justify-center sm:justify-end">
              <span>
                Efectivo / Transferencia: <strong>0% Recargo</strong>
              </span>
              <span>•</span>
              <Link
                href="/links"
                className="text-[#FAF8F5] hover:text-[#9E734E] font-bold underline"
              >
                Hub Redes / Links
              </Link>
              <span>•</span>
              <Link
                href="/admin/precios"
                className="text-[#9E734E] hover:text-white font-bold underline"
              >
                Demo ERP Precios
              </Link>
            </div>
          </div>
        </div>

        {children}

        <Toaster position="bottom-right" richColors theme="light" />
      </body>
    </html>
  );
}
