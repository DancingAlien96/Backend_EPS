const { Recordatorio, Usuario } = require('../models/Recordatorio.model');

const obtenerRecordatorios = async (req, res) => {
  try {
    const { completado } = req.query;
    const where = {
      id_usuario: req.user.id_usuario
    };
    
    if (completado !== undefined) where.completado = completado === 'true';

    const recordatorios = await Recordatorio.findAll({
      where,
      order: [['fecha_recordatorio', 'ASC']]
    });

    res.json(recordatorios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerRecordatorioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const recordatorio = await Recordatorio.findOne({
      where: { 
        id_recordatorio: id,
        id_usuario: req.user.id_usuario 
      }
    });

    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }

    res.json(recordatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearRecordatorio = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      fecha_recordatorio,
      tabla_referencia,
      id_registro_referencia
    } = req.body;

    const recordatorio = await Recordatorio.create({
      id_usuario: req.user.id_usuario,
      titulo,
      descripcion,
      fecha_recordatorio,
      tabla_referencia,
      id_registro_referencia
    });

    res.status(201).json(recordatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const recordatorio = await Recordatorio.findOne({
      where: { 
        id_recordatorio: id,
        id_usuario: req.user.id_usuario 
      }
    });

    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }

    await recordatorio.update(req.body);
    res.json(recordatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;

    const recordatorio = await Recordatorio.findOne({
      where: { 
        id_recordatorio: id,
        id_usuario: req.user.id_usuario 
      }
    });

    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }

    await recordatorio.update({ 
      completado: true,
      fecha_completado: new Date()
    });

    res.json(recordatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recordatorio = await Recordatorio.findOne({
      where: { 
        id_recordatorio: id,
        id_usuario: req.user.id_usuario 
      }
    });

    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }

    await recordatorio.destroy();
    res.json({ mensaje: 'Recordatorio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerRecordatoriosPendientes = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    
    const recordatorios = await Recordatorio.findAll({
      where: {
        id_usuario: req.user.id_usuario,
        completado: false,
        fecha_recordatorio: {
          [Op.lte]: new Date()
        }
      },
      order: [['fecha_recordatorio', 'ASC']]
    });

    res.json(recordatorios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerRecordatorios,
  obtenerRecordatorioPorId,
  crearRecordatorio,
  actualizarRecordatorio,
  completarRecordatorio,
  eliminarRecordatorio,
  obtenerRecordatoriosPendientes
};
