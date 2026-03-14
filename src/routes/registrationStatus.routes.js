const express = require('express');
const router = express.Router();
const {
  obtenerEstadoPerfil,
  listarPerfilesPendientes,
  obtenerDetalleParaRevision,
  aprobarPerfil,
  rechazarPerfil,
  reenviarParaRevision
} = require('../controllers/RegistrationStatus.controller');

// Middleware de autenticación
const { authenticateUser } = require('../middleware/authUser'); // Para usuarios públicos (Firebase)
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Para administradores (JWT)

// =====================================================
// RUTAS PÚBLICAS (Usuario Autenticado)
// =====================================================

/**
 * GET /api/registrationStatus/status
 * Obtener el estado del perfil del usuario autenticado
 */
router.get('/status', authenticateUser, obtenerEstadoPerfil);

/**
 * POST /api/registrationStatus/resubmit
 * Reenviar perfil para revisión después de correcciones
 */
router.post('/resubmit', authenticateUser, reenviarParaRevision);

// =====================================================
// RUTAS ADMIN
// =====================================================

/**
 * GET /api/registrationStatus/pending
 * Listar todos los perfiles pendientes de aprobación
 * Query params: ?status=pending&page=1&limit=20
 */
router.get('/pending', authenticateToken, authorizeRoles('administrador', 'superusuario'), listarPerfilesPendientes);

/**
 * GET /api/registrationStatus/review/:userId
 * Obtener detalle completo de un perfil para revisión
 */
router.get('/review/:userId', authenticateToken, authorizeRoles('administrador', 'superusuario'), obtenerDetalleParaRevision);

/**
 * POST /api/registrationStatus/approve/:userId
 * Aprobar un perfil
 */
router.post('/approve/:userId', authenticateToken, authorizeRoles('administrador', 'superusuario'), aprobarPerfil);

/**
 * POST /api/registrationStatus/reject/:userId
 * Rechazar un perfil
 * Body: { rejection_reason: string }
 */
router.post('/reject/:userId', authenticateToken, authorizeRoles('administrador', 'superusuario'), rechazarPerfil);

module.exports = router;
