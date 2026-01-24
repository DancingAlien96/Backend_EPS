const Emprendedor = require('../models/Emprendedor.model');
const MunicipioGT = require('../models/MunicipioGT.model');
const Departamento = require('../models/Departamento.model');
const Usuario = require('../models/Usuario.model');
const SectorEconomico = require('../models/SectorEconomico.model');

// Obtener todos los emprendedores
const obtenerEmprendedores = async (req, res) => {
  try {
    const { municipio, limite, pagina } = req.query;
    
    const where = {};
    if (municipio) where.id_municipio = municipio;

    const options = {
      where,
      include: [
        { model: MunicipioGT, as: 'municipio' },
        { model: Departamento, as: 'departamento_emprendimiento' },
        { model: SectorEconomico, as: 'sector' },
        { model: Usuario, as: 'registrador', attributes: ['nombre_completo'] }
      ],
      order: [['fecha_registro', 'DESC']]
    };

    if (limite) {
      const lim = parseInt(limite);
      const pag = pagina ? parseInt(pagina) : 1;
      options.limit = lim;
      options.offset = (pag - 1) * lim;
    }

    const emprendedores = await Emprendedor.findAll(options);
    res.json(emprendedores);
  } catch (error) {
    console.error('Error al obtener emprendedores:', error);
    res.status(500).json({ error: 'Error al obtener emprendedores' });
  }
};

// Obtener emprendedor por ID con sus emprendimientos
const obtenerEmprendedorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const emprendedor = await Emprendedor.findByPk(id, {
      include: [
        { model: MunicipioGT, as: 'municipio' },
        { model: Departamento, as: 'departamento_emprendimiento' },
        { model: SectorEconomico, as: 'sector' },
        { model: Usuario, as: 'registrador', attributes: ['nombre_completo'] },
      ]
    });

    if (!emprendedor) {
      return res.status(404).json({ error: 'Emprendedor no encontrado' });
    }

    res.json(emprendedor);
  } catch (error) {
    console.error('Error al obtener emprendedor:', error);
    res.status(500).json({ error: 'Error al obtener emprendedor' });
  }
};

// Crear nuevo emprendedor
const crearEmprendedor = async (req, res) => {
  try {
    const {
      nombre_completo, dpi, fecha_nacimiento, genero, telefono,
      telefono_secundario, correo_electronico, id_municipio,
      direccion_detallada, foto_perfil, observaciones,
      ...restoCampos
    } = req.body;

    if (!nombre_completo || !dpi || !fecha_nacimiento || !telefono || !id_municipio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const nuevoEmprendedor = await Emprendedor.create({
      nombre_completo, dpi, fecha_nacimiento, genero, telefono,
      telefono_secundario, correo_electronico, id_municipio,
      direccion_detallada, foto_perfil, observaciones,
      ...restoCampos,
      registrado_por: req.usuario.id_usuario
    });

    res.status(201).json({
      mensaje: 'Emprendedor creado exitosamente',
      id_emprendedor: nuevoEmprendedor.id_emprendedor
    });
  } catch (error) {
    console.error('Error al crear emprendedor:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El DPI ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear emprendedor' });
  }
};

// Actualizar emprendedor
const actualizarEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendedor = await Emprendedor.findByPk(id);

    if (!emprendedor) {
      return res.status(404).json({ error: 'Emprendedor no encontrado' });
    }

    await emprendedor.update(req.body);
    res.json({ mensaje: 'Emprendedor actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar emprendedor:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El DPI ya está en uso' });
    }
    res.status(500).json({ error: 'Error al actualizar emprendedor' });
  }
};

// Eliminar emprendedor
const eliminarEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendedor = await Emprendedor.findByPk(id);

    if (!emprendedor) {
      return res.status(404).json({ error: 'Emprendedor no encontrado' });
    }

    await emprendedor.destroy();
    res.json({ mensaje: 'Emprendedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar emprendedor:', error);
    res.status(500).json({ error: 'Error al eliminar emprendedor' });
  }
};

// Buscar emprendedores
const buscarEmprendedores = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    const { Op } = require('sequelize');
    const emprendedores = await Emprendedor.findAll({
      where: {
        [Op.or]: [
          { nombre_completo: { [Op.like]: `%${q}%` } },
          { dpi: { [Op.like]: `%${q}%` } },
          { telefono: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [
        { model: MunicipioGT, as: 'municipio' },
        { model: Departamento, as: 'departamento_emprendimiento' },
        { model: SectorEconomico, as: 'sector' }
      ],
      order: [['nombre_completo', 'ASC']]
    });

    res.json(emprendedores);
  } catch (error) {
    console.error('Error al buscar emprendedores:', error);
    res.status(500).json({ error: 'Error al buscar emprendedores' });
  }
};

module.exports = {
  obtenerEmprendedores,
  obtenerEmprendedorPorId,
  crearEmprendedor,
  actualizarEmprendedor,
  eliminarEmprendedor,
  buscarEmprendedores
};
