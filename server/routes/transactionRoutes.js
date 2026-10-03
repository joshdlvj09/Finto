const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// /api/transactions (todas requieren sesión)
router.use(auth);
router.get('/', transactionController.listar);
router.post('/', transactionController.crear);
router.post('/bulk', transactionController.crearVarios);
router.put('/:id', transactionController.actualizar);
router.delete('/', transactionController.eliminarTodos);
router.delete('/:id', transactionController.eliminar);

module.exports = router;
