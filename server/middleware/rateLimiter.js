// =======================================================
// LÍMITE DE INTENTOS PARA LOGIN Y REGISTRO
// =======================================================

const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
});

// Códigos por correo (registro y recuperación): evita envíos masivos o adivinar códigos
exports.resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' },
});
