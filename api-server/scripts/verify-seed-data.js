/**
 * Verificación de extracción correcta de cantones y distritos
 * Muestra tabla comparativa con los datos que se insertarían
 */

async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'EcoRueda/1.0' }
    });
    
    const data = await response.json();
    const address = data.address || {};
    
    // Canton: En Costa Rica es city_district o town (NO usar city que es "Área Metropolitana")
    const canton = address.city_district || address.town || address.county || address.municipality || 'Desconocido';
    
    // Distrito: Es neighbourhood o village
    const distrito = address.neighbourhood || address.village || address.suburb || address.hamlet || 'Centro';
    
    return { canton, distrito };
  } catch (error) {
    return { canton: 'Error', distrito: 'Error' };
  }
}

const VEHICLES_DATA = [
  { id: 'tier-1', company: 'tier', type: 'scooter', lat: 9.9334, lng: -84.0834 },
  { id: 'tier-2', company: 'tier', type: 'scooter', lat: 9.9326, lng: -84.0793 },
  { id: 'tier-3', company: 'tier', type: 'bike', lat: 9.9350, lng: -84.0881 },
  { id: 'tier-4', company: 'tier', type: 'scooter', lat: 9.9185, lng: -84.1372 },
  { id: 'tier-5', company: 'tier', type: 'bike', lat: 9.9155, lng: -84.1425 },
  { id: 'lime-1', company: 'lime', type: 'scooter', lat: 9.9330, lng: -84.0774 },
  { id: 'lime-2', company: 'lime', type: 'bike', lat: 9.9989, lng: -84.1169 },
  { id: 'lime-3', company: 'lime', type: 'scooter', lat: 10.0024, lng: -84.1208 },
  { id: 'lime-4', company: 'lime', type: 'scooter', lat: 10.0162, lng: -84.2116 },
  { id: 'lime-5', company: 'lime', type: 'bike', lat: 10.0189, lng: -84.2143 },
  { id: 'bird-1', company: 'bird', type: 'scooter', lat: 9.9384, lng: -84.1870 },
  { id: 'bird-2', company: 'bird', type: 'scooter', lat: 9.9428, lng: -84.1805 },
  { id: 'bird-3', company: 'bird', type: 'bike', lat: 9.8644, lng: -83.9190 },
  { id: 'bird-4', company: 'bird', type: 'scooter', lat: 9.8621, lng: -83.9235 },
  { id: 'bird-5', company: 'bird', type: 'bike', lat: 9.9225, lng: -84.0538 }
];

async function verifyAll() {
  console.log('\nVERIFICACION DE CANTONES Y DISTRITOS');
  console.log('='.repeat(100));
  console.log('');
  console.log(` ID        | Company | Type    | Latitud  | Longitud  | Canton           | Distrito`);
  console.log('-'.repeat(100));
  
  for (let i = 0; i < VEHICLES_DATA.length; i++) {
    const v = VEHICLES_DATA[i];
    const location = await getLocationFromCoords(v.lat, v.lng);
    
    console.log(
      ` ${v.id.padEnd(9)} | ${v.company.padEnd(7)} | ${v.type.padEnd(7)} | ` +
      `${v.lat.toFixed(4).padEnd(8)} | ${v.lng.toFixed(4).padEnd(9)} | ` +
      `${location.canton.padEnd(16)} | ${location.distrito}`
    );
    
    // Esperar 1.1 segundos entre requests
    if (i < VEHICLES_DATA.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }
  
  console.log('-'.repeat(100));
  console.log('\nVerificación completada. Estos son los datos que se insertarán.\n');
}

verifyAll();
