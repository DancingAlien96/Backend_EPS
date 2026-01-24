const { Emprendimiento, Emprendedor, SectorEconomico, ImagenEmprendimiento, HistorialCambioFase } = require('../models/Emprendimiento.model');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const obtenerEmprendimientos = async (req, res) => {
  try {
    const { estado, fase_emprendimiento, id_sector, id_emprendedor } = req.query;
    const where = {};
    
    if (estado) where.estado = estado;
    if (fase_emprendimiento) where.fase_emprendimiento = fase_emprendimiento;
    if (id_sector) where.id_sector = id_sector;
    if (id_emprendedor) where.id_emprendedor = id_emprendedor;

    const emprendimientos = await Emprendimiento.findAll({
      where,
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: SectorEconomico, as: 'sector' },
        { model: ImagenEmprendimiento, as: 'imagenes' }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerEmprendimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendimiento = await Emprendimiento.findByPk(id, {
      include: [
        { model: Emprendedor, as: 'emprendedor' },
        { model: SectorEconomico, as: 'sector' },
        { model: ImagenEmprendimiento, as: 'imagenes', order: [['orden', 'ASC']] }
      ]
    });

    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearEmprendimiento = async (req, res) => {
  try {
    const {
      id_emprendedor,
      nombre_emprendimiento,
      descripcion,
      id_sector,
      fase_emprendimiento,
      fecha_inicio,
      numero_empleados,
      tiene_registro_formal,
      direccion_negocio,
      telefono_negocio,
      correo_negocio,
      sitio_web,
      logo_emprendimiento
    } = req.body;

    const emprendimiento = await Emprendimiento.create({
      id_emprendedor,
      nombre_emprendimiento,
      descripcion,
      id_sector,
      fase_emprendimiento,
      fecha_inicio,
      numero_empleados,
      tiene_registro_formal,
      direccion_negocio,
      telefono_negocio,
      correo_negocio,
      sitio_web,
      logo_emprendimiento
    });

    res.status(201).json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendimiento = await Emprendimiento.findByPk(id);

    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    await emprendimiento.update(req.body);
    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cambiarFase = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { fase_nueva, justificacion, logros_alcanzados } = req.body;

    const emprendimiento = await Emprendimiento.findByPk(id);
    if (!emprendimiento) {
      await t.rollback();
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    const fase_anterior = emprendimiento.fase_emprendimiento;

    // Registrar el cambio en el historial
    await HistorialCambioFase.create({
      id_emprendimiento: id,
      fase_anterior,
      fase_nueva,
      justificacion,
      logros_alcanzados,
      modificado_por: req.user.id_usuario
    }, { transaction: t });

    // Actualizar la fase del emprendimiento
    await emprendimiento.update({ fase_emprendimiento: fase_nueva }, { transaction: t });

    await t.commit();
    res.json(emprendimiento);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

const eliminarEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendimiento = await Emprendimiento.findByPk(id);

    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    await emprendimiento.destroy();
    res.json({ mensaje: 'Emprendimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { ruta_imagen, descripcion, es_principal, orden } = req.body;

    const emprendimiento = await Emprendimiento.findByPk(id);
    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    // Si es principal, desmarcar las demás
    if (es_principal) {
      await ImagenEmprendimiento.update(
        { es_principal: false },
        { where: { id_emprendimiento: id } }
      );
    }

    const imagen = await ImagenEmprendimiento.create({
      id_emprendimiento: id,
      ruta_imagen,
      descripcion,
      es_principal,
      orden
    });

    res.status(201).json(imagen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarImagen = async (req, res) => {
  try {
    const { id, id_imagen } = req.params;

    const imagen = await ImagenEmprendimiento.findOne({
      where: { id_imagen, id_emprendimiento: id }
    });

    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await imagen.destroy();
    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerEmprendimientos,
  obtenerEmprendimientoPorId,
  crearEmprendimiento,
  actualizarEmprendimiento,
  cambiarFase,
  eliminarEmprendimiento,
  agregarImagen,
  eliminarImagen
};
