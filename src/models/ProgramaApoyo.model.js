const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProgramaApoyo = sequelize.define('ProgramaApoyo', {
  id_programa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_programa: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  institucion_responsable: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  tipo_apoyo: {
    type: DataTypes.ENUM('capacitacion', 'financiamiento', 'asesoria', 'otro'),
    allowNull: false,
  },
  id_sector: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  requisitos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  beneficios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_cierre: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cupo_maximo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  documento_adjunto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('abierto', 'cerrado', 'finalizado'),
    allowNull: false,
    defaultValue: 'abierto',
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
  tableName: 'programas_apoyo',
  timestamps: false,
});

module.exports = ProgramaApoyo;
