---
title: "Guion Video Documentador: Rediseño E-Commerce OSSIL Envases con IA Agéntica"
author: "Shair Fernando Cuello López"
alias: ["Guion Video OSSIL", "Video Documentador OSSIL", "Case Study OSSIL"]
created: 2026-11-06
updated: 2026-11-06
status: "Listo para Grabar"
tags:
  - "#guion"
  - "#audiovisual"
  - "#youtube"
  - "#reels"
  - "#davinci-resolve"
  - "#ossil-envases"
  - "#ia-agentica"
---

# 🎬 Guion de Video Documentador: Rediseño de E-Commerce Industrial (OSSIL Envases)

> **Volver al MOC:** [[00 - MOC OSSIL Envases]] · **Hub Audiovisual:** [[03 - MOC Audiovisual & Media]] · **Bitácora:** [[2026-11-06 - Configuración de Skills y Arquitectura OSSIL]]

Este documento contiene dos formatos de guion listos para grabación y montaje en **DaVinci Resolve**:
1. **Formato Largo (YouTube / Portfolio Case Study — 6 a 8 min):** Documental técnico de ingeniería mostrando cómo pasar de una web obsoleta de 2015 a una plataforma B2B/B2C moderna con Next.js 16, Three.js y agentes de IA especializados.
2. **Formato Corto (Instagram Reels / TikTok / YouTube Shorts — 75 a 90 seg):** Resumen dinámico de alta retención enfocado en el antes/después y la resolución de problemas reales del cliente.

---

## 🎥 PARTE 1: Guion Principal (YouTube / Documental de Ingeniería — ~6:30 min)

### Especificaciones de Producción
* **Resolución / Framerate:** 4K / 1440p a 60fps (capturas de pantalla fluidas) + Cámara principal a 24/30fps.
* **Edición:** Corte automático de silencios con `DaVinci Auto-Cut Plugin` + zoom dinámico en terminal y navegador.
* **Tono:** Técnico, directo, con criterio de ingeniería real (*Anti-Slop / Cero Humo*).

---

### ⏱️ 00:00 – 00:35 | 1. El Gancho (Hook): El problema real detrás de los comercios tradicionales
| Tiempo | Visual / B-Roll (DaVinci Resolve) | Audio / Locución (Shair) |
| :--- | :--- | :--- |
| **00:00 - 00:12** | **Split screen:** A la izquierda, la web original de `ossilenvases.com.ar` (Bootstrap 3, fotos chicas, tablas viejas). A la derecha, un vistazo rápido (blur sutil) de la nueva interfaz editorial con el visor 3D del frasco esmerilado y la calculadora mayorista. | *"Miren esta página web. Es de una distribuidora real de envases acá en Córdoba que vende desde frascos de perfume hasta envases cosméticos y farmacéuticos por mayor y menor. El negocio funciona increíble en el mundo físico... pero su web se quedó congelada en 2015."* |
| **00:12 - 00:25** | Cámara a cara (Talking Head) y corte rápido a la terminal en **Antigravity IDE** cargando las 96 skills y la bóveda de **Obsidian**. | *"La mayoría usaría una IA genérica, le pediría 'haceme una tienda linda' y terminaría con una plantilla violeta llena de humo que no sirve para vender ni un solo frasco. Hoy les voy a mostrar cómo encaro un rediseño de ingeniería real de punta a punta."* |
| **00:25 - 00:35** | Mapa de nodos de **Obsidian** abriéndose con el diagrama Mermaid de `13 - OSSIL Envases`. SFX: *Whoosh grave + click mecánico*. | *"Desde entrenar a mi propio agente con casi 100 skills técnicas, auditar el código viejo, hasta diseñar un sistema con filtros de rosca, precios escalonados y vista 3D interactiva."* |

---

