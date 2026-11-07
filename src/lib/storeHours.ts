// Utilidad para calcular en tiempo real si el local de Oncativo 69 (Córdoba) está abierto o cerrado
// Horarios oficiales:
// - Lunes a Viernes: 08:30 a 17:30 hs
// - Sábados: 09:00 a 13:00 hs
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
  // Lunes a Viernes: 08:30 (510 min) a 17:30 (1050 min)
  const weekdayOpen = 8 * 60 + 30; // 510
  const weekdayClose = 17 * 60 + 30; // 1050

  // Sábados: 09:00 (540 min) a 13:00 (780 min)
  const saturdayOpen = 9 * 60; // 540
  const saturdayClose = 13 * 60; // 780

  let isOpen = false;
  let nextChangeText = "";

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Lunes a Viernes
    if (currentMinutes >= weekdayOpen && currentMinutes < weekdayClose) {
      isOpen = true;
      nextChangeText = "Atendiendo hoy en Oncativo 69 hasta las 17:30 hs";
    } else if (currentMinutes < weekdayOpen) {
      isOpen = false;
      nextChangeText = "Abre hoy a las 08:30 hs • Pedidos web activos 24/7";
    } else {
      isOpen = false;
      if (dayOfWeek === 5) {
        nextChangeText = "Abre mañana sábado a las 09:00 hs • Pedidos web activos 24/7";
      } else {
        nextChangeText = "Abre mañana a las 08:30 hs • Pedidos web activos 24/7";
      }
    }
  } else if (dayOfWeek === 6) {
    // Sábado
    if (currentMinutes >= saturdayOpen && currentMinutes < saturdayClose) {
      isOpen = true;
      nextChangeText = "Atendiendo hoy en Oncativo 69 hasta las 13:00 hs";
    } else if (currentMinutes < saturdayOpen) {
      isOpen = false;
      nextChangeText = "Abre hoy a las 09:00 hs • Pedidos web activos 24/7";
    } else {
      isOpen = false;
      nextChangeText = "Abre el lunes a las 08:30 hs • Pedidos web activos 24/7";
    }
  } else {
    // Domingo
    isOpen = false;
    nextChangeText = "Abre el lunes a las 08:30 hs • Pedidos web activos 24/7";
  }

  return {
    isOpen,
    statusLabel: isOpen ? "Abierto Ahora" : "Cerrado Ahora",
    scheduleText: dayOfWeek === 6 ? "Sábados: 09:00 a 13:00 hs" : "Lun a Vie: 08:30 a 17:30 hs",
    nextChangeText,
    localTimeDisplay: `${timeFormat} hs (Córdoba)`,
  };
}
