// =======================================================
// MODELO DE MOVIMIENTO (GASTO / INGRESO)
// Colección: finto.transactions
// =======================================================

const mongoose = require('mongoose');

// Deben coincidir con los ids de src/constants/categories.js en la app
const CATEGORIES = [
    'comida',
    'postres',
    'suscripciones',
    'transporte',
    'supermercado',
    'salud',
    'ocio',
    'nomina',
    'otros',
];

const TransactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: { type: String, enum: ['gasto', 'ingreso'], required: true },
        amount: { type: Number, required: true, min: 0.01 },
        category: { type: String, enum: CATEGORIES, required: true },
        description: { type: String, trim: true, maxlength: 60, default: '' },
        date: { type: Date, required: true, default: Date.now },
        // Solo para gastos: 'no' = no necesita factura, 'pendiente' o 'realizada'
        invoice: { type: String, enum: ['no', 'pendiente', 'realizada'], default: 'no' },
    },
    { timestamps: true }
);

// Consultas por usuario ordenadas por fecha (lista y resúmenes)
TransactionSchema.index({ user: 1, date: -1 });

TransactionSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.user;
        return ret;
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
module.exports.CATEGORIES = CATEGORIES;
