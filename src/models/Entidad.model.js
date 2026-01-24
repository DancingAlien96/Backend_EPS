const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entidad = sequelize.define('Entidad', {
  id_entidad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  responsable: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  departamento: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Chiquimula',
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descripcion_programas_proyectos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo_entidad: {
    type: DataTypes.ENUM('gubernamental', 'ong', 'privada', 'academica', 'otra'),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('activa', 'inactiva'),
    allowNull: false,
    defaultValue: 'activa',
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  registrado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'entidades',
  timestamps: false,
});

module.exports = Entidad;
