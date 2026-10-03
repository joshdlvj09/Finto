// src/components/BarChart.js
// Barras agrupadas de ingresos vs gastos por día (semana) o por semana (mes).
// Tocar una columna la selecciona y muestra sus montos arriba de la gráfica.

import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { EASE_OUT, isReduceMotion } from '../animations/motion';
import { formatMoney, formatMoneyShort } from '../utils/format';

const CHART_HEIGHT = 140;

// animationKey: al cambiar (por ejemplo, otro periodo) las barras vuelven a crecer desde la base
export default function BarChart({ buckets, selectedKey, onSelect, animationKey }) {
  const growth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReduceMotion()) {
      growth.setValue(1);
      return;
    }
    growth.setValue(0);
    Animated.timing(growth, { toValue: 1, duration: 750, easing: EASE_OUT, useNativeDriver: true }).start();
  }, [animationKey]);

  // Cada columna empieza un poco después que la anterior (efecto ola de izquierda a derecha)
  const columnGrowth = (i) => {
    const start = (i / Math.max(buckets.length, 1)) * 0.45;
    return growth.interpolate({
      inputRange: [start, start + 0.55],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const max = Math.max(...buckets.map((b) => Math.max(b.income, b.expenses)), 0);
  const selected = buckets.find((b) => b.key === selectedKey);

  // Altura proporcional; un valor pequeño pero mayor a cero sigue siendo visible
  const barHeight = (value) => {
    if (max === 0 || value === 0) return 0;
    return Math.max((value / max) * CHART_HEIGHT, 3);
  };

  return (
    <View>
      {/* Leyenda y detalle de la columna seleccionada */}
      <View style={styles.topRow}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: COLORS.chartIncome }]} />
            <Text style={styles.legendText}>Ingresos</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: COLORS.chartExpense }]} />
            <Text style={styles.legendText}>Gastos</Text>
          </View>
        </View>
        <Text style={styles.maxLabel}>máx {formatMoneyShort(max)}</Text>
      </View>

      <View style={styles.detailBox}>
        {selected ? (
          <>
            <Text style={styles.detailTitle}>{selected.detail}</Text>
            <Text style={styles.detailValues}>
              <Text style={{ color: COLORS.income }}>+{formatMoney(selected.income)}</Text>
              {'   '}
              <Text style={{ color: COLORS.expense }}>-{formatMoney(selected.expenses)}</Text>
            </Text>
          </>
        ) : (
          <Text style={styles.detailHint}>Toca una barra para ver el detalle</Text>
        )}
      </View>

      {/* Barras */}
      <View style={styles.plot}>
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: CHART_HEIGHT / 2 }]} />
        {buckets.map((bucket, i) => {
          const isSelected = bucket.key === selectedKey;
          const dimmed = selectedKey && !isSelected;
          return (
            <TouchableOpacity
              key={bucket.key}
              style={[styles.column, isSelected && styles.columnSelected]}
              onPress={() => onSelect(isSelected ? null : bucket.key)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.bars,
                  { opacity: dimmed ? 0.4 : 1, transform: [{ scaleY: columnGrowth(i) }] },
                ]}
              >
                <View
                  style={[
                    styles.bar,
                    { height: barHeight(bucket.income), backgroundColor: COLORS.chartIncome },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    { height: barHeight(bucket.expenses), backgroundColor: COLORS.chartExpense },
                  ]}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Línea base y etiquetas */}
      <View style={styles.baseline} />
      <View style={styles.labelsRow}>
        {buckets.map((bucket) => (
          <Text
            key={bucket.key}
            style={[styles.axisLabel, bucket.key === selectedKey && styles.axisLabelSelected]}
          >
            {bucket.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
  },
  maxLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  detailBox: {
    height: 44,
    justifyContent: 'center',
    marginVertical: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    textTransform: 'capitalize',
  },
  detailValues: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    marginTop: 2,
  },
  detailHint: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  plot: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.chartGrid,
  },
  column: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 8,
  },
  columnSelected: {
    backgroundColor: 'rgba(160, 127, 58, 0.10)',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    transformOrigin: 'bottom', // Las barras crecen desde la base
  },
  bar: {
    width: 9,
    marginHorizontal: 1, // 2px de separación entre barras vecinas
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  baseline: {
    height: 1,
    backgroundColor: 'rgba(227, 213, 187, 0.25)',
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textMuted,
  },
  axisLabelSelected: {
    color: COLORS.textPrimary,
    fontFamily: 'Montserrat-Bold',
  },
});
