// =======================================================
// MODELO DE REGISTRO PENDIENTE DE VERIFICACIÓN
// Colección: finto.pendingregistrations
// Guarda los datos del registro hasta que el usuario confirma su correo con el código.
// Mongo borra cada documento automáticamente al llegar a expiresAt
// =======================================================

const mongoose = require('mongoose');

const PendingRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }, // La contraseña ya cifrada (bcrypt)
    codeHash: { type: String, required: true },     // El código nunca se guarda en texto plano
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
});

PendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PendingRegistration', PendingRegistrationSchema);
