const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerMensajes,
  obtenerMensajePorId,
  crearMensaje,
  marcarComoRespondido,
  eliminarMensaje
} = require('../controllers/MensajeContacto.controller');

// Ruta pública para enviar mensaje
router.post('/', crearMensaje);

// Rutas protegidas para administradores
router.get('/', authenticateToken, obtenerMensajes);
router.get('/:id', authenticateToken, obtenerMensajePorId);
router.patch('/:id/responder', authenticateToken, marcarComoRespondido);
router.delete('/:id', authenticateToken, eliminarMensaje);

module.exports = router;
