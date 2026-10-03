// src/screens/AddTransaction/AddTransactionScreen.js
// Formulario para registrar o editar un gasto o ingreso.
// Con "Agregar otro movimiento" se arma una lista "Por guardar" y se guardan todos juntos.

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AddTransactionStyles';
import { useAddTransactionLogic } from './AddTransactionLogic';
import { COLORS } from '../../constants/theme';
import { getCategoryById } from '../../constants/categories';
import ScreenBackground from '../../components/ScreenBackground';
import SegmentedControl from '../../components/SegmentedControl';
import PressableScale from '../../components/PressableScale';
import InvoiceBadge from '../../components/InvoiceBadge';
import { useStaggeredFadeIn } from '../../hooks/useStaggeredFadeIn';
import { formatMoney, formatDateLabel } from '../../utils/format';

// Movimiento de la lista "Por guardar": tocarlo lo regresa al formulario, la ✕ lo quita
const PendingItem = ({ tx, onEdit, onRemove }) => {
  const category = getCategoryById(tx.category);
  const isIncome = tx.type === 'ingreso';
  return (
    <PressableScale style={styles.pendingItem} onPress={onEdit} accessibilityLabel="Editar movimiento">
      <View style={styles.pendingIcon}>
        <Ionicons name={category.icon} size={16} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pendingTitle} numberOfLines={1}>
          {tx.description || category.label}
        </Text>
        <Text style={styles.pendingSub}>
          {category.label} · {formatDateLabel(new Date(tx.date))}
        </Text>
        {tx.type === 'gasto' && <InvoiceBadge status={tx.invoice} />}
      </View>
      <Text style={[styles.pendingAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
        {isIncome ? '+' : '-'}
        {formatMoney(Number(tx.amount))}
      </Text>
      <TouchableOpacity onPress={onRemove} hitSlop={10} accessibilityLabel="Quitar de la lista">
        <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    </PressableScale>
  );
};

export default function AddTransactionScreen() {
  const {
    isEditing,
    isSaving,
    type,
    amount,
    category,
    description,
    invoice,
    categories,
    pending,
    saveCount,
    dateLabel,
    canGoForward,
    changeType,
    changeAmount,
    setCategory,
    setDescription,
    shiftDate,
    toggleInvoice,
    setInvoice,
    addToPending,
    removePending,
    editPending,
    handleSave,
    handleDelete,
    handleCancel,
  } = useAddTransactionLogic();

  const isExpense = type === 'gasto';
  const needsInvoice = invoice !== 'no';
  const hasPending = pending.length > 0 && !isEditing;

  const saveLabel = isEditing
    ? 'Guardar cambios'
    : hasPending
      ? `Guardar ${saveCount} ${saveCount === 1 ? 'movimiento' : 'movimientos'}`
      : `Guardar ${isExpense ? 'gasto' : 'ingreso'}`;

  // Entrada escalonada: encabezado, tipo y monto, categorías, resto del formulario
  const enter = useStaggeredFadeIn(4);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[styles.header, enter(0)]}>
            <View>
              <Text style={styles.subtitle}>
                {isEditing ? 'Modificar movimiento' : 'Registrar movimiento'}
              </Text>
              <Text style={styles.title}>{isEditing ? 'Editar' : 'Nuevo'}</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View style={enter(1)}>
            {/* Selector Gasto / Ingreso */}
            <SegmentedControl
              style={styles.typeSelector}
              options={[
                {
                  value: 'gasto',
                  label: 'Gasto',
                  activeColor: COLORS.expense,
                  activeBackground: 'rgba(224, 106, 95, 0.18)',
                },
                {
                  value: 'ingreso',
                  label: 'Ingreso',
                  activeColor: COLORS.income,
                  activeBackground: 'rgba(111, 191, 115, 0.18)',
                },
              ]}
              value={type}
              onChange={changeType}
            />

            {/* Monto */}
            <View style={styles.amountCard}>
              <Text style={styles.label}>Monto</Text>
              <View style={styles.amountRow}>
                <Text style={[styles.currency, { color: isExpense ? COLORS.expense : COLORS.income }]}>
                  $
                </Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={changeAmount}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </Animated.View>

          {/* Categorías */}
          <Animated.View style={enter(2)}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const selected = cat.id === category;
                return (
                  <View key={cat.id} style={styles.categoryItem}>
                    <PressableScale
                      style={[styles.categoryInner, selected && styles.categoryInnerActive]}
                      onPress={() => setCategory(cat.id)}
                      scaleTo={0.92}
                      accessibilityLabel={cat.label}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={22}
                        color={selected ? COLORS.primary : COLORS.textMuted}
                      />
                      <Text style={[styles.categoryLabel, selected && styles.categoryLabelActive]}>
                        {cat.label}
                      </Text>
                    </PressableScale>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View style={enter(3)}>
            {/* Descripción */}
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej. Tacos con amigos"
              placeholderTextColor={COLORS.textMuted}
              maxLength={60}
            />

            {/* Factura (solo gastos) */}
            {isExpense && (
              <View style={styles.invoiceCard}>
                <View style={styles.invoiceRow}>
                  <Ionicons name="receipt-outline" size={20} color={COLORS.secondary} />
                  <Text style={styles.invoiceLabel}>¿Necesitarás factura de este gasto?</Text>
                  <Switch
                    value={needsInvoice}
                    onValueChange={toggleInvoice}
                    trackColor={{ false: '#3A3A3A', true: COLORS.primary }}
                    thumbColor={COLORS.textPrimary}
                    ios_backgroundColor="#3A3A3A"
                    accessibilityLabel="Necesita factura"
                  />
                </View>
                {needsInvoice && (
                  <SegmentedControl
                    style={styles.invoiceStatus}
                    options={[
                      { value: 'pendiente', label: 'Pendiente', activeColor: COLORS.secondary },
                      {
                        value: 'realizada',
                        label: 'Ya realizada',
                        activeColor: COLORS.income,
                        activeBackground: 'rgba(111, 191, 115, 0.18)',
                      },
                    ]}
                    value={invoice}
                    onChange={setInvoice}
                  />
                )}
              </View>
            )}

            {/* Fecha */}
            <Text style={styles.label}>Fecha</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateArrow} onPress={() => shiftDate(-1)}>
                <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{dateLabel}</Text>
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => shiftDate(1)}
                disabled={!canGoForward}
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={canGoForward ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Agregar otro: pasa este movimiento a la lista y limpia el formulario */}
            {!isEditing && (
              <PressableScale style={styles.addAnotherButton} onPress={addToPending}>
                <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.addAnotherText}>Agregar otro movimiento</Text>
              </PressableScale>
            )}

            {/* Lista "Por guardar" */}
            {hasPending && (
              <View style={styles.pendingCard}>
                <Text style={styles.label}>Por guardar ({pending.length})</Text>
                {pending.map((tx) => (
                  <PendingItem
                    key={tx.id}
                    tx={tx}
                    onEdit={() => editPending(tx.id)}
                    onRemove={() => removePending(tx.id)}
                  />
                ))}
                <Text style={styles.pendingHint}>
                  Toca un movimiento para corregirlo. Lo que esté en el formulario también se guarda.
                </Text>
              </View>
            )}

            {/* Guardar */}
            <PressableScale
              style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.saveButtonText}>{saveLabel}</Text>
              )}
            </PressableScale>

            {isEditing && (
              <PressableScale style={styles.deleteButton} onPress={handleDelete} disabled={isSaving}>
                <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
                <Text style={styles.deleteButtonText}>Eliminar movimiento</Text>
              </PressableScale>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
