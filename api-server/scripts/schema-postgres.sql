-- EcoRueda PostgreSQL Schema
-- Ejecutar este script en Azure Database for PostgreSQL (Flexible Server)
-- Recomendado: psql "<DATABASE_URL>" -f schema-postgres.sql

-- UUIDs generados por la aplicación (uuid.v4() en Node.js)
-- No se usa extensión uuid-ossp ni pgcrypto debido a restricciones de Azure

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  is_active SMALLINT NOT NULL DEFAULT 1, -- 1 activo, 0 inactivo
  email_verified SMALLINT NOT NULL DEFAULT 0, -- 1 verificado
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY,
  company TEXT NOT NULL CHECK (company IN ('tier','lime','bird')),
  type TEXT NOT NULL CHECK (type IN ('scooter','bike')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  battery SMALLINT NOT NULL DEFAULT 100 CHECK (battery BETWEEN 0 AND 100),
  price_per_min NUMERIC(10,2) NOT NULL DEFAULT 0.50,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','in_use','maintenance')),
  canton TEXT,
  distrito TEXT,
  reserved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(canton,distrito);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);

-- Tabla de viajes
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing','completed','cancelled')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  start_lat DOUBLE PRECISION,
  start_lng DOUBLE PRECISION,
  start_address TEXT,
  end_lat DOUBLE PRECISION,
  end_lng DOUBLE PRECISION,
  end_address TEXT,
  duration_minutes INTEGER, -- calculado al finalizar
  distance NUMERIC(10,3), -- km
  price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_user_status ON trips(user_id,status);

-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT, -- ej: 'visa','mastercard','stripe','paypal'
  method_type TEXT NOT NULL DEFAULT 'card', -- 'card','wallet','bank'
  card_last4 TEXT, -- últimos 4 dígitos si aplica
  token TEXT, -- token seguro del gateway (no almacenar PAN completo)
  is_active SMALLINT NOT NULL DEFAULT 1,
  is_default SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_active ON payments(user_id,is_active);
CREATE INDEX IF NOT EXISTS idx_payments_default ON payments(user_id,is_default);

-- Trigger para updated_at (usuarios, vehículos, viajes, pagos)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated') THEN
    CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_vehicles_updated') THEN
    CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_trips_updated') THEN
    CREATE TRIGGER trg_trips_updated BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_payments_updated') THEN
    CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;$$;

-- Vistas útiles (opcional)
CREATE OR REPLACE VIEW v_user_trip_stats AS
SELECT 
  u.id AS user_id,
  COUNT(t.id) AS total_trips,
  SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_trips,
  SUM(CASE WHEN t.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips,
  COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.distance ELSE 0 END),0) AS total_distance,
  COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.duration_minutes ELSE 0 END),0) AS total_minutes,
  COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.price ELSE 0 END),0) AS total_spent
FROM users u
LEFT JOIN trips t ON t.user_id = u.id
GROUP BY u.id;

-- Comprobación rápida
-- SELECT * FROM users LIMIT 1;
-- SELECT * FROM vehicles LIMIT 1;
-- SELECT * FROM trips LIMIT 1;
-- SELECT * FROM payments LIMIT 1;
-- SELECT * FROM v_user_trip_stats LIMIT 1;

-- FIN DEL SCRIPT
