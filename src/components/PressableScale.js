// src/components/PressableScale.js
// Botón con respuesta táctil: se encoge ligeramente al presionar y regresa con un resorte suave.
// Reemplaza a TouchableOpacity en botones y tarjetas tocables.

import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { SPRING, isReduceMotion } from '../animations/motion';

export default function PressableScale({
  children,
  style,
  onPress,
  disabled,
  scaleTo = 0.97,
  hitSlop,
  accessibilityLabel,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) => {
    if (isReduceMotion()) return;
    Animated.spring(scale, { toValue, ...SPRING }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
