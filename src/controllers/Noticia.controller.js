const Noticia = require('../models/Noticia.model');

const obtenerNoticias = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = {};
    
    if (estado) {
      where.estado = estado;
    } else {
      // Por defecto mostrar solo publicadas en API pública
      where.estado = 'publicado';
    }

    const noticias = await Noticia.findAll({
      where,
      order: [['fecha_publicacion', 'DESC']]
    });

    res.json(noticias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearNoticia = async (req, res) => {
  try {
    const {
      titulo,
      contenido,
      resumen,
      id_emprendedor,
      imagen_principal,
      autor,
      estado
    } = req.body;

    const noticia = await Noticia.create({
      titulo,
      contenido,
      resumen,
      id_emprendedor,
      imagen_principal,
      autor,
      estado: estado || 'borrador',
      publicado_por: req.usuario?.id_usuario || 1
    });

    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    await noticia.update(req.body);
    res.json(noticia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    await noticia.destroy();
    res.json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const publicarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    await noticia.update({ 
      estado: 'publicado',
      fecha_publicacion: new Date()
    });
    
    res.json(noticia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  publicarNoticia
};
