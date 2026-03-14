const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VentureProfile = sequelize.define('VentureProfile', {
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
  nombre_emprendimiento: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion_corta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sector_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  etapa_negocio: {
    type: DataTypes.ENUM('idea', 'empezando', 'creciendo', 'consolidado'),
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
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
  // PASO 3: Ventas y Pagos
  canales_venta: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array: ["ferias", "whatsapp", "tienda_fisica"]',
  },
  metodos_pago: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array: ["efectivo", "transferencia", "tarjeta"]',
  },
  usa_pasarela_pago: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  proveedor_pasarela: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'pagadito, neonet, visanet, etc.',
  },
  tipo_cuenta_bancaria: {
    type: DataTypes.ENUM('personal', 'empresarial', 'cooperativa', 'billetera_digital'),
    allowNull: true,
  },
  // PASO 4: Logística y Presencia Digital
  realiza_envios: {
    type: DataTypes.ENUM('no', 'solo_local', 'nacional'),
    allowNull: true,
  },
  metodos_envio: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array: ["guatex", "cargo_expreso", "mensajeria"]',
  },
  politica_cobro_envio: {
    type: DataTypes.ENUM('gratis', 'cliente_paga', 'segun_monto'),
    allowNull: true,
  },
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  instagram_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tiktok_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  whatsapp_business: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // PASO 5: Formalización
  registro_SAT: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nit: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  puede_emitir_facturas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  archivo_rtu: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL Cloudinary',
  },
  estado_registro_mercantil: {
    type: DataTypes.ENUM('no', 'en_tramite', 'registrado'),
    defaultValue: 'no',
  },
  tiene_patente_comercio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  numero_patente: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  archivo_patente: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  interes_registro_marca: {
    type: DataTypes.ENUM('no', 'me_interesa', 'ya_tengo'),
    defaultValue: 'no',
  },
  estado_marca: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Número o nombre de marca registrada',
  },
  otros_registros: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Sanitario, MAGA, exportación, etc.',
  },
  // PASO 6: Intereses y Apoyos
  necesidades_apoyo: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de necesidades seleccionadas',
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
  tableName: 'venture_profiles',
  timestamps: false,
  indexes: [
    { fields: ['sector_id', 'etapa_negocio'] },
    { fields: ['registro_SAT', 'tiene_patente_comercio'] },
  ],
});

module.exports = VentureProfile;
