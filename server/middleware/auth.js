// =======================================================
// MIDDLEWARE DE AUTENTICACIÓN
// Valida el token enviado en el header x-auth-token y que la sesión siga vigente
// =======================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay sesión activa' });
    }

    let cifrado;
    try {
        cifrado = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ msg: 'Tu sesión expiró, vuelve a iniciar sesión' });
    }

    try {
        // La cuenta debe existir y la versión de sesión debe coincidir: si la contraseña
        // cambió después de emitir este token, la sesión ya no es válida
        const usuario = await User.findById(cifrado.usuario.id).select('tokenVersion').lean();
        if (!usuario || (usuario.tokenVersion || 0) !== (cifrado.usuario.v || 0)) {
            return res.status(401).json({ msg: 'Tu sesión ya no es válida, vuelve a iniciar sesión' });
        }

        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        console.error('Error al validar la sesión:', error);
        res.status(500).json({ msg: 'No se pudo validar la sesión' });
    }
};
