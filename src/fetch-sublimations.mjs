// fetch-sublimations-custom.mjs
// Script personalizzato per la struttura specifica del tuo JSON

import fs from 'fs/promises';
import path from 'path';

const CDN_BASE = 'https://wakfu.cdn.ankama.com/gamedata';
const LANGUAGES = ['en', 'fr', 'es', 'pt'];
const OUTPUT_DIR = './public/data';

// Mappa colori châsse dal CDN alla tua notazione
const COLOR_MAP = {
  1: 'W',  // White
  2: 'G',  // Green
  3: 'B',  // Blue
  4: 'R',  // Red
  5: 'K'   // blacK
};

// Mappa rarità
const RARITY_MAP = {
  1: 'Common',
  2: 'Rare',
  3: 'Mythic',
  4: 'Legendary',
  5: 'Epic',
  6: 'Relic'
};

// Mappa categorie basata sui tuoi dati
const CATEGORY_MAP = {
  damage: 'Offensive',
  support: 'Support',
  defense: 'Defensive',
  mobility: 'Stats Increase',
  control: 'Utility',
  general: 'Utility'
};

// Mappa obtenation dai tuoi dati
const OBTENATION_MAP = {
  'runic-mimic': { name: 'Runic Mimic', localIcon: '/icons/runic.png' },
  'rift': { name: 'Tainela Rift', localIcon: '/icons/rift.png' },
  'rift-ulti': { name: 'Frigost Rift', localIcon: '/icons/rift_ulti.png' },
  'dungeon': { name: 'Dungeon', localIcon: '/icons/dungeon.png' },
  'ultimate-boss': { name: 'Ultimate Boss', localIcon: '/icons/ub.png' },
  'stasis': { name: 'Stasis Dungeon', localIcon: '/icons/stasis.png' },
  'epic-stone': { name: 'Adventure Stone', localIcon: '/icons/4_rooms.png' },
  'relic-stone': { name: 'Ultimate Stone', localIcon: '/icons/ub.png' }
};

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

async function getCurrentVersion() {
  const config = await fetchJSON(`${CDN_BASE}/config.json`);
  return config.version;
}

function determineCategory(equipEffects, actions) {
  if (!equipEffects || equipEffects.length === 0) return 'Utility';
  
  const actionId = equipEffects[0]?.effect?.definition?.actionId;
  if (!actionId) return 'Utility';
  
  const action = actions.find(a => a.definition.id === actionId);
  if (!action?.definition?.effect) return 'Utility';
  
  const effect = action.definition.effect.toLowerCase();
  
  if (effect.includes('damage') || effect.includes('mastery') || effect.includes('critical')) {
    return 'Offensive';
  }
  if (effect.includes('hp') || effect.includes('heal') || effect.includes('barrier')) {
    return 'Support';
  }
  if (effect.includes('resist') || effect.includes('armor') || effect.includes('block')) {
    return 'Defensive';
  }
  if (effect.includes('ap') || effect.includes('mp') || effect.includes('wp') || effect.includes('range')) {
    return 'Stats Increase';
  }
  
  return 'Utility';
}

function determineObtenation(level, isRelic, isEpic) {
  if (isRelic) return { name: 'Ultimate Stone', localIcon: '/icons/ub.png' };
  if (isEpic) return { name: 'Adventure Stone', localIcon: '/icons/4_rooms.png' };
  if (level >= 215) return { name: 'Ultimate Boss', localIcon: '/icons/ub.png' };
  if (level >= 200) return { name: 'Frigost Rift', localIcon: '/icons/rift_ulti.png' };
  if (level >= 170) return { name: 'Tainela Rift', localIcon: '/icons/rift.png' };
  if (level >= 100) return { name: 'Dungeon', localIcon: '/icons/dungeon.png' };
  return { name: 'Runic Mimic', localIcon: '/icons/runic.png' };
}

function determineRarity(rarityId, isEpic, isRelic) {
  if (isRelic) return ['Relic'];
  if (isEpic) return ['Epic'];
  
  // Basato sui tuoi dati: molte sublimazioni hanno ["Rare", "Mythic", "Legendary"]
  if (rarityId >= 3) return ['Rare', 'Mythic', 'Legendary'];
  if (rarityId === 2) return ['Rare', 'Mythic'];
  return ['Rare'];
}

function extractValues(equipEffects, maxLevel) {
  // Estrai i valori base e incremento dai tuoi dati
  // Questa è una semplificazione - dovresti adattarla ai tuoi dati reali
  
  if (!equipEffects || equipEffects.length === 0) {
    return [{ base: null, increment: null }];
  }
  
  const values = [];
  const firstEffect = equipEffects[0];
  const params = firstEffect?.effect?.definition?.params || [];
  
  // Estrai i placeholder dalle descrizioni (X, Y, etc.)
  const placeholders = ['X', 'Y', 'Z'];
  
  for (let i = 0; i < Math.max(params.length, 2); i++) {
    if (i < params.length && params[i]) {
      values.push({
        base: params[i],
        increment: Math.floor(params[i] / (maxLevel || 1)),
        placeholder: placeholders[i]
      });
    } else {
      values.push({
        base: null,
        increment: null,
        ...(i < placeholders.length ? { placeholder: placeholders[i] } : {})
      });
    }
  }
  
  return values;
}

