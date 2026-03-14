const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role_name: {
    type: DataTypes.ENUM(
      'emprendedor',
      'empresario',
      'organizacion_apoyo',
      'institucion_publica',
      'consumidor',
      'administrador_contenido',
      'administrador_sistema',
      'superadmin'
    ),
    allowNull: false,
  },
  granted_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Admin que otorgó el rol',
  },
  granted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Para roles temporales',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'user_roles',
  timestamps: false,
  indexes: [
    { fields: ['user_id', 'role_name'] },
    { fields: ['is_active'] },
  ],
});

module.exports = UserRole;
