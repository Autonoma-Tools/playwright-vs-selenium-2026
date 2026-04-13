# Playwright vs Selenium in 2026: $216,000 in Annual Costs Your Budget Does Not Show

Companion code for the Autonoma blog post 'Playwright vs Selenium in 2026: $216,000 in Annual Costs Your Budget Does Not Show'. Includes a runnable Selenium Maintenance Tax calculator and side-by-side Selenium vs Playwright login-flow tests for reference and migration practice.

> Companion code for the Autonoma blog post: **[Playwright vs Selenium in 2026: $216,000 in Annual Costs Your Budget Does Not Show](https://getautonoma.com/blog/playwright-vs-selenium-2026)**

## Requirements

- Node.js 18+
- For the Selenium test: Chrome browser + chromedriver matching your Chrome version
- For the Playwright test: browsers installed via `npx playwright install`
- The tax calculator has no external dependencies

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/playwright-vs-selenium-2026.git
cd playwright-vs-selenium-2026
npm install
# Tax calculator (zero dependencies)
node tools/maintenance-tax.js
node tools/maintenance-tax.js --engineers 15 --hourly-rate 85 --json

# Selenium test (requires Chrome + chromedriver)
npx mocha selenium/login-flow.spec.js --timeout 30000

# Playwright test (auto-downloads browsers)
npx playwright install && npx playwright test playwright/login-flow.spec.js
```

## Project structure

```
playwright-vs-selenium-2026/
  tools/
    maintenance-tax.js        # Selenium Maintenance Tax calculator
  selenium/
    login-flow.spec.js        # Selenium WebDriver login-flow test
  playwright/
    login-flow.spec.js        # Playwright login-flow test (same coverage)
  examples/
    run-tax-calculator.sh     # Example: run calculator with various flags
    run-selenium-test.sh      # Example: run the Selenium test
    run-playwright-test.sh    # Example: run the Playwright test
  package.json
  README.md
  LICENSE
  .gitignore
```

- `tools/` — the Selenium Maintenance Tax calculator referenced in the blog post.
- `selenium/` — the Selenium WebDriver baseline test for the migration guide.
- `playwright/` — the same test rewritten in Playwright for side-by-side comparison.
- `examples/` — runnable examples you can execute as-is.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/playwright-vs-selenium-2026/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.
