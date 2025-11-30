import pkg from 'pg';
const { Client } = pkg;

/**
 * Singleton para la conexión a la base de datos PostgreSQL
 * Compatible con Azure Database for PostgreSQL
 */
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    // Configuración de conexión con SSL condicional
    const config = {
      connectionString: process.env.DATABASE_URL
    };

    // Solo agregar SSL si la URL incluye sslmode o si está en producción con proveedor cloud
    const urlLowerCase = (process.env.DATABASE_URL || '').toLowerCase();
    if (urlLowerCase.includes('supabase') || urlLowerCase.includes('azure') || urlLowerCase.includes('sslmode=require')) {
      config.ssl = {
        rejectUnauthorized: false // Requerido por proveedores cloud
      };
    }

    this.client = new Client(config);
    this.isConnected = false;

    DatabaseConnection.instance = this;
  }

  /**
   * Inicializar conexión a la base de datos
   * Debe ser llamado antes de usar cualquier método de query
   */
  async connect() {
    if (this.isConnected) {
      return;
    }

    try {
      await this.client.connect();
      this.isConnected = true;
      console.log('Conexion a PostgreSQL establecida correctamente');
    } catch (err) {
      console.error('Error conectando a BD PostgreSQL:', err.message);
      process.exit(1);
    }
  }

  /**
   * Ejecutar una sentencia SQL (INSERT, UPDATE, DELETE)
   * @param {string} sql - Sentencia SQL
   * @param {Array} params - Parámetros para la sentencia
   * @returns {Promise<Object>} Información del resultado: changes y lastID (si se usa RETURNING id)
   */
  run(sql, params = []) {
    return this.client.query(sql, params)
      .then(result => {
        // PostgreSQL requiere RETURNING id en la query para obtener el ID insertado
        // Si existe result.rows[0].id, lo retornamos (incluso si es 0)
        return {
          lastID: result.rows.length > 0 ? result.rows[0].id : undefined,
          changes: result.rowCount,
        };
      })
      .catch(err => {
        throw new Error(`Query error: ${err.message}`);
      });
  }

  /**
   * Obtener una fila (SELECT)
   * @param {string} sql - Sentencia SQL
   * @param {Array} params - Parámetros para la sentencia
   * @returns {Promise<Object|null>} Un registro o null
   */
  get(sql, params = []) {
    return this.client.query(sql, params)
      .then(result => result.rows[0] || null) // El resultado viene en el array 'rows'
      .catch(err => {
        throw new Error(`Query error: ${err.message}`);
      });
  }

  /**
   * Obtener múltiples filas (SELECT)
   * @param {string} sql - Sentencia SQL
   * @param {Array} params - Parámetros para la sentencia
   * @returns {Promise<Array>} Array de registros
   */
  all(sql, params = []) {
    return this.client.query(sql, params)
      .then(result => result.rows || [])
      .catch(err => {
        throw new Error(`Query error: ${err.message}`);
      });
  }

  // --- MÉTODOS DE TRANSACCIÓN ---
  // Se ejecutan directamente con el cliente de pg
  beginTransaction() {
    return this.client.query('BEGIN');
  }

  commit() {
    return this.client.query('COMMIT');
  }

  rollback() {
    return this.client.query('ROLLBACK');
  }

  /**
   * Cerrar conexión
   */
  close() {
    return this.client.end(); // Usar el método 'end' del cliente de pg
  }
}

// Exportar instancia única
export const db = new DatabaseConnection();