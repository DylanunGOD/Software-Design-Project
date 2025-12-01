import { UserRepository } from './UserRepository.js';
import { VehicleRepository } from './VehicleRepository.js';
import { TripRepository } from './TripRepository.js';
import { PaymentRepository } from './PaymentRepository.js';

/**
 * RepositoryFactory - Factory Pattern para crear instancias de repositorios
 * Facilita la inyección de dependencias y centraliza la creación
 */
class RepositoryFactory {
  constructor() {
    this.repositories = {};
  }

  /**
   * Obtener instancia de UserRepository (singleton)
   * @returns {UserRepository}
   */
  getUserRepository() {
    if (!this.repositories.user) {
      this.repositories.user = new UserRepository();
    }
    return this.repositories.user;
  }

  /**
   * Obtener instancia de VehicleRepository (singleton)
   * @returns {VehicleRepository}
   */
  getVehicleRepository() {
    if (!this.repositories.vehicle) {
      this.repositories.vehicle = new VehicleRepository();
    }
    return this.repositories.vehicle;
  }

  /**
   * Obtener instancia de TripRepository (singleton)
   * @returns {TripRepository}
   */
  getTripRepository() {
    if (!this.repositories.trip) {
      this.repositories.trip = new TripRepository();
    }
    return this.repositories.trip;
  }

  /**
   * Obtener instancia de PaymentRepository (singleton)
   * @returns {PaymentRepository}
   */
  getPaymentRepository() {
    if (!this.repositories.payment) {
      this.repositories.payment = new PaymentRepository();
    }
    return this.repositories.payment;
  }

  /**
   * Obtener todos los repositorios
   * @returns {Object}
   */
  getAllRepositories() {
    return {
      user: this.getUserRepository(),
      vehicle: this.getVehicleRepository(),
      trip: this.getTripRepository(),
      payment: this.getPaymentRepository(),
    };
  }
}

// Exportar instancia única de la factory
export const repositoryFactory = new RepositoryFactory();
