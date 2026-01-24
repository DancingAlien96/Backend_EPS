const SolicitudEmprendedor = require('../models/SolicitudEmprendedor.model');
const Emprendedor = require('../models/Emprendedor.model');
const Emprendimiento = require('../models/Emprendimiento.model');
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
    const {
      nombre_completo,
      dpi,
      fecha_nacimiento,
      genero,
      telefono,
      correo_electronico,
      id_municipio,
      direccion_detallada,
      nombre_emprendimiento,
      descripcion_emprendimiento,
      id_sector,
      fase_emprendimiento
    } = req.body;

    const solicitud = await SolicitudEmprendedor.create({
      nombre_completo,
      dpi,
      fecha_nacimiento,
      genero,
      telefono,
      correo_electronico,
      id_municipio,
      direccion_detallada,
      nombre_emprendimiento,
      descripcion_emprendimiento,
      id_sector,
      fase_emprendimiento
    });

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

    // Crear el emprendedor
    const emprendedor = await Emprendedor.create({
      nombre_completo: solicitud.nombre_completo,
      dpi: solicitud.dpi,
      fecha_nacimiento: solicitud.fecha_nacimiento,
      genero: solicitud.genero,
      telefono: solicitud.telefono,
      correo_electronico: solicitud.correo_electronico,
      id_municipio: solicitud.id_municipio,
      direccion_detallada: solicitud.direccion_detallada,
      registrado_por: req.user.id_usuario
    }, { transaction: t });

    // Crear el emprendimiento
    await Emprendimiento.create({
      id_emprendedor: emprendedor.id_emprendedor,
      nombre_emprendimiento: solicitud.nombre_emprendimiento,
      descripcion: solicitud.descripcion_emprendimiento,
      id_sector: solicitud.id_sector,
      fase_emprendimiento: solicitud.fase_emprendimiento
    }, { transaction: t });

    // Actualizar la solicitud
    await solicitud.update({
      estado_solicitud: 'aprobada',
      fecha_revision: new Date(),
      revisado_por: req.user.id_usuario,
      id_emprendedor_creado: emprendedor.id_emprendedor
    }, { transaction: t });

    await t.commit();
    res.json({ mensaje: 'Solicitud aprobada correctamente', emprendedor });
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
      revisado_por: req.user.id_usuario
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
