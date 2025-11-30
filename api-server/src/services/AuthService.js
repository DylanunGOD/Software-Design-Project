import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

const userRepo = repositoryFactory.getUserRepository();

/**
 * AuthService - Servicios de autenticación
 */
export class AuthService {
  /**
   * Registrar nuevo usuario
   * @param {Object} userData - {email, password, name, phone}
   * @returns {Promise<Object>} Usuario creado
   */
  static async register(userData) {
    // Verificar si email ya existe
    const existingUser = await userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de contraseña
    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    // Crear usuario
    const user = await userRepo.create({
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone || null,
      balance: 0,
      role: 'user',
      is_active: 1,
      email_verified: 0,
    });

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '24h',
        issuer: process.env.JWT_ISSUER || 'ecorueda-api',
        audience: process.env.JWT_AUDIENCE || 'ecorueda-client'
      }
    );

    // Remover contraseña del respuesta
    delete user.password;
    return { user, token };
  }

  /**
   * Login de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} {user, token}
   */
  static async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    await userRepo.updateLastLogin(user.id);

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '24h',
        issuer: process.env.JWT_ISSUER || 'ecorueda-api',
        audience: process.env.JWT_AUDIENCE || 'ecorueda-client'
      }
    );

    delete user.password;
    return { user, token };
  }

  /**
   * Cambiar contraseña
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hash nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Actualizar
    await userRepo.update(userId, { password: hashedPassword });
  }

  /**
   * Verificar token JWT
   * @param {string} token
   * @returns {Object} Payload del token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER || 'ecorueda-api',
        audience: process.env.JWT_AUDIENCE || 'ecorueda-client'
      });
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}
