// src/screens/Analytics/AnalyticsLogic.js
// Lógica de resúmenes semanales y mensuales para la pantalla de Métricas

import { useContext, useMemo, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import {
  getPeriodRange,
  getPeriodLabel,
  filterByRange,
  getTotals,
  groupByCategory,
  getBuckets,
} from '../../utils/periods';

const DAY_MS = 24 * 60 * 60 * 1000;

export const useAnalyticsLogic = () => {
  const { transactions } = useContext(TransactionContext);

  const [mode, setMode] = useState('semana');          // 'semana' | 'mes'
  const [offset, setOffset] = useState(0);              // 0 = periodo actual
  const [breakdownType, setBreakdownType] = useState('gasto');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState(null);

  const clearSelection = () => {
    setSelectedCategory(null);
    setSelectedBucket(null);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setOffset(0);
    clearSelection();
  };

  const shiftPeriod = (step) => {
    if (offset + step > 0) return;
    setOffset(offset + step);
    clearSelection();
  };

  const changeBreakdownType = (type) => {
    setBreakdownType(type);
    setSelectedCategory(null);
  };

  const toggleCategory = (id) => setSelectedCategory(selectedCategory === id ? null : id);

  const summary = useMemo(() => {
    const range = getPeriodRange(mode, offset);
    const inPeriod = filterByRange(transactions, range);
    const totals = getTotals(inPeriod);

    // Comparación de gastos contra el periodo anterior
    const prevTotals = getTotals(filterByRange(transactions, getPeriodRange(mode, offset - 1)));
    let expenseChange = null;
    if (prevTotals.expenses > 0) {
      expenseChange = ((totals.expenses - prevTotals.expenses) / prevTotals.expenses) * 100;
    }

    // Promedio diario de gasto: en el periodo actual solo cuentan los días transcurridos
    const now = new Date();
    const endForAverage = range.end > now ? now : range.end;
    const days = Math.max(Math.ceil((endForAverage - range.start) / DAY_MS), 1);

    const expenseCategories = groupByCategory(inPeriod, 'gasto');

    return {
      periodLabel: getPeriodLabel(mode, offset, range),
      totals,
      expenseChange,
      dailyAverage: totals.expenses / days,
      topCategory: expenseCategories[0] || null,
      movementsCount: inPeriod.length,
      breakdown: groupByCategory(inPeriod, breakdownType),
      buckets: getBuckets(inPeriod, mode, range),
    };
  }, [transactions, mode, offset, breakdownType]);

  const selectedItem = summary.breakdown.find((item) => item.id === selectedCategory) || null;

  return {
    mode,
    offset,
    canGoForward: offset < 0,
    breakdownType,
    selectedCategory,
    selectedItem,
    selectedBucket,
    ...summary,
    changeMode,
    shiftPeriod,
    changeBreakdownType,
    toggleCategory,
    setSelectedBucket,
  };
};
