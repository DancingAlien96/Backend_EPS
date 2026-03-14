const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/Registration.controller');
const { authenticateUser, requireMemberType } = require('../middleware/authUser');

// ========================================
// RUTAS PÚBLICAS (sin autenticación)
// ========================================

// Paso 1: Crear cuenta
router.post('/paso-1', RegistrationController.paso1);

// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================

// Paso 2: Perfil base (común para todos)
router.post('/paso-2', authenticateUser, RegistrationController.paso2);

// Paso 3: Ventas/Ámbito
router.post('/paso-3', authenticateUser, RegistrationController.paso3);

// Paso 4: Logística/Presencia Digital
router.post('/paso-4', authenticateUser, RegistrationController.paso4);

// Paso 5: Formalización (solo emprendimientos/empresas)
router.post(
  '/paso-5',
  authenticateUser,
  requireMemberType('emprendimiento', 'empresa'),
  RegistrationController.paso5
);

// Paso 6: Intereses y Apoyos (solo emprendimientos/empresas)
router.post(
  '/paso-6',
  authenticateUser,
  requireMemberType('emprendimiento', 'empresa'),
  RegistrationController.paso6
);

// Saltar paso opcional (3-6)
router.post('/saltar-paso/:step', authenticateUser, RegistrationController.saltarPaso);

// Obtener progreso actual
router.get('/progreso', authenticateUser, RegistrationController.getProgreso);

// Obtener perfil completo del usuario actual
router.get('/perfil', authenticateUser, RegistrationController.getProfile);

// Autoguardado (cada 3 segundos)
router.post('/guardado-automatico', authenticateUser, RegistrationController.autoguardado);

module.exports = router;
