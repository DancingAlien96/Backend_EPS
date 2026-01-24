const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_tipo_notificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario_destino: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  enlace: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tabla_referencia: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  id_registro_referencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_lectura: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  archivada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_expiracion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notificaciones',
  timestamps: false,
});

module.exports = Notificacion;
