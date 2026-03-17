const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const RegistrationProgress = require('../models/RegistrationProgress.model');
const VentureProfile = require('../models/VentureProfile.model');
const OrganizationProfile = require('../models/OrganizationProfile.model');
const ConsumerProfile = require('../models/ConsumerProfile.model');

class AuthService {
  /**
   * Registrar nuevo usuario (Paso 1)
   * @param {Object} userData - Datos del usuario
   * @returns {Object} - Usuario creado y token JWT
   */
  static async register(userData) {
    const {
      email,
      password,
      nombre_completo,
      telefono_whatsapp,
      member_type,
      numero_identificacion,
      fecha_nacimiento,
      municipio_id,
      departamento_id
    } = userData;

    // Validar que el email no exista y devolver estado más claro para el frontend
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const approvalStatus = existingUser.approval_status;
      const isCompleted = !!existingUser.registration_completed;
      const isApproved = !!existingUser.registration_approved;

      if (approvalStatus === 'pending' || (isCompleted && !isApproved)) {
        throw new Error('Ya tienes una solicitud registrada y está pendiente de revisión por el administrador.');
      }

      if (approvalStatus === 'approved' || isApproved) {
        throw new Error('Tu cuenta ya fue aprobada. Inicia sesión para continuar.');
      }

      if (approvalStatus === 'rejected') {
        throw new Error('Tu cuenta fue rechazada previamente. Inicia sesión para actualizar tus datos y reenviar la solicitud.');
      }

      throw new Error('El correo electrónico ya está registrado');
    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      email,
      password_hash,
      nombre_completo,
      telefono_whatsapp,
      member_type,
      numero_identificacion,
      fecha_nacimiento,
      municipio_id,
      departamento_id,
      is_active: true,
      is_email_verified: false,
    });

    // El trigger after_user_insert crea automáticamente:
    // - registration_progress
    // - perfil correspondiente según member_type
    
    // Generar token JWT
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre_completo: user.nombre_completo,
        member_type: user.member_type,
      },
      token
    };
  }

  /**
   * Login de usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} - Usuario y token
   */
  static async login(email, password) {
    // Buscar usuario activo
    const user = await User.findOne({
      where: { email, is_active: true },
      include: [
        { model: RegistrationProgress, as: 'progress' },
      ]
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    await user.update({ last_login_at: new Date() });

    // Generar token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre_completo: user.nombre_completo,
        member_type: user.member_type,
        registration_completed: user.registration_completed,
        registration_approved: user.registration_approved,
        current_step: user.progress?.current_step || 0,
        completion_percentage: user.progress?.completion_percentage || 0,
      },
      token
    };
  }

  /**
   * Generar token JWT
   * @param {Object} user - Usuario
   * @returns {string} - Token JWT
   */
  static generateToken(user) {
    const secret = process.env.JWT_SECRET || 'secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        member_type: user.member_type,
      },
      secret,
      { expiresIn }
    );
  }

  /**
   * Verificar token JWT
   * @param {string} token 
   * @returns {Object} - Payload del token
   */
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'secret_key';
    return jwt.verify(token, secret);
  }

  /**
   * Obtener perfil completo del usuario autenticado
   * @param {number} userId 
   * @returns {Object} - Usuario con todos sus datos
   */
  static async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { model: RegistrationProgress, as: 'progress' },
        { model: VentureProfile, as: 'ventureProfile' },
        { model: OrganizationProfile, as: 'organizationProfile' },
        { model: ConsumerProfile, as: 'consumerProfile' },
      ]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Solicitar reset de contraseña
   * @param {string} email 
   * @returns {Object} - Token de reset
   */
  static async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // No revelar si el email existe o no (seguridad)
      return { message: 'Si el correo existe, recibirás un email de recuperación' };
    }

    // Generar token de reset (válido por 1 hora)
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    // Guardar token en BD
    await user.update({
      password_reset_token: resetToken,
      password_reset_expires: new Date(Date.now() + 3600000) // 1 hora
    });

    // TODO: Enviar email con el token
    // await sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Si el correo existe, recibirás un email de recuperación',
      // En desarrollo, devolver el token para testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    };
  }

  /**
   * Resetear contraseña con token
   * @param {string} token 
   * @param {string} newPassword 
   */
  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    // Encriptar nueva contraseña
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await user.update({
      password_hash,
      password_reset_token: null,
      password_reset_expires: null
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}

module.exports = AuthService;
