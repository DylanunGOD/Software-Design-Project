import { v4 as uuidv4 } from 'uuid';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

const vehicleRepo = repositoryFactory.getVehicleRepository();

/**
 * VehicleService - Servicios de gestión de vehículos
 */
export class VehicleService {
  /**
   * Obtener todos los vehículos disponibles
   * @returns {Promise<Array>}
   */
  static async getAvailable() {
    return vehicleRepo.findAvailable();
  }

  /**
   * Buscar vehículos cercanos
   * @param {number} lat
   * @param {number} lng
   * @param {number} radiusKm
   * @param {Object} filters - {type, company}
   * @returns {Promise<Array>}
   */
  static async searchNearby(lat, lng, radiusKm = 1, filters = {}) {
    let vehicles = await vehicleRepo.findNearby(lat, lng, radiusKm);

    // Aplicar filtros
    if (filters.type) {
      vehicles = vehicles.filter(v => v.type === filters.type);
    }
    if (filters.company) {
      vehicles = vehicles.filter(v => v.company === filters.company);
    }

    return vehicles;
  }

  /**
   * Buscar vehículos por ubicación
   * @param {string} canton
   * @param {string} distrito
   * @returns {Promise<Array>}
   */
  static async searchByLocation(canton, distrito) {
    return vehicleRepo.findByLocation(canton, distrito);
  }

  /**
   * Obtener vehículo por ID
   * @param {string} vehicleId
   * @returns {Promise<Object>}
   */
  static async getVehicle(vehicleId) {
    const vehicle = await vehicleRepo.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }
    return vehicle;
  }

  /**
   * Reservar vehículo
   * @param {string} vehicleId
   * @returns {Promise<Object>}
   */
  static async reserve(vehicleId) {
    const vehicle = await this.getVehicle(vehicleId);

    if (vehicle.status !== 'available') {
      throw new Error('Vehículo no disponible');
    }

    return vehicleRepo.updateStatus(vehicleId, 'in_use');
  }

  /**
   * Liberar vehículo
   * @param {string} vehicleId
   * @param {Object} data - {battery, lat, lng}
   * @returns {Promise<Object>}
   */
  static async release(vehicleId, data) {
    const vehicle = await this.getVehicle(vehicleId);

    if (vehicle.status !== 'in_use') {
      throw new Error('Vehículo no está en uso');
    }

    await vehicleRepo.updateLocation(vehicleId, data.lat, data.lng);
    await vehicleRepo.updateBattery(vehicleId, data.battery);
    return vehicleRepo.updateStatus(vehicleId, 'available');
  }

  /**
   * Crear vehículo con validación automática de ubicación
   * @param {Object} data - { company, type, lat, lng, battery, price_per_min }
   * @returns {Promise<Object>}
   */
  static async create(data) {
    // Importar utilidades de validación
    const { validateCostaRicaCoordinates, getLocationFromCoords } = await import('../utils/locationValidator.js');
    
    // Validar que coordenadas estén en Costa Rica
    validateCostaRicaCoordinates(data.lat, data.lng);
    
    // Obtener canton y distrito desde Nominatim
    console.log(`[VehicleService] Validando ubicación (${data.lat}, ${data.lng}) con Nominatim...`);
    const location = await getLocationFromCoords(data.lat, data.lng);
    
    if (!location.canton) {
      console.warn('[VehicleService] Advertencia: No se pudo obtener canton desde Nominatim');
    } else {
      console.log(`[VehicleService] Ubicación validada: ${location.canton} - ${location.distrito}`);
    }
    
    // Verificar duplicados por coordenadas
    const existing = await vehicleRepo.findAll({ 
      where: { lat: data.lat, lng: data.lng } 
    });
    
    if (existing && existing.length > 0) {
      throw new Error(`Ya existe un vehículo en las coordenadas (${data.lat}, ${data.lng})`);
    }
    
    // Crear vehículo con ubicación validada
    const vehicle = await vehicleRepo.create({
      id: uuidv4(),
      company: data.company,
      type: data.type,
      lat: data.lat,
      lng: data.lng,
      battery: data.battery || 100,
      price_per_min: data.price_per_min,
      canton: location.canton,
      distrito: location.distrito,
      status: 'available',
      reserved: false
    });
    
    return vehicle;
  }

  /**
   * Obtener estadísticas de disponibilidad
   * @returns {Promise<Object>}
   */
  static async getStats() {
    const available = await vehicleRepo.count({ status: 'available' });
    const inUse = await vehicleRepo.count({ status: 'in_use' });
    const maintenance = await vehicleRepo.count({ status: 'maintenance' });
    const scootersAvail = await vehicleRepo.countAvailableByType('scooter');
    const bikesAvail = await vehicleRepo.countAvailableByType('bike');

    return {
      available,
      in_use: inUse,
      maintenance,
      by_type: {
        scooter_available: scootersAvail,
        bike_available: bikesAvail,
      },
    };
  }
}
