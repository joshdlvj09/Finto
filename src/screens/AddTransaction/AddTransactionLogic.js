// src/screens/AddTransaction/AddTransactionLogic.js
// Lógica del formulario para registrar o editar un gasto o ingreso.
// Para registrar varios a la vez: "Agregar otro movimiento" pasa lo capturado a la lista
// "Por guardar" y limpia el formulario. Cada movimiento de la lista es independiente
// (tipo, monto, categoría, nota, factura y fecha) y al final se guardan todos juntos.

import { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TransactionContext } from '../../context/TransactionContext';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { formatDateLabel, isSameDay } from '../../utils/format';
import { animateLayout } from '../../animations/motion';

// Deja solo números y un punto decimal con máximo 2 decimales (acepta coma como decimal)
const sanitizeAmount = (text) => {
  const clean = text.replace(',', '.').replace(/[^0-9.]/g, '');
  const [integer, ...rest] = clean.split('.');
  if (rest.length === 0) return integer;
  return `${integer}.${rest.join('').slice(0, 2)}`;
};

const MAX_PENDING = 30; // Mismo límite que acepta el servidor por lote

let pendingCounter = 0;

const fitsType = (categoryId, type) =>
  DEFAULT_CATEGORIES.some(
    (cat) => cat.id === categoryId && (cat.type === type || cat.type === 'ambos')
  );

