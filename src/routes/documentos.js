const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  obtenerDocumentos,
  obtenerDocumentoPorId,
  subirDocumento,
  actualizarDocumento,
  eliminarDocumento,
  obtenerDocumentosVencidos
} = require('../controllers/Documento.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerDocumentos);
router.get('/vencidos', obtenerDocumentosVencidos);
router.get('/:id', obtenerDocumentoPorId);
router.post('/', subirDocumento);
router.put('/:id', actualizarDocumento);
router.delete('/:id', eliminarDocumento);

module.exports = router;
