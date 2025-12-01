import { BaseRepository } from './BaseRepository.js';

/**
 * TripRepository - Gestiona operaciones CRUD para viajes
 * @extends BaseRepository
 */
export class TripRepository extends BaseRepository {
  constructor() {
    super('trips');
  }

  /**
   * Buscar viajes de un usuario
   * @param {string} userId
   * @param {Object} options - {status, limit, offset}
   * @returns {Promise<Array>}
   */
  async findByUserId(userId, options = {}) {
    let sql = `SELECT * FROM trips WHERE user_id = $1`;

    if (options.status) {
      sql += ` AND status = $2`;
    }

    sql += ` ORDER BY created_at DESC`;

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }

    const params = [userId];
    if (options.status) params.push(options.status);

    return this.db.all(sql, params);
  }

  /**
   * Obtener viaje activo del usuario (si existe)
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async findActiveTrip(userId) {
    return this.findOne({ user_id: userId, status: 'ongoing' });
  }

  /**
   * Obtener historial de viajes de un usuario
   * @param {string} userId
   * @param {Object} options - {limit, page}
   * @returns {Promise<{data, total, pages}>}
   */
  async getUserTripHistory(userId, options = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const data = await this.findByUserId(userId, {
      status: 'completed',
      limit,
      offset,
    });

    const sql = `SELECT COUNT(*) as count FROM trips WHERE user_id = $1 AND status = 'completed'`;
    const result = await this.db.get(sql, [userId]);
    const total = result?.count || 0;
    const pages = Math.ceil(total / limit);

    return { data, total, pages, page, limit };
  }

  /**
   * Obtener estadísticas de viajes del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserTripStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_trips,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_trips,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN distance ELSE 0 END), 0) as total_distance,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN duration_minutes ELSE 0 END), 0) as total_minutes,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END), 0) as total_spent
      FROM trips 
      WHERE user_id = $1
    `;

    return this.db.get(sql, [userId]);
  }

  /**
   * Cambiar estado de viaje
   * @param {string} id
   * @param {string} status - 'ongoing' | 'completed' | 'cancelled'
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const data = { status };
    if (status === 'completed') {
      data.end_time = new Date().toISOString();
    }
    return this.update(id, data);
  }

  /**
   * Finalizar viaje con datos finales
   * @param {string} id
   * @param {Object} endData - {end_lat, end_lng, end_address, duration_minutes, distance, price}
   * @returns {Promise<Object>}
   */
  async finishTrip(id, endData) {
    const tripData = {
      status: 'completed',
      end_time: new Date().toISOString(),
      ...endData,
    };
    return this.update(id, tripData);
  }

  /**
   * Contar viajes completados por usuario
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countCompletedByUser(userId) {
    return this.count({ user_id: userId, status: 'completed' });
  }
}
