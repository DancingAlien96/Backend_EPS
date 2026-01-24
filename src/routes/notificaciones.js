const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  marcarComoLeida,
  marcarTodasComoLeidas,
  archivarNotificacion,
  eliminarNotificacion,
  contarNoLeidas
} = require('../controllers/Notificacion.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerNotificaciones);
router.get('/contador/no-leidas', contarNoLeidas);
router.get('/:id', obtenerNotificacionPorId);
router.patch('/:id/leer', marcarComoLeida);
router.patch('/leer/todas', marcarTodasComoLeidas);
router.patch('/:id/archivar', archivarNotificacion);
router.delete('/:id', eliminarNotificacion);

module.exports = router;
