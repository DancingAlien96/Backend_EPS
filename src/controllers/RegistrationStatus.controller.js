const User = require('../models/User.model');
const RegistrationProgress = require('../models/RegistrationProgress.model');
const VentureProfile = require('../models/VentureProfile.model');
const OrganizationProfile = require('../models/OrganizationProfile.model');
const ConsumerProfile = require('../models/ConsumerProfile.model');
const UserRole = require('../models/UserRole.model');
const Usuario = require('../models/Usuario.model');
const { Sequelize } = require('sequelize');

const ROLE_BY_MEMBER_TYPE = {
  emprendimiento: 'emprendedor',
  empresa: 'empresario',
  organizacion: 'organizacion_apoyo',
  institucion: 'institucion_publica',
  consumidor: 'consumidor'
};

/**
 * Obtener el estado del perfil del usuario autenticado
 * GET /api/registration/status
 */
const obtenerEstadoPerfil = async (req, res) => {
  try {
    const userId = req.user?.id; // Del middleware de autenticación Firebase

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Buscar usuario con progreso y perfil
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        'id', 'email', 'nombre_completo', 'member_type', 
        'registration_completed', 'approval_status', 'rejection_reason',
        'reviewed_at', 'reviewed_by', 'created_at', 'updated_at'
      ],
      include: [
        {
          model: RegistrationProgress,
          as: 'registration_progress',
          attributes: ['current_step', 'completion_percentage', 'completed_at']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear respuesta
    const status = {
      id: user.id,
      email: user.email,
      nombre_completo: user.nombre_completo,
      member_type: user.member_type,
      registration_completed: user.registration_completed,
      approval_status: user.approval_status,
      rejection_reason: user.rejection_reason,
      reviewed_at: user.reviewed_at,
      created_at: user.created_at,
      completion_percentage: user.registration_progress?.completion_percentage || 0,
      current_step: user.registration_progress?.current_step || 0
    };

    res.json(status);
  } catch (error) {
    console.error('❌ Error al obtener estado del perfil:', error);
    res.status(500).json({ error: 'Error al obtener estado del perfil' });
  }
};

/**
 * Listar todos los perfiles pendientes de aprobación (ADMIN)
 * GET /api/registration/pending
 */
const listarPerfilesPendientes = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Buscar usuarios pendientes con información completa
    const { count, rows: users } = await User.findAndCountAll({
      where: {
        registration_completed: true,
        approval_status: status
      },
      attributes: [
        'id', 'email', 'nombre_completo', 'member_type', 'telefono_whatsapp',
        'approval_status', 'rejection_reason',  'reviewed_at', 'reviewed_by', 'created_at'
      ],
      include: [
        {
          model: RegistrationProgress,
          as: 'registration_progress',
          attributes: ['completion_percentage', 'current_step', 'completed_at']
        }
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Obtener información del perfil según el tipo
    const usersWithProfiles = await Promise.all(users.map(async (user) => {
      let profileData = null;

      if (user.member_type === 'emprendimiento' || user.member_type === 'empresa') {
        profileData = await VentureProfile.findOne({
          where: { user_id: user.id },
          attributes: ['nombre_emprendimiento', 'descripcion_corta', 'sector_id', 'etapa_negocio', 'logo_url']
        });
      } else if (user.member_type === 'organizacion' || user.member_type === 'institucion') {
        profileData = await OrganizationProfile.findOne({
          where: { user_id: user.id },
          attributes: ['nombre_entidad', 'tipo_entidad', 'descripcion_mision', 'logo_url']
        });
      } else if (user.member_type === 'consumidor') {
        profileData = await ConsumerProfile.findOne({
          where: { user_id: user.id },
          attributes: ['intereses', 'categorias_favoritas']
        });
      }

      return {
        ...user.toJSON(),
        profile: profileData?.toJSON() || null,
        dias_esperando: Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
      };
    }));

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      users: usersWithProfiles
    });
  } catch (error) {
    console.error('❌ Error al listar perfiles pendientes:', error);
    res.status(500).json({ error: 'Error al listar perfiles pendientes' });
  }
};

/**
 * Obtener detalle completo de un perfil para revisión (ADMIN)
 * GET /api/registration/review/:userId
 */
const obtenerDetalleParaRevision = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: RegistrationProgress,
          as: 'registration_progress'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener perfil completo según tipo
    let profileData = null;

    if (user.member_type === 'emprendimiento' || user.member_type === 'empresa') {
      profileData = await VentureProfile.findOne({ where: { user_id: user.id } });
    } else if (user.member_type === 'organizacion' || user.member_type === 'institucion') {
      profileData = await OrganizationProfile.findOne({ where: { user_id: user.id } });
    } else if (user.member_type === 'consumidor') {
      profileData = await ConsumerProfile.findOne({ where: { user_id: user.id } });
    }

    res.json({
      user: user.toJSON(),
      profile: profileData?.toJSON() || null
    });
  } catch (error) {
    console.error('❌ Error al obtener detalle para revisión:', error);
    res.status(500).json({ error: 'Error al obtener detalle del perfil' });
  }
};

