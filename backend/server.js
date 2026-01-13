const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes
const ninosRoutes = require('./routes/ninos.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Para leer cookies HTTP-only

// CORS configurado con credentials para permitir cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // CRÍTICO: permite enviar y recibir cookies
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/ninos', ninosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de JordanList funcionando correctamente',
    version: '2.0.0',
    auth: 'enabled'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔒 Autenticación JWT habilitada`);
  console.log(`🌐 CORS configurado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
