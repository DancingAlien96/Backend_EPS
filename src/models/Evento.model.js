const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Evento = sequelize.define('Evento', {
  id_evento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_evento: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipo_evento: {
    type: DataTypes.ENUM('taller', 'capacitacion', 'feria', 'networking', 'otro'),
    allowNull: false,
  },
  fecha_evento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  lugar: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cupo_maximo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  requiere_inscripcion: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  contacto_responsable: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  telefono_contacto: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  imagen_evento: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('proximo', 'en_curso', 'finalizado', 'cancelado'),
    allowNull: false,
    defaultValue: 'proximo',
  },
  fecha_publicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  publicado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'eventos',
  timestamps: false,
});

module.exports = Evento;
