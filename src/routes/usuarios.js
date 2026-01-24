const express = require('express');
const router = express.Router();
const { actualizarUsuario, obtenerUsuario } = require('../controllers/Usuario.controller');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', obtenerUsuario);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', actualizarUsuario);

module.exports = router;
