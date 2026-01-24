const { DocumentoEmprendedor, Emprendedor, Emprendimiento, Usuario } = require('../models/DocumentoEmprendedor.model');

const obtenerDocumentos = async (req, res) => {
  try {
    const { id_emprendedor, id_emprendimiento, tipo_documento, estado_documento } = req.query;
    const where = {};
    
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;
    if (id_emprendimiento) where.id_emprendimiento = id_emprendimiento;
    if (tipo_documento) where.tipo_documento = tipo_documento;
    if (estado_documento) where.estado_documento = estado_documento;

    const documentos = await DocumentoEmprendedor.findAll({
      where,
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'subidor', attributes: ['id_usuario', 'nombre_completo'] }
      ],
      order: [['fecha_subida', 'DESC']]
    });

    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerDocumentoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await DocumentoEmprendedor.findByPk(id, {
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'subidor', attributes: ['id_usuario', 'nombre_completo'] }
      ]
    });

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const subirDocumento = async (req, res) => {
  try {
    const {
      id_emprendedor,
      id_emprendimiento,
      nombre_documento,
      tipo_documento,
      descripcion,
      ruta_archivo,
      tamaño_archivo,
      tipo_mime,
      fecha_emision,
      fecha_vencimiento,
      confidencial
    } = req.body;

    const documento = await DocumentoEmprendedor.create({
      id_emprendedor,
      id_emprendimiento,
      nombre_documento,
      tipo_documento,
      descripcion,
      ruta_archivo,
      tamaño_archivo,
      tipo_mime,
      fecha_emision,
      fecha_vencimiento,
      confidencial,
      subido_por: req.user.id_usuario
    });

    res.status(201).json(documento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await DocumentoEmprendedor.findByPk(id);

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    await documento.update(req.body);
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await DocumentoEmprendedor.findByPk(id);

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    await documento.destroy();
    res.json({ mensaje: 'Documento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerDocumentosVencidos = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    
    const documentos = await DocumentoEmprendedor.findAll({
      where: {
        fecha_vencimiento: {
          [Op.lte]: new Date()
        },
        estado_documento: {
          [Op.ne]: 'vencido'
        }
      },
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: Emprendimiento, as: 'emprendimiento' }
      ]
    });

    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerDocumentos,
  obtenerDocumentoPorId,
  subirDocumento,
  actualizarDocumento,
  eliminarDocumento,
  obtenerDocumentosVencidos
};
