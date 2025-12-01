import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Client } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Conectando a Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Conexión establecida\n');

    const schemaPath = join(__dirname, 'schema-postgres.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    console.log('📝 Ejecutando schema SQL...');
    await client.query(schema);
    console.log('✅ Schema ejecutado correctamente\n');

    // Verificar tablas creadas
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('✅ Tablas creadas en Supabase:');
    result.rows.forEach(row => console.log(`   📋 ${row.tablename}`));
    
    console.log('\n🎉 ¡Base de datos configurada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
