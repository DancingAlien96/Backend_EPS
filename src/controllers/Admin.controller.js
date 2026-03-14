const User = require('../models/User.model');
const RegistrationProgress = require('../models/RegistrationProgress.model');
const VentureProfile = require('../models/VentureProfile.model');
const OrganizationProfile = require('../models/OrganizationProfile.model');
const ConsumerProfile = require('../models/ConsumerProfile.model');
const Usuario = require('../models/Usuario.model');
const MunicipioGT = require('../models/MunicipioGT.model');
const Departamento = require('../models/Departamento.model');
const SectorEconomico = require('../models/SectorEconomico.model');
const { sequelize } = require('../config/database');

class AdminController {
  /**
   * GET /admin/solicitudes-pendientes
   * Obtener todas las solicitudes de registro pendientes de aprobación
   */
  static async getSolicitudesPendientes(req, res) {
    try {
      // Obtener usuarios que completaron el registro pero no están aprobados
      const solicitudes = await User.findAll({
        where: {
          registration_completed: true,
          registration_approved: false,
          is_active: true
        },
        include: [
          {
            model: RegistrationProgress,
            as: 'progress',
            attributes: ['completion_percentage', 'completed_at', 'current_step']
          },
          {
            model: VentureProfile,
            as: 'ventureProfile',
            required: false,
            include: [
              {
                model: SectorEconomico,
                as: 'sector',
                attributes: ['nombre_sector']
              }
            ]
          },
          {
            model: OrganizationProfile,
            as: 'organizationProfile',
            required: false
          },
          {
            model: ConsumerProfile,
            as: 'consumerProfile',
            required: false
          },
          {
            model: MunicipioGT,
            as: 'municipio',
            required: false,
            attributes: ['nombre_municipio']
          },
          {
            model: Departamento,
            as: 'departamento',
            required: false,
            attributes: ['nombre_departamento']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Formatear respuesta
      const solicitudesFormateadas = solicitudes.map(user => {
        const baseData = {
          id: user.id,
          email: user.email,
          nombre_completo: user.nombre_completo,
          telefono_whatsapp: user.telefono_whatsapp,
          member_type: user.member_type,
          numero_identificacion: user.numero_identificacion,
          fecha_nacimiento: user.fecha_nacimiento,
          municipio: user.municipio?.nombre_municipio,
          departamento: user.departamento?.nombre_departamento,
          created_at: user.created_at,
          completion_percentage: user.progress?.completion_percentage || 0,
          completed_at: user.progress?.completed_at,
        };

        // Agregar datos específicos según tipo
        if (user.member_type === 'emprendimiento' || user.member_type === 'empresa') {
          baseData.perfil = {
            nombre_emprendimiento: user.ventureProfile?.nombre_emprendimiento,
            sector: user.ventureProfile?.sector?.nombre_sector,
            etapa_negocio: user.ventureProfile?.etapa_negocio,
            fecha_inicio: user.ventureProfile?.fecha_inicio,
            logo_url: user.ventureProfile?.logo_url,
            registro_SAT: user.ventureProfile?.registro_SAT,
            tiene_patente: user.ventureProfile?.tiene_patente_comercio,
            nit: user.ventureProfile?.nit,
          };
        } else if (user.member_type === 'organizacion' || user.member_type === 'institucion') {
          baseData.perfil = {
            nombre_entidad: user.organizationProfile?.nombre_entidad,
            tipo_entidad: user.organizationProfile?.tipo_entidad,
            ambito_geografico: user.organizationProfile?.ambito_geografico,
            puede_publicar_programas: user.organizationProfile?.puede_publicar_programas,
            puede_publicar_eventos: user.organizationProfile?.puede_publicar_eventos,
          };
        } else if (user.member_type === 'consumidor') {
          baseData.perfil = {
            intereses: user.consumerProfile?.intereses,
          };
        }

        return baseData;
      });

      res.json({
        total: solicitudesFormateadas.length,
        solicitudes: solicitudesFormateadas
      });
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /admin/aprobar-usuario/:userId
   * Aprobar solicitud de registro de un usuario
   */
  static async aprobarUsuario(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { userId } = req.params;
      const adminId = req.usuario.id_usuario; // ID del admin desde middleware
      const { observaciones } = req.body;

      // Verificar que el usuario existe y está pendiente
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (!user.registration_completed) {
        await transaction.rollback();
        return res.status(400).json({ error: 'El usuario no ha completado su registro' });
      }

      if (user.registration_approved) {
        await transaction.rollback();
        return res.status(400).json({ error: 'El usuario ya está aprobado' });
      }

      // Aprobar usuario
      await user.update({
        registration_approved: true,
        approved_by: adminId,
        approved_at: new Date()
      }, { transaction });

      // TODO: Enviar email de notificación al usuario
      // await sendApprovalEmail(user.email, user.nombre_completo);

      // TODO: Crear notificación en el sistema
      // await crearNotificacion(userId, 'Tu cuenta ha sido aprobada');

      await transaction.commit();

      console.log(`✅ Usuario ${user.email} aprobado por admin ${adminId}`);

      res.json({
        message: 'Usuario aprobado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          nombre_completo: user.nombre_completo,
          member_type: user.member_type,
          approved_at: user.approved_at
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al aprobar usuario:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /admin/rechazar-usuario/:userId
   * Rechazar solicitud de registro de un usuario
   */
  static async rechazarUsuario(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { userId } = req.params;
      const adminId = req.usuario.id_usuario;
      const { motivo } = req.body;

      if (!motivo) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Debes proporcionar un motivo de rechazo' });
      }

      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (user.registration_approved) {
        await transaction.rollback();
        return res.status(400).json({ error: 'No puedes rechazar un usuario ya aprobado' });
      }

      // Desactivar usuario (en lugar de eliminarlo)
      await user.update({
        is_active: false,
        registration_approved: false,
        // Podríamos agregar un campo "rejection_reason" en el futuro
      }, { transaction });

      // TODO: Enviar email explicando el rechazo
      // await sendRejectionEmail(user.email, user.nombre_completo, motivo);

      await transaction.commit();

      console.log(`❌ Usuario ${user.email} rechazado por admin ${adminId}. Motivo: ${motivo}`);

      res.json({
        message: 'Usuario rechazado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          is_active: false
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al rechazar usuario:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /admin/estadisticas-solicitudes
   * Obtener estadísticas de solicitudes
   */
  static async getEstadisticas(req, res) {
    try {
      const [stats] = await sequelize.query(`
        SELECT 
          COUNT(*) as total_usuarios,
          SUM(CASE WHEN registration_completed = true AND registration_approved = false THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN registration_approved = true THEN 1 ELSE 0 END) as aprobados,
          SUM(CASE WHEN registration_completed = false THEN 1 ELSE 0 END) as incompletos,
          SUM(CASE WHEN member_type = 'emprendimiento' THEN 1 ELSE 0 END) as emprendimientos,
          SUM(CASE WHEN member_type = 'empresa' THEN 1 ELSE 0 END) as empresas,
          SUM(CASE WHEN member_type = 'organizacion' THEN 1 ELSE 0 END) as organizaciones,
          SUM(CASE WHEN member_type = 'institucion' THEN 1 ELSE 0 END) as instituciones,
          SUM(CASE WHEN member_type = 'consumidor' THEN 1 ELSE 0 END) as consumidores
        FROM users
        WHERE is_active = true
      `);

      res.json(stats[0]);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /admin/solicitud/:userId
   * Ver detalle completo de una solicitud específica
   */
  static async getDetalleSolicitud(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include: [
          { model: RegistrationProgress, as: 'progress' },
          {
            model: VentureProfile,
            as: 'ventureProfile',
            include: [{ model: SectorEconomico, as: 'sector' }]
          },
          { model: OrganizationProfile, as: 'organizationProfile' },
          { model: ConsumerProfile, as: 'consumerProfile' },
          { model: MunicipioGT, as: 'municipio' },
          { model: Departamento, as: 'departamento' },
          {
            model: Usuario,
            as: 'approver',
            attributes: ['nombre_completo', 'correo_electronico']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al obtener detalle de solicitud:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminController;
