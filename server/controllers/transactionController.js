// =======================================================
// CONTROLADOR DE MOVIMIENTOS
// Cada usuario solo puede ver y modificar sus propios movimientos
// =======================================================

const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const MAX_POR_LOTE = 30;

// Toma solo los campos permitidos del body
const leerCampos = (body) => ({
    type: body.type,
    amount: Number(body.amount),
    category: body.category,
    description: typeof body.description === 'string' ? body.description.trim() : '',
    date: body.date ? new Date(body.date) : new Date(),
    // La factura solo aplica a gastos; en ingresos siempre queda en 'no'
    invoice: body.type === 'gasto' && ['pendiente', 'realizada'].includes(body.invoice) ? body.invoice : 'no',
});

const responderError = (res, error, mensaje) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ msg: 'Datos del movimiento inválidos' });
    }
    console.error(mensaje, error);
    res.status(500).json({ msg: mensaje });
};

// =======================================================
// 1. LISTAR (más recientes primero)
// =======================================================
exports.listar = async (req, res) => {
    try {
        const movimientos = await Transaction.find({ user: req.usuario.id }).sort({ date: -1 });
        res.json(movimientos);
    } catch (error) {
        responderError(res, error, 'Error al obtener los movimientos');
    }
};

// =======================================================
// 2. CREAR
// =======================================================
exports.crear = async (req, res) => {
    try {
        const movimiento = await Transaction.create({ ...leerCampos(req.body), user: req.usuario.id });
        res.status(201).json(movimiento);
    } catch (error) {
        responderError(res, error, 'Error al guardar el movimiento');
    }
};

// =======================================================
// 2B. CREAR VARIOS A LA VEZ (modo "Varios")
// Se validan todos antes de guardar: o se guardan todos o ninguno
// =======================================================
exports.crearVarios = async (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (items.length === 0) return res.status(400).json({ msg: 'No hay movimientos para guardar' });
    if (items.length > MAX_POR_LOTE) {
        return res.status(400).json({ msg: `Puedes guardar máximo ${MAX_POR_LOTE} movimientos a la vez` });
    }

    const documentos = items.map((item) => new Transaction({ ...leerCampos(item), user: req.usuario.id }));
    const conError = documentos.findIndex((doc) => doc.validateSync());
    if (conError !== -1) {
        return res.status(400).json({ msg: `El movimiento ${conError + 1} tiene datos inválidos` });
    }

    try {
        const guardados = await Transaction.insertMany(documentos);
        res.status(201).json(guardados);
    } catch (error) {
        responderError(res, error, 'Error al guardar los movimientos');
    }
};

// =======================================================
// 3. ACTUALIZAR
// =======================================================
exports.actualizar = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ msg: 'Movimiento no encontrado' });
    }

    try {
        const movimiento = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.usuario.id },
            leerCampos(req.body),
            { returnDocument: 'after', runValidators: true }
        );
        if (!movimiento) return res.status(404).json({ msg: 'Movimiento no encontrado' });
        res.json(movimiento);
    } catch (error) {
        responderError(res, error, 'Error al actualizar el movimiento');
    }
};

// =======================================================
// 4. ELIMINAR
// =======================================================
exports.eliminar = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ msg: 'Movimiento no encontrado' });
    }

    try {
        const movimiento = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.usuario.id });
        if (!movimiento) return res.status(404).json({ msg: 'Movimiento no encontrado' });
        res.json({ msg: 'Movimiento eliminado' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar el movimiento');
    }
};

// =======================================================
// 5. RESTABLECER DATOS (borra todos los movimientos del usuario)
// =======================================================
exports.eliminarTodos = async (req, res) => {
    try {
        const { deletedCount } = await Transaction.deleteMany({ user: req.usuario.id });
        res.json({ msg: 'Movimientos eliminados', deletedCount });
    } catch (error) {
        responderError(res, error, 'Error al restablecer los datos');
    }
};
