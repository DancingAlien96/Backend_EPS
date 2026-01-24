const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerPostulaciones,
  obtenerPostulacionPorId,
  crearPostulacion,
  actualizarEstadoPostulacion,
  eliminarPostulacion
} = require('../controllers/Postulacion.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerPostulaciones);
router.get('/:id', obtenerPostulacionPorId);
router.post('/', crearPostulacion);
router.patch('/:id/estado', actualizarEstadoPostulacion);
router.delete('/:id', eliminarPostulacion);

module.exports = router;
