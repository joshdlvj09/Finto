// App.js
// Punto de entrada: carga fuentes, muestra la animación de apertura y envuelve la app
// con la sesión (Auth) y los movimientos

import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PoiretOne_400Regular } from '@expo-google-fonts/poiret-one';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

import AppNavigation from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionProvider } from './src/context/TransactionContext';
import AnimatedSplash, { SplashContext, keepNativeSplash } from './src/components/AnimatedSplash';
import { COLORS } from './src/constants/theme';

// El splash nativo (fondo negro + isotipo) se queda visible hasta que arranque la animación
keepNativeSplash();

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [fontsLoaded] = useFonts({
    'Poiret-One': PoiretOne_400Regular,
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  // Mientras cargan las fuentes el splash nativo cubre la pantalla
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionProvider>
          <SplashContext.Provider value={splashFinished}>
            <StatusBar style="light" />
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
              {/* La app se monta detrás del splash para que ya esté lista cuando este desaparezca */}
              <AppNavigation />
              {!splashFinished && <AnimatedSplash onFinish={() => setSplashFinished(true)} />}
            </View>
          </SplashContext.Provider>
        </TransactionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
