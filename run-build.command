#!/usr/bin/env bash
# Double-click this file to build the production site into ./dist
# Use this before deploying to Netlify (or to test the production output).

set -e

cd "$(dirname "$0")"

clear
echo "================================================"
echo "  Ktronics — production build"
echo "================================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed. Install from https://nodejs.org"
  echo "Press any key to close this window."
  read -n 1 -s
  exit 1
fi

if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installing dependencies first..."
  npm install --no-audit --no-fund
  echo
fi

echo "Building..."
echo
npm run build

echo
echo "================================================"
echo "  ✓ Build complete — output in ./dist"
echo "================================================"
echo "To preview the production build, run ./run-preview.command"
echo
echo "Press any key to close this window."
read -n 1 -s
