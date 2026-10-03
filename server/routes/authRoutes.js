const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { authLimiter, resetLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

// /api/auth
router.post('/register', resetLimiter, authController.registrar);
router.post('/register/verify', resetLimiter, authController.verificarRegistro);
router.post('/login', authLimiter, authController.login);
router.get('/me', auth, authController.yo);
router.delete('/me', auth, authLimiter, authController.eliminarCuenta);
router.put('/password', auth, authLimiter, authController.cambiarPassword);
router.post('/forgot-password', resetLimiter, authController.solicitarRecuperacion);
router.post('/reset-password', resetLimiter, authController.restablecerPassword);

module.exports = router;
