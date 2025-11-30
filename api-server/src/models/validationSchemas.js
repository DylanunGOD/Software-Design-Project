import Joi from 'joi';

/**
 * Esquemas de validación Joi para entidades del sistema
 * Utilizados para validar datos de entrada en requests
 */

// ==========================================
// USUARIO
// ==========================================

export const userSchemas = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email debe ser válido',
        'any.required': 'Email es requerido',
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'Contraseña debe tener mayúsculas, minúsculas y números',
        'any.required': 'Contraseña es requerida',
      }),
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Nombre debe tener al menos 3 caracteres',
        'any.required': 'Nombre es requerido',
      }),
    phone: Joi.string()
      .pattern(/^\+?[0-9\s\-()]{7,}$/)
      .optional(),
  }).options({ stripUnknown: true }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
  }).options({ stripUnknown: true }),

  updateProfile: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .optional(),
    phone: Joi.string()
      .pattern(/^\+?[0-9\s\-()]{7,}$/)
      .optional(),
  }).options({ stripUnknown: true }),

  updatePassword: Joi.object({
    currentPassword: Joi.string()
      .required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required(),
  }).options({ stripUnknown: true }),
};

// ==========================================
// VEHÍCULOS
// ==========================================

export const vehicleSchemas = {
  create: Joi.object({
    company: Joi.string()
      .valid('tier', 'lime', 'bird')
      .required(),
    type: Joi.string()
      .valid('scooter', 'bike')
      .required(),
    lat: Joi.number()
      .required(),
    lng: Joi.number()
      .required(),
    battery: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required(),
    price_per_min: Joi.number()
      .positive()
      .required(),
    canton: Joi.string()
      .required(),
    distrito: Joi.string()
      .required(),
  }).options({ stripUnknown: true }),

  update: Joi.object({
    battery: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .optional(),
    status: Joi.string()
      .valid('available', 'in_use', 'maintenance')
      .optional(),
    lat: Joi.number()
      .optional(),
    lng: Joi.number()
      .optional(),
    price_per_min: Joi.number()
      .positive()
      .optional(),
  }).options({ stripUnknown: true }),

  search: Joi.object({
    type: Joi.string()
      .valid('scooter', 'bike')
      .optional(),
    company: Joi.string()
      .valid('tier', 'lime', 'bird')
      .optional(),
    canton: Joi.string()
      .optional(),
    distrito: Joi.string()
      .optional(),
  }).options({ stripUnknown: true }),

  nearby: Joi.object({
    lat: Joi.number()
      .required(),
    lng: Joi.number()
      .required(),
    radius: Joi.number()
      .positive()
      .default(1)
      .optional(),
  }).options({ stripUnknown: true }),
};

// ==========================================
// VIAJES
// ==========================================

export const tripSchemas = {
  create: Joi.object({
    vehicle_id: Joi.string()
      .uuid()
      .required(),
    start_lat: Joi.number()
      .optional(),
    start_lng: Joi.number()
      .optional(),
    start_address: Joi.string()
      .optional(),
  }).options({ stripUnknown: true }),

  finish: Joi.object({
    end_lat: Joi.number()
      .required(),
    end_lng: Joi.number()
      .required(),
    end_address: Joi.string()
      .required(),
    duration_minutes: Joi.number()
      .integer()
      .positive()
      .required(),
    distance: Joi.number()
      .positive()
      .required(),
  }).options({ stripUnknown: true }),

  history: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional(),
  }).options({ stripUnknown: true }),
};

// ==========================================
// PAGOS
// ==========================================

export const paymentSchemas = {
  create: Joi.object({
    card_last4: Joi.string()
      .length(4)
      .pattern(/^\d+$/)
      .required(),
    provider: Joi.string()
      .valid('visa', 'mastercard', 'amex', 'discover', 'paypal')
      .optional(),
    method_type: Joi.string()
      .valid('card', 'wallet', 'bank')
      .optional(),
  }).options({ stripUnknown: true }),

  setDefault: Joi.object({
    id: Joi.string()
      .required(),
  }).options({ stripUnknown: true }),
};

// ==========================================
// PAGINACIÓN
// ==========================================

export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional(),
}).options({ stripUnknown: true });
