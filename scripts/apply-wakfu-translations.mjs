#!/usr/bin/env node
/**
 * Applica traduzioni complete alle sublimazioni usando i dati ufficiali di Wakfu
 * Usa il matching basato sui nomi per trovare le corrispondenze
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const LANGS = ['en', 'fr', 'es', 'pt'];

// Traduzioni per le categorie
const CATEGORY_TRANSLATIONS = {
  'Offensive': { en: 'Offensive', fr: 'Offensif', es: 'Ofensivo', pt: 'Ofensivo' },
  'Defensive': { en: 'Defensive', fr: 'Défensif', es: 'Defensivo', pt: 'Defensivo' },
  'Stats Increase': { en: 'Stats Increase', fr: 'Augmentation de Stats', es: 'Aumento de Estadísticas', pt: 'Aumento de Atributos' },
  'Summoning': { en: 'Summoning', fr: 'Invocation', es: 'Invocación', pt: 'Invocação' },
  'General': { en: 'General', fr: 'Général', es: 'General', pt: 'Geral' },
  'Supportive': { en: 'Supportive', fr: 'Soutien', es: 'Apoyo', pt: 'Suporte' }
};

// Traduzioni per "Per additional level" e varianti
const EFFECT_PATTERNS = {
  'Per additional level': {
    en: 'Per additional level',
    fr: 'Par niveau supplémentaire',
    es: 'Por nivel adicional',
    pt: 'Por nível adicional'
  },
  'Per additional 2 levels': {
    en: 'Per additional 2 levels',
    fr: 'Tous les 2 niveaux supplémentaires',
    es: 'Por cada 2 niveles adicionales',
    pt: 'A cada 2 níveis adicionais'
  }
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function pickText(value, lang) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] || value.en || value.fr || value.es || value.pt || null;
  }
  return null;
}

function cleanDescription(text) {
  if (!text) return '';
  // Rimuove tag HTML e <br/>
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

async function main() {
  console.log('Fetching Wakfu version...');
  const cfg = await fetchJson('https://wakfu.cdn.ankama.com/gamedata/config.json');
  const version = cfg.version;
  if (!version) throw new Error('No version in config.json');

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;
  console.log(`Wakfu version: ${version}`);

  // Carica il file di base in inglese
  const baseDataPath = path.resolve('public/data/sublimations.en.json');
  const baseData = JSON.parse(await fs.readFile(baseDataPath, 'utf8'));
  console.log(`\nLoaded ${baseData.length} sublimations from base file`);

  // Scarica items.json
  console.log(`\nDownloading items.json...`);
  const itemsUrl = `${base}/items.json`;
  const items = await fetchJson(itemsUrl);

  // Filtra solo le sublimazioni (itemTypeId 812)
  const sublimations = items.filter(item => {
    const def = item.definition || item;
    const itemTypeId = def.item?.baseParameters?.itemTypeId;
    return itemTypeId === 812 && def.item?.sublimationParameters;
  });

  console.log(`Found ${sublimations.length} sublimation items from Wakfu`);

  // Crea mappa per lookup veloce usando sempre il nome inglese come chiave
  const sublimationsByEnName = new Map();

  for (const item of sublimations) {
    const titleObj = item.title;
    if (!titleObj) continue;

    const enTitle = pickText(titleObj, 'en');
    if (!enTitle) continue;

    // Rimuovi numeri romani dal nome (es. "Influence II" -> "Influence")
    const cleanName = enTitle.replace(/\s+(I{1,3}|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
    const normalizedName = normalize(cleanName);

    sublimationsByEnName.set(normalizedName, item);
  }

  console.log(`Indexed ${sublimationsByEnName.size} unique sublimations`);


  console.log('\n========== Processing translations ==========');

  // Processa ogni lingua
  for (const lang of LANGS) {
    console.log(`\nProcessing ${lang.toUpperCase()}...`);

    const output = [];
    let translatedName = 0;
    let translatedDesc = 0;

    for (const baseSub of baseData) {
      const translated = { ...baseSub };

      // Cerca l'item corrispondente basandosi sul nome inglese
      const normalizedBaseName = normalize(baseSub.name);
      const wakfuItem = sublimationsByEnName.get(normalizedBaseName);

      if (wakfuItem) {
        // Traduci il nome
        const title = pickText(wakfuItem.title, lang);
        if (title) {
          // Rimuovi numeri romani
          translated.name = title.replace(/\s+(I{1,3}|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
          translatedName++;
        }

        // Traduci la descrizione
        const description = pickText(wakfuItem.description, lang);
        if (description) {
          translated.description = cleanDescription(description);
          translatedDesc++;
        }
      }

      // Traduci la categoria
      if (translated.category && CATEGORY_TRANSLATIONS[translated.category]) {
        translated.category = CATEGORY_TRANSLATIONS[translated.category][lang];
      }

      // Traduci i pattern comuni negli effetti
      if (translated.effect) {
        for (const [pattern, translations] of Object.entries(EFFECT_PATTERNS)) {
          if (translated.effect.includes(pattern)) {
            translated.effect = translated.effect.replace(pattern, translations[lang]);
          }
        }
      }

      output.push(translated);
    }

    // Salva il file tradotto
    const outputPath = path.resolve(`public/data/sublimations.${lang}.json`);
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8');

    console.log(`✓ Saved ${outputPath}`);
    console.log(`  - ${output.length} sublimations`);
    console.log(`  - ${translatedName} names translated`);
    console.log(`  - ${translatedDesc} descriptions translated`);
  }

  console.log('\n✅ Translation complete!');
  console.log('\nNote: Effect descriptions are partially translated.');
  console.log('Complex effects may still contain English text.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
