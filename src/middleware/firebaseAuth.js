const admin = require('firebase-admin');

// Inicializar Firebase Admin (solo si no está inicializado)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: 'emprendedoresgt-ad783'
    });
    console.log('✅ Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error.message);
    console.log('💡 Necesitas configurar las credenciales de Firebase Admin.');
    console.log('   Descarga el archivo JSON desde Firebase Console > Project Settings > Service Accounts');
    console.log('   Luego configura la variable de entorno: GOOGLE_APPLICATION_CREDENTIALS');
  }
}

/**
 * Middleware para verificar el token de Firebase
 */
const verificarTokenFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No se proporcionó token de autenticación' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Agregar la información del usuario a la request
    req.firebaseUser = decodedToken;
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;

    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ 
      error: 'Token inválido o expirado',
      details: error.message 
    });
  }
};

module.exports = { verificarTokenFirebase };
