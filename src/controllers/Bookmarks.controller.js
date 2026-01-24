const { sequelize } = require('../config/database');

const crearBookmark = async (req, res) => {
  try {
    const { id_noticia } = req.body;
    const uid = req.uid;

    // Obtener id_usuario
    const userRows = await sequelize.query('SELECT id_usuario FROM usuarios WHERE firebase_uid = ? LIMIT 1', { replacements: [uid], type: sequelize.QueryTypes.SELECT });
    let id_usuario = userRows.length > 0 ? userRows[0].id_usuario : null;
    if (!id_usuario) {
      const emp = await sequelize.query('SELECT id_emprendedor as id_usuario FROM emprendedores WHERE firebase_uid = ? LIMIT 1', { replacements: [uid], type: sequelize.QueryTypes.SELECT });
      if (emp.length > 0) id_usuario = emp[0].id_usuario;
    }

    if (!id_usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    await sequelize.query('INSERT IGNORE INTO bookmarks (id_usuario, id_noticia) VALUES (?, ?)', { replacements: [id_usuario, id_noticia], type: sequelize.QueryTypes.INSERT });

    return res.json({ message: 'Guardado' });
  } catch (error) {
    console.error('Error crearBookmark:', error);
    return res.status(500).json({ error: 'Error al guardar' });
  }
};

const quitarBookmark = async (req, res) => {
  try {
    const { id } = req.params; // id_bookmark
    const uid = req.uid;

    const rows = await sequelize.query('SELECT b.id_bookmark FROM bookmarks b JOIN usuarios u ON b.id_usuario = u.id_usuario WHERE b.id_bookmark = ? AND u.firebase_uid = ? LIMIT 1', { replacements: [id, uid], type: sequelize.QueryTypes.SELECT });
    if (rows.length === 0) return res.status(403).json({ error: 'No autorizado' });

    await sequelize.query('DELETE FROM bookmarks WHERE id_bookmark = ?', { replacements: [id], type: sequelize.QueryTypes.DELETE });
    return res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error('Error quitarBookmark:', error);
    return res.status(500).json({ error: 'Error al eliminar bookmark' });
  }
};

const listarBookmarksUsuario = async (req, res) => {
  try {
    const uid = req.uid;
    const rows = await sequelize.query(
      `SELECT b.id_bookmark, b.id_noticia, b.fecha_creacion
       FROM bookmarks b
       JOIN usuarios u ON b.id_usuario = u.id_usuario
       WHERE u.firebase_uid = ?`,
      { replacements: [uid], type: sequelize.QueryTypes.SELECT }
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error listarBookmarksUsuario:', error);
    return res.status(500).json({ error: 'Error al listar bookmarks' });
  }
};

module.exports = { crearBookmark, quitarBookmark, listarBookmarksUsuario };
