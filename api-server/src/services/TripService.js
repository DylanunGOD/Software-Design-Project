import { v4 as uuidv4 } from 'uuid';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

const tripRepo = repositoryFactory.getTripRepository();
const vehicleRepo = repositoryFactory.getVehicleRepository();
const userRepo = repositoryFactory.getUserRepository();

/**
 * TripService - Servicios de gestión de viajes
 */
export class TripService {
  /**
   * Iniciar viaje
   * @param {string} userId
   * @param {Object} tripData - {vehicle_id, start_lat, start_lng, start_address}
   * @returns {Promise<Object>}
   */
  static async startTrip(userId, tripData) {
    // Verificar que no haya viaje activo
    const activeTrip = await tripRepo.findActiveTrip(userId);
    if (activeTrip) {
      throw new Error('Ya tienes un viaje activo');
    }

    // Crear viaje (sin 'type', eso está en vehicles)
    const trip = await tripRepo.create({
      id: uuidv4(),
      user_id: userId,
      vehicle_id: tripData.vehicle_id || null,
      start_lat: tripData.start_lat,
      start_lng: tripData.start_lng,
      start_address: tripData.start_address,
      status: 'ongoing',
      start_time: new Date().toISOString(),
    });

    return trip;
  }

  /**
   * Finalizar viaje
   * @param {string} userId
   * @param {Object} endData - {end_lat, end_lng, end_address, duration_minutes, distance}
   * @returns {Promise<Object>}
   */
  static async finishTrip(userId, endData) {
    // Obtener viaje activo
    const activeTrip = await tripRepo.findActiveTrip(userId);
    if (!activeTrip) {
      throw new Error('No tienes un viaje activo');
    }

    // Calcular precio
    let price = 0;
    if (activeTrip.vehicle_id) {
      const vehicle = await vehicleRepo.findById(activeTrip.vehicle_id);
      if (vehicle) {
        price = vehicle.price_per_min * endData.duration_minutes;
      }
    }

    // Deducir saldo del usuario
    const user = await userRepo.findById(userId);
    if (user.balance < price) {
      throw new Error('Saldo insuficiente para completar el viaje');
    }
    await userRepo.updateBalance(userId, -price);

    // Finalizar viaje
    const finishedTrip = await tripRepo.finishTrip(activeTrip.id, {
      ...endData,
      price,
    });

    // Liberar vehículo si existe
    if (activeTrip.vehicle_id) {
      await vehicleRepo.updateStatus(activeTrip.vehicle_id, 'available');
    }

    return finishedTrip;
  }

  /**
   * Cancelar viaje
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  static async cancelTrip(userId) {
    const activeTrip = await tripRepo.findActiveTrip(userId);
    if (!activeTrip) {
      throw new Error('No tienes un viaje activo');
    }

    // Liberar vehículo si existe
    if (activeTrip.vehicle_id) {
      await vehicleRepo.updateStatus(activeTrip.vehicle_id, 'available');
    }

    // Cancelar viaje
    return tripRepo.updateStatus(activeTrip.id, 'cancelled');
  }

  /**
   * Obtener historial de viajes
   * @param {string} userId
   * @param {Object} options - {page, limit}
   * @returns {Promise<{data, total, pages}>}
   */
  static async getTripHistory(userId, options = {}) {
    return tripRepo.getUserTripHistory(userId, options);
  }

  /**
   * Obtener estadísticas de viajes del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  static async getUserStats(userId) {
    return tripRepo.getUserTripStats(userId);
  }

  /**
   * Obtener viaje activo del usuario
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  static async getActiveTrip(userId) {
    return tripRepo.findActiveTrip(userId);
  }

  /**
   * Obtener detalles de un viaje
   * @param {string} tripId
   * @param {string} userId - Para validar que sea del usuario
   * @returns {Promise<Object>}
   */
  static async getTrip(tripId, userId) {
    const trip = await tripRepo.findById(tripId);
    if (!trip) {
      throw new Error('Viaje no encontrado');
    }

    if (trip.user_id !== userId) {
      throw new Error('No tienes permiso para acceder a este viaje');
    }

    return trip;
  }
}
