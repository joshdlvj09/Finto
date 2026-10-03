// src/screens/Home/HomeStyles.js
// Estilos para Home usando la paleta Pure Black, Charcoal y Gold

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, // El SafeAreaView ya respeta la barra de estado / notch
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 53, // Proporción del isotipo (730 x 886)
    marginRight: 12,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(160, 127, 58, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
    marginTop: 12,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  appName: {
    fontSize: 34,
    fontFamily: 'Poiret-One',
    color: COLORS.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Legible sobre la parte clara del fondo
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    marginTop: 2,
  },
  // Tarjeta de balance
  balanceCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  balanceTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  balanceAmount: {
    fontSize: 38,
    fontFamily: 'Poiret-One',
    color: COLORS.secondary, // Balance en dorado
    marginVertical: 8,
  },
  rowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 170, 111, 0.15)',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  statIncome: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.income,
    marginTop: 2,
  },
  statExpense: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.expense,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 5,
  },
  transactionCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(160, 127, 58, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transDesc: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
  },
  transSub: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginTop: 3,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  incomeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.income,
  },
  expenseText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.expense,
  },
});