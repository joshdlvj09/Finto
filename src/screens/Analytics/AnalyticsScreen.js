// src/screens/Analytics/AnalyticsScreen.js
// Resúmenes semanales / mensuales con gráficas de tendencia y de categorías

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AnalyticsStyles';
import { useAnalyticsLogic } from './AnalyticsLogic';
import { COLORS } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';
import { formatMoney } from '../../utils/format';
import DonutChart from '../../components/DonutChart';
import BarChart from '../../components/BarChart';
import SegmentedControl from '../../components/SegmentedControl';
import AnimatedNumber from '../../components/AnimatedNumber';
import { useStaggeredFadeIn } from '../../hooks/useStaggeredFadeIn';

const signedMoney = (value) => `${value < 0 ? '-' : ''}${formatMoney(value)}`;

export default function AnalyticsScreen() {
  const {
    mode,
    offset,
    canGoForward,
    breakdownType,
    selectedCategory,
    selectedItem,
    selectedBucket,
    periodLabel,
    totals,
    expenseChange,
    dailyAverage,
    topCategory,
    movementsCount,
    breakdown,
    buckets,
    changeMode,
    shiftPeriod,
    changeBreakdownType,
    toggleCategory,
    setSelectedBucket,
  } = useAnalyticsLogic();

  const periodWord = mode === 'semana' ? 'la semana' : 'el mes';
  const breakdownTotal = breakdownType === 'gasto' ? totals.expenses : totals.income;
  const periodKey = `${mode}${offset}`; // Las gráficas se vuelven a animar al cambiar de periodo

  // Entrada escalonada: encabezado, controles, resumen, datos rápidos y gráficas
  const enter = useStaggeredFadeIn(5);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, enter(0)]}>
          <Text style={styles.subtitle}>Resumen financiero</Text>
          <Text style={styles.title}>Métricas</Text>
        </Animated.View>

        {/* Semana / Mes */}
        <Animated.View style={enter(1)}>
          <SegmentedControl
            options={[
              { value: 'semana', label: 'Semanal' },
              { value: 'mes', label: 'Mensual' },
            ]}
            value={mode}
            onChange={changeMode}
          />

          {/* Navegación de periodos */}
          <View style={styles.periodRow}>
            <TouchableOpacity style={styles.periodArrow} onPress={() => shiftPeriod(-1)}>
              <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.periodLabel}>{periodLabel}</Text>
            <TouchableOpacity
              style={styles.periodArrow}
              onPress={() => shiftPeriod(1)}
              disabled={!canGoForward}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={canGoForward ? COLORS.primary : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Resumen del periodo */}
        <Animated.View style={[styles.card, enter(2)]}>
          <Text style={styles.cardLabel}>Balance del periodo</Text>
          <AnimatedNumber value={totals.balance} format={signedMoney} style={styles.balance} />

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Ingresos</Text>
              <AnimatedNumber
                value={totals.income}
                format={(v) => `+${formatMoney(v)}`}
                style={[styles.statValue, { color: COLORS.income }]}
              />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Gastos</Text>
              <AnimatedNumber
                value={totals.expenses}
                format={(v) => `-${formatMoney(v)}`}
                style={[styles.statValue, { color: COLORS.expense }]}
              />
            </View>
          </View>

          {expenseChange !== null && (
            <View style={styles.insightRow}>
              <Ionicons
                name={expenseChange > 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={expenseChange > 0 ? COLORS.expense : COLORS.income}
              />
              <Text style={styles.insightText}>
                {Math.abs(expenseChange) < 0.5
                  ? `Gastaste lo mismo que ${periodWord} anterior`
                  : `Gastaste ${Math.abs(expenseChange).toFixed(0)}% ${
                      expenseChange > 0 ? 'más' : 'menos'
                    } que ${periodWord} anterior`}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Datos rápidos */}
        <Animated.View style={[styles.tilesRow, enter(3)]}>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Promedio diario</Text>
            <Text style={styles.tileValue}>{formatMoney(dailyAverage)}</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Mayor gasto</Text>
            <Text style={styles.tileValue} numberOfLines={1}>
              {topCategory ? topCategory.label : '—'}
            </Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Movimientos</Text>
            <Text style={styles.tileValue}>{movementsCount}</Text>
          </View>
        </Animated.View>

        <Animated.View style={enter(4)}>
          {movementsCount === 0 ? (
            <View style={[styles.card, styles.emptyCard]}>
              <Ionicons name="bar-chart-outline" size={34} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Sin movimientos en este periodo</Text>
              <Text style={styles.emptyHint}>Registra gastos o ingresos para ver tus gráficas</Text>
            </View>
          ) : (
            <>
              {/* Tendencia */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {mode === 'semana' ? 'Día por día' : 'Semana por semana'}
                </Text>
                <BarChart
                  buckets={buckets}
                  selectedKey={selectedBucket}
                  onSelect={setSelectedBucket}
                  animationKey={periodKey}
                />
              </View>

              {/* Por categoría */}
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>Por categoría</Text>
                  <SegmentedControl
                    small
                    options={[
                      { value: 'gasto', label: 'Gastos' },
                      { value: 'ingreso', label: 'Ingresos' },
                    ]}
                    value={breakdownType}
                    onChange={changeBreakdownType}
                  />
                </View>

                {breakdown.length === 0 ? (
                  <Text style={styles.emptyHint}>
                    No hay {breakdownType === 'gasto' ? 'gastos' : 'ingresos'} en este periodo
                  </Text>
                ) : (
                  <>
                    <View style={styles.donutWrapper}>
                      <DonutChart
                        data={breakdown}
                        selectedId={selectedCategory}
                        onSelect={toggleCategory}
                        centerTitle={selectedItem ? selectedItem.label : 'Total'}
                        centerValue={formatMoney(selectedItem ? selectedItem.amount : breakdownTotal)}
                        animationKey={`${periodKey}${breakdownType}`}
                      />
                    </View>

                    {/* Leyenda con montos y porcentajes */}
                    {breakdown.map((item) => {
                      const active = selectedCategory === item.id;
                      const dimmed = selectedCategory && !active;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.legendRow, active && styles.legendRowActive]}
                          onPress={() => toggleCategory(item.id)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.legendLeft, { opacity: dimmed ? 0.5 : 1 }]}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Ionicons name={item.icon} size={16} color={COLORS.secondary} />
                            <Text style={styles.legendLabel}>{item.label}</Text>
                          </View>
                          <View style={[styles.legendRight, { opacity: dimmed ? 0.5 : 1 }]}>
                            <Text style={styles.legendAmount}>{formatMoney(item.amount)}</Text>
                            <Text style={styles.legendPercent}>{item.percent.toFixed(0)}%</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}