export const useAddTransactionLogic = () => {
  const { transactions, addTransaction, addTransactions, updateTransaction, deleteTransaction } =
    useContext(TransactionContext);
  const navigation = useNavigation();
  const route = useRoute();

  // Si llega editId desde Inicio, el formulario funciona en modo edición
  const editId = route.params?.editId;
  const editing = useMemo(
    () => transactions.find((tx) => tx._id === editId),
    [transactions, editId]
  );

  const [type, setType] = useState('gasto');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [invoice, setInvoice] = useState('no'); // 'no' | 'pendiente' | 'realizada' (solo gastos)
  const [pending, setPending] = useState([]);   // Lista "Por guardar"
  const [isSaving, setIsSaving] = useState(false);

  // Limpia lo de un movimiento. Tipo y fecha se conservan porque suelen repetirse.
  const clearCurrent = () => {
    setAmount('');
    setCategory(null);
    setDescription('');
    setInvoice('no');
  };

  const resetForm = () => {
    clearCurrent();
    setType('gasto');
    setDate(new Date());
  };

  // Cargar los datos del movimiento a editar
  useEffect(() => {
    if (!editing) return;
    setType(editing.type);
    setAmount(String(editing.amount));
    setCategory(editing.category);
    setDescription(editing.description || '');
    setDate(new Date(editing.date));
    setInvoice(editing.type === 'gasto' && editing.invoice ? editing.invoice : 'no');
  }, [editing]);

  // Al salir de la pantalla se cancela la edición y se limpia el formulario
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (route.params?.editId) {
        navigation.setParams({ editId: undefined });
        resetForm();
      }
    });
    return unsubscribe;
  }, [navigation, route.params?.editId]);

  // Solo las categorías que corresponden al tipo seleccionado
  const categories = useMemo(
    () => DEFAULT_CATEGORIES.filter((cat) => cat.type === type || cat.type === 'ambos'),
    [type]
  );

  // Al cambiar de tipo, se limpia la categoría si ya no aplica
  const changeType = (newType) => {
    if (newType === type) return;
    animateLayout();
    setType(newType);
    if (!fitsType(category, newType)) setCategory(null);
    if (newType !== 'gasto') setInvoice('no'); // La factura solo aplica a gastos
  };

  const changeAmount = (text) => setAmount(sanitizeAmount(text));

  const toggleInvoice = (needsInvoice) => {
    animateLayout();
    setInvoice(needsInvoice ? 'pendiente' : 'no');
  };

  // Mover la fecha un día atrás o adelante (sin pasar de hoy)
  const shiftDate = (days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    if (next > new Date()) return;
    setDate(next);
  };

  const canGoForward = !isSameDay(date, new Date());

  // ---- Movimiento actual del formulario ----
  const currentTx = () => ({
    type,
    amount,
    category,
    invoice: type === 'gasto' ? invoice : 'no',
    description: description.trim(),
    date: date.toISOString(),
  });

  // ¿El formulario tiene algo capturado?
  const formHasData = Boolean(amount || category || description.trim());

  // Misma validación que el Context, para avisar antes de pasar a la lista
  const validateCurrent = () => {
    if (!(Number(amount) > 0)) return 'Escribe un monto mayor a cero';
    if (!category) return 'Selecciona una categoría';
    return null;
  };

  // ---- Lista "Por guardar" ----
  const addToPending = () => {
    const error = validateCurrent();
    if (error) {
      Alert.alert('Revisa tu movimiento', error);
      return;
    }
    if (pending.length >= MAX_PENDING) {
      Alert.alert('Límite alcanzado', `Puedes guardar hasta ${MAX_PENDING} movimientos a la vez.`);
      return;
    }
    animateLayout();
    setPending((prev) => [...prev, { ...currentTx(), id: String(++pendingCounter) }]);
    clearCurrent();
  };

  const removePending = (id) => {
    animateLayout();
    setPending((prev) => prev.filter((tx) => tx.id !== id));
  };

  // Regresar un movimiento de la lista al formulario para corregirlo
  const editPending = (id) => {
    const tx = pending.find((item) => item.id === id);
    if (!tx) return;

    const load = () => {
      animateLayout();
      setPending((prev) => prev.filter((item) => item.id !== id));
      setType(tx.type);
      setAmount(String(tx.amount));
      setCategory(tx.category);
      setDescription(tx.description);
      setInvoice(tx.invoice);
      setDate(new Date(tx.date));
    };

    if (!formHasData) return load();

    Alert.alert('Tienes un movimiento a medias', '¿Qué hacemos con lo que está en el formulario?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Descartarlo', style: 'destructive', onPress: load },
      {
        text: 'Agregarlo a la lista',
        onPress: () => {
          const error = validateCurrent();
          if (error) {
            Alert.alert('Revisa tu movimiento', error);
            return;
          }
          setPending((prev) => [...prev, { ...currentTx(), id: String(++pendingCounter) }]);
          load();
        },
      },
    ]);
  };

  // Cuántos se guardarán con el botón principal
  const saveCount = pending.length + (formHasData ? 1 : 0);

  const finish = () => {
    Keyboard.dismiss();
    resetForm();
    // Al editar un movimiento ya guardado, la lista "Por guardar" se conserva
    if (!editing) setPending([]);
    navigation.setParams({ editId: undefined });
    navigation.navigate('Inicio');
  };

  const handleSave = async () => {
    if (isSaving) return;

    let result;
    if (editing) {
      setIsSaving(true);
      result = await updateTransaction(editing._id, currentTx());
    } else if (pending.length === 0) {
      setIsSaving(true);
      result = await addTransaction(currentTx());
    } else {
      // Lista + lo que haya en el formulario (si tiene algo, debe estar completo)
      if (formHasData) {
        const error = validateCurrent();
        if (error) {
          Alert.alert('Revisa el movimiento del formulario', `${error}, o déjalo vacío para guardar solo la lista.`);
          return;
        }
      }
      const items = [...pending, ...(formHasData ? [currentTx()] : [])].map(({ id, ...tx }) => tx);
      setIsSaving(true);
      result = await addTransactions(items);
    }
    setIsSaving(false);

    if (!result.ok) {
      Alert.alert('Revisa tu movimiento', result.error);
      return;
    }
    finish();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Eliminar movimiento', '¿Seguro que quieres eliminarlo? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setIsSaving(true);
          const result = await deleteTransaction(editing._id);
          setIsSaving(false);
          if (!result.ok) {
            Alert.alert('No se pudo eliminar', result.error);
            return;
          }
          finish();
        },
      },
    ]);
  };

  return {
    isEditing: Boolean(editing),
    isSaving,
    type,
    amount,
    category,
    description,
    invoice,
    categories,
    pending,
    saveCount,
    dateLabel: formatDateLabel(date),
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
    handleCancel: finish,
  };
};
