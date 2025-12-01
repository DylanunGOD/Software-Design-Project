# 📋 PLAN DE TRABAJO - ECORUEDA API

**Proyecto:** Diseño de Software - API REST EcoRueda  
**Autor:** DylanunGOD  
**Fecha de Creación:** 25 de Noviembre, 2025  
**Repositorio:** https://github.com/DylanunGOD/Software-Design-Project

---

## 🎯 ANÁLISIS DEL ESTADO ACTUAL

### ✅ CUMPLIDO (Lo que YA tienes implementado)

| # | Requisito | Estado | Evidencia |
|---|-----------|--------|-----------|
| 1 | **Repositorio en GitHub** | ✅ COMPLETO | Repositorio creado y activo |
| 2 | **API HTTP relacionado con proyecto anterior** | ✅ COMPLETO | API EcoRueda con funcionalidad completa |
| 3 | **Patrón de diseño implementado** | ✅ COMPLETO | Repository Pattern + Service Layer + Factory |
| 4 | **Al menos 10 endpoints** | ✅ COMPLETO | **27 endpoints** implementados |
| 5 | **Documentación Swagger** | ✅ COMPLETO | Swagger UI en `/api/docs` |
| 6 | **Autenticación JWT** | ✅ COMPLETO | Middleware auth.js con JWT |
| 7 | **Despliegue en Azure** | ❌ PENDIENTE | **NO DESPLEGADO** |

### 📊 ENDPOINTS IMPLEMENTADOS (27 Total)

#### **Auth (3 endpoints)**
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Login con JWT
- `POST /api/v1/auth/change-password` - Cambio de contraseña

#### **Vehicles (7 endpoints)**
- `GET /api/v1/vehicles` - Listar vehículos disponibles
- `GET /api/v1/vehicles/search` - Búsqueda con filtros
- `GET /api/v1/vehicles/location/:canton/:distrito` - Búsqueda por ubicación
- `GET /api/v1/vehicles/stats` - Estadísticas de vehículos
- `GET /api/v1/vehicles/:id` - Detalle de vehículo
- `POST /api/v1/vehicles/:id/reserve` - Reservar vehículo
- `POST /api/v1/vehicles/:id/release` - Liberar reserva

#### **Trips (6 endpoints)**
- `POST /api/v1/trips/start` - Iniciar viaje
- `POST /api/v1/trips/finish` - Finalizar viaje
- `POST /api/v1/trips/cancel` - Cancelar viaje
- `GET /api/v1/trips/active` - Obtener viaje activo
- `GET /api/v1/trips/history` - Historial de viajes
- `GET /api/v1/trips/stats` - Estadísticas de viajes
- `GET /api/v1/trips/:id` - Detalle de viaje específico

#### **Profile/Users (4 endpoints)**
- `GET /api/v1/profile` - Obtener perfil
- `PUT /api/v1/profile` - Actualizar perfil
- `GET /api/v1/profile/wallet` - Ver saldo
- `POST /api/v1/profile/wallet/recharge` - Recargar saldo

#### **Payments (5 endpoints)**
- `GET /api/v1/payments` - Listar métodos de pago
- `GET /api/v1/payments/active` - Métodos activos
- `GET /api/v1/payments/default` - Método por defecto
- `POST /api/v1/payments` - Agregar método de pago
- `PUT /api/v1/payments/:id/default` - Establecer como predeterminado
- `DELETE /api/v1/payments/:id` - Eliminar método de pago

#### **Health & Docs (2 endpoints)**
- `GET /health` - Health check
- `GET /api/docs` - Documentación Swagger

---

## ⚠️ LO QUE FALTA POR HACER

### 🚨 CRÍTICO - DESPLIEGUE EN AZURE

**Estado:** ❌ NO IMPLEMENTADO

El único requisito pendiente es el **despliegue en Azure**. Debes:

1. **Crear un App Service en Azure**
2. **Configurar Base de Datos en Azure**
3. **Configurar Variables de Entorno**
4. **Implementar CI/CD (opcional pero recomendado)**
5. **Agregar políticas de Azure necesarias**

---

## 📝 PLAN DE ACCIÓN PASO A PASO

### FASE 1: Preparación Local (30 minutos)

#### 1.1 Crear archivo `.env` de producción
```bash
# Crear .env en api-server/
cp .env.example .env
```

