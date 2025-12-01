@echo off
echo ========================================
echo  INSTALANDO ECORUEDA REACT
echo ========================================
echo.

cd "%~dp0"

echo [1/4] Verificando Node.js y npm...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Por favor descarga e instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo Node.js: OK
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm no esta disponible
    pause
    exit /b 1
)
echo npm: OK
echo.

echo [2/4] Instalando dependencias...
echo Esto puede tomar unos minutos...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo ERROR al instalar dependencias
    echo Intentando metodo alternativo...
    call npm ci --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        echo Verifica tu conexion a internet
        pause
        exit /b 1
    )
)

echo.
echo [3/4] Verificando instalacion...
if exist "node_modules\" (
    echo Modulos instalados correctamente
) else (
    echo ERROR: Carpeta node_modules no encontrada
    pause
    exit /b 1
)

echo.
echo [4/4] Verificando archivos criticos...
if exist "src\App.jsx" (
    echo src\App.jsx: OK
) else (
    echo ERROR: src\App.jsx no encontrado
)
if exist "src\main.jsx" (
    echo src\main.jsx: OK
) else (
    echo ERROR: src\main.jsx no encontrado
)
if exist "index.html" (
    echo index.html: OK
) else (
    echo ERROR: index.html no encontrado
)

echo.
echo ========================================
echo  INSTALACION COMPLETA
echo ========================================
echo.
echo Para iniciar el proyecto:
echo   1. Ejecuta start.bat
echo   2. O ejecuta: npm run dev
echo.
echo La aplicacion estara en: http://localhost:5173
echo.
pause
