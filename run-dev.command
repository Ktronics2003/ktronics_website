#!/usr/bin/env bash
# Double-click this file to start the Ktronics dev server.
# - Installs dependencies on first run.
# - If something goes wrong with dependencies, double-click reset.command instead.
# - Press Ctrl+C in the Terminal window to stop.

# Note: NOT using `set -e` here intentionally — we want the script to keep
# going past survivable errors so the user always gets a useful prompt.

cd "$(dirname "$0")"

clear
echo "================================================"
echo "  Ktronics — local dev server"
echo "================================================"
echo

# Check Node is installed
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed."
  echo
  echo "Install it from https://nodejs.org (use the LTS version, 20 or newer)"
  echo "then double-click this file again."
  echo
  echo "Press any key to close this window."
  read -n 1 -s
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node.js 20 or newer is required (you have $(node -v))."
  echo "Update from https://nodejs.org"
  echo
  echo "Press any key to close this window."
  read -n 1 -s
  exit 1
fi

# Install only if node_modules is missing or package.json is newer.
# Anything more invasive (lockfile reset etc.) lives in reset.command.
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installing dependencies (~30-90 seconds the first time)..."
  echo
  if ! npm install --no-audit --no-fund; then
    echo
    echo "================================================"
    echo "  npm install failed."
    echo "  Double-click reset.command to do a clean reinstall."
    echo "================================================"
    echo
    echo "Press any key to close this window."
    read -n 1 -s
    exit 1
  fi
  echo
  echo "✓ Dependencies installed."
  echo
fi

echo "Starting dev server..."
echo "Open http://localhost:4321 in your browser."
echo "Press Ctrl+C to stop."
echo
npm run dev
