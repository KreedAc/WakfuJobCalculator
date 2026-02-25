import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'data');
const TMP_DIR = path.join(ROOT, 'data', 'wakfu', 'tmp');

function exists(p) {
  try { return fssync.existsSync(p); } catch { return false; }
}

function getClientRoots() {
  // Windows default (Zaap) paths
  const local = process.env.LOCALAPPDATA || '';
  const roots = [
    path.join(local, 'Ankama', 'Wakfu'),
    path.join(local, 'Ankama', 'Wakfu-Beta'),
  ].filter(p => p && exists(p));
  return roots;
}

function psEscape(s) {
  // single-quote escape for PowerShell: ' becomes ''
  return String(s).replace(/'/g, "''");
}

function extractJarWithPowerShell(jarPath, outDir) {
  const ps = [
    'Add-Type -AssemblyName System.IO.Compression.FileSystem;',
    `$jar='${psEscape(jarPath)}';`,
    `$out='${psEscape(outDir)}';`,
    'if(Test-Path $out){ Remove-Item -Recurse -Force $out }',
    'New-Item -ItemType Directory -Force -Path $out | Out-Null;',
    '[System.IO.Compression.ZipFile]::ExtractToDirectory($jar, $out);',
  ].join(' ');

  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], {
    stdio: 'inherit'
  });

  if (r.status !== 0) {
    throw new Error(`PowerShell extraction failed for: ${jarPath}`);
  }
}

function unescapeJava(str) {
  // Handles \\uXXXX and common escapes used in .properties files
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch !== '\\') {
      out += ch;
      continue;
    }
    const next = str[i + 1];
    if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(str.slice(i + 2, i + 6))) {
      out += String.fromCharCode(parseInt(str.slice(i + 2, i + 6), 16));
      i += 5;
      continue;
    }
    switch (next) {
      case 't': out += '\t'; i += 1; break;
      case 'n': out += '\n'; i += 1; break;
      case 'r': out += '\r'; i += 1; break;
      case 'f': out += '\f'; i += 1; break;
      case '\\': out += '\\'; i += 1; break;
      default:
        // keep the escaped character as-is (e.g. \:, \=, \ )
        out += next ?? '';
        i += 1;
        break;
    }
  }
  return out;
}

function parseProperties(text) {
  const lines = text.split(/\r?\n/);
  const props = {};
  let buf = '';
  for (let rawLine of lines) {
    if (buf) rawLine = buf + rawLine;
    buf = '';

    // ignore empty lines
    if (!rawLine || !rawLine.trim()) continue;

    // comments
    const trimmed = rawLine.trimStart();
    if (trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

    // continuation lines (ending with an odd number of backslashes)
    let bsCount = 0;
    for (let j = rawLine.length - 1; j >= 0 && rawLine[j] === '\\'; j--) bsCount++;
    if (bsCount % 2 === 1) {
      buf = rawLine.slice(0, -1);
      continue;
    }

    // split key/value (first unescaped = or :)
    let key = '';
    let val = '';
    let sepIndex = -1;
    let escaped = false;
    for (let i = 0; i < rawLine.length; i++) {
      const c = rawLine[i];
      if (!escaped && (c === '=' || c === ':')) { sepIndex = i; break; }
      if (!escaped && /\s/.test(c)) { sepIndex = i; break; }
      if (c === '\\' && !escaped) { escaped = true; continue; }
      escaped = false;
    }

    if (sepIndex === -1) {
      key = rawLine.trim();
      val = '';
    } else {
      key = rawLine.slice(0, sepIndex).trim();
      val = rawLine.slice(sepIndex);
      // remove separators and whitespace after
      val = val.replace(/^[\s:=]+/, '');
    }

    key = unescapeJava(key);
    val = unescapeJava(val);
    if (key) props[key] = val;
  }
  return props;
}

async function listFilesRecursive(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else out.push(p);
    }
  }
  return out;
}

async function main() {
  const roots = getClientRoots();
  if (roots.length === 0) {
    console.error('ERROR: Could not find Wakfu client folders.');
    console.error('Expected something like: %LOCALAPPDATA%\\Ankama\\Wakfu');
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  console.log('Extracting Wakfu i18n texts from local client...');
  console.log('Roots:');
  for (const r of roots) console.log('-', r);

  const langs = ['en', 'fr', 'es', 'pt'];

  for (const lang of langs) {
    const jarName = `i18n_${lang}.jar`;
    const candidates = roots
      .map(r => path.join(r, 'contents', 'i18n', jarName))
      .filter(exists);

    if (candidates.length === 0) {
      console.log(`[${lang}] SKIP: not found (${jarName})`);
      continue;
    }

    const jarPath = candidates[0];
    const tmpOut = path.join(TMP_DIR, `i18n_${lang}`);

    console.log(`\n[${lang}] Using: ${jarPath}`);
    extractJarWithPowerShell(jarPath, tmpOut);

    const files = await listFilesRecursive(tmpOut);
    const propFiles = files.filter(f => f.toLowerCase().endsWith('.properties'));

    if (propFiles.length === 0) {
      console.log(`[${lang}] ERROR: no .properties files found in extracted jar.`);
      continue;
    }

    const merged = {};
    let fileCount = 0;
    for (const file of propFiles) {
      const txt = await fs.readFile(file, 'utf-8');
      const props = parseProperties(txt);
      Object.assign(merged, props);
      fileCount++;
    }

    const outPath = path.join(OUT_DIR, `wakfu-texts.${lang}.json`);
    await fs.writeFile(outPath, JSON.stringify(merged, null, 2), 'utf-8');

    console.log(`[${lang}] Loaded ${Object.keys(merged).length.toLocaleString('en-US')} strings from ${fileCount} file(s)`);
    console.log(`[${lang}] Wrote → ${outPath}`);
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
