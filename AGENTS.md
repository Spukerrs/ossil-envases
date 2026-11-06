# AGENTS.md — Reglas del Proyecto OSSIL Envases & OSSIL Home

## 1. Identidad y Contexto del Proyecto
* **Proyecto:** Plataforma de Comercio Electrónico Mayorista y Minorista (B2B/B2C) para **OSSIL Envases & OSSIL Home** (Oncativo 69, Local 1 — Córdoba Capital, Argentina).
* **Catálogo:** Mixto con **1.316 productos** estructurados en dos unidades de negocio:
  1. **OSSIL ENVASES (796 productos):** Perfumería, Cosmética, Medicinal, Alimentos, Bidones y Accesorios (tapas, válvulas spray y bombas).
  2. **OSSIL HOME (520 productos):** Bazar, Cocina (termos, mates, dispensers) e Insumos para Velas y Difusores (124 productos: ceras de soja, esencias, moldes).
  3. **Servicios B2B:** Satinado, Vitrificado, Tampografía y Serigrafía industrial sobre vidrio y plástico.

## 2. Stack Tecnológico Estricto (Prohibido Improvisar Otras Librerías)
* **Frontend & Core:** Next.js 16 (App Router, Server Components por defecto, React 19).
* **Tipado:** TypeScript 5.9+ estricto con validación de esquemas vía Zod.
* **Estilos:** Tailwind CSS v4 + variables semánticas nativas + shadcn/ui + Lucide Icons + Motion (`framer-motion-animator`).
* **Estado & Filtros:** Sincronización en URL (`searchParams` / `nuqs`) + Zustand (carrito persistente con escalas mayoristas).
* **Visualización 3D:** Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`) exclusivo para el **demostrador general de acabados de materiales PBR** (Vidrio Cristal, Satinado/Esmerilado, Ámbar UV y PEAD).
* **Base de Datos & ORM:** PostgreSQL en Supabase + Prisma ORM.
* **Infraestructura:** Vercel (Edge Network) + Supabase Cloud.

## 3. Reglas de Negocio Críticas
1. **Compatibilidad de Roscas:** Cada envase debe filtrar y asociar automáticamente solo las tapas y válvulas que coincidan con su código milimétrico de boca (`18/415`, `20/410`, `24/410`, `28/400`, `B/E 15`).
2. **Escalas Mayoristas vs. Cotización Manual:**
   - La mayoría calcula descuento en automático (+10u, +25u, +50u, +100u con hasta -28% OFF).
   - Artículos con bandera `requiresManualQuote: true` no fuerzan descuento automático y se rotulan como *"Sujeto a cotización de asesor"*.
3. **Ingesta Masiva de Precios:** Módulo para procesar y actualizar precios masivamente desde planillas Excel / CSV exportadas del ERP local de Oncativo.
4. **Retiro Express:** Selección de retiro en local Oncativo 69 (Córdoba) con mapa y horarios sin el error `LOCATION_DATA`.

## 4. Sistema de Diseño: *Industrial Apothecary* (Anti-Slop Visual Estricto)
* **Prohibición de IA-Slop:** Cero gradientes violeta-azul neón, tarjetas con bordes luminosos morados o layouts genéricos.
* **Paleta:** Fondo técnico `#FAF8F5`, Tarjetas `#FFFFFF` con borde $1\text{px}$ `#E6E2DC`, Texto `#141413`, Bronce OSSIL `#9E734E`, Ámbar descuento `#B45309`.
* **Tipografía Dual:** `Plus Jakarta Sans` para display/editorial y `JetBrains Mono` para códigos de rosca (`18/415`, `24/410`), medidas (`cc`/`ml`/`gr`) y precios tabulares.
* **Accesibilidad:** WCAG 2.2 AA mínimo ($> 4.5:1$ en texto, foco visible siempre, soporte `motion-safe`).

## 5. Ámbito de Skills: Activadas vs. Prohibidas en este Workspace
* **Skills ACTIVAS y Prioritarias:**
  - Diseño & UI: `ui-ux-pro-max`, `frontend-design`, `design-taste-frontend`, `impeccable`, `emil-design-eng`, `apple-design`, `tailwind-4-docs`, `shadcn`.
  - 3D: `threejs-materials`, `threejs-react-three-fiber`, `threejs-lighting`.
  - Estado & Next.js: `react-state-management`, `nextjs-app-router-patterns`, `next-cache-components-adoption`, `next-dev-loop`.
  - Backend & SQL: `prisma-orm-setup`, `prisma-client-api`, `supabase-postgres-best-practices`, `mastering-typescript`.
  - SEO & Testing: `seo-local-seo`, `seo-schema-structured-data`, `page-cro`, `web-quality-audit`, `playwright-best-practices`.
* **Skills DESHABILITADAS (Prohibido invocar o saturar contexto):**
  - Todas las skills de **Ciencia / Bioinformática** (`alphafold`, `chembl`, `rdkit`, `pymol`, `pdb`, `biomolecular-structure-viewer`, etc.).
  - Todas las skills de **Flutter / Dart / Android / Swift / React Native** (`flutter-*`, `dart-*`, `android-*`, `compose-*`, `write-swift`).
  - Todas las skills de **Firebase** (`firebase-*`, `extension-to-functions-*`).
  - Todas las skills de **BigQuery / Airflow / Cloud Composer / Spark** (`bigquery-*`, `gcp-*`, `dbt-*`, `dataform-*`).
