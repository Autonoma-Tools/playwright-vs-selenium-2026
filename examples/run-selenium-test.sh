#!/usr/bin/env bash

# Run the Selenium login-flow test.
# Prerequisites:
#   - Chrome browser installed
#   - chromedriver matching your Chrome version
#   - npm install (from repo root)

echo "Running Selenium login-flow test..."
npx mocha selenium/login-flow.spec.js --timeout 30000
