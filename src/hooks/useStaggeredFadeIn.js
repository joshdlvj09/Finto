// src/hooks/useStaggeredFadeIn.js
// Entrada escalonada (Staggered Fade In): cada bloque aparece y sube un poco, uno tras otro.
// Arranca cuando termina la animación de apertura (SplashContext). Solo ocurre la primera vez
// que la pantalla se monta, para no repetirse cada vez que se cambia de pestaña.

import { useContext, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { SplashContext } from '../components/AnimatedSplash';
import { DURATION, EASE_OUT, isReduceMotion } from '../animations/motion';

export const useStaggeredFadeIn = (count, { delay = 90, duration = DURATION.slow } = {}) => {
  const splashFinished = useContext(SplashContext);
  const values = useRef(Array.from({ length: count }, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (!splashFinished) return;
    if (isReduceMotion()) {
      values.forEach((value) => value.setValue(1));
      return;
    }
    Animated.stagger(
      delay,
      values.map((value) =>
        Animated.timing(value, { toValue: 1, duration, easing: EASE_OUT, useNativeDriver: true })
      )
    ).start();
  }, [splashFinished]);

  // Estilo animado para el bloque número i
  return (i) => ({
    opacity: values[i],
    transform: [{ translateY: values[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });
};
