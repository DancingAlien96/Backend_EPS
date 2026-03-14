const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConsumerProfile = sequelize.define('ConsumerProfile', {
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
  // PASO 2: Perfil Base (mínimo)
  intereses: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de categorías de interés',
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
  tableName: 'consumer_profiles',
  timestamps: false,
});

module.exports = ConsumerProfile;
