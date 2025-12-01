/**
 * Test para verificar qué datos retorna Nominatim para coordenadas de Costa Rica
 */

async function testNominatimResponse() {
  const testCoordinates = [
    { name: 'San José Centro', lat: 9.9334, lng: -84.0834 },
    { name: 'Escazú', lat: 9.9185, lng: -84.1372 },
    { name: 'Heredia', lat: 9.9989, lng: -84.1169 },
    { name: 'Alajuela', lat: 10.0162, lng: -84.2116 },
    { name: 'Cartago', lat: 9.8644, lng: -83.9190 }
  ];
  
  for (const coord of testCoordinates) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coord.lat}&lon=${coord.lng}&zoom=18&addressdetails=1`;
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`UBICACION: ${coord.name}`);
    console.log(`COORDENADAS: (${coord.lat}, ${coord.lng})`);
    console.log('='.repeat(80));
    
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'EcoRueda/1.0' }
      });
      
      const data = await response.json();
      const addr = data.address || {};
      
      console.log('\nDatos completos del address:');
      console.log(JSON.stringify(addr, null, 2));
      
      console.log('\nCampos relevantes extraídos:');
      console.log('  city:', addr.city);
      console.log('  town:', addr.town);
      console.log('  municipality:', addr.municipality);
      console.log('  county:', addr.county);
      console.log('  state:', addr.state);
      console.log('  suburb:', addr.suburb);
      console.log('  neighbourhood:', addr.neighbourhood);
      console.log('  district:', addr.district);
      console.log('  village:', addr.village);
      console.log('  hamlet:', addr.hamlet);
      console.log('  city_district:', addr.city_district);
      
      console.log('\nDisplay name completo:');
      console.log(data.display_name);
      
      // Esperar 1.1 segundos entre requests
      await new Promise(resolve => setTimeout(resolve, 1100));
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

testNominatimResponse();
