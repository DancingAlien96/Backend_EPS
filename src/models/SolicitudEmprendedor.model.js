const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SolicitudEmprendedor = sequelize.define('SolicitudEmprendedor', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_persona: {
    type: DataTypes.ENUM('individual', 'organizacion', 'entidad'),
    allowNull: true,
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
  id_departamento_emprendimiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  direccion_detallada: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
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
    type: DataTypes.ENUM('idea', 'puesta_en_marcha_o_mayor_de_1_ano', 'aceleracion'),
    allowNull: false,
  },
  fecha_inicio_emprendimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numero_empleados: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  formalizacion_estado: {
    type: DataTypes.ENUM('formal', 'informal'),
    allowNull: true,
  },
  tiene_patente: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  patente_archivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  inscrito_sat: {
    type: DataTypes.BOOLEAN,
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
  id_organizacion_creada: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_entidad_creada: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'solicitudes_emprendedor',
  timestamps: false,
});

module.exports = SolicitudEmprendedor;
