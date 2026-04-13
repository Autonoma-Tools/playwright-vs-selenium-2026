#!/usr/bin/env node

/**
 * Selenium Maintenance Tax Calculator
 *
 * Calculates the hidden annual cost of maintaining a Selenium test suite,
 * broken down into flakiness cost, CI wait cost, and grid infrastructure cost.
 *
 * Usage:
 *   node tools/maintenance-tax.js
 *   node tools/maintenance-tax.js --engineers 15 --hourly-rate 85
 *   node tools/maintenance-tax.js --json
 *
 * Flags:
 *   --engineers         Number of engineers on the team (default: 10)
 *   --hourly-rate       Fully loaded hourly cost per engineer in USD (default: 75)
 *   --flakiness-hours   Hours per engineer per week lost to flaky test triage (default: 3)
 *   --tests             Total number of Selenium tests in the suite (default: 800)
 *   --runs-per-day      Number of CI pipeline runs per day (default: 12)
 *   --grid-monthly-cost Monthly cost of Selenium Grid / cloud grid in USD (default: 2400)
 *   --json              Output structured JSON instead of a formatted table
 */

const args = process.argv.slice(2);

function parseFlag(name, fallback) {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index + 1 >= args.length) return fallback;
  const value = Number(args[index + 1]);
  if (Number.isNaN(value) || value < 0) {
    console.error(`Invalid value for --${name}: "${args[index + 1]}". Using default: ${fallback}`);
    return fallback;
  }
  return value;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

const engineers = parseFlag("engineers", 10);
const hourlyRate = parseFlag("hourly-rate", 75);
const flakinessHoursPerWeek = parseFlag("flakiness-hours", 3);
const totalTests = parseFlag("tests", 800);
const runsPerDay = parseFlag("runs-per-day", 12);
const gridMonthlyCost = parseFlag("grid-monthly-cost", 2400);
const outputJson = hasFlag("json");

const WEEKS_PER_YEAR = 50;
const WORKING_DAYS_PER_YEAR = 250;

// --- Flakiness cost ---
// Each engineer spends X hours/week triaging flaky failures, re-running pipelines,
// and investigating false positives.
const flakinessAnnualHours = engineers * flakinessHoursPerWeek * WEEKS_PER_YEAR;
const flakinessCost = flakinessAnnualHours * hourlyRate;

// --- CI wait cost ---
// Selenium tests are slow. Average Selenium test takes ~45 seconds with browser
// spin-up, navigation, and explicit waits. Assume 30% of runs require a re-run
// due to flaky failures. Each re-run blocks the pipeline for the full suite duration.
const avgTestDurationSeconds = 45;
const suiteDurationMinutes = (totalTests * avgTestDurationSeconds) / 60;
const rerunRate = 0.3;
const rerunsPerDay = runsPerDay * rerunRate;
const rerunMinutesPerDay = rerunsPerDay * suiteDurationMinutes;
const rerunHoursPerYear = (rerunMinutesPerDay * WORKING_DAYS_PER_YEAR) / 60;

// CI wait cost: blocked engineers waiting for re-runs. Assume 2 engineers blocked
// per re-run on average (the author + one reviewer waiting on green CI).
const engineersBlockedPerRerun = 2;
const ciWaitCost = rerunHoursPerYear * engineersBlockedPerRerun * hourlyRate;

// --- Grid infrastructure cost ---
const gridAnnualCost = gridMonthlyCost * 12;

// --- Total ---
const totalAnnualCost = flakinessCost + ciWaitCost + gridAnnualCost;

function formatUsd(value) {
  return "$" + Math.round(value).toLocaleString("en-US");
}

if (outputJson) {
  const result = {
    inputs: {
      engineers,
      hourly_rate_usd: hourlyRate,
      flakiness_hours_per_week: flakinessHoursPerWeek,
      total_tests: totalTests,
      runs_per_day: runsPerDay,
      grid_monthly_cost_usd: gridMonthlyCost,
    },
    breakdown: {
      flakiness: {
        annual_hours: flakinessAnnualHours,
        annual_cost_usd: Math.round(flakinessCost),
      },
      ci_wait: {
        suite_duration_minutes: Math.round(suiteDurationMinutes),
        reruns_per_day: Math.round(rerunsPerDay * 10) / 10,
        rerun_hours_per_year: Math.round(rerunHoursPerYear),
        annual_cost_usd: Math.round(ciWaitCost),
      },
      grid_infrastructure: {
        monthly_cost_usd: gridMonthlyCost,
        annual_cost_usd: gridAnnualCost,
      },
    },
    total_annual_selenium_tax_usd: Math.round(totalAnnualCost),
  };
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log("");
  console.log("==========================================================");
  console.log("  SELENIUM MAINTENANCE TAX CALCULATOR");
  console.log("==========================================================");
  console.log("");
  console.log("  Inputs:");
  console.log(`    Engineers on team ............... ${engineers}`);
  console.log(`    Hourly rate (fully loaded) ...... ${formatUsd(hourlyRate)}/hr`);
  console.log(`    Flakiness triage per engineer .... ${flakinessHoursPerWeek} hrs/week`);
  console.log(`    Total Selenium tests ............ ${totalTests.toLocaleString("en-US")}`);
  console.log(`    CI runs per day ................. ${runsPerDay}`);
  console.log(`    Grid monthly cost ............... ${formatUsd(gridMonthlyCost)}/mo`);
  console.log("");
  console.log("----------------------------------------------------------");
  console.log("  Breakdown:");
  console.log("----------------------------------------------------------");
  console.log("");
  console.log("  1. Flakiness Triage Cost");
  console.log(`     ${engineers} engineers x ${flakinessHoursPerWeek} hrs/week x ${WEEKS_PER_YEAR} weeks x ${formatUsd(hourlyRate)}/hr`);
  console.log(`     = ${flakinessAnnualHours.toLocaleString("en-US")} hours/year`);
  console.log(`     = ${formatUsd(flakinessCost)}/year`);
  console.log("");
  console.log("  2. CI Wait / Re-run Cost");
  console.log(`     Suite duration: ${totalTests.toLocaleString("en-US")} tests x ${avgTestDurationSeconds}s = ${Math.round(suiteDurationMinutes)} min`);
  console.log(`     Re-runs: ${runsPerDay} runs/day x ${(rerunRate * 100).toFixed(0)}% flaky re-run rate = ${(rerunsPerDay).toFixed(1)}/day`);
  console.log(`     Blocked time: ${Math.round(rerunHoursPerYear).toLocaleString("en-US")} hrs/year x ${engineersBlockedPerRerun} engineers`);
  console.log(`     = ${formatUsd(ciWaitCost)}/year`);
  console.log("");
  console.log("  3. Grid Infrastructure");
  console.log(`     ${formatUsd(gridMonthlyCost)}/mo x 12 months`);
  console.log(`     = ${formatUsd(gridAnnualCost)}/year`);
  console.log("");
  console.log("==========================================================");
  console.log(`  TOTAL ANNUAL SELENIUM MAINTENANCE TAX: ${formatUsd(totalAnnualCost)}`);
  console.log("==========================================================");
  console.log("");
  console.log("  Tip: Run with --json for structured output, or customize:");
  console.log("  node tools/maintenance-tax.js --engineers 15 --hourly-rate 85");
  console.log("");
}
