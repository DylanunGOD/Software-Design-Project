import express from 'express';
import { AuthController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Mínimo 8 caracteres, mayúscula, minúscula y número
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Validación o email ya registrado
 */
router.post('/register', AuthController.register.bind(AuthController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', AuthController.login.bind(AuthController));

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags:
 *       - Autenticación
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña actual incorrecta
 *       401:
 *         description: No autorizado
 */
router.post('/change-password', authenticate, AuthController.changePassword.bind(AuthController));

// Rutas de prueba sin BD (solo si DISABLE_DB está activo)
if (process.env.DISABLE_DB === 'true') {
	router.post('/test-login', AuthController.testLogin.bind(AuthController));
	router.get('/test-protected', authenticate, AuthController.testProtected.bind(AuthController));
}

export default router;
