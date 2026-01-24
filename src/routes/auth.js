const express = require('express');
const router = express.Router();
const { login, crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, cambiarContrasena } = require('../controllers/Auth.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { verificarTokenFirebase } = require('../middleware/firebaseAuth');
const {
  obtenerPerfil,
  registrarEmprendedor,
  actualizarUltimoAcceso
} = require('../controllers/AuthEmprendedor.controller');

// ========================================
// RUTAS ADMIN (autenticación tradicional)
// ========================================

// Login (pública)
router.post('/login', login);

// Crear usuario (solo superusuario)
router.post('/usuarios', authenticateToken, authorizeRoles('superusuario'), crearUsuario);

// Obtener todos los usuarios
router.get('/usuarios', authenticateToken, obtenerUsuarios);

// Obtener usuario por ID
router.get('/usuarios/:id', authenticateToken, obtenerUsuarioPorId);

// Actualizar usuario (solo superusuario)
router.put('/usuarios/:id', authenticateToken, authorizeRoles('superusuario'), actualizarUsuario);

// Cambiar contraseña
router.put('/usuarios/:id/cambiar-contrasena', authenticateToken, cambiarContrasena);

// ========================================
// RUTAS EMPRENDEDORES (Firebase Auth)
// ========================================

// Obtener perfil del emprendedor autenticado
router.get('/profile', verificarTokenFirebase, obtenerPerfil);

// Registrar nuevo emprendedor
router.post('/registro-emprendedor', verificarTokenFirebase, registrarEmprendedor);

// Actualizar último acceso
router.put('/ultimo-acceso', verificarTokenFirebase, actualizarUltimoAcceso);

module.exports = router;
