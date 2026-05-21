const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
  obtenerTareas,
  obtenerTareaPorId,
  crearTarea,
  editarTarea,
  eliminarTarea
} = require('../controllers/tareasController');

// GET /api/tareas
router.get('/', verificarToken, obtenerTareas);

// GET /api/tareas/:id
router.get('/:id', verificarToken, obtenerTareaPorId);

// POST /api/tareas
router.post('/', verificarToken, crearTarea);

// PUT /api/tareas/:id
router.put('/:id', verificarToken, editarTarea);

// DELETE /api/tareas/:id
router.delete('/:id', verificarToken, eliminarTarea);

module.exports = router;
