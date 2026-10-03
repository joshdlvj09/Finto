// =======================================================
// CONTROLADOR DE AUTENTICACIÓN
// Registro con verificación de correo, inicio de sesión, recuperación y datos del usuario
// =======================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const PendingRegistration = require('../models/PendingRegistration');
const Transaction = require('../models/Transaction');
const { enviarCodigoRecuperacion, enviarCodigoVerificacion } = require('../utils/mailer');
const { generarCodigo, validarCodigo } = require('../utils/codes');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// El token lleva la versión de sesión del usuario (ver middleware/auth.js)
const crearToken = (usuario) =>
    jwt.sign({ usuario: { id: usuario.id, v: usuario.tokenVersion || 0 } }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

// =======================================================
// 1A. REGISTRO: VALIDAR DATOS Y ENVIAR CÓDIGO AL CORREO
// La cuenta todavía no se crea; los datos esperan en PendingRegistration
// =======================================================
exports.registrar = async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name) return res.status(400).json({ msg: 'Escribe tu nombre' });
    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ msg: 'El correo no es válido' });
    if (password.length < 6) {
        return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const existe = await User.findOne({ email });
        if (existe) {
            return res.status(409).json({
                msg: 'Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña.',
                code: 'ACCOUNT_EXISTS',
            });
        }

        // Un solo registro pendiente por correo: el nuevo reemplaza al anterior (sirve para reenviar)
        const { codigo, ...datosCodigo } = await generarCodigo();
        await PendingRegistration.findOneAndUpdate(
            { email },
            { name, email, passwordHash: await bcrypt.hash(password, 10), ...datosCodigo },
            { upsert: true }
        );

        try {
            await enviarCodigoVerificacion(email, name, codigo);
        } catch (errorCorreo) {
            await PendingRegistration.deleteOne({ email });
            console.error(`Error al enviar el correo a ${email}:`, errorCorreo.response || errorCorreo.message);
            return res.status(502).json({ msg: 'No pudimos enviar el correo con tu código. Revisa que esté bien escrito.' });
        }

        console.log(`📧 Código de verificación enviado a ${email}`);
        res.json({ msg: `Te enviamos un código de 6 dígitos a ${email}.` });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ msg: 'No se pudo iniciar el registro' });
    }
};

// =======================================================
// 1B. REGISTRO: VERIFICAR CÓDIGO Y CREAR LA CUENTA
// =======================================================
exports.verificarRegistro = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();

    try {
        const pendiente = await PendingRegistration.findOne({ email });
        const error = await validarCodigo(pendiente, req.body.code);
        if (error) return res.status(400).json({ msg: error });

        // Por si alguien terminó de registrar el mismo correo mientras tanto
        if (await User.findOne({ email })) {
            await pendiente.deleteOne();
            return res.status(409).json({
                msg: 'Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña.',
                code: 'ACCOUNT_EXISTS',
            });
        }

        const usuario = await User.create({
            name: pendiente.name,
            email: pendiente.email,
            password: pendiente.passwordHash,
        });
        await pendiente.deleteOne();

        res.status(201).json({ token: crearToken(usuario), user: usuario });
    } catch (error) {
        console.error('Error al verificar registro:', error);
        res.status(500).json({ msg: 'No se pudo crear la cuenta' });
    }
};

// =======================================================
// 2. INICIO DE SESIÓN
// =======================================================
exports.login = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({
                msg: 'No existe una cuenta con este correo. ¿Quieres registrarte?',
                code: 'ACCOUNT_NOT_FOUND',
            });
        }

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) {
            return res.status(400).json({ msg: 'La contraseña es incorrecta', code: 'WRONG_PASSWORD' });
        }

        res.json({ token: crearToken(usuario), user: usuario });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ msg: 'No se pudo iniciar sesión' });
    }
};

// =======================================================
// 3. USUARIO ACTUAL (para restaurar la sesión al abrir la app)
// =======================================================
exports.yo = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id);
        if (!usuario) return res.status(401).json({ msg: 'La cuenta ya no existe' });
        res.json({ user: usuario });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el usuario' });
    }
};

