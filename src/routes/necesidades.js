const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerNecesidades,
  obtenerNecesidadPorId,
  crearNecesidad,
  actualizarNecesidad,
  resolverNecesidad,
  eliminarNecesidad
} = require('../controllers/Necesidad.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerNecesidades);
router.get('/:id', obtenerNecesidadPorId);
router.post('/', crearNecesidad);
router.put('/:id', actualizarNecesidad);
router.patch('/:id/resolver', resolverNecesidad);
router.delete('/:id', eliminarNecesidad);

module.exports = router;
