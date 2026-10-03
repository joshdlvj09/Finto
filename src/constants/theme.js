// src/constants/theme.js
// Paleta de colores de Finto: Pure Black, Charcoal y Gold

export const COLORS = {
  background: '#000000',                     // Fondo principal: negro puro
  card: '#141414',                           // Charcoal para barras y tarjetas sólidas
  cardTranslucent: 'rgba(20, 20, 20, 0.85)', // Tarjetas sobre la imagen de fondo
  border: 'rgba(160, 127, 58, 0.35)',        // Borde dorado sutil

  primary: '#A07F3A',                        // Gold principal
  secondary: '#C8AA6F',                      // Gold claro para subtítulos

  textPrimary: '#E3D5BB',                    // Texto principal (marfil)
  textMuted: '#7A7468',                      // Texto secundario / inactivo

  income: '#6FBF73',                         // Verde para ingresos
  expense: '#E06A5F',                        // Rojo para gastos

  // Barras de las gráficas: par validado para daltonismo sobre fondo oscuro
  chartIncome: '#199E70',
  chartExpense: '#D95926',
  chartGrid: 'rgba(227, 213, 187, 0.08)',    // Líneas de guía muy tenues
};
