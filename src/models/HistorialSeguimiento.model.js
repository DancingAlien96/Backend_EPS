const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HistorialSeguimiento = sequelize.define('HistorialSeguimiento', {
  id_seguimiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipo_seguimiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_seguimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  archivos_adjuntos: {
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
  tableName: 'historial_seguimiento',
  timestamps: false,
});

module.exports = HistorialSeguimiento;
