// =======================================================
// CÓDIGOS DE 6 DÍGITOS (verificación de correo y recuperación de contraseña)
// =======================================================

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const MINUTOS_CODIGO = 15;
const MAX_INTENTOS = 5;

// Código aleatorio criptográficamente seguro + su hash para guardarlo
exports.generarCodigo = async () => {
    const codigo = crypto.randomInt(100000, 1000000).toString();
    return {
        codigo,
        codeHash: await bcrypt.hash(codigo, 10),
        attempts: 0,
        expiresAt: new Date(Date.now() + MINUTOS_CODIGO * 60 * 1000),
    };
};

// Revisa el código contra un documento guardado (PasswordReset o PendingRegistration).
// Devuelve null si es válido, o el mensaje de error. Suma intentos fallidos y borra el
// documento cuando ya no sirve.
exports.validarCodigo = async (solicitud, codigo) => {
    if (!solicitud || solicitud.expiresAt < new Date()) {
        return 'El código es incorrecto o ya expiró. Solicita uno nuevo.';
    }

    if (solicitud.attempts >= MAX_INTENTOS) {
        await solicitud.deleteOne();
        return 'Demasiados intentos. Solicita un código nuevo.';
    }

    const valido = await bcrypt.compare(String(codigo || '').trim(), solicitud.codeHash);
    if (!valido) {
        solicitud.attempts += 1;
        await solicitud.save();
        return 'El código es incorrecto o ya expiró. Solicita uno nuevo.';
    }

    return null;
};

exports.MINUTOS_CODIGO = MINUTOS_CODIGO;
