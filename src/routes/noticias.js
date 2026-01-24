const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  publicarNoticia
} = require('../controllers/Noticia.controller');

// Rutas públicas
router.get('/', obtenerNoticias);
router.get('/:id', obtenerNoticiaPorId);

// Rutas protegidas
router.post('/', authenticateToken, crearNoticia);
router.put('/:id', authenticateToken, actualizarNoticia);
router.patch('/:id/publicar', authenticateToken, publicarNoticia);
router.delete('/:id', authenticateToken, eliminarNoticia);

module.exports = router;
