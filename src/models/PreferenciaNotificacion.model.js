const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PreferenciaNotificacion = sequelize.define('PreferenciaNotificacion', {
  id_preferencia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipo_notificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  notificar_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'preferencias_notificacion',
  timestamps: false,
});

module.exports = PreferenciaNotificacion;
