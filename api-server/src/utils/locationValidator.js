/**
 * Utilidad compartida para validar ubicaciones con Nominatim
 * Usada por scripts y por el API
 */

/**
 * Validar coordenadas de Costa Rica
 */
export function validateCostaRicaCoordinates(lat, lng) {
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
 * Obtener ubicación desde coordenadas usando Nominatim
 */
export async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'EcoRueda/1.0' }
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const address = data.address || {};
    
    // Canton: En Costa Rica es city_district o town (NO usar city que es "Área Metropolitana")
    const canton = address.city_district || address.town || address.county || address.municipality || null;
    
    // Distrito: Es neighbourhood o village
    const distrito = address.neighbourhood || address.village || address.suburb || address.hamlet || null;
    
    return { canton, distrito };
  } catch (error) {
    console.error(`[Nominatim] Error para (${lat}, ${lng}): ${error.message}`);
    return { canton: null, distrito: null };
  }
}
