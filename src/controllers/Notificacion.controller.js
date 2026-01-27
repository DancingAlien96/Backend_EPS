const { Notificacion, TipoNotificacion, Usuario } = require('../models/Notificacion.model');

const obtenerNotificaciones = async (req, res) => {
  try {
    const { leida, archivada } = req.query;
    const where = {
      id_usuario_destino: req.usuario.id_usuario
    };
    
    if (leida !== undefined) where.leida = leida === 'true';
    if (archivada !== undefined) where.archivada = archivada === 'true';

    const notificaciones = await Notificacion.findAll({
      where,
      include: [
        { model: TipoNotificacion, as: 'tipo' }
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: 50
    });

    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerNotificacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findOne({
      where: { 
        id_notificacion: id,
        id_usuario_destino: req.usuario.id_usuario 
      },
      include: [
        { model: TipoNotificacion, as: 'tipo' }
      ]
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: { 
        id_notificacion: id,
        id_usuario_destino: req.usuario.id_usuario 
      }
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.update({ 
      leida: true,
      fecha_lectura: new Date()
    });

    res.json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const marcarTodasComoLeidas = async (req, res) => {
  try {
    await Notificacion.update(
      { 
        leida: true,
        fecha_lectura: new Date()
      },
      {
        where: {
          id_usuario_destino: req.usuario.id_usuario,
          leida: false
        }
      }
    );

    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const archivarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: { 
        id_notificacion: id,
        id_usuario_destino: req.usuario.id_usuario 
      }
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.update({ archivada: true });
    res.json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: { 
        id_notificacion: id,
        id_usuario_destino: req.usuario.id_usuario 
      }
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.destroy();
    res.json({ mensaje: 'Notificación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const contarNoLeidas = async (req, res) => {
  try {
    const count = await Notificacion.count({
      where: {
        id_usuario_destino: req.usuario.id_usuario,
        leida: false,
        archivada: false
      }
    });

    res.json({ no_leidas: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  marcarComoLeida,
  marcarTodasComoLeidas,
  archivarNotificacion,
  eliminarNotificacion,
  contarNoLeidas
};
