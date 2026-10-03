// src/utils/periods.js
// Cálculos de periodos (semana / mes) para los resúmenes de Finto

import { getCategoryById } from '../constants/categories';

const DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Rango de fechas del periodo. offset 0 = actual, -1 = anterior, etc.
// Las semanas empiezan en lunes.
export const getPeriodRange = (mode, offset = 0) => {
  const now = new Date();

  if (mode === 'semana') {
    const start = startOfDay(now);
    const dayIndex = (start.getDay() + 6) % 7; // lunes = 0
    start.setDate(start.getDate() - dayIndex + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
};

// Texto del periodo: "Esta semana", "29 sep – 5 oct", "Octubre 2026"
export const getPeriodLabel = (mode, offset, { start, end }) => {
  if (mode === 'semana') {
    if (offset === 0) return 'Esta semana';
    if (offset === -1) return 'Semana pasada';
    const last = new Date(end);
    last.setDate(last.getDate() - 1);
    const fmt = (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    return `${fmt(start)} – ${fmt(last)}`;
  }
  const label = start.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const filterByRange = (transactions, { start, end }) =>
  transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d >= start && d < end;
  });

export const getTotals = (transactions) =>
  transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'ingreso') acc.income += tx.amount;
      else acc.expenses += tx.amount;
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

// Suma por categoría de un tipo, ordenada de mayor a menor, con porcentaje
export const groupByCategory = (transactions, type) => {
  const totals = {};
  transactions
    .filter((tx) => tx.type === type)
    .forEach((tx) => {
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
    });

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);

  return Object.entries(totals)
    .map(([id, amount]) => {
      const category = getCategoryById(id);
      return {
        id: category.id,
        label: category.label,
        icon: category.icon,
        color: category.color,
        amount,
        percent: sum > 0 ? (amount / sum) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

// Barras de la gráfica: por día en modo semana, por semana en modo mes
export const getBuckets = (transactions, mode, { start, end }) => {
  const buckets = [];

  if (mode === 'semana') {
    for (let i = 0; i < 7; i++) {
      const bStart = new Date(start);
      bStart.setDate(start.getDate() + i);
      const bEnd = new Date(bStart);
      bEnd.setDate(bStart.getDate() + 1);
      buckets.push({
        key: String(i),
        label: DAY_NAMES[i],
        detail: bStart.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' }),
        start: bStart,
        end: bEnd,
      });
    }
  } else {
    // Semanas del mes: 1-7, 8-14, 15-21, 22-28, 29-fin
    let day = 1;
    let index = 1;
    while (true) {
      const bStart = new Date(start.getFullYear(), start.getMonth(), day);
      if (bStart >= end) break;
      let bEnd = new Date(start.getFullYear(), start.getMonth(), day + 7);
      if (bEnd > end) bEnd = end;
      const lastDay = new Date(bEnd);
      lastDay.setDate(lastDay.getDate() - 1);
      buckets.push({
        key: String(index),
        label: `S${index}`,
        detail: `Del ${bStart.getDate()} al ${lastDay.getDate()}`,
        start: bStart,
        end: bEnd,
      });
      day += 7;
      index += 1;
    }
  }

  return buckets.map((bucket) => ({
    ...bucket,
    ...getTotals(filterByRange(transactions, bucket)),
  }));
};
