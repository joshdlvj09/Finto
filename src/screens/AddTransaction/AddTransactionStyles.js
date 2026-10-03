// src/screens/AddTransaction/AddTransactionStyles.js
// Estilos del formulario de nuevo movimiento con la paleta Pure Black, Charcoal y Gold

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
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

  // Selector Gasto / Ingreso (SegmentedControl)
  typeSelector: {
    marginBottom: 20,
  },

  // Monto
  amountCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 38,
    fontFamily: 'Poiret-One',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 38,
    fontFamily: 'Poiret-One',
    color: COLORS.textPrimary,
    padding: 0,
  },

  // Agregar otro movimiento
  addAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(160, 127, 58, 0.5)',
    paddingVertical: 13,
    marginBottom: 16,
  },
  addAnotherText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
    marginLeft: 6,
  },

  // Lista "Por guardar"
  pendingCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 16,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  pendingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(160, 127, 58, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pendingTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
  },
  pendingSub: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginTop: 2,
  },
  pendingAmount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    marginHorizontal: 10,
  },
  pendingHint: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },

  // Factura
  invoiceCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    padding: 14,
    marginBottom: 24,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginHorizontal: 10,
  },
  invoiceStatus: {
    marginTop: 12,
  },

  // Categorías
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 18,
  },
  categoryItem: {
    width: '33.33%',
    padding: 5,
  },
  categoryInner: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  categoryInnerActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(160, 127, 58, 0.15)',
  },
  categoryLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: COLORS.textPrimary,
    fontFamily: 'Montserrat-Bold',
  },

  // Descripción
  textInput: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginBottom: 24,
  },

  // Fecha
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 30,
  },
  dateArrow: {
    padding: 8,
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },

  // Botón guardar
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.background,
    letterSpacing: 0.5,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(224, 106, 95, 0.4)',
    paddingVertical: 14,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.expense,
    marginLeft: 8,
  },
});
