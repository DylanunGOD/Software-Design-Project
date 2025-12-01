/**
 * ControllerBase - Clase base para controladores
 * Proporciona métodos auxiliares para respuestas consistentes
 */
export class ControllerBase {
  /**
   * Respuesta exitosa
   * @param {Object} res - Response objeto de Express
   * @param {*} data - Datos a enviar
   * @param {number} statusCode - Código HTTP (default 200)
   */
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Respuesta de error
   * @param {Object} res - Response objeto de Express
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP
   * @param {Object} error - Error adicional (solo en desarrollo)
   */
  static error(res, message, statusCode = 400, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'development' && error) {
      response.error = error.message;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de lista paginada
   * @param {Object} res
   * @param {Array} data
   * @param {Object} pagination - {total, pages, page, limit}
   * @param {number} statusCode
   */
  static paginated(res, data, pagination, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Validar datos con Joi
   * @param {Object} data - Datos a validar
   * @param {Object} schema - Schema de Joi
   * @returns {Object} {error, value}
   */
  static validate(data, schema) {
    return schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
    });
  }
}
