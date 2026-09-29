#!/usr/bin/env node
// Compares the game data of the previous update with the freshly built one and
// records what changed in public/data/patch-diff.json (newest first, last 6
// updates), which feeds the "Game updates" page.
//
//   node scripts/build-patch-diff.mjs --prev <dir>
//
// <dir> holds the previous copies of items.compact.*.json, recipes.compact.json,
// sublimations.*.json (including sublimations.pending.json) and wakfu_version.json (the workflow copies
// them there before rebuilding). Nothing is written when the version is unchanged.
import fs from 'node:fs';
import path from 'node:path';

const DATA = path.resolve('public/data');
const OUT = path.join(DATA, 'patch-diff.json');
const LANGS = ['en', 'fr', 'es', 'pt'];
const KEEP = 6;

const prevIdx = process.argv.indexOf('--prev');
if (prevIdx < 0 || !process.argv[prevIdx + 1]) {
  console.error('usage: build-patch-diff.mjs --prev <dir>');
  process.exit(1);
}
const PREV = path.resolve(process.argv[prevIdx + 1]);

const read = (dir, file) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  } catch {
    return null;
  }
};

const prevVersion = read(PREV, 'wakfu_version.json');
const nextVersion = read(DATA, 'wakfu_version.json');
if (!prevVersion || !nextVersion) {
  console.log('patch-diff: missing version file, skipped');
  process.exit(0);
}
if (prevVersion.version === nextVersion.version) {
  console.log(`patch-diff: still ${nextVersion.version}, nothing to record`);
  process.exit(0);
}

// ─── items and recipes ───────────────────────────────────────────────────────
const prevItems = new Set((read(PREV, 'items.compact.en.json') ?? []).map((i) => i.id));
const nextItems = read(DATA, 'items.compact.en.json') ?? [];
const prevRecipes = read(PREV, 'recipes.compact.json') ?? [];
const nextRecipes = read(DATA, 'recipes.compact.json') ?? [];

const prevCraftable = new Set(prevRecipes.map((r) => r.resultItemId));
const newCraftable = [...new Set(nextRecipes.map((r) => r.resultItemId))]
  .filter((id) => !prevCraftable.has(id))
  .sort((a, b) => a - b);
const craftableSet = new Set(newCraftable);
const newItems = nextItems
  .map((i) => i.id)
  .filter((id) => !prevItems.has(id) && !craftableSet.has(id))
  .sort((a, b) => a - b);

// same recipe id, different ingredients: [itemId, oldQty, newQty] (0 = added/removed)
const prevById = new Map(prevRecipes.map((r) => [r.id, r]));
const changedRecipes = [];
for (const r of nextRecipes) {
  const old = prevById.get(r.id);
  if (!old || old.resultItemId !== r.resultItemId) continue;
  const before = new Map(old.ingredients.map((i) => [i.itemId, i.qty]));
  const after = new Map(r.ingredients.map((i) => [i.itemId, i.qty]));
  const changes = [];
  for (const id of new Set([...before.keys(), ...after.keys()])) {
    const a = before.get(id) ?? 0;
    const b = after.get(id) ?? 0;
    if (a !== b) changes.push([id, a, b]);
  }
  if (changes.length) changedRecipes.push({ item: r.resultItemId, changes });
}
changedRecipes.sort((a, b) => a.item - b.item);

// Name (per language), picture and rarity of every item the entry mentions, so
// the Game Updates page needs no other data. Ingredients removed from the game
// keep the details they had in the previous data.
const items = {};
const mentioned = new Set([
  ...newCraftable, ...newItems,
  ...changedRecipes.flatMap((c) => [c.item, ...c.changes.map(([id]) => id)]),
]);
for (const [dir, langs] of [[PREV, LANGS], [DATA, LANGS]]) {
  for (const l of langs) {
    for (const it of read(dir, `items.compact.${l}.json`) ?? []) {
      if (!mentioned.has(it.id)) continue;
      const info = (items[it.id] ??= { n: {} });
      info.n[l] = it.name;
      if (it.gfxId != null) info.g = it.gfxId;
      if (it.rarity != null) info.r = it.rarity;
    }
  }
}

// ─── sublimations (the localized files share the same order) ─────────────────
const prevSubli = new Set((read(PREV, 'sublimations.en.json') ?? []).map((s) => s.name));
const nextSubli = Object.fromEntries(LANGS.map((l) => [l, read(DATA, `sublimations.${l}.json`) ?? []]));
const newSublimations = [];
nextSubli.en.forEach((s, i) => {
  if (prevSubli.has(s.name)) return;
  newSublimations.push(Object.fromEntries(LANGS.map((l) => [l, nextSubli[l][i]?.name ?? s.name])));
});

// official sublimations the site doesn't describe yet (see build-sublimations-data.mjs);
// without a previous list there is no baseline, so nothing is reported
const prevPending = read(PREV, 'sublimations.pending.json');
const pendingSublimations = prevPending
  ? (read(DATA, 'sublimations.pending.json') ?? []).filter((p) => !prevPending.some((q) => q.en === p.en))
  : [];

const entry = {
  from: prevVersion.version,
  to: nextVersion.version,
  date: (nextVersion.generatedAt ?? new Date().toISOString()).slice(0, 10),
  newCraftable,
  newItems,
  changedRecipes,
  newSublimations,
  pendingSublimations,
  items,
};

const history = (read(DATA, 'patch-diff.json')?.patches ?? []).filter((p) => p.to !== entry.to);
const patches = [entry, ...history].slice(0, KEEP);
fs.writeFileSync(OUT, `${JSON.stringify({ patches })}\n`);
console.log(
  `patch-diff: ${entry.from} → ${entry.to}: ${newCraftable.length} new craftable items, ` +
  `${newItems.length} other new items, ${changedRecipes.length} changed recipes, ` +
  `${newSublimations.length} new sublimations, ${pendingSublimations.length} not described yet`,
);
