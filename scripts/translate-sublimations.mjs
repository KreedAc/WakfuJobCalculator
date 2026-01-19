#!/usr/bin/env node
/**
 * Script per tradurre le descrizioni delle sublimazioni nelle rispettive lingue
 * Usa le traduzioni già presenti nel file sublimations.i18n.json se disponibili,
 * altrimenti mantiene le stringhe in inglese come fallback
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const LANGS = ['en', 'fr', 'es', 'pt'];

// Traduzioni manuali per le categorie
const CATEGORY_TRANSLATIONS = {
  'Offensive': {
    en: 'Offensive',
    fr: 'Offensif',
    es: 'Ofensivo',
    pt: 'Ofensivo'
  },
  'Defensive': {
    en: 'Defensive',
    fr: 'Défensif',
    es: 'Defensivo',
    pt: 'Defensivo'
  },
  'Stats Increase': {
    en: 'Stats Increase',
    fr: 'Augmentation de Stats',
    es: 'Aumento de Estadísticas',
    pt: 'Aumento de Atributos'
  },
  'Summoning': {
    en: 'Summoning',
    fr: 'Invocation',
    es: 'Invocación',
    pt: 'Invocação'
  },
  'General': {
    en: 'General',
    fr: 'Général',
    es: 'General',
    pt: 'Geral'
  },
  'Supportive': {
    en: 'Supportive',
    fr: 'Soutien',
    es: 'Apoyo',
    pt: 'Suporte'
  }
};

// Traduzioni per termini comuni nelle descrizioni
const COMMON_TERMS = {
  'Critical Hit': {
    en: 'Critical Hit',
    fr: 'Coup Critique',
    es: 'Golpe Crítico',
    pt: 'Golpe Crítico'
  },
  'Damage Inflicted': {
    en: 'Damage Inflicted',
    fr: 'Dégâts infligés',
    es: 'Daño Infligido',
    pt: 'Dano Causado'
  },
  'Force of Will': {
    en: 'Force of Will',
    fr: 'Force de Volonté',
    es: 'Fuerza de Voluntad',
    pt: 'Força de Vontade'
  },
  'AP': {
    en: 'AP',
    fr: 'PA',
    es: 'PA',
    pt: 'PA'
  },
  'MP': {
    en: 'MP',
    fr: 'PM',
    es: 'PM',
    pt: 'PM'
  },
  'HP': {
    en: 'HP',
    fr: 'PV',
    es: 'PV',
    pt: 'PV'
  },
  'WP': {
    en: 'WP',
    fr: 'PW',
    es: 'PW',
    pt: 'PW'
  }
};

async function main() {
  console.log('Loading sublimations data...');

  // Carica il file i18n che contiene le traduzioni dei nomi
  const i18nPath = path.resolve('public/data/sublimations.i18n.json');
  let i18nData = [];
  try {
    i18nData = JSON.parse(await fs.readFile(i18nPath, 'utf8'));
  } catch (err) {
    console.warn('Could not load i18n data, will use English names as fallback');
  }

  // Crea una mappa per lookup veloce
  const i18nMap = new Map();
  for (const item of i18nData) {
    if (item.name && typeof item.name === 'object') {
      i18nMap.set(item.name.en, item);
    }
  }

  console.log(`Loaded ${i18nMap.size} sublimations with translations`);

  // Processa ogni lingua
  for (const lang of LANGS) {
    console.log(`\nProcessing ${lang.toUpperCase()}...`);

    const filePath = path.resolve(`public/data/sublimations.${lang}.json`);
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

    let translated = 0;

    for (const sublimation of data) {
      // Cerca la traduzione nel file i18n
      const i18nEntry = i18nMap.get(sublimation.name);

      if (i18nEntry && i18nEntry.name && i18nEntry.name[lang]) {
        // Applica il nome tradotto
        sublimation.name = i18nEntry.name[lang];
        translated++;
      }

      // Traduce la categoria se disponibile
      if (sublimation.category && CATEGORY_TRANSLATIONS[sublimation.category]) {
        sublimation.category = CATEGORY_TRANSLATIONS[sublimation.category][lang];
      }

      // Per ora manteniamo descrizioni ed effetti in inglese
      // In futuro si potrebbe integrare con le traduzioni dai file .jar
    }

    // Salva il file aggiornato
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Saved ${filePath} (${translated}/${data.length} names translated)`);
  }

  console.log('\n✅ Translation complete!');
  console.log('\nNote: Descriptions and effects are currently in English.');
  console.log('To translate them, you would need to extract them from Wakfu i18n_*.jar files.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
