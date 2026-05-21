const db = require('../config/db');

// GET /api/tareas
const obtenerTareas = async (req, res) => {
  try {
    const [tareas] = await db.query(`
      SELECT t.*,
        u1.nombre AS asignado_a_nombre,
        u2.nombre AS creado_por_nombre
      FROM tareas t
      LEFT JOIN usuarios u1 ON t.asignado_a = u1.id
      JOIN usuarios u2 ON t.creado_por = u2.id
      ORDER BY t.creado_en DESC
    `);
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/tareas/:id
const obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [tareas] = await db.query(`
      SELECT t.*,
        u1.nombre AS asignado_a_nombre,
        u2.nombre AS creado_por_nombre
      FROM tareas t
      LEFT JOIN usuarios u1 ON t.asignado_a = u1.id
      JOIN usuarios u2 ON t.creado_por = u2.id
      WHERE t.id = ?
    `, [id]);

    if (tareas.length === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    res.json(tareas[0]);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/tareas
const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, estado, prioridad, fecha_limite, asignado_a } = req.body;
    const creado_por = req.usuario.id;

    if (!titulo) {
      return res.status(400).json({ mensaje: 'El título es requerido.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_limite, asignado_a, creado_por) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, estado || 'pendiente', prioridad || 'media', fecha_limite || null, asignado_a || null, creado_por]
    );

    res.status(201).json({
      mensaje: 'Tarea creada exitosamente.',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// PUT /api/tareas/:id
const editarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, fecha_limite, asignado_a } = req.body;

    const [existe] = await db.query('SELECT id FROM tareas WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    await db.query(
      'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_limite = ?, asignado_a = ? WHERE id = ?',
      [titulo, descripcion, estado, prioridad, fecha_limite, asignado_a, id]
    );

    res.json({ mensaje: 'Tarea actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al editar tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// DELETE /api/tareas/:id
const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const [existe] = await db.query('SELECT id FROM tareas WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    await db.query('DELETE FROM tareas WHERE id = ?', [id]);
    res.json({ mensaje: 'Tarea eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { obtenerTareas, obtenerTareaPorId, crearTarea, editarTarea, eliminarTarea };
