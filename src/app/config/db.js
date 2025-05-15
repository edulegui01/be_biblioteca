// config/db.js
import  'dotenv/config'
import pg from 'pg'

const { Pool } = pg;


const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  await db.connect();
  console.log('Conexión exitosa a la base de datos');
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
}

export default db;

