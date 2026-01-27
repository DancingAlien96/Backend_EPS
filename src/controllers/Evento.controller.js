const Evento = require('../models/Evento.model');
const InscripcionEvento = require('../models/InscripcionEvento.model');
const Emprendedor = require('../models/Emprendedor.model');

const obtenerEventos = async (req, res) => {
  try {
    const { estado, tipo_evento, id_municipio } = req.query;
    const where = {};
    
    if (estado) where.estado = estado;
    if (tipo_evento) where.tipo_evento = tipo_evento;
    if (id_municipio) where.id_municipio = id_municipio;

    const eventos = await Evento.findAll({
      where,
      order: [['fecha_evento', 'DESC']]
    });

    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearEvento = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const {
      nombre_evento,
      descripcion,
      tipo_evento,
      fecha_evento,
      hora_inicio,
      hora_fin,
      lugar,
      id_municipio,
      cupo_maximo,
      requiere_inscripcion,
      contacto_responsable,
      telefono_contacto,
      imagen_evento,
      estado
    } = req.body;

    const evento = await Evento.create({
      nombre_evento,
      descripcion,
      tipo_evento,
      fecha_evento,
      hora_inicio,
      hora_fin,
      lugar,
      id_municipio,
      cupo_maximo,
      requiere_inscripcion,
      contacto_responsable,
      telefono_contacto,
      imagen_evento,
      estado: estado || 'proximo',
      publicado_por: req.usuario.id_usuario
    });

    res.status(201).json(evento);
  } catch (error) {
    console.error('Error crearEvento:', error);
    res.status(500).json({ error: error.message });
  }
};

const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.update(req.body);
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.json({ mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const inscribirEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_emprendedor } = req.body;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Verificar si ya está inscrito
    const inscripcionExistente = await InscripcionEvento.findOne({
      where: { id_evento: id, id_emprendedor }
    });

    if (inscripcionExistente) {
      return res.status(400).json({ error: 'El emprendedor ya está inscrito en este evento' });
    }

    // Verificar cupo
    if (evento.cupo_maximo) {
      const inscritos = await InscripcionEvento.count({ where: { id_evento: id } });
      if (inscritos >= evento.cupo_maximo) {
        return res.status(400).json({ error: 'El evento ha alcanzado su cupo máximo' });
      }
    }

    const inscripcion = await InscripcionEvento.create({
      id_evento: id,
      id_emprendedor
    });

    res.status(201).json(inscripcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarEstadoInscripcion = async (req, res) => {
  try {
    const { id, id_inscripcion } = req.params;
    const { estado_inscripcion } = req.body;

    const inscripcion = await InscripcionEvento.findOne({
      where: { id_inscripcion, id_evento: id }
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.update({ estado_inscripcion });
    res.json(inscripcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  inscribirEmprendedor,
  actualizarEstadoInscripcion
};
