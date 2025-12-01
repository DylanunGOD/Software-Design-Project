# EcoRueda API

API REST para la plataforma de movilidad sostenible **EcoRueda**.

## 📋 Descripción

Servicio HTTP que proporciona endpoints para gestionar vehículos compartidos, viajes, autenticación de usuarios y pagos. Incluye documentación Swagger y autenticación JWT.

## 🛠️ Stack Tecnológico

- **Node.js** + **Express.js** - Framework REST
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **Helmet** - Seguridad
- **CORS** - Control de origen
- **Morgan** - Logging
- **Rate Limiting** - Protección contra abuso

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (opcional, SQLite para desarrollo)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/DylanunGOD/Software-Design-Project.git
cd Software-Design-Project/api-server
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
# DB_HOST=localhost
# DB_NAME=ecorueda
# etc...
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 🚀 Uso

### Endpoints Principales

#### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Login

#### Vehículos
- `GET /api/v1/vehicles` - Listar vehículos
- `GET /api/v1/vehicles/:id` - Detalle del vehículo
- `POST /api/v1/vehicles/:id/reserve` - Reservar vehículo

#### Viajes
- `GET /api/v1/trips` - Historial de viajes
- `POST /api/v1/trips` - Crear viaje
- `GET /api/v1/trips/:id` - Detalle del viaje

#### Perfil
- `GET /api/v1/profile` - Obtener perfil
- `PUT /api/v1/profile` - Actualizar perfil

#### Pagos
- `GET /api/v1/payments` - Listar métodos de pago
- `POST /api/v1/payments` - Registrar tarjeta

### Documentación Swagger

Acceder a: `http://localhost:3000/api/docs`

Aquí encontrarás:
- Descripción de todos los endpoints
- Esquemas de request/response
- Ejemplos de uso
- Testing interactivo

## 🔐 Autenticación JWT

### Obtener Token

1. Registrarse o hacer login
2. Copiar el `token` de la respuesta
3. Incluir en headers:

```bash
Authorization: Bearer <tu_token>
```

### Ejemplo con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Usar el token
curl http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer eyJhbGc..."
```

## 📝 Estructura del Proyecto

```
api-server/
├── src/
│   ├── config/
│   │   ├── env.js                 # Configuración de variables de entorno
│   │   └── database.js            # Conexión a base de datos
│   ├── controllers/               # Lógica de negocio (TODO)
│   ├── models/                    # Modelos de datos (TODO)
│   ├── routes/
│   │   ├── auth.js               # Rutas de autenticación
│   │   ├── vehicles.js           # Rutas de vehículos
│   │   ├── trips.js              # Rutas de viajes
│   │   ├── users.js              # Rutas de perfil
│   │   └── payments.js           # Rutas de pagos
│   ├── middleware/
│   │   ├── auth.js               # Validación JWT
│   │   └── errorHandler.js       # Manejo de errores
│   ├── utils/
│   │   └── swagger.js            # Configuración Swagger
│   └── app.js                     # Aplicación Express
├── index.js                        # Punto de entrada
├── package.json
├── .env                            # Variables de entorno (desarrollo)
├── .env.example                    # Plantilla de variables
└── .gitignore
```

## 🗄️ Base de Datos

### Tablas Necesarias (TODO)

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vehículos
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  company VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  battery INTEGER,
  price_per_min DECIMAL(10,2),
  reserved BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'available'
);

-- Viajes
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  type VARCHAR(100),
  duration INTEGER,
  distance DECIMAL(10,2),
  price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'ongoing',
  start_time TIMESTAMP,
  end_time TIMESTAMP
);

-- Métodos de Pago
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE
);
```

## 🧪 Testing

### Testear endpoints localmente

1. **Con Swagger UI**
   - Ir a `http://localhost:3000/api/docs`
   - Usar la interfaz interactiva

2. **Con Postman**
   - Importar colección (próximamente)
   - Configurar environment con URL base

3. **Con cURL**
```bash
# Listar vehículos
curl http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer <token>"
```

## 🚀 Despliegue en Azure

### Preparación

1. **Crear App Service en Azure**
```bash
# Crear grupo de recursos
az group create --name ecorueda-rg --location eastus

# Crear App Service Plan
az appservice plan create \
  --name ecorueda-plan \
  --resource-group ecorueda-rg \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group ecorueda-rg \
  --plan ecorueda-plan \
  --name ecorueda-api \
  --runtime "node|18"
```

2. **Configurar Base de Datos en Azure**
   - Azure Database for PostgreSQL
   - O conexión a BD existente

3. **Deployment**
```bash
# Desde la rama producción
git push azure main
```

## 📚 Nomenclatura de Commits

```
feat:  Nueva funcionalidad
fix:   Corrección de bugs
docs:  Documentación
refactor: Cambios en estructura
test:  Tests
chore: Tareas de configuración

Ejemplos:
- feat: agregar endpoint GET /vehicles
- fix: validar token JWT correctamente
- docs: actualizar Swagger
```

## 📧 Contacto

Dylan - dylan@ecorueda.com

## 📄 Licencia

MIT
