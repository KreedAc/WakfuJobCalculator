import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'public', 'data');
const EXPORT_PATH = path.join(ROOT, 'public', 'data', 'treasures.json'); // runtime dataset
const OVERRIDES_PATH = path.join(ROOT, 'data', 'treasures', 'overrides.json');

function exists(p) {
  try { return fssync.existsSync(p); } catch { return false; }
}

function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeText(s) {
  const base = stripDiacritics(String(s ?? '').trim().toLowerCase());
  // replace punctuation with spaces, collapse
  return base
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a, b) {
  // quick similarity heuristic: Jaccard over character bigrams
  const A = new Set();
  for (let i = 0; i < a.length - 1; i++) A.add(a.slice(i, i + 2));
  const B = new Set();
  for (let i = 0; i < b.length - 1; i++) B.add(b.slice(i, i + 2));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

async function loadJson(p) {
  return JSON.parse(await fs.readFile(p, 'utf-8'));
}

function splitZone(term) {
  const t = String(term ?? '').trim();
  const m = t.match(/^(.*?)(\s*-\s*)?\(enter\s+([^)]+)\)\s*$/i);
  if (!m) return null;
  const base = m[1].trim();
  const hadDash = Boolean(m[2]);
  const inside = m[3].trim();
  return { base, inside, hadDash };
}

function splitDash(term) {
  const t = String(term ?? '').trim();
  const m = t.match(/^(.+?)\s+-\s+(.+)$/);
  if (!m) return null;
  return { left: m[1].trim(), right: m[2].trim() };
}

function formatDash(left, right) {
  return `${left} - ${right}`;
}

function formatZone(base, inside, lang, hadDash) {
  const enterWords = { en: 'enter', fr: 'entrer', es: 'entrar', pt: 'entrar' };
  const enter = enterWords[lang] ?? 'enter';
  return hadDash
    ? `${base} - (${enter} ${inside})`
    : `${base} (${enter} ${inside})`;
}

