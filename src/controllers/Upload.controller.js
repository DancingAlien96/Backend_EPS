const cloudinary = require('../config/cloudinary');

// Subir imagen a Cloudinary
const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    console.log('📤 Subiendo imagen a Cloudinary...', {
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    });

    // Convertir buffer a base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Subir a Cloudinary con opciones optimizadas
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'emprendedores',
      resource_type: 'auto',
      timeout: 60000,
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Limitar tamaño máximo
        { quality: 'auto:good' } // Calidad automática
      ]
    });

    console.log('✅ Imagen subida exitosamente:', result.secure_url);

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('❌ Error al subir imagen a Cloudinary:', error);
    res.status(500).json({ 
      error: 'Error al subir la imagen', 
      details: error.message 
    });
  }
};

module.exports = {
  subirImagen
};
