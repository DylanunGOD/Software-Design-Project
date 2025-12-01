/**
 * Script para generar automáticamente nombres de cantón y distrito
 * usando Nominatim (OpenStreetMap)
 * 
 * Uso: node scripts/generate-locations.js
 */

// Datos de vehículos y paradas
const VEHICLES_DATA = [
  // Tier - San José Centro
  { id: 'tier-1', company: 'tier', type: 'scooter', lat: 9.9334, lng: -84.0834, battery: 85, pricePerMin: 3.5, reserved: false },
  { id: 'tier-2', company: 'tier', type: 'scooter', lat: 9.9326, lng: -84.0793, battery: 92, pricePerMin: 3.5, reserved: false },
  { id: 'tier-3', company: 'tier', type: 'bike', lat: 9.9350, lng: -84.0881, battery: 78, pricePerMin: 2.5, reserved: false },
  { id: 'tier-4', company: 'tier', type: 'scooter', lat: 9.9185, lng: -84.1372, battery: 65, pricePerMin: 3.5, reserved: false },
  { id: 'tier-5', company: 'tier', type: 'bike', lat: 9.9155, lng: -84.1425, battery: 90, pricePerMin: 2.5, reserved: false },
  
  // Lime - San José y alrededores
  { id: 'lime-1', company: 'lime', type: 'scooter', lat: 9.9330, lng: -84.0774, battery: 88, pricePerMin: 3.0, reserved: false },
  { id: 'lime-2', company: 'lime', type: 'bike', lat: 9.9989, lng: -84.1169, battery: 95, pricePerMin: 2.0, reserved: false },
  { id: 'lime-3', company: 'lime', type: 'scooter', lat: 10.0024, lng: -84.1208, battery: 70, pricePerMin: 3.0, reserved: false },
  { id: 'lime-4', company: 'lime', type: 'scooter', lat: 10.0162, lng: -84.2116, battery: 82, pricePerMin: 3.0, reserved: false },
  { id: 'lime-5', company: 'lime', type: 'bike', lat: 10.0189, lng: -84.2143, battery: 91, pricePerMin: 2.0, reserved: false },
  
  // Bird - Zona oeste y este
  { id: 'bird-1', company: 'bird', type: 'scooter', lat: 9.9384, lng: -84.1870, battery: 75, pricePerMin: 3.2, reserved: false },
  { id: 'bird-2', company: 'bird', type: 'scooter', lat: 9.9428, lng: -84.1805, battery: 80, pricePerMin: 3.2, reserved: false },
  { id: 'bird-3', company: 'bird', type: 'bike', lat: 9.8644, lng: -83.9190, battery: 87, pricePerMin: 2.2, reserved: false },
  { id: 'bird-4', company: 'bird', type: 'scooter', lat: 9.8621, lng: -83.9235, battery: 93, pricePerMin: 3.2, reserved: false },
  { id: 'bird-5', company: 'bird', type: 'bike', lat: 9.9225, lng: -84.0538, battery: 68, pricePerMin: 2.2, reserved: false },
];

const TRANSPORT_STOPS = [
  {
    id: 'metro-1',
    name: 'Estación Central',
    type: 'metro',
    lat: 9.9326,
    lng: -84.0834,
    lines: ['1'],
    arrivals: ['2 min', '5 min', '10 min'],
  },
  {
    id: 'metro-2',
    name: 'Estación Sabana',
    type: 'metro',
    lat: 9.9355,
    lng: -84.1025,
    lines: ['1'],
    arrivals: ['3 min', '7 min', '12 min'],
  },
  {
    id: 'bus-1',
    name: 'Parada Escazú',
    type: 'bus',
    lat: 9.9170,
    lng: -84.1376,
    lines: ['76', '8'],
    arrivals: ['1 min', '8 min'],
  },
];

/**
 * Obtener ubicación desde coordenadas usando Nominatim
 */
async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EcoRueda/1.0 (Contact: dylan@ejemplo.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extraer cantón y distrito
    const address = data.address || {};
    
    const canton = address.city || 
                   address.town || 
                   address.municipality || 
                   address.county ||
                   'Desconocido';
    
    const distrito = address.suburb || 
                     address.neighbourhood || 
                     address.hamlet || 
                     address.village ||
                     address.district ||
                     'Centro';
    
    return {
      canton,
      distrito,
      fullAddress: data.display_name
    };
  } catch (error) {
    console.error(`X Error obteniendo ubicación para (${lat}, ${lng}):`, error.message);
    return {
      canton: 'Error',
      distrito: 'Error',
      fullAddress: 'Error'
    };
  }
}

/**
 * Procesar vehículos
 */
