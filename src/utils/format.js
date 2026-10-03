// src/utils/format.js
// Formato de montos y fechas en español (México)

// 1234.5 -> "$1,234.50" | 1000 -> "$1,000"
export const formatMoney = (value) => {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return `$${Math.abs(value).toLocaleString('es-MX', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

// Versión corta para ejes y barras: 1500 -> "$1.5k"
export const formatMoneyShort = (value) => {
  const abs = Math.abs(value);
  if (abs >= 1000000) return `$${(abs / 1000000).toFixed(1).replace('.0', '')}M`;
  if (abs >= 1000) return `$${(abs / 1000).toFixed(1).replace('.0', '')}k`;
  return `$${Math.round(abs)}`;
};

export const isSameDay = (a, b) => a.toDateString() === b.toDateString();

// "Hoy", "Ayer" o "lun 3 oct"
export const formatDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Hoy';
  if (isSameDay(date, yesterday)) return 'Ayer';
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
};
