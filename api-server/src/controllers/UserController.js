import { ControllerBase } from './ControllerBase.js';
import { UserService } from '../services/index.js';
import { userSchemas } from '../models/validationSchemas.js';

/**
 * UserController - Controlador de usuarios
 */
export class UserController extends ControllerBase {
  /**
   * GET /profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.userId;
      const user = await UserService.getProfile(userId);
      return this.success(res, user);
    } catch (err) {
      return this.error(res, err.message, 404, err);
    }
  }

  /**
   * PUT /profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { error, value } = this.validate(req.body, userSchemas.updateProfile);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const user = await UserService.updateProfile(userId, value);
      return this.success(res, user);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /wallet
   */
  static async getWallet(req, res) {
    try {
      const userId = req.userId;
      const balance = await UserService.getBalance(userId);
      return this.success(res, { balance });
    } catch (err) {
      return this.error(res, err.message, 404, err);
    }
  }

  /**
   * POST /wallet/recharge
   */
  static async rechargeWallet(req, res) {
    try {
      const userId = req.userId;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return this.error(res, 'Monto inválido', 400);
      }

      const user = await UserService.rechargeBalance(userId, parseFloat(amount));
      return this.success(res, { 
        message: 'Saldo recargado exitosamente',
        balance: user.balance 
      });
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }
}
