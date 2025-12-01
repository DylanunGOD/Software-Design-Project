# EcoRueda - Sustainable Mobility Platform

A full-stack web application for shared mobility vehicles (scooters and bikes) management with RESTful API, JWT authentication, and geographic validation.

## Project Overview

EcoRueda is a comprehensive mobility platform consisting of:
- **Frontend**: React 18 + Vite + Tailwind CSS with interactive maps
- **Backend**: Node.js + Express REST API with 28 endpoints
- **Database**: PostgreSQL (Supabase) with optimized schema
- **Authentication**: JWT with issuer/audience validation
- **Documentation**: Swagger/OpenAPI 3.0 inline specification

## Architecture

The project follows a 5-layer architecture with professional design patterns:
- Routes (HTTP mapping + Swagger)
- Controllers (Request handling)
- Services (Business logic)
- Repositories (Data access)
- Database (PostgreSQL)

**Design Patterns Implemented**:
- Repository Pattern
- Service Layer Pattern
- Factory Pattern
- Singleton Pattern
- Controller Base Pattern

## Features

### Core Functionality
- User authentication and registration (JWT)
- Vehicle management with geographic validation
- Trip management with automatic pricing
- Payment methods with tokenization
- User wallet and balance management
- Real-time vehicle availability

### Geographic Validation System
- Nominatim API integration for reverse geocoding
- Automatic canton/distrito detection for Costa Rica
- Coordinate validation (lat: 8.0-11.3, lng: -86.0 to -82.5)
- Prevention of duplicate vehicles by exact coordinates

### Security
- JWT authentication with bcrypt password hashing
- SQL injection prevention (100% parameterized queries)
- Helmet middleware for HTTP headers
- CORS with credential support
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi schemas

## Technology Stack

### Frontend
- React 18.3.1
- Vite 5.2.0 (Build tool)
- Tailwind CSS 3.4.3
- MapLibre GL 4.1.0
- React Map GL 7.1.7

### Backend
- Node.js with ES Modules
- Express.js 4.21.2
- PostgreSQL 8.10.0
- jsonwebtoken 9.0.0
- bcryptjs 2.4.3
- Joi 17.10.0 (Validation)
- Swagger UI Express 5.0.0

### Infrastructure
- Supabase (PostgreSQL hosting)
- Nominatim API (OpenStreetMap)

## Installation and Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Supabase account)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

The frontend will be available at `http://localhost:5173`

### API Setup

1. Navigate to API directory:
```bash
cd api-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in `api-server/` directory:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=24h
JWT_ISSUER=ecorueda-api
JWT_AUDIENCE=ecorueda-client
CORS_ORIGIN=http://localhost:5173
```

4. Initialize database:
```bash
node scripts/setup-supabase.js
```

5. Seed initial data (optional):
```bash
cd scripts
node seed-vehicles.js
```

6. Start API server:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`

### API Documentation

Access interactive Swagger documentation at:
```
http://localhost:5001/api-docs
```

## API Endpoints

### Authentication (3 endpoints)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/change-password` - Change password

### Vehicles (8 endpoints)
- `GET /api/v1/vehicles` - List available vehicles
- `POST /api/v1/vehicles` - Create vehicle with geographic validation
- `GET /api/v1/vehicles/search` - Search by location and filters
- `GET /api/v1/vehicles/location/:canton/:distrito` - Search by admin division
- `GET /api/v1/vehicles/stats` - Availability statistics
- `GET /api/v1/vehicles/:id` - Get vehicle details
- `POST /api/v1/vehicles/:id/reserve` - Reserve vehicle
- `POST /api/v1/vehicles/:id/release` - Release vehicle

### Trips (7 endpoints)
- `POST /api/v1/trips/start` - Start new trip
- `POST /api/v1/trips/finish` - Finish active trip
- `POST /api/v1/trips/cancel` - Cancel active trip
- `GET /api/v1/trips/active` - Get current trip
- `GET /api/v1/trips/history` - Trip history (paginated)
- `GET /api/v1/trips/stats` - User trip statistics
- `GET /api/v1/trips/:id` - Get trip details

### User Profile (4 endpoints)
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update profile
- `GET /api/v1/profile/wallet` - Get wallet balance
- `POST /api/v1/profile/wallet/recharge` - Recharge wallet

