// =======================================================
// MODELO DE USUARIO
// Colección: finto.users
// =======================================================

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 60 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }, // Siempre guardada como hash (bcrypt)
        // Sube cada vez que cambia la contraseña: los tokens con una versión anterior dejan de servir
        tokenVersion: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Nunca devolver el hash de la contraseña al convertir a JSON
UserSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.tokenVersion;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('User', UserSchema);
