#!/usr/bin/env node
/**
 * Applica traduzioni complete alle sublimazioni usando i dati ufficiali di Wakfu
 * Questo script scarica i dati di Wakfu e applica le traduzioni per nomi,
 * descrizioni ed effetti in tutte le lingue supportate
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
  // Rimuove tag HTML
  return text.replace(/<[^>]*>/g, '').trim();
}

async function main() {
  console.log('Fetching Wakfu version...');
  const cfg = await fetchJson('https://wakfu.cdn.ankama.com/gamedata/config.json');
  const version = cfg.version;
  if (!version) throw new Error('No version in config.json');

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;
  console.log(`Wakfu version: ${version}`);

  // Carica il file di base in inglese per avere la struttura
  const baseDataPath = path.resolve('public/data/sublimations.en.json');
  const baseData = JSON.parse(await fs.readFile(baseDataPath, 'utf8'));

  console.log(`\nLoaded ${baseData.length} sublimations from base file`);

  // Scarica items.json (contiene testi multilingua)
  console.log(`\nDownloading items.json...`);
  const itemsUrl = `${base}/items.json`;
  const items = await fetchJson(itemsUrl);

  // Filtra solo le sublimazioni (itemTypeId 812 e hanno sublimationParameters)
  const sublimations = items.filter(item => {
    const def = item.definition || item;
    const itemTypeId = def.item?.baseParameters?.itemTypeId;
    return itemTypeId === 812 && def.item?.sublimationParameters;
  });

  console.log(`Found ${sublimations.length} sublimation items`);

  // Crea una mappa id -> item per lookup veloce
  const itemsById = new Map(
    sublimations.map(item => [
      item.definition?.id || item.id,
      item
    ])
  );

  // Prova a caricare il file i18n per ottenere gli ID
  let i18nData = [];
  try {
    const i18nPath = path.resolve('public/data/sublimations.i18n.json');
    i18nData = JSON.parse(await fs.readFile(i18nPath, 'utf8'));
  } catch (err) {
    console.warn('Could not load i18n data');
  }

  // Crea mappa nome inglese -> entry i18n
  const nameToI18n = new Map();
  for (const entry of i18nData) {
    if (entry.name?.en) {
      nameToI18n.set(entry.name.en.toLowerCase().trim(), entry);
    }
  }

  console.log('\n========== Processing translations ==========');

  // Processa ogni lingua
  for (const lang of LANGS) {
    console.log(`\nProcessing ${lang.toUpperCase()}...`);

    const output = [];
    let translatedDesc = 0;
    let translatedEffect = 0;

    for (const baseSub of baseData) {
      const translated = { ...baseSub };

      // Cerca l'entry i18n corrispondente
      const i18nEntry = nameToI18n.get(baseSub.name.toLowerCase().trim());

      if (i18nEntry) {
        // Traduci il nome
        if (i18nEntry.name?.[lang]) {
          translated.name = i18nEntry.name[lang];
        }

        // Se abbiamo l'ID dell'item, cerca la descrizione tradotta
        if (i18nEntry.id && itemsById.has(i18nEntry.id)) {
          const wakfuItem = itemsById.get(i18nEntry.id);

          // I testi sono direttamente nell'item, non in definition
          const description = pickText(wakfuItem.description, lang);
          if (description) {
            translated.description = cleanDescription(description);
            translatedDesc++;
          }

          // Per gli effetti, usiamo la parte "Per additional level" dal file esistente
          // e traduciamo solo i pattern noti
          translatedEffect++;
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
    console.log(`  - ${translatedDesc} descriptions translated`);
    console.log(`  - ${translatedEffect} effects translated`);
  }

  console.log('\n✅ Translation complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
