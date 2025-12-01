# Script de instalación y verificación para EcoRueda React
Write-Host "========================================" -ForegroundColor Green
Write-Host " VERIFICANDO ECORUEDA REACT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location $PSScriptRoot

# Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Red
    pause
    exit 1
}

# Verificar npm
Write-Host "[2/5] Verificando npm..." -ForegroundColor Cyan
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm instalado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm no encontrado" -ForegroundColor Red
    pause
    exit 1
}

# Instalar dependencias
Write-Host ""
Write-Host "[3/5] Instalando dependencias..." -ForegroundColor Cyan
Write-Host "Esto puede tomar unos minutos..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error instalando dependencias" -ForegroundColor Red
    Write-Host "Intentando con npm clean install..." -ForegroundColor Yellow
    npm ci --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Error persistente. Verifica tu conexión a internet" -ForegroundColor Red
        pause
        exit 1
    }
}

# Verificar instalación
Write-Host ""
Write-Host "[4/5] Verificando instalación..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "✓ $moduleCount módulos instalados" -ForegroundColor Green
} else {
    Write-Host "✗ Carpeta node_modules no encontrada" -ForegroundColor Red
    pause
    exit 1
}

# Verificar archivos críticos
Write-Host ""
Write-Host "[5/5] Verificando archivos del proyecto..." -ForegroundColor Cyan
$criticalFiles = @(
    "src\App.jsx",
    "src\main.jsx",
    "index.html",
    "vite.config.js",
    "tailwind.config.js"
)

$allFilesExist = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file no encontrado" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
if ($allFilesExist) {
    Write-Host " VERIFICACIÓN COMPLETA - TODO OK!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar el proyecto:" -ForegroundColor Cyan
    Write-Host "  1. Ejecuta: start.bat" -ForegroundColor Yellow
    Write-Host "  2. O ejecuta: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "La aplicación estará disponible en:" -ForegroundColor Cyan
    Write-Host "  http://localhost:5173" -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "¿Deseas iniciar el servidor ahora? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host ""
        Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
        npm run dev
    }
} else {
    Write-Host " VERIFICACIÓN INCOMPLETA" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Algunos archivos están faltando. Verifica la instalación." -ForegroundColor Red
}

Write-Host ""
pause
