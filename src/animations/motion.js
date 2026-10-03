// src/animations/motion.js
// Sistema de movimiento de Finto: curvas, duraciones y resortes compartidos por toda la app.
// Todas las animaciones usan el driver nativo (corren fuera del hilo de JS, a 60 fps).

import { useEffect, useState } from 'react';
import { AccessibilityInfo, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';

export const EASE = Easing.bezier(0.42, 0, 0.58, 1);     // ease-in-out (entradas y salidas)
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);   // desaceleración suave (elementos que llegan)

export const DURATION = {
  fast: 160,   // Respuesta al toque
  normal: 280, // Cambios de estado
  slow: 450,   // Entradas de pantalla
};

// Resorte para toques y selecciones: rápido, sin rebote exagerado
export const SPRING = { speed: 28, bounciness: 6, useNativeDriver: true };

// LayoutAnimation en Android (arquitectura antigua) necesita activarse una vez
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// "Reducir movimiento" del sistema (iOS y Android)
let reduceMotion = false;
const listeners = new Set();

AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
  reduceMotion = Boolean(value);
  listeners.forEach((fn) => fn(reduceMotion));
});
AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value) => {
  reduceMotion = Boolean(value);
  listeners.forEach((fn) => fn(reduceMotion));
});

export const isReduceMotion = () => reduceMotion;

export const useReducedMotion = () => {
  const [value, setValue] = useState(reduceMotion);
  useEffect(() => {
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);
  return value;
};

// Anima el siguiente cambio de layout (aparecer / desaparecer / cambiar de tamaño).
// Se llama justo antes del setState que cambia lo que se muestra.
export const animateLayout = () => {
  if (reduceMotion) return;
  LayoutAnimation.configureNext({
    duration: DURATION.normal,
    create: { type: 'easeInEaseOut', property: 'opacity' },
    update: { type: 'easeInEaseOut' },
    delete: { type: 'easeInEaseOut', property: 'opacity' },
  });
};
