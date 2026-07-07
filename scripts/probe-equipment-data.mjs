// scripts/probe-equipment-data.mjs
//
// One-shot diagnostic for the equipment builder pipeline: dumps from the
// official Ankama CDN everything needed to design equipment.compact —
// the actionId → stat mapping and the itemTypeId → equipment slot mapping.
// Runs in GitHub Actions (the CDN is unreachable from the dev sandbox).

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function pick(v, lang = "en") {
  if (!v) return null;
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? v.fr ?? Object.values(v)[0] ?? null;
}

const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
const base = `https://wakfu.cdn.ankama.com/gamedata/${cfg.version}`;
console.log("Wakfu version:", cfg.version);

// ── 1. actions.json: actionId → stat meaning ────────────────────────────────
console.log("\n=== ACTIONS (id | effect | description.en) ===");
const actions = await fetchJson(`${base}/actions.json`);
console.log(`total actions: ${actions.length}`);
for (const a of actions) {
  const def = a.definition ?? a;
  const desc = pick(a.description) ?? "";
  const effect = def.effect ?? "";
  console.log(`${def.id}\t${effect}\t${desc.replace(/\n/g, " ").slice(0, 90)}`);
}

// ── 2. equipmentItemTypes.json: itemTypeId → slot positions ─────────────────
console.log("\n=== EQUIPMENT ITEM TYPES (id | title.en | positions | disabled) ===");
const types = await fetchJson(`${base}/equipmentItemTypes.json`);
console.log(`total types: ${types.length}`);
for (const t of types) {
  const def = t.definition ?? t;
  console.log(
    `${def.id}\t${pick(t.title) ?? "?"}\tpos=${JSON.stringify(def.equipmentPositions ?? [])}\tdis=${JSON.stringify(def.equipmentDisabledPositions ?? [])}`
  );
}

// ── 3. items.json: which actionIds does equipment actually use? ─────────────
console.log("\n=== EQUIP EFFECT USAGE (actionId → count across all items) ===");
const items = await fetchJson(`${base}/items.json`);
const usage = new Map();
const paramLens = new Map();
for (const it of items) {
  for (const e of it?.definition?.equipEffects ?? []) {
    const d = e?.effect?.definition;
    if (!d) continue;
    usage.set(d.actionId, (usage.get(d.actionId) ?? 0) + 1);
    const key = `${d.actionId}:${(d.params ?? []).length}`;
    paramLens.set(key, (paramLens.get(key) ?? 0) + 1);
  }
}
console.log([...usage.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => `action ${id}: ${n}`).join("\n"));
console.log("\n=== PARAM LENGTHS (actionId:paramCount → occurrences) ===");
console.log([...paramLens.entries()].sort().join("\n"));

// ── 4. Sample items: one per common equipment type, with full effects ───────
console.log("\n=== SAMPLE HIGH-LEVEL ITEMS (one per typeId, lvl>=200) ===");
const seen = new Set();
for (const it of items) {
  const d = it?.definition?.item;
  if (!d || d.level < 200) continue;
  const tid = d.baseParameters?.itemTypeId;
  if (seen.has(tid) || seen.size >= 12) continue;
  seen.add(tid);
  console.log(`--- type ${tid} | lvl ${d.level} | ${pick(it.title)} (id ${d.id}, rarity ${d.baseParameters?.rarity})`);
  for (const e of it.definition.equipEffects ?? []) {
    const ed = e?.effect?.definition;
    console.log(`    action ${ed?.actionId} params=${JSON.stringify(ed?.params)}`);
  }
}
console.log("\n✅ PROBE DONE");
