const { sequelize } = require('../config/database');

const crearLike = async (req, res) => {
  try {
    const { id_noticia } = req.body;
    const uid = req.uid; // firebase uid

    // Obtener id_usuario si existe en tabla usuarios o emprendedores
    const userRows = await sequelize.query(
      'SELECT id_usuario FROM usuarios WHERE firebase_uid = ? LIMIT 1',
      { replacements: [uid], type: sequelize.QueryTypes.SELECT }
    );

    let id_usuario = userRows.length > 0 ? userRows[0].id_usuario : null;
    if (!id_usuario) {
      // intentar emprendedores
      const emp = await sequelize.query('SELECT id_emprendedor as id_usuario FROM emprendedores WHERE firebase_uid = ? LIMIT 1', { replacements: [uid], type: sequelize.QueryTypes.SELECT });
      if (emp.length > 0) id_usuario = emp[0].id_usuario;
    }

    if (!id_usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    // Insertar like si no existe
    await sequelize.query(
      'INSERT IGNORE INTO likes (id_usuario, id_noticia) VALUES (?, ?)',
      { replacements: [id_usuario, id_noticia], type: sequelize.QueryTypes.INSERT }
    );

    return res.json({ message: 'Like registrado' });
  } catch (error) {
    console.error('Error crearLike:', error);
    return res.status(500).json({ error: 'Error al registrar like' });
  }
};

const quitarLike = async (req, res) => {
  try {
    const { id } = req.params; // id_like
    const uid = req.uid;

    // Verificar propietario
    const rows = await sequelize.query('SELECT l.id_like FROM likes l JOIN usuarios u ON l.id_usuario = u.id_usuario WHERE l.id_like = ? AND u.firebase_uid = ? LIMIT 1', { replacements: [id, uid], type: sequelize.QueryTypes.SELECT });
    if (rows.length === 0) return res.status(403).json({ error: 'No autorizado' });

    await sequelize.query('DELETE FROM likes WHERE id_like = ?', { replacements: [id], type: sequelize.QueryTypes.DELETE });
    return res.json({ message: 'Like eliminado' });
  } catch (error) {
    console.error('Error quitarLike:', error);
    return res.status(500).json({ error: 'Error al eliminar like' });
  }
};

const listarLikesUsuario = async (req, res) => {
  try {
    const uid = req.uid;

    const rows = await sequelize.query(
      `SELECT l.id_like, l.id_noticia, l.fecha_creacion
       FROM likes l
       JOIN usuarios u ON l.id_usuario = u.id_usuario
       WHERE u.firebase_uid = ?`,
      { replacements: [uid], type: sequelize.QueryTypes.SELECT }
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error listarLikesUsuario:', error);
    return res.status(500).json({ error: 'Error al listar likes' });
  }
};

const contarLikesNoticia = async (req, res) => {
  try {
    const { id_noticia } = req.params;
    const rows = await sequelize.query('SELECT COUNT(*) as total FROM likes WHERE id_noticia = ?', { replacements: [id_noticia], type: sequelize.QueryTypes.SELECT });
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error contarLikesNoticia:', error);
    return res.status(500).json({ error: 'Error al contar likes' });
  }
};

module.exports = { crearLike, quitarLike, listarLikesUsuario, contarLikesNoticia };