**Contenido del `.env`:**
```env
PORT=8080
NODE_ENV=production
JWT_SECRET=<GENERAR_SECRETO_SEGURO>
JWT_EXPIRE=24h
CORS_ORIGIN=https://tu-frontend-azure.azurewebsites.net
API_VERSION=v1
API_PREFIX=/api/v1
```

#### 1.2 Crear archivo de configuración de Azure
**Archivo:** `api-server/web.config` (para IIS en Azure App Service)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^index.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="index.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

#### 1.3 Crear workflow de GitHub Actions (CI/CD)
**Archivo:** `.github/workflows/azure-deploy.yml`

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: ./api-server
      run: npm ci
    
    - name: Run tests (si existen)
      working-directory: ./api-server
      run: npm test || echo "No tests configured"
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ecorueda-api'
        slot-name: 'production'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./api-server
```

---

### FASE 2: Configuración en Azure Portal (45 minutos)

#### 2.1 Crear App Service
1. Ir a [portal.azure.com](https://portal.azure.com)
2. Click en **"Create a resource"**
3. Buscar **"App Service"**
4. Configurar:
   - **Subscription:** Seleccionar tu suscripción
   - **Resource Group:** Crear nuevo `rg-ecorueda-api`
   - **Name:** `ecorueda-api` (debe ser único)
   - **Publish:** Code
   - **Runtime stack:** Node 18 LTS
   - **Operating System:** Linux
   - **Region:** East US (o tu preferida)
   - **Pricing Plan:** Free F1 (o B1 si necesitas más recursos)

#### 2.2 Configurar Base de Datos en Azure

**OPCIÓN A: Azure SQL Database (Recomendado para producción)**
1. Crear **Azure SQL Database**
2. Configurar:
   - **Database name:** `ecorueda-db`
   - **Server:** Crear nuevo servidor
   - **Pricing tier:** Basic (más económico)
3. Permitir acceso desde App Service
4. Actualizar código para usar SQL en lugar de SQLite

**OPCIÓN B: Mantener SQLite (Más rápido, menos robusto)**
1. Subir `ecorueda.db` con el código
2. Configurar almacenamiento persistente en App Service

#### 2.3 Configurar Variables de Entorno en Azure
1. En tu App Service, ir a **"Configuration"**
2. Agregar Application Settings:
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `JWT_SECRET`: (generar uno seguro)
   - `JWT_EXPIRE`: 24h
   - `CORS_ORIGIN`: URL de tu frontend
   - `API_PREFIX`: /api/v1
3. Guardar cambios

#### 2.4 Configurar Políticas de Azure

**Políticas necesarias:**

1. **HTTPS Only**
   ```bash
   # Habilitar HTTPS obligatorio
   az webapp update \
     --name ecorueda-api \
     --resource-group rg-ecorueda-api \
     --https-only true
   ```

2. **CORS Policy**
   ```bash
   az webapp cors add \
     --name ecorueda-api \
     --resource-group rg-ecorueda-api \
     --allowed-origins https://tu-frontend.azurewebsites.net
   ```

3. **Authentication/Authorization**
   - Ir a **Authentication** en el portal
   - Habilitar **App Service Authentication**
   - Configurar proveedores si es necesario

4. **Network Security**
   - Configurar **IP Restrictions** si quieres limitar acceso
   - Habilitar **Private Endpoints** para mayor seguridad

---

### FASE 3: Despliegue (30 minutos)

#### MÉTODO 1: Despliegue desde VS Code (Más fácil)
1. Instalar extensión **Azure App Service** en VS Code
2. Click derecho en carpeta `api-server`
3. Seleccionar **"Deploy to Web App"**
4. Seguir el wizard

#### MÉTODO 2: Despliegue con Git (Recomendado)
```bash
# En tu terminal local
cd "C:\Users\dylan\OneDrive\Documentos\diseño project\LAST\api-server"

# Configurar remote de Azure
git remote add azure https://ecorueda-api.scm.azurewebsites.net:443/ecorueda-api.git

# Hacer push
git push azure master
```

#### MÉTODO 3: GitHub Actions (CI/CD Automático)
1. Ir a tu App Service en Azure
2. Click en **Deployment Center**
3. Seleccionar **GitHub**
4. Autorizar y seleccionar tu repositorio
5. Azure creará automáticamente el workflow

---

### FASE 4: Validación y Pruebas (20 minutos)

#### 4.1 Verificar Deployment
```bash
# Health check
curl https://ecorueda-api.azurewebsites.net/health

