const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ninosRoutes = require('./routes/ninos.routes');

const app = express();
const PORT = 3001;

// Configuración
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/ninos', ninosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API de JordanList funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
