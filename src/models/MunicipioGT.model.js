const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Catálogo nacional de municipios (con departamento)
const MunicipioGT = sequelize.define('MunicipioGT', {
  id_municipio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_municipio: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  id_departamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'municipios_gt',
  timestamps: false,
});

module.exports = MunicipioGT;