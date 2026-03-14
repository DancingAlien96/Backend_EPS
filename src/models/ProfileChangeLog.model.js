const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProfileChangeLog = sequelize.define('ProfileChangeLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  profile_type: {
    type: DataTypes.ENUM('venture', 'organization', 'consumer'),
    allowNull: false,
  },
  profile_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  field_changed: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del campo modificado',
  },
  old_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  new_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Usuario o admin que hizo el cambio',
  },
  changed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  change_reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Motivo del cambio (si admin lo editó)',
  },
}, {
  tableName: 'profile_change_log',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['changed_at'] },
  ],
});

module.exports = ProfileChangeLog;
