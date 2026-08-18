/**
 * Runs Lighthouse (installed Chrome, headless) over the key pages, mobile and desktop,
 * and writes JSON + a summary table:  node scripts/audit/run-lighthouse.mjs http://localhost:3113
 * Requires a production server started from a LAUNCH-MODE build (SITE_INDEXING=on) so the SEO
 * category is measured as it will be at launch, not against the pre-launch noindex.
 */
import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3113";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "docs", "evidence", "phase-7", "lighthouse");
const PAGES = [
  ["home", "/"],
  ["properties", "/properties"],
  ["property-detail", "/properties/lincoln-road-pe1-345"],
  ["landlords", "/landlords"],
  ["tenants", "/tenants"],
  ["maintenance", "/maintenance"],
  ["rental-appraisal", "/rental-appraisal?type=apartment&beds=2&status=vacant"],
  ["insights-article", "/insights/what-to-expect-at-a-viewing"],
];
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await fs.mkdir(OUT, { recursive: true });
const rows = [];
for (const [name, route] of PAGES) {
  for (const preset of ["mobile", "desktop"]) {
    const file = path.join(OUT, `${name}-${preset}.json`);
    // Quoted for the Windows shell (paths and the chrome-flags value contain spaces).
    const q = (v) => `"${v}"`;
    const args = [
      "lighthouse",
      q(`${BASE}${route}`),
      "--quiet",
      "--output=json",
      q(`--output-path=${file}`),
      q("--chrome-flags=--headless=new --no-sandbox"),
      q(`--chrome-path=${chrome}`),
      "--only-categories=performance,accessibility,best-practices,seo",
    ];
    if (preset === "desktop") args.push("--preset=desktop");
    // Chrome-launcher's temp-profile cleanup can fail with EPERM on Windows after the report is
    // written; treat the run as successful when the JSON exists.
    await fs.rm(file, { force: true });
    try {
      execFileSync("npx", args, { stdio: "ignore", shell: true, cwd: ROOT });
    } catch {
      /* fall through — checked below */
    }
    const json = JSON.parse(await fs.readFile(file, "utf8"));
    const c = json.categories;
    const audits = json.audits;
    rows.push({
      page: name,
      preset,
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c["best-practices"].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcp: audits["largest-contentful-paint"]?.displayValue,
      cls: audits["cumulative-layout-shift"]?.displayValue,
      tbt: audits["total-blocking-time"]?.displayValue,
    });
    console.log(JSON.stringify(rows[rows.length - 1]));
  }
}
await fs.writeFile(path.join(OUT, "summary.json"), JSON.stringify(rows, null, 2));
const md = [
  "| Page | Preset | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |",
  "|---|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.page} | ${r.preset} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} |`),
];
await fs.writeFile(path.join(OUT, "summary.md"), md.join("\n") + "\n");
console.log(md.join("\n"));
