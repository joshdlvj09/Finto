// src/components/DonutChart.js
// Gráfica de dona: cada segmento es una categoría con su color fijo.
// Tocar un segmento lo selecciona y el centro muestra su detalle.

import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../constants/theme';
import { EASE_OUT, isReduceMotion } from '../animations/motion';

const GAP = 2; // Separación entre segmentos para distinguirlos sin depender del color

export default function DonutChart({
  data,
  size = 190,
  strokeWidth = 22,
  selectedId,
  onSelect,
  centerTitle,
  centerValue,
  animationKey, // Al cambiar, la dona vuelve a entrar con un giro suave
}) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReduceMotion()) {
      entrance.setValue(1);
      return;
    }
    entrance.setValue(0);
    Animated.timing(entrance, { toValue: 1, duration: 700, easing: EASE_OUT, useNativeDriver: true }).start();
  }, [animationKey]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((acc, item) => acc + item.amount, 0);
  const useGap = data.length > 1;

  let offset = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={{
          opacity: entrance,
          transform: [
            { rotate: entrance.interpolate({ inputRange: [0, 1], outputRange: ['-45deg', '0deg'] }) },
            { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        }}
      >
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            {/* Pista de fondo */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={COLORS.chartGrid}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {total > 0 &&
              data.map((item) => {
                const length = (item.amount / total) * circumference;
                const visible = Math.max(length - (useGap ? GAP : 0), 0.5);
                const dimmed = selectedId && selectedId !== item.id;
                const segment = (
                  <Circle
                    key={item.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={item.color}
                    strokeOpacity={dimmed ? 0.3 : 1}
                    strokeWidth={selectedId === item.id ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={`${visible} ${circumference - visible}`}
                    strokeDashoffset={-offset}
                    fill="none"
                    onPress={() => onSelect && onSelect(item.id)}
                  />
                );
                offset += length;
                return segment;
              })}
          </G>
        </Svg>
      </Animated.View>

      {/* Texto central */}
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        <Text style={styles.centerTitle} numberOfLines={1}>{centerTitle}</Text>
        <Text style={styles.centerValue} numberOfLines={1} adjustsFontSizeToFit>
          {centerValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  centerTitle: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  centerValue: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
