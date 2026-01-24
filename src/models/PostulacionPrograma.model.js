const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PostulacionPrograma = sequelize.define('PostulacionPrograma', {
  id_postulacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_programa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado_postulacion: {
    type: DataTypes.ENUM('postulado', 'en_revision', 'seleccionado', 'no_seleccionado'),
    allowNull: false,
    defaultValue: 'postulado',
  },
  fecha_postulacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  postulado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'postulaciones_programa',
  timestamps: false,
});

module.exports = PostulacionPrograma;
