// src/screens/Auth/AuthStyles.js
// Estilos de inicio de sesión / registro con la paleta Pure Black, Charcoal y Gold

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 74,
    height: 90, // Proporción del isotipo (730 x 886)
    marginBottom: 10,
  },
  appName: {
    fontSize: 56,
    fontFamily: 'Poiret-One',
    color: COLORS.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Legible sobre la parte clara del fondo
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 127, 58, 0.18)',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: -8,
    marginBottom: 16,
  },
  helperBold: {
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
  },
  codeInput: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    letterSpacing: 6,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    marginBottom: 4,
  },
  resendLink: {
    alignSelf: 'center',
    paddingVertical: 6,
    marginTop: 12,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.background,
    letterSpacing: 0.5,
  },
  switchRow: {
    alignItems: 'center',
    marginTop: 22,
    padding: 8,
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  switchLink: {
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
  },
});
