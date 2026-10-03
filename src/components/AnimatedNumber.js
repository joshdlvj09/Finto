// src/components/AnimatedNumber.js
// Muestra un monto que "cuenta" suavemente desde el valor anterior hasta el nuevo.
// Solo actualiza un <Text> durante ~0.6s, así que el costo es mínimo.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { EASE_OUT, isReduceMotion } from '../animations/motion';

export default function AnimatedNumber({ value, format, style, duration = 650 }) {
  const animated = useRef(new Animated.Value(value)).current;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (isReduceMotion()) {
      animated.setValue(value);
      setDisplay(value);
      return;
    }

    const id = animated.addListener(({ value: current }) => setDisplay(current));
    Animated.timing(animated, {
      toValue: value,
      duration,
      easing: EASE_OUT,
      useNativeDriver: false, // Necesita leer el valor en JS para escribir el texto
    }).start(() => setDisplay(value));

    return () => animated.removeListener(id);
  }, [value]);

  return <Text style={style}>{format(display)}</Text>;
}
