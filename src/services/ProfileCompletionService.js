const User = require('../models/User.model');
const RegistrationProgress = require('../models/RegistrationProgress.model');
const VentureProfile = require('../models/VentureProfile.model');
const OrganizationProfile = require('../models/OrganizationProfile.model');
const ConsumerProfile = require('../models/ConsumerProfile.model');

/**
 * Servicio para calcular el porcentaje de completitud del perfil
 * Basado en el algoritmo documentado en ALGORITMO_COMPLETITUD_PERFIL.md
 */
class ProfileCompletionService {
  // Pesos de cada paso (suman 100%)
  static STEP_WEIGHTS = {
    step1: 20, // Crear acceso
    step2: 20, // Perfil base
    step3: 15, // Ventas/ámbito
    step4: 20, // Logística/presencia
    step5: 15, // Formalización/permisos
    step6: 10, // Intereses/apoyos
  };

  /**
   * Calcular completitud total del perfil
   * @param {number} userId 
   * @returns {Object} - Porcentaje y detalles
   */
  static async calculate(userId) {
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

    const memberType = user.member_type;
    let totalPercentage = 0;
    const stepDetails = {};

    // Paso 1: Crear Acceso (común para todos)
    const step1 = this.calculateStep1(user);
    stepDetails.step1 = step1;
    totalPercentage += step1.percentage * this.STEP_WEIGHTS.step1 / 100;

    // Pasos 2-6 según tipo de miembro
    if (memberType === 'emprendimiento' || memberType === 'empresa') {
      const profile = user.ventureProfile;
      if (profile) {
        stepDetails.step2 = this.calculateStep2Venture(profile);
        stepDetails.step3 = this.calculateStep3Venture(profile);
        stepDetails.step4 = this.calculateStep4Venture(profile);
        stepDetails.step5 = this.calculateStep5Venture(profile);
        stepDetails.step6 = this.calculateStep6Venture(profile);

        totalPercentage += stepDetails.step2.percentage * this.STEP_WEIGHTS.step2 / 100;
        totalPercentage += stepDetails.step3.percentage * this.STEP_WEIGHTS.step3 / 100;
        totalPercentage += stepDetails.step4.percentage * this.STEP_WEIGHTS.step4 / 100;
        totalPercentage += stepDetails.step5.percentage * this.STEP_WEIGHTS.step5 / 100;
        totalPercentage += stepDetails.step6.percentage * this.STEP_WEIGHTS.step6 / 100;
      }
    } else if (memberType === 'organizacion' || memberType === 'institucion') {
      const profile = user.organizationProfile;
      if (profile) {
        stepDetails.step2 = this.calculateStep2Organization(profile);
        stepDetails.step3 = this.calculateStep3Organization(profile);
        stepDetails.step4 = this.calculateStep4Organization(profile);

        totalPercentage += stepDetails.step2.percentage * 40 / 100; // Paso 2: 40%
        totalPercentage += stepDetails.step3.percentage * 30 / 100; // Paso 3: 30%
        totalPercentage += stepDetails.step4.percentage * 30 / 100; // Paso 4: 30%
      }
    } else if (memberType === 'consumidor') {
      const profile = user.consumerProfile;
      if (profile) {
        stepDetails.step2 = this.calculateStep2Consumer(profile);
        totalPercentage += stepDetails.step2.percentage * 80 / 100; // Paso 2: 80%
      }
    }

    // Actualizar en la BD
    if (user.progress) {
      await user.progress.update({
        completion_percentage: Math.round(totalPercentage * 100) / 100,
        last_updated_at: new Date(),
        ...(totalPercentage >= 100 && !user.progress.completed_at && {
          completed_at: new Date()
        })
      });
    }

    return {
      totalPercentage: Math.round(totalPercentage * 100) / 100,
      memberType,
      stepDetails,
      isComplete: totalPercentage >= 100,
    };
  }

  /**
   * Paso 1: Crear Acceso (común para todos)
   */
  static calculateStep1(user) {
    const fields = [
      user.email,
      user.password_hash,
      user.nombre_completo,
      user.telefono_whatsapp,
      user.numero_identificacion, // opcional
      user.fecha_nacimiento, // opcional
      user.municipio_id, // opcional
    ];

    const required = 4; // email, password, nombre, telefono
    const optional = 3;
    const filled = fields.filter(f => f != null && f !== '').length;

    const percentage = (filled / (required + optional)) * 100;

    return {
      percentage,
      filled,
      total: required + optional,
      missing: (required + optional) - filled,
    };
  }

