const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ImagenEmprendimiento = sequelize.define('ImagenEmprendimiento', {
  id_imagen: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ruta_imagen: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  es_principal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'imagenes_emprendimiento',
  timestamps: false,
});

module.exports = ImagenEmprendimiento;
