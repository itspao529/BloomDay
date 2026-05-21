const db = require('../config/db');

// GET /api/notificaciones - Obtener notificaciones del usuario autenticado
const obtenerNotificaciones = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const [notificaciones] = await db.query(
      'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY creado_en DESC',
      [usuario_id]
    );

    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// PUT /api/notificaciones/:id/leer - Marcar como leída
const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const [existe] = await db.query(
      'SELECT id FROM notificaciones WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );

    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
    }

    await db.query('UPDATE notificaciones SET leida = TRUE WHERE id = ?', [id]);
    res.json({ mensaje: 'Notificación marcada como leída.' });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { obtenerNotificaciones, marcarLeida };
