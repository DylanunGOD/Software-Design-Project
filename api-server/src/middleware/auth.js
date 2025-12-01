import jwt from 'jsonwebtoken';
import { repositoryFactory } from '../repositories/RepositoryFactory.js';

/**
 * Middleware de autenticación JWT
 * Valida el token Bearer y extrae userId
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.slice(7); // Remover "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    // Verificación de estado de usuario solo si BD está habilitada
    if (process.env.DISABLE_DB !== 'true') {
      const userRepo = repositoryFactory.getUserRepository();
      const user = await userRepo.findById(decoded.userId);
      if (!user || user.is_active !== 1) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo o no existe',
          timestamp: new Date().toISOString(),
        });
      }
    }

    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido o malformado',
      timestamp: new Date().toISOString(),
    });
  }
};

export default authenticate;

