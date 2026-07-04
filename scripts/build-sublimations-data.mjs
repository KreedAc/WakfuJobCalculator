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

// Non-epic sublimation scrolls exist as tier variants "Name I/II/III"
// (Rare/Mythic/Legendary). Strip the trailing roman numeral to get the base name.
function stripTier(s) {
  return String(s).replace(/\s+(?:I{1,3})\s*$/u, "").trim();
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

// Sublimation items carry their real effect in a state machine reference:
// equipEffects[].effect.definition with actionId 304 and params[0] = stateId.
function itemStateIds(o) {
  const effects = o?.definition?.equipEffects ?? [];
  const ids = [];
  for (const e of effects) {
    const def = e?.effect?.definition;
    if (def?.actionId === 304 && Array.isArray(def.params) && def.params.length > 0) {
      ids.push(def.params[0]);
    }
  }
  return ids;
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

  if (DEBUG) {
    console.log("=== DEBUG config.json ===");
    console.log(JSON.stringify(cfg, null, 2).slice(0, 4000));
  }

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;

  // Sublimation scrolls may live in different gamedata files depending on
  // the CDN version — pull every source that can contain named items.
  const ITEM_SOURCES = ["items", "jobsItems", "resources"];
  const itemsRaw = [];
  for (const src of ITEM_SOURCES) {
    try {
      console.log(`Downloading ${src}.json ...`);
      const arr = await fetchJson(`${base}/${src}.json`);
      console.log(`  ${src}: ${arr.length} entries`);
      itemsRaw.push(...arr);
    } catch (e) {
      console.log(`  ${src}: unavailable (${e.message.split("\n")[0]})`);
    }
  }
  console.log(`Official items (all sources): ${itemsRaw.length}`);

  if (DEBUG) {
    console.log("=== DEBUG first item structure ===");
    console.log(JSON.stringify(itemsRaw[0], null, 2).slice(0, 3000));

    console.log("=== DEBUG item type distribution (top 25) ===");
    const typeCount = new Map();
    for (const it of itemsRaw) {
      const tid =
        it?.definition?.item?.baseParameters?.itemTypeId ??
        it?.definition?.itemTypeId ??
        it?.itemTypeId ?? "unknown";
      typeCount.set(tid, (typeCount.get(tid) ?? 0) + 1);
    }
    const sorted = [...typeCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
    console.log(sorted.map(([t, c]) => `type ${t}: ${c}`).join("\n"));

    console.log("=== DEBUG search for known sublimation names ===");
    for (const probe of ["Ruin", "Influence", "Courage", "Carnage", "Frenzy"]) {
      const hits = itemsRaw
        .filter((it) => {
          const en = itemTitle(it, "en");
          return en && en.toLowerCase().includes(probe.toLowerCase());
        })
        .slice(0, 5)
        .map((it) => ({
          id: itemId(it),
          en: itemTitle(it, "en"),
          typeId:
            it?.definition?.item?.baseParameters?.itemTypeId ??
            it?.definition?.itemTypeId ?? it?.itemTypeId ?? null,
        }));
      console.log(`"${probe}":`, JSON.stringify(hits));
    }
  }

  // Load states.json: the real effect text of a sublimation lives on the state
  // its equip effect applies (actionId 304, params[0] = stateId).
  console.log("Downloading states.json ...");
  let statesById = new Map();
  try {
    const statesRaw = await fetchJson(`${base}/states.json`);
    console.log(`  states: ${statesRaw.length} entries`);
    for (const s of statesRaw) {
      const id = s?.definition?.id ?? s?.id;
      if (id !== undefined && id !== null) statesById.set(id, s);
    }
  } catch (e) {
    console.log(`  states.json unavailable (${e.message.split("\n")[0]}) — falling back to curated descriptions`);
  }

  function stateDescription(stateIds, lang) {
    for (const sid of stateIds) {
      const st = statesById.get(sid);
      if (!st) continue;
      const d = pickText(st.description, lang) ?? pickText(st?.definition?.description, lang);
      if (d && d.trim()) return d;
    }
    return null;
  }

  // Index official sublimation items by tier-stripped normalized EN title:
  // non-epic scrolls exist as "Name I/II/III" (Rare/Mythic/Legendary variants).
  const byEnName = new Map();
  for (const it of itemsRaw) {
    const en = itemTitle(it, "en");
    if (!en) continue;
    const key = normName(stripTier(en));
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
    withOfficialDescription: 0,
    unmatched: [],
    partialPlaceholders: [],
  };

  // Curated names that differ from the official EN spelling.
  const NAME_ALIASES = new Map([
    ["Embellishement", "Embellishment"],
  ]);

  // Pick, for each curated sublimation, the official variant whose EN effect
  // text (from its state) is closest to the curated description at base values.
  const chosenByName = new Map();
  for (const sub of curated) {
    const lookupName = NAME_ALIASES.get(sub.name) ?? sub.name;
    const candidates = byEnName.get(normName(stripTier(lookupName))) ?? [];
    if (candidates.length === 0) {
      report.unmatched.push(sub.name);
      continue;
    }
    const target = normDesc(renderCuratedAtBase(sub));
    let best = candidates[0];
    let bestScore = -1;
    for (const c of candidates) {
      const d = stateDescription(itemStateIds(c), "en");
      const s = d ? similarity(target, normDesc(d)) : 0;
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
    chosenByName.set(sub.name, { item: best, score: bestScore });
    report.matched++;
    if (stateDescription(itemStateIds(best), "en")) report.withOfficialDescription++;
  }

  console.log(`Matched ${report.matched}/${curated.length} curated sublimations to official items`);
  console.log(`With official effect text: ${report.withOfficialDescription}/${report.matched}`);
  if (report.unmatched.length) {
    console.log("Unmatched:", report.unmatched.join(", "));
  }

  if (DEBUG) {
    console.log("=== DEBUG SAMPLES (name, score, stateIds, EN state desc) ===");
    const samples = [...chosenByName.entries()].slice(0, 6).map(([name, { item, score }]) => ({
      name,
      score,
      enTitle: itemTitle(item, "en"),
      frTitle: itemTitle(item, "fr"),
      stateIds: itemStateIds(item),
      enStateDesc: stateDescription(itemStateIds(item), "en"),
      frStateDesc: stateDescription(itemStateIds(item), "fr"),
      rawState: statesById.get(itemStateIds(item)[0]) ?? null,
    }));
    console.log(JSON.stringify(samples, null, 2).slice(0, 12000));
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
        if (locName) entry.name = stripTier(locName);

        // Only replace the curated description when the official state carries
        // real localized effect text — item descriptions are generic scroll blurbs.
        const locDesc = stateDescription(itemStateIds(chosen.item), lang);
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
