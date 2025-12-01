import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import config from './config/env.js';
import { db } from './config/dbConnection.js';
import { swaggerSpec } from './utils/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import tripRoutes from './routes/trips.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta más tarde'
});

app.use(limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de documentación
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: `/api/docs/swagger.json`
  }
}));

app.get('/api/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API en línea',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Rutas API
app.use(`${config.API_PREFIX}/auth`, authRoutes);
app.use(`${config.API_PREFIX}/vehicles`, vehicleRoutes);
app.use(`${config.API_PREFIX}/trips`, tripRoutes);
app.use(`${config.API_PREFIX}/profile`, userRoutes);
app.use(`${config.API_PREFIX}/payments`, paymentRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EcoRueda API v1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (debe ser el último middleware)
app.use(errorHandler);

export const initializeApp = async () => {
  try {
    if (process.env.DISABLE_DB === 'true') {
      console.log('DISABLE_DB activo: saltando conexión a base de datos');
    } else {
      console.log('Conectando a la base de datos PostgreSQL...');
      await db.connect();
      console.log('Base de datos conectada correctamente');
    }
  } catch (error) {
    console.error('Error inicializando aplicacion:', error);
    process.exit(1);
  }
};

export default app;
