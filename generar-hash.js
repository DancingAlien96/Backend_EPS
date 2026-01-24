const bcrypt = require('bcrypt');

async function generarHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n════════════════════════════════════════');
  console.log('🔐 GENERADOR DE HASH BCRYPT');
  console.log('════════════════════════════════════════');
  console.log('Contraseña:', password);
  console.log('Hash:', hash);
  console.log('════════════════════════════════════════\n');
  
  // Verificar que funciona
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verificación:', isValid ? '✅ CORRECTO' : '❌ ERROR');
  console.log('\n');
}

generarHash();
