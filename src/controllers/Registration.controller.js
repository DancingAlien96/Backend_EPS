const AuthService = require('../services/AuthService');
const ProfileCompletionService = require('../services/ProfileCompletionService');
const User = require('../models/User.model');
const RegistrationProgress = require('../models/RegistrationProgress.model');
const VentureProfile = require('../models/VentureProfile.model');
const OrganizationProfile = require('../models/OrganizationProfile.model');
const ConsumerProfile = require('../models/ConsumerProfile.model');

class RegistrationController {
  /**
   * POST /auth/registro/paso-1
   * Crear cuenta (email, contraseña, datos básicos)
   */
  static async paso1(req, res) {
    try {
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
      } = req.body;

      // Validaciones
      if (!email || !password || !nombre_completo || !telefono_whatsapp || !member_type) {
        return res.status(400).json({
          error: 'Campos requeridos: email, password, nombre_completo, telefono_whatsapp, member_type'
        });
      }

      // Registrar usuario
      const result = await AuthService.register({
        email,
        password,
        nombre_completo,
        telefono_whatsapp,
        member_type,
        numero_identificacion,
        fecha_nacimiento,
        municipio_id,
        departamento_id
      });

      // Marcar paso 1 como completado
      const progress = await RegistrationProgress.findOne({
        where: { user_id: result.user.id }
      });

      if (progress) {
        await progress.update({
          current_step: 1,
          step_1_completed: true,
          completion_percentage: 20, // Paso 1 da 20% inicial
          last_updated_at: new Date()
        });
      }

      res.status(201).json({
        message: 'Cuenta creada exitosamente',
        user: result.user,
        token: result.token,
        next_step: 2,
        completion_percentage: 20
      });
    } catch (error) {
      console.error('Error en paso 1:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /registro/paso-2
   * Perfil base (nombre emprendimiento, sector, etc.)
   */
  static async paso2(req, res) {
    try {
      const userId = req.userId; // Del middleware de autenticación
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const memberType = user.member_type;

      // Guardar datos según tipo de miembro
      if (memberType === 'emprendimiento' || memberType === 'empresa') {
        const {
          nombre_emprendimiento,
          descripcion_corta,
          sector_id,
          etapa_negocio,
          fecha_inicio,
          tiene_logo,
          logo_url
        } = req.body;

        await VentureProfile.update(
          {
            nombre_emprendimiento,
            descripcion_corta,
            sector_id,
            etapa_negocio,
            fecha_inicio,
            tiene_logo,
            logo_url,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      } else if (memberType === 'organizacion' || memberType === 'institucion') {
        const {
          nombre_entidad,
          tipo_entidad,
          descripcion_mision,
          anio_fundacion,
          tiene_logo,
          logo_url
        } = req.body;

        await OrganizationProfile.update(
          {
            nombre_entidad,
            tipo_entidad,
            descripcion_mision,
            anio_fundacion,
            tiene_logo,
            logo_url,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      } else if (memberType === 'consumidor') {
        const { intereses } = req.body;

        await ConsumerProfile.update(
          { intereses, updated_at: new Date() },
          { where: { user_id: userId } }
        );
      }

      // Actualizar progreso
      await RegistrationProgress.update(
        {
          current_step: 2,
          step_2_completed: true,
          last_updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      // Calcular completitud
      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: 'Paso 2 guardado exitosamente',
        next_step: 3,
        completion_percentage: completion.totalPercentage
      });
    } catch (error) {
      console.error('Error en paso 2:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/paso-3
   * Ventas/Pagos (emprendimiento) o Ámbito (organización)
   */
  static async paso3(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findByPk(userId);

      const memberType = user.member_type;

      if (memberType === 'emprendimiento' || memberType === 'empresa') {
        const {
          canales_venta,
          metodos_pago,
          usa_pasarela_pago,
          proveedor_pasarela,
          tipo_cuenta_bancaria
        } = req.body;

        await VentureProfile.update(
          {
            canales_venta,
            metodos_pago,
            usa_pasarela_pago,
            proveedor_pasarela,
            tipo_cuenta_bancaria,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      } else if (memberType === 'organizacion' || memberType === 'institucion') {
        const {
          ambito_geografico,
          puede_publicar_programas,
          puede_publicar_eventos,
          puede_publicar_noticias
        } = req.body;

        await OrganizationProfile.update(
          {
            ambito_geografico,
            puede_publicar_programas,
            puede_publicar_eventos,
            puede_publicar_noticias,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      }

      await RegistrationProgress.update(
        {
          current_step: 3,
          step_3_completed: true,
          last_updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: 'Paso 3 guardado exitosamente',
        next_step: 4,
        completion_percentage: completion.totalPercentage
      });
    } catch (error) {
      console.error('Error en paso 3:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/paso-4
   * Logística/Presencia Digital
   */
  static async paso4(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findByPk(userId);

      const memberType = user.member_type;

      if (memberType === 'emprendimiento' || memberType === 'empresa') {
        const {
          realiza_envios,
          metodos_envio,
          politica_cobro_envio,
          facebook_url,
          instagram_url,
          tiktok_url,
          whatsapp_business,
          sitio_web
        } = req.body;

        await VentureProfile.update(
          {
            realiza_envios,
            metodos_envio,
            politica_cobro_envio,
            facebook_url,
            instagram_url,
            tiktok_url,
            whatsapp_business,
            sitio_web,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      } else if (memberType === 'organizacion' || memberType === 'institucion') {
        const {
          facebook_url,
          instagram_url,
          sitio_web,
          telefono_contacto
        } = req.body;

        await OrganizationProfile.update(
          {
            facebook_url,
            instagram_url,
            sitio_web,
            telefono_contacto,
            updated_at: new Date()
          },
          { where: { user_id: userId } }
        );
      }

      await RegistrationProgress.update(
        {
          current_step: 4,
          step_4_completed: true,
          last_updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: 'Paso 4 guardado exitosamente',
        next_step: memberType === 'consumidor' ? null : 5,
        completion_percentage: completion.totalPercentage
      });
    } catch (error) {
      console.error('Error en paso 4:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/paso-5
   * Formalización (solo emprendimientos)
   */
  static async paso5(req, res) {
    try {
      const userId = req.userId;

      const {
        registro_SAT,
        nit,
        puede_emitir_facturas,
        archivo_rtu,
        estado_registro_mercantil,
        tiene_patente_comercio,
        numero_patente,
        archivo_patente,
        interes_registro_marca,
        estado_marca,
        otros_registros
      } = req.body;

      await VentureProfile.update(
        {
          registro_SAT,
          nit,
          puede_emitir_facturas,
          archivo_rtu,
          estado_registro_mercantil,
          tiene_patente_comercio,
          numero_patente,
          archivo_patente,
          interes_registro_marca,
          estado_marca,
          otros_registros,
          updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      await RegistrationProgress.update(
        {
          current_step: 5,
          step_5_completed: true,
          last_updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: 'Paso 5 guardado exitosamente',
        next_step: 6,
        completion_percentage: completion.totalPercentage
      });
    } catch (error) {
      console.error('Error en paso 5:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/paso-6
   * Intereses y Apoyos
   */
  static async paso6(req, res) {
    try {
      const userId = req.userId;
      const { necesidades_apoyo } = req.body;

      await VentureProfile.update(
        {
          necesidades_apoyo,
          updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      await RegistrationProgress.update(
        {
          current_step: 6,
          step_6_completed: true,
          last_updated_at: new Date()
        },
        { where: { user_id: userId } }
      );

      // Marcar registro como completado
      await User.update(
        { registration_completed: true },
        { where: { id: userId } }
      );

      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: 'Registro completado exitosamente',
        next_step: null,
        completion_percentage: completion.totalPercentage,
        registration_completed: true
      });
    } catch (error) {
      console.error('Error en paso 6:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/saltar-paso/:step
   * Saltar un paso opcional (3-6)
   */
  static async saltarPaso(req, res) {
    try {
      const userId = req.userId;
      const { step } = req.params;

      const stepNum = parseInt(step);

      if (stepNum < 3 || stepNum > 6) {
        return res.status(400).json({ error: 'Solo puedes saltar los pasos 3-6' });
      }

      const updateData = {
        current_step: stepNum,
        [`step_${stepNum}_skipped`]: true,
        last_updated_at: new Date()
      };

      await RegistrationProgress.update(
        updateData,
        { where: { user_id: userId } }
      );

      const completion = await ProfileCompletionService.calculate(userId);

      res.json({
        message: `Paso ${stepNum} omitido`,
        next_step: stepNum + 1 <= 6 ? stepNum + 1 : null,
        completion_percentage: completion.totalPercentage
      });
    } catch (error) {
      console.error('Error al saltar paso:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /registro/progreso
   * Obtener el progreso actual del usuario
   */
  static async getProgreso(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findByPk(userId, {
        include: [
          { model: RegistrationProgress, as: 'progress' },
        ]
      });

      const completion = await ProfileCompletionService.calculate(userId);
      const recommendations = await ProfileCompletionService.getRecommendations(userId);

      res.json({
        current_step: user.progress?.current_step || 0,
        completion_percentage: completion.totalPercentage,
        registration_completed: user.registration_completed,
        registration_approved: user.registration_approved,
        step_details: completion.stepDetails,
        recommendations
      });
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /registro/guardado-automatico
   * Auto-guardar datos (llamado cada 3 segundos desde el frontend)
   */
  static async autoguardado(req, res) {
    try {
      const userId = req.userId;
      const { step, data } = req.body;

      // Guardar datos parciales sin validación estricta
      // Solo actualizar last_updated_at

      await RegistrationProgress.update(
        { last_updated_at: new Date() },
        { where: { user_id: userId } }
      );

      res.json({
        message: 'Guardado automático exitoso',
        saved_at: new Date()
      });
    } catch (error) {
      console.error('Error en autoguardado:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /registro/perfil
   * Obtener perfil completo del usuario autenticado
   * Incluye: datos básicos, progreso, perfil específico según tipo, roles
   */
  static async getProfile(req, res) {
    try {
      const userId = req.userId;

      // Buscar usuario con todas las relaciones
      const user = await User.findByPk(userId, {
        include: [
          {
            model: RegistrationProgress,
            as: 'progress'
          },
          {
            model: VentureProfile,
            as: 'ventureProfile',
            required: false
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
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Calcular completitud del perfil
      const completion = await ProfileCompletionService.calculate(userId);

      // Construir respuesta según el tipo de miembro
      const profile = {
        id: user.id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        member_type: user.member_type,
        registration_completed: user.registration_completed,
        registration_approved: user.registration_approved,
        approved_at: user.approved_at,
        approved_by: user.approved_by,
        is_active: user.is_active,
        created_at: user.created_at,
        
        // Progreso de registro
        progress: user.progress ? {
          current_step: user.progress.current_step,
          steps_completed: {
            step_1: user.progress.step_1_completed,
            step_2: user.progress.step_2_completed,
            step_3: user.progress.step_3_completed,
            step_4: user.progress.step_4_completed,
            step_5: user.progress.step_5_completed,
            step_6: user.progress.step_6_completed
          },
          steps_skipped: {
            step_3: user.progress.step_3_skipped,
            step_4: user.progress.step_4_skipped,
            step_5: user.progress.step_5_skipped,
            step_6: user.progress.step_6_skipped
          },
          completion_percentage: user.progress.completion_percentage,
          last_updated_at: user.progress.last_updated_at
        } : null,
        
        // Completitud detallada
        completion: completion,
        
        // Perfil específico según tipo
        specific_profile: null
      };

      // Agregar perfil específico
      if (user.member_type === 'emprendimiento' || user.member_type === 'empresa') {
        profile.specific_profile = user.ventureProfile;
      } else if (user.member_type === 'organizacion' || user.member_type === 'institucion') {
        profile.specific_profile = user.organizationProfile;
      } else if (user.member_type === 'consumidor') {
        profile.specific_profile = user.consumerProfile;
      }

      res.json(profile);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RegistrationController;
