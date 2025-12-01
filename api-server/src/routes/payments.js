import express from 'express';
import { PaymentController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Obtener métodos de pago del usuario
 *     tags:
 *       - Pagos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 */
router.get('/', authenticate, PaymentController.getPaymentMethods.bind(PaymentController));

/**
 * @swagger
 * /payments/active:
 *   get:
 *     summary: Obtener métodos de pago activos
 *     tags:
 *       - Pagos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de métodos de pago activos
 */
router.get('/active', authenticate, PaymentController.getActiveMethods.bind(PaymentController));

/**
 * @swagger
 * /payments/default:
 *   get:
 *     summary: Obtener método de pago por defecto
 *     tags:
 *       - Pagos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Método de pago por defecto
 *       204:
 *         description: Sin método de pago por defecto
 */
router.get('/default', authenticate, PaymentController.getDefaultMethod.bind(PaymentController));

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Agregar nuevo método de pago
 *     tags:
 *       - Pagos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
	*               card_last4:
	*                 type: string
	*                 description: Últimos 4 dígitos de la tarjeta
	*                 example: "8483"
	*               provider:
	*                 type: string
	*                 description: Marca/proveedor del método de pago
	*                 enum: [visa, mastercard, amex, discover, paypal]
	*                 example: "visa"
	*               method_type:
	*                 type: string
	*                 description: Tipo de método de pago
	*                 enum: [card, wallet, bank]
	*                 example: "card"
 *             required:
	*               - card_last4
	*               - provider
 *     responses:
 *       201:
 *         description: Método de pago agregado
 */
router.post('/', authenticate, PaymentController.addPaymentMethod.bind(PaymentController));

/**
 * @swagger
 * /payments/{id}/default:
 *   put:
 *     summary: Establecer método de pago como por defecto
 *     tags:
 *       - Pagos
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
 *         description: Método establecido como por defecto
 */
router.put('/:id/default', authenticate, PaymentController.setDefaultPaymentMethod.bind(PaymentController));

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Eliminar método de pago
 *     tags:
 *       - Pagos
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
 *         description: Método de pago eliminado
 */
router.delete('/:id', authenticate, PaymentController.deletePaymentMethod.bind(PaymentController));

export default router;
