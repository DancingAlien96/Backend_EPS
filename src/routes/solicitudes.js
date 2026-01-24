const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  crearSolicitud,
  aprobarSolicitud,
  rechazarSolicitud
} = require('../controllers/SolicitudEmprendedor.controller');

// Ruta pública para crear solicitud
router.post('/', crearSolicitud);

// Rutas protegidas
router.get('/', authenticateToken, obtenerSolicitudes);
router.get('/:id', authenticateToken, obtenerSolicitudPorId);
router.post('/:id/aprobar', authenticateToken, aprobarSolicitud);
router.post('/:id/rechazar', authenticateToken, rechazarSolicitud);

module.exports = router;
