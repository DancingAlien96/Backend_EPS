const { MetaEmprendedor, Emprendedor, Emprendimiento, Usuario } = require('../models/MetaEmprendedor.model');

const obtenerMetas = async (req, res) => {
  try {
    const { id_emprendedor, id_emprendimiento, estado_meta } = req.query;
    const where = {};
    
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;
    if (id_emprendimiento) where.id_emprendimiento = id_emprendimiento;
    if (estado_meta) where.estado_meta = estado_meta;

    const metas = await MetaEmprendedor.findAll({
      where,
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'establecedor', attributes: ['id_usuario', 'nombre_completo'] }
      ],
      order: [['fecha_limite', 'ASC']]
    });

    res.json(metas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerMetaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await MetaEmprendedor.findByPk(id, {
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'establecedor', attributes: ['id_usuario', 'nombre_completo'] }
      ]
    });

    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }

    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearMeta = async (req, res) => {
  try {
    const {
      id_emprendedor,
      id_emprendimiento,
      titulo_meta,
      descripcion,
      fecha_establecida,
      fecha_limite,
      indicador_medicion
    } = req.body;

    const meta = await MetaEmprendedor.create({
      id_emprendedor,
      id_emprendimiento,
      titulo_meta,
      descripcion,
      fecha_establecida,
      fecha_limite,
      indicador_medicion,
      establecida_por: req.usuario.id_usuario
    });

    res.status(201).json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await MetaEmprendedor.findByPk(id);

    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }

    await meta.update(req.body);
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completarMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado_final } = req.body;

    const meta = await MetaEmprendedor.findByPk(id);
    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }

    await meta.update({
      estado_meta: 'completada',
      fecha_completada: new Date(),
      porcentaje_avance: 100,
      resultado_final
    });

    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { porcentaje_avance } = req.body;

    const meta = await MetaEmprendedor.findByPk(id);
    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }

    let estado_meta = 'en_progreso';
    if (porcentaje_avance === 0) estado_meta = 'pendiente';
    if (porcentaje_avance === 100) estado_meta = 'completada';

    await meta.update({ 
      porcentaje_avance,
      estado_meta
    });

    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await MetaEmprendedor.findByPk(id);

    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }

    await meta.destroy();
    res.json({ mensaje: 'Meta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerMetas,
  obtenerMetaPorId,
  crearMeta,
  actualizarMeta,
  completarMeta,
  actualizarProgreso,
  eliminarMeta
};
