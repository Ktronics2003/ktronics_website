#!/bin/bash
# =====================================================================
# Ktronics Owner Dashboard — deploy to Netlify (double-click to run)
# =====================================================================
# First run: a browser window opens to log in to Netlify, then the CLI
# asks to link this folder to a site — choose "Link to an existing site"
# and pick your dashboard site (e.g. poetic-syrniki-4e04e9).
# Every run after that just deploys.
# =====================================================================
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install it from https://nodejs.org and run this again."
  read -r -p "Press Enter to close..."
  exit 1
fi

echo ""
echo "Deploying Ktronics Owner Dashboard (including the ServiceM8 function)..."
echo ""

npx -y netlify-cli@latest deploy --prod --dir .

echo ""
echo "Done. If this was the first deploy after adding SERVICEM8_API_KEY,"
echo "open the site and the live panels should populate within a few seconds."
read -r -p "Press Enter to close..."
