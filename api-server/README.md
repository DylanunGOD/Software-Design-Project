# EcoRueda API Server

RESTful API for EcoRueda sustainable mobility platform.

## Overview

Node.js/Express backend with 28 endpoints providing authentication, vehicle management, trip tracking, and payment processing. Includes Swagger documentation and JWT security.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create `.env` file with:
```env
PORT=5001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
JWT_ISSUER=ecorueda-api
JWT_AUDIENCE=ecorueda-client
CORS_ORIGIN=http://localhost:5173
```

### Initialize Database
```bash
node scripts/setup-supabase.js
```

### Start Server
```bash
npm run dev
```

API available at `http://localhost:5001`

## Documentation

Interactive Swagger UI: `http://localhost:5001/api-docs`

## Technology Stack

- Express.js 4.21.2
- PostgreSQL 8.10.0
- jsonwebtoken 9.0.0
- bcryptjs 2.4.3
- Joi 17.10.0
- Swagger UI Express 5.0.0
- Helmet 7.0.0
- CORS 2.8.5

## Architecture

```
src/
├── routes/         # API routes with Swagger docs
├── controllers/    # Request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── middleware/     # Auth, error handling
├── models/         # Validation schemas
├── config/         # Configuration
└── utils/          # Utilities
```

## Design Patterns

- Repository Pattern (data access abstraction)
- Service Layer (business logic separation)
- Factory Pattern (repository creation)
- Singleton Pattern (database connection)
- Controller Base (consistent responses)

## API Endpoints

### Authentication (3)
- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/login` - Login with JWT
- POST `/api/v1/auth/change-password` - Update password

### Vehicles (8)
- GET `/api/v1/vehicles` - List available
- POST `/api/v1/vehicles` - Create with geo validation
- GET `/api/v1/vehicles/search` - Search by location
- GET `/api/v1/vehicles/:id` - Get details
- POST `/api/v1/vehicles/:id/reserve` - Reserve
- POST `/api/v1/vehicles/:id/release` - Release

### Trips (7)
- POST `/api/v1/trips/start` - Start trip
- POST `/api/v1/trips/finish` - Finish with payment
- GET `/api/v1/trips/history` - User history
- GET `/api/v1/trips/stats` - User statistics

### Profile (4)
- GET `/api/v1/profile` - User profile
- PUT `/api/v1/profile` - Update profile
- POST `/api/v1/profile/wallet/recharge` - Add funds

### Payments (6)
- GET `/api/v1/payments` - List methods
- POST `/api/v1/payments` - Add method
- PUT `/api/v1/payments/:id/default` - Set default
- DELETE `/api/v1/payments/:id` - Remove

Total: 28 endpoints (25 protected with JWT)

## Security Features

- JWT authentication with issuer/audience validation
- bcrypt password hashing (10 rounds)
- SQL injection prevention (parameterized queries)
- Helmet middleware for HTTP headers
- CORS with credential support
- Rate limiting (100 requests per 15 minutes)
- Joi input validation

## Database Schema

### Tables
- `users` - Accounts with balance
- `vehicles` - Inventory with location
- `trips` - Trip records with pricing
- `payments` - Payment methods (tokenized)

### Features
- Foreign keys with CASCADE
- Check constraints
- Optimized indexes
- Automatic updated_at triggers
- View for user statistics

## Scripts

Located in `scripts/` directory:

- `setup-supabase.js` - Initialize database schema
- `seed-vehicles.js` - Insert 15 test vehicles
- `add-vehicle.js` - CLI to add single vehicle
- `verify-seed-data.js` - Validate data integrity
- `test-seed-single.js` - Test single insertion

### Example: Add Vehicle
```bash
node scripts/add-vehicle.js --company tier --type scooter --lat 9.9334 --lng -84.0834
```

## Geographic Validation

Integrated Nominatim API for Costa Rica location detection:

- Validates coordinates within bounds (lat: 8.0-11.3, lng: -86.0 to -82.5)
- Auto-detects canton and distrito from GPS coordinates
- Prevents duplicate vehicles at exact coordinates
- Detected cantons: San Jose, Escazu, Heredia, Alajuela, Santa Ana, Cartago

**Utility**: `src/utils/locationValidator.js`

## Testing

```bash
# Test endpoints
.\test-endpoints-fixed.ps1

# Health check
curl http://localhost:5001/health
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for token signing
- `JWT_ISSUER` - Token issuer identifier
- `JWT_AUDIENCE` - Token audience identifier

Optional:
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRE` - Token expiration (default: 24h)
- `CORS_ORIGIN` - Allowed origin (default: http://localhost:5173)

## Response Format

All responses follow consistent structure:

**Success**:
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2025-11-30T12:00:00.000Z"
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2025-11-30T12:00:00.000Z"
}
```

**Paginated**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "pages": 10,
    "page": 1,
    "limit": 10
  },
  "timestamp": "2025-11-30T12:00:00.000Z"
}
```

## Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Production Checklist
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure HTTPS at load balancer
- Set appropriate `CORS_ORIGIN`
- Enable database backups
- Configure application monitoring
- Review rate limits per endpoint

## Known Issues

1. No database transactions for multi-step operations (trip finalization)
2. Role-based authorization not enforced (JWT contains role but no middleware)
3. Global rate limiting only (consider per-endpoint limits)

## Contributing

This is an academic project. For issues or suggestions, please open a GitHub issue.

## License

Academic use only.
