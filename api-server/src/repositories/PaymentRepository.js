import { BaseRepository } from './BaseRepository.js';

/**
 * PaymentRepository - Gestiona operaciones CRUD para métodos de pago
 * @extends BaseRepository
 */
export class PaymentRepository extends BaseRepository {
  constructor() {
    super('payments');
  }

  /**
   * Obtener métodos de pago de un usuario
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    return this.findAll({ where: { user_id: userId } });
  }

  /**
   * Obtener métodos de pago activos de un usuario
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findActiveByUserId(userId) {
    const sql = `
      SELECT * FROM payments 
      WHERE user_id = $1 AND is_active = 1
      ORDER BY is_default DESC, created_at DESC
    `;
    return this.db.all(sql, [userId]);
  }

  /**
   * Obtener método de pago por defecto del usuario
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async findDefaultByUserId(userId) {
    return this.findOne({ user_id: userId, is_default: 1 });
  }

  /**
   * Establecer método de pago como por defecto
   * @param {string} id - ID del método de pago
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async setAsDefault(id, userId) {
    // Remover default anterior
    const sql = `UPDATE payments SET is_default = 0 WHERE user_id = $1`;
    await this.db.run(sql, [userId]);

    // Establecer como default
    return this.update(id, { is_default: 1 });
  }

  /**
   * Desactivar método de pago
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deactivate(id) {
    return this.update(id, { is_active: 0 });
  }

  /**
   * Desactivar todos los métodos de pago de un usuario
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deactivateAllByUser(userId) {
    const sql = `UPDATE payments SET is_active = 0 WHERE user_id = $1`;
    await this.db.run(sql, [userId]);
  }

  /**
   * Verificar si un usuario tiene al menos un método de pago activo
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async hasActivePaymentMethod(userId) {
    const count = await this.count({ user_id: userId, is_active: 1 });
    return count > 0;
  }

  /**
   * Contar métodos de pago activos de un usuario
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countActiveByUser(userId) {
    return this.count({ user_id: userId, is_active: 1 });
  }
}
