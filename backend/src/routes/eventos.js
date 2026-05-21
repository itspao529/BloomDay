const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  editarEvento,
  eliminarEvento
} = require('../controllers/eventosController');

// GET /api/eventos
router.get('/', verificarToken, obtenerEventos);

// GET /api/eventos/:id
router.get('/:id', verificarToken, obtenerEventoPorId);

// POST /api/eventos
router.post('/', verificarToken, crearEvento);

// PUT /api/eventos/:id
router.put('/:id', verificarToken, editarEvento);

// DELETE /api/eventos/:id
router.delete('/:id', verificarToken, eliminarEvento);

module.exports = router;
