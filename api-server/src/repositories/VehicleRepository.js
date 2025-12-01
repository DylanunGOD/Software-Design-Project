import { BaseRepository } from './BaseRepository.js';

/**
 * VehicleRepository - Gestiona operaciones CRUD para vehículos
 * @extends BaseRepository
 */
export class VehicleRepository extends BaseRepository {
  constructor() {
    super('vehicles');
  }

  /**
   * Buscar vehículos disponibles
   * @returns {Promise<Array>}
   */
  async findAvailable() {
    return this.findAll({ where: { status: 'available' } });
  }

  /**
   * Buscar vehículos por tipo
   * @param {string} type - 'scooter' | 'bike'
   * @returns {Promise<Array>}
   */
  async findByType(type) {
    return this.findAll({ where: { type } });
  }

  /**
   * Buscar vehículos por compañía
   * @param {string} company - 'tier' | 'lime' | 'bird'
   * @returns {Promise<Array>}
   */
  async findByCompany(company) {
    return this.findAll({ where: { company } });
  }

  /**
   * Buscar vehículos cercanos (usando rectángulo delimitador simple)
   * @param {number} lat - Latitud del centro
   * @param {number} lng - Longitud del centro
   * @param {number} radiusKm - Radio en kilómetros
   * @returns {Promise<Array>}
   */
  async findNearby(lat, lng, radiusKm = 1) {
    // Aproximación: 1 grado ≈ 111 km
    const delta = radiusKm / 111;
    
    const sql = `
      SELECT * FROM vehicles 
      WHERE status = 'available'
      AND lat BETWEEN $1 AND $2
      AND lng BETWEEN $3 AND $4
    `;

    const params = [
      lat - delta,
      lat + delta,
      lng - delta,
      lng + delta,
    ];

    return this.db.all(sql, params);
  }

  /**
   * Buscar vehículos por ubicación (cantón y distrito)
   * @param {string} canton
   * @param {string} distrito
   * @returns {Promise<Array>}
   */
  async findByLocation(canton, distrito) {
    return this.findAll({ 
      where: { canton, distrito, status: 'available' } 
    });
  }

  /**
   * Cambiar estado de vehículo
   * @param {string} id
   * @param {string} status - 'available' | 'in_use' | 'maintenance'
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  /**
   * Actualizar batería
   * @param {string} id
   * @param {number} battery - Porcentaje (0-100)
   * @returns {Promise<Object>}
   */
  async updateBattery(id, battery) {
    return this.update(id, { battery });
  }

  /**
   * Actualizar ubicación
   * @param {string} id
   * @param {number} lat
   * @param {number} lng
   * @returns {Promise<Object>}
   */
  async updateLocation(id, lat, lng) {
    return this.update(id, { lat, lng });
  }

  /**
   * Contar vehículos disponibles por tipo
   * @param {string} type
   * @returns {Promise<number>}
   */
  async countAvailableByType(type) {
    return this.count({ type, status: 'available' });
  }
}
