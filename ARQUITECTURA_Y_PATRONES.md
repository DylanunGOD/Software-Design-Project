# 📐 ARQUITECTURA Y PATRONES DE DISEÑO - ECORUEDA API

**Versión:** 1.0.0  
**Fecha:** Noviembre 22, 2025  
**Autor:** Grief-Winters (Equipo EcoRueda)  
**Curso:** Diseño de Software  
**Objetivo:** Documentar la arquitectura, patrones de diseño y justificaciones técnicas de la API REST EcoRueda

---

## 📋 TABLA DE CONTENIDOS

1. [Arquitectura General](#arquitectura-general)
2. [Patrones de Diseño Utilizados](#patrones-de-diseño-utilizados)
3. [Justificación de Patrones](#justificación-de-patrones)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Flujo de Datos](#flujo-de-datos)
6. [Decisiones Tecnológicas](#decisiones-tecnológicas)
7. [Principios SOLID](#principios-solid)
8. [Ventajas y Desventajas](#ventajas-y-desventajas)

---

## 🏗️ ARQUITECTURA GENERAL

### Diagrama de Capas

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT (React Frontend)                    │
│                  (http://localhost:5173)                      │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                          │
│              Routes (Express Router)                          │
│  GET /api/v1/vehicles, POST /api/v1/auth/login, etc.        │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                           │
│  Controllers (Request Handling, Response Formatting)          │
│  ├── authController.js                                        │
│  ├── vehicleController.js                                     │
│  ├── tripController.js                                        │
│  ├── userController.js                                        │
│  └── paymentController.js                                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                        │
│  Services (Validación, Cálculos, Reglas de Negocio)         │
│  ├── authService.js (registro, login, JWT)                  │
│  ├── vehicleService.js (filtrado, búsqueda geográfica)      │
│  ├── tripService.js (cálculo de precios, distancia)         │
│  └── userService.js (actualización de perfil)               │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                           │
│  Repositories [PATRÓN REPOSITORY] (Acceso a Datos)           │
│  ├── UserRepository.js (CRUD users)                          │
│  ├── VehicleRepository.js (CRUD vehicles)                    │
│  ├── TripRepository.js (CRUD trips)                          │
│  └── PaymentRepository.js (CRUD payments)                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                           │
│                  Database Layer                               │
│  SQLite (Desarrollo) / Azure SQL (Producción)               │
│  ├── users table                                              │
│  ├── vehicles table                                           │
│  ├── trips table                                              │
│  └── payments table                                           │
└──────────────────────────────────────────────────────────────┘
```

### Flujo de una Solicitud Típica

```
1. CLIENTE REALIZA SOLICITUD
   GET /api/v1/vehicles (con token JWT)
   │
   ├─ Middleware: Validar Token JWT
   │
2. ROUTER
   ├─ Valida la ruta
   ├─ Ejecuta middleware de autenticación
   │
3. CONTROLLER (vehicleController.js)
   ├─ Extrae parámetros de query
   ├─ Llama al Service
   │
4. SERVICE (vehicleService.js)
   ├─ Valida reglas de negocio
   ├─ Filtra vehículos según criterios
   ├─ Llama al Repository
   │
5. REPOSITORY (vehicleRepository.js)
   ├─ Construye query SQL
   ├─ Accede a la BD
   ├─ Retorna datos crudos
   │
6. BASE DE DATOS (SQLite/Azure SQL)
   ├─ Ejecuta query
   ├─ Retorna resultados
   │
7. FLUJO DE RETORNO (inverso)
   Repository → Service → Controller → Response HTTP
   │
8. CLIENTE RECIBE RESPUESTA
   {
     "success": true,
     "data": [...],
     "message": "Vehículos obtenidos"
   }
```

---

## 🎯 PATRONES DE DISEÑO UTILIZADOS

### 1. **REPOSITORY PATTERN** (Principal)

#### ¿Qué es?
Un patrón estructural que abstrae el acceso a datos detrás de una interfaz común.

#### Implementación en EcoRueda

```javascript
// repositories/UserRepository.js
export class UserRepository {
  constructor(database) {
    this.db = database;
  }

  // CREATE
  async create(userData) {
    const query = `INSERT INTO users (email, password, name, phone) 
                   VALUES (?, ?, ?, ?)`;
    return this.db.run(query, [userData.email, userData.password, ...]);
  }

  // READ
  async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    return this.db.get(query, [id]);
  }

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    return this.db.get(query, [email]);
  }

  // UPDATE
  async update(id, userData) {
    const query = `UPDATE users SET name = ?, phone = ? WHERE id = ?`;
    return this.db.run(query, [userData.name, userData.phone, id]);
  }

  // DELETE
  async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return this.db.run(query, [id]);
  }
}
```

#### Uso en Controllers

```javascript
// controllers/authController.js
export const registerController = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // El controller NO sabe cómo se guardan los datos
    // Solo usa el repositorio
    const userRepository = new UserRepository(database);
    const newUser = await userRepository.create({
      email,
      password: await hashPassword(password),
      name
    });
    
    const token = generateToken(newUser.id, email);
    res.status(201).json({
      success: true,
      data: newUser,
      token
    });
  } catch (error) {
    next(error);
  }
};
```

#### ✅ Ventajas del Repository Pattern

1. **Separación de Responsabilidades**
   - Controllers no conocen detalles de BD
   - Repositories manejan SQL/queries
   - Fácil de mantener y testear

2. **Cambio de BD sin afectar código**
   ```
   Escenario: Cambiar de SQLite a Azure SQL
   
   SIN Repository Pattern:
   - Modificar 50+ queries en controllers
   - Alto riesgo de errores
   
   CON Repository Pattern:
   - Cambiar solo UserRepository.js
   - El resto del código sigue funcionando
   ```

3. **Testing Simplificado**
   ```javascript
   // Mock repository para testing
   const mockUserRepository = {
     findById: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
     create: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' })
   };
   
   // Testear controller sin BD real
   const result = await authController(mockUserRepository);
   ```

4. **Reutilización de Lógica**
   - Una sola fuente de verdad para queries
   - Evita duplicación

---

### 2. **SINGLETON PATTERN** (Conexión a BD)

#### ¿Qué es?
Patrón creacional que asegura que una clase tenga solo una instancia.

#### Implementación en EcoRueda

```javascript
// config/database.js
class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.db = new Database('ecorueda.db');
    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getConnection() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

export const database = DatabaseConnection.getInstance();
```

#### Uso en Aplicación

```javascript
// En app.js, index.js, repositories, etc.
import { database } from './config/database.js';

const db = database.getConnection();
// Solo hay UNA conexión a la BD en toda la aplicación
```

#### ✅ Ventajas del Singleton

1. **Recursos Compartidos**
   - Una única conexión de BD
   - Menor uso de memoria
   - Mejor rendimiento

2. **Coherencia Global**
   - Todos los repositories usan la misma conexión
   - Transacciones consistentes

3. **Facilita Limpieza**
   - En shutdown, cerrar la conexión única
   - No hay múltiples conexiones abiertas

---

### 3. **FACTORY PATTERN** (Creación de Repositorios)

#### ¿Qué es?
Patrón creacional que proporciona una interfaz para crear objetos.

#### Implementación en EcoRueda

```javascript
// config/factories.js
import { UserRepository } from '../repositories/UserRepository.js';
import { VehicleRepository } from '../repositories/VehicleRepository.js';
import { TripRepository } from '../repositories/TripRepository.js';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { database } from './database.js';

class RepositoryFactory {
  static createUserRepository() {
    return new UserRepository(database.getConnection());
  }

  static createVehicleRepository() {
    return new VehicleRepository(database.getConnection());
  }

  static createTripRepository() {
    return new TripRepository(database.getConnection());
  }

  static createPaymentRepository() {
    return new PaymentRepository(database.getConnection());
  }
}

export default RepositoryFactory;
```

#### Uso en Controllers

```javascript
// controllers/authController.js
import RepositoryFactory from '../config/factories.js';

export const registerController = async (req, res, next) => {
  try {
    const userRepository = RepositoryFactory.createUserRepository();
    const newUser = await userRepository.create({...});
    // ...
  } catch (error) {
    next(error);
  }
};
```

#### ✅ Ventajas del Factory Pattern

1. **Centralización**
   - Un único lugar para crear repositorios
   - Cambios en creación se reflejan globalmente

2. **Consistencia**
   - Todos los repositorios se crean igual
   - Inyección de dependencias automática

3. **Testing**
   - Fácil mockear factories en tests

---

### 4. **DECORATOR PATTERN** (Middleware)

#### ¿Qué es?
Patrón estructural que permite añadir comportamiento a objetos dinámicamente.

#### Implementación en EcoRueda

```javascript
// middleware/auth.js (Decorador de autenticación)
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({...});
  }
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    next(); // Continúa al siguiente middleware/route handler
  } catch (error) {
    return res.status(401).json({...});
  }
};

