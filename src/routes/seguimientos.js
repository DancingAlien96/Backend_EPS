const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerSeguimientos,
  obtenerSeguimientoPorId,
  crearSeguimiento,
  actualizarSeguimiento,
  eliminarSeguimiento,
  obtenerTiposSeguimiento,
  obtenerTimelineEmprendedor
} = require('../controllers/Seguimiento.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerSeguimientos);
router.get('/tipos', obtenerTiposSeguimiento);
router.get('/emprendedor/:id_emprendedor', obtenerTimelineEmprendedor);
router.get('/:id', obtenerSeguimientoPorId);
router.post('/', crearSeguimiento);
router.put('/:id', actualizarSeguimiento);
router.delete('/:id', eliminarSeguimiento);

module.exports = router;
