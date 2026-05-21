const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { obtenerNotificaciones, marcarLeida } = require('../controllers/notificacionesController');

// GET /api/notificaciones
router.get('/', verificarToken, obtenerNotificaciones);

// PUT /api/notificaciones/:id/leer
router.put('/:id/leer', verificarToken, marcarLeida);

module.exports = router;