// middleware/validation.js (Decorador de validación)
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validación fallida',
        errors: error.details
      });
    }
    
    req.body = value;
    next();
  };
};
```

#### Uso en Routes

```javascript
// routes/auth.js
import { verifyToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

router.post('/register',
  validateRequest(registerSchema),    // Decorador 1: Validación
  registerController
);

router.get('/profile',
  verifyToken,                         // Decorador 2: Autenticación
  profileController
);
```

#### ✅ Ventajas del Decorator Pattern

1. **Responsabilidad Única**
   - Cada middleware hace una cosa
   - Fácil de testear

2. **Composición**
   - Combinar múltiples decoradores
   - Reutilizable en diferentes rutas

3. **Separación de Concerns**
   - Autenticación separada de lógica de negocio
   - Validación separada de controllers

---

## 🎓 JUSTIFICACIÓN DE PATRONES

### ¿Por qué Repository Pattern y no otro?

| Aspecto | Repository | Active Record | Query Builder |
|--------|------------|---------------|---------------|
| **Separación** | ✅ Excelente | ❌ Débil | ✅ Buena |
| **Testing** | ✅ Fácil | ❌ Difícil | ⚠️ Medio |
| **Escalabilidad** | ✅ Alta | ❌ Baja | ⚠️ Media |
| **Cambio de BD** | ✅ Fácil | ❌ Difícil | ⚠️ Medio |
| **Curva aprendizaje** | ⚠️ Media | ✅ Baja | ✅ Baja |

**Decisión: Repository Pattern** porque:
- Escalabilidad necesaria para proyecto académico
- Demuestra dominio de patrones de diseño
- Facilita transición a Azure SQL
- Mejor para mantener código limpio

---

### ¿Por qué Singleton para BD?

**Alternativas consideradas:**

1. **Conexión global directa**
   - Problema: Sin control, sin cierre ordenado
   - No es patrón

2. **Nueva conexión por request**
   - Problema: Costoso, overhead de conexión
   - Mala práctica

3. **Pool de conexiones (Singleton)**
   - ✅ Una instancia única
   - ✅ Control de conexiones
   - ✅ Cierre ordenado

**Decisión: Singleton** porque:
- Garantiza una única conexión
- Mejor rendimiento
- Control de recursos

---

### ¿Por qué Factory para Repositorios?

**Sin Factory:**
```javascript
// Esparcido por todo el código
const userRepo = new UserRepository(db);
const vehicleRepo = new VehicleRepository(db);
const tripRepo = new TripRepository(db);
// Repetido en 20+ lugares
```

**Con Factory:**
```javascript
// Una sola línea
const userRepo = RepositoryFactory.createUserRepository();
// Cambios centralizados
```

**Decisión: Factory** porque:
- Centraliza creación
- DRY (Don't Repeat Yourself)
- Facilita cambios futuros

---

## 📁 ESTRUCTURA DE CARPETAS

```
api-server/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.js                    # Variables de entorno (PORT, BD, JWT, etc.)
│   │   ├── database.js               # Singleton: Conexión a BD
│   │   └── factories.js              # Factory: Crear repositorios
│   │
│   ├── models/                       # Esquemas y validaciones
│   │   ├── User.js                   # Joi schema para User
│   │   ├── Vehicle.js                # Joi schema para Vehicle
│   │   ├── Trip.js                   # Joi schema para Trip
│   │   └── Payment.js                # Joi schema para Payment
│   │
│   ├── repositories/                 # PATRÓN REPOSITORY (Data Access)
│   │   ├── UserRepository.js         # CRUD: Users
│   │   ├── VehicleRepository.js      # CRUD: Vehicles
│   │   ├── TripRepository.js         # CRUD: Trips
│   │   └── PaymentRepository.js      # CRUD: Payments
│   │
│   ├── services/                     # Lógica de negocio reutilizable
│   │   ├── authService.js            # Registro, login, JWT
│   │   ├── vehicleService.js         # Filtrado, búsqueda
│   │   ├── tripService.js            # Cálculos, precios, distancia
│   │   └── userService.js            # Actualización perfil
│   │
│   ├── controllers/                  # Handlers de requests
│   │   ├── authController.js         # POST /register, /login
│   │   ├── vehicleController.js      # GET /vehicles, /vehicles/:id
│   │   ├── tripController.js         # GET/POST /trips
│   │   ├── userController.js         # GET/PUT /profile
│   │   └── paymentController.js      # GET/POST /payments
│   │
│   ├── routes/                       # Express Routes
│   │   ├── auth.js                   # /auth/register, /auth/login
│   │   ├── vehicles.js               # /vehicles/*
│   │   ├── trips.js                  # /trips/*
│   │   ├── users.js                  # /profile
│   │   └── payments.js               # /payments
│   │
│   ├── middleware/                   # Middleware (Decoradores)
│   │   ├── auth.js                   # verifyToken (JWT)
│   │   ├── errorHandler.js           # Manejo de errores
│   │   └── validation.js             # Validación de requests
│   │
│   ├── utils/
│   │   ├── swagger.js                # Documentación OpenAPI
│   │   └── helpers.js                # Funciones auxiliares
│   │
│   └── app.js                        # Configuración de Express
│
├── migrations/                       # Scripts de BD (TODO)
│   ├── 001_create_tables.sql
│   ├── 002_seed_data.sql
│   └── README.md
│
├── index.js                          # Punto de entrada
├── ecorueda.db                       # Base de datos SQLite (desarrollo)
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md
└── ARQUITECTURA_Y_PATRONES.md        # Este archivo
```

---

## 🔄 FLUJO DE DATOS (Ejemplo real: Login)

```
1. USER ENVÍA REQUEST
   POST /api/v1/auth/login
   {
     "email": "user@ecorueda.com",
     "password": "password123"
   }

2. MIDDLEWARE: VALIDACIÓN
   validateRequest(loginSchema)
   ├─ Valida formato del email
   ├─ Valida que password tenga mínimo 6 caracteres
   └─ Si falla: retorna error 400

3. CONTROLLER: authController.loginController()
   ├─ Extrae email y password de req.body
   ├─ Llama a authService.login(email, password)
   └─ Espera resultado

4. SERVICE: authService.login()
   ├─ Obtiene userRepository = RepositoryFactory.createUserRepository()
   ├─ Llama a userRepository.findByEmail(email)
   ├─ Si no existe: lanza error "Usuario no encontrado"
   ├─ Compara password con hash: bcrypt.compare()
   ├─ Si no coincide: lanza error "Contraseña incorrecta"
   ├─ Si es correcto: genera token JWT
   └─ Retorna { user, token }

5. REPOSITORY: userRepository.findByEmail(email)
   ├─ Construye query SQL:
   │  "SELECT id, email, name, phone, balance FROM users WHERE email = ?"
   ├─ Ejecuta en BD: database.getConnection().get(query, [email])
   └─ Retorna datos del usuario o null

6. DATABASE: SQLite ejecuta query
   ├─ Busca en tabla users
   ├─ Retorna fila coincidente o null
   └─ Cierra cursor

7. FLUJO DE RETORNO
   Repository → Service → Controller → Middleware (errorHandler) → Response HTTP

8. RESPONSE AL CLIENTE (Éxito)
   Status: 200 OK
   {
     "success": true,
     "message": "Login exitoso",
     "data": {
       "id": "user-uuid",
       "email": "user@ecorueda.com",
       "name": "Usuario",
       "balance": 120.00
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }

9. CLIENT ALMACENA TOKEN
   localStorage.setItem('token', response.token)
   
10. PROXIMAS REQUESTS
    GET /api/v1/vehicles
    Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ├─ Middleware auth.js verifica token
    ├─ Si es válido: continúa
    └─ Si es inválido/expirado: retorna 401
```

---

## 💻 DECISIONES TECNOLÓGICAS

### 1. **SQLite para Desarrollo**

**¿Qué es SQLite?**
SQLite es una base de datos relacional de archivo único, embebida, sin servidor.

**Justificación de uso:**
- ✅ **Sin servidor**: No requiere instalar PostgreSQL, MySQL, etc.
- ✅ **Archivo único**: `ecorueda.db` - fácil de compartir, versionar, respaldar
- ✅ **Cero configuración**: Funciona out-of-the-box
- ✅ **Perfecto para desarrollo**: Todos en el equipo mismo archivo DB
- ✅ **Transición fácil**: Mismo código funciona con Azure SQL en producción
- ✅ **Bajo overhead**: Ideal para prototipado rápido
- ✅ **Especificación ACID**: Garantiza integridad de datos

**Comparación con alternativas:**

| Aspecto | SQLite | PostgreSQL | MySQL |
|--------|--------|-----------|-------|
| **Instalación** | 0 minutos | 30 minutos | 30 minutos |
| **Configuración** | 0 minutos | 15 minutos | 15 minutos |
| **Desarrollo Local** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Escala Producción** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Shared hosting** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Por qué no PostgreSQL en desarrollo:**
- Requiere instalación
- Servicio corriendo localmente
- Complejo para principiantes
- Overkill para desarrollo

**Estrategia recomendada:**
```
DESARROLLO:     SQLite (ecorueda.db)
STAGING:        Azure SQL (pruebas antes de producción)
PRODUCCIÓN:     Azure SQL Database (escalable, seguro)
```

**Código agnóstico a BD:**
```javascript
// En repositories, solo cambiar connection string en .env
// No cambiar lógica de queries

// .env (desarrollo)
DB_TYPE=sqlite
DB_PATH=./ecorueda.db

// .env (producción - Azure)
DB_TYPE=azure_sql
DB_SERVER=ecorueda.database.windows.net
DB_NAME=ecorueda
DB_USER=admin
DB_PASSWORD=securepassword
```

---

### 2. **Express.js**

**¿Qué es Express?**
Framework minimalista para Node.js que facilita crear servidores HTTP y APIs REST.

**Justificación de uso:**

1. **Estándar de Industria**
   - 90% de APIs en Node.js usan Express
   - Empleadores buscan experiencia con Express
   - Fácil encontrar recursos, tutoriales, soluciones

2. **Lightweight (54KB)**
   - No impone estructura compleja
   - Flexibilidad para arquitectura propia
   - Fácil adaptarse a patrones de diseño

3. **Middleware Pattern Integrado**
   - Express está construido sobre middleware
   - Perfecto para implementar Decorator Pattern
   - Fácil agregar autenticación, validación, logging

4. **Rendimiento**
   - Excelente para APIs REST
   - Manejo eficiente de requests
   - Bajo overhead de memoria

5. **Comunidad y Ecosistema**
   - Miles de librerías npm compatibles
   - Documentación oficial excelente
   - Stack Overflow con respuestas a casi todo

**Comparación con alternativas:**

| Aspecto | Express | Fastify | Koa | Hapi |
|--------|---------|---------|-----|------|
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Aprendizaje** | Rápido | Medio | Medio | Lento |
| **Comunidad** | Enorme | Creciente | Media | Media |
| **Rendimiento** | ✅ Bueno | ⭐⭐⭐⭐⭐ | ✅ Bueno | ✅ Bueno |
| **Proyectos** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

**Por qué no otras:**
- **Fastify**: Overkill para este proyecto, más complejo
- **Koa**: Sintaxis extraña, comunidad pequeña
- **Hapi**: Muy opinionado, curva aprendizaje pronunciada

**Ejemplo: Middleware en Express (Decorator Pattern)**
```javascript
// Middleware = decorator
app.use(helmet());              // Seguridad
app.use(cors());                // CORS
app.use(morgan('combined'));    // Logging
app.use(express.json());        // Parse JSON
app.use(limiter);               // Rate limiting

// Aplicados en orden a cada request
```

---

### 3. **JWT para Autenticación**

**¿Qué es JWT?**
JSON Web Token: estándar (RFC 7519) para autenticación stateless.

**Justificación de uso:**

1. **Stateless - No requiere sesiones**
   ```
   ❌ Sessions (problema):
   - Servidor almacena sesión
   - Escalabilidad: múltiples servidores = sincronizar sesiones
   - Requiere BD o Redis
   
   ✅ JWT (solución):
   - Cliente almacena token
   - Cada request valida token
   - Servidores independientes, pueden validar sin compartir estado
   ```

2. **Escalabilidad con Azure**
   ```
   Con JWT:
   - Múltiples instancias de API
   - Cada una valida token independientemente
   - No requiere base de datos compartida para sesiones
   - Perfecto para cloud
   ```

3. **Estándar de Industria**
   - OAuth 2.0 usa JWT
   - Google, Facebook, GitHub usan JWT
   - Empleadores esperan conocimiento de JWT

4. **Interoperabilidad**
   - Mobile app + Web + Desktop
   - Frontend envía token igual en todas plataformas
   - Backend valida de forma consistente

5. **Seguridad**
   - Firmado criptográficamente
   - No puede modificarse sin invalidar firma
   - Expira automáticamente

**Estructura JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI1ZjYyZDU2YjYyZjE1YzA2YjhhMzY3NyIsImVtYWlsIjoiYWxlQHRlc3QuY29tIiwiaWF0IjoxNjM3NTI5MjAwLCJleHAiOjE2Mzc2MTU2MDB9.
L3rGMW4nIGLkThgLrZdLVnCJHNZ-uPLZMhVLHoJE7bE

[Header].[Payload].[Signature]
```

**Comparación con alternativas:**

| Aspecto | JWT | Sessions | OAuth 2 | API Keys |
|--------|-----|----------|--------|----------|
| **Stateless** | ✅ | ❌ | ⚠️ | ✅ |
| **Escalable** | ✅⭐⭐⭐ | ⭐ | ✅⭐⭐ | ✅⭐⭐ |
| **Mobile-friendly** | ✅⭐⭐⭐ | ❌ | ✅⭐⭐⭐ | ✅⭐⭐⭐ |
| **Seguridad** | ✅⭐⭐⭐ | ✅⭐⭐⭐ | ✅⭐⭐⭐ | ⭐⭐ |
| **Complejidad** | Baja | Baja | Alta | Muy Baja |

**Por qué JWT en este proyecto:**
- ✅ Azure requiere escalabilidad
- ✅ Frontend React requiere token en localStorage
- ✅ Apps móviles en futuro requieren JWT
- ✅ Menos infraestructura (sin Redis para sesiones)

---

### 4. **Joi para Validación**

**¿Qué es Joi?**
Librería Node.js para validación de esquemas y datos complejos.

**Justificación de uso:**

1. **Validación Declarativa**
   ```javascript
   // ❌ MAL: Validación imperativa (muchas líneas)
   if (!email) throw new Error('Email requerido');
   if (!email.includes('@')) throw new Error('Email inválido');
   if (email.length > 255) throw new Error('Email muy largo');
   if (!password) throw new Error('Contraseña requerida');
   if (password.length < 6) throw new Error('Contraseña débil');
   
   // ✅ BIEN: Joi (limpio, declarativo)
   const schema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required()
   });
   
   const { error, value } = schema.validate(data);
   ```

2. **Mensajes de Error Automáticos**
   ```javascript
   // Joi genera mensajes profesionales
   {
     "details": [
       { "path": "email", "message": "must be a valid email" },
       { "path": "password", "message": "must be at least 6 characters" }
     ]
   }
   ```

3. **Reutilizable**
   ```javascript
   // Definir una sola vez
   export const registerSchema = Joi.object({
     name: Joi.string().required(),
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required(),
     phone: Joi.string().optional()
   });
   
   // Usar en múltiples rutas
   router.post('/register', validateRequest(registerSchema), registerController);
   router.post('/update-email', validateRequest(registerSchema), updateController);
   ```

4. **Validación Compleja**
   ```javascript
   // Validar tipos, valores, condicionales
   const schema = Joi.object({
     age: Joi.number().integer().min(18).max(120),
     email: Joi.string().email().required(),
     phone: Joi.string().pattern(/^\d{10}$/),
     plan: Joi.string().valid('free', 'pro', 'enterprise'),
     creditCard: Joi.when('plan', {
       is: Joi.string().valid('pro', 'enterprise'),
       then: Joi.string().required(),
       otherwise: Joi.forbidden()
     })
   });
   ```

**Comparación con alternativas:**

| Aspecto | Joi | Express Validator | Yup | Zod |
|--------|-----|------------------|-----|-----|
| **Facilidad** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Validación Compleja** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **TypeScript** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Documentación** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Por qué Joi en este proyecto:**
- ✅ Validación centralizada en esquemas
- ✅ Mensajes de error automáticos
- ✅ Fácil de rehusar
- ✅ Estándar hapi/joi en industria

---

### 5. **Swagger/OpenAPI 3.0**

**¿Qué es Swagger?**
Estándar (OpenAPI) para documentar APIs REST de forma interactiva.

**Justificación de uso:**

1. **Documentación Automática**
   ```javascript
   // Los comentarios JSDoc generan documentación
   /**
    * @swagger
    * /vehicles:
    *   get:
    *     summary: Listar vehículos
    *     responses:
    *       200:
    *         description: Lista de vehículos
    */
   router.get('/vehicles', controller);
   
   // Genera UI en /api/docs automáticamente
   ```

2. **Testing Interactivo**
   - Sin Postman/Insomnia
   - Probar endpoints directamente en navegador
   - "Try it out" button

3. **Generación de Cliente**
   - Generar cliente JavaScript, Python, Java automáticamente
   - `openapi-generator`
   - Sincronización automática con cambios API

4. **Especificación Estándar**
   - OpenAPI 3.0 (RFC oficial)
   - Herramientas compatibles (Postman, Insomnia, etc.)
   - Empresas esperan Swagger

5. **Requisito del Proyecto**
   - "Debe contar con documentación estilo Swagger"

**Ventajas:**

| Ventaja | Beneficio |
|---------|----------|
| **No duplicar documentación** | Comentarios en código = documentación |
| **Siempre actualizada** | Cambios en código = cambios en Swagger |
| **Profesional** | Impresiona en defensa del proyecto |
| **Testing sin herramientas** | Probar en navegador |
| **Generación de clientes** | SDK automático para frontend |

**Ejemplo de Swagger UI:**
```
GET /api/v1/vehicles
├─ Parameters:
│  ├─ company (optional): tier, lime, bird
│  ├─ type (optional): scooter, bike
│  └─ lat, lng, radius (optional)
├─ Security: Bearer Token
└─ Responses:
   ├─ 200: Array de vehículos
   ├─ 401: No autorizado
   └─ 404: No encontrado

[Try it out] button para probar en el navegador
```

---

### 6. **bcryptjs para Encriptación de Contraseñas**

**¿Qué es bcryptjs?**
Algoritmo adaptable de hash de contraseñas, basado en bcrypt.

**Justificación de uso:**

1. **Nunca guardar contraseñas en texto plano**
   ```javascript
   // ❌ INSEGURO
   users.push({ email, password: "123456" });
   
   // ✅ SEGURO
   const hashedPassword = await bcrypt.hash(password, 10);
   users.push({ email, password: hashedPassword });
   ```

2. **Irreversible**
   - No se puede "desencriptar"
   - Solo verificar si contraseña coincide
   ```javascript
   // Guardar
   const hash = await bcrypt.hash('password123', 10);
   // $2b$10$abcdefghijklmnopqrstuvwxyz...
   
   // Verificar
   const isValid = await bcrypt.compare('password123', hash);
   // true o false
   ```

3. **Adaptable**
   - Parámetro "rounds" = complejidad
   - Más rounds = más seguro pero más lento
   - Aumentar con el tiempo (computadoras más rápidas)

4. **Requisito de Seguridad**
   - Estándar OWASP
   - Cumplimiento normativo
   - No almacenar contraseñas en texto plano

5. **Resistencia a Ataques**
   - Salt único por contraseña
   - Resistente a rainbow tables
   - Resistente a fuerza bruta

**Parámetros:**
```javascript
// rounds = cost factor (complejidad)
// 10 rounds = buena relación seguridad/rendimiento
// 12 rounds = más seguro, un poco más lento

bcrypt.hash(password, 10);  // 10 rounds
```

---

### 7. **Helmet para Seguridad HTTP**

**¿Qué es Helmet?**
Middleware que configura headers HTTP seguros automáticamente.

**Justificación de uso:**

1. **Headers de Seguridad Automáticos**
   ```javascript
   app.use(helmet());
   
   // Agrega automáticamente:
   // Content-Security-Policy
   // X-Frame-Options: DENY
   // X-Content-Type-Options: nosniff
   // Strict-Transport-Security
   // etc.
   ```

2. **Protección contra ataques comunes**
   - XSS (Cross-Site Scripting)
   - Clickjacking
   - MIME type sniffing
   - Inyección de contenido

3. **Una línea = máxima seguridad**
   ```javascript
   // Protección completa con una línea
   app.use(helmet());
   
   // vs configurar manualmente 10+ headers
   ```

4. **Estándar Industria**
   - OWASP recomienda
   - Millones de APIs lo usan
   - Requisito de seguridad básico

---

### 8. **CORS (Cross-Origin Resource Sharing)**

**¿Qué es CORS?**
Mecanismo de seguridad que controla qué orígenes pueden acceder a la API.

**Justificación de uso:**

1. **Permitir Frontend acceder a API**
   ```javascript
   // ❌ Sin CORS: Frontend en localhost:5173 no puede acceder API:5000
   // ✅ Con CORS: Configurable
   
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **Seguridad contra requests maliciosos**
   - Especificar orígenes permitidos
   - Rechazar request de otros orígenes
   - Protección contra CSRF

3. **Configuración por entorno**
   ```javascript
   // Desarrollo
   origin: 'http://localhost:5173'
   
   // Producción
   origin: 'https://ecorueda.com'
   ```

---

### 9. **Morgan para Logging**

**¿Qué es Morgan?**
Middleware para logging de requests HTTP.

**Justificación de uso:**

1. **Debug de requests**
   ```
   GET /api/v1/vehicles 200 1.234 ms - 1234
   POST /api/v1/auth/login 201 5.678 ms - 456
   GET /api/v1/profile 401 0.123 ms - 89
   ```

2. **Monitoreo en producción**
   - Saber qué requests llegan
   - Detectar patrones de acceso
   - Auditoría de seguridad

3. **Facilita debugging**
   - Ver requests en tiempo real
   - Identificar problemas
   - Performance bottlenecks

---

### 10. **Express Rate Limiting**

**¿Qué es Rate Limiting?**
Limitar número de requests de un cliente en un tiempo.

**Justificación de uso:**

1. **Protección contra ataques**
   - DDoS
   - Fuerza bruta (intentos de login)
   - Abuso de API

2. **Requisito del Proyecto**
   - "Agregar rate limiting"

3. **Configuración típica**
   ```javascript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,  // 15 minutos
     max: 100                    // 100 requests por ventana
   });
   
   app.use(limiter);
   ```

4. **Por endpoint específico**
   ```javascript
   // Limitar más para login (contra fuerza bruta)
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5  // 5 intentos cada 15 minutos
   });
   
   router.post('/login', loginLimiter, loginController);
   ```

---

## 📊 MATRIZ COMPARATIVA DE JUSTIFICACIONES

| Componente | Propósito | Alternativas | Por qué Elegida |
|-----------|----------|--------------|-----------------|
| **SQLite** | BD Desarrollo | PostgreSQL, MySQL | Cero setup, perfecto desarrollo local |
| **Express** | Framework | Fastify, Koa, Hapi | Estándar industria, comunidad enorme |
| **JWT** | Autenticación | Sessions, OAuth | Stateless, escalable, cloud-ready |
| **Joi** | Validación | Express Validator, Yup | Validación compleja, mensajes automáticos |
| **Swagger** | Documentación | Postman, Manual | Estándar OpenAPI, testing interactivo |
| **bcryptjs** | Encriptación | bcrypt, argon2 | Irreversible, adaptable, seguro |
| **Helmet** | Seguridad Headers | Manual config | Máxima seguridad con una línea |
| **CORS** | Cross-Origin | Manual config | Necesario frontend + API |
| **Morgan** | Logging | Winston, Bunyan | Integración fácil Express |
| **Rate Limiting** | Protección | Cloud WAF | Aplicación level, simple, efectivo |

---

## ✅ PRINCIPIOS SOLID

### S - Single Responsibility Principle
```
❌ MAL: Controller que maneja autenticación + BD + lógica + respuesta
✅ BIEN: 
  - Repository: acceso a datos
  - Service: lógica de negocio
  - Controller: orquestación de requests
  - Middleware: autenticación