# Swagger docs
https://ecorueda-api.azurewebsites.net/api/docs
```

#### 4.2 Probar Endpoints
```powershell
# Registro
$body = @{
    email = "test@ecorueda.com"
    password = "Test123!"
    name = "Test User"
    phone = "+506 1234-5678"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ecorueda-api.azurewebsites.net/api/v1/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

#### 4.3 Monitorear Logs
```bash
# Ver logs en tiempo real
az webapp log tail \
  --name ecorueda-api \
  --resource-group rg-ecorueda-api
```

---

### FASE 5: Documentación de Despliegue (15 minutos)

#### 5.1 Actualizar README.md
Agregar sección de **Producción:**
```markdown
## 🚀 Despliegue en Producción

- **URL:** https://ecorueda-api.azurewebsites.net
- **Documentación:** https://ecorueda-api.azurewebsites.net/api/docs
- **Health Check:** https://ecorueda-api.azurewebsites.net/health
```

#### 5.2 Crear documento de arquitectura Azure
**Archivo:** `AZURE_DEPLOYMENT.md`
- Diagrama de arquitectura en Azure
- Descripción de recursos
- Políticas implementadas
- Costos estimados

---

## 📦 CHECKLIST FINAL

Antes de la defensa del proyecto, asegúrate de:

### Código y Documentación
- [ ] Código en GitHub actualizado
- [ ] README.md completo con instrucciones
- [ ] ARQUITECTURA_Y_PATRONES.md detallado
- [ ] Swagger completamente documentado
- [ ] Comentarios en código crítico

### Azure
- [ ] App Service funcionando
- [ ] Base de datos configurada
- [ ] Variables de entorno correctas
- [ ] HTTPS habilitado
- [ ] CORS configurado
- [ ] Políticas de seguridad aplicadas
- [ ] Logs funcionando

### Pruebas
- [ ] Todos los 27 endpoints probados en producción
- [ ] JWT funcionando
- [ ] Swagger accesible públicamente
- [ ] Health check respondiendo

### Defensa
- [ ] Preparar demostración en vivo
- [ ] Explicar patrones de diseño utilizados
- [ ] Justificar decisiones arquitectónicas
- [ ] Mostrar políticas de Azure
- [ ] Tener backup de capturas de pantalla

---

## 🎓 PUNTOS CLAVE PARA LA DEFENSA

### 1. Patrones de Diseño
**Justificación:**
- **Repository Pattern:** Abstracción de acceso a datos, facilita testing y cambio de BD
- **Service Layer:** Lógica de negocio centralizada, reutilizable
- **Factory Pattern:** Creación dinámica de repositorios (RepositoryFactory.js)
- **Singleton:** Conexión única a base de datos (dbConnection.js)
- **Middleware Pattern:** Autenticación, logging, error handling

### 2. Principios SOLID
- **Single Responsibility:** Cada clase tiene una única responsabilidad
- **Open/Closed:** Repositorios extensibles sin modificar código base
- **Dependency Injection:** Controllers reciben dependencies via constructor

### 3. Seguridad
- Autenticación JWT
- Rate limiting
- Helmet (seguridad HTTP headers)
- HTTPS obligatorio en Azure
- Validación de inputs con schemas

### 4. Escalabilidad
- Arquitectura en capas
- Fácil migración de SQLite a Azure SQL
- Stateless (JWT, sin sesiones)
- Preparado para balanceador de carga

---

## 💰 COSTOS ESTIMADOS EN AZURE

| Recurso | Tier | Costo Mensual |
|---------|------|---------------|
| App Service | Free F1 | $0 |
| App Service | Basic B1 | ~$13 USD |
| Azure SQL | Basic | ~$5 USD |
| Storage (SQLite) | Standard | ~$0.50 USD |
| **TOTAL ESTIMADO** | | **$0 - $18.50 USD** |

---

## 📞 CONTACTO Y SOPORTE

- **GitHub Issues:** https://github.com/DylanunGOD/Software-Design-Project/issues
- **Autor:** DylanunGOD
- **Email:** dylan@ecorueda.com

---

## 🎯 CONCLUSIÓN

Tu proyecto está **casi completo**. Solo falta el despliegue en Azure, que es fundamental para cumplir con el requisito #7. El código es sólido, bien arquitecturado y cumple con todos los demás requisitos.

**Tiempo estimado total para completar:** 2-3 horas

**Siguiente paso inmediato:** Crear cuenta/validar acceso en Azure Portal

---

**Documento generado:** 25 de Noviembre, 2025  
**Versión:** 1.0  
**Estado:** Listo para ejecución
