const Municipio = require('../models/Municipio.model');

exports.getAll = async (req, res) => {
  try {
    const municipios = await Municipio.findAll({
      order: [['nombre_municipio', 'ASC']]
    });
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ message: 'Error al obtener municipios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const municipio = await Municipio.findByPk(req.params.id);
    if (!municipio) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    res.json(municipio);
  } catch (error) {
    console.error('Error al obtener municipio:', error);
    res.status(500).json({ message: 'Error al obtener municipio' });
  }
};

exports.create = async (req, res) => {
  try {
    const municipio = await Municipio.create(req.body);
    res.status(201).json(municipio);
  } catch (error) {
    console.error('Error al crear municipio:', error);
    res.status(500).json({ message: 'Error al crear municipio' });
  }
};
