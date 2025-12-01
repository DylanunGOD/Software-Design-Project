import express from 'express';
import { VehicleController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Listar vehículos disponibles
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos disponibles
 */
router.get('/', authenticate, VehicleController.getAvailable.bind(VehicleController));

/**
 * @swagger
 * /vehicles/search:
 *   get:
 *     summary: Buscar vehículos cercanos
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [scooter, bike]
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *           enum: [tier, lime, bird]
 *     responses:
 *       200:
 *         description: Vehículos encontrados
 */
router.get('/search', authenticate, VehicleController.search.bind(VehicleController));

/**
 * @swagger
 * /vehicles/location/{canton}/{distrito}:
 *   get:
 *     summary: Buscar vehículos por ubicación
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: canton
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: distrito
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehículos en la ubicación
 */
router.get('/location/:canton/:distrito', authenticate, VehicleController.searchByLocation.bind(VehicleController));

/**
 * @swagger
 * /vehicles/stats:
 *   get:
 *     summary: Obtener estadísticas de disponibilidad
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de vehículos
 */
router.get('/stats', authenticate, VehicleController.getStats.bind(VehicleController));

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Obtener detalle de vehículo
 *     tags:
 *       - Vehículos
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
 *         description: Detalle del vehículo
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/:id', authenticate, VehicleController.getVehicle.bind(VehicleController));

/**
 * @swagger
 * /vehicles/{id}/reserve:
 *   post:
 *     summary: Reservar vehículo
 *     tags:
 *       - Vehículos
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
 *         description: Vehículo reservado
 */
router.post('/:id/reserve', authenticate, VehicleController.reserve.bind(VehicleController));

/**
 * @swagger
 * /vehicles/{id}/release:
 *   post:
 *     summary: Liberar vehículo
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battery:
 *                 type: integer
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *             required:
 *               - battery
 *               - lat
 *               - lng
 *     responses:
 *       200:
 *         description: Vehículo liberado
 */
router.post('/:id/release', authenticate, VehicleController.release.bind(VehicleController));

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Crear nuevo vehículo con validación automática de ubicación
 *     description: |
 *       Crea un vehículo validando las coordenadas con Nominatim (OpenStreetMap).
 *       El sistema automáticamente:
 *       - Valida que las coordenadas estén en Costa Rica
 *       - Detecta el cantón y distrito usando Nominatim
 *       - Previene duplicados por coordenadas exactas
 *     tags:
 *       - Vehículos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 enum: [tier, lime, bird]
 *                 description: Compañía del vehículo
 *               type:
 *                 type: string
 *                 enum: [scooter, bike]
 *                 description: Tipo de vehículo
 *               lat:
 *                 type: number
 *                 description: Latitud (se valida que esté en Costa Rica)
 *                 example: 9.9334
 *               lng:
 *                 type: number
 *                 description: Longitud (se valida que esté en Costa Rica)
 *                 example: -84.0834
 *               battery:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 100
 *                 description: Nivel de batería
 *               price_per_min:
 *                 type: number
 *                 description: Precio por minuto
 *                 example: 3.5
 *             required:
 *               - company
 *               - type
 *               - lat
 *               - lng
 *               - price_per_min
 *           example:
 *             company: tier
 *             type: scooter
 *             lat: 9.9334
 *             lng: -84.0834
 *             battery: 85
 *             price_per_min: 3.5
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente con ubicación validada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     company:
 *                       type: string
 *                     type:
 *                       type: string
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *                     battery:
 *                       type: integer
 *                     price_per_min:
 *                       type: number
 *                     status:
 *                       type: string
 *                     canton:
 *                       type: string
 *                       description: Detectado automáticamente por Nominatim
 *                     distrito:
 *                       type: string
 *                       description: Detectado automáticamente por Nominatim
 *       400:
 *         description: Error de validación o coordenadas duplicadas
 *       401:
 *         description: No autenticado
 */
router.post('/', authenticate, VehicleController.create.bind(VehicleController));

export default router;
