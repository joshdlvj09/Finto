// src/components/AnimatedListItem.js
// Fila de lista que aparece deslizándose desde abajo al montarse.
// Las primeras filas entran escalonadas; las demás (al hacer scroll) entran sin retraso.

import React, { useContext, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { DURATION, EASE_OUT, isReduceMotion } from '../animations/motion';
import { SplashContext } from './AnimatedSplash';

const MAX_STAGGERED = 8; // Más allá de esto el retraso ya no se nota y solo hace esperar

export default function AnimatedListItem({ index = 0, children, style }) {
  const splashFinished = useContext(SplashContext);
  const progress = useRef(new Animated.Value(isReduceMotion() ? 1 : 0)).current;

  // Espera a que termine la animación de apertura para que la entrada sí se vea
  useEffect(() => {
    if (isReduceMotion() || !splashFinished) return;
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION.slow,
      delay: index < MAX_STAGGERED ? index * 45 : 0,
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start();
  }, [splashFinished]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
