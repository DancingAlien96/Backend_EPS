const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NecesidadDetectada = sequelize.define('NecesidadDetectada', {
  id_necesidad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_seguimiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipo_necesidad: {
    type: DataTypes.ENUM('capacitacion', 'financiamiento', 'materia_prima', 'equipo', 'espacio_fisico', 'asesoria_tecnica', 'legalizacion', 'marketing', 'otro'),
    allowNull: false,
  },
  titulo_necesidad: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
    allowNull: false,
    defaultValue: 'media',
  },
  estado_necesidad: {
    type: DataTypes.ENUM('identificada', 'en_gestion', 'resuelta', 'no_resuelta'),
    allowNull: false,
    defaultValue: 'identificada',
  },
  fecha_identificacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_resolucion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  solucion_aplicada: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  costo_estimado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  responsable_gestion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'necesidades_detectadas',
  timestamps: false,
});

module.exports = NecesidadDetectada;
