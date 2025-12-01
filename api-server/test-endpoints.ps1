#!/usr/bin/env pwsh
# Script de prueba para los endpoints de EcoRueda API

$BASE_URL = "http://localhost:5001/api/v1"
$TOKEN = $null

Write-Host "🧪 Iniciando pruebas de los endpoints de EcoRueda API`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1️⃣  Health Check" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:5001/health" -Method Get -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 2: Register User
Write-Host "2️⃣  Registrar Usuario" -ForegroundColor Yellow
$registerData = @{
    email = "dylan@test.com"
    password = "Password123"
    name = "Dylan Test"
    phone = "+506 8888-8888"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method Post -Body $registerData -ContentType "application/json" -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
$TOKEN = $response.data.token
if ($response.data.token) {
    Write-Host "✅ Token obtenido: $($TOKEN.Substring(0, 20))..." -ForegroundColor Green
}
Write-Host ""

# Test 3: Login
Write-Host "3️⃣  Login Usuario" -ForegroundColor Yellow
$loginData = @{
    email = "dylan@test.com"
    password = "Password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginData -ContentType "application/json" -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
$TOKEN = $response.data.token
Write-Host ""

# Headers con autenticación
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

# Test 4: Get Profile
Write-Host "4️⃣  Obtener Perfil" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/profile" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 5: Get Available Vehicles
Write-Host "5️⃣  Listar Vehículos Disponibles" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/vehicles" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 6: Get Vehicle Stats
Write-Host "6️⃣  Estadísticas de Vehículos" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/vehicles/stats" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 7: Get Wallet Balance
Write-Host "7️⃣  Obtener Saldo de Cartera" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/profile/wallet" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 8: Get Payment Methods
Write-Host "8️⃣  Obtener Métodos de Pago" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/payments" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 9: Add Payment Method
Write-Host "9️⃣  Agregar Método de Pago" -ForegroundColor Yellow
$paymentData = @{
    card_number_last4 = "4242"
    card_brand = "visa"
    expiry_month = 12
    expiry_year = 2027
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/payments" -Method Post -Body $paymentData -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 10: Recharge Wallet
Write-Host "🔟 Recargar Saldo" -ForegroundColor Yellow
$rechargeData = @{
    amount = 50.00
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/profile/wallet/recharge" -Method Post -Body $rechargeData -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 11: Start Trip
Write-Host "1️⃣1️⃣  Iniciar Viaje" -ForegroundColor Yellow
$tripData = @{
    type = "scooter"
    start_lat = 9.9334
    start_lng = -84.0834
    start_address = "San José, Carmen"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/trips/start" -Method Post -Body $tripData -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

# Test 12: Get Active Trip
Write-Host "1️⃣2️⃣  Obtener Viaje Activo" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/trips/active" -Method Get -Headers $headers -ErrorAction SilentlyContinue
Write-Host $response | ConvertTo-Json -Depth 2
Write-Host ""

Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
