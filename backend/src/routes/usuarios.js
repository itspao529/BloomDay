const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const db = require('../config/db');

// GET /api/usuarios
router.get('/', verificarToken, async (req, res) => {
  try {
    const [usuarios] = await db.query('SELECT id, nombre, email, rol FROM usuarios ORDER BY nombre ASC');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// DELETE /api/usuarios/:id
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ mensaje: 'Usuario eliminado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    await db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id]);
    res.json({ mensaje: 'Usuario actualizado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