/**
 * Aprobar un perfil (ADMIN)
 * POST /api/registration/approve/:userId
 */
const aprobarPerfil = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.usuario?.id_usuario; // ID del admin del sistema usuarios (JWT)

    if (!adminId) {
      return res.status(401).json({ error: 'Administrador no autenticado' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.approval_status === 'approved') {
      return res.status(400).json({ error: 'El perfil ya está aprobado' });
    }

    // Actualizar estado
    await user.update({
      approval_status: 'approved',
      registration_approved: true, // Compatibilidad con sistema antiguo
      reviewed_at: new Date(),
      reviewed_by: adminId,
      rejection_reason: null // Limpiar razón de rechazo si existía
    });

    // Asignar rol final de negocio según el tipo de miembro solicitado
    const roleName = ROLE_BY_MEMBER_TYPE[user.member_type];
    if (roleName) {
      const [userRole, created] = await UserRole.findOrCreate({
        where: {
          user_id: user.id,
          role_name: roleName
        },
        defaults: {
          user_id: user.id,
          role_name: roleName,
          granted_by: adminId,
          granted_at: new Date(),
          is_active: true
        }
      });

      if (!created) {
        await userRole.update({
          is_active: true,
          granted_by: adminId,
          granted_at: new Date()
        });
      }
    }

    // TODO: Crear notificación para el usuario
    // await crearNotificacion(user.id, 'perfil_aprobado', ...);

    console.log(`✅ Perfil aprobado: User ID ${userId} por Admin ID ${adminId}`);

    res.json({
      message: 'Perfil aprobado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        member_type: user.member_type,
        role_assigned: roleName || null,
        approval_status: user.approval_status,
        reviewed_at: user.reviewed_at
      }
    });
  } catch (error) {
    console.error('❌ Error al aprobar perfil:', error);
    res.status(500).json({ error: 'Error al aprobar perfil' });
  }
};

/**
 * Rechazar un perfil (ADMIN)
 * POST /api/registration/reject/:userId
 * Body: { rejection_reason: string }
 */
const rechazarPerfil = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejection_reason } = req.body;
    const adminId = req.usuario?.id_usuario; // ID del admin del sistema usuarios (JWT)

    if (!adminId) {
      return res.status(401).json({ error: 'Administrador no autenticado' });
    }

    if (!rejection_reason || rejection_reason.trim() === '') {
      return res.status(400).json({ error: 'Debe proporcionar un motivo de rechazo' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar estado
    await user.update({
      approval_status: 'rejected',
      registration_approved: false,
      rejection_reason: rejection_reason.trim(),
      reviewed_at: new Date(),
      reviewed_by: adminId
    });

    // TODO: Crear notificación para el usuario
    // await crearNotificacion(user.id, 'perfil_rechazado', rejection_reason);

    console.log(`🚫 Perfil rechazado: User ID ${userId} por Admin ID ${adminId}`);

    res.json({
      message: 'Perfil rechazado',
      user: {
        id: user.id,
        email: user.email,
        approval_status: user.approval_status,
        rejection_reason: user.rejection_reason,
        reviewed_at: user.reviewed_at
      }
    });
  } catch (error) {
    console.error('❌ Error al rechazar perfil:', error);
    res.status(500).json({ error: 'Error al rechazar perfil' });
  }
};

/**
 * Volver a enviar perfil para revisión después de correcciones
 * POST /api/registration/resubmit
 */
const reenviarParaRevision = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.approval_status !== 'rejected') {
      return res.status(400).json({ error: 'Solo se pueden reenviar perfiles rechazados' });
    }

    if (!user.registration_completed) {
      return res.status(400).json({ error: 'Debes completar tu perfil primero' });
    }

    // Volver a estado pendiente
    await user.update({
      approval_status: 'pending',
      rejection_reason: null,
      reviewed_at: null,
      reviewed_by: null
    });

    // TODO: Notificar a administradores que hay nuevo perfil para revisar

    console.log(`🔄 Perfil reenviado para revisión: User ID ${userId}`);

    res.json({
      message: 'Perfil reenviado para revisión',
      approval_status: 'pending'
    });
  } catch (error) {
    console.error('❌ Error al reenviar perfil:', error);
    res.status(500).json({ error: 'Error al reenviar perfil' });
  }
};

module.exports = {
  obtenerEstadoPerfil,
  listarPerfilesPendientes,
  obtenerDetalleParaRevision,
  aprobarPerfil,
  rechazarPerfil,
  reenviarParaRevision
};
