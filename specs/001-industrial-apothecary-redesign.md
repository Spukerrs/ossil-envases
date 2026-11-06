# Feature Specification: Rediseño Editorial & Sistema Frontend "Industrial Apothecary"

**Feature**: `001-industrial-apothecary-redesign`
**Created**: 2026-11-06
**Status**: Ready for Implementation
**Author**: Antigravity Frontend Architect & Shair

---

## 1. Visión y Objetivos de Diseño

Reconstruir la experiencia de usuario y arquitectura visual de la página principal (`src/app/page.tsx`), sus componentes de catálogo, navegación, selector de acabados 3D y carrito, elevándolos a un estándar de diseño internacional (**Industrial Apothecary**):

- Fusión entre boticario de alta gama (Aesop/Le Labo) y distribuidora técnica mayorista de precisión.
- Cero IA-slop: tipografía editorial con jerarquía clara (`Plus Jakarta Sans` + `JetBrains Mono`), paleta sobria `#FAF8F5`, `#141413`, `#9E734E`, `#B45309`.
- Componentes altamente táctiles, con micro-interacciones pulidas, estados hover cuidados, feedbacks de escala y diseño 100% responsivo mobile-first.

---

## 2. Historias de Usuario Priorizadas

### User Story 1: Navegación Dual Fluida y Header Industrial (Prioridad: P1)

**Descripción:** El usuario puede alternar instantáneamente entre las dos divisiones comerciales (**OSSIL ENVASES** y **OSSIL HOME**) y la sección de **Servicios B2B de Serigrafía**, con persistencia en filtros y badges de prueba social verificada (**4.9★ con 7.466 reseñas**).

- **Prueba Independiente:** Clic en los selectores de unidad actualiza el catálogo, los filtros de material y los chips de rosca sin recargar la página.

### User Story 2: Filtrado Facetado y Armado de Combos con Roscas Compatibles (Prioridad: P1)

**Descripción:** El comprador busca por texto o filtra por rosca milimétrica (`18/415`, `20/410`, `24/410`, etc.). Cada envase ofrece un botón de acción rápida para abrir el modal de combo, mostrando exclusivamente tapas y válvulas que coinciden milimétricamente con su boca.

- **Prueba Independiente:** Al seleccionar una botella boca 18/415, el modal de combo muestra únicamente accesorios 18/415 y permite agregarlos emparejados al carrito.

### User Story 3: Visualizador 3D PBR con Selector de Acabados y Accesorios (Prioridad: P2)

**Descripción:** En la vista de envases y servicios B2B, el usuario cuenta con un inspector 3D fotorealista para comparar cómo refracta y refleja el Vidrio Cristal, Satinado Esmerilado, Ámbar UV y PEAD, permitiendo además montar válvulas spray doradas/plateadas o goteros negros.

- **Prueba Independiente:** Rotar el frasco 360°, cambiar de material y cambiar a válvula spray actualiza el shader PBR de Three.js fluidamente a 60 FPS.

### User Story 4: Carrito Mayorista con Validación de Emparejamiento y Retiro Express (Prioridad: P1)

**Descripción:** El drawer de compra audita si el cliente lleva botellas sin tapas compatibles, sugiere cantidades para alcanzar la siguiente escala de descuento (-17%, -22%, -28% OFF), y si elige Retiro en Local Oncativo 69, emite el Pase Express para mostrador.

- **Prueba Independiente:** Agregar 50 frascos y 25 tapas despliega la alerta preventiva y el botón de WhatsApp genera la orden estructurada completa.

---

## 3. Requerimientos no Funcionales

- **Accesibilidad:** WCAG 2.2 AA (contraste $> 4.5:1$, foco visible, etiquetas aria descriptivas, motion-safe).
- **Rendimiento:** Cero CLS, renderizado inicial veloz con Server/Client boundaries limpios.
- **Golden Loop Compliance:** Aprobación sin fallos en Biome, Gitleaks, Graphify y Delta.
