const SolicitudEmprendedor = require('../models/SolicitudEmprendedor.model');
const Emprendedor = require('../models/Emprendedor.model');
const Emprendimiento = require('../models/Emprendimiento.model');
const Organizacion = require('../models/Organizacion.model');
const Entidad = require('../models/Entidad.model');
const Usuario = require('../models/Usuario.model');
const { sequelize } = require('../config/database');

const obtenerSolicitudes = async (req, res) => {
  try {
    const { estado_solicitud } = req.query;
    const where = {};
    
    if (estado_solicitud) where.estado_solicitud = estado_solicitud;

    const solicitudes = await SolicitudEmprendedor.findAll({
      where,
      order: [['fecha_solicitud', 'DESC']]
    });

    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerSolicitudPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await SolicitudEmprendedor.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudEmprendedor.create(req.body);
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const aprobarSolicitud = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const solicitud = await SolicitudEmprendedor.findByPk(id);

    if (!solicitud) {
      await t.rollback();
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (solicitud.estado_solicitud !== 'pendiente') {
      await t.rollback();
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }

    let createdRecord;
    let recordType;

    if (solicitud.tipo_persona === 'organizacion') {
      // Crear organización
      createdRecord = await Organizacion.create({
        nombre: solicitud.nombre_emprendimiento || solicitud.nombre_completo,
        telefono: solicitud.telefono,
        direccion: solicitud.direccion_detallada,
        id_municipio: solicitud.id_municipio,
        departamento: 'Chiquimula', // Default
        id_sector: solicitud.id_sector,
        descripcion_producto_servicios: solicitud.descripcion_emprendimiento,
        numero_asociados: solicitud.numero_empleados || 1,
        correo_electronico: solicitud.correo_electronico,
        sitio_web: solicitud.sitio_web,
        registrado_por: req.usuario.id_usuario
      }, { transaction: t });
      recordType = 'organizacion';
    } else if (solicitud.tipo_persona === 'entidad') {
      // Crear entidad
      createdRecord = await Entidad.create({
        nombre: solicitud.nombre_emprendimiento || solicitud.nombre_completo,
        responsable: solicitud.nombre_completo,
        correo_electronico: solicitud.correo_electronico,
        telefono: solicitud.telefono,
        id_municipio: solicitud.id_municipio,
        departamento: 'Chiquimula', // Default
        direccion: solicitud.direccion_detallada,
        descripcion_programas_proyectos: solicitud.descripcion_emprendimiento,
        tipo_entidad: 'otra', // Default
        sitio_web: solicitud.sitio_web,
        registrado_por: req.usuario.id_usuario
      }, { transaction: t });
      recordType = 'entidad';
    } else {
      // Default: emprendedor individual
      const emprendedor = await Emprendedor.create({
        tipo_persona: solicitud.tipo_persona,
        nombre_completo: solicitud.nombre_completo,
        dpi: solicitud.dpi,
        fecha_nacimiento: solicitud.fecha_nacimiento,
        genero: solicitud.genero,
        telefono: solicitud.telefono,
        telefono_secundario: solicitud.telefono_secundario,
        correo_electronico: solicitud.correo_electronico,
        id_municipio: solicitud.id_municipio,
        id_departamento_emprendimiento: solicitud.id_departamento_emprendimiento,
        direccion_detallada: solicitud.direccion_detallada,
        observaciones: solicitud.observaciones,
        foto_perfil: solicitud.foto_perfil,
        nombre_emprendimiento: solicitud.nombre_emprendimiento,
        descripcion_emprendimiento: solicitud.descripcion_emprendimiento,
        id_sector: solicitud.id_sector,
        fase_emprendimiento: solicitud.fase_emprendimiento,
        fecha_inicio_emprendimiento: solicitud.fecha_inicio_emprendimiento,
        numero_empleados: solicitud.numero_empleados,
        formalizacion_estado: solicitud.formalizacion_estado,
        tiene_patente: solicitud.tiene_patente,
        patente_archivo: solicitud.patente_archivo,
        inscrito_sat: solicitud.inscrito_sat,
        numero_registro_comercial: solicitud.numero_registro_comercial,
        telefono_negocio: solicitud.telefono_negocio,
        correo_negocio: solicitud.correo_negocio,
        sitio_web: solicitud.sitio_web,
        logotipo_negocio: solicitud.logotipo_negocio,
        catalogo_pdf: solicitud.catalogo_pdf,
        necesidades_detectadas: solicitud.necesidades_detectadas,
        registrado_por: req.usuario.id_usuario
      }, { transaction: t });

      // Crear el emprendimiento
      await Emprendimiento.create({
        id_emprendedor: emprendedor.id_emprendedor,
        nombre_emprendimiento: solicitud.nombre_emprendimiento,
        descripcion: solicitud.descripcion_emprendimiento,
        id_sector: solicitud.id_sector,
        fase_emprendimiento: solicitud.fase_emprendimiento,
        fecha_inicio: solicitud.fecha_inicio_emprendimiento,
        numero_empleados: solicitud.numero_empleados,
        tiene_registro_formal: solicitud.formalizacion_estado === 'formal',
        telefono_negocio: solicitud.telefono_negocio,
        correo_negocio: solicitud.correo_negocio,
        sitio_web: solicitud.sitio_web,
        logo_emprendimiento: solicitud.logotipo_negocio,
      }, { transaction: t });

      createdRecord = emprendedor;
      recordType = 'emprendedor';
    }

    // Actualizar la solicitud
    const updateData = {
      estado_solicitud: 'aprobada',
      fecha_revision: new Date(),
      revisado_por: req.usuario.id_usuario
    };

    if (recordType === 'emprendedor') {
      updateData.id_emprendedor_creado = createdRecord.id_emprendedor;
    } else if (recordType === 'organizacion') {
      updateData.id_organizacion_creada = createdRecord.id_organizacion;
    } else if (recordType === 'entidad') {
      updateData.id_entidad_creada = createdRecord.id_entidad;
    }

    await solicitud.update(updateData, { transaction: t });

    await t.commit();
    res.json({ mensaje: 'Solicitud aprobada correctamente', [recordType]: createdRecord });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo } = req.body;

    const solicitud = await SolicitudEmprendedor.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (solicitud.estado_solicitud !== 'pendiente') {
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }

    await solicitud.update({
      estado_solicitud: 'rechazada',
      motivo_rechazo,
      fecha_revision: new Date(),
      revisado_por: req.usuario.id_usuario
    });

    res.json({ mensaje: 'Solicitud rechazada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  crearSolicitud,
  aprobarSolicitud,
  rechazarSolicitud
};
