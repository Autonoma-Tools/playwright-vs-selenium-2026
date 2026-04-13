#!/usr/bin/env bash

# Run the Selenium Maintenance Tax calculator with default inputs
# (10 engineers, $75/hr, 3 hrs/week flakiness, 800 tests, 12 runs/day, $2400/mo grid)

echo "--- Default calculation (10-engineer team) ---"
node tools/maintenance-tax.js

echo ""
echo "--- Custom: 20-engineer team at \$90/hr with 1200 tests ---"
node tools/maintenance-tax.js --engineers 20 --hourly-rate 90 --tests 1200

echo ""
echo "--- JSON output for programmatic use ---"
node tools/maintenance-tax.js --engineers 5 --json
