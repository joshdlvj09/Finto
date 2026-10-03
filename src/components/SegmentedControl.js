// src/components/SegmentedControl.js
// Selector de opciones con un indicador que se desliza hacia la opción activa.
// Cada opción puede tener su propio color de fondo y de texto al estar activa.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { SPRING, isReduceMotion } from '../animations/motion';

const DEFAULT_ACTIVE_BG = 'rgba(160, 127, 58, 0.22)';

export default function SegmentedControl({ options, value, onChange, small, style }) {
  const [width, setWidth] = useState(0);
  const index = Math.max(options.findIndex((opt) => opt.value === value), 0);
  const position = useRef(new Animated.Value(index)).current;
  const padding = small ? 3 : 4;
  const segmentWidth = width ? (width - padding * 2) / options.length : 0;

  useEffect(() => {
    if (isReduceMotion()) position.setValue(index);
    else Animated.spring(position, { toValue: index, ...SPRING }).start();
  }, [index]);

  const active = options[index];

  return (
    <View
      style={[styles.container, small && styles.containerSmall, { padding }, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              top: padding,
              bottom: padding,
              left: padding,
              width: segmentWidth,
              backgroundColor: active.activeBackground || DEFAULT_ACTIVE_BG,
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [0, Math.max(options.length - 1, 1)],
                    outputRange: [0, segmentWidth * Math.max(options.length - 1, 1)],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.segment, small && styles.segmentSmall]}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.text,
                small && styles.textSmall,
                isActive && { color: opt.activeColor || COLORS.textPrimary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardTranslucent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerSmall: {
    borderRadius: 10,
    width: 180, // Ancho fijo para que las opciones midan lo mismo
  },
  indicator: {
    position: 'absolute',
    borderRadius: 9,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentSmall: {
    paddingVertical: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textMuted,
  },
  textSmall: {
    fontSize: 13,
  },
});
