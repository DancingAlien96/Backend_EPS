const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// ========================================
// RUTAS DE ADMINISTRACIÓN
// Requieren autenticación y rol de administrador/superusuario
// ========================================

// Ver solicitudes pendientes de aprobación
router.get(
  '/solicitudes-pendientes',
  authenticateToken,
  authorizeRoles('administrador', 'superusuario'),
  AdminController.getSolicitudesPendientes
);

// Ver detalle de una solicitud específica
router.get(
  '/solicitud/:userId',
  authenticateToken,
  authorizeRoles('administrador', 'superusuario'),
  AdminController.getDetalleSolicitud
);

// Aprobar solicitud de usuario
router.post(
  '/aprobar-usuario/:userId',
  authenticateToken,
  authorizeRoles('administrador', 'superusuario'),
  AdminController.aprobarUsuario
);

// Rechazar solicitud de usuario
router.post(
  '/rechazar-usuario/:userId',
  authenticateToken,
  authorizeRoles('administrador', 'superusuario'),
  AdminController.rechazarUsuario
);

// Estadísticas de solicitudes
router.get(
  '/estadisticas-solicitudes',
  authenticateToken,
  authorizeRoles('administrador', 'superusuario'),
  AdminController.getEstadisticas
);

module.exports = router;