// =======================================================
// 4. SOLICITAR CÓDIGO PARA RESTABLECER CONTRASEÑA
// =======================================================
exports.solicitarRecuperacion = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ msg: 'El correo no es válido' });

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({
                msg: 'No existe una cuenta con este correo. Revisa que esté bien escrito o regístrate.',
                code: 'ACCOUNT_NOT_FOUND',
            });
        }

        // Un solo código activo por correo: el nuevo reemplaza al anterior
        const { codigo, ...datosCodigo } = await generarCodigo();
        await PasswordReset.findOneAndUpdate({ email }, { email, ...datosCodigo }, { upsert: true });

        try {
            await enviarCodigoRecuperacion(email, usuario.name, codigo);
        } catch (errorCorreo) {
            // Si el correo no sale, el código no sirve: se borra para no dejar uno huérfano
            await PasswordReset.deleteOne({ email });
            console.error(`Error al enviar el correo a ${email}:`, errorCorreo.response || errorCorreo.message);
            return res.status(502).json({
                msg: 'No pudimos enviar el correo con tu código. Intenta más tarde.',
            });
        }

        console.log(`📧 Código de recuperación enviado a ${email}`);
        res.json({ msg: `Te enviamos un código de 6 dígitos a ${email}.` });
    } catch (error) {
        console.error('Error al enviar código de recuperación:', error);
        res.status(500).json({ msg: 'No se pudo enviar el código. Intenta más tarde.' });
    }
};

// =======================================================
// 5. RESTABLECER CONTRASEÑA CON EL CÓDIGO
// =======================================================
exports.restablecerPassword = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const codigo = String(req.body.code || '').trim();
    const password = String(req.body.password || '');

    if (password.length < 6) {
        return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const solicitud = await PasswordReset.findOne({ email });
        const error = await validarCodigo(solicitud, codigo);
        if (error) return res.status(400).json({ msg: error });

        const usuario = await User.findOne({ email });
        if (!usuario) {
            await solicitud.deleteOne();
            return res.status(404).json({ msg: 'La cuenta ya no existe', code: 'ACCOUNT_NOT_FOUND' });
        }

        usuario.password = await bcrypt.hash(password, 10);
        usuario.tokenVersion = (usuario.tokenVersion || 0) + 1; // Cierra las sesiones anteriores
        await usuario.save();
        await solicitud.deleteOne();

        // Inicia sesión directamente con la nueva contraseña
        res.json({ token: crearToken(usuario), user: usuario });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ msg: 'No se pudo cambiar la contraseña' });
    }
};

// =======================================================
// 6. CAMBIAR CONTRASEÑA (con sesión iniciada)
// =======================================================
exports.cambiarPassword = async (req, res) => {
    const actual = String(req.body.currentPassword || '');
    const nueva = String(req.body.newPassword || '');

    if (nueva.length < 6) {
        return res.status(400).json({ msg: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const usuario = await User.findById(req.usuario.id);
        if (!usuario) return res.status(404).json({ msg: 'La cuenta ya no existe', code: 'ACCOUNT_NOT_FOUND' });

        const valido = await bcrypt.compare(actual, usuario.password);
        if (!valido) {
            return res.status(400).json({ msg: 'Tu contraseña actual es incorrecta', code: 'WRONG_PASSWORD' });
        }
        if (await bcrypt.compare(nueva, usuario.password)) {
            return res.status(400).json({ msg: 'La nueva contraseña debe ser diferente a la actual' });
        }

        usuario.password = await bcrypt.hash(nueva, 10);
        usuario.tokenVersion = (usuario.tokenVersion || 0) + 1; // Cierra las demás sesiones
        await usuario.save();

        // Este dispositivo sigue conectado con un token nuevo
        res.json({ msg: 'Contraseña actualizada', token: crearToken(usuario) });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ msg: 'No se pudo cambiar la contraseña' });
    }
};

// =======================================================
// 7. ELIMINAR CUENTA (borra usuario, movimientos y códigos pendientes)
// =======================================================
exports.eliminarCuenta = async (req, res) => {
    const password = String(req.body.password || '');

    try {
        const usuario = await User.findById(req.usuario.id);
        if (!usuario) return res.status(404).json({ msg: 'La cuenta ya no existe', code: 'ACCOUNT_NOT_FOUND' });

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) {
            return res.status(400).json({ msg: 'La contraseña es incorrecta', code: 'WRONG_PASSWORD' });
        }

        await Transaction.deleteMany({ user: usuario._id });
        await PasswordReset.deleteMany({ email: usuario.email });
        await usuario.deleteOne();

        res.json({ msg: 'Cuenta eliminada' });
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        res.status(500).json({ msg: 'No se pudo eliminar la cuenta' });
    }
};
