const db = require('../config/db');

// GET /api/eventos - Obtener todos
const obtenerEventos = async (req, res) => {
  try {
    const [eventos] = await db.query(`
      SELECT e.*, u.nombre AS creado_por_nombre
      FROM eventos e
      JOIN usuarios u ON e.creado_por = u.id
      ORDER BY e.fecha ASC
    `);
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/eventos/:id - Obtener uno
const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [eventos] = await db.query(`
      SELECT e.*, u.nombre AS creado_por_nombre
      FROM eventos e
      JOIN usuarios u ON e.creado_por = u.id
      WHERE e.id = ?
    `, [id]);
    if (eventos.length === 0) {
      return res.status(404).json({ mensaje: 'Evento no encontrado.' });
    }
    res.json(eventos[0]);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/eventos - Crear
const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, lugar } = req.body;
    const creado_por = req.usuario.id;
    if (!titulo || !fecha) {
      return res.status(400).json({ mensaje: 'Título y fecha son requeridos.' });
    }
    const [resultado] = await db.query(
      'INSERT INTO eventos (titulo, descripcion, fecha, lugar, creado_por) VALUES (?, ?, ?, ?, ?)',
      [titulo, descripcion, fecha, lugar, creado_por]
    );
    res.status(201).json({ mensaje: 'Evento creado exitosamente.', id: resultado.insertId });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// PUT /api/eventos/:id - Editar
const editarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, lugar } = req.body;
    const [existe] = await db.query('SELECT id, creado_por FROM eventos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Evento no encontrado.' });
    }
    if (existe[0].creado_por !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este evento.' });
    }
    await db.query(
      'UPDATE eventos SET titulo = ?, descripcion = ?, fecha = ?, lugar = ? WHERE id = ?',
      [titulo, descripcion, fecha, lugar, id]
    );
    res.json({ mensaje: 'Evento actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al editar evento:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// DELETE /api/eventos/:id - Eliminar
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const [existe] = await db.query('SELECT id, creado_por FROM eventos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Evento no encontrado.' });
    }
    if (existe[0].creado_por !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este evento.' });
    }
    await db.query('DELETE FROM eventos WHERE id = ?', [id]);
    res.json({ mensaje: 'Evento eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { obtenerEventos, obtenerEventoPorId, crearEvento, editarEvento, eliminarEvento };