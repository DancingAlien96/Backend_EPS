const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RegistrationProgress = sequelize.define('RegistrationProgress', {
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
  current_step: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Último paso completado',
  },
  step_0_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_1_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_2_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_3_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_4_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_5_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_6_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_3_skipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_4_skipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_5_skipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  step_6_skipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completion_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Porcentaje de completitud 0-100',
  },
  last_updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Última vez que guardó cambios',
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Cuando llega a 100%',
  },
}, {
  tableName: 'registration_progress',
  timestamps: false,
  indexes: [
    { fields: ['completion_percentage'] },
    { fields: ['current_step'] },
  ],
});

module.exports = RegistrationProgress;
