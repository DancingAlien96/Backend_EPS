const SectorEconomico = require('../models/SectorEconomico.model');

exports.getAll = async (req, res) => {
  try {
    const sectores = await SectorEconomico.findAll({
      order: [['nombre_sector', 'ASC']]
    });
    res.json(sectores);
  } catch (error) {
    console.error('Error al obtener sectores:', error);
    res.status(500).json({ message: 'Error al obtener sectores' });
  }
};

exports.getById = async (req, res) => {
  try {
    const sector = await SectorEconomico.findByPk(req.params.id);
    if (!sector) {
      return res.status(404).json({ message: 'Sector no encontrado' });
    }
    res.json(sector);
  } catch (error) {
    console.error('Error al obtener sector:', error);
    res.status(500).json({ message: 'Error al obtener sector' });
  }
};

exports.create = async (req, res) => {
  try {
    const sector = await SectorEconomico.create(req.body);
    res.status(201).json(sector);
  } catch (error) {
    console.error('Error al crear sector:', error);
    res.status(500).json({ message: 'Error al crear sector' });
  }
};
