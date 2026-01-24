const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};

module.exports = { errorHandler, notFound };
