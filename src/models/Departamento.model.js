const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Catálogo de departamentos de Guatemala
const Departamento = sequelize.define('Departamento', {
  id_departamento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_departamento: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'departamentos_gt',
  timestamps: false,
});

module.exports = Departamento;