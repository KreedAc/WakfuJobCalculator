// scripts/build-sublimations-data.mjs
//
// Generates localized sublimation files (fr/es/pt) from the official Ankama CDN,
// using the hand-curated public/data/sublimations.en.json as the source of truth
// for game mechanics (per-level values, slot colors, rarity, obtainment, category).
//
// Matching strategy: curated entries are matched to official items by normalized
// English name. Localized names/descriptions come from the official data; the
// [X]/[Y] level placeholders are re-injected into localized descriptions by
// replacing the curated base values, so the level slider keeps working.
//
// The English file is never overwritten — it IS the curated source.
//
// Usage:
//   node scripts/build-sublimations-data.mjs           # generate fr/es/pt files
//   node scripts/build-sublimations-data.mjs --debug   # also dump sample raw items

import { promises as fsp } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/data");
const CURATED_PATH = path.join(OUT_DIR, "sublimations.en.json");
const REPORT_PATH = path.resolve("scripts", "sublimations.i18n.report.json");
const TARGET_LANGUAGES = ["fr", "es", "pt"];
const DEBUG = process.argv.includes("--debug");

function pickText(v, lang) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    if (lang && v[lang]) return v[lang];
    return v.en ?? v.fr ?? v.es ?? v.pt ?? Object.values(v)[0] ?? null;
  }
  return null;
}

function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, "");
}

// Normalize for name matching: lowercase, no accents, collapse whitespace/punctuation.
function normName(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Normalize a description for comparison.
function normDesc(s) {
  return stripHtml(String(s)).replace(/\s+/g, " ").trim().toLowerCase();
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function itemId(o) {
  return o?.definition?.item?.id ?? o?.definition?.id ?? o?.id ?? null;
}

function itemTitle(o, lang) {
  return (
    pickText(o?.title, lang) ??
    pickText(o?.name, lang) ??
    pickText(o?.definition?.title, lang) ??
    pickText(o?.definition?.name, lang) ??
    null
  );
}

function itemDescription(o, lang) {
  return pickText(o?.description, lang) ?? pickText(o?.definition?.description, lang) ?? null;
}

// Render the curated EN description at the sublimation's base values,
// e.g. "[X]% Critical Hit" + {X: base 3} -> "3% Critical Hit".
function renderCuratedAtBase(curated) {
  let desc = curated.description || "";
  for (const v of curated.values || []) {
    if (v?.placeholder && v.base !== null && v.base !== undefined) {
      desc = desc.split(`[${v.placeholder}]`).join(String(v.base));
    }
  }
  return desc;
}

// Similarity: crude but effective for picking the right rarity variant —
// token overlap ratio between two normalized descriptions.
function similarity(a, b) {
  if (!a || !b) return 0;
  const ta = new Set(a.split(" "));
  const tb = new Set(b.split(" "));
  let common = 0;
  for (const t of ta) if (tb.has(t)) common++;
  return common / Math.max(ta.size, tb.size);
}

// Re-inject [X]-style placeholders into a localized description by replacing
// the first standalone occurrence of each base value. Returns the new text and
// how many placeholders were successfully injected.
function injectPlaceholders(localizedDesc, curated) {
  let desc = localizedDesc;
  let injected = 0;
  let expected = 0;
  for (const v of curated.values || []) {
    if (!v?.placeholder || v.base === null || v.base === undefined) continue;
    expected++;
    const token = String(v.base);
    // standalone number (not part of a longer number)
    const re = new RegExp(`(?<![0-9])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![0-9])`);
    if (re.test(desc)) {
      desc = desc.replace(re, `[${v.placeholder}]`);
      injected++;
    }
  }
  return { desc, injected, expected };
}

async function main() {
  const curatedRaw = await fsp.readFile(CURATED_PATH, "utf8");
  const curated = JSON.parse(curatedRaw);
  console.log(`Curated sublimations (EN source of truth): ${curated.length}`);

  console.log("Fetching Wakfu version...");
  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if (!version) throw new Error("No version in config.json");
  console.log("Wakfu version:", version);

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;
  console.log("Downloading items.json (large file)...");
  const itemsRaw = await fetchJson(`${base}/items.json`);
  console.log(`Official items: ${itemsRaw.length}`);

  // Index official items by normalized EN title (multiple rarity variants per name).
  const byEnName = new Map();
  for (const it of itemsRaw) {
    const en = itemTitle(it, "en");
    if (!en) continue;
    const key = normName(en);
    if (!key) continue;
    const arr = byEnName.get(key) ?? [];
    arr.push(it);
    byEnName.set(key, arr);
  }

  const report = {
    version,
    generatedAt: new Date().toISOString(),
    curatedCount: curated.length,
    matched: 0,
    unmatched: [],
    partialPlaceholders: [],
  };

  // Pick, for each curated sublimation, the official variant whose EN description
  // is closest to the curated description rendered at base values.
  const chosenByName = new Map();
  for (const sub of curated) {
    const candidates = byEnName.get(normName(sub.name)) ?? [];
    if (candidates.length === 0) {
      report.unmatched.push(sub.name);
      continue;
    }
    const target = normDesc(renderCuratedAtBase(sub));
    let best = candidates[0];
    let bestScore = -1;
    for (const c of candidates) {
      const d = itemDescription(c, "en");
      const s = d ? similarity(target, normDesc(d)) : 0;
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
    chosenByName.set(sub.name, { item: best, score: bestScore });
    report.matched++;
  }

  console.log(`Matched ${report.matched}/${curated.length} curated sublimations to official items`);
  if (report.unmatched.length) {
    console.log("Unmatched:", report.unmatched.join(", "));
  }

  if (DEBUG) {
    const samples = [...chosenByName.entries()].slice(0, 3).map(([name, { item, score }]) => ({
      name,
      score,
      raw: item,
    }));
    console.log("=== DEBUG SAMPLES ===");
    console.log(JSON.stringify(samples, null, 2).slice(0, 8000));
  }

  for (const lang of TARGET_LANGUAGES) {
    const out = [];
    let placeholderOk = 0;
    let placeholderPartial = 0;

    for (const sub of curated) {
      const entry = { ...sub };
      const chosen = chosenByName.get(sub.name);

      if (chosen) {
        const locName = itemTitle(chosen.item, lang);
        if (locName) entry.name = locName;

        const locDesc = itemDescription(chosen.item, lang);
        if (locDesc) {
          const cleaned = stripHtml(locDesc).replace(/\s+/g, " ").trim();
          const { desc, injected, expected } = injectPlaceholders(cleaned, sub);
          entry.description = desc;
          if (expected > 0 && injected < expected) {
            placeholderPartial++;
            report.partialPlaceholders.push({ name: sub.name, lang, injected, expected });
          } else {
            placeholderOk++;
          }
        }
      }
      // NOTE: rune level lookups key off the EN name in the app, so keep a stable key.
      entry.key = sub.name;
      out.push(entry);
    }

    const outPath = path.join(OUT_DIR, `sublimations.${lang}.json`);
    await fsp.writeFile(outPath, JSON.stringify(out, null, 2));
    console.log(
      `sublimations.${lang}.json: ${out.length} entries ` +
      `(placeholders ok: ${placeholderOk}, partial: ${placeholderPartial})`
    );
  }

  await fsp.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Report written to ${REPORT_PATH}`);
  console.log("✅ DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
