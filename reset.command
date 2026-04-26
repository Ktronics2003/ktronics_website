#!/usr/bin/env bash
# Nuke node_modules, package-lock.json, dist, .astro, and the npm cache,
# then reinstall fresh and verify the Astro binary is on disk.

set -u  # error on undefined vars, but DON'T set -e (we want to keep going past survivable errors)

cd "$(dirname "$0")"

clear
echo "================================================"
echo "  Ktronics — reset & reinstall"
echo "================================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed. Install from https://nodejs.org"
  read -n 1 -s
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 1: aggressive cleanup. Retry up to 3 times because macOS sometimes
# holds files open via Spotlight / Finder / a still-running node process.
# ---------------------------------------------------------------------------
echo "Cleaning out node_modules, package-lock.json, dist, .astro..."

# Kill any stray Astro/node processes from earlier failed runs first
pkill -f "astro dev" 2>/dev/null || true
pkill -f "node.*astro" 2>/dev/null || true
sleep 1

for attempt in 1 2 3; do
  rm -rf node_modules package-lock.json dist .astro 2>/dev/null
  if [ ! -e "node_modules" ] && [ ! -e "package-lock.json" ]; then
    echo "✓ Cleanup successful (attempt $attempt)."
    break
  fi
  echo "  Attempt $attempt didn't fully clear — waiting and retrying..."
  sleep 2
done

if [ -e "node_modules" ] || [ -e "package-lock.json" ]; then
  echo
  echo "ERROR: Could not delete leftover files. Try:"
  echo "  1. Quit any open code editors / terminals showing this folder"
  echo "  2. In Finder, manually drag 'node_modules' and 'package-lock.json' to the Trash"
  echo "  3. Then run this script again"
  echo
  read -n 1 -s -p "Press any key to close..."
  exit 1
fi

# Clean npm cache too (cheap insurance)
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null
echo

# ---------------------------------------------------------------------------
# Step 2: install fresh.
# ---------------------------------------------------------------------------
echo "Installing dependencies fresh (~30-90 seconds)..."
echo

if ! npm install --no-audit --no-fund; then
  echo
  echo "ERROR: npm install failed. Check your internet connection and try again."
  echo
  read -n 1 -s -p "Press any key to close..."
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 3: verify Astro binary actually exists.
# ---------------------------------------------------------------------------
echo
if [ ! -x "node_modules/.bin/astro" ]; then
  echo "================================================"
  echo "  WARNING: node_modules/.bin/astro is missing"
  echo "================================================"
  echo "Trying one more thing — npm rebuild..."
  npm rebuild
fi

if [ -x "node_modules/.bin/astro" ]; then
  ASTRO_VERSION=$(./node_modules/.bin/astro --version 2>/dev/null || echo "unknown")
  touch .cowork-init-done
  echo
  echo "================================================"
  echo "  ✓ Reset complete"
  echo "  Astro $ASTRO_VERSION installed and ready."
  echo "================================================"
  echo
  echo "Now double-click run-dev.command to start the dev server."
else
  echo
  echo "================================================"
  echo "  ERROR: Astro still not installed correctly."
  echo "================================================"
  echo
  echo "Try this in Terminal manually:"
  echo "  cd ~/Documents/Claude/Projects/Ktronics"
  echo "  npm install astro --save-dev"
  echo
fi

echo
echo "Press any key to close this window."
read -n 1 -s
