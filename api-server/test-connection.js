import pkg from 'pg';
import dotenv from 'dotenv';
const { Client } = pkg;

dotenv.config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
    console.log('\nIntentando conectar...');
    
    await client.connect();
    console.log('✓ Conexión exitosa!\n');

    const result = await client.query('SELECT version();');
    console.log('PostgreSQL version:');
    console.log(result.rows[0].version);

    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('\n✓ Tablas encontradas:');
    tables.rows.forEach(row => console.log(`  - ${row.tablename}`));

  } catch (error) {
    console.error('✗ Error de conexión:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
