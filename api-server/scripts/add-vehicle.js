/**
 * Utilidad para agregar vehículos manualmente con validación completa
 * 
 * USO:
 * node scripts/add-vehicle.js --company tier --type scooter --lat 9.9334 --lng -84.0834 --battery 85 --price 3.5
 * 
 * O importar como módulo:
 * import { addVehicle } from './add-vehicle.js';
 * await addVehicle({ company: 'tier', type: 'scooter', lat: 9.9334, lng: -84.0834, battery: 85, pricePerMin: 3.5 });
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

/**
 * Validar coordenadas de Costa Rica
 */
function validateCostaRicaCoordinates(lat, lng) {
  const CR_BOUNDS = {
    lat_min: 8.0,
    lat_max: 11.3,
    lng_min: -86.0,
    lng_max: -82.5
  };
  
  if (lat < CR_BOUNDS.lat_min || lat > CR_BOUNDS.lat_max) {
    throw new Error(`Latitud ${lat} fuera del rango de Costa Rica (${CR_BOUNDS.lat_min} - ${CR_BOUNDS.lat_max})`);
  }
  
  if (lng < CR_BOUNDS.lng_min || lng > CR_BOUNDS.lng_max) {
    throw new Error(`Longitud ${lng} fuera del rango de Costa Rica (${CR_BOUNDS.lng_min} - ${CR_BOUNDS.lng_max})`);
  }
  
  return true;
}

/**
 * Validar datos del vehículo
 */
function validateVehicleData(data) {
  const errors = [];
  
  // Company
  const validCompanies = ['tier', 'lime', 'bird'];
  if (!validCompanies.includes(data.company)) {
    errors.push(`company debe ser uno de: ${validCompanies.join(', ')}`);
  }
  
  // Type
  const validTypes = ['scooter', 'bike'];
  if (!validTypes.includes(data.type)) {
    errors.push(`type debe ser uno de: ${validTypes.join(', ')}`);
  }
  
  // Coordinates
  if (typeof data.lat !== 'number' || isNaN(data.lat)) {
    errors.push('lat debe ser un número válido');
  }
  if (typeof data.lng !== 'number' || isNaN(data.lng)) {
    errors.push('lng debe ser un número válido');
  }
  
  // Battery
  if (data.battery < 0 || data.battery > 100) {
    errors.push('battery debe estar entre 0 y 100');
  }
  
  // Price
  if (data.pricePerMin <= 0) {
    errors.push('pricePerMin debe ser mayor a 0');
  }
  
  if (errors.length > 0) {
    throw new Error(`Errores de validación:\n  - ${errors.join('\n  - ')}`);
  }
  
  try {
    validateCostaRicaCoordinates(data.lat, data.lng);
  } catch (error) {
    throw new Error(`Coordenadas inválidas: ${error.message}`);
  }
  
  return true;
}

/**
 * Obtener ubicación desde coordenadas usando Nominatim
 */
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
    
    return { canton, distrito };
  } catch (error) {
    console.warn(`[WARN] No se pudo obtener ubicación de Nominatim: ${error.message}`);
    return { canton: null, distrito: null };
  }
}

/**
 * Agregar vehículo con todas las validaciones
 */
export async function addVehicle(data) {
  // Validar datos
  validateVehicleData(data);
  
  const client = await pool.connect();
  
  try {
    // Iniciar transacción
    await client.query('BEGIN');
    
    // Verificar duplicado por coordenadas
    const existsResult = await client.query(
      'SELECT id, company, type FROM vehicles WHERE lat = $1 AND lng = $2 LIMIT 1',
      [data.lat, data.lng]
    );
    
    if (existsResult.rowCount > 0) {
      const existing = existsResult.rows[0];
      throw new Error(
        `Ya existe un vehículo en estas coordenadas:\n` +
        `  ID: ${existing.id}\n` +
        `  Company: ${existing.company}\n` +
        `  Type: ${existing.type}`
      );
    }
    
    // Generar UUID único
    const id = uuidv4();
    
    // Obtener ubicación de Nominatim
    console.log('Consultando Nominatim para validar ubicación...');
    const location = await getLocationFromCoords(data.lat, data.lng);
    
    if (!location.canton) {
      console.warn('Advertencia: No se pudo obtener canton/distrito de Nominatim');
    } else {
      console.log(`Ubicación: ${location.canton} - ${location.distrito}`);
    }
    
    // Insertar vehículo
    const insertQuery = `
      INSERT INTO vehicles (
        id, company, type, lat, lng, battery, price_per_min, 
        status, canton, distrito, reserved, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
      )
      RETURNING *
    `;
    
    const result = await client.query(insertQuery, [
      id,
      data.company,
      data.type,
      data.lat,
      data.lng,
      data.battery,
      data.pricePerMin,
      'available',
      location.canton,
      location.distrito,
      false
    ]);
    
    // Confirmar transacción
    await client.query('COMMIT');
    
    return {
      success: true,
      vehicle: result.rows[0]
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * CLI para agregar vehículos desde línea de comandos
 */
async function cli() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
USO: node add-vehicle.js [opciones]

OPCIONES:
  --company <tier|lime|bird>    Compañía del vehículo (requerido)
  --type <scooter|bike>         Tipo de vehículo (requerido)
  --lat <número>                Latitud (requerido)
  --lng <número>                Longitud (requerido)
  --battery <0-100>             Nivel de batería (requerido)
  --price <número>              Precio por minuto (requerido)
  --help                        Mostrar esta ayuda

EJEMPLO:
  node add-vehicle.js --company tier --type scooter --lat 9.9334 --lng -84.0834 --battery 85 --price 3.5
`);
    process.exit(0);
  }
  
  // Parsear argumentos
  const data = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'company':
        data.company = value;
        break;
      case 'type':
        data.type = value;
        break;
      case 'lat':
        data.lat = parseFloat(value);
        break;
      case 'lng':
        data.lng = parseFloat(value);
        break;
      case 'battery':
        data.battery = parseInt(value);
        break;
      case 'price':
        data.pricePerMin = parseFloat(value);
        break;
    }
  }
  
  // Validar que tenemos todos los campos
  const required = ['company', 'type', 'lat', 'lng', 'battery', 'pricePerMin'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    console.error(`Error: Faltan campos requeridos: ${missing.join(', ')}`);
    console.error('Use --help para ver la ayuda');
    process.exit(1);
  }
  
  try {
    console.log('Agregando vehículo...');
    console.log('Datos:', data);
    console.log('');
    
    const result = await addVehicle(data);
    
    console.log('\nVehículo agregado exitosamente:');
    console.log('  ID:', result.vehicle.id);
    console.log('  Company:', result.vehicle.company);
    console.log('  Type:', result.vehicle.type);
    console.log('  Ubicación:', result.vehicle.canton, '-', result.vehicle.distrito);
    console.log('  Coordenadas:', `(${result.vehicle.lat}, ${result.vehicle.lng})`);
    console.log('  Battery:', result.vehicle.battery + '%');
    console.log('  Price:', '$' + result.vehicle.price_per_min + '/min');
    
  } catch (error) {
    console.error('\nError al agregar vehículo:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Si se ejecuta directamente (no como módulo)
if (import.meta.url === `file://${process.argv[1]}`) {
  cli();
}
