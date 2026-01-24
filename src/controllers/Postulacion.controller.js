const { PostulacionPrograma, ProgramaApoyo, Emprendedor, Usuario } = require('../models/PostulacionPrograma.model');

const obtenerPostulaciones = async (req, res) => {
  try {
    const { id_programa, id_emprendedor, estado_postulacion } = req.query;
    const where = {};
    
    if (id_programa) where.id_programa = id_programa;
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;
    if (estado_postulacion) where.estado_postulacion = estado_postulacion;

    const postulaciones = await PostulacionPrograma.findAll({
      where,
      include: [
        { model: ProgramaApoyo, as: 'programa' },
        { model: Emprendedor, as: 'emprendedor' },
        { model: Usuario, as: 'postulador', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ],
      order: [['fecha_postulacion', 'DESC']]
    });

    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPostulacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const postulacion = await PostulacionPrograma.findByPk(id, {
      include: [
        { model: ProgramaApoyo, as: 'programa' },
        { model: Emprendedor, as: 'emprendedor' },
        { model: Usuario, as: 'postulador', attributes: ['id_usuario', 'nombre_completo', 'institucion'] }
      ]
    });

    if (!postulacion) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearPostulacion = async (req, res) => {
  try {
    const { id_programa, id_emprendedor, observaciones } = req.body;

    // Verificar que el programa esté abierto
    const programa = await ProgramaApoyo.findByPk(id_programa);
    if (!programa) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    if (programa.estado !== 'abierto') {
      return res.status(400).json({ error: 'El programa no está abierto para postulaciones' });
    }

    // Verificar que no exista ya una postulación
    const existente = await PostulacionPrograma.findOne({
      where: { id_programa, id_emprendedor }
    });

    if (existente) {
      return res.status(400).json({ error: 'El emprendedor ya está postulado a este programa' });
    }

    // Verificar cupo
    if (programa.cupo_maximo) {
      const postulados = await PostulacionPrograma.count({ where: { id_programa } });
      if (postulados >= programa.cupo_maximo) {
        return res.status(400).json({ error: 'El programa ha alcanzado su cupo máximo' });
      }
    }

    const postulacion = await PostulacionPrograma.create({
      id_programa,
      id_emprendedor,
      observaciones,
      postulado_por: req.user.id_usuario
    });

    res.status(201).json(postulacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarEstadoPostulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_postulacion, observaciones } = req.body;

    const postulacion = await PostulacionPrograma.findByPk(id);
    if (!postulacion) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    await postulacion.update({ estado_postulacion, observaciones });
    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarPostulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const postulacion = await PostulacionPrograma.findByPk(id);

    if (!postulacion) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    await postulacion.destroy();
    res.json({ mensaje: 'Postulación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerPostulaciones,
  obtenerPostulacionPorId,
  crearPostulacion,
  actualizarEstadoPostulacion,
  eliminarPostulacion
};
