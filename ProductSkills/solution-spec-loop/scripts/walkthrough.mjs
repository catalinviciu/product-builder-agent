#!/usr/bin/env node
// Prototype walkthrough helper for the solution spec loop.
//
//   node walkthrough.mjs check --file <prototype.html>
//   node walkthrough.mjs run   --file <prototype.html> --actions <actions.json> --out <dir> [--all]
//
// `check` runs the hard gates on a prototype version. Exit code 1 when a gate fails.
// `run` replays the actions from a fresh page load and reports what the persona can see:
// the accessibility tree and a screenshot, never the HTML source. The tester adds one
// action at a time and runs again. Every run writes <out>/walkthrough.json as evidence.
//
// actions.json is an array of steps:
//   { "do": "click",  "target": "Save view" }            button, link, tab, ... by visible name
//   { "do": "fill",   "target": "Search", "value": "x" } input by label or placeholder
//   { "do": "select", "target": "Region", "value": "EU" }
//   { "do": "check",  "target": "Only late vehicles" }   checkbox or radio
//   { "do": "hover",  "target": "Vehicle 12" }
//   { "do": "press",  "key": "Escape" }
//   { "do": "scroll", "direction": "down" | "up" }
//   { "do": "wait",   "ms": 500 }                         max 2000
// Any step can carry "note": "why the persona did this" - copied into the log.

import { chromium } from "playwright";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const SNAPSHOT_MAX_CHARS = 8000;
const CLICKABLE_ROLES = ["button", "link", "tab", "menuitem", "option", "checkbox", "radio", "switch", "treeitem"];
// Words that suggest test framing leaked into a participant-facing file (prototype-builder rule 6)
const FRAMING_WORDS = /\b(facilitator|interviewer|moderator|observer|tester notes?|test script|what to test|research question)\b/i;

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const opts = { command };
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    if (key === "--all") opts.all = true;
    else if (key.startsWith("--")) opts[key.slice(2)] = rest[++i];
  }
  return opts;
}

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error("Usage:\n  node walkthrough.mjs check --file <prototype.html>\n  node walkthrough.mjs run --file <prototype.html> --actions <actions.json> --out <dir> [--all]");
  process.exit(2);
}

