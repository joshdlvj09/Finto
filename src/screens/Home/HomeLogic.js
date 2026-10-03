// src/screens/Home/HomeLogic.js
// Lógica para consumir el contexto global y preparar los datos de la pantalla Home

import { useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TransactionContext } from '../../context/TransactionContext';
import { AuthContext } from '../../context/AuthContext';

export const useHomeLogic = () => {
  // Extraemos los datos calculados en tiempo real desde el Contexto
  const { transactions, balance, totalExpenses, totalIncome, isLoaded, loadError, refresh } =
    useContext(TransactionContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  // Movimientos más recientes primero, según su fecha
  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions]
  );

  // Abrir un movimiento en el formulario para editarlo o eliminarlo
  const openTransaction = (id) => navigation.navigate('Nuevo', { editId: id });

  // Abrir el menú de usuario
  const openProfile = () => navigation.navigate('Perfil');

  const nameParts = user?.name?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || '';
  const initials = nameParts.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('');

  return {
    firstName,
    isLoaded,
    loadError,
    refresh,
    openProfile,
    initials,
    transactions: sortedTransactions,
    balance,
    totalExpenses,
    totalIncome,
    openTransaction,
  };
};
