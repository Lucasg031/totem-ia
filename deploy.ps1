# Totem IA — Production Deploy (PowerShell)
# Run on the target Linux server via SSH or directly on Windows with Docker Desktop

param(
    [switch]$BuildOnly
)

Write-Host "=== Totem IA — Production Deploy ===" -ForegroundColor Cyan

# Check prerequisites
$hasDocker = Get-Command docker -ErrorAction SilentlyContinue
$hasCompose = Get-Command docker-compose -ErrorAction SilentlyContinue -or
              (docker compose version 2>$null)

if (-not $hasDocker) {
    Write-Host "ERROR: Docker is required." -ForegroundColor Red
    exit 1
}

# Load .env
if (Test-Path .env) {
    Write-Host "Loading .env file..."
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)\s*$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
} else {
    Write-Host "No .env found. Copy .env.example to .env and fill in your settings." -ForegroundColor Yellow
    exit 1
}

if (-not $env:OPENAI_API_KEY) {
    Write-Host "ERROR: OPENAI_API_KEY is not set in .env" -ForegroundColor Red
    exit 1
}

# Build and start
Write-Host "Building and starting services..." -ForegroundColor Green
docker compose up --build -d

# Health check
Start-Sleep -Seconds 5
try {
    $health = Invoke-WebRequest -Uri http://localhost:3001/api/health -UseBasicParsing
    if ($health.StatusCode -eq 200) {
        Write-Host "✓ Backend is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Backend health check failed — check logs: docker compose logs backend" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Deploy complete! ===" -ForegroundColor Cyan
Write-Host "Access via your domain (configured in Caddyfile)" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Gray
Write-Host "  docker compose logs -f    View logs" -ForegroundColor Gray
Write-Host "  docker compose ps         Check status" -ForegroundColor Gray
Write-Host "  docker compose down       Stop all services" -ForegroundColor Gray
