#!/usr/bin/env node
/**
 * Ensures every stock image in src/assets is unique (by content hash)
 * and is imported from at most one page/component.
 *
 * Run: node scripts/check-stock-images.mjs
 * Exits non-zero when a duplicate file OR a shared import is found.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const ASSETS_DIR = join(ROOT, "src/assets");
const SCAN_DIRS = [join(ROOT, "src/pages"), join(ROOT, "src/components")];
// Brand assets are intentionally shared everywhere — skip them.
const EXEMPT = new Set(["logo.png", "regamos-academy-logo.png"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// 1. Duplicate-content check
const hashes = new Map(); // hash -> [relPath]
for (const file of walk(ASSETS_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!IMAGE_EXT.has(ext)) continue;
  const base = file.split("/").pop();
  if (EXEMPT.has(base)) continue;
  const h = createHash("sha1").update(readFileSync(file)).digest("hex");
  const rel = relative(ROOT, file);
  if (!hashes.has(h)) hashes.set(h, []);
  hashes.get(h).push(rel);
}
const dupFiles = [...hashes.values()].filter((g) => g.length > 1);

// 2. Shared-import check
const importRe = /from\s+["']@\/assets\/([^"']+)["']/g;
const usage = new Map(); // assetPath -> Set(consumerFile)
for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (![".ts", ".tsx", ".js", ".jsx"].includes(extname(file))) continue;
    const src = readFileSync(file, "utf8");
    let m;
    while ((m = importRe.exec(src))) {
      const asset = m[1];
      const base = asset.split("/").pop();
      if (EXEMPT.has(base)) continue;
      if (!usage.has(asset)) usage.set(asset, new Set());
      usage.get(asset).add(relative(ROOT, file));
    }
  }
}
const shared = [...usage.entries()].filter(([, set]) => set.size > 1);

// Report
let failed = false;
if (dupFiles.length) {
  failed = true;
  console.error("\n❌ Duplicate image content detected:");
  for (const group of dupFiles) console.error("  - " + group.join("\n    "));
}
if (shared.length) {
  failed = true;
  console.error("\n❌ Stock images imported by more than one file:");
  for (const [asset, set] of shared) {
    console.error(`  - ${asset}\n    used by: ${[...set].join(", ")}`);
  }
}
if (failed) {
  console.error(
    "\nEach stock image must be unique and used in exactly one place. " +
      "Download a fresh photo or move the shared image into a dedicated component.",
  );
  process.exit(1);
}
console.log(
  `✅ ${hashes.size} stock images checked — all unique, no shared imports.`,
);
