import express from 'express';
import { TripController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /trips/start:
 *   post:
 *     summary: Iniciar nuevo viaje
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [scooter, bike, manual]
 *               start_lat:
 *                 type: number
 *               start_lng:
 *                 type: number
 *               start_address:
 *                 type: string
 *             required:
 *               - type
 *               - start_lat
 *               - start_lng
 *               - start_address
 *     responses:
 *       201:
 *         description: Viaje iniciado
 */
router.post('/start', authenticate, TripController.startTrip.bind(TripController));

/**
 * @swagger
 * /trips/finish:
 *   post:
 *     summary: Finalizar viaje
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               end_lat:
 *                 type: number
 *               end_lng:
 *                 type: number
 *               end_address:
 *                 type: string
 *               duration_minutes:
 *                 type: integer
 *               distance:
 *                 type: number
 *             required:
 *               - end_lat
 *               - end_lng
 *               - end_address
 *               - duration_minutes
 *               - distance
 *     responses:
 *       200:
 *         description: Viaje finalizado
 */
router.post('/finish', authenticate, TripController.finishTrip.bind(TripController));

/**
 * @swagger
 * /trips/cancel:
 *   post:
 *     summary: Cancelar viaje activo
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Viaje cancelado
 */
router.post('/cancel', authenticate, TripController.cancelTrip.bind(TripController));

/**
 * @swagger
 * /trips/active:
 *   get:
 *     summary: Obtener viaje activo
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Viaje activo
 *       204:
 *         description: Sin viaje activo
 */
router.get('/active', authenticate, TripController.getActiveTrip.bind(TripController));

/**
 * @swagger
 * /trips/history:
 *   get:
 *     summary: Obtener historial de viajes
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Historial de viajes paginado
 */
router.get('/history', authenticate, TripController.getHistory.bind(TripController));

/**
 * @swagger
 * /trips/stats:
 *   get:
 *     summary: Obtener estadísticas de viajes del usuario
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de viajes
 */
router.get('/stats', authenticate, TripController.getStats.bind(TripController));

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Obtener detalles de un viaje
 *     tags:
 *       - Viajes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del viaje
 *       404:
 *         description: Viaje no encontrado
 */
router.get('/:id', authenticate, TripController.getTrip.bind(TripController));

export default router;
