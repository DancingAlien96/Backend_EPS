const { IndicadorDesempeno, Emprendimiento, Usuario } = require('../models/IndicadorDesempeno.model');

const obtenerIndicadores = async (req, res) => {
  try {
    const { id_emprendimiento, periodo_año, periodo_mes } = req.query;
    const where = {};
    
    if (id_emprendimiento) where.id_emprendimiento = id_emprendimiento;
    if (periodo_año) where.periodo_año = periodo_año;
    if (periodo_mes) where.periodo_mes = periodo_mes;

    const indicadores = await IndicadorDesempeno.findAll({
      where,
      include: [
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'registrador', attributes: ['id_usuario', 'nombre_completo'] }
      ],
      order: [['periodo_año', 'DESC'], ['periodo_mes', 'DESC']]
    });

    res.json(indicadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerIndicadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const indicador = await IndicadorDesempeno.findByPk(id, {
      include: [
        { model: Emprendimiento, as: 'emprendimiento' },
        { model: Usuario, as: 'registrador', attributes: ['id_usuario', 'nombre_completo'] }
      ]
    });

    if (!indicador) {
      return res.status(404).json({ error: 'Indicador no encontrado' });
    }

    res.json(indicador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrarIndicador = async (req, res) => {
  try {
    const {
      id_emprendimiento,
      periodo_mes,
      periodo_año,
      ventas_mensuales,
      unidades_vendidas,
      nuevos_clientes,
      empleos_generados,
      inversion_realizada,
      utilidad_neta,
      observaciones
    } = req.body;

    // Verificar si ya existe un indicador para ese periodo
    const existente = await IndicadorDesempeno.findOne({
      where: { id_emprendimiento, periodo_mes, periodo_año }
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un indicador para este periodo' });
    }

    const indicador = await IndicadorDesempeno.create({
      id_emprendimiento,
      periodo_mes,
      periodo_año,
      ventas_mensuales,
      unidades_vendidas,
      nuevos_clientes,
      empleos_generados,
      inversion_realizada,
      utilidad_neta,
      observaciones,
      registrado_por: req.usuario.id_usuario
    });

    res.status(201).json(indicador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarIndicador = async (req, res) => {
  try {
    const { id } = req.params;
    const indicador = await IndicadorDesempeno.findByPk(id);

    if (!indicador) {
      return res.status(404).json({ error: 'Indicador no encontrado' });
    }

    await indicador.update(req.body);
    res.json(indicador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarIndicador = async (req, res) => {
  try {
    const { id } = req.params;
    const indicador = await IndicadorDesempeno.findByPk(id);

    if (!indicador) {
      return res.status(404).json({ error: 'Indicador no encontrado' });
    }

    await indicador.destroy();
    res.json({ mensaje: 'Indicador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerEstadisticasEmprendimiento = async (req, res) => {
  try {
    const { id_emprendimiento } = req.params;

    const indicadores = await IndicadorDesempeno.findAll({
      where: { id_emprendimiento },
      order: [['periodo_año', 'ASC'], ['periodo_mes', 'ASC']]
    });

    // Calcular totales y promedios
    const totales = indicadores.reduce((acc, ind) => ({
      ventas_totales: acc.ventas_totales + (parseFloat(ind.ventas_mensuales) || 0),
      unidades_totales: acc.unidades_totales + (ind.unidades_vendidas || 0),
      clientes_totales: acc.clientes_totales + (ind.nuevos_clientes || 0),
      empleos_totales: acc.empleos_totales + (ind.empleos_generados || 0)
    }), { ventas_totales: 0, unidades_totales: 0, clientes_totales: 0, empleos_totales: 0 });

    const promedios = {
      ventas_promedio: totales.ventas_totales / indicadores.length || 0,
      unidades_promedio: totales.unidades_totales / indicadores.length || 0,
      clientes_promedio: totales.clientes_totales / indicadores.length || 0,
      empleos_promedio: totales.empleos_totales / indicadores.length || 0
    };

    res.json({
      indicadores,
      totales,
      promedios,
      total_periodos: indicadores.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerIndicadores,
  obtenerIndicadorPorId,
  registrarIndicador,
  actualizarIndicador,
  eliminarIndicador,
  obtenerEstadisticasEmprendimiento
};
