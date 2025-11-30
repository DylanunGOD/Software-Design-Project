import swaggerJsdoc from 'swagger-jsdoc';
import config from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoRueda API',
      version: '1.0.0',
      description: 'API REST para la plataforma de movilidad sostenible EcoRueda.\n\nAutenticación: usar esquema Bearer JWT. Enviar encabezado Authorization: Bearer <token>.\nExpiración por defecto del token: ' + (process.env.JWT_EXPIRE || '24h') + '. Issuer: ' + (process.env.JWT_ISSUER || 'ecorueda-api') + ', Audience: ' + (process.env.JWT_AUDIENCE || 'ecorueda-client') + '.\nAl expirar el token devolverá 401 con mensaje "Token expirado". Renueve iniciando sesión nuevamente.',
      contact: {
        name: 'Dylan',
        email: 'dylan@ecorueda.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}${config.API_PREFIX}`,
        description: 'Servidor de desarrollo'
      },
      {
        url: `https://ecorueda-api.azurewebsites.net${config.API_PREFIX}`,
        description: 'Servidor de producción'
      }
    ],
    security: [
      { BearerAuth: [] }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // ==================== Respuestas Estándar ====================
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object', description: 'Datos de la respuesta' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          },
          required: ['success', 'data', 'timestamp']
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 100 },
                pages: { type: 'integer', example: 10 },
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            error: { type: 'string', example: 'ERROR_CODE' },
            timestamp: { type: 'string', format: 'date-time' }
          },
          required: ['success', 'message', 'timestamp']
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error de validación' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email debe ser válido' }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        
        // ==================== Autenticación ====================
        AuthRegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { 
              type: 'string', 
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
              example: 'Password123',
              description: 'Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número'
            },
            name: { type: 'string', minLength: 3, example: 'Juan Pérez' },
            phone: { type: 'string', example: '+506 8888-8888' }
          }
        },
        AuthLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'Password123' }
          }
        },
        AuthLoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT firmado (Bearer). Expira en ' + (process.env.JWT_EXPIRE || '24h')
            }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'OldPassword123' },
            newPassword: { 
              type: 'string', 
              minLength: 8,
              example: 'NewPassword123',
              description: 'Debe cumplir requisitos de fortaleza'
            }
          }
        },
        
        // ==================== Usuario ====================
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            phone: { type: 'string', example: '+506 8888-8888' },
            balance: { type: 'number', format: 'float', example: 5000.00 },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            is_active: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, example: 'Juan Carlos Pérez' },
            phone: { type: 'string', example: '+506 8888-8888' }
          }
        },
        WalletRechargeRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: { type: 'number', minimum: 1, example: 10000, description: 'Monto a recargar (debe ser > 0)' }
          }
        },
        
        // ==================== Vehículos ====================
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
            company: { type: 'string', enum: ['tier', 'lime', 'bird'], example: 'tier' },
            type: { type: 'string', enum: ['scooter', 'bike'], example: 'scooter' },
            lat: { type: 'number', format: 'double', example: 9.9325427 },
            lng: { type: 'number', format: 'double', example: -84.0795782 },
            battery: { type: 'integer', minimum: 0, maximum: 100, example: 85 },
            price_per_min: { type: 'number', format: 'float', example: 150.00 },
            canton: { type: 'string', example: 'San José' },
            distrito: { type: 'string', example: 'Carmen' },
            reserved: { type: 'boolean', example: false },
            status: { type: 'string', enum: ['available', 'in_use', 'maintenance'], example: 'available' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        VehicleReleaseRequest: {
          type: 'object',
          required: ['battery', 'lat', 'lng'],
          properties: {
            battery: { type: 'integer', minimum: 0, maximum: 100, example: 70 },
            lat: { type: 'number', format: 'double', example: 9.9350000 },
            lng: { type: 'number', format: 'double', example: -84.0800000 }
          }
        },
        VehicleStats: {
          type: 'object',
          properties: {
            available: { type: 'integer', example: 45 },
            in_use: { type: 'integer', example: 12 },
            maintenance: { type: 'integer', example: 3 },
            by_type: {
              type: 'object',
              properties: {
                scooter_available: { type: 'integer', example: 30 },
                bike_available: { type: 'integer', example: 15 }
              }
            }
          }
        },
        
        // ==================== Viajes ====================
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174002' },
            user_id: { type: 'string', format: 'uuid' },
            vehicle_id: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['ongoing', 'completed', 'cancelled'], example: 'completed' },
            start_time: { type: 'string', format: 'date-time', example: '2024-01-01T10:00:00Z' },
            end_time: { type: 'string', format: 'date-time', example: '2024-01-01T10:30:00Z' },
            start_lat: { type: 'number', format: 'double', example: 9.9325427 },
            start_lng: { type: 'number', format: 'double', example: -84.0795782 },
            start_address: { type: 'string', example: 'Avenida Central, San José' },
            end_lat: { type: 'number', format: 'double', example: 9.9350000 },
            end_lng: { type: 'number', format: 'double', example: -84.0800000 },
            end_address: { type: 'string', example: 'Parque Central, San José' },
            duration_minutes: { type: 'integer', example: 30 },
            distance: { type: 'number', format: 'float', example: 2.5, description: 'Distancia en kilómetros' },
            price: { type: 'number', format: 'float', example: 4500.00 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        TripStartRequest: {
          type: 'object',
          required: ['vehicle_id', 'start_lat', 'start_lng', 'start_address'],
          properties: {
            vehicle_id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
            start_lat: { type: 'number', format: 'double', example: 9.9325427 },
            start_lng: { type: 'number', format: 'double', example: -84.0795782 },
            start_address: { type: 'string', example: 'Avenida Central, San José' }
          }
        },
        TripFinishRequest: {
          type: 'object',
          required: ['end_lat', 'end_lng', 'end_address', 'duration_minutes', 'distance'],
          properties: {
            end_lat: { type: 'number', format: 'double', example: 9.9350000 },
            end_lng: { type: 'number', format: 'double', example: -84.0800000 },
            end_address: { type: 'string', example: 'Parque Central, San José' },
            duration_minutes: { type: 'integer', minimum: 1, example: 30 },
            distance: { type: 'number', format: 'float', minimum: 0, example: 2.5 }
          }
        },
        TripStats: {
          type: 'object',
          properties: {
            total_trips: { type: 'integer', example: 50 },
            completed_trips: { type: 'integer', example: 45 },
            cancelled_trips: { type: 'integer', example: 5 },
            total_distance: { type: 'number', format: 'float', example: 125.5 },
            total_minutes: { type: 'integer', example: 1500 },
            total_spent: { type: 'number', format: 'float', example: 225000.00 }
          }
        },
        
        // ==================== Pagos ====================
        PaymentMethod: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174003' },
            user_id: { type: 'string', format: 'uuid' },
            provider: { type: 'string', example: 'visa' },
            method_type: { type: 'string', example: 'card' },
            card_last4: { type: 'string', example: '4242', description: 'Últimos 4 dígitos' },
            is_active: { type: 'integer', example: 1 },
            is_default: { type: 'integer', example: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AddPaymentMethodRequest: {
          type: 'object',
          required: ['card_last4'],
          properties: {
            card_last4: { type: 'string', minLength: 4, maxLength: 4, example: '4242' },
            provider: { type: 'string', enum: ['visa', 'mastercard', 'amex', 'discover', 'paypal'], example: 'visa' },
            method_type: { type: 'string', enum: ['card', 'wallet', 'bank'], example: 'card' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
