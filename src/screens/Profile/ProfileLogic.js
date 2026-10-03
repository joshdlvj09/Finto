// src/screens/Profile/ProfileLogic.js
// Lógica del menú de usuario: datos, cambiar contraseña, restablecer datos, salir y eliminar cuenta

import { useContext, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import { animateLayout } from '../../animations/motion';

// "Josh De la Vega" -> "JD"
const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

export const useProfileLogic = () => {
  const { user, logout, changePassword, deleteAccount } = useContext(AuthContext);
  const { transactions, deleteAllTransactions } = useContext(TransactionContext);
  const navigation = useNavigation();

  // Sección abierta: null | 'password' | 'delete'
  const [openSection, setOpenSection] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [busyAction, setBusyAction] = useState(null); // Acción en proceso para mostrar el indicador

  const clearForms = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setDeletePassword('');
  };

  const toggleSection = (section) => {
    animateLayout();
    clearForms();
    setOpenSection(openSection === section ? null : section);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  // ---- Cambiar contraseña ----
  const handleChangePassword = async () => {
    if (!currentPassword) return Alert.alert('Revisa tus datos', 'Escribe tu contraseña actual');
    if (newPassword.length < 6) {
      return Alert.alert('Revisa tus datos', 'La nueva contraseña debe tener al menos 6 caracteres');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Revisa tus datos', 'Las contraseñas nuevas no coinciden');
    }

    Keyboard.dismiss();
    setBusyAction('password');
    const result = await changePassword(currentPassword, newPassword);
    setBusyAction(null);

    if (!result.ok) return Alert.alert('No se pudo cambiar la contraseña', result.error);

    animateLayout();
    clearForms();
    setOpenSection(null);
    Alert.alert('Listo', 'Tu contraseña se actualizó correctamente.');
  };

  // ---- Restablecer datos (doble confirmación) ----
  const resetData = async () => {
    setBusyAction('reset');
    const result = await deleteAllTransactions();
    setBusyAction(null);
    if (!result.ok) return Alert.alert('No se pudieron borrar tus datos', result.error);
    Alert.alert('Datos restablecidos', 'Se borraron todos tus ingresos y gastos.');
  };

  const confirmResetData = () => {
    if (transactions.length === 0) {
      return Alert.alert('Sin datos', 'No tienes movimientos registrados.');
    }
    Alert.alert(
      'Restablecer datos',
      `Se borrarán tus ${transactions.length} movimientos (ingresos y gastos). Tu cuenta se conserva.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () =>
            Alert.alert('¿Estás seguro?', 'Esta acción no se puede deshacer.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sí, borrar todo', style: 'destructive', onPress: resetData },
            ]),
        },
      ]
    );
  };

  // ---- Cerrar sesión ----
  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Quieres salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  // ---- Eliminar cuenta ----
  const handleDeleteAccount = () => {
    if (!deletePassword) return Alert.alert('Revisa tus datos', 'Escribe tu contraseña para confirmar');
    Keyboard.dismiss();

    Alert.alert(
      'Eliminar cuenta',
      'Se borrarán tu cuenta y todos tus movimientos para siempre. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setBusyAction('delete');
            const result = await deleteAccount(deletePassword);
            setBusyAction(null);
            // Si sale bien, la sesión se cierra y la app regresa sola a la pantalla de inicio de sesión
            if (!result.ok) Alert.alert('No se pudo eliminar la cuenta', result.error);
          },
        },
      ]
    );
  };

  return {
    user,
    initials: getInitials(user?.name),
    memberSince,
    movementsCount: transactions.length,
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
    goBack: () => navigation.goBack(),
  };
};
