const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SolicitudEmprendedor = sequelize.define('SolicitudEmprendedor', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_completo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  dpi: {
    type: DataTypes.STRING(13),
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  direccion_detallada: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nombre_emprendimiento: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion_emprendimiento: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_sector: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fase_emprendimiento: {
    type: DataTypes.ENUM('idea', 'inicio', 'crecimiento', 'consolidado'),
    allowNull: false,
  },
  estado_solicitud: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  motivo_rechazo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_revision: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  revisado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_emprendedor_creado: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'solicitudes_emprendedor',
  timestamps: false,
});

module.exports = SolicitudEmprendedor;
