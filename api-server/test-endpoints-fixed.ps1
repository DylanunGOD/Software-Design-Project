#!/usr/bin/env pwsh
# Script de prueba para los endpoints de EcoRueda API

$BASE_URL = "http://localhost:5001/api/v1"
$TOKEN = $null

Write-Host "[TEST] Iniciando pruebas de los endpoints de EcoRueda API`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[1] Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/health" -Method Get -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Health check pasado`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Health check fallo: $_`n" -ForegroundColor Red
}

# Test 2: Register User
Write-Host "[2] Registrar Usuario" -ForegroundColor Yellow
try {
    $registerData = @{
        email = "dylan@test.com"
        password = "Password123"
        name = "Dylan Test"
        phone = "+506 8888-8888"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method Post -Body $registerData -ContentType "application/json" -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    $TOKEN = $response.data.token
    if ($response.data.token) {
        Write-Host "[OK] Token obtenido`n" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] Registro fallo: $_`n" -ForegroundColor Red
}

# Test 3: Login
Write-Host "[3] Login Usuario" -ForegroundColor Yellow
try {
    $loginData = @{
        email = "dylan@test.com"
        password = "Password123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    $TOKEN = $response.data.token
    Write-Host "[OK] Login exitoso`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Login fallo: $_`n" -ForegroundColor Red
}

# Headers con autenticacion
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

# Test 4: Get Profile
Write-Host "[4] Obtener Perfil" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/profile" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Perfil obtenido`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Perfil fallo: $_`n" -ForegroundColor Red
}

# Test 5: Get Available Vehicles
Write-Host "[5] Listar Vehiculos Disponibles" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/vehicles" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Vehiculos obtenidos`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Vehiculos fallo: $_`n" -ForegroundColor Red
}

# Test 6: Get Vehicle Stats
Write-Host "[6] Estadisticas de Vehiculos" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/vehicles/stats" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Estadisticas obtenidas`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Estadisticas fallo: $_`n" -ForegroundColor Red
}

# Test 7: Get Wallet Balance
Write-Host "[7] Obtener Saldo de Cartera" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/profile/wallet" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Saldo obtenido`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Saldo fallo: $_`n" -ForegroundColor Red
}

# Test 8: Get Payment Methods
Write-Host "[8] Obtener Metodos de Pago" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/payments" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Metodos obtenidos`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Metodos fallo: $_`n" -ForegroundColor Red
}

# Test 9: Add Payment Method
Write-Host "[9] Agregar Metodo de Pago" -ForegroundColor Yellow
try {
    $paymentData = @{
        card_last4 = "4242"
        provider = "visa"
        method_type = "card"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/payments" -Method Post -Body $paymentData -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Metodo agregado`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Agregar metodo fallo: $_`n" -ForegroundColor Red
}

# Test 10: Recharge Wallet
Write-Host "[10] Recargar Saldo" -ForegroundColor Yellow
try {
    $rechargeData = @{
        amount = 50.00
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/profile/wallet/recharge" -Method Post -Body $rechargeData -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Saldo recargado`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Recarga fallo: $_`n" -ForegroundColor Red
}

# Test 11: Start Trip
Write-Host "[11] Iniciar Viaje" -ForegroundColor Yellow
try {
    $tripData = @{
        vehicle_id = $null
        start_lat = 9.9334
        start_lng = -84.0834
        start_address = "San Jose, Carmen"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BASE_URL/trips/start" -Method Post -Body $tripData -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Viaje iniciado`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Iniciar viaje fallo: $_`n" -ForegroundColor Red
}

# Test 12: Get Active Trip
Write-Host "[12] Obtener Viaje Activo" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/trips/active" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host $response | ConvertTo-Json -Depth 2
    Write-Host "[OK] Viaje activo obtenido`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Viaje activo fallo: $_`n" -ForegroundColor Red
}

Write-Host "[RESUMEN] Pruebas completadas!" -ForegroundColor Green
