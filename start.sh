#!/bin/bash
# Script de inicio de TalentAI
# Inicia el daemon de Docker si no está corriendo, luego levanta la aplicación

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║         TalentAI — Iniciando...      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Verificar si el daemon de Docker está corriendo
if ! docker info > /dev/null 2>&1; then
  echo "⏳ Iniciando Docker (puede tardar unos segundos)..."
  # Iniciar dockerd en segundo plano con almacenamiento en /tmp/docker-data
  nohup dockerd \
    --host=unix:///var/run/docker.sock \
    --data-root=/tmp/docker-data \
    > /tmp/dockerd.log 2>&1 &

  # Esperar hasta que Docker esté listo
  echo "   Esperando que Docker esté disponible..."
  for i in $(seq 1 30); do
    if docker info > /dev/null 2>&1; then
      echo "✅ Docker está listo."
      break
    fi
    if [ "$i" -eq 30 ]; then
      echo ""
      echo "❌ Docker tardó demasiado en iniciar. Revisá el log: /tmp/dockerd.log"
      exit 1
    fi
    sleep 1
  done
else
  echo "✅ Docker ya está corriendo."
fi

echo ""
echo "🚀 Levantando TalentAI..."
echo "   (La primera vez tarda 5–10 minutos mientras descarga todo)"
echo "   (Las siguientes veces tarda menos de 1 minuto)"
echo ""
echo "   Cuando veas el mensaje:"
echo "   ✅ MongoDB conectado"
echo "   abrí tu navegador en: http://localhost:3000"
echo ""

# Ir a la carpeta del proyecto y levantar docker compose
cd "$(dirname "$0")"
docker compose up --build
