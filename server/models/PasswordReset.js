// =======================================================
// MODELO DE CÓDIGO PARA RESTABLECER CONTRASEÑA
// Colección: finto.passwordresets
// Mongo borra cada documento automáticamente al llegar a expiresAt
// =======================================================

const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true }, // El código nunca se guarda en texto plano
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
});

PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
