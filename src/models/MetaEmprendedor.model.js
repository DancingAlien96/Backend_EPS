const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MetaEmprendedor = sequelize.define('MetaEmprendedor', {
  id_meta: {
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
  titulo_meta: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_establecida: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_limite: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_completada: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  estado_meta: {
    type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada', 'cancelada', 'atrasada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  porcentaje_avance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  indicador_medicion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resultado_final: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  establecida_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'metas_emprendedor',
  timestamps: false,
});

module.exports = MetaEmprendedor;
