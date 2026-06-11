#!/usr/bin/env bash
set -euo pipefail

echo "=== Totem IA — Production Deploy ==="

# 1. Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required. Install at https://docs.docker.com/engine/install/"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "Docker Compose is required."; exit 1; }

# 2. Load environment
if [ -f .env ]; then
  echo "Loading .env file..."
  export $(grep -v '^\s*#' .env | grep -v '^\s*$' | xargs)
else
  echo "No .env found. Copy .env.example to .env and fill in your settings."
  exit 1
fi

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "ERROR: OPENAI_API_KEY is not set in .env"
  exit 1
fi

# 3. Build and start
echo "Building and starting services..."
docker compose up --build -d

# 4. Health check
echo "Waiting for backend to be healthy..."
sleep 5
if curl -sf http://localhost:3001/api/health > /dev/null 2>&1; then
  echo "✓ Backend is healthy"
else
  echo "⚠ Backend health check failed — check logs: docker compose logs backend"
fi

echo ""
echo "=== Deploy complete! ==="
echo "Frontend:  https://$(grep -oP '(?<=//)[^/]+' Caddyfile | head -1)"
echo "API:       https://$(grep -oP '(?<=//)[^/]+' Caddyfile | head -1)/api/health"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f    View logs"
echo "  docker compose ps         Check status"
echo "  docker compose down       Stop all services"
