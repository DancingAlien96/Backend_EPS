const { sequelize } = require('../config/database');

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    const { uid } = req;

    // Buscar en emprendedores por firebase_uid
    const emprendedores = await sequelize.query(
      `SELECT 
        id_emprendedor as id,
        nombre_completo,
        correo_electronico,
        firebase_uid,
        foto_perfil,
        telefono,
        nombre_emprendimiento,
        CASE WHEN nombre_emprendimiento IS NULL OR nombre_emprendimiento = '' THEN 'usuario' ELSE 'emprendedor' END as rol,
        tiene_cuenta,
        cuenta_activa
      FROM emprendedores 
      WHERE firebase_uid = ?`,
      {
        replacements: [uid],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (emprendedores.length > 0) {
      const perfil = emprendedores[0];
      
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

    // Verificar si ya existe
    const existe = await sequelize.query(
      'SELECT id_emprendedor FROM emprendedores WHERE firebase_uid = ?',
      {
        replacements: [firebase_uid],
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    );

    if (existe.length > 0) {
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

    // Insertar nuevo emprendedor
    await sequelize.query(
      `INSERT INTO emprendedores (
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
        fase_emprendimiento,
        tiene_cuenta,
        cuenta_activa,
        registrado_por,
        foto_perfil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`,
      {
        replacements: [
          firebase_uid,
          nombre_completo,
          correo_electronico,
          telefono || null,
          dpi || null,
          fecha_nacimiento || null,
          genero || null,
          id_municipio || null,
          direccion_detallada || null,
          nombre_emprendimiento || null,
          descripcion_emprendimiento || null,
          id_sector || null,
          fase_emprendimiento || 'idea',
          registrado_por,
          req.body.foto_perfil || null
        ],
        type: sequelize.QueryTypes.INSERT,
        transaction
      }
    );

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

    await sequelize.query(
      'UPDATE emprendedores SET fecha_ultimo_acceso = NOW() WHERE firebase_uid = ?',
      {
        replacements: [uid],
        type: sequelize.QueryTypes.UPDATE
      }
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