async function processVehicles() {
  console.log('\n📍 Procesando vehículos...\n');
  const results = [];
  
  for (const vehicle of VEHICLES_DATA) {
    console.log(`🔍 ${vehicle.id} (${vehicle.lat}, ${vehicle.lng})...`);
    
    const location = await getLocationFromCoords(vehicle.lat, vehicle.lng);
    
    results.push({
      ...vehicle,
      canton: location.canton,
      distrito: location.distrito
    });
    
    console.log(`   ✅ ${location.canton} - ${location.distrito}`);
    
    // Esperar 1 segundo entre requests (límite de Nominatim: 1 req/segundo)
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  return results;
}

/**
 * Procesar paradas de transporte
 */
async function processTransportStops() {
  console.log('\n🚇 Procesando paradas de transporte...\n');
  const results = [];
  
  for (const stop of TRANSPORT_STOPS) {
    console.log(`🔍 ${stop.id} - ${stop.name} (${stop.lat}, ${stop.lng})...`);
    
    const location = await getLocationFromCoords(stop.lat, stop.lng);
    
    results.push({
      ...stop,
      canton: location.canton,
      distrito: location.distrito
    });
    
    console.log(`   ✅ ${location.canton} - ${location.distrito}`);
    
    // Esperar 1 segundo entre requests
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  return results;
}

/**
 * Generar código JavaScript para constants.js
 */
function generateJavaScriptCode(vehicles, stops) {
  let code = '// ========================================\n';
  code += '// VEHÍCULOS CON UBICACIONES ACTUALIZADAS\n';
  code += '// ========================================\n\n';
  code += 'export const VEHICLES_DATA = [\n';
  
  vehicles.forEach((vehicle, index) => {
    if (index > 0 && vehicles[index-1].company !== vehicle.company) {
      code += '\n';
    }
    code += `  { id: '${vehicle.id}', company: '${vehicle.company}', type: '${vehicle.type}', `;
    code += `lat: ${vehicle.lat}, lng: ${vehicle.lng}, battery: ${vehicle.battery}, `;
    code += `pricePerMin: ${vehicle.pricePerMin}, reserved: ${vehicle.reserved}, `;
    code += `canton: '${vehicle.canton}', distrito: '${vehicle.distrito}' },\n`;
  });
  
  code += '];\n\n';
  
  code += '// ========================================\n';
  code += '// PARADAS DE TRANSPORTE ACTUALIZADAS\n';
  code += '// ========================================\n\n';
  code += 'export const TRANSPORT_STOPS = [\n';
  
  stops.forEach(stop => {
    code += '  {\n';
    code += `    id: '${stop.id}',\n`;
    code += `    name: '${stop.name}',\n`;
    code += `    type: '${stop.type}',\n`;
    code += `    lat: ${stop.lat},\n`;
    code += `    lng: ${stop.lng},\n`;
    code += `    lines: ${JSON.stringify(stop.lines)},\n`;
    code += `    arrivals: ${JSON.stringify(stop.arrivals)},\n`;
    code += `    canton: '${stop.canton}',\n`;
    code += `    distrito: '${stop.distrito}',\n`;
    code += '  },\n';
  });
  
  code += '];\n';
  
  return code;
}

/**
 * Función principal
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🗺️  Generador de Ubicaciones          ║');
  console.log('║  Nominatim (OpenStreetMap)            ║');
  console.log('╚════════════════════════════════════════╝');
  
  try {
    // Procesar vehículos
    const vehicles = await processVehicles();
    
    // Procesar paradas
    const stops = await processTransportStops();
    
    // Generar código
    console.log('\n📝 Generando código JavaScript...\n');
    const code = generateJavaScriptCode(vehicles, stops);
    
    // Guardar en archivo
    const fs = await import('fs');
    const path = await import('path');
    
    const outputPath = path.join(process.cwd(), 'scripts', 'generated-locations.js');
    fs.writeFileSync(outputPath, code, 'utf8');
    
    console.log('✅ Archivo generado exitosamente!');
    console.log(`📁 Ubicación: ${outputPath}\n`);
    
    // Mostrar resumen
    console.log('╔════════════════════════════════════════╗');
    console.log('║  📊 RESUMEN                            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`  Vehículos procesados: ${vehicles.length}`);
    console.log(`  Paradas procesadas: ${stops.length}`);
    console.log(`  Total: ${vehicles.length + stops.length} ubicaciones\n`);
    
    // Mostrar cantones únicos
    const uniqueCantons = [...new Set([
      ...vehicles.map(v => v.canton),
      ...stops.map(s => s.canton)
    ])].filter(c => c !== 'Error' && c !== 'Desconocido');
    
    console.log('📍 Cantones encontrados:');
    uniqueCantons.forEach(canton => {
      console.log(`   - ${canton}`);
    });
    
    console.log('\n💡 Siguiente paso:');
    console.log('   Copia el contenido de "generated-locations.js"');
    console.log('   y reemplaza VEHICLES_DATA y TRANSPORT_STOPS en constants.js\n');
    
  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar
main();
