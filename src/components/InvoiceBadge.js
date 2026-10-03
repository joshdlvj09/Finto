// src/components/InvoiceBadge.js
// Etiqueta de factura (solo gastos que la necesitan). Lleva ícono y texto, no solo color.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function InvoiceBadge({ status, style }) {
  if (status !== 'pendiente' && status !== 'realizada') return null;
  const done = status === 'realizada';
  const color = done ? COLORS.income : COLORS.secondary;

  return (
    <View style={[styles.badge, done ? styles.done : styles.pending, style]}>
      <Ionicons name={done ? 'checkmark-circle' : 'time-outline'} size={11} color={color} />
      <Text style={[styles.text, { color }]}>{done ? 'Facturado' : 'Factura pendiente'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  pending: {
    borderColor: 'rgba(200, 170, 111, 0.45)',
    backgroundColor: 'rgba(200, 170, 111, 0.10)',
  },
  done: {
    borderColor: 'rgba(111, 191, 115, 0.40)',
    backgroundColor: 'rgba(111, 191, 115, 0.10)',
  },
  text: {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 4,
  },
});