### Payment Methods (6 endpoints)
- `GET /api/v1/payments` - List all payment methods
- `GET /api/v1/payments/active` - List active methods
- `GET /api/v1/payments/default` - Get default method
- `POST /api/v1/payments` - Add payment method
- `PUT /api/v1/payments/:id/default` - Set as default
- `DELETE /api/v1/payments/:id` - Remove payment method

**Total: 28 endpoints** (25 protected with JWT)

## Database Schema

### Tables
- `users` - User accounts with wallet balance
- `vehicles` - Vehicles with location and status
- `trips` - Trip records with pricing
- `payments` - Payment methods (tokenized)

### Views
- `v_user_trip_stats` - Aggregated user statistics

### Features
- Foreign keys with CASCADE
- Check constraints for data integrity
- Indexes on frequently queried columns
- Automatic `updated_at` triggers

## Scripts and Utilities

### Seeding Scripts (`api-server/scripts/`)
- `seed-vehicles.js` - Insert 15 predefined vehicles
- `add-vehicle.js` - CLI tool to add individual vehicles
- `verify-seed-data.js` - Validate inserted data
- `test-seed-single.js` - Test single vehicle insertion

### Usage Example
```bash
cd api-server/scripts
node add-vehicle.js --company tier --type scooter --lat 9.9334 --lng -84.0834 --battery 85 --price 3.5
```

## Testing

### Run API endpoint tests:
```powershell
cd api-server
.\test-endpoints-fixed.ps1
```

### Health check:
```bash
curl http://localhost:5001/health
```

## Project Structure

```
/
├── src/                    # Frontend React components
│   ├── components/         # UI components
│   ├── styles/            # CSS styles
│   └── utils/             # Frontend utilities
├── api-server/            # Backend API
│   ├── src/
│   │   ├── routes/        # API routes + Swagger
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access layer
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Validation schemas
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utilities (locationValidator)
│   └── scripts/           # Seeding and utilities
├── scripts/               # Root-level scripts
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## Development Workflow

### Frontend Development
```bash
npm run dev
```
Hot reload enabled at `http://localhost:5173`

### API Development
```bash
cd api-server
npm run dev
```
API running at `http://localhost:5001`

### Code Quality
- ES Modules throughout
- Consistent naming conventions
- JSDoc comments on main functions
- Error handling with try-catch
- Validation with Joi schemas

## Business Logic

### Trip Pricing
- Price calculated as: `duration_minutes × vehicle.price_per_min`
- Automatic balance deduction on trip completion
- Validation of sufficient balance before finalization

### Geographic Validation
- Coordinates validated within Costa Rica bounds
- Automatic canton/distrito detection via Nominatim
- Detected cantons: San Jose, Escazu, Heredia, Alajuela, Santa Ana, Cartago
- Rate limiting respected (1.5s delay between API calls)

## Deployment Considerations

### Environment Variables
Ensure all required environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong secret key
- `JWT_ISSUER` - API identifier
- `JWT_AUDIENCE` - Client identifier
- `CORS_ORIGIN` - Allowed frontend origin

### Security Checklist
- Rotate JWT secret for production
- Use strong database passwords
- Enable HTTPS (configured at proxy/load balancer level)
- Review and update CORS origins
- Configure appropriate rate limits per endpoint

### Database
- Backup configured in Supabase
- Connection pooling enabled
- SSL required for connections

## Known Limitations

1. **Transactions**: Multi-step operations (e.g., trip finalization) do not use database transactions. Recommended for production.

2. **Role Authorization**: JWT includes role claim but no middleware enforcement. Consider adding `authorize(['admin'])` for admin endpoints.

3. **Geographic Accuracy**: Nominatim may return approximate locations. Manual verification recommended for edge cases.

4. **Rate Limiting**: Global limit only. Consider granular limits per endpoint type (e.g., login: 10/15min).

## Future Improvements

- Implement database transactions for financial operations
- Add role-based authorization middleware
- PostGIS extension for precise geospatial queries
- Redis caching for frequently accessed data
- Structured logging with pino or winston
- CI/CD pipeline with GitHub Actions
- Comprehensive test suite (unit + integration)

## Contributing

This is an academic project. For inquiries or suggestions, please open an issue in the GitHub repository.

## License

This project is developed for academic purposes.

## Repository

[https://github.com/DylanunGOD/Software-Design-Project](https://github.com/DylanunGOD/Software-Design-Project)

## Author

DylanunGOD

## Acknowledgments

- OpenStreetMap Nominatim API for geocoding services
- Supabase for PostgreSQL hosting
- Express.js and Node.js communities
