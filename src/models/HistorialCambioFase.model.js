const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HistorialCambioFase = sequelize.define('HistorialCambioFase', {
  id_cambio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fase_anterior: {
    type: DataTypes.ENUM('idea', 'inicio', 'crecimiento', 'consolidado'),
    allowNull: false,
  },
  fase_nueva: {
    type: DataTypes.ENUM('idea', 'inicio', 'crecimiento', 'consolidado'),
    allowNull: false,
  },
  fecha_cambio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  justificacion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  logros_alcanzados: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  modificado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'historial_cambios_fase',
  timestamps: false,
});

module.exports = HistorialCambioFase;
