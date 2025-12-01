import { db } from '../config/dbConnection.js';

/**
 * BaseRepository - Clase base para todos los repositorios
 * Implementa el Repository Pattern con CRUD operations genéricas
 */
export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Obtener todos los registros
   * @param {Object} options - {limit, offset, where, orderBy}
   * @returns {Promise<Array>}
   */
  async findAll(options = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (options.where) {
      const conditions = Object.keys(options.where)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      sql += ` WHERE ${conditions}`;
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    }

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }

    const params = options.where ? Object.values(options.where) : [];
    return this.db.all(sql, params);
  }

  /**
   * Obtener un registro por ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    return this.db.get(sql, [id]);
  }

  /**
   * Obtener primer registro que coincida
   * @param {Object} where - Condiciones WHERE
   * @returns {Promise<Object|null>}
   */
  async findOne(where) {
    const conditions = Object.keys(where)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
    const params = Object.values(where);
    return this.db.get(sql, params);
  }

  /**
   * Crear nuevo registro
   * @param {Object} data - Datos del registro
   * @returns {Promise<Object>} Registro creado
   */
  async create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    
    const result = await this.db.run(sql, Object.values(data));
    return { ...data, id: result.lastID };
  }

  /**
   * Actualizar registro por ID
   * @param {string} id
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const updates = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`;
    
    const values = [...Object.values(data), id];
    const result = await this.db.run(sql, values);
    return result.lastID ? this.findById(id) : null;
  }

  /**
   * Eliminar registro por ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await this.db.run(sql, [id]);
    return result.changes > 0;
  }

  /**
   * Contar registros
   * @param {Object} where - Condiciones WHERE
   * @returns {Promise<number>}
   */
  async count(where = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    
    if (Object.keys(where).length > 0) {
      const conditions = Object.keys(where)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      sql += ` WHERE ${conditions}`;
    }

    const result = await this.db.get(sql, Object.values(where));
    return result?.count || 0;
  }

  /**
   * Verificar si existe un registro
   * @param {Object} where - Condiciones WHERE
   * @returns {Promise<boolean>}
   */
  async exists(where) {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Búsqueda con múltiples condiciones y paginación
   * @param {Object} options - {where, orderBy, limit, page}
   * @returns {Promise<{data, total, pages}>}
   */
  async paginate(options = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const data = await this.findAll({
      where: options.where,
      orderBy: options.orderBy,
      limit,
      offset,
    });

    const total = await this.count(options.where);
    const pages = Math.ceil(total / limit);

    return { data, total, pages, page, limit };
  }
}
