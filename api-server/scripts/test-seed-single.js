/**
 * Test rápido del seed con un solo vehículo
 */

import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const connectionConfig = {
  connectionString: process.env.DATABASE_URL
};

const urlLowerCase = (process.env.DATABASE_URL || '').toLowerCase();
if (urlLowerCase.includes('supabase') || urlLowerCase.includes('azure') || urlLowerCase.includes('sslmode=require')) {
  connectionConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(connectionConfig);

async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'EcoRueda/1.0' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const address = data.address || {};
    
    // Canton: En Costa Rica es city_district o town (NO usar city que es "Área Metropolitana")
    const canton = address.city_district || address.town || address.county || address.municipality || 'Desconocido';
    
    // Distrito: Es neighbourhood o village
    const distrito = address.neighbourhood || address.village || address.suburb || address.hamlet || 'Centro';
    
    return { canton, distrito, fullAddress: data.display_name };
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    return { canton: null, distrito: null, fullAddress: 'Error' };
  }
}

async function testSingleVehicle() {
  console.log('[TEST] Iniciando prueba de seed...\n');
  
  const testVehicle = {
    company: 'tier',
    type: 'scooter',
    lat: 9.9334,
    lng: -84.0834,
    battery: 85,
    pricePerMin: 3.5
  };
  
  const client = await pool.connect();
  
  try {
    // 1. Verificar si ya existe
    console.log('[1/5] Verificando duplicados...');
    const existsResult = await client.query(
      'SELECT id FROM vehicles WHERE lat = $1 AND lng = $2 LIMIT 1',
      [testVehicle.lat, testVehicle.lng]
    );
    
    if (existsResult.rowCount > 0) {
      console.log(`  Ya existe vehiculo en (${testVehicle.lat}, ${testVehicle.lng})`);
      console.log(`  ID: ${existsResult.rows[0].id}`);
      console.log('\n[SKIP] No se insertará. Prueba exitosa (detección de duplicados funciona).\n');
      return;
    }
    console.log('  OK - No hay duplicados\n');
    
    // 2. Generar UUID
    console.log('[2/5] Generando UUID...');
    const id = uuidv4();
    console.log(`  UUID: ${id}\n`);
    
    // 3. Consultar Nominatim
    console.log('[3/5] Consultando Nominatim...');
    const location = await getLocationFromCoords(testVehicle.lat, testVehicle.lng);
    console.log(`  Canton: ${location.canton}`);
    console.log(`  Distrito: ${location.distrito}`);
    console.log(`  Dirección: ${location.fullAddress?.substring(0, 80)}...\n`);
    
    // 4. Insertar con transacción
    console.log('[4/5] Insertando con transacción...');
    await client.query('BEGIN');
    
    const insertQuery = `
      INSERT INTO vehicles (
        id, company, type, lat, lng, battery, price_per_min, 
        status, canton, distrito, reserved, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
      )
      RETURNING id, company, type, canton, distrito, status
    `;
    
    const result = await client.query(insertQuery, [
      id,
      testVehicle.company,
      testVehicle.type,
      testVehicle.lat,
      testVehicle.lng,
      testVehicle.battery,
      testVehicle.pricePerMin,
      'available',
      location.canton,
      location.distrito,
      false
    ]);
    
    await client.query('COMMIT');
    console.log('  Transacción completada');
    console.log('  Vehiculo insertado:', result.rows[0]);
    
    // 5. Verificar lectura
    console.log('\n[5/5] Verificando lectura...');
    const verifyResult = await client.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [id]
    );
    
    if (verifyResult.rowCount === 1) {
      console.log('  OK - Vehiculo leído correctamente');
      console.log('  Datos:', verifyResult.rows[0]);
    }
    
    console.log('\n[SUCCESS] Prueba completada exitosamente');
    console.log('\nPara eliminar este vehiculo de prueba:');
    console.log(`DELETE FROM vehicles WHERE id = '${id}';`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[ERROR]', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testSingleVehicle();