async function openPage(browser, file) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const events = { consoleErrors: [], pageErrors: [], failedRequests: [], dialogs: [] };
  page.on("console", (msg) => { if (msg.type() === "error") events.consoleErrors.push(msg.text()); });
  page.on("pageerror", (err) => events.pageErrors.push(err.message));
  page.on("requestfailed", (req) => events.failedRequests.push(`${req.url()} (${req.failure()?.errorText ?? "failed"})`));
  page.on("dialog", async (dialog) => {
    events.dialogs.push(`${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });
  const url = pathToFileURL(resolve(file)).href;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 15000 });
  } catch {
    // A slow CDN shouldn't block the walkthrough; the DOM is usually ready.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  }
  return { page, events };
}

// Find what the persona means by a visible name, in the order a person would look.
async function locate(page, step) {
  const name = step.target;
  if (!name) throw new Error(`"${step.do}" needs a "target"`);
  const candidates = [];
  if (["click", "hover", "check"].includes(step.do)) {
    for (const role of CLICKABLE_ROLES) candidates.push(page.getByRole(role, { name, exact: false }));
  }
  if (["fill", "select", "check"].includes(step.do)) {
    candidates.push(page.getByLabel(name, { exact: false }));
    candidates.push(page.getByPlaceholder(name, { exact: false }));
  }
  candidates.push(page.getByText(name, { exact: false }));
  for (const candidate of candidates) {
    const visible = candidate.filter({ visible: true });
    const count = await visible.count();
    if (count > 0) return { locator: visible.first(), matches: count };
  }
  return null;
}

async function perform(page, step) {
  switch (step.do) {
    case "press":
      await page.keyboard.press(step.key);
      return {};
    case "scroll":
      await page.mouse.wheel(0, step.direction === "up" ? -600 : 600);
      return {};
    case "wait":
      await page.waitForTimeout(Math.min(Number(step.ms) || 0, 2000));
      return {};
    case "click":
    case "hover":
    case "fill":
    case "select":
    case "check": {
      const found = await locate(page, step);
      if (!found) return { notFound: true };
      const { locator, matches } = found;
      if (step.do === "click") await locator.click({ timeout: 5000 });
      if (step.do === "hover") await locator.hover({ timeout: 5000 });
      if (step.do === "fill") await locator.fill(String(step.value ?? ""), { timeout: 5000 });
      if (step.do === "select") await locator.selectOption({ label: String(step.value) }, { timeout: 5000 });
      if (step.do === "check") await locator.check({ timeout: 5000 });
      return { matches };
    }
    default:
      throw new Error(`Unknown action "${step.do}"`);
  }
}

async function snapshot(page) {
  let tree = await page.locator("body").ariaSnapshot();
  if (tree.length > SNAPSHOT_MAX_CHARS) tree = `${tree.slice(0, SNAPSHOT_MAX_CHARS)}\n... (truncated)`;
  return tree;
}

function describe(step) {
  if (step.do === "press") return `press ${step.key}`;
  if (step.do === "scroll") return `scroll ${step.direction ?? "down"}`;
  if (step.do === "wait") return `wait ${step.ms}ms`;
  const value = step.value !== undefined ? ` = "${step.value}"` : "";
  return `${step.do} "${step.target}"${value}`;
}

async function run(opts) {
  if (!opts.file || !opts.actions || !opts.out) usage("run needs --file, --actions and --out");
  const actions = JSON.parse(await readFile(opts.actions, "utf8"));
  if (!Array.isArray(actions)) usage("actions file must hold a JSON array");
  await mkdir(opts.out, { recursive: true });

  const browser = await chromium.launch();
  try {
    const { page, events } = await openPage(browser, opts.file);
    await page.waitForTimeout(300);
    const steps = [{ index: 0, action: "open prototype", status: "ok", screenshot: join(opts.out, "step-00.png") }];
    await page.screenshot({ path: steps[0].screenshot, fullPage: true });
    if (opts.all) steps[0].visible = await snapshot(page);

    for (let i = 0; i < actions.length; i++) {
      const step = actions[i];
      const record = { index: i + 1, action: describe(step), note: step.note };
      try {
        const result = await perform(page, step);
        if (result.notFound) {
          record.status = "not-found";
          record.detail = `Nothing visible matches "${step.target}". Replay stopped here.`;
        } else {
          record.status = "ok";
          if (result.matches > 1) record.detail = `${result.matches} visible matches; used the first.`;
        }
      } catch (err) {
        record.status = "error";
        record.detail = err.message.split("\n")[0];
      }
      await page.waitForTimeout(300);
      record.screenshot = join(opts.out, `step-${String(i + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: record.screenshot, fullPage: true });
      if (opts.all) record.visible = await snapshot(page);
      steps.push(record);
      if (record.status !== "ok") break;
    }

    const current = await snapshot(page);
    const log = {
      file: resolve(opts.file),
      actionsTaken: steps.length - 1,
      stoppedEarly: steps.at(-1).status !== "ok",
      steps,
      currentlyVisible: current,
      consoleErrors: events.consoleErrors,
      pageErrors: events.pageErrors,
      dialogs: events.dialogs,
    };
    await writeFile(join(opts.out, "walkthrough.json"), JSON.stringify(log, null, 2));

    const lines = [`# Walkthrough: ${steps.length - 1} action(s)`, ""];
    for (const s of steps) {
      lines.push(`${s.index}. ${s.action} - ${s.status}${s.detail ? ` (${s.detail})` : ""}`);
      if (opts.all && s.visible) lines.push("```yaml", s.visible, "```");
    }
    if (events.dialogs.length) lines.push("", "Dialogs shown:", ...events.dialogs.map((d) => `- ${d}`));
    lines.push("", `## What is on screen now (screenshot: ${steps.at(-1).screenshot})`, "```yaml", current, "```");
    lines.push("", `Log: ${join(opts.out, "walkthrough.json")}`);
    console.log(lines.join("\n"));
  } finally {
    await browser.close();
  }
}

async function check(opts) {
  if (!opts.file) usage("check needs --file");
  const source = await readFile(opts.file, "utf8");
  const failures = [];
  const warnings = [];

  const comments = source.match(/<!--[\s\S]*?-->/g) ?? [];
  if (comments.length) failures.push(`${comments.length} HTML comment(s) in the file. A prototype holds only what a participant sees.`);
  const framing = source.match(FRAMING_WORDS);
  // A word list can't tell framing from a real UI label, so this one is for the orchestrator to judge.
  if (framing) warnings.push(`Possible test framing in the file: "${framing[0]}". Check it isn't meant for a facilitator.`);

  const browser = await chromium.launch();
  try {
    const { page, events } = await openPage(browser, opts.file);
    await page.waitForTimeout(500);
    const text = (await page.locator("body").innerText()).trim();
    if (!text) failures.push("The page shows no text after loading.");
    for (const e of events.pageErrors) failures.push(`Script error: ${e}`);
    for (const e of events.consoleErrors) failures.push(`Console error: ${e}`);
    for (const r of events.failedRequests) warnings.push(`Request failed: ${r}`);
  } finally {
    await browser.close();
  }

  console.log([
    `# Gates: ${failures.length ? "FAIL" : "PASS"}`,
    ...failures.map((f) => `- FAIL: ${f}`),
    ...warnings.map((w) => `- WARN: ${w}`),
  ].join("\n"));
  process.exit(failures.length ? 1 : 0);
}

const opts = parseArgs(process.argv.slice(2));
if (opts.command === "run") await run(opts);
else if (opts.command === "check") await check(opts);
else usage(opts.command ? `unknown command "${opts.command}"` : undefined);
