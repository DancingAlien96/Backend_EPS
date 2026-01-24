const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerMetas,
  obtenerMetaPorId,
  crearMeta,
  actualizarMeta,
  completarMeta,
  actualizarProgreso,
  eliminarMeta
} = require('../controllers/Meta.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerMetas);
router.get('/:id', obtenerMetaPorId);
router.post('/', crearMeta);
router.put('/:id', actualizarMeta);
router.patch('/:id/completar', completarMeta);
router.patch('/:id/progreso', actualizarProgreso);
router.delete('/:id', eliminarMeta);

module.exports = router;
