import { ControllerBase } from './ControllerBase.js';
import { PaymentService } from '../services/index.js';
import { paymentSchemas } from '../models/validationSchemas.js';

/**
 * PaymentController - Controlador de pagos
 */
export class PaymentController extends ControllerBase {
  /**
   * GET /payments
   */
  static async getPaymentMethods(req, res) {
    try {
      const userId = req.userId;
      const methods = await PaymentService.getPaymentMethods(userId);
      return this.success(res, methods);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * GET /payments/active
   */
  static async getActiveMethods(req, res) {
    try {
      const userId = req.userId;
      const methods = await PaymentService.getActivePaymentMethods(userId);
      return this.success(res, methods);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * POST /payments
   */
  static async addPaymentMethod(req, res) {
    try {
      const userId = req.userId;
      const { error, value } = this.validate(req.body, paymentSchemas.create);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const payment = await PaymentService.addPaymentMethod(userId, value);
      return this.success(res, payment, 201);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * DELETE /payments/:id
   */
  static async deletePaymentMethod(req, res) {
    try {
      const userId = req.userId;
      await PaymentService.deletePaymentMethod(req.params.id, userId);
      return this.success(res, { message: 'Método de pago eliminado' });
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * PUT /payments/:id/default
   */
  static async setDefaultPaymentMethod(req, res) {
    try {
      const userId = req.userId;
      const payment = await PaymentService.setDefaultPaymentMethod(
        req.params.id,
        userId
      );
      return this.success(res, payment);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /payments/default
   */
  static async getDefaultMethod(req, res) {
    try {
      const userId = req.userId;
      const payment = await PaymentService.getDefaultPaymentMethod(userId);
      
      if (!payment) {
        return this.success(res, { message: 'Sin método de pago por defecto' }, 204);
      }

      return this.success(res, payment);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }
}
