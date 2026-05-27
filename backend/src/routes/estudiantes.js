const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const db = require('../config/db');

// GET /api/estudiantes - Todos (solo admin)
router.get('/', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Sin permiso.' });
    const [estudiantes] = await db.query(`
      SELECT e.*, u.nombre AS tutor_nombre, u.email AS tutor_email
      FROM estudiantes e
      LEFT JOIN usuarios u ON e.tutor_id = u.id
      ORDER BY e.nombre ASC
    `);
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/estudiantes/mi-hijo - Solo el hijo del padre logueado
router.get('/mi-hijo', verificarToken, async (req, res) => {
  try {
    const [estudiantes] = await db.query(`
      SELECT e.*, u.nombre AS tutor_nombre, u.email AS tutor_email
      FROM estudiantes e
      LEFT JOIN usuarios u ON e.tutor_id = u.id
      WHERE e.tutor_id = ?
    `, [req.usuario.id]);
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/estudiantes/:id
router.get('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Sin permiso.' });
    const [estudiantes] = await db.query(`
      SELECT e.*, u.nombre AS tutor_nombre, u.email AS tutor_email
      FROM estudiantes e
      LEFT JOIN usuarios u ON e.tutor_id = u.id
      WHERE e.id = ?
    `, [req.params.id]);
    if (estudiantes.length === 0) return res.status(404).json({ mensaje: 'Alumno no encontrado.' });
    res.json(estudiantes[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// POST - solo admin
router.post('/', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Sin permiso.' });
    const { nombre, edad, tutor_id, matricula } = req.body;
    if (!nombre) return res.status(400).json({ mensaje: 'Nombre es requerido.' });
    const [resultado] = await db.query(
      'INSERT INTO estudiantes (nombre, edad, tutor_id, matricula) VALUES (?, ?, ?, ?)',
      [nombre, edad, tutor_id, matricula]
    );
    res.status(201).json({ mensaje: 'Alumno creado.', id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// PUT - solo admin
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Sin permiso.' });
    const { nombre, edad, tutor_id, matricula } = req.body;
    await db.query(
      'UPDATE estudiantes SET nombre = ?, edad = ?, tutor_id = ?, matricula = ? WHERE id = ?',
      [nombre, edad, tutor_id, matricula, req.params.id]
    );
    res.json({ mensaje: 'Alumno actualizado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// DELETE - solo admin
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Sin permiso.' });
    await db.query('DELETE FROM estudiantes WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Alumno eliminado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
