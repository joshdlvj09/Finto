// src/screens/Analytics/AnalyticsStyles.js
// Estilos de Métricas con la paleta Pure Black, Charcoal y Gold

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Poiret-One',
    color: COLORS.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Legible sobre la parte clara del fondo
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    marginTop: 2,
  },

  // Navegación de periodo
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  periodArrow: {
    padding: 8,
  },
  periodLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
  },

  // Tarjetas
  card: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balance: {
    fontSize: 36,
    fontFamily: 'Poiret-One',
    color: COLORS.textPrimary,
    marginVertical: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 170, 111, 0.15)',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    marginTop: 2,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  insightText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginLeft: 6,
    flexShrink: 1,
  },

  // Datos rápidos
  tilesRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  tileLabel: {
    fontSize: 10,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  tileValue: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  // Dona y leyenda
  donutWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  legendRowActive: {
    backgroundColor: 'rgba(160, 127, 58, 0.12)',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendAmount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
  },
  legendPercent: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    width: 40,
    textAlign: 'right',
  },

  // Vacío
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
