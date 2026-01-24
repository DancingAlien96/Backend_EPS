const { MensajeContacto } = require('../models/MensajeContacto.model');

const obtenerMensajes = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = {};
    
    if (estado) where.estado = estado;

    const mensajes = await MensajeContacto.findAll({
      where,
      order: [['fecha_envio', 'DESC']]
    });

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerMensajePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await MensajeContacto.findByPk(id);

    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Marcar como leído si es nuevo
    if (mensaje.estado === 'nuevo') {
      await mensaje.update({ 
        estado: 'leido',
        fecha_lectura: new Date()
      });
    }

    res.json(mensaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearMensaje = async (req, res) => {
  try {
    const {
      nombre_remitente,
      correo_remitente,
      telefono_remitente,
      asunto,
      mensaje
    } = req.body;

    const nuevoMensaje = await MensajeContacto.create({
      nombre_remitente,
      correo_remitente,
      telefono_remitente,
      asunto,
      mensaje
    });

    res.status(201).json({ 
      mensaje: 'Mensaje enviado correctamente',
      id_mensaje: nuevoMensaje.id_mensaje
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const marcarComoRespondido = async (req, res) => {
  try {
    const { id } = req.params;
    const { notas_respuesta } = req.body;

    const mensaje = await MensajeContacto.findByPk(id);
    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    await mensaje.update({ 
      estado: 'respondido',
      notas_respuesta
    });

    res.json(mensaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await MensajeContacto.findByPk(id);

    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    await mensaje.destroy();
    res.json({ mensaje: 'Mensaje eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerMensajes,
  obtenerMensajePorId,
  crearMensaje,
  marcarComoRespondido,
  eliminarMensaje
};
