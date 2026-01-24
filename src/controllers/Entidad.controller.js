const Entidad = require('../models/Entidad.model');
const Municipio = require('../models/Municipio.model');
const Usuario = require('../models/Usuario.model');

// Obtener todas las entidades
const obtenerEntidades = async (req, res) => {
  try {
    const { estado, municipio, tipo_entidad } = req.query;
    
    const where = {};
    if (estado) where.estado = estado;
    if (municipio) where.id_municipio = municipio;
    if (tipo_entidad) where.tipo_entidad = tipo_entidad;

    const entidades = await Entidad.findAll({
      where,
      include: [
        { model: Municipio, as: 'municipio' },
        { model: Usuario, as: 'registrador', attributes: ['nombre_completo'] }
      ],
      order: [['fecha_registro', 'DESC']]
    });

    res.json(entidades);
  } catch (error) {
    console.error('Error al obtener entidades:', error);
    res.status(500).json({ error: 'Error al obtener entidades' });
  }
};

// Obtener entidad por ID
const obtenerEntidadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const entidad = await Entidad.findByPk(id, {
      include: [
        { model: Municipio, as: 'municipio' },
        { model: Usuario, as: 'registrador', attributes: ['nombre_completo'] }
      ]
    });

    if (!entidad) {
      return res.status(404).json({ error: 'Entidad no encontrada' });
    }

    res.json(entidad);
  } catch (error) {
    console.error('Error al obtener entidad:', error);
    res.status(500).json({ error: 'Error al obtener entidad' });
  }
};

// Crear nueva entidad
const crearEntidad = async (req, res) => {
  try {
    const {
      nombre, responsable, correo_electronico, telefono,
      id_municipio, departamento, direccion,
      descripcion_programas_proyectos, tipo_entidad, sitio_web
    } = req.body;

    if (!nombre || !correo_electronico) {
      return res.status(400).json({ error: 'Nombre y correo electrónico son requeridos' });
    }

    const nuevaEntidad = await Entidad.create({
      nombre, responsable, correo_electronico, telefono,
      id_municipio, departamento: departamento || 'Chiquimula',
      direccion, descripcion_programas_proyectos,
      tipo_entidad, sitio_web,
      registrado_por: req.usuario.id_usuario
    });

    res.status(201).json({
      mensaje: 'Entidad creada exitosamente',
      id_entidad: nuevaEntidad.id_entidad
    });
  } catch (error) {
    console.error('Error al crear entidad:', error);
    res.status(500).json({ error: 'Error al crear entidad' });
  }
};

// Actualizar entidad
const actualizarEntidad = async (req, res) => {
  try {
    const { id } = req.params;
    const entidad = await Entidad.findByPk(id);

    if (!entidad) {
      return res.status(404).json({ error: 'Entidad no encontrada' });
    }

    await entidad.update(req.body);
    res.json({ mensaje: 'Entidad actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar entidad:', error);
    res.status(500).json({ error: 'Error al actualizar entidad' });
  }
};

// Eliminar entidad
const eliminarEntidad = async (req, res) => {
  try {
    const { id } = req.params;
    const entidad = await Entidad.findByPk(id);

    if (!entidad) {
      return res.status(404).json({ error: 'Entidad no encontrada' });
    }

    await entidad.destroy();
    res.json({ mensaje: 'Entidad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar entidad:', error);
    res.status(500).json({ error: 'Error al eliminar entidad' });
  }
};

module.exports = {
  obtenerEntidades,
  obtenerEntidadPorId,
  crearEntidad,
  actualizarEntidad,
  eliminarEntidad
};
