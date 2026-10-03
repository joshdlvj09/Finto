// src/screens/Profile/ProfileScreen.js
// Menú de usuario: datos de la cuenta y opciones

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ProfileStyles';
import { useProfileLogic } from './ProfileLogic';
import { COLORS } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';
import PressableScale from '../../components/PressableScale';
import { useStaggeredFadeIn } from '../../hooks/useStaggeredFadeIn';
import { SPRING, isReduceMotion } from '../../animations/motion';

// Fila del menú con ícono, texto y flecha (la flecha gira al abrir la sección)
const MenuItem = ({ icon, label, onPress, danger, open, loading }) => {
  const rotation = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (isReduceMotion()) rotation.setValue(open ? 1 : 0);
    else Animated.spring(rotation, { toValue: open ? 1 : 0, ...SPRING }).start();
  }, [open]);

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={loading} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color={danger ? COLORS.expense : COLORS.secondary} />
      <Text style={[styles.menuLabel, danger && { color: COLORS.expense }]}>{label}</Text>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Animated.View
          style={{
            transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) }],
          }}
        >
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const PasswordInput = ({ value, onChangeText, placeholder, textContentType }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={COLORS.textMuted}
    secureTextEntry
    autoCapitalize="none"
    textContentType={textContentType}
  />
);

export default function ProfileScreen() {
  const {
    user,
    initials,
    memberSince,
    movementsCount,
    openSection,
    currentPassword,
    newPassword,
    confirmPassword,
    deletePassword,
    busyAction,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setDeletePassword,
    toggleSection,
    handleChangePassword,
    confirmResetData,
    confirmLogout,
    handleDeleteAccount,
    goBack,
  } = useProfileLogic();

  // Entrada escalonada: tarjeta del usuario y cada sección del menú
  const enter = useStaggeredFadeIn(4, { delay: 70 });

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Perfil</Text>
            <TouchableOpacity onPress={goBack} hitSlop={10}>
              <Ionicons name="close" size={26} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {/* Datos del usuario */}
          <Animated.View style={[styles.profileCard, enter(0)]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>{memberSince}</Text>
              </View>
              <View style={[styles.infoItem, { alignItems: 'flex-end' }]}>
                <Text style={styles.infoLabel}>Movimientos</Text>
                <Text style={styles.infoValue}>{movementsCount}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Cuenta */}
          <Animated.View style={enter(1)}>
            <Text style={styles.sectionLabel}>Cuenta</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="key-outline"
                label="Cambiar contraseña"
                open={openSection === 'password'}
                onPress={() => toggleSection('password')}
              />
              {openSection === 'password' && (
                <View style={styles.expandArea}>
                  <PasswordInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Contraseña actual"
                    textContentType="password"
                  />
                  <PasswordInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                    textContentType="newPassword"
                  />
                  <PasswordInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirma la nueva contraseña"
                    textContentType="newPassword"
                  />
                  <PressableScale
                    style={[styles.primaryButton, busyAction === 'password' && { opacity: 0.6 }]}
                    onPress={handleChangePassword}
                    disabled={busyAction === 'password'}
                  >
                    {busyAction === 'password' ? (
                      <ActivityIndicator color={COLORS.background} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Guardar contraseña</Text>
                    )}
                  </PressableScale>
                </View>
              )}

              <View style={styles.divider} />
              <MenuItem icon="log-out-outline" label="Cerrar sesión" onPress={confirmLogout} />
            </View>
          </Animated.View>

          {/* Datos */}
          <Animated.View style={enter(2)}>
            <Text style={styles.sectionLabel}>Datos</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="refresh-outline"
                label="Restablecer datos (ingresos y gastos)"
                onPress={confirmResetData}
                loading={busyAction === 'reset'}
              />
            </View>
          </Animated.View>

          {/* Zona de peligro */}
          <Animated.View style={enter(3)}>
            <Text style={styles.sectionLabel}>Zona de peligro</Text>
            <View style={[styles.menuCard, styles.dangerCard]}>
              <MenuItem
                icon="trash-outline"
                label="Eliminar cuenta"
                danger
                open={openSection === 'delete'}
                onPress={() => toggleSection('delete')}
              />
              {openSection === 'delete' && (
                <View style={styles.expandArea}>
                  <Text style={styles.warningText}>
                    Se borrarán tu cuenta y todos tus movimientos para siempre. Escribe tu contraseña
                    para confirmar.
                  </Text>
                  <PasswordInput
                    value={deletePassword}
                    onChangeText={setDeletePassword}
                    placeholder="Contraseña"
                    textContentType="password"
                  />
                  <PressableScale
                    style={[styles.dangerButton, busyAction === 'delete' && { opacity: 0.6 }]}
                    onPress={handleDeleteAccount}
                    disabled={busyAction === 'delete'}
                  >
                    {busyAction === 'delete' ? (
                      <ActivityIndicator color={COLORS.textPrimary} />
                    ) : (
                      <Text style={styles.dangerButtonText}>Eliminar mi cuenta</Text>
                    )}
                  </PressableScale>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
