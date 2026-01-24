const express = require('express');
const router = express.Router();
const { 
  obtenerOrganizaciones, 
  obtenerOrganizacionPorId, 
  crearOrganizacion, 
  actualizarOrganizacion, 
  eliminarOrganizacion 
} = require('../controllers/Organizacion.controller');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las organizaciones (público)
router.get('/', obtenerOrganizaciones);

// Obtener organización por ID (público)
router.get('/:id', obtenerOrganizacionPorId);

// Crear organización (protegido)
router.post('/', authenticateToken, crearOrganizacion);

// Actualizar organización (protegido)
router.put('/:id', authenticateToken, actualizarOrganizacion);

// Eliminar organización (protegido)
router.delete('/:id', authenticateToken, eliminarOrganizacion);

module.exports = router;
