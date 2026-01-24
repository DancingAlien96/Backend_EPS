const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LogActividad = sequelize.define('LogActividad', {
  id_log: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipo_accion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tabla_afectada: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  id_registro_afectado: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ip_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'logs_actividad',
  timestamps: false,
});

module.exports = LogActividad;
