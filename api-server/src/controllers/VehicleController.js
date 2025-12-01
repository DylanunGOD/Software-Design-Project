import { ControllerBase } from './ControllerBase.js';
import { VehicleService } from '../services/index.js';
import { vehicleSchemas } from '../models/validationSchemas.js';

/**
 * VehicleController - Controlador de vehículos
 */
export class VehicleController extends ControllerBase {
  /**
   * GET /vehicles
   */
  static async getAvailable(req, res) {
    try {
      const vehicles = await VehicleService.getAvailable();
      return this.success(res, vehicles);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * POST /vehicles/search
   */
  static async search(req, res) {
    try {
      const { lat, lng, radius } = req.query;
      const filters = {};

      if (!lat || !lng) {
        return this.error(res, 'Latitud y longitud son requeridas', 400);
      }

      if (req.query.type) filters.type = req.query.type;
      if (req.query.company) filters.company = req.query.company;

      const vehicles = await VehicleService.searchNearby(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius) || 1,
        filters
      );

      return this.success(res, vehicles);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /vehicles/location/:canton/:distrito
   */
  static async searchByLocation(req, res) {
    try {
      const { canton, distrito } = req.params;
      const vehicles = await VehicleService.searchByLocation(canton, distrito);
      return this.success(res, vehicles);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /vehicles/:id
   */
  static async getVehicle(req, res) {
    try {
      const vehicle = await VehicleService.getVehicle(req.params.id);
      return this.success(res, vehicle);
    } catch (err) {
      return this.error(res, err.message, 404, err);
    }
  }

  /**
   * POST /vehicles/:id/reserve
   */
  static async reserve(req, res) {
    try {
      const vehicle = await VehicleService.reserve(req.params.id);
      return this.success(res, vehicle);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * POST /vehicles/:id/release
   */
  static async release(req, res) {
    try {
      const { battery, lat, lng } = req.body;

      if (battery === undefined || lat === undefined || lng === undefined) {
        return this.error(res, 'battery, lat, y lng son requeridos', 400);
      }

      const vehicle = await VehicleService.release(req.params.id, {
        battery: parseInt(battery),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      return this.success(res, vehicle);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /vehicles/stats
   */
  static async getStats(req, res) {
    try {
      const stats = await VehicleService.getStats();
      return this.success(res, stats);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * POST /vehicles
   * Crear nuevo vehículo con validación automática de ubicación
   */
  static async create(req, res) {
    try {
      // Validar datos requeridos
      const { error, value } = vehicleSchemas.create.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(d => d.message);
        return this.error(res, 'Errores de validación', 400, { errors });
      }

      // Crear vehículo (el service valida con Nominatim)
      const vehicle = await VehicleService.create(value);
      
      return this.success(res, vehicle, 201);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }
}
