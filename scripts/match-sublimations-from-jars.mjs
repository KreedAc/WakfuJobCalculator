#!/usr/bin/env node
/**
 * Estrae le traduzioni delle Sublimations dai file i18n_*.jar di Wakfu e
 * aggiorna i file:
 *   - public/data/sublimations.en.json
 *   - public/data/sublimations.fr.json
 *   - public/data/sublimations.es.json
 *   - public/data/sublimations.pt.json
 *
 * Uso (da root progetto):
 *   node scripts/match-sublimations-from-jars.mjs --jars /percorso/ai/jar
 *
 * Il percorso deve contenere: i18n_en.jar, i18n_fr.jar, i18n_es.jar, i18n_pt.jar
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const jarsDir = path.resolve(getArg('--jars', '.'));

const LANGS = ['en', 'fr', 'es', 'pt'];
const JAR_NAMES = Object.fromEntries(LANGS.map(l => [l, `i18n_${l}.jar`]));

function norm(s){
  return String(s??'')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu,'')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

function decodeJavaEscapes(str){
  return str
    .replace(/\\u([0-9a-fA-F]{4})/g, (_,h)=>String.fromCharCode(parseInt(h,16)))
    .replace(/\\t/g,'\t')
    .replace(/\\r/g,'\r')
    .replace(/\\n/g,'\n')
    .replace(/\\f/g,'\f')
    .replace(/\\\\/g,'\\');
}

async function readProperties(filePath){
  const raw = await fs.readFile(filePath,'utf8');
  const lines = raw.split(/\r?\n/);
  const map = new Map();
  let cur = '';
  for (let line of lines){
    if (!line) continue;
    if (line.startsWith('#') || line.startsWith('!')) continue;
    // gestione continuazioni con backslash finale
    if (line.endsWith('\\')) {
      cur += line.slice(0,-1);
      continue;
    }
    line = cur + line;
    cur = '';

    let sep = -1;
    for (let i=0;i<line.length;i++){
      const ch=line[i];
      if ((ch==='=' || ch===':') && line[i-1] !== '\\') { sep=i; break; }
    }
    if (sep === -1) continue;

    const key = line.slice(0,sep).trim();
    const val = decodeJavaEscapes(line.slice(sep+1).trim());
    if (key) map.set(key, val);
  }
  return map;
}

function chooseBestKey(keys){
  const pref = ['content.8.', 'content.15.', 'content.13.'];
  for (const p of pref){
    const k = keys.find(x=>x.startsWith(p));
    if (k) return k;
  }
  return keys[0];
}

function stripLevelSuffix(str){
  return String(str).replace(/\s+(I{1,3}|IV|V|VI|VII|VIII|IX|X)$/i,'').trim();
}

async function main(){
  // 1) estrazione jar in temp
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wakfu-i18n-'));
  const extracted = {};

  for (const lang of LANGS){
    const jarPath = path.join(jarsDir, JAR_NAMES[lang]);
    if (!existsSync(jarPath)) {
      throw new Error(`Manca ${jarPath}`);
    }
    const outDir = path.join(tmpDir, lang);
    await fs.mkdir(outDir, { recursive: true });
    // jar = zip: usiamo unzip se disponibile
    try {
      execFileSync('unzip', ['-q', jarPath, '-d', outDir], { stdio: 'ignore' });
    } catch (e){
      throw new Error(`Non riesco a usare 'unzip' per estrarre ${jarPath}. Assicurati di avere unzip installato.`);
    }
    const prop = path.join(outDir, `texts_${lang}.properties`);
    if (!existsSync(prop)) throw new Error(`Non trovo ${prop} dopo l'estrazione.`);
    extracted[lang] = prop;
  }

  // 2) leggo properties
  const dict = {};
  for (const lang of LANGS){
    dict[lang] = await readProperties(extracted[lang]);
  }

  // 3) indice reverse (EN)
  const reverse = new Map();
  for (const [k,v] of dict.en.entries()){
    const n = norm(v);
    if (!n) continue;
    const arr = reverse.get(n) || [];
    arr.push(k);
    reverse.set(n, arr);
  }

  // 4) leggo lista sublimations (EN nel tuo file base)
  const basePath = path.resolve('public/sublimations.json');
  const base = JSON.parse(await fs.readFile(basePath,'utf8'));

  // alias per casi noti (typo o naming diverso in client)
  const alias = new Map([
    ['embellishement','embellishment'],
    ['slow evasion','slow escape'],
  ]);

  const perLang = Object.fromEntries(LANGS.map(l=>[l, []]));
  const report = { matched: 0, total: base.length, unmatched: [], ambiguous: {} };

  for (const s of base){
    const nameEn = String(s.name ?? '');
    let n = norm(nameEn);
    if (alias.has(n)) n = alias.get(n);

    let keys = reverse.get(n);
    let stripLevel = false;

    // fallback: prova con " I" (utile per Nature/Poisoned Weapon ecc.)
    if (!keys || keys.length === 0){
      const keysI = reverse.get(norm(`${nameEn} I`));
      if (keysI?.length){
        keys = keysI;
        stripLevel = true;
      }
    }

    if (!keys || keys.length === 0){
      report.unmatched.push(nameEn);
      for (const lang of LANGS) perLang[lang].push({ ...s });
      continue;
    }

    if (keys.length > 1) report.ambiguous[nameEn] = keys;

    const bestKey = chooseBestKey(keys);

    for (const lang of LANGS){
      const translated = dict[lang].get(bestKey) ?? nameEn;
      const nameOut = stripLevel ? stripLevelSuffix(translated) : translated;
      perLang[lang].push({ ...s, name: nameOut });
    }
    report.matched++;
  }

  // 5) scrivo output
  await fs.mkdir('public/data', { recursive: true });
  for (const lang of LANGS){
    await fs.writeFile(`public/data/sublimations.${lang}.json`, JSON.stringify(perLang[lang], null, 2), 'utf8');
  }
  await fs.writeFile('public/data/sublimations.i18n.report.json', JSON.stringify(report, null, 2), 'utf8');

  console.log(`OK: ${report.matched}/${report.total} match (unmatched: ${report.unmatched.length})`);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
