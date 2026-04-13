#!/usr/bin/env bash

# Run the Playwright login-flow test.
# Prerequisites:
#   - npm install (from repo root)
#   - npx playwright install (downloads browser binaries)

echo "Installing Playwright browsers (if not already installed)..."
npx playwright install --with-deps chromium 2>/dev/null || npx playwright install chromium

echo ""
echo "Running Playwright login-flow test..."
npx playwright test playwright/login-flow.spec.js
