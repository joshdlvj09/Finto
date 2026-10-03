// Estado de la sesión: usuario actual, registro, inicio y cierre de sesión

import React, { createContext, useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, setAuthToken, setUnauthorizedHandler } from '../services/api';

export const AuthContext = createContext();

const TOKEN_KEY = 'finto_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true); // Revisando si había una sesión guardada

  const startSession = async ({ token, user: newUser }) => {
    setAuthToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setUser(newUser);
  };

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
  }, []);

  // Al abrir la app: si hay token guardado, se valida con el servidor
  useEffect(() => {
    setUnauthorizedHandler(logout);

    const restore = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return;
        setAuthToken(token);
        const { user: savedUser } = await api.me();
        setUser(savedUser);
      } catch (error) {
        // Token inválido o expirado: se borra. Sin conexión: se pide iniciar sesión de nuevo
        if (error.status === 401) await logout();
        else setAuthToken(null);
      } finally {
        setIsRestoring(false);
      }
    };
    restore();
  }, [logout]);

  // Devuelven {ok, error} para que la pantalla decida qué mostrar
  const login = async (email, password) => {
    try {
      await startSession(await api.login(email.trim(), password));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Paso 1 del registro: el servidor envía un código al correo (la cuenta aún no existe)
  const register = async (name, email, password) => {
    try {
      const { msg } = await api.register(name.trim(), email.trim(), password);
      return { ok: true, message: msg };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Paso 2 del registro: con el código correcto se crea la cuenta y se inicia sesión
  const verifyRegistration = async (email, code) => {
    try {
      await startSession(await api.verifyRegistration(email.trim(), code.trim()));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Envía un código de 6 dígitos al correo para restablecer la contraseña
  const requestPasswordReset = async (email) => {
    try {
      const { msg } = await api.forgotPassword(email.trim());
      return { ok: true, message: msg };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Cambia la contraseña con el código y deja la sesión iniciada
  const resetPassword = async (email, code, password) => {
    try {
      await startSession(await api.resetPassword(email.trim(), code.trim(), password));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Cambiar contraseña conociendo la actual. El servidor cierra las demás sesiones y devuelve
  // un token nuevo para que este dispositivo siga conectado
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { token } = await api.changePassword(currentPassword, newPassword);
      setAuthToken(token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  // Eliminar la cuenta y todos sus datos; después se cierra la sesión
  const deleteAccount = async (password) => {
    try {
      await api.deleteAccount(password);
      await logout();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, code: error.code };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isRestoring,
        login,
        register,
        verifyRegistration,
        logout,
        requestPasswordReset,
        resetPassword,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
