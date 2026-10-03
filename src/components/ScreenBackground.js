// src/components/ScreenBackground.js
// Fondo compartido de Finto (patrón de ondas) con zona segura para notch / barra de estado.
// Todas las pantallas lo usan para que la app se vea consistente.

import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

const backgroundImage = require('../assets/background-pattern.jpg');

export default function ScreenBackground({ children, edges = ['top'] }) {
  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.background, // Se ve mientras carga la imagen
  },
  safeArea: {
    flex: 1,
  },
});
