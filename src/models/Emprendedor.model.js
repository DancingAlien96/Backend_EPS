const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Emprendedor = sequelize.define('Emprendedor', {
  id_emprendedor: {
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
    unique: true,
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
  telefono_secundario: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Datos del emprendimiento principal unificados
  nombre_emprendimiento: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  descripcion_emprendimiento: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_sector: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_departamento_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fase_emprendimiento: {
    type: DataTypes.ENUM('idea', 'puesta_en_marcha_o_mayor_de_1_ano', 'aceleracion'),
    allowNull: true,
  },
  fecha_inicio_emprendimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numero_empleados: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  formalizacion_estado: {
    type: DataTypes.ENUM('formal', 'informal'),
    allowNull: false,
    defaultValue: 'informal',
  },
  tiene_patente: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  patente_archivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  inscrito_sat: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  numero_registro_comercial: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  rtu_pdf: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  telefono_negocio: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo_negocio: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logotipo_negocio: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  catalogo_pdf: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  necesidades_detectadas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  direccion_detallada: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  registrado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'emprendedores',
  timestamps: false,
});

module.exports = Emprendedor;
