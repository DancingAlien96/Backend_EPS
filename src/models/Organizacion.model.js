const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Organizacion = sequelize.define('Organizacion', {
  id_organizacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Chiquimula',
  },
  id_sector: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  descripcion_producto_servicios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  numero_asociados: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  fecha_constitucion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  registro_legal: {
    type: DataTypes.STRING(100),
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
  tableName: 'organizaciones',
  timestamps: false,
});

module.exports = Organizacion;
