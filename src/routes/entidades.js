const express = require('express');
const router = express.Router();
const { 
  obtenerEntidades, 
  obtenerEntidadPorId, 
  crearEntidad, 
  actualizarEntidad, 
  eliminarEntidad 
} = require('../controllers/Entidad.controller');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las entidades (público)
router.get('/', obtenerEntidades);

// Obtener entidad por ID (público)
router.get('/:id', obtenerEntidadPorId);

// Crear entidad (protegido)
router.post('/', authenticateToken, crearEntidad);

// Actualizar entidad (protegido)
router.put('/:id', authenticateToken, actualizarEntidad);

// Eliminar entidad (protegido)
router.delete('/:id', authenticateToken, eliminarEntidad);

module.exports = router;
