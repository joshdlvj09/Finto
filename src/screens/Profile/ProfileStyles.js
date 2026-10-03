// src/screens/Profile/ProfileStyles.js
// Estilos del menú de usuario con la paleta Pure Black, Charcoal y Gold

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Poiret-One',
    color: COLORS.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Legible sobre la parte clara del fondo
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  // Tarjeta del usuario
  profileCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(160, 127, 58, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 170, 111, 0.15)',
  },
  infoItem: {
    flexShrink: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginTop: 3,
  },

  // Menú
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    marginBottom: 22,
    overflow: 'hidden',
  },
  dangerCard: {
    borderColor: 'rgba(224, 106, 95, 0.35)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(160, 127, 58, 0.12)',
    marginLeft: 48,
  },

  // Formularios desplegables
  expandArea: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.background,
  },
  warningText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: 'rgba(224, 106, 95, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.expense,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  dangerButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.expense,
  },
});
