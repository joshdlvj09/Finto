// src/screens/Home/HomeScreen.js
// Estructura visual de la pantalla principal

import React from 'react';
import { View, Text, Image, Animated, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeStyles';
import { useHomeLogic } from './HomeLogic';
import { getCategoryById } from '../../constants/categories';
import { COLORS } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';
import { formatMoney, formatDateLabel } from '../../utils/format';
import { useStaggeredFadeIn } from '../../hooks/useStaggeredFadeIn';
import PressableScale from '../../components/PressableScale';
import AnimatedNumber from '../../components/AnimatedNumber';
import AnimatedListItem from '../../components/AnimatedListItem';
import InvoiceBadge from '../../components/InvoiceBadge';

const logoMark = require('../../assets/logo-mark.png');

export default function HomeScreen() {
  const {
    firstName,
    isLoaded,
    loadError,
    refresh,
    openProfile,
    initials,
    transactions,
    balance,
    totalExpenses,
    totalIncome,
    openTransaction,
  } = useHomeLogic();

  // Entrada escalonada: encabezado, balance y lista
  const enter = useStaggeredFadeIn(3);

  return (
    <ScreenBackground>
      <View style={styles.container}>

        {/* Header con logo */}
        <Animated.View style={[styles.header, enter(0)]}>
          <View style={styles.brandRow}>
            <Image source={logoMark} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.welcomeText}>Hola, {firstName}</Text>
              <Text style={styles.appName}>Finto</Text>
            </View>
          </View>
          <PressableScale
            style={styles.avatarButton}
            onPress={openProfile}
            hitSlop={10}
            scaleTo={0.9}
            accessibilityLabel="Abrir perfil"
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </PressableScale>
        </Animated.View>

        {/* Tarjeta de Balance */}
        <Animated.View style={[styles.balanceCard, enter(1)]}>
          <Text style={styles.balanceTitle}>Balance Total</Text>
          <AnimatedNumber
            value={balance}
            format={(v) => `${v < 0 ? '-' : ''}${formatMoney(v)}`}
            style={styles.balanceAmount}
          />

          <View style={styles.rowStats}>
            <View>
              <Text style={styles.statLabel}>Ingresos</Text>
              <AnimatedNumber
                value={totalIncome}
                format={(v) => `+${formatMoney(v)}`}
                style={styles.statIncome}
              />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Gastos</Text>
              <AnimatedNumber
                value={totalExpenses}
                format={(v) => `-${formatMoney(v)}`}
                style={styles.statExpense}
              />
            </View>
          </View>
        </Animated.View>

        {/* Lista de Movimientos */}
        <Animated.View style={[{ flex: 1 }, enter(2)]}>
          <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={false}
            onRefresh={refresh}
            ListEmptyComponent={
              !isLoaded ? (
                <ActivityIndicator style={{ marginTop: 30 }} color={COLORS.primary} />
              ) : loadError ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="cloud-offline-outline" size={34} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>{loadError}</Text>
                  <TouchableOpacity onPress={refresh}>
                    <Text style={styles.retryText}>Reintentar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyBox}>
                  <Ionicons name="receipt-outline" size={34} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>Aún no tienes movimientos registrados</Text>
                  <Text style={styles.emptyHint}>Toca "Nuevo" para agregar tu primer gasto o ingreso</Text>
                </View>
              )
            }
            renderItem={({ item, index }) => {
              const category = getCategoryById(item.category);
              return (
                <AnimatedListItem index={index}>
                  <PressableScale style={styles.transactionCard} onPress={() => openTransaction(item._id)}>
                    <View style={styles.transInfo}>
                      <View style={styles.iconCircle}>
                        <Ionicons name={category.icon} size={18} color={COLORS.primary} />
                      </View>
                      <View style={{ flexShrink: 1 }}>
                        <Text style={styles.transDesc} numberOfLines={1}>
                          {item.description || category.label}
                        </Text>
                        <Text style={styles.transSub}>
                          {category.label} · {formatDateLabel(new Date(item.date))}
                        </Text>
                        {item.type === 'gasto' && <InvoiceBadge status={item.invoice} />}
                      </View>
                    </View>
                    <Text style={item.type === 'ingreso' ? styles.incomeText : styles.expenseText}>
                      {item.type === 'ingreso' ? '+' : '-'}{formatMoney(item.amount)}
                    </Text>
                  </PressableScale>
                </AnimatedListItem>
              );
            }}
          />
        </Animated.View>

      </View>
    </ScreenBackground>
  );
}
