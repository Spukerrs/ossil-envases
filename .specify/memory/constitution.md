# OSSIL Envases & OSSIL Home — Constitution de Ingeniería Frontend

## Core Principles

### I. Anti-Slop Visual & Dirección Estética "Industrial Apothecary"

- **Prohibición Absoluta de IA-Slop:** Cero gradientes genéricos púrpura/cyan, cero tarjetas con resplandor neón violeta, cero layouts cliché de landing SaaS.
- **Paleta Cromática Semántica:** Fondo cálido tipo boticario `#FAF8F5`, Tarjetas `#FFFFFF` con borde $1\text{px}$ `#E6E2DC`, Texto `#141413`, Bronce OSSIL `#9E734E`, Ámbar descuento `#B45309`.
- **Tipografía Dual Intencional:** `Plus Jakarta Sans` para display, títulos y navegación editorial; `JetBrains Mono` para códigos de rosca (`18/415`, `24/410`), unidades (`cc`, `ml`, `gr`) y precios tabulares.

### II. Rigor de Accesibilidad WCAG 2.2 AA (Universal)

- Ratio mínimo de contraste de 4.5:1 para texto normal y 3:1 para componentes interactivos esenciales.
- Foco visible accesible en todos los botones y campos (`focus-visible:ring-2 focus-visible:ring-[#9E734E]`).
- Iconos interactivos con `aria-label` o textos `<span className="sr-only">`. Respeto irrestricto de `motion-safe:` / `motion-reduce:`.

### III. Lógica Mayorista de Catálogo Mixto (B2B / B2C)

- Soporte dual balanceado: **OSSIL ENVASES** (796 productos de perfumería, cosmética, medicinal) y **OSSIL HOME** (520 productos de bazar, ceras de soja, pabilos y difusores).
- **Compatibilidad de Roscas 100% Verificable:** Match milimétrico de bocas entre botellas y tapas/válvulas spray.
- **Escalado Mayorista Dinámico:** Cálculo instantáneo de escalas automáticas (-11%, -17%, -22%, -28% OFF) con respeto de productos bajo cotización manual (`requiresManualQuote: true`).

### IV. Visualización Óptica PBR 3D sin Sobrecarga

- Demostrador 3D en Three.js con materiales físicamente basados (PBR): Vidrio Cristal (IOR 1.52), Satinado Esmerilado, Ámbar UV y PEAD, con soporte para intercambio interactivo de válvulas y tapas.

### V. Golden Loop de Verificación Continua

- Todo cambio de código debe someterse al pipeline del Golden Loop:
  1. Biome Check & Format (<15ms)
  2. Gitleaks Secret & Token Detection
  3. Graphify Architecture Synchronization
  4. Delta Visual Git Diff Audit

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
