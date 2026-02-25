import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const EXPORT_PATH = path.join(ROOT, 'data', 'treasures', 'treasures.export.json');
const OUT_PATH = path.join(ROOT, 'public', 'data', 'treasures.json');

function ensureArray(input) {
  if (Array.isArray(input)) return input;
  if (input && Array.isArray(input.treasures)) return input.treasures;
  return [];
}

function normalizeEntry(raw) {
  const achievement = String(raw.achievement ?? '').trim();
  const zone = String(raw.zone ?? '').trim();
  const coords = raw.coords && typeof raw.coords === 'object'
    ? { x: Number(raw.coords.x), y: Number(raw.coords.y) }
    : null;

  const artifacts = Array.isArray(raw.artifacts)
    ? raw.artifacts.map(a => String(a).trim()).filter(Boolean)
    : [];

  const rewards = String(raw.rewards ?? '').trim();

  if (!achievement || !zone || !coords || Number.isNaN(coords.x) || Number.isNaN(coords.y)) {
    return null;
  }

  return { achievement, zone, coords, artifacts, rewards };
}

async function main() {
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });

  let raw;
  try {
    raw = JSON.parse(await fs.readFile(EXPORT_PATH, 'utf-8'));
  } catch (err) {
    console.error(`ERROR: Could not read export file: ${EXPORT_PATH}`);
    console.error(err);
    process.exit(1);
  }

  const arr = ensureArray(raw);
  const out = [];
  for (const e of arr) {
    const norm = normalizeEntry(e);
    if (norm) out.push(norm);
  }

  await fs.writeFile(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');

  console.log('Building treasures dataset…');
  console.log(`Source: ${EXPORT_PATH}`);
  console.log(`Output: ${OUT_PATH}`);
  console.log(`Wrote ${out.length} treasures.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
