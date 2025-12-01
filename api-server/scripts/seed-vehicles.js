/**
 * Script para insertar vehículos en la base de datos
 * Garantiza:
 * - UUIDs únicos generados por uuid library
 * - Validación de coordenadas con Nominatim
 * - Transacciones atómicas
 * - Verificación de duplicados
 * 
 * Uso: node api-server/scripts/seed-vehicles.js
 */

import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '../.env') });

// Configuración de base de datos
const connectionConfig = {
  connectionString: process.env.DATABASE_URL
};

// Detectar si necesita SSL (Supabase, Azure, etc.)
const urlLowerCase = (process.env.DATABASE_URL || '').toLowerCase();
if (urlLowerCase.includes('supabase') || urlLowerCase.includes('azure') || urlLowerCase.includes('sslmode=require')) {
  connectionConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(connectionConfig);

// Datos de vehículos a insertar
const VEHICLES_DATA = [
  // Tier - San José Centro
  { company: 'tier', type: 'scooter', lat: 9.9334, lng: -84.0834, battery: 85, pricePerMin: 3.5 },
  { company: 'tier', type: 'scooter', lat: 9.9326, lng: -84.0793, battery: 92, pricePerMin: 3.5 },
  { company: 'tier', type: 'bike', lat: 9.9350, lng: -84.0881, battery: 78, pricePerMin: 2.5 },
  { company: 'tier', type: 'scooter', lat: 9.9185, lng: -84.1372, battery: 65, pricePerMin: 3.5 },
  { company: 'tier', type: 'bike', lat: 9.9155, lng: -84.1425, battery: 90, pricePerMin: 2.5 },
  
  // Lime - San José y alrededores
  { company: 'lime', type: 'scooter', lat: 9.9330, lng: -84.0774, battery: 88, pricePerMin: 3.0 },
  { company: 'lime', type: 'bike', lat: 9.9989, lng: -84.1169, battery: 95, pricePerMin: 2.0 },
  { company: 'lime', type: 'scooter', lat: 10.0024, lng: -84.1208, battery: 70, pricePerMin: 3.0 },
  { company: 'lime', type: 'scooter', lat: 10.0162, lng: -84.2116, battery: 82, pricePerMin: 3.0 },
  { company: 'lime', type: 'bike', lat: 10.0189, lng: -84.2143, battery: 91, pricePerMin: 2.0 },
  
  // Bird - Zona oeste y este
  { company: 'bird', type: 'scooter', lat: 9.9384, lng: -84.1870, battery: 75, pricePerMin: 3.2 },
  { company: 'bird', type: 'scooter', lat: 9.9428, lng: -84.1805, battery: 80, pricePerMin: 3.2 },
  { company: 'bird', type: 'bike', lat: 9.8644, lng: -83.9190, battery: 87, pricePerMin: 2.2 },
  { company: 'bird', type: 'scooter', lat: 9.8621, lng: -83.9235, battery: 93, pricePerMin: 3.2 },
  { company: 'bird', type: 'bike', lat: 9.9225, lng: -84.0538, battery: 68, pricePerMin: 2.2 },
];

/**
 * Obtener ubicación desde coordenadas usando Nominatim
 */
async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EcoRueda/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const address = data.address || {};
    
    // Canton: En Costa Rica es city_district o town (NO usar city que es "Área Metropolitana")
    const canton = address.city_district || 
                   address.town || 
                   address.county ||
                   address.municipality ||
                   'Desconocido';
    
    // Distrito: Es neighbourhood o village
    const distrito = address.neighbourhood || 
                     address.village ||
                     address.suburb ||
                     address.hamlet ||
                     'Centro';
    
    return { canton, distrito };
  } catch (error) {
    console.error(`[ERROR] Nominatim falló para (${lat}, ${lng}): ${error.message}`);
    return { canton: null, distrito: null };
  }
}

/**
 * Verificar si existe vehículo con coordenadas exactas
 */
async function vehicleExists(client, lat, lng) {
  const result = await client.query(
    'SELECT id FROM vehicles WHERE lat = $1 AND lng = $2 LIMIT 1',
    [lat, lng]
  );
  return result.rowCount > 0;
}

/**
 * Insertar vehículo en base de datos
 */
async function insertVehicle(client, vehicle) {
  const id = uuidv4();
  
  const query = `
    INSERT INTO vehicles (
      id, company, type, lat, lng, battery, price_per_min, 
      status, canton, distrito, reserved, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
    )
    RETURNING id, company, type, canton, distrito
  `;
  
  const values = [
    id,
    vehicle.company,
    vehicle.type,
    vehicle.lat,
    vehicle.lng,
    vehicle.battery,
    vehicle.pricePerMin,
    'available',
    vehicle.canton,
    vehicle.distrito,
    false
  ];
  
  const result = await client.query(query, values);
  return result.rows[0];
}

/**
 * Procesar e insertar todos los vehículos
 */
async function seedVehicles() {
  console.log('[INICIO] Seed de vehiculos\n');
  console.log(`Total a procesar: ${VEHICLES_DATA.length} vehiculos\n`);
  
  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  
  try {
    for (let i = 0; i < VEHICLES_DATA.length; i++) {
      const vehicle = VEHICLES_DATA[i];
      const num = i + 1;
      
      console.log(`[${num}/${VEHICLES_DATA.length}] Procesando ${vehicle.company} ${vehicle.type} en (${vehicle.lat}, ${vehicle.lng})`);
      
      try {
        // Iniciar transacción
        await client.query('BEGIN');
        
        // Verificar duplicado
        const exists = await vehicleExists(client, vehicle.lat, vehicle.lng);
        if (exists) {
          console.log(`  [SKIP] Ya existe vehiculo en esta ubicacion\n`);
          await client.query('ROLLBACK');
          skipped++;
          continue;
        }
        
        // Obtener ubicación de Nominatim
        console.log(`  [API] Consultando Nominatim...`);
        const location = await getLocationFromCoords(vehicle.lat, vehicle.lng);
        
        if (!location.canton) {
          console.log(`  [WARN] No se pudo obtener ubicacion, insertando sin canton/distrito`);
        } else {
          console.log(`  [OK] ${location.canton} - ${location.distrito}`);
        }
        
        // Insertar vehículo
        const vehicleWithLocation = {
          ...vehicle,
          canton: location.canton,
          distrito: location.distrito
        };
        
        const result = await insertVehicle(client, vehicleWithLocation);
        
        // Confirmar transacción
        await client.query('COMMIT');
        
        console.log(`  [INSERT] ID: ${result.id.substring(0, 8)}...`);
        console.log(`  [SUCCESS] Vehiculo insertado correctamente\n`);
        inserted++;
        
        // Esperar 1.1 segundos (límite de Nominatim)
        if (i < VEHICLES_DATA.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1100));
        }
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`  [ERROR] ${error.message}\n`);
        errors++;
      }
    }
    
  } finally {
    client.release();
  }
  
  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN DE EJECUCION');
  console.log('='.repeat(60));
  console.log(`Total procesados: ${VEHICLES_DATA.length}`);
  console.log(`Insertados:       ${inserted}`);
  console.log(`Omitidos:         ${skipped} (duplicados)`);
  console.log(`Errores:          ${errors}`);
  console.log('='.repeat(60) + '\n');
  
  await pool.end();
  
  if (errors > 0) {
    process.exit(1);
  }
}

// Ejecutar
seedVehicles().catch((error) => {
  console.error('[FATAL]', error);
  process.exit(1);
});
