const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// Load .env from backend root explicitly
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const mysql = require('mysql2');

const MIGRATION_PATH = path.resolve(__dirname, '..', '..', 'prototipos eps', 'bd', 'migracion_add_usuario_role.sql');

const DB_NAME = process.env.DB_NAME || 'sistema_emprendedores_chiquimula';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

async function run() {
  console.log('Leyendo archivo de migración:', MIGRATION_PATH);
  const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');

  const connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error conectando a MySQL:', err.message);
      process.exit(1);
    }

    console.log('Conectado a MySQL en', `${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error ejecutando migración:', err.message);
        connection.end();
        process.exit(1);
      }

      console.log('Migración ejecutada correctamente. Resultados:' );
      console.log(results);
      connection.end();
    });
  });
}

run();
