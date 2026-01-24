const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Noticia = sequelize.define('Noticia', {
  id_noticia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resumen: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  id_emprendedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imagen_principal: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  autor: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  fecha_publicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('borrador', 'publicado', 'archivado'),
    allowNull: false,
    defaultValue: 'borrador',
  },
  publicado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'noticias',
  timestamps: false,
});

module.exports = Noticia;