### ⏱️ 00:35 – 01:55 | 2. Fase 1: Afilando la herramienta (Auditoría e Instalación de Skills)
| Tiempo | Visual / B-Roll (DaVinci Resolve) | Audio / Locución (Shair) |
| :--- | :--- | :--- |
| **00:35 - 01:05** | Captura de pantalla de la lista inicial de skills en Antigravity. Resaltar en pantalla las skills de diseño (`ui-ux-pro-max`, `emil-design-eng`, `tailwind-4-docs`). | *"Antes de tocar una sola línea de código, hice una auditoría de las capacidades de mi entorno en Antigravity. Yo ya tenía una base muy fuerte en estética UI/UX, micro-animaciones y Tailwind v4... pero para un e-commerce de catálogo pesado tenía cinco huecos importantes."* |
| **01:05 - 01:35** | Grabación de terminal corriendo `npx skills add` a toda velocidad (Speed ramp 300%) instalando `Autom8Minds/seo-skills`, `cloudai-x/threejs-skills`, `prisma/skills`, `playwright-best-practices` y `react-doctor`. | *"Me faltaba SEO técnico y local con Schema.org, manejo de estado complejo en la URL para filtros, visualización 3D con Three.js, bases de datos relacionales con Prisma y PostgreSQL, y pruebas automatizadas con Playwright. Así que instalamos 12 repositorios oficiales y vinculamos 48 nuevas skills directamente en el corazón del IDE."* |
| **01:35 - 01:55** | Zoom al script en Python verificando `Valid skills in ~/.gemini/config/skills: 96` y `Missing SKILL.md: []`. | *"En vez de meter 400 skills a lo loco y saturar la ventana de contexto del modelo, filtramos y enlazamos exactamente 96 skills validadas. Con el agente listo, pasamos a destripar la web original."* |

---

### ⏱️ 01:55 – 03:20 | 3. Fase 2: Radiografía técnica y comercial de OSSIL Envases
| Tiempo | Visual / B-Roll (DaVinci Resolve) | Audio / Locución (Shair) |
| :--- | :--- | :--- |
| **01:55 - 02:25** | Inspeccionando el código fuente de `ossilenvases.com.ar`. Zoom a `jquery-2.2.3.min.js`, `charset=iso-8859-1` y `<meta name="description" content="OSSIL Envases">`. | *"Cuando analizamos `ossilenvases.com.ar` por dentro, encontramos el clásico stack heredado: jQuery 2.2, Bootstrap 3, codificación ISO-8859-1 y metaetiquetas vacías para Google. Pero lo más importante no era solo el código viejo, sino entender cómo compra su cliente."* |
| **02:25 - 02:55** | Mostrar la ficha real del producto `Equatone 30 cc 18/415 Satinado`. Resaltar en pantalla los códigos `18/415`, `24/410`, `B/E 15` y los tramos de descuento (`10u -11%`, `25u -17%`, `50u -22%`, `100u -28%`). | *"Un laboratorio o emprendedor de cosmética no busca 'un frasquito lindo'. Busca un envase de vidrio de 30 cc con rosca exacta 18/415, necesita saber qué válvula spray le calza sin que pierda líquido, y compra por escala: llevando 10, 25, 50 o 100 unidades tiene hasta un 28% de descuento."* |
| **02:55 - 03:20** | Comparativa gráfica: en la web vieja, el usuario tiene que abrir 20 pestañas para adivinar qué tapa va con qué botella. | *"En la web actual no podés filtrar por rosca y material al mismo tiempo, y los precios mayoristas son un texto fijo que no te avisa cuánto te falta para ahorrar en el carrito. Ahí es donde entra nuestra arquitectura."* |

---

