#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
DOMAIN="${NGROK_DOMAIN:-}"

if command -v ngrok >/dev/null 2>&1; then
  NGROK_BIN="ngrok"
elif [[ -x "/tmp/ngrok/ngrok" ]]; then
  NGROK_BIN="/tmp/ngrok/ngrok"
else
  echo "ngrok nao encontrado. Instale o ngrok ou coloque no PATH." >&2
  exit 1
fi

cleanup() {
  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" >/dev/null 2>&1; then
    kill "$DEV_PID" || true
  fi
}
trap cleanup EXIT

echo "Iniciando Next.js em http://localhost:${PORT} ..."
npm run dev -- --port "${PORT}" &
DEV_PID=$!

echo "Iniciando ngrok..."
if [[ -n "$DOMAIN" ]]; then
  "$NGROK_BIN" http --url="$DOMAIN" "$PORT"
else
  "$NGROK_BIN" http "$PORT"
fi
