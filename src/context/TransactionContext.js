//Estado global de finanzas y transacciones para Finto
//Los movimientos viven en MongoDB (a traves de la API) y aqui se mantiene una copia en memoria

import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {api} from '../services/api';
import {AuthContext} from './AuthContext';

export const TransactionContext = createContext();

//Valida y normaliza los datos de una transaccion. Devuelve {error} o {data}
const validateTransaction = (tx) => {
    const amount = Number(tx.amount);
    if (!amount || amount <= 0) {
        return {error: 'El monto debe ser mayor a cero'};
    }
    if (!tx.category) {
        return {error: 'Selecciona una categoría para tu movimiento'};
    }
    //La factura solo aplica a gastos
    const invoice = tx.type === 'gasto' && ['pendiente', 'realizada'].includes(tx.invoice) ? tx.invoice : 'no';
    return {data: {...tx, amount, invoice, date: tx.date || new Date().toISOString()}};
};

export const TransactionProvider = ({children}) => {
    const {user} = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    //Descargar los movimientos del usuario actual
    const refresh = useCallback(async () => {
        try {
            const data = await api.getTransactions();
            setTransactions(data);
            setLoadError(null);
        } catch (error) {
            setLoadError(error.message);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    //Cada vez que cambia la sesion se limpian los datos y se cargan los del nuevo usuario
    useEffect(() => {
        setTransactions([]);
        setIsLoaded(false);
        setLoadError(null);
        if (user) refresh();
    }, [user, refresh]);

    //Totales: balance = ingresos - gastos
    const {totalIncome, totalExpenses} = useMemo(() => {
        return transactions.reduce(
            (acc, item) => {
                if (item.type === 'ingreso') acc.totalIncome += item.amount;
                else acc.totalExpenses += item.amount;
                return acc;
            },
            {totalIncome: 0, totalExpenses: 0}
        );
    }, [transactions]);

    //Agregar una nueva transaccion. Devuelve {ok, error} para que la pantalla decida que mostrar
    const addTransaction = async (newTx) => {
        const {error, data} = validateTransaction(newTx);
        if (error) return {ok: false, error};

        try {
            const saved = await api.createTransaction(data);
            setTransactions((prev) => [saved, ...prev]);
            return {ok: true};
        } catch (apiError) {
            return {ok: false, error: apiError.message};
        }
    };

    //Agregar varias transacciones a la vez (modo "Varios"): se guardan todas o ninguna
    const addTransactions = async (list) => {
        const items = [];
        for (let i = 0; i < list.length; i++) {
            const {error, data} = validateTransaction(list[i]);
            if (error) return {ok: false, error: list.length > 1 ? `Movimiento ${i + 1}: ${error}` : error};
            items.push(data);
        }

        try {
            const saved = await api.createTransactions(items);
            setTransactions((prev) => [...saved, ...prev]);
            return {ok: true, count: saved.length};
        } catch (apiError) {
            return {ok: false, error: apiError.message};
        }
    };

    //Actualizar una transaccion existente
    const updateTransaction = async (id, changes) => {
        const {error, data} = validateTransaction(changes);
        if (error) return {ok: false, error};

        try {
            const saved = await api.updateTransaction(id, data);
            setTransactions((prev) => prev.map((tx) => (tx._id === id ? saved : tx)));
            return {ok: true};
        } catch (apiError) {
            return {ok: false, error: apiError.message};
        }
    };

    //Eliminar una transaccion
    const deleteTransaction = async (id) => {
        try {
            await api.deleteTransaction(id);
            setTransactions((prev) => prev.filter((tx) => tx._id !== id));
            return {ok: true};
        } catch (apiError) {
            return {ok: false, error: apiError.message};
        }
    };

    //Restablecer datos: borrar todos los movimientos del usuario
    const deleteAllTransactions = async () => {
        try {
            await api.deleteAllTransactions();
            setTransactions([]);
            return {ok: true};
        } catch (apiError) {
            return {ok: false, error: apiError.message};
        }
    };

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                isLoaded,
                loadError,
                refresh,
                balance: totalIncome - totalExpenses,
                totalExpenses,
                totalIncome,
                addTransaction,
                addTransactions,
                updateTransaction,
                deleteTransaction,
                deleteAllTransactions,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
