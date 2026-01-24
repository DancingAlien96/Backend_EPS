const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerIndicadores,
  obtenerIndicadorPorId,
  registrarIndicador,
  actualizarIndicador,
  eliminarIndicador,
  obtenerEstadisticasEmprendimiento
} = require('../controllers/Indicador.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerIndicadores);
router.get('/:id', obtenerIndicadorPorId);
router.get('/emprendimiento/:id_emprendimiento/estadisticas', obtenerEstadisticasEmprendimiento);
router.post('/', registrarIndicador);
router.put('/:id', actualizarIndicador);
router.delete('/:id', eliminarIndicador);

module.exports = router;
