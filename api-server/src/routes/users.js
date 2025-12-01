import express from 'express';
import { UserController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags:
 *       - Perfil
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil del usuario
 */
router.get('/', authenticate, UserController.getProfile.bind(UserController));

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags:
 *       - Perfil
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
router.put('/', authenticate, UserController.updateProfile.bind(UserController));

/**
 * @swagger
 * /profile/wallet:
 *   get:
 *     summary: Obtener saldo de cartera
 *     tags:
 *       - Cartera
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo actual
 */
router.get('/wallet', authenticate, UserController.getWallet.bind(UserController));

/**
 * @swagger
 * /profile/wallet/recharge:
 *   post:
 *     summary: Recargar saldo
 *     tags:
 *       - Cartera
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: Saldo recargado exitosamente
 */
router.post('/wallet/recharge', authenticate, UserController.rechargeWallet.bind(UserController));

export default router;
