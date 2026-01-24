const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MensajeContacto = sequelize.define('MensajeContacto', {
  id_mensaje: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_remitente: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  correo_remitente: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  telefono_remitente: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  asunto: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('nuevo', 'leido', 'respondido'),
    allowNull: false,
    defaultValue: 'nuevo',
  },
  fecha_envio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_lectura: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notas_respuesta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'mensajes_contacto',
  timestamps: false,
});

module.exports = MensajeContacto;
