const ProgramaApoyo = require('../models/ProgramaApoyo.model');

const obtenerProgramas = async (req, res) => {
  try {
    const { estado, tipo_apoyo, id_sector } = req.query;
    const where = {};
    
    if (estado) where.estado = estado;
    if (tipo_apoyo) where.tipo_apoyo = tipo_apoyo;
    if (id_sector) where.id_sector = id_sector;

    const programas = await ProgramaApoyo.findAll({
      where,
      order: [['fecha_publicacion', 'DESC']]
    });

    res.json(programas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerProgramaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await ProgramaApoyo.findByPk(id);

    if (!programa) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearPrograma = async (req, res) => {
  try {
    const {
      nombre_programa,
      descripcion,
      institucion_responsable,
      tipo_apoyo,
      id_sector,
      requisitos,
      beneficios,
      fecha_inicio,
      fecha_cierre,
      cupo_maximo,
      documento_adjunto
    } = req.body;

    const programa = await ProgramaApoyo.create({
      nombre_programa,
      descripcion,
      institucion_responsable,
      tipo_apoyo,
      id_sector,
      requisitos,
      beneficios,
      fecha_inicio,
      fecha_cierre,
      cupo_maximo,
      documento_adjunto,
      publicado_por: req.user.id_usuario
    });

    res.status(201).json(programa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await ProgramaApoyo.findByPk(id);

    if (!programa) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    await programa.update(req.body);
    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await ProgramaApoyo.findByPk(id);

    if (!programa) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    await programa.destroy();
    res.json({ mensaje: 'Programa eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cambiarEstadoPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const programa = await ProgramaApoyo.findByPk(id);
    if (!programa) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    await programa.update({ estado });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerProgramas,
  obtenerProgramaPorId,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma,
  cambiarEstadoPrograma
};