async function processSublimation(item, actions, allTranslations) {
  const def = item.definition.item;
  const sublim = def.sublimationParameters;
  
  // Estrai traduzioni per tutte le lingue
  const translations = {};
  for (const lang of LANGUAGES) {
    translations[lang] = {
      name: item.title?.[lang] || item.title?.en || 'Unknown',
      description: item.description?.[lang] || item.description?.en || ''
    };
  }
  
  // Determina se serve oggetto multilingua o stringa singola
  const needsMultilang = LANGUAGES.some(lang => 
    translations[lang].name !== translations.en.name ||
    translations[lang].description !== translations.en.description
  );
  
  // Colori châsse
  const slotPattern = sublim.slotColorPattern || [];
  const colors = slotPattern.map(colorId => COLOR_MAP[colorId] || 'W');
  
  // Se è Epic o Relic, usa quella come color
  if (sublim.isEpic) {
    colors.length = 0;
    colors.push('Epic');
  } else if (sublim.isRelic) {
    colors.length = 0;
    colors.push('Relic');
  }
  
  // Categoria e ottenimento
  const category = determineCategory(def.equipEffects, actions);
  const obtenation = determineObtenation(def.level || 0, sublim.isRelic, sublim.isEpic);
  const rarity = determineRarity(def.baseParameters?.rarity || 0, sublim.isEpic, sublim.isRelic);
  
  // Valori
  const values = extractValues(def.equipEffects, sublim.maxLevel || 1);
  
  // Costruisci l'oggetto sublimazione
  const sublimation = {
    name: needsMultilang ? {
      en: translations.en.name,
      fr: translations.fr.name,
      es: translations.es.name,
      pt: translations.pt.name
    } : translations.en.name,
    
    colors: colors,
    
    description: needsMultilang ? {
      en: translations.en.description,
      fr: translations.fr.description,
      es: translations.es.description,
      pt: translations.pt.description
    } : translations.en.description,
    
    rarity: rarity,
    effect: '', // Da compilare manualmente o estrarre dai dati
    maxLevel: sublim.maxLevel || 1,
    minLevel: 1,
    step: 1,
    obtenation: obtenation,
    category: category,
    values: values
  };
  
  return { sublimation, translations };
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  WAKFU Custom Sublimations Fetcher    ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    // 1. Versione corrente
    console.log('📡 Recupero versione corrente...');
    const version = await getCurrentVersion();
    console.log(`✅ Versione: ${version}\n`);
    
    // 2. Download dati
    console.log('📥 Download dati dal CDN...');
    const [items, actions] = await Promise.all([
      fetchJSON(`${CDN_BASE}/${version}/items.json`),
      fetchJSON(`${CDN_BASE}/${version}/actions.json`)
    ]);
    
    console.log(`✅ Items: ${items.length}`);
    console.log(`✅ Actions: ${actions.length}\n`);
    
    // 3. Filtra sublimazioni
    console.log('🔍 Filtraggio sublimazioni...');
    const sublimationItems = items.filter(item => 
      item.definition?.item?.sublimationParameters
    );
    console.log(`✅ Sublimazioni trovate: ${sublimationItems.length}\n`);
    
    // 4. Crea directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // 5. Processa sublimazioni e raccogli traduzioni
    console.log('🌍 Processando sublimazioni...\n');
    
    const allSublimations = [];
    const translationsByLang = {
      en: [],
      fr: [],
      es: [],
      pt: []
    };
    
    for (const item of sublimationItems) {
      const { sublimation, translations } = await processSublimation(item, actions);
      allSublimations.push(sublimation);
      
      // Salva versioni per lingua
      for (const lang of LANGUAGES) {
        const langVersion = {
          ...sublimation,
          name: typeof sublimation.name === 'object' ? sublimation.name[lang] : sublimation.name,
          description: typeof sublimation.description === 'object' ? sublimation.description[lang] : sublimation.description
        };
        translationsByLang[lang].push(langVersion);
      }
    }
    
    // Ordina alfabeticamente per nome
    allSublimations.sort((a, b) => {
      const nameA = typeof a.name === 'object' ? a.name.en : a.name;
      const nameB = typeof b.name === 'object' ? b.name.en : b.name;
      return nameA.localeCompare(nameB);
    });
    
    // 6. Salva file principale (con oggetti multilingua)
    const mainFile = path.join(OUTPUT_DIR, 'sublimations.json');
    await fs.writeFile(mainFile, JSON.stringify(allSublimations, null, 2));
    console.log(`✅ Salvato: ${mainFile} (${allSublimations.length} sublimazioni)\n`);
    
    // 7. Salva file per lingua (stringhe singole)
    for (const lang of LANGUAGES) {
      if (lang === 'en') continue; // Già nel file principale
      
      const langSubs = translationsByLang[lang].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      const filename = path.join(OUTPUT_DIR, `sublimations.${lang}.json`);
      await fs.writeFile(filename, JSON.stringify(langSubs, null, 2));
      console.log(`✅ Salvato: ${filename} (${langSubs.length} sublimazioni)`);
    }
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║           COMPLETATO!                  ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`📊 Totale sublimazioni: ${allSublimations.length}`);
    console.log(`📦 Versione dati: ${version}`);
    console.log(`🌍 File generati: ${LANGUAGES.length + 1}`);
    
    console.log('\n⚠️  NOTA IMPORTANTE:');
    console.log('I campi "effect" e alcuni "values" potrebbero richiedere');
    console.log('una calibrazione manuale per corrispondere esattamente');
    console.log('ai tuoi dati esistenti.\n');
    
  } catch (error) {
    console.error('\n❌ Errore:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();