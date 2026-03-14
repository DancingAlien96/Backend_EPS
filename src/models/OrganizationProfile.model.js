const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrganizationProfile = sequelize.define('OrganizationProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  // PASO 2: Perfil Base
  nombre_entidad: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipo_entidad: {
    type: DataTypes.ENUM(
      'ong',
      'asociacion',
      'cooperativa',
      'incubadora',
      'aceleradora',
      'camara_comercio',
      'institucion_publica',
      'municipalidad',
      'universidad',
      'otro'
    ),
    allowNull: true,
  },
  descripcion_mision: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  anio_fundacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tiene_logo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // PASO 3: Ámbito y Permisos
  ambito_geografico: {
    type: DataTypes.ENUM('municipal', 'departamental', 'regional', 'nacional'),
    allowNull: true,
  },
  puede_publicar_programas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si puede crear convocatorias/programas',
  },
  puede_publicar_eventos: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si puede crear eventos/capacitaciones',
  },
  puede_publicar_noticias: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si puede publicar noticias',
  },
  // PASO 4: Presencia Digital
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  instagram_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  telefono_contacto: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'organization_profiles',
  timestamps: false,
  indexes: [
    { fields: ['tipo_entidad'] },
  ],
});

module.exports = OrganizationProfile;
