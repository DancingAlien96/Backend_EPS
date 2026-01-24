const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_completo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  contrasena_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('superusuario', 'administrador'),
    allowNull: false,
    defaultValue: 'administrador',
  },
  institucion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  creado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
