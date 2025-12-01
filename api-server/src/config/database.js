import pkg from 'pg';
const { Pool } = pkg;
import config from './env.js';

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Error en el pool de base de datos:', err);
});

export const query = (text, params) => pool.query(text, params);

export const connect = async () => {
  try {
    const client = await pool.connect();
    console.log('✓ Conectado a la base de datos');
    client.release();
  } catch (err) {
    if (config.NODE_ENV === 'development') {
      console.warn('⚠ Base de datos no disponible en desarrollo. Continuando sin BD...');
      return;
    }
    console.error('✗ Error conectando a la base de datos:', err);
    process.exit(1);
  }
};

export default pool;
