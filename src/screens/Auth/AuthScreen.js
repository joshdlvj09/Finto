// src/screens/Auth/AuthScreen.js
// Pantalla de bienvenida: iniciar sesión, crear cuenta o recuperar contraseña

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AuthStyles';
import { useAuthLogic } from './AuthLogic';
import { COLORS } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';
import PressableScale from '../../components/PressableScale';
import { useStaggeredFadeIn } from '../../hooks/useStaggeredFadeIn';

const logoMark = require('../../assets/logo-mark.png');

export default function AuthScreen() {
  const {
    mode,
    title,
    submitLabel,
    name,
    email,
    password,
    code,
    showPassword,
    isSubmitting,
    setName,
    setEmail,
    setPassword,
    setCode,
    toggleShowPassword,
    toggleMode,
    goTo,
    editRegistration,
    handleSubmit,
    resendCode,
  } = useAuthLogic();

  const isRegister = mode === 'register';
  const isRecovery = mode === 'forgot' || mode === 'reset';
  const needsCode = mode === 'reset' || mode === 'verify';

  // Entrada escalonada: marca, formulario y enlace inferior
  const enter = useStaggeredFadeIn(3);

  return (
    <ScreenBackground edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Marca */}
          <Animated.View style={[styles.brand, enter(0)]}>
            <Image source={logoMark} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>Finto</Text>
            <Text style={styles.tagline}>Tus finanzas, claras y en orden</Text>
          </Animated.View>

          {/* Formulario */}
          <Animated.View style={[styles.card, enter(1)]}>
            <Text style={styles.cardTitle}>{title}</Text>

            {mode === 'forgot' && (
              <Text style={styles.helperText}>
                Escribe el correo de tu cuenta y te enviaremos un código de 6 dígitos.
              </Text>
            )}
            {mode === 'reset' && (
              <Text style={styles.helperText}>
                Escribe el código que enviamos a <Text style={styles.helperBold}>{email.trim()}</Text> y
                tu nueva contraseña.
              </Text>
            )}
            {mode === 'verify' && (
              <Text style={styles.helperText}>
                Enviamos un código de 6 dígitos a{' '}
                <Text style={styles.helperBold}>{email.trim()}</Text>. Escríbelo para terminar de
                crear tu cuenta.
              </Text>
            )}

            {isRegister && (
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={COLORS.secondary} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nombre"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="words"
                  textContentType="name"
                  maxLength={60}
                />
              </View>
            )}

            {!needsCode && (
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={COLORS.secondary} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Correo electrónico"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onSubmitEditing={mode === 'forgot' ? handleSubmit : undefined}
                />
              </View>
            )}

            {needsCode && (
              <View style={styles.inputRow}>
                <Ionicons name="keypad-outline" size={18} color={COLORS.secondary} />
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  maxLength={6}
                  onSubmitEditing={mode === 'verify' ? handleSubmit : undefined}
                />
              </View>
            )}

            {mode !== 'forgot' && mode !== 'verify' && (
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.secondary} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={
                    mode === 'login'
                      ? 'Contraseña'
                      : mode === 'reset'
                        ? 'Nueva contraseña (mín. 6 caracteres)'
                        : 'Contraseña (mín. 6 caracteres)'
                  }
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textContentType={mode === 'login' ? 'password' : 'newPassword'}
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity onPress={toggleShowPassword} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            )}

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotLink} onPress={() => goTo('forgot')}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}

            <PressableScale
              style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitText}>{submitLabel}</Text>
              )}
            </PressableScale>

            {needsCode && (
              <TouchableOpacity style={styles.resendLink} onPress={resendCode} disabled={isSubmitting}>
                <Text style={styles.forgotText}>¿No te llegó? Reenviar código</Text>
              </TouchableOpacity>
            )}
            {mode === 'verify' && (
              <TouchableOpacity style={styles.resendLink} onPress={editRegistration} disabled={isSubmitting}>
                <Text style={styles.forgotText}>¿Correo equivocado? Corrígelo</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Cambiar de modo */}
          <Animated.View style={enter(2)}>
          {isRecovery || mode === 'verify' ? (
            <TouchableOpacity style={styles.switchRow} onPress={() => goTo('login')}>
              <Text style={styles.switchText}>
                <Text style={styles.switchLink}>Volver a iniciar sesión</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.switchRow} onPress={toggleMode}>
              <Text style={styles.switchText}>
                {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                <Text style={styles.switchLink}>{isRegister ? 'Inicia sesión' : 'Regístrate'}</Text>
              </Text>
            </TouchableOpacity>
          )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
