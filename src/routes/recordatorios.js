const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerRecordatorios,
  obtenerRecordatorioPorId,
  crearRecordatorio,
  actualizarRecordatorio,
  completarRecordatorio,
  eliminarRecordatorio,
  obtenerRecordatoriosPendientes
} = require('../controllers/Recordatorio.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerRecordatorios);
router.get('/pendientes', obtenerRecordatoriosPendientes);
router.get('/:id', obtenerRecordatorioPorId);
router.post('/', crearRecordatorio);
router.put('/:id', actualizarRecordatorio);
router.patch('/:id/completar', completarRecordatorio);
router.delete('/:id', eliminarRecordatorio);

module.exports = router;
