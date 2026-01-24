const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Emprendimiento = sequelize.define('Emprendimiento', {
  id_emprendimiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_emprendimiento: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_sector: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fase_emprendimiento: {
    type: DataTypes.ENUM('idea', 'inicio', 'crecimiento', 'consolidado'),
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numero_empleados: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  tiene_registro_formal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  direccion_negocio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  telefono_negocio: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo_negocio: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logo_emprendimiento: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'pausado', 'cerrado'),
    allowNull: false,
    defaultValue: 'activo',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'emprendimientos',
  timestamps: false,
});

module.exports = Emprendimiento;
