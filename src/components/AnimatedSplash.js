// src/components/AnimatedSplash.js
// Animación de apertura de Finto (se dibuja encima de la app y luego desaparece)
//
// Línea de tiempo:
//   0.0s – 0.5s  Expansión: el fondo de ondas aparece desde negro y el isotipo "respira" (crece y regresa)
//   0.5s – 1.8s  El nombre "Finto" se despliega a la derecha del isotipo + destello en el oro
//   1.8s – 2.4s  Salida: zoom hacia adelante (100% -> 120%) mientras todo se desvanece
//   2.4s         Se avisa a la app (SplashContext) para que Inicio entre de forma escalonada

import React, { createContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS } from '../constants/theme';

// true cuando la animación terminó; las pantallas lo usan para animar su entrada
export const SplashContext = createContext(true);

const backgroundImage = require('../assets/background-pattern.jpg');
const logoMark = require('../assets/logo-mark.png');

// Mismo tamaño que el isotipo del splash nativo (app.json: imageWidth 160 -> isotipo de ~96px de alto)
const MARK_HEIGHT = 96;
const MARK_WIDTH = Math.round((MARK_HEIGHT * 730) / 886); // Proporción del isotipo
const TEXT_GAP = 14;

export default function AnimatedSplash({ onFinish }) {
  const [textWidth, setTextWidth] = useState(0);

  const background = useRef(new Animated.Value(0)).current; // Fondo de ondas (0 = negro)
  const markScale = useRef(new Animated.Value(1)).current;  // Empieza igual que el splash nativo
  const textReveal = useRef(new Animated.Value(0)).current; // 0 = oculto, 1 = visible
  const shine = useRef(new Animated.Value(0)).current;      // Destello sobre el oro
  const exit = useRef(new Animated.Value(0)).current;       // 0 = visible, 1 = desaparecido

  useEffect(() => {
    if (!textWidth) return; // Esperar a medir el texto para centrar bien el conjunto

    // El splash nativo (mismo fondo negro e isotipo) se oculta justo cuando empieza esta animación
    SplashScreen.hideAsync().catch(() => {});

    const smooth = Easing.bezier(0.42, 0, 0.58, 1); // ease-in-out

    Animated.sequence([
      // 0.0s – 0.5s
      Animated.parallel([
        Animated.timing(background, { toValue: 1, duration: 500, easing: smooth, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(markScale, {
            toValue: 1.08,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(markScale, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
        ]),
      ]),
      // 0.5s – 1.8s
      Animated.parallel([
        Animated.timing(textReveal, { toValue: 1, duration: 700, easing: smooth, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(450),
          Animated.timing(shine, { toValue: 1, duration: 350, easing: smooth, useNativeDriver: true }),
          Animated.timing(shine, { toValue: 0, duration: 500, easing: smooth, useNativeDriver: true }),
        ]),
      ]),
      // 1.8s – 2.4s
      Animated.timing(exit, { toValue: 1, duration: 600, easing: smooth, useNativeDriver: true }),
    ]).start(() => onFinish && onFinish());
  }, [textWidth]);

  // Mientras el texto está oculto, el isotipo queda centrado; luego se recorre a la izquierda
  const groupShift = textReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [(textWidth + TEXT_GAP) / 2, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.container, { opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}
    >
      {/* Fondo de ondas que aparece desde negro */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: background }]}>
        <ImageBackground source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>

      {/* Isotipo + nombre */}
      <Animated.View
        style={[
          styles.group,
          {
            transform: [
              { translateX: groupShift },
              { scale: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
            ],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: markScale }] }}>
          <Animated.Image source={logoMark} style={styles.mark} />
          {/* Destello: misma figura en oro claro encima, solo cambia su opacidad */}
          <Animated.Image
            source={logoMark}
            style={[styles.mark, styles.shine, { opacity: shine.interpolate({ inputRange: [0, 1], outputRange: [0, 0.75] }) }]}
          />
        </Animated.View>

        <Animated.Text
          onLayout={(e) => !textWidth && setTextWidth(e.nativeEvent.layout.width)}
          style={[
            styles.name,
            {
              opacity: textReveal,
              transform: [{ translateX: textReveal.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
            },
          ]}
        >
          Finto
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    width: MARK_WIDTH,
    height: MARK_HEIGHT,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: '#F6E3B0',
  },
  name: {
    marginLeft: TEXT_GAP,
    fontSize: 54,
    fontFamily: 'Poiret-One',
    color: COLORS.textPrimary,
  },
});

// Mantiene el splash nativo visible hasta que la animación esté lista
export const keepNativeSplash = () => SplashScreen.preventAutoHideAsync().catch(() => {});
