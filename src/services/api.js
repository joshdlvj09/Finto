// src/services/api.js
// Cliente para hablar con la API de Finto (carpeta /server)

import Constants from 'expo-constants';

const API_PORT = 4000;

// URL de la API:
// 1. Si existe EXPO_PUBLIC_API_URL (por ejemplo cuando la API esté publicada en internet), se usa esa.
// 2. En desarrollo se usa la IP de la computadora que corre Expo, así el celular la encuentra en la red local.
const resolveBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  const host = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
  return `http://${host}:${API_PORT}/api`;
};

export const API_URL = resolveBaseUrl();

let authToken = null;
let onUnauthorized = null;

export const setAuthToken = (token) => {
  authToken = token;
};

// El AuthContext registra aquí qué hacer cuando la sesión expira (cerrar sesión)
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code; // Ej. 'ACCOUNT_NOT_FOUND', 'ACCOUNT_EXISTS', 'WRONG_PASSWORD'
  }
}

const request = async (path, { method = 'GET', body } = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'x-auth-token': authToken } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión.', 0);
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && authToken && onUnauthorized) onUnauthorized();
    throw new ApiError(data.msg || 'Ocurrió un error inesperado', response.status, data.code);
  }
  return data;
};

export const api = {
  // Registro en dos pasos: enviar código al correo y luego verificarlo
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),
  verifyRegistration: (email, code) =>
    request('/auth/register/verify', { method: 'POST', body: { email, code } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/password', { method: 'PUT', body: { currentPassword, newPassword } }),
  deleteAccount: (password) => request('/auth/me', { method: 'DELETE', body: { password } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (email, code, password) =>
    request('/auth/reset-password', { method: 'POST', body: { email, code, password } }),

  getTransactions: () => request('/transactions'),
  createTransaction: (tx) => request('/transactions', { method: 'POST', body: tx }),
  createTransactions: (items) => request('/transactions/bulk', { method: 'POST', body: { items } }),
  updateTransaction: (id, tx) => request(`/transactions/${id}`, { method: 'PUT', body: tx }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  deleteAllTransactions: () => request('/transactions', { method: 'DELETE' }),
};
