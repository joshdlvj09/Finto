// src/constants/categories.js
// Catálogo de categorías para clasificar gastos e ingresos
// Cada categoría tiene un color fijo para las gráficas (paleta validada para daltonismo
// sobre fondo oscuro). El color sigue a la categoría, nunca a su posición en la gráfica.

export const DEFAULT_CATEGORIES = [
  { id: 'comida', label: 'Comidas', icon: 'fast-food-outline', type: 'gasto', color: '#3987E5' },
  { id: 'postres', label: 'Postres / Café', icon: 'ice-cream-outline', type: 'gasto', color: '#D95926' },
  { id: 'suscripciones', label: 'Suscripciones', icon: 'film-outline', type: 'gasto', color: '#199E70' },
  { id: 'transporte', label: 'Transporte', icon: 'car-outline', type: 'gasto', color: '#C98500' },
  { id: 'supermercado', label: 'Super', icon: 'cart-outline', type: 'gasto', color: '#D55181' },
  { id: 'salud', label: 'Salud', icon: 'medkit-outline', type: 'gasto', color: '#008300' },
  { id: 'ocio', label: 'Ocio / Salidas', icon: 'game-controller-outline', type: 'gasto', color: '#9085E9' },
  { id: 'nomina', label: 'Nómina', icon: 'cash-outline', type: 'ingreso', color: '#3987E5' },
  { id: 'otros', label: 'Otros', icon: 'ellipsis-horizontal-outline', type: 'ambos', color: '#E66767' },
];

// Busca una categoría por id; si no existe, regresa "Otros"
export const getCategoryById = (id) =>
  DEFAULT_CATEGORIES.find((cat) => cat.id === id) ||
  DEFAULT_CATEGORIES.find((cat) => cat.id === 'otros');
