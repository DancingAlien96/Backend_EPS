const HistorialSeguimiento = require('../models/HistorialSeguimiento.model');
const TipoSeguimiento = require('../models/TipoSeguimiento.model');
const Emprendedor = require('../models/Emprendedor.model');
const Usuario = require('../models/Usuario.model');

const obtenerSeguimientos = async (req, res) => {
  try {
    const { id_emprendedor, id_tipo_seguimiento } = req.query;
    const where = {};
    
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;
    if (id_tipo_seguimiento) where.id_tipo_seguimiento = id_tipo_seguimiento;

    const seguimientos = await HistorialSeguimiento.findAll({
      where,
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: TipoSeguimiento, as: 'tipo' },
        { model: Usuario, as: 'registrador', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ],
      order: [['fecha_seguimiento', 'DESC']]
    });

    res.json(seguimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerSeguimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const seguimiento = await HistorialSeguimiento.findByPk(id, {
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: TipoSeguimiento, as: 'tipo' },
        { model: Usuario, as: 'registrador', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ]
    });

    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }

    res.json(seguimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearSeguimiento = async (req, res) => {
  try {
    const {
      id_emprendedor,
      id_tipo_seguimiento,
      fecha_seguimiento,
      titulo,
      descripcion,
      notas,
      archivos_adjuntos
    } = req.body;

    // Validar campos requeridos
    if (!id_emprendedor || !id_tipo_seguimiento || !titulo) {
      return res.status(400).json({ error: 'Faltan campos requeridos: id_emprendedor, id_tipo_seguimiento, titulo' });
    }

    const registrado_por = req.user?.id_usuario || 2; // Usuario por defecto si no hay sesión

    const seguimiento = await HistorialSeguimiento.create({
      id_emprendedor,
      id_tipo_seguimiento,
      fecha_seguimiento: fecha_seguimiento || new Date(),
      titulo,
      descripcion: descripcion || null,
      notas: notas || null,
      archivos_adjuntos: archivos_adjuntos || null,
      registrado_por
    });

    res.status(201).json(seguimiento);
  } catch (error) {
    console.error('Error al crear seguimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

const actualizarSeguimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const seguimiento = await HistorialSeguimiento.findByPk(id);

    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }

    await seguimiento.update(req.body);
    res.json(seguimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarSeguimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const seguimiento = await HistorialSeguimiento.findByPk(id);

    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }

    await seguimiento.destroy();
    res.json({ mensaje: 'Seguimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTiposSeguimiento = async (_req, res) => {
  try {
    const tipos = await TipoSeguimiento.findAll({
      order: [['nombre_tipo', 'ASC']]
    });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Timeline de seguimiento de un emprendedor
const obtenerTimelineEmprendedor = async (req, res) => {
  try {
    const { id_emprendedor } = req.params;

    const timeline = await HistorialSeguimiento.findAll({
      where: { id_emprendedor },
      include: [
        { model: TipoSeguimiento, as: 'tipo' },
        { model: Usuario, as: 'registrador', attributes: ['id_usuario', 'nombre_completo'] }
      ],
      order: [['fecha_seguimiento', 'DESC']]
    });

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerSeguimientos,
  obtenerSeguimientoPorId,
  crearSeguimiento,
  actualizarSeguimiento,
  eliminarSeguimiento,
  obtenerTiposSeguimiento,
  obtenerTimelineEmprendedor
};
