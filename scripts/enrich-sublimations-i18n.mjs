import fs from "node:fs/promises";

const CDN = "https://wakfu.cdn.ankama.com/gamedata";
const LANGS = ["en", "fr", "es", "pt"];

const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
  return res.json();
}

function getI18n(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v && typeof v === "object" && !Array.isArray(v)) return v;
  }
  return null;
}

function getString(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "string") return v;
  }
  return "";
}

async function main() {
  // 1) versione ufficiale corrente
  const { version } = await fetchJson(`${CDN}/config.json`);

  // 2) items ufficiali
  const items = await fetchJson(`${CDN}/${version}/items.json`);

  // 3) indicizzo per nome (EN come chiave)
  const byName = new Map();
  for (const it of items) {
    const titleI18n = getI18n(it?.definition, ["title", "name"]) || getI18n(it, ["title", "name"]);
    const title =
      (titleI18n && (titleI18n.en || titleI18n.fr || titleI18n.es || titleI18n.pt)) ||
      getString(it?.definition, ["title", "name"]) ||
      getString(it, ["title", "name"]);

    if (title) byName.set(norm(title), it);
  }

  // 4) leggo il tuo file (ATTENZIONE: qui do per scontato public/)
  const inputPath = "public/sublimations.json";
  const raw = JSON.parse(await fs.readFile(inputPath, "utf8"));

  // 5) arricchisco
  let matched = 0;
  for (const s of raw) {
    const it = byName.get(norm(s.name));
    if (!it) continue;

    const titleI18n = getI18n(it?.definition, ["title", "name"]) || getI18n(it, ["title", "name"]);
    const descI18n = getI18n(it?.definition, ["description"]) || getI18n(it, ["description"]);

    // name
    if (titleI18n) {
      s.name = Object.fromEntries(
        LANGS.map((l) => [l, titleI18n[l] ?? titleI18n.en ?? s.name])
      );
    } else {
      s.name = { en: s.name };
    }

    // description
    if (descI18n) {
      s.description = Object.fromEntries(
        LANGS.map((l) => [l, descI18n[l] ?? descI18n.en ?? s.description])
      );
    } else {
      s.description = { en: s.description };
    }

    // effect (se vuoi uguale logica: spesso è tuo testo “custom”, quindi lo lascio com’è)
    matched++;
  }

  // 6) salvo un singolo file i18n (compatibile col componente aggiornato)
  await fs.writeFile(inputPath, JSON.stringify(raw, null, 2), "utf8");

  // 7) opzionale: genero anche i file per lingua (così funziona anche col tuo loader attuale)
  for (const lang of LANGS) {
    const perLang = raw.map((s) => ({
      ...s,
      name: typeof s.name === "object" ? (s.name[lang] ?? s.name.en) : s.name,
      description: typeof s.description === "object" ? (s.description[lang] ?? s.description.en) : s.description,
      effect: typeof s.effect === "object" ? (s.effect[lang] ?? s.effect.en) : s.effect,
    }));
    await fs.writeFile(`public/sublimations.${lang}.json`, JSON.stringify(perLang, null, 2), "utf8");
  }

  console.log(`OK: arricchite ${matched}/${raw.length} sublimazioni`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
