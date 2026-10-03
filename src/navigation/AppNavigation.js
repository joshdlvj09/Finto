// src/navigation/AppNavigation.js
// Enrutador principal: login si no hay sesión; si la hay, Bottom Tabs + Perfil como hoja modal
// (paleta negro carbón y oro)

import React, { useContext, useEffect, useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import AddTransactionScreen from '../screens/AddTransaction/AddTransactionScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { SPRING, isReduceMotion } from '../animations/motion';

// Ícono de pestaña: al activarse crece un poco con un resorte suave
function TabIcon({ name, color, size, focused }) {
  const scale = useRef(new Animated.Value(focused ? 1.12 : 1)).current;

  useEffect(() => {
    const toValue = focused ? 1.12 : 1;
    if (isReduceMotion()) scale.setValue(toValue);
    else Animated.spring(scale, { toValue, ...SPRING }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

// Tema oscuro para que nunca se vea un fondo blanco/gris detrás de las pantallas al navegar
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    primary: COLORS.primary,
    text: COLORS.textPrimary,
    border: COLORS.border,
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,      // Icono activo: Gold
        tabBarInactiveTintColor: COLORS.textMuted,  // Icono inactivo: Gris tenue
        tabBarStyle: {
          backgroundColor: COLORS.card,             // Barra inferior en Charcoal
          borderTopColor: COLORS.border,            // Borde superior dorado sutil
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Montserrat-Regular',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Nuevo') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Métricas') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          }
          return <TabIcon name={iconName} size={size} color={color} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Nuevo" component={AddTransactionScreen} />
      <Tab.Screen name="Métricas" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { user, isRestoring } = useContext(AuthContext);

  // Revisando si había una sesión guardada
  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{ presentation: 'modal', contentStyle: { backgroundColor: COLORS.background } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
