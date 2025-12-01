import { v4 as uuidv4 } from 'uuid';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

const paymentRepo = repositoryFactory.getPaymentRepository();

/**
 * PaymentService - Servicios de gestión de métodos de pago
 */
export class PaymentService {
  /**
   * Obtener métodos de pago del usuario
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  static async getPaymentMethods(userId) {
    return paymentRepo.findByUserId(userId);
  }

  /**
   * Obtener métodos de pago activos
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  static async getActivePaymentMethods(userId) {
    return paymentRepo.findActiveByUserId(userId);
  }

  /**
   * Agregar método de pago
   * @param {string} userId
   * @param {Object} paymentData - {card_last4, card_brand, provider}
   * @returns {Promise<Object>}
   */
  static async addPaymentMethod(userId, paymentData) {
    // Verificar que no exista una tarjeta igual
    const methods = await paymentRepo.findByUserId(userId);
    const exists = methods.some(
      m => m.card_last4 === paymentData.card_last4 && 
           m.provider === paymentData.provider
    );
    
    if (exists) {
      throw new Error('Este método de pago ya está registrado');
    }

    // Si es el primer método, establecer como default
    const isDefault = methods.length === 0 ? 1 : 0;

    const payment = await paymentRepo.create({
      id: uuidv4(),
      user_id: userId,
      card_last4: paymentData.card_last4,
      provider: paymentData.provider,
      method_type: paymentData.method_type || 'card',
      is_default: isDefault,
      is_active: 1,
    });

    return payment;
  }

  /**
   * Eliminar método de pago
   * @param {string} paymentId
   * @param {string} userId - Para validar propiedad
   * @returns {Promise<void>}
   */
  static async deletePaymentMethod(paymentId, userId) {
    const payment = await paymentRepo.findById(paymentId);
    if (!payment) {
      throw new Error('Método de pago no encontrado');
    }

    if (payment.user_id !== userId) {
      throw new Error('No tienes permiso para eliminar este método');
    }

    // Desactivar en lugar de eliminar (soft delete)
    await paymentRepo.deactivate(paymentId);

    // Si era default, establecer otro como default
    if (payment.is_default) {
      const methods = await paymentRepo.findActiveByUserId(userId);
      if (methods.length > 0) {
        await paymentRepo.setAsDefault(methods[0].id, userId);
      }
    }
  }

  /**
   * Establecer método de pago como default
   * @param {string} paymentId
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  static async setDefaultPaymentMethod(paymentId, userId) {
    const payment = await paymentRepo.findById(paymentId);
    if (!payment) {
      throw new Error('Método de pago no encontrado');
    }

    if (payment.user_id !== userId) {
      throw new Error('No tienes permiso para modificar este método');
    }

    return paymentRepo.setAsDefault(paymentId, userId);
  }

  /**
   * Obtener método de pago por defecto
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  static async getDefaultPaymentMethod(userId) {
    return paymentRepo.findDefaultByUserId(userId);
  }

  /**
   * Verificar si usuario tiene método de pago activo
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  static async hasActivePaymentMethod(userId) {
    return paymentRepo.hasActivePaymentMethod(userId);
  }
}
