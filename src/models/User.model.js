const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nombre_completo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  telefono_whatsapp: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  member_type: {
    type: DataTypes.ENUM('emprendimiento', 'empresa', 'organizacion', 'institucion', 'consumidor'),
    allowNull: false,
  },
  numero_identificacion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'DPI o NIT',
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  municipio_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email_verification_token: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  password_reset_token: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  registration_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si completó todos los pasos',
  },
  registration_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si fue aprobado por admin',
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  approved_at: {
    type: DataTypes.DATE,
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
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    { fields: ['email'] },
    { fields: ['member_type'] },
    { fields: ['registration_completed', 'registration_approved'] },
    { fields: ['created_at'] },
  ],
});

module.exports = User;
