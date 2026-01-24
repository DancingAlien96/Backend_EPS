const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DocumentoEmprendedor = sequelize.define('DocumentoEmprendedor', {
  id_documento: {
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
  nombre_documento: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  tipo_documento: {
    type: DataTypes.ENUM('contrato', 'certificado', 'permiso', 'licencia', 'acta', 'otro'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tamaño_archivo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipo_mime: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fecha_emision: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  estado_documento: {
    type: DataTypes.ENUM('vigente', 'por_vencer', 'vencido', 'anulado'),
    allowNull: false,
    defaultValue: 'vigente',
  },
  confidencial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  subido_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'documentos_emprendedor',
  timestamps: false,
});

module.exports = DocumentoEmprendedor;
