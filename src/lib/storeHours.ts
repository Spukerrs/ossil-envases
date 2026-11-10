// Utilidad para calcular en tiempo real si el local de Oncativo 69 (Córdoba) está abierto o cerrado
// Horarios oficiales:
// - Lunes: 08:15 a 17:15 hs
// - Martes a Viernes: 08:00 a 17:15 hs
// - Sábados: 09:00 a 13:30 hs
// - Domingos: Cerrado

export interface StoreStatus {
  isOpen: boolean;
  statusLabel: string;
  scheduleText: string;
  nextChangeText: string;
  localTimeDisplay: string;
}

export function getStoreStatus(now: Date = new Date()): StoreStatus {
  // Obtener fecha y hora en zona horaria de Córdoba / Argentina (UTC-3)
  const cordobaString = now.toLocaleString("en-US", {
    timeZone: "America/Argentina/Cordoba",
  });
  const cordobaDate = new Date(cordobaString);

  const dayOfWeek = cordobaDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hours = cordobaDate.getHours();
  const minutes = cordobaDate.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const timeFormat = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Cordoba",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  // Rangos en minutos desde medianoche:
  // Lunes: 08:15 (495 min) a 17:15 (1035 min)
  const mondayOpen = 8 * 60 + 15; // 495
  // Martes a Viernes: 08:00 (480 min) a 17:15 (1035 min)
  const tuesdayToFridayOpen = 8 * 60; // 480
  const weekdayClose = 17 * 60 + 15; // 1035

  // Sábados: 09:00 (540 min) a 13:30 (810 min)
  const saturdayOpen = 9 * 60; // 540
  const saturdayClose = 13 * 60 + 30; // 810

  let isOpen = false;
  let nextChangeText = "";

  if (dayOfWeek === 1) {
    // Lunes
    if (currentMinutes >= mondayOpen && currentMinutes < weekdayClose) {
      isOpen = true;
      nextChangeText = "Atendiendo hoy en Oncativo 69 hasta las 17:15 hs";
    } else if (currentMinutes < mondayOpen) {
      isOpen = false;
      nextChangeText = "Abre hoy lunes a las 08:15 hs • Pedidos web activos 24/7";
    } else {
      isOpen = false;
      nextChangeText = "Abre mañana martes a las 08:00 hs • Pedidos web activos 24/7";
    }
  } else if (dayOfWeek >= 2 && dayOfWeek <= 5) {
    // Martes a Viernes
    if (currentMinutes >= tuesdayToFridayOpen && currentMinutes < weekdayClose) {
      isOpen = true;
      nextChangeText = "Atendiendo hoy en Oncativo 69 hasta las 17:15 hs";
    } else if (currentMinutes < tuesdayToFridayOpen) {
      isOpen = false;
      nextChangeText = "Abre hoy a las 08:00 hs • Pedidos web activos 24/7";
    } else {
      isOpen = false;
      if (dayOfWeek === 5) {
        nextChangeText = "Abre mañana sábado a las 09:00 hs • Pedidos web activos 24/7";
      } else {
        nextChangeText = "Abre mañana a las 08:00 hs • Pedidos web activos 24/7";
      }
    }
  } else if (dayOfWeek === 6) {
    // Sábado
    if (currentMinutes >= saturdayOpen && currentMinutes < saturdayClose) {
      isOpen = true;
      nextChangeText = "Atendiendo hoy en Oncativo 69 hasta las 13:30 hs";
    } else if (currentMinutes < saturdayOpen) {
      isOpen = false;
      nextChangeText = "Abre hoy a las 09:00 hs • Pedidos web activos 24/7";
    } else {
      isOpen = false;
      nextChangeText = "Abre el lunes a las 08:15 hs • Pedidos web activos 24/7";
    }
  } else {
    // Domingo
    isOpen = false;
    nextChangeText = "Abre el lunes a las 08:15 hs • Pedidos web activos 24/7";
  }

  let scheduleText = "Mar a Vie: 08:00 a 17:15 hs";
  if (dayOfWeek === 1 || dayOfWeek === 0) {
    scheduleText = "Lunes: 08:15 a 17:15 hs";
  } else if (dayOfWeek === 6) {
    scheduleText = "Sábados: 09:00 a 13:30 hs";
  }

  return {
    isOpen,
    statusLabel: isOpen ? "Abierto Ahora" : "Cerrado Ahora",
    scheduleText,
    nextChangeText,
    localTimeDisplay: `${timeFormat} hs (Córdoba)`,
  };
}
