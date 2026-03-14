const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let firebaseApp = null;

/**
 * Inicializa Firebase Admin SDK
 * Soporta dos métodos de configuración:
 * 1. Archivo JSON de credenciales (GOOGLE_APPLICATION_CREDENTIALS)
 * 2. Variables de entorno individuales (FIREBASE_PROJECT_ID, etc.)
 */
function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Método 1: Usar archivo de credenciales JSON
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentialsPath && fs.existsSync(credentialsPath)) {
      const serviceAccount = require(path.resolve(credentialsPath));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin inicializado con archivo de credenciales');
      return firebaseApp;
    }

    // Método 2: Usar variables de entorno
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY) {
      
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      console.log('✅ Firebase Admin inicializado con variables de entorno');
      return firebaseApp;
    }

    // Si no hay configuración, advertir pero no fallar
    console.warn('⚠️  Firebase Admin no configurado. El sistema funcionará con JWT solamente.');
    console.warn('   Para habilitar Firebase, configura GOOGLE_APPLICATION_CREDENTIALS o las variables de Firebase en .env');
    return null;

  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error.message);
    console.warn('   El sistema continuará funcionando con JWT solamente');
    return null;
  }
}

/**
 * Verifica un token de Firebase
 * @param {string} token - Token de Firebase
 * @returns {Promise<object>} - Datos decodificados del token
 */
async function verifyFirebaseToken(token) {
  if (!firebaseApp) {
    throw new Error('Firebase Admin no está inicializado');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Token de Firebase inválido: ' + error.message);
  }
}

/**
 * Obtiene el Auth de Firebase Admin
 */
function getAuth() {
  if (!firebaseApp) {
    throw new Error('Firebase Admin no está inicializado');
  }
  return admin.auth();
}

/**
 * Verifica si Firebase está configurado
 */
function isFirebaseConfigured() {
  return firebaseApp !== null;
}

module.exports = {
  initializeFirebase,
  verifyFirebaseToken,
  getAuth,
  isFirebaseConfigured
};
