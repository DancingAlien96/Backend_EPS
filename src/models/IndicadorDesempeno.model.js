const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const IndicadorDesempeno = sequelize.define('IndicadorDesempeno', {
  id_indicador: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  periodo_mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  periodo_año: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ventas_mensuales: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  unidades_vendidas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nuevos_clientes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  empleos_generados: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  inversion_realizada: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  utilidad_neta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  registrado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'indicadores_desempeño',
  timestamps: false,
});

module.exports = IndicadorDesempeno;
