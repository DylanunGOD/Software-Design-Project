import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../ecorueda.db');
const db = new sqlite3.Database(dbPath);

console.log('📊 Inicializando base de datos SQLite...\n');

// Helper para ejecutar SQL sequencialmente
const runAsync = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const runPrepared = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

(async () => {
  try {
    // ==========================================
    // TABLA: USUARIOS
    // ==========================================
    await runAsync(`
      DROP TABLE IF EXISTS users;
      
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        balance REAL DEFAULT 0.00,
        role TEXT DEFAULT 'user',
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_login_at TEXT
      );
      
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_created_at ON users(created_at);
    `);
    console.log('✓ Tabla "users" creada');

    // ==========================================
    // TABLA: VEHÍCULOS
    // ==========================================
    await runAsync(`
      DROP TABLE IF EXISTS vehicles;
      
      CREATE TABLE vehicles (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL CHECK(company IN ('tier', 'lime', 'bird')),
        type TEXT NOT NULL CHECK(type IN ('scooter', 'bike')),
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        battery INTEGER NOT NULL,
        price_per_min REAL NOT NULL,
        reserved BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'available' CHECK(status IN ('available', 'in_use', 'maintenance')),
        canton TEXT,
        distrito TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_vehicles_company ON vehicles(company);
      CREATE INDEX idx_vehicles_type ON vehicles(type);
      CREATE INDEX idx_vehicles_status ON vehicles(status);
      CREATE INDEX idx_vehicles_location ON vehicles(lat, lng);
    `);
    console.log('✓ Tabla "vehicles" creada');

    // ==========================================
    // TABLA: VIAJES
    // ==========================================
    await runAsync(`
      DROP TABLE IF EXISTS trips;
      
      CREATE TABLE trips (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        vehicle_id TEXT,
        type TEXT NOT NULL,
        duration_minutes INTEGER,
        distance REAL,
        price REAL,
        status TEXT DEFAULT 'completed' CHECK(status IN ('ongoing', 'completed', 'cancelled')),
        start_lat REAL,
        start_lng REAL,
        end_lat REAL,
        end_lng REAL,
        start_address TEXT,
        end_address TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
      );
      
      CREATE INDEX idx_trips_user_id ON trips(user_id);
      CREATE INDEX idx_trips_status ON trips(status);
      CREATE INDEX idx_trips_created_at ON trips(created_at);
    `);
    console.log('✓ Tabla "trips" creada');

    // ==========================================
    // TABLA: MÉTODOS DE PAGO
    // ==========================================
    await runAsync(`
      DROP TABLE IF EXISTS payments;
      
      CREATE TABLE payments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        card_number_last4 TEXT NOT NULL,
        card_brand TEXT,
        expiry_month INTEGER,
        expiry_year INTEGER,
        is_default BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE INDEX idx_payments_user_id ON payments(user_id);
    `);
    console.log('✓ Tabla "payments" creada');

    // ==========================================
    // INSERTAR DATOS INICIALES
    // ==========================================
    
    // Usuario de prueba
    await runPrepared(`
      INSERT INTO users (id, email, password, name, phone, balance, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'user-550e8400-e29b-41d4-a716-446655440000',
      'dylan@ecorueda.com',
      'hashed_password_will_be_set_by_registration',
      'Dylan Usuario',
      '+506 8888-8888',
      120.00,
      1
    ]);
    console.log('✓ Usuarios iniciales insertados');

    // Vehículos iniciales
    const vehiclesData = [
      ['a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'tier', 'scooter', 9.9334, -84.0834, 85, 3.5, 'available', 'San José', 'Carmen'],
      ['b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'tier', 'scooter', 9.9326, -84.0793, 92, 3.5, 'available', 'San José', 'Merced'],
      ['c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'tier', 'bike', 9.9350, -84.0881, 78, 2.5, 'available', 'San José', 'Hospital'],
      ['f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'lime', 'scooter', 9.9330, -84.0774, 88, 3.0, 'available', 'San José', 'Catedral'],
      ['a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'lime', 'bike', 9.9989, -84.1169, 95, 2.0, 'available', 'Heredia', 'Central'],
      ['e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'bird', 'scooter', 9.9384, -84.1870, 75, 3.2, 'available', 'Santa Ana', 'Pozos'],
      ['f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', 'bird', 'scooter', 9.9428, -84.1805, 80, 3.2, 'available', 'Santa Ana', 'Uruca'],
    ];

    for (const vehicle of vehiclesData) {
      await runPrepared(`
        INSERT INTO vehicles 
        (id, company, type, lat, lng, battery, price_per_min, status, canton, distrito)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, vehicle);
    }
    console.log(`✓ ${vehiclesData.length} vehículos iniciales insertados`);

    // ==========================================
    // CERRAR CONEXIÓN
    // ==========================================
    db.close();
    console.log('\n✅ Base de datos inicializada correctamente en:', dbPath);

  } catch (error) {
    console.error('❌ Error inicializando BD:', error.message);
    db.close();
    process.exit(1);
  }
})();
