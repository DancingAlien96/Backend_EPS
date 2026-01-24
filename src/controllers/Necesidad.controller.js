const { NecesidadDetectada, Emprendedor, Emprendimiento, HistorialSeguimiento, Usuario } = require('../models/NecesidadDetectada.model');

const obtenerNecesidades = async (req, res) => {
  try {
    const { estado_necesidad, prioridad, tipo_necesidad, id_emprendedor } = req.query;
    const where = {};
    
    if (estado_necesidad) where.estado_necesidad = estado_necesidad;
    if (prioridad) where.prioridad = prioridad;
    if (tipo_necesidad) where.tipo_necesidad = tipo_necesidad;
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;

    const necesidades = await NecesidadDetectada.findAll({
      where,
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: HistorialSeguimiento, as: 'seguimiento' },
        { model: Usuario, as: 'responsable', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ],
      order: [['prioridad', 'DESC'], ['fecha_identificacion', 'DESC']]
    });

    res.json(necesidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerNecesidadPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const necesidad = await NecesidadDetectada.findByPk(id, {
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: HistorialSeguimiento, as: 'seguimiento' },
        { model: Usuario, as: 'responsable', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ]
    });

    if (!necesidad) {
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    }

    res.json(necesidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearNecesidad = async (req, res) => {
  try {
    const {
      id_emprendedor,
      id_emprendimiento,
      id_seguimiento,
      tipo_necesidad,
      titulo_necesidad,
      descripcion,
      prioridad,
      fecha_identificacion,
      costo_estimado,
      responsable_gestion,
      notas
    } = req.body;

    const necesidad = await NecesidadDetectada.create({
      id_emprendedor,
      id_emprendimiento,
      id_seguimiento,
      tipo_necesidad,
      titulo_necesidad,
      descripcion,
      prioridad,
      fecha_identificacion,
      costo_estimado,
      responsable_gestion,
      notas
    });

    res.status(201).json(necesidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarNecesidad = async (req, res) => {
  try {
    const { id } = req.params;
    const necesidad = await NecesidadDetectada.findByPk(id);

    if (!necesidad) {
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    }

    await necesidad.update(req.body);
    res.json(necesidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resolverNecesidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { solucion_aplicada } = req.body;

    const necesidad = await NecesidadDetectada.findByPk(id);
    if (!necesidad) {
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    }

    await necesidad.update({
      estado_necesidad: 'resuelta',
      fecha_resolucion: new Date(),
      solucion_aplicada
    });

    res.json(necesidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarNecesidad = async (req, res) => {
  try {
    const { id } = req.params;
    const necesidad = await NecesidadDetectada.findByPk(id);

    if (!necesidad) {
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    }

    await necesidad.destroy();
    res.json({ mensaje: 'Necesidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerNecesidades,
  obtenerNecesidadPorId,
  crearNecesidad,
  actualizarNecesidad,
  resolverNecesidad,
  eliminarNecesidad
};
