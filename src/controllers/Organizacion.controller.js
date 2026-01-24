const Organizacion = require('../models/Organizacion.model');
const Municipio = require('../models/Municipio.model');
const SectorEconomico = require('../models/SectorEconomico.model');
const Usuario = require('../models/Usuario.model');

// Obtener todas las organizaciones
const obtenerOrganizaciones = async (req, res) => {
  try {
    const { estado, municipio, sector } = req.query;
    
    const where = {};
    if (estado) where.estado = estado;
    if (municipio) where.id_municipio = municipio;
    if (sector) where.id_sector = sector;

    const organizaciones = await Organizacion.findAll({
      where,
      include: [
        { model: Municipio, as: 'municipio' },
        { model: SectorEconomico, as: 'sector' },
        { model: Usuario, as: 'registrador', attributes: ['nombre_completo'] }
      ],
      order: [['fecha_registro', 'DESC']]
    });

    res.json(organizaciones);
  } catch (error) {
    console.error('Error al obtener organizaciones:', error);
    res.status(500).json({ error: 'Error al obtener organizaciones' });
  }
};

// Obtener organización por ID
const obtenerOrganizacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const organizacion = await Organizacion.findByPk(id, {
      include: [
        { model: Municipio, as: 'municipio' },
        { model: SectorEconomico, as: 'sector' },
        { model: Usuario, as: 'usuario_registro', attributes: ['nombre_completo'] }
      ]
    });

    if (!organizacion) {
      return res.status(404).json({ error: 'Organización no encontrada' });
    }

    res.json(organizacion);
  } catch (error) {
    console.error('Error al obtener organización:', error);
    res.status(500).json({ error: 'Error al obtener organización' });
  }
};

// Crear nueva organización
const crearOrganizacion = async (req, res) => {
  try {
    const {
      nombre, telefono, direccion, id_municipio, departamento,
      id_sector, descripcion_producto_servicios, numero_asociados,
      correo_electronico, sitio_web, fecha_constitucion, registro_legal
    } = req.body;

    if (!nombre || !id_municipio) {
      return res.status(400).json({ error: 'Nombre y municipio son requeridos' });
    }

    const nuevaOrganizacion = await Organizacion.create({
      nombre, telefono, direccion, id_municipio,
      departamento: departamento || 'Chiquimula',
      id_sector, descripcion_producto_servicios,
      numero_asociados: numero_asociados || 0,
      correo_electronico, sitio_web, fecha_constitucion,
      registro_legal,
      registrado_por: req.usuario.id_usuario
    });

    res.status(201).json({
      mensaje: 'Organización creada exitosamente',
      id_organizacion: nuevaOrganizacion.id_organizacion
    });
  } catch (error) {
    console.error('Error al crear organización:', error);
    res.status(500).json({ error: 'Error al crear organización' });
  }
};

// Actualizar organización
const actualizarOrganizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizacion = await Organizacion.findByPk(id);

    if (!organizacion) {
      return res.status(404).json({ error: 'Organización no encontrada' });
    }

    await organizacion.update(req.body);
    res.json({ mensaje: 'Organización actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar organización:', error);
    res.status(500).json({ error: 'Error al actualizar organización' });
  }
};

// Eliminar organización
const eliminarOrganizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizacion = await Organizacion.findByPk(id);

    if (!organizacion) {
      return res.status(404).json({ error: 'Organización no encontrada' });
    }

    await organizacion.destroy();
    res.json({ mensaje: 'Organización eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar organización:', error);
    res.status(500).json({ error: 'Error al eliminar organización' });
  }
};

module.exports = {
  obtenerOrganizaciones,
  obtenerOrganizacionPorId,
  crearOrganizacion,
  actualizarOrganizacion,
  eliminarOrganizacion
};
