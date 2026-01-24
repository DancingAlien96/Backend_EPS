const express = require('express');
const router = express.Router();
const { 
  obtenerEmprendedores, 
  obtenerEmprendedorPorId, 
  crearEmprendedor, 
  actualizarEmprendedor, 
  eliminarEmprendedor,
  buscarEmprendedores 
} = require('../controllers/Emprendedor.controller');
const { authenticateToken } = require('../middleware/auth');

// Obtener todos los emprendedores (público)
router.get('/', obtenerEmprendedores);

// Buscar emprendedores (público)
router.get('/buscar', buscarEmprendedores);

// Obtener emprendedor por ID (público)
router.get('/:id', obtenerEmprendedorPorId);

// Crear emprendedor (protegido)
router.post('/', authenticateToken, crearEmprendedor);

// Actualizar emprendedor (protegido)
router.put('/:id', authenticateToken, actualizarEmprendedor);

// Eliminar emprendedor (protegido)
router.delete('/:id', authenticateToken, eliminarEmprendedor);

module.exports = router;
