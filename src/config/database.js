const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'sistema_emprendedores_chiquimula',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

// Función para verificar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a MySQL exitosa con Sequelize');
  } catch (error) {
    console.error('✗ Error al conectar a MySQL:', error);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
