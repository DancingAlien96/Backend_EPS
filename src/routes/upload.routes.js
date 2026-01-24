const express = require('express');
const multer = require('multer');
const { subirImagen } = require('../controllers/Upload.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para memoria (no guardar en disco)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Ruta para subir imagen (protegida con autenticación)
router.post('/imagen', authenticateToken, upload.single('foto'), subirImagen);

module.exports = router;
