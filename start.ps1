# start.ps1 — Script de inicio de TalentAI para Windows
# Ejecutar con: .\start.ps1

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         TalentAI — Iniciando...      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté corriendo
Write-Host "⏳ Verificando Docker..." -ForegroundColor Yellow

$dockerOk = $false
try {
    $result = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerOk = $true
    }
} catch {}

if (-not $dockerOk) {
    Write-Host ""
    Write-Host "❌ Docker Desktop no está corriendo." -ForegroundColor Red
    Write-Host ""
    Write-Host "Para solucionarlo:" -ForegroundColor White
    Write-Host "  1. Buscá 'Docker Desktop' en el menú Inicio y abrilo" -ForegroundColor White
    Write-Host "  2. Esperá hasta que el ícono de la ballena (🐳) en la barra de tareas deje de moverse" -ForegroundColor White
    Write-Host "  3. Volvé a ejecutar este script: .\start.ps1" -ForegroundColor White
    Write-Host ""
    Read-Host "Presioná Enter para cerrar"
    exit 1
}

Write-Host "✅ Docker está listo." -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Levantando TalentAI..." -ForegroundColor Cyan
Write-Host ""
Write-Host "   ⏳ La PRIMERA vez tarda entre 5 y 10 minutos (descarga lo necesario)" -ForegroundColor Yellow
Write-Host "   ⚡ Las siguientes veces tarda menos de 1 minuto" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Cuando veas este mensaje en pantalla:" -ForegroundColor White
Write-Host "   ✅ MongoDB conectado" -ForegroundColor Green
Write-Host "   🚀 TalentAI Backend corriendo en puerto 5000" -ForegroundColor Green
Write-Host ""
Write-Host "   → Abrí tu navegador en: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Para cerrar la aplicación: presioná Ctrl + C" -ForegroundColor White
Write-Host ""

# Ir a la carpeta del script y levantar docker compose
Set-Location $PSScriptRoot
docker compose up --build
