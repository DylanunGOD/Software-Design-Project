import { v4 as uuidv4 } from 'uuid';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

const userRepo = repositoryFactory.getUserRepository();

/**
 * UserService - Servicios de gestión de usuarios
 */
export class UserService {
  /**
   * Obtener perfil de usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  static async getProfile(userId) {
    const user = await userRepo.getProfile(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Actualizar perfil de usuario
   * @param {string} userId
   * @param {Object} data - {name, phone}
   * @returns {Promise<Object>}
   */
  static async updateProfile(userId, data) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const updatedUser = await userRepo.update(userId, data);
    delete updatedUser.password;
    return updatedUser;
  }

  /**
   * Obtener saldo de usuario
   * @param {string} userId
   * @returns {Promise<number>}
   */
  static async getBalance(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.balance;
  }

  /**
   * Recargar saldo
   * @param {string} userId
   * @param {number} amount - Cantidad a recargar
   * @returns {Promise<Object>}
   */
  static async rechargeBalance(userId, amount) {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return userRepo.updateBalance(userId, amount);
  }

  /**
   * Deducir saldo (para pagos de viajes)
   * @param {string} userId
   * @param {number} amount
   * @returns {Promise<Object>}
   */
  static async deductBalance(userId, amount) {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    return userRepo.updateBalance(userId, -amount);
  }
}
