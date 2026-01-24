const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Municipio = sequelize.define('Municipio', {
  id_municipio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_municipio: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'municipios',
  timestamps: false,
});

module.exports = Municipio;
