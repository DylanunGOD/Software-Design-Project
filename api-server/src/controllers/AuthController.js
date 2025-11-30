import { ControllerBase } from './ControllerBase.js';
import { AuthService } from '../services/index.js';
import { userSchemas } from '../models/validationSchemas.js';
import jwt from 'jsonwebtoken';

/**
 * AuthController - Controlador de autenticación
 */
export class AuthController extends ControllerBase {
  /**
   * POST /auth/register
   */
  static async register(req, res) {
    try {
      const { error, value } = this.validate(req.body, userSchemas.register);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const user = await AuthService.register(value);
      
      // Generate JWT token after registration
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE || '24h',
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE
        }
      );
      
      return this.success(res, { user, token }, 201);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * POST /auth/login
   */
  static async login(req, res) {
    try {
      if (process.env.DISABLE_DB === 'true') {
        const token = require('jsonwebtoken').sign(
          { userId: 'test-user', email: 'test@example.com', role: 'user' },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '1h' }
        );
        return this.success(res, { user: { id: 'test-user', email: 'test@example.com', role: 'user' }, token });
      }
      const { error, value } = this.validate(req.body, userSchemas.login);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const result = await AuthService.login(value.email, value.password);
      return this.success(res, result);
    } catch (err) {
      return this.error(res, err.message, 401, err);
    }
  }

  /**
   * POST /auth/change-password
   */
  static async changePassword(req, res) {
    try {
      if (process.env.DISABLE_DB === 'true') {
        return this.success(res, { message: 'Modo prueba: contraseña no cambia (sin BD)' });
      }
      const userId = req.userId;
      const { error, value } = this.validate(req.body, userSchemas.updatePassword);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      await AuthService.changePassword(userId, value.currentPassword, value.newPassword);
      return this.success(res, { message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * Endpoint de prueba: genera token sin BD
   */
  static async testLogin(req, res) {
    if (process.env.DISABLE_DB !== 'true') {
      return this.error(res, 'DISABLE_DB no está activo', 400);
    }
    const payload = { userId: 'test-user', email: 'test@example.com', role: 'user' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '1h',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
    return this.success(res, { user: payload, token });
  }

  /**
   * Endpoint protegido de prueba: solo valida JWT
   */
  static async testProtected(req, res) {
    if (process.env.DISABLE_DB !== 'true') {
      return this.error(res, 'DISABLE_DB no está activo', 400);
    }
    return this.success(res, { message: 'Acceso protegido OK', user: req.user });
  }
}
