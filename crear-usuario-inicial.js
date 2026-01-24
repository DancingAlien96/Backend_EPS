// Script para crear usuario administrador inicial
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/database');
const Usuario = require('./src/models/Usuario.model');

async function crearUsuarioInicial() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida');

    // Verificar si ya existe un usuario
    const usuarioExistente = await Usuario.findOne({ 
      where: { correo_electronico: 'admin@mineco.gob.gt' } 
    });

    if (usuarioExistente) {
      console.log('⚠ El usuario admin@mineco.gob.gt ya existe');
      process.exit(0);
    }

    // Hashear la contraseña
    const contrasenaHash = await bcrypt.hash('Admin123!', 10);

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre_completo: 'Administrador del Sistema',
      correo_electronico: 'admin@mineco.gob.gt',
      contrasena_hash: contrasenaHash,
      rol: 'superusuario',
      institucion: 'Ministerio de Economía - Chiquimula',
      telefono: '79421234',
      estado: 'activo'
    });

    console.log('✓ Usuario creado exitosamente');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📋 CREDENCIALES DE ACCESO');
    console.log('═══════════════════════════════════════');
    console.log('Email:     admin@mineco.gob.gt');
    console.log('Contraseña: Admin123!');
    console.log('Rol:       superusuario');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('⚠ IMPORTANTE: Cambia esta contraseña después del primer acceso');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al crear usuario:', error.message);
    process.exit(1);
  }
}

crearUsuarioInicial();
