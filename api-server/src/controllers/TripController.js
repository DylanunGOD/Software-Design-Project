import { ControllerBase } from './ControllerBase.js';
import { TripService } from '../services/index.js';
import { tripSchemas, paginationSchema } from '../models/validationSchemas.js';

/**
 * TripController - Controlador de viajes
 */
export class TripController extends ControllerBase {
  /**
   * POST /trips/start
   */
  static async startTrip(req, res) {
    try {
      const userId = req.userId;
      const { error, value } = this.validate(req.body, tripSchemas.create);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const trip = await TripService.startTrip(userId, value);
      return this.success(res, trip, 201);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * POST /trips/finish
   */
  static async finishTrip(req, res) {
    try {
      const userId = req.userId;
      const { error, value } = this.validate(req.body, tripSchemas.finish);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const trip = await TripService.finishTrip(userId, value);
      return this.success(res, trip);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * POST /trips/cancel
   */
  static async cancelTrip(req, res) {
    try {
      const userId = req.userId;
      const trip = await TripService.cancelTrip(userId);
      return this.success(res, trip);
    } catch (err) {
      return this.error(res, err.message, 400, err);
    }
  }

  /**
   * GET /trips/active
   */
  static async getActiveTrip(req, res) {
    try {
      const userId = req.userId;
      const trip = await TripService.getActiveTrip(userId);
      
      if (!trip) {
        return this.success(res, { message: 'No hay viaje activo' }, 204);
      }

      return this.success(res, trip);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * GET /trips/history
   */
  static async getHistory(req, res) {
    try {
      const userId = req.userId;
      const { error, value } = this.validate(req.query, paginationSchema);
      if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return this.error(res, messages, 400);
      }

      const result = await TripService.getTripHistory(userId, {
        page: value.page,
        limit: value.limit,
      });

      return this.paginated(res, result.data, {
        total: result.total,
        pages: result.pages,
        page: result.page,
        limit: result.limit,
      });
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }

  /**
   * GET /trips/:id
   */
  static async getTrip(req, res) {
    try {
      const userId = req.userId;
      const trip = await TripService.getTrip(req.params.id, userId);
      return this.success(res, trip);
    } catch (err) {
      return this.error(res, err.message, 404, err);
    }
  }

  /**
   * GET /trips/stats
   */
  static async getStats(req, res) {
    try {
      const userId = req.userId;
      const stats = await TripService.getUserStats(userId);
      return this.success(res, stats);
    } catch (err) {
      return this.error(res, err.message, 500, err);
    }
  }
}