async function main() {
  const langs = ['en', 'fr', 'es', 'pt'];
  const texts = {};

  for (const lang of langs) {
    const p = path.join(DATA_DIR, `wakfu-texts.${lang}.json`);
    if (!exists(p)) {
      console.error(`ERROR: Missing ${p}`);
      console.error('Run: npm run fetch:i18n:client');
      process.exit(1);
    }
    texts[lang] = await loadJson(p);
  }

  if (!exists(EXPORT_PATH)) {
    console.error(`ERROR: Missing ${EXPORT_PATH}`);
    console.error('Run: npm run fetch:treasures');
    process.exit(1);
  }

  const dataset = await loadJson(EXPORT_PATH);

  const overrides = exists(OVERRIDES_PATH) ? await loadJson(OVERRIDES_PATH) : { terms: {}, aliases: {} };
  const termToId = overrides.terms || {};
  const aliases = overrides.aliases || {};

  // Build reverse index from EN text -> IDs
  const en = texts.en;
  const index = new Map(); // normText -> [id...]
  const normToOneExample = new Map(); // normText -> example en string
  for (const [id, value] of Object.entries(en)) {
    const norm = normalizeText(value);
    if (!norm) continue;
    if (!index.has(norm)) index.set(norm, []);
    index.get(norm).push(id);
    if (!normToOneExample.has(norm)) normToOneExample.set(norm, value);
  }

  function lookupCandidates(term) {
    const norm = normalizeText(term);
    if (!norm) return [];
    const direct = index.get(norm) || [];
    if (direct.length) return direct;

    // token-based partial search for suggestions (limited)
    const suggestions = [];
    for (const [kNorm, ids] of index.entries()) {
      if (kNorm.includes(norm) || norm.includes(kNorm)) {
        suggestions.push({ id: ids[0], norm: kNorm, en: normToOneExample.get(kNorm) || '' , score: similarity(norm, kNorm) });
      }
    }
    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, 25).map(s => s.id);
  }

  function pickId(term) {
    const aliased = aliases[term] ? aliases[term] : term;
    if (termToId[term]) return { id: termToId[term], term: term };
    if (termToId[aliased]) return { id: termToId[aliased], term: aliased };

    const candidates = lookupCandidates(aliased);
    if (candidates.length === 1) return { id: candidates[0], term: aliased };
    if (candidates.length > 1) return { candidates, term: aliased };
    return { term: aliased };
  }

  function getTranslationsForId(id) {
    return {
      en: texts.en[id] ?? '',
      fr: texts.fr[id] ?? '',
      es: texts.es[id] ?? '',
      pt: texts.pt[id] ?? '',
    };
  }

  // Many Wakfu i18n keys exist in multiple contexts (same EN label repeated).
  // If ALL candidate IDs produce identical translations across langs, we can
  // safely auto-pick one and treat it as resolved.
  function resolveAmbiguousPick(pick) {
    if (!pick || pick.id || !pick.candidates || pick.candidates.length === 0) return pick;

    const candidates = [...pick.candidates].sort();
    const first = candidates[0];
    const base = getTranslationsForId(first);

    // If even the base has no EN, don't auto resolve.
    if (!base.en) return pick;

    for (const id of candidates.slice(1)) {
      const tr = getTranslationsForId(id);
      if (
        tr.en !== base.en ||
        tr.fr !== base.fr ||
        tr.es !== base.es ||
        tr.pt !== base.pt
      ) {
        return pick; // truly ambiguous
      }
    }

    return { id: first, term: pick.term, auto: true };
  }

  const locationTerms = new Set();
  const artifactTerms = new Set();
  const achievementTerms = new Set();

  for (const t of dataset) {
    if (t.zone) locationTerms.add(t.zone);
    if (t.achievement) achievementTerms.add(t.achievement);
    for (const a of (t.artifacts || [])) artifactTerms.add(a);
  }

  const i18n = {
    _meta: { generatedAt: new Date().toISOString(), source: 'wakfu client i18n jars' },
    locations: {},
    artifacts: {},
    achievements: {},
  };

  const reportBlocks = [];

  function suggest(term, limit = 8) {
    const norm = normalizeText(term);
    if (!norm) return [];
    const suggestions = [];
    for (const [kNorm, ids] of index.entries()) {
      const score = similarity(norm, kNorm);
      if (score < 0.55) continue;
      suggestions.push({ id: ids[0], en: normToOneExample.get(kNorm) || '', score: Number(score.toFixed(4)) });
    }
    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, limit);
  }

  async function translateBlock(kind, terms, outObj) {
    const missing = [];
    const ambiguous = [];
    let translated = 0;

    for (const originalTerm of Array.from(terms).sort((a, b) => String(a).localeCompare(String(b)))) {
      if (!originalTerm) continue;

      // Special case: compound zones like "... (enter ...)"
      if (kind === 'locations') {
        const split = splitZone(originalTerm);
        if (split) {
          const basePick = resolveAmbiguousPick(pickId(split.base));
          const insidePick = resolveAmbiguousPick(pickId(split.inside));

          const baseOk = Boolean(basePick.id);
          const insideOk = Boolean(insidePick.id);

          const baseTr = baseOk ? getTranslationsForId(basePick.id) : { en: split.base, fr: split.base, es: split.base, pt: split.base };
          const insideTr = insideOk ? getTranslationsForId(insidePick.id) : { en: split.inside, fr: split.inside, es: split.inside, pt: split.inside };

          outObj[originalTerm] = {
            en: formatZone(baseTr.en || split.base, insideTr.en || split.inside, 'en', split.hadDash),
            fr: formatZone(baseTr.fr || split.base, insideTr.fr || split.inside, 'fr', split.hadDash),
            es: formatZone(baseTr.es || split.base, insideTr.es || split.inside, 'es', split.hadDash),
            pt: formatZone(baseTr.pt || split.base, insideTr.pt || split.inside, 'pt', split.hadDash),
          };

          // if any part missing/ambiguous, report it
          if (!baseOk || !insideOk) {
            const parts = [];
            if (!baseOk) parts.push({ part: split.base, candidates: basePick.candidates ? basePick.candidates.slice(0, 10).map(id => ({ id, ...getTranslationsForId(id) })) : undefined, suggestions: !basePick.candidates ? suggest(split.base) : undefined });
            if (!insideOk) parts.push({ part: split.inside, candidates: insidePick.candidates ? insidePick.candidates.slice(0, 10).map(id => ({ id, ...getTranslationsForId(id) })) : undefined, suggestions: !insidePick.candidates ? suggest(split.inside) : undefined });
            if (basePick.candidates || insidePick.candidates) ambiguous.push({ term: originalTerm, parts });
            else missing.push({ term: originalTerm, parts });
          } else {
            translated++;
          }
          continue;
        }

        // Common wiki/export format: "Region - Subzone". Translate parts separately.
        const dash = splitDash(originalTerm);
        if (dash) {
          const leftPick = resolveAmbiguousPick(pickId(dash.left));
          const rightPick = resolveAmbiguousPick(pickId(dash.right));

          const leftOk = Boolean(leftPick.id);
          const rightOk = Boolean(rightPick.id);

          const leftTr = leftOk ? getTranslationsForId(leftPick.id) : { en: dash.left, fr: dash.left, es: dash.left, pt: dash.left };
          const rightTr = rightOk ? getTranslationsForId(rightPick.id) : { en: dash.right, fr: dash.right, es: dash.right, pt: dash.right };

          outObj[originalTerm] = {
            en: formatDash(leftTr.en || dash.left, rightTr.en || dash.right),
            fr: formatDash(leftTr.fr || dash.left, rightTr.fr || dash.right),
            es: formatDash(leftTr.es || dash.left, rightTr.es || dash.right),
            pt: formatDash(leftTr.pt || dash.left, rightTr.pt || dash.right),
          };

          if (!leftOk || !rightOk) {
            const parts = [];
            if (!leftOk) parts.push({ part: dash.left, candidates: leftPick.candidates ? leftPick.candidates.slice(0, 10).map(id => ({ id, ...getTranslationsForId(id) })) : undefined, suggestions: !leftPick.candidates ? suggest(dash.left) : undefined });
            if (!rightOk) parts.push({ part: dash.right, candidates: rightPick.candidates ? rightPick.candidates.slice(0, 10).map(id => ({ id, ...getTranslationsForId(id) })) : undefined, suggestions: !rightPick.candidates ? suggest(dash.right) : undefined });
            if (leftPick.candidates || rightPick.candidates) ambiguous.push({ term: originalTerm, parts });
            else missing.push({ term: originalTerm, parts });
          } else {
            translated++;
          }
          continue;
        }

      }

      const picked = resolveAmbiguousPick(pickId(originalTerm));

      if (picked.id) {
        const tr = getTranslationsForId(picked.id);
        if (!tr.en) {
          missing.push({ term: originalTerm, suggestions: [] });
          continue;
        }
        outObj[originalTerm] = tr;
        translated++;
        continue;
      }

      if (picked.candidates) {
        const candidates = picked.candidates.slice(0, 10).map(id => ({ id, ...getTranslationsForId(id) }));
        ambiguous.push({ term: originalTerm, candidates });
        continue;
      }

      // missing: provide a few suggestions
      missing.push({ term: originalTerm, suggestions: suggest(picked.term) });
    }

    reportBlocks.push({ kind, translated, missing, ambiguous });
  }

  await translateBlock('locations', locationTerms, i18n.locations);
  await translateBlock('artifacts', artifactTerms, i18n.artifacts);
  await translateBlock('achievements', achievementTerms, i18n.achievements);

  const outI18n = path.join(DATA_DIR, 'treasures.i18n.json');
  const outReport = path.join(DATA_DIR, 'treasures.i18n.report.json');

  await fs.writeFile(outI18n, JSON.stringify(i18n, null, 2), 'utf-8');
  await fs.writeFile(outReport, JSON.stringify({ _meta: i18n._meta, blocks: reportBlocks }, null, 2), 'utf-8');

  const locBlock = reportBlocks.find(b => b.kind === 'locations');
  const artBlock = reportBlocks.find(b => b.kind === 'artifacts');
  const achBlock = reportBlocks.find(b => b.kind === 'achievements');

  console.log(`Wrote → ${outI18n}`);
  console.log(`Report → ${outReport}`);
  console.log(`- locations: ${locBlock?.translated ?? 0} translated`);
  if (locBlock?.missing?.length) console.log(`  missing: ${locBlock.missing.length}`);
  if (locBlock?.ambiguous?.length) console.log(`  ambiguous: ${locBlock.ambiguous.length}`);
  console.log(`- artifacts: ${artBlock?.translated ?? 0} translated`);
  if (artBlock?.missing?.length) console.log(`  missing: ${artBlock.missing.length}`);
  if (artBlock?.ambiguous?.length) console.log(`  ambiguous: ${artBlock.ambiguous.length}`);
  console.log(`- achievements: ${achBlock?.translated ?? 0} translated`);
  if (achBlock?.missing?.length) console.log(`  missing: ${achBlock.missing.length}`);
  if (achBlock?.ambiguous?.length) console.log(`  ambiguous: ${achBlock.ambiguous.length}`);

  if (
    (locBlock?.missing?.length || 0) + (locBlock?.ambiguous?.length || 0) +
    (artBlock?.missing?.length || 0) + (artBlock?.ambiguous?.length || 0) +
    (achBlock?.missing?.length || 0) + (achBlock?.ambiguous?.length || 0)
    > 0
  ) {
    console.log('\nTip: Open public/data/treasures.i18n.report.json to see missing/ambiguous terms.');
    console.log('If a term is ambiguous, pick the right ID and put it in data/treasures/overrides.json');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
