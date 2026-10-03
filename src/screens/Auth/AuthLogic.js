// src/screens/Auth/AuthLogic.js
// Lógica de inicio de sesión, registro con verificación de correo y recuperación de contraseña

import { useContext, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { animateLayout } from '../../animations/motion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Modos de la pantalla:
// 'login'    -> iniciar sesión
// 'register' -> crear cuenta (paso 1: datos)
// 'verify'   -> crear cuenta (paso 2: código enviado al correo)
// 'forgot'   -> pedir código de recuperación por correo
// 'reset'    -> escribir el código y la nueva contraseña
const TITLES = {
  login: 'Iniciar sesión',
  register: 'Crear cuenta',
  verify: 'Confirma tu correo',
  forgot: 'Recuperar contraseña',
  reset: 'Nueva contraseña',
};

const SUBMIT_LABELS = {
  login: 'Entrar',
  register: 'Continuar',
  verify: 'Verificar y crear cuenta',
  forgot: 'Enviar código',
  reset: 'Cambiar contraseña',
};

const ERROR_TITLES = {
  login: 'No se pudo iniciar sesión',
  register: 'No se pudo crear la cuenta',
  verify: 'No se pudo verificar tu correo',
  forgot: 'No se pudo enviar el código',
  reset: 'No se pudo cambiar la contraseña',
};

export const useAuthLogic = () => {
  const { login, register, verifyRegistration, requestPasswordReset, resetPassword } =
    useContext(AuthContext);

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goTo = (newMode) => {
    animateLayout();
    setMode(newMode);
    setPassword('');
    setCode('');
  };

  const toggleMode = () => goTo(mode === 'register' ? 'login' : 'register');

  // Validación rápida antes de llamar al servidor
  const validate = () => {
    if (mode === 'register' && !name.trim()) return 'Escribe tu nombre';
    if (!EMAIL_REGEX.test(email.trim())) return 'Escribe un correo válido';
    if (mode === 'forgot') return null;
    if ((mode === 'reset' || mode === 'verify') && !/^\d{6}$/.test(code.trim())) {
      return 'El código tiene 6 dígitos';
    }
    if (mode === 'verify') return null;
    if (mode !== 'login' && password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (!password) return 'Escribe tu contraseña';
    return null;
  };

  // Avisos con un botón para ir directo a la opción correcta
  const showError = (currentMode, { error, code }) => {
    const cancel = { text: 'Cancelar', style: 'cancel' };

    if (code === 'ACCOUNT_NOT_FOUND') {
      Alert.alert('Cuenta no encontrada', error, [
        cancel,
        { text: 'Crear cuenta', onPress: () => goTo('register') },
      ]);
    } else if (code === 'ACCOUNT_EXISTS') {
      Alert.alert('Esta cuenta ya existe', error, [
        cancel,
        { text: 'Recuperar contraseña', onPress: () => goTo('forgot') },
        { text: 'Iniciar sesión', onPress: () => goTo('login') },
      ]);
    } else if (code === 'WRONG_PASSWORD') {
      Alert.alert('Contraseña incorrecta', error, [
        { text: 'Reintentar', style: 'cancel' },
        { text: '¿La olvidaste?', onPress: () => goTo('forgot') },
      ]);
    } else {
      Alert.alert(ERROR_TITLES[currentMode], error);
    }
  };

  const sendResetCode = async () => {
    const result = await requestPasswordReset(email);
    if (result.ok) {
      animateLayout();
      setCode('');
      setPassword('');
      setMode('reset');
      Alert.alert('Revisa tu correo', `${result.message} Expira en 15 minutos.`);
    }
    return result;
  };

  // Registro paso 1: se conservan nombre, correo y contraseña por si hay que reenviar el código
  const sendVerificationCode = async () => {
    const result = await register(name, email, password);
    if (result.ok) {
      animateLayout();
      setCode('');
      setMode('verify');
      Alert.alert('Revisa tu correo', `${result.message} Expira en 15 minutos.`);
    }
    return result;
  };

  // Volver a los datos del registro para corregir el correo
  const editRegistration = () => {
    animateLayout();
    setCode('');
    setMode('register');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const error = validate();
    if (error) {
      Alert.alert('Revisa tus datos', error);
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    let result;
    if (mode === 'login') result = await login(email, password);
    else if (mode === 'register') result = await sendVerificationCode();
    else if (mode === 'verify') result = await verifyRegistration(email, code);
    else if (mode === 'forgot') result = await sendResetCode();
    else result = await resetPassword(email, code, password);

    setIsSubmitting(false);

    // Si login, registro o cambio de contraseña salen bien, la navegación cambia sola a la app
    if (!result.ok) showError(mode, result);
  };

  const resendCode = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isRegistration = mode === 'verify';
    const result = isRegistration ? await sendVerificationCode() : await sendResetCode();
    setIsSubmitting(false);
    if (!result.ok) showError(isRegistration ? 'register' : 'forgot', result);
  };

  return {
    mode,
    title: TITLES[mode],
    submitLabel: SUBMIT_LABELS[mode],
    name,
    email,
    password,
    code,
    showPassword,
    isSubmitting,
    setName,
    setEmail,
    setPassword,
    setCode: (text) => setCode(text.replace(/\D/g, '').slice(0, 6)),
    toggleShowPassword: () => setShowPassword(!showPassword),
    toggleMode,
    goTo,
    editRegistration,
    handleSubmit,
    resendCode,
  };
};
