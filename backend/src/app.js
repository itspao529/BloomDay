const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',           require('./routes/auth'));
app.use('/api/eventos',        require('./routes/eventos'));
app.use('/api/tareas',         require('./routes/tareas'));
app.use('/api/notificaciones', require('./routes/notificaciones'));
app.use('/api/usuarios',       require('./routes/usuarios'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente.' });
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
