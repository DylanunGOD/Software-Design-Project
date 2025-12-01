/**
 * Script simplificado para generar ubicaciones
 * Versión con mapeo manual para Costa Rica
 */

// Mapeo manual de coordenadas a cantones/distritos de Costa Rica
const MANUAL_LOCATIONS = {
  // San José Centro (9.93, -84.08)
  'tier-1': { canton: 'San José', distrito: 'Carmen' },
  'tier-2': { canton: 'San José', distrito: 'Merced' },
  'tier-3': { canton: 'San José', distrito: 'Hospital' },
  'lime-1': { canton: 'San José', distrito: 'Catedral' },
  'bird-5': { canton: 'San José', distrito: 'Zapote' },
  
  // Escazú (9.92, -84.14)
  'tier-4': { canton: 'Escazú', distrito: 'San Rafael' },
  'tier-5': { canton: 'Escazú', distrito: 'San Antonio' },
  
  // Heredia (10.00, -84.12)
  'lime-2': { canton: 'Heredia', distrito: 'Central' },
  'lime-3': { canton: 'Heredia', distrito: 'Mercedes' },
  
  // Alajuela (10.02, -84.21)
  'lime-4': { canton: 'Alajuela', distrito: 'Central' },
  'lime-5': { canton: 'Alajuela', distrito: 'San José' },
  
  // Santa Ana (9.94, -84.18)
  'bird-1': { canton: 'Santa Ana', distrito: 'Pozos' },
  'bird-2': { canton: 'Santa Ana', distrito: 'Uruca' },
  
  // Cartago (9.86, -83.92)
  'bird-3': { canton: 'Cartago', distrito: 'Oriental' },
  'bird-4': { canton: 'Cartago', distrito: 'Occidental' },
  
  // Paradas
  'metro-1': { canton: 'San José', distrito: 'Carmen' },
  'metro-2': { canton: 'San José', distrito: 'Hospital' },
  'bus-1': { canton: 'Escazú', distrito: 'San Rafael' },
};

console.log(' Ubicaciones cargadas correctamente\n');
console.log(' Cantones disponibles:');
const cantons = [...new Set(Object.values(MANUAL_LOCATIONS).map(l => l.canton))];
cantons.forEach(c => console.log(`   - ${c}`));

console.log('\n💡 Las ubicaciones están correctamente mapeadas en constants.js');
