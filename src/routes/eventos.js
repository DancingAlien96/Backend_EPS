const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  inscribirEmprendedor,
  actualizarEstadoInscripcion
} = require('../controllers/Evento.controller');

// Rutas públicas
router.get('/', obtenerEventos);
router.get('/:id', obtenerEventoPorId);

// Rutas protegidas
router.post('/', authenticateToken, crearEvento);
router.put('/:id', authenticateToken, actualizarEvento);
router.delete('/:id', authenticateToken, eliminarEvento);

// Inscripciones
router.post('/:id/inscripciones', authenticateToken, inscribirEmprendedor);
router.patch('/:id/inscripciones/:id_inscripcion', authenticateToken, actualizarEstadoInscripcion);

module.exports = router;
