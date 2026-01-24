const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoSeguimiento = sequelize.define('TipoSeguimiento', {
  id_tipo_seguimiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  color_etiqueta: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  icono: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'tipos_seguimiento',
  timestamps: false,
});

module.exports = TipoSeguimiento;
