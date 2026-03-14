const jwt = require('jsonwebtoken');
const { verifyFirebaseToken, isFirebaseConfigured } = require('../config/firebase');
const User = require('../models/User.model');

/**
 * Middleware de autenticación híbrido
 * Soporta:
 * 1. Tokens de Firebase (desde login de Google en frontend)
 * 2. JWT propios (para compatibilidad y registro progresivo)
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    let user = null;

    // Primero intentar verificar como token de Firebase
    if (isFirebaseConfigured()) {
      try {
        const decodedFirebase = await verifyFirebaseToken(token);
        
        // Buscar usuario por firebase_uid o email
        user = await User.findOne({
          where: decodedFirebase.uid ? 
            { firebase_uid: decodedFirebase.uid } : 
            { email: decodedFirebase.email }
        });

        if (!user) {
          // Usuario autenticado en Firebase pero no registrado en nuestro sistema
          return res.status(404).json({ 
            error: 'Usuario no registrado en el sistema',
            firebase_authenticated: true,
            needs_registration: true,
            firebase_data: {
              uid: decodedFirebase.uid,
              email: decodedFirebase.email,
              name: decodedFirebase.name
            }
          });
        }

      } catch (firebaseError) {
        // Si falla Firebase, intentar JWT propio
        console.log('No es token de Firebase, intentando JWT propio...');
      }
    }

    // Si no se encontró con Firebase, intentar JWT propio
    if (!user) {
      try {
        const secret = process.env.JWT_SECRET || 'secret_key';
        const decoded = jwt.verify(token, secret);

        user = await User.findByPk(decoded.id);
      } catch (jwtError) {
        if (jwtError.name === 'JsonWebTokenError') {
          return res.status(403).json({ error: 'Token inválido' });
        }
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(403).json({ error: 'Token expirado' });
        }
        throw jwtError;
      }
    }

    // Verificar que el usuario existe y está activo
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    // Agregar datos del usuario al request
    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      firebase_uid: user.firebase_uid,
      member_type: user.member_type,
      registration_completed: user.registration_completed,
      registration_approved: user.registration_approved,
      full_name: user.full_name,
      phone_number: user.phone_number
    };

    next();
  } catch (error) {
    console.error('Error en authenticateUser:', error);
    return res.status(500).json({ error: 'Error al autenticar' });
  }
};

/**
 * Middleware para verificar que el usuario completó el registro
 */
const requireCompletedRegistration = (req, res, next) => {
  if (!req.user || !req.user.registration_completed) {
    return res.status(403).json({
      error: 'Debes completar tu registro antes de acceder a esta función',
      registration_completed: false
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario fue aprobado por un admin
 */
const requireApproval = (req, res, next) => {
  if (!req.user || !req.user.registration_approved) {
    return res.status(403).json({
      error: 'Tu cuenta está pendiente de aprobación por un administrador',
      registration_approved: false
    });
  }
  next();
};

/**
 * Middleware para verificar tipos de miembro específicos
 */
const requireMemberType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.member_type)) {
      return res.status(403).json({
        error: `Acceso denegado. Solo para: ${allowedTypes.join(', ')}`,
        required_types: allowedTypes
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  requireCompletedRegistration,
  requireApproval,
  requireMemberType
};