  /**
   * Paso 2: Perfil Base - Emprendimiento/Empresa
   */
  static calculateStep2Venture(profile) {
    const fields = [
      profile.nombre_emprendimiento,
      profile.descripcion_corta,
      profile.sector_id,
      profile.etapa_negocio,
      profile.fecha_inicio,
      profile.logo_url, // opcional si tiene_logo es true
    ];

    const required = 5;
    const filled = fields.filter(f => f != null && f !== '').length;
    const percentage = (filled / required) * 100;

    return { percentage, filled, total: required };
  }

  /**
   * Paso 3: Ventas y Pagos - Emprendimiento/Empresa
   */
  static calculateStep3Venture(profile) {
    const fields = [
      profile.canales_venta,
      profile.metodos_pago,
      profile.tipo_cuenta_bancaria,
    ];

    const filled = fields.filter(f => f != null && (Array.isArray(f) ? f.length > 0 : f !== '')).length;
    const percentage = (filled / fields.length) * 100;

    return { percentage, filled, total: fields.length };
  }

  /**
   * Paso 4: Logística - Emprendimiento/Empresa
   */
  static calculateStep4Venture(profile) {
    const fields = [
      profile.realiza_envios,
      profile.facebook_url,
      profile.instagram_url,
      profile.whatsapp_business,
      profile.sitio_web,
    ];

    const filled = fields.filter(f => f != null && f !== '').length;
    const percentage = (filled / fields.length) * 100;

    return { percentage, filled, total: fields.length };
  }

  /**
   * Paso 5: Formalización - Emprendimiento/Empresa
   */
  static calculateStep5Venture(profile) {
    let points = 0;
    const maxPoints = 4;

    if (profile.registro_SAT) points++;
    if (profile.tiene_patente_comercio) points++;
    if (profile.estado_registro_mercantil === 'registrado') points++;
    if (profile.interes_registro_marca !== 'no') points++;

    const percentage = (points / maxPoints) * 100;

    return { percentage, filled: points, total: maxPoints };
  }

  /**
   * Paso 6: Intereses - Emprendimiento/Empresa
   */
  static calculateStep6Venture(profile) {
    const hasNeeds = profile.necesidades_apoyo && profile.necesidades_apoyo.length > 0;
    const percentage = hasNeeds ? 100 : 0;

    return { percentage, filled: hasNeeds ? 1 : 0, total: 1 };
  }

  /**
   * Paso 2: Perfil Base - Organización/Institución
   */
  static calculateStep2Organization(profile) {
    const fields = [
      profile.nombre_entidad,
      profile.tipo_entidad,
      profile.descripcion_mision,
      profile.logo_url,
    ];

    const filled = fields.filter(f => f != null && f !== '').length;
    const percentage = (filled / fields.length) * 100;

    return { percentage, filled, total: fields.length };
  }

  /**
   * Paso 3: Ámbito y Permisos - Organización/Institución
   */
  static calculateStep3Organization(profile) {
    const fields = [
      profile.ambito_geografico,
      profile.puede_publicar_programas,
      profile.puede_publicar_eventos,
      profile.puede_publicar_noticias,
    ];

    const filled = fields.filter(f => f != null && f !== false).length;
    const percentage = (filled / fields.length) * 100;

    return { percentage, filled, total: fields.length };
  }

  /**
   * Paso 4: Presencia Digital - Organización/Institución
   */
  static calculateStep4Organization(profile) {
    const fields = [
      profile.sitio_web,
      profile.facebook_url,
      profile.telefono_oficina,
    ];

    const filled = fields.filter(f => f != null && f !== '').length;
    const percentage = (filled / fields.length) * 100;

    return { percentage, filled, total: fields.length };
  }

  /**
   * Paso 2: Perfil Base - Consumidor
   */
  static calculateStep2Consumer(profile) {
    const hasInterests = profile.intereses && profile.intereses.length > 0;
    const percentage = hasInterests ? 100 : 0;

    return { percentage, filled: hasInterests ? 1 : 0, total: 1 };
  }

  /**
   * Obtener recomendaciones para completar el perfil
   */
  static async getRecommendations(userId) {
    const completionData = await this.calculate(userId);
    const recommendations = [];

    Object.entries(completionData.stepDetails).forEach(([step, data]) => {
      if (data.percentage < 100) {
        recommendations.push({
          step: step.replace('step', 'Paso '),
          percentage: data.percentage,
          priority: data.percentage < 50 ? 'high' : 'medium',
          message: `Completa ${data.total - data.filled} campos adicionales para mejorar tu perfil`,
        });
      }
    });

    return recommendations;
  }
}

module.exports = ProfileCompletionService;
