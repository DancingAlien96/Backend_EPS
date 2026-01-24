const Usuario = require('../models/Usuario.model');

// Actualizar usuario (perfil)
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_perfil, telefono, institucion } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Solo permitir actualizar ciertos campos
    const updates = {};
    if (foto_perfil !== undefined) updates.foto_perfil = foto_perfil;
    if (telefono !== undefined) updates.telefono = telefono;
    if (institucion !== undefined) updates.institucion = institucion;

    await usuario.update(updates);

    res.json({
      id_usuario: usuario.id_usuario,
      nombre_completo: usuario.nombre_completo,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol,
      institucion: usuario.institucion,
      telefono: usuario.telefono,
      foto_perfil: usuario.foto_perfil
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Obtener usuario por ID
const obtenerUsuario = async (req, res) => {
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

module.exports = {
  actualizarUsuario,
  obtenerUsuario
};
