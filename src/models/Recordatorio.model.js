const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recordatorio = sequelize.define('Recordatorio', {
  id_recordatorio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_recordatorio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tabla_referencia: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  id_registro_referencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  completado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_completado: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notificacion_enviada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'recordatorios',
  timestamps: false,
});

module.exports = Recordatorio;
