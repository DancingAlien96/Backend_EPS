const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerProgramas,
  obtenerProgramaPorId,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma,
  cambiarEstadoPrograma
} = require('../controllers/ProgramaApoyo.controller');

// Rutas públicas
router.get('/', obtenerProgramas);
router.get('/:id', obtenerProgramaPorId);

// Rutas protegidas
router.post('/', authenticateToken, crearPrograma);
router.put('/:id', authenticateToken, actualizarPrograma);
router.patch('/:id/estado', authenticateToken, cambiarEstadoPrograma);
router.delete('/:id', authenticateToken, eliminarPrograma);

module.exports = router;
