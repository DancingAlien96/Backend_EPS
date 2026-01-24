const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario.model');

// Login de usuario
const login = async (req, res) => {
  try {
    console.log('\n═══════════════════════════════════════');
    console.log('📝 INTENTO DE LOGIN');
    const { correo_electronico, contrasena } = req.body;
    console.log('Email recibido:', correo_electronico);
    console.log('Contraseña recibida:', contrasena ? '***' : 'VACÍA');

    if (!correo_electronico || !contrasena) {
      console.log('❌ Error: Datos incompletos');
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    console.log('🔍 Buscando usuario en BD...');
    const usuario = await Usuario.findOne({
      where: { correo_electronico, estado: 'activo' }
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado o inactivo');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    console.log('✓ Usuario encontrado:', usuario.nombre_completo, '- Rol:', usuario.rol);

    console.log('🔐 Verificando contraseña...');
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    console.log('✓ Contraseña correcta');

    // Actualizar último acceso
    await usuario.update({ ultimo_acceso: new Date() });
    console.log('✓ Último acceso actualizado');

    // Generar token JWT
    const secret = process.env.JWT_SECRET || 'secret_key';
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo_electronico: usuario.correo_electronico,
        rol: usuario.rol
      },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log('✓ Token JWT generado');

    const respuesta = {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo_electronico: usuario.correo_electronico,
        rol: usuario.rol,
        institucion: usuario.institucion,
        telefono: usuario.telefono,
        foto_perfil: usuario.foto_perfil
      }
    };
    console.log('✅ LOGIN EXITOSO - Enviando respuesta');
    console.log('Usuario:', respuesta.usuario.nombre_completo);
    console.log('Rol:', respuesta.usuario.rol);
    console.log('═══════════════════════════════════════\n');
    res.json(respuesta);
  } catch (error) {
    console.log('❌ ERROR EN LOGIN:', error.message);
    console.error('Error completo:', error);
    console.log('═══════════════════════════════════════\n');
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Crear nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, contrasena, rol, institucion, telefono } = req.body;

    if (!nombre_completo || !correo_electronico || !contrasena) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
    }

    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    const nuevoUsuario = await Usuario.create({
      nombre_completo,
      correo_electronico,
      contrasena_hash,
      rol: rol || 'administrador',
      institucion,
      telefono,
      creado_por: req.usuario?.id_usuario
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      id_usuario: nuevoUsuario.id_usuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contrasena_hash'] },
      order: [['fecha_creacion', 'DESC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena_hash'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, correo_electronico, rol, institucion, telefono, estado } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({
      nombre_completo,
      correo_electronico,
      rol,
      institucion,
      telefono,
      estado
    });

    res.json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Cambiar contraseña
const cambiarContrasena = async (req, res) => {
  try {
    const { id } = req.params;
    const { contrasena_actual, contrasena_nueva } = req.body;

    // Verificar permisos
    if (req.usuario.rol !== 'superusuario' && req.usuario.id_usuario !== Number(id)) {
      return res.status(403).json({ error: 'No tienes permisos para cambiar esta contraseña' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual (solo si no es superusuario)
    if (req.usuario.rol !== 'superusuario') {
      const passwordMatch = await bcrypt.compare(contrasena_actual, usuario.contrasena_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
    }

    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena_nueva, saltRounds);
    await usuario.update({ contrasena_hash });

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

module.exports = {
  login,
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  cambiarContrasena
};
