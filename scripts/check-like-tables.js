const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DB_NAME = process.env.DB_NAME || 'sistema_emprendedores_chiquimula';

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
  });

  const [rows] = await connection.execute(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND (TABLE_NAME LIKE '%like%' OR TABLE_NAME LIKE '%bookmark%' OR TABLE_NAME LIKE '%favorit%')`,
    [DB_NAME]
  );

  if (rows.length === 0) {
    console.log('No se encontraron tablas con "like" o "bookmark" en el nombre.');
  } else {
    console.log('Tablas encontradas:');
    rows.forEach(r => console.log(' -', r.TABLE_NAME));
  }

  await connection.end();
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
