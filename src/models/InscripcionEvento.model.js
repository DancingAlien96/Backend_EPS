const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InscripcionEvento = sequelize.define('InscripcionEvento', {
  id_inscripcion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_evento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado_inscripcion: {
    type: DataTypes.ENUM('inscrito', 'asistio', 'no_asistio', 'cancelado'),
    allowNull: false,
    defaultValue: 'inscrito',
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'inscripciones_evento',
  timestamps: false,
});

module.exports = InscripcionEvento;