```

### O - Open/Closed Principle
```
❌ MAL: Modificar controller para cada nuevo tipo de vehículo
✅ BIEN: 
  - Service maneja diferentes tipos
  - Repository agnóstico a tipos
  - Extensible sin modificar código existente
```

### L - Liskov Substitution Principle
```
Todos los repositorios tienen interfaz consistente:
- create(), read(), update(), delete()
- Pueden ser reemplazados sin quebrar código
```

### I - Interface Segregation Principle
```
❌ MAL: Interfaz gigante con todos los métodos
✅ BIEN:
  - UserRepository: solo métodos de User
  - VehicleRepository: solo métodos de Vehicle
  - Cada quien implementa lo suyo
```

### D - Dependency Inversion Principle
```
❌ MAL: Controller crea UserRepository
✅ BIEN: Factory inyecta UserRepository al Controller
```

---

## 📊 VENTAJAS Y DESVENTAJAS

### Ventajas de la Arquitectura

| Ventaja | Beneficio |
|---------|----------|
| **Separación de Capas** | Fácil de entender y modificar |
| **Repository Pattern** | Cambio de BD sin tocar código |
| **Singleton BD** | Una conexión, mejor rendimiento |
| **Factory Pattern** | Creación centralizada |
| **Middleware** | Reutilizable, DRY |
| **Testeable** | Mock fácil de repositorios |
| **Escalable** | De SQLite a Azure SQL sin cambios |
| **Documentado** | Swagger automático |

### Desventajas / Trade-offs

| Desventaja | Mitigación |
|-----------|-----------|
| **Más archivos** | Estructura clara, herramientas IDE |
| **Curva aprendizaje** | Documentación completa (este archivo) |
| **Overhead inicial** | Paga a largo plazo |
| **Boilerplate** | Menos importante que mantenibilidad |

---

## 🎯 APLICACIÓN A REQUISITOS DEL PROYECTO

### Requisito: "10+ Endpoints"
✅ Implementados con patrón consistente:
- 2 de autenticación
- 3 de vehículos
- 3 de viajes
- 2 de perfil
- 2 de pagos
= **12 endpoints**

### Requisito: "Documentación Swagger"
✅ Todos los endpoints documentados en Swagger
- Esquemas automáticos
- Ejemplos de respuesta
- Testing interactivo

### Requisito: "Autenticación JWT"
✅ JWT integrado en:
- Generación en login/register
- Validación en middleware
- Claims: userId, email

### Requisito: "Despliegue Azure"
✅ Arquitectura preparada:
- BD agnóstica
- Variables de entorno
- Connection string para Azure SQL
- Health check endpoint

---

## 📚 REFERENCIAS Y RECURSOS

### Patrones de Diseño
- "Design Patterns: Elements of Reusable Object-Oriented Software" - Gang of Four
- Repository Pattern: https://martinfowler.com/eaaCatalog/repository.html
- Singleton Pattern: https://refactoring.guru/design-patterns/singleton

### Principios SOLID
- https://en.wikipedia.org/wiki/SOLID
- https://www.w3schools.com/whatis/whatis_solid.asp

### Arquitectura
- Hexagonal Architecture
- Layered Architecture
- Clean Architecture (Robert C. Martin)

### Node.js/Express
- Official Express Documentation: https://expressjs.com/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

### Base de Datos
- SQLite: https://www.sqlite.org/
- Azure SQL Database: https://docs.microsoft.com/en-us/azure/azure-sql/

---

## 👥 EQUIPO Y CONTACTO

**Proyecto:** Software-Design-Project  
**Asignatura:** Diseño de Software  
**Estudiante:** Grief-Winters  
**Email:** ulateyuba@gmail.com  
**GitHub:** https://github.com/DylanunGOD/Software-Design-Project  

---

## 📝 CHANGELOG

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 22/11/2025 | Documentación inicial completa |

---

**Última actualización:** 22 de Noviembre, 2025  
**Estado:** ✅ Listo para implementación
