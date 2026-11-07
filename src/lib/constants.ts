// Configuración y datos oficiales de OSSIL Envases & OSSIL Home
// Actualizado con el número de contacto directo del usuario: +54 351 811-1868

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
    // Número directo solicitado por el usuario: +543518111868
    phoneDisplay: "+54 351 811-1868",
    whatsappClean: "5493518111868",
    whatsappUrl: (message: string) =>
      `https://wa.me/5493518111868?text=${encodeURIComponent(message)}`,
    email: "ventas@ossilenvases.com.ar",
  },
  socials: {
    instagram: "https://www.instagram.com/ossilenvases/",
    instagramHandle: "@ossilenvases",
    facebook: "https://www.facebook.com/ossilenvases/",
    facebookHandle: "/ossilenvases",
    tiktok: "https://www.tiktok.com/@ossilenvases",
    tiktokHandle: "@ossilenvases",
    officialWeb: "https://www.ossilenvases.com.ar/",
  },
  hours: {
    weekdays: "Lunes a Viernes de 8:00 a 17:15 hs",
    saturdays: "Sábados de 9:00 a 13:30 hs",
    sundays: "Cerrado",
  },
  reputation: {
    stars: 4.9,
    reviewsCount: 7466,
    badgeText: "4.9 ★ en Google Maps (7.466+ opiniones)",
  },
} as const;
