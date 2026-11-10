// Configuración y datos oficiales de OSSIL Envases & OSSIL Home
// Actualizado con las líneas comerciales oficiales de venta y horarios verificados

export const IVA_RATE = 0.21;

export const STORE_CONFIG = {
  name: "OSSIL Envases & OSSIL Home",
  shortName: "OSSIL Envases",
  legalName: "OSSIL Envases S.R.L.",
  slogan: "Envases para Perfumería, Cosmética y Farmacia. Bazar e Insumos.",
  location: {
    address: "Oncativo 69, Local 1",
    city: "Córdoba Capital",
    province: "Córdoba",
    country: "Argentina",
    postalCode: "X5000",
    geo: {
      latitude: -31.4137,
      longitude: -64.1783,
    },
    googleMapsUrl: "https://maps.app.goo.gl/6mLg33JqzYa4pJsP8",
  },
  contact: {
    salesLines: [
      {
        id: "line1",
        label: "Línea 1 — Ventas & Asesoramiento",
        shortLabel: "Línea 1",
        phoneDisplay: "+54 9 351 244-0156",
        clean: "5493512440156",
      },
      {
        id: "line2",
        label: "Línea 2 — Pedidos & Cotizaciones",
        shortLabel: "Línea 2",
        phoneDisplay: "+54 9 351 319-6225",
        clean: "5493513196225",
      },
    ] as const,
    phoneDisplay: "+54 9 351 244-0156 / +54 9 351 319-6225",
    whatsappClean: "5493512440156",
    whatsappCleanSecondary: "5493513196225",
    whatsappUrl: (message: string, clean = "5493512440156") =>
      `https://wa.me/${clean}?text=${encodeURIComponent(message)}`,
    email: "ventas@ossilenvases.com.ar",
  },
  socials: {
    instagram: "https://www.instagram.com/ossil.envases.cba/",
    instagramHandle: "@ossil.envases.cba",
    facebook: "https://www.facebook.com/ossil.envases.cba/",
    facebookHandle: "ossil.envases.cba",
  },
  hours: {
    monday: "Lunes de 08:15 a 17:15 hs",
    tuesdayToFriday: "Martes a Viernes de 08:00 a 17:15 hs",
    weekdays: "Lun 08:15 a 17:15 hs • Mar a Vie 08:00 a 17:15 hs",
    saturdays: "Sábados de 09:00 a 13:30 hs",
    sundays: "Cerrado",
  },
  reputation: {
    stars: 4.9,
    reviewsCount: 7466,
    badgeText: "4.9 ★ en Google Maps (7.466+ opiniones)",
  },
  notices: {
    manualQuote:
      "Algunos productos no cuentan con precio mayorista automático; el descuento final se confirma con un asesor por WhatsApp antes de facturar.",
  },
} as const;
