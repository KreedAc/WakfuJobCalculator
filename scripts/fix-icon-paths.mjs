#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const files = [
  'public/sublimations.json',
  'public/data/sublimations.en.json',
  'public/data/sublimations.fr.json',
  'public/data/sublimations.es.json',
  'public/data/sublimations.pt.json'
];

async function fixIconPaths() {
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const updated = content.replace(/\"\/icons\//g, '"/data/icons/');
      await fs.writeFile(file, updated, 'utf8');
      console.log(`✓ Fixed icon paths in ${file}`);
    } catch (err) {
      console.log(`⚠ Could not process ${file}: ${err.message}`);
    }
  }
}

fixIconPaths().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