### ⏱️ 03:20 – 04:50 | 4. Fase 3: Stack Tecnológico, Servidor y Dirección de Arte
| Tiempo | Visual / B-Roll (DaVinci Resolve) | Audio / Locución (Shair) |
| :--- | :--- | :--- |
| **03:20 - 03:50** | Diagrama en Obsidian (`01 - Stack Tecnológico y Servidor.md`). Animación o paneo por las capas: **Next.js 16 + TypeScript 5.9 + Zustand + Prisma + PostgreSQL en Supabase + Vercel**. | *"Para resolver esto definimos un stack de producción real. En el frontend y servidor usamos Next.js 16 con App Router y TypeScript estricto, alojado en la red Edge de Vercel para que vuele en Argentina. Y en la base de datos elegimos PostgreSQL en Supabase con Prisma ORM."* |
| **03:50 - 04:20** | Mostrar esquema relacional de Prisma: tabla `Product`, tabla `PriceTier` (escalas de volumen) y `CompatibleAccessory` (compatibilidad por rosca `neckThread`). | *"¿Por qué SQL relacional y no otra cosa? Porque vinculamos cada envase con sus tapas compatibles a través del código de rosca, y modelamos las escalas de precios como entidades relacionales. Si abrís una botella 24/410, el sistema te muestra automáticamente solo las bombas y tapas 24/410."* |
| **04:20 - 04:50** | Mostrar la paleta de diseño **Industrial Apothecary** en Obsidian (`#FAF8F5`, `#141413`, Bronce Cobre `#9E734E`, Ámbar `#B45309`) y tipografía `Plus Jakarta Sans` + `JetBrains Mono`. | *"En lo visual aplicamos nuestra regla número uno: cero clichés de IA. Tomamos el color dorado original de OSSIL y lo evolucionamos hacia una estética de boticario industrial: fondos piedra cálidos, tipografía monoespaciada para medidas técnicas y un visor 3D en Three.js para diferenciar el vidrio cristal, el ámbar UV y el satinado."* |

---

### ⏱️ 04:50 – 06:00 | 5. Fase 4: Organización en Obsidian y Ejecución del Prototipo
| Tiempo | Visual / B-Roll (DaVinci Resolve) | Audio / Locución (Shair) |
| :--- | :--- | :--- |
| **04:50 - 05:25** | Recorrido por **Obsidian**: mostrando el `00 - Centro de Mando`, entrando a `13 - OSSIL Envases`, viendo el `Plan Maestro Paso a Paso` y la `Bitácora IA`. | *"Antes de programar el prototipo en la carpeta del proyecto, documentamos absolutamente todo en mi bóveda de Obsidian conectada al Centro de Mando: desde el mapa de contenidos y las decisiones de servidor hasta el plan maestro dividido en 7 fases."* |
| **05:25 - 06:00** | Cierre a cámara invitando a ver la parte 2 / resultado del prototipo en vivo. | *"Documentar así no solo ordena el proyecto: convierte cada línea de código en un caso de estudio profesional. Ahora sí, con el plan y la arquitectura listos, pasemos a construir el prototipo interactivo en vivo."* |

---

## 📱 PARTE 2: Guion Formato Corto (Reels / TikTok / Shorts — 75 seg)

* **Gancho (00:00 - 00:08):** *"Esta es la web actual de una distribuidora real de envases en Córdoba... y así es como preparamos su rediseño completo de ingeniería usando IA agéntica sin caer en plantillas genéricas."*
* **El Problema (00:08 - 00:25):** *"Al auditar su código encontramos Bootstrap 3 de 2015, sin filtros combinados. Si sos emprendedor y buscás un frasco de perfume de 30ml con rosca 18/415 y su válvula spray compatible, tenés que buscar a mano entre cientos de productos."*
* **El Armado Técnico (00:25 - 00:45):** *"Primero entrenamos a nuestro agente en Antigravity sumando 48 nuevas skills de SEO local, Zustand, Three.js, Prisma y Playwright. Después diseñamos la arquitectura en Obsidian: Next.js 16 en Vercel conectado a PostgreSQL en Supabase."*
* **La Solución de Negocio (00:45 - 01:05):** *"¿El diferencial? Filtros sincronizados en la URL por material y milímetro de rosca, calculadora en vivo de descuentos mayoristas de hasta el 28% OFF, y un visor 3D para ver el acabado satinado o ámbar del envase antes de comprar."*
* **CTA (01:05 - 01:15):** *"Todo documentado paso a paso en Obsidian. Comentá 'OSSIL' si querés ver la parte 2 probando el prototipo interactivo en vivo."*
