const MunicipioGT = require('../models/MunicipioGT.model');
const SectorEconomico = require('../models/SectorEconomico.model');
const Departamento = require('../models/Departamento.model');

// Obtener municipios
const obtenerMunicipios = async (req, res) => {
  try {
    const { id_departamento } = req.query;

    const where = {};
    if (id_departamento) {
      where.id_departamento = id_departamento;
    }

    const municipios = await MunicipioGT.findAll({
      where,
      order: [['nombre_municipio', 'ASC']]
    });
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
};

// Obtener sectores económicos
const obtenerSectores = async (req, res) => {
  try {
    const sectores = await SectorEconomico.findAll({
      order: [['nombre_sector', 'ASC']]
    });
    res.json(sectores);
  } catch (error) {
    console.error('Error al obtener sectores:', error);
    res.status(500).json({ error: 'Error al obtener sectores' });
  }
};

// Obtener departamentos
const obtenerDepartamentos = async (_req, res) => {
  try {
    const departamentos = await Departamento.findAll({
      order: [['nombre_departamento', 'ASC']]
    });
    res.json(departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
};

module.exports = {
  obtenerMunicipios,
  obtenerSectores,
  obtenerDepartamentos
};
