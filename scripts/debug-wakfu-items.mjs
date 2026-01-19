#!/usr/bin/env node
import { promises as fs } from 'node:fs';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  const cfg = await fetchJson('https://wakfu.cdn.ankama.com/gamedata/config.json');
  const version = cfg.version;
  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;

  console.log('Downloading items...');
  const items = await fetchJson(`${base}/items.json`);

  console.log(`Total items: ${items.length}`);

  // Mostra la struttura dell'oggetto
  console.log('\nFirst item raw structure:');
  console.log(JSON.stringify(items[0], null, 2).slice(0, 1000));

  console.log('\n\nSearching for items with "Influence" in any field...');

  const searchResults = [];
  for (let i = 0; i < items.length && searchResults.length < 3; i++) {
    const itemStr = JSON.stringify(items[i]).toLowerCase();
    if (itemStr.includes('influence')) {
      searchResults.push(items[i]);
    }
  }

  if (searchResults.length > 0) {
    console.log(`\nFound ${searchResults.length} items with "Influence":`);
    for (const item of searchResults) {
      console.log('\n' + JSON.stringify(item, null, 2).slice(0, 1500));
    }
  }
}

main().catch(err => console.error('Error:', err));
