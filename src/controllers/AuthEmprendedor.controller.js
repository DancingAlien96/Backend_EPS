const { sequelize } = require('../config/database');
const Emprendedor = require('../models/Emprendedor.model');

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    const { uid } = req;

    // Buscar en emprendedores por firebase_uid usando Sequelize model
    const emprendedor = await Emprendedor.findOne({
      where: { firebase_uid: uid },
      attributes: [
        ['id_emprendedor', 'id'],
        'nombre_completo',
        'correo_electronico',
        'firebase_uid',
        'foto_perfil',
        'telefono',
        'nombre_emprendimiento',
        'tiene_cuenta',
        'cuenta_activa'
      ]
    });

    if (emprendedor) {
      const perfil = emprendedor.toJSON();
      
      // Asignar el rol dinámicamente
      perfil.rol = (perfil.nombre_emprendimiento && perfil.nombre_emprendimiento !== '') 
        ? 'emprendedor' 
        : 'usuario';
      
      // Verificar que la cuenta esté activa
      if (!perfil.tiene_cuenta || !perfil.cuenta_activa) {
        return res.status(403).json({ 
          error: 'Cuenta inactiva',
          message: 'Tu cuenta no está activa en este momento'
        });
      }
      
      return res.json(perfil);
    }

    // Si no existe, retornar 404
    return res.status(404).json({ 
      error: 'Perfil no encontrado',
      message: 'No existe un perfil asociado a esta cuenta'
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener perfil del usuario',
      details: error.message 
    });
  }
};

/**
 * Registrar un nuevo emprendedor
 */
const registrarEmprendedor = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      firebase_uid,
      nombre_completo,
      correo_electronico,
      telefono,
      dpi,
      fecha_nacimiento,
      genero,
      id_municipio,
      direccion_detallada,
      nombre_emprendimiento,
      descripcion_emprendimiento,
      id_sector,
      fase_emprendimiento
    } = req.body;

    // Verificar si ya existe usando Sequelize model
    const existe = await Emprendedor.findOne({
      where: { firebase_uid },
      attributes: ['id_emprendedor'],
      transaction
    });

    if (existe) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Este usuario ya está registrado' 
      });
    }

    // Obtener un usuario admin para registrado_por
    const adminUser = await sequelize.query(
      'SELECT id_usuario FROM usuarios WHERE rol IN ("superusuario", "administrador") LIMIT 1',
      {
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    );

    const registrado_por = adminUser.length > 0 ? adminUser[0].id_usuario : 1;

    // Insertar nuevo emprendedor usando Sequelize model
    const nuevoEmprendedor = await Emprendedor.create({
      firebase_uid,
      nombre_completo,
      correo_electronico,
      telefono: telefono || null,
      dpi: dpi || null,
      fecha_nacimiento: fecha_nacimiento || null,
      genero: genero || null,
      id_municipio: id_municipio || null,
      direccion_detallada: direccion_detallada || null,
      nombre_emprendimiento: nombre_emprendimiento || null,
      descripcion_emprendimiento: descripcion_emprendimiento || null,
      id_sector: id_sector || null,
      fase_emprendimiento: fase_emprendimiento || 'idea',
      tiene_cuenta: 1,
      cuenta_activa: 1,
      registrado_por,
      foto_perfil: req.body.foto_perfil || null
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Emprendedor registrado exitosamente'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al registrar emprendedor:', error);
    res.status(500).json({ 
      error: 'Error al registrar emprendedor',
      details: error.message 
    });
  }
};

/**
 * Actualizar fecha de último acceso
 */
const actualizarUltimoAcceso = async (req, res) => {
  try {
    const { uid } = req;

    await Emprendedor.update(
      { fecha_ultimo_acceso: new Date() },
      { where: { firebase_uid: uid } }
    );

    res.json({ message: 'Último acceso actualizado' });

  } catch (error) {
    console.error('Error al actualizar último acceso:', error);
    res.status(500).json({ 
      error: 'Error al actualizar último acceso',
      details: error.message 
    });
  }
};

module.exports = {
  obtenerPerfil,
  registrarEmprendedor,
  actualizarUltimoAcceso
};
