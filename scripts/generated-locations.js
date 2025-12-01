// ========================================
// VEHÍCULOS CON UBICACIONES ACTUALIZADAS
// ========================================

export const VEHICLES_DATA = [
  { id: 'tier-1', company: 'tier', type: 'scooter', lat: 9.9334, lng: -84.0834, battery: 85, pricePerMin: 3.5, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'Centro Hospital' },
  { id: 'tier-2', company: 'tier', type: 'scooter', lat: 9.9326, lng: -84.0793, battery: 92, pricePerMin: 3.5, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'Dolorosa' },
  { id: 'tier-3', company: 'tier', type: 'bike', lat: 9.935, lng: -84.0881, battery: 78, pricePerMin: 2.5, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'San Bosco' },
  { id: 'tier-4', company: 'tier', type: 'scooter', lat: 9.9185, lng: -84.1372, battery: 65, pricePerMin: 3.5, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'Hulera' },
  { id: 'tier-5', company: 'tier', type: 'bike', lat: 9.9155, lng: -84.1425, battery: 90, pricePerMin: 2.5, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'Perú' },

  { id: 'lime-1', company: 'lime', type: 'scooter', lat: 9.933, lng: -84.0774, battery: 88, pricePerMin: 3, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'Centro Catedral' },
  { id: 'lime-2', company: 'lime', type: 'bike', lat: 9.9989, lng: -84.1169, battery: 95, pricePerMin: 2, reserved: false, canton: 'Heredia', distrito: 'Fátima' },
  { id: 'lime-3', company: 'lime', type: 'scooter', lat: 10.0024, lng: -84.1208, battery: 70, pricePerMin: 3, reserved: false, canton: 'Heredia', distrito: 'Fátima' },
  { id: 'lime-4', company: 'lime', type: 'scooter', lat: 10.0162, lng: -84.2116, battery: 82, pricePerMin: 3, reserved: false, canton: 'Alajuela', distrito: 'Arroyo' },
  { id: 'lime-5', company: 'lime', type: 'bike', lat: 10.0189, lng: -84.2143, battery: 91, pricePerMin: 2, reserved: false, canton: 'Alajuela', distrito: 'Corazón de Jesús' },

  { id: 'bird-1', company: 'bird', type: 'scooter', lat: 9.9384, lng: -84.187, battery: 75, pricePerMin: 3.2, reserved: false, canton: 'Santa Ana', distrito: 'INVU Santa Ana' },
  { id: 'bird-2', company: 'bird', type: 'scooter', lat: 9.9428, lng: -84.1805, battery: 80, pricePerMin: 3.2, reserved: false, canton: 'Santa Ana', distrito: 'Centro' },
  { id: 'bird-3', company: 'bird', type: 'bike', lat: 9.8644, lng: -83.919, battery: 87, pricePerMin: 2.2, reserved: false, canton: 'Cartago', distrito: 'Los Ángeles' },
  { id: 'bird-4', company: 'bird', type: 'scooter', lat: 9.8621, lng: -83.9235, battery: 93, pricePerMin: 3.2, reserved: false, canton: 'Cartago', distrito: 'Occidental' },
  { id: 'bird-5', company: 'bird', type: 'bike', lat: 9.9225, lng: -84.0538, battery: 68, pricePerMin: 2.2, reserved: false, canton: 'Área Metropolitana de San José', distrito: 'El Jardín' },
];

// ========================================
// PARADAS DE TRANSPORTE ACTUALIZADAS
// ========================================

export const TRANSPORT_STOPS = [
  {
    id: 'metro-1',
    name: 'Estación Central',
    type: 'metro',
    lat: 9.9326,
    lng: -84.0834,
    lines: ["1"],
    arrivals: ["2 min","5 min","10 min"],
    canton: 'Área Metropolitana de San José',
    distrito: 'Centro Hospital',
  },
  {
    id: 'metro-2',
    name: 'Estación Sabana',
    type: 'metro',
    lat: 9.9355,
    lng: -84.1025,
    lines: ["1"],
    arrivals: ["3 min","7 min","12 min"],
    canton: 'Área Metropolitana de San José',
    distrito: 'Sabana',
  },
  {
    id: 'bus-1',
    name: 'Parada Escazú',
    type: 'bus',
    lat: 9.917,
    lng: -84.1376,
    lines: ["76","8"],
    arrivals: ["1 min","8 min"],
    canton: 'Área Metropolitana de San José',
    distrito: 'Hulera',
  },
];
