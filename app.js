const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./src/config/database');
const routes = require('./src/routes');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const configurarRelaciones = require('./src/models/relaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API Sistema de Emprendedores - Chiquimula',
    version: '1.0.0'
  });
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection();
    configurarRelaciones();
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
