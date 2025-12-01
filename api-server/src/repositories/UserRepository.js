import { BaseRepository } from './BaseRepository.js';

/**
 * UserRepository - Gestiona operaciones CRUD para usuarios
 * @extends BaseRepository
 */
export class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Buscar usuario por email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Buscar usuarios activos
   * @returns {Promise<Array>}
   */
  async findActive() {
    return this.findAll({ where: { is_active: 1 } });
  }

  /**
   * Obtener perfil de usuario (sin contraseña)
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getProfile(id) {
    const user = await this.findById(id);
    if (user) {
      delete user.password;
    }
    return user;
  }

  /**
   * Actualizar saldo de usuario
   * @param {string} id
   * @param {number} amount - Cantidad a agregar (puede ser negativa)
   * @returns {Promise<Object>}
   */
  async updateBalance(id, amount) {
    const sql = `
      UPDATE users 
      SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING *
    `;
    await this.db.run(sql, [amount, id]);
    return this.findById(id);
  }

  /**
   * Actualizar último login
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async updateLastLogin(id) {
    const sql = `
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    await this.db.run(sql, [id]);
    return this.findById(id);
  }

  /**
   * Desactivar usuario
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deactivate(id) {
    return this.update(id, { is_active: 0 });
  }
}
