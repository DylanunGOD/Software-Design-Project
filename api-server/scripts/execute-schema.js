const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Hardcoded connection string to avoid PowerShell environment variable issues
const connectionString = 'postgresql://postgres:Cu@.Lquier@@db.ljtnpwyzylrunnkuxshh.supabase.co:5432/postgres';

async function executeSchema() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conexión establecida');

    const schemaPath = path.join(__dirname, 'schema-postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Ejecutando schema SQL...');
    await client.query(schema);
    console.log('✅ Schema ejecutado correctamente');

    // Verificar tablas creadas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📊 Tablas creadas:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Código de error:', error.code);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

executeSchema()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
