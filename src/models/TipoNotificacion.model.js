const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoNotificacion = sequelize.define('TipoNotificacion', {
  id_tipo_notificacion: {
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
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    defaultValue: 'media',
  },
  color_notificacion: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  icono: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  puede_desactivarse: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'tipos_notificacion',
  timestamps: false,
});

module.exports = TipoNotificacion;
