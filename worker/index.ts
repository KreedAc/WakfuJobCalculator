// Cloudflare Worker: serves the public build gallery API (/api/*) from the D1
// database bound as DB. Every other request goes straight to the static
// assets (wrangler.jsonc routes only /api/* through this code).
//
//   GET  /api/builds?sort=new|top&class=&min=&max=&q=&page=   list
//   GET  /api/builds/:id                                      one build
//   POST /api/builds          {code, name, author, description, class}
//   POST /api/builds/:id/like                                 one like per visitor
//   POST /api/builds/:id/report                               hidden after 3 reports
//   POST /api/visit    count this visitor once per day, returns the totals
//   GET  /api/visits   totals only
//
// Visitors are identified only by a salted SHA-256 of their IP address, used
// for rate limiting, like and report de-duplication; the IP itself is never stored.

import { HttpError, cleanText, codeLevel, MAX_LEVEL, CLASS_COUNT } from './validate';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /** optional secret (wrangler secret put IP_SALT); a constant is used otherwise */
  IP_SALT?: string;
}

const PAGE_SIZE = 24;
const PUBLISH_LIMIT_PER_HOUR = 5;
const REPORTS_TO_HIDE = 3;

// Created on first use, so the database needs no manual setup.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS builds (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    class INTEGER NOT NULL DEFAULT -1,
    level INTEGER NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    reports INTEGER NOT NULL DEFAULT 0,
    hidden INTEGER NOT NULL DEFAULT 0,
    ip_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS builds_new ON builds (hidden, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS builds_top ON builds (hidden, likes DESC, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS builds_ip ON builds (ip_hash, created_at)',
  `CREATE TABLE IF NOT EXISTS build_votes (
    build_id TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    kind TEXT NOT NULL,
    PRIMARY KEY (build_id, ip_hash, kind)
  )`,
  // visitor counter: one row per visitor per UTC day (hash changes daily),
  // rows older than yesterday are deleted; totals live in counters
  `CREATE TABLE IF NOT EXISTS visits (
    day TEXT NOT NULL,
    visitor TEXT NOT NULL,
    PRIMARY KEY (day, visitor)
  )`,
  'CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0)',
];

let schemaReady: Promise<unknown> | null = null;
function ensureSchema(db: D1Database) {
  schemaReady ??= db.batch(SCHEMA.map((sql) => db.prepare(sql))).catch((e) => {
    schemaReady = null; // retry on the next request
    throw e;
  });
  return schemaReady;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function visitorHash(request: Request, env: Env) {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const data = new TextEncoder().encode(`${env.IP_SALT ?? 'wakfu-job-calculator'}|${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest).slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return [...bytes].map((b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
}

const PUBLIC_COLUMNS = 'id, code, name, author, description, class, level, likes, created_at';

// ─── handlers ────────────────────────────────────────────────────────────────

async function listBuilds(url: URL, env: Env) {
  const p = url.searchParams;
  const where = ['hidden = 0'];
  const args: (string | number)[] = [];

  const cls = Number(p.get('class') ?? -1);
  if (Number.isInteger(cls) && cls >= 0 && cls < CLASS_COUNT) {
    where.push('class = ?');
    args.push(cls);
  }
  const min = Number(p.get('min') ?? 0);
  const max = Number(p.get('max') ?? MAX_LEVEL);
  if (Number.isFinite(min) && min > 0) { where.push('level >= ?'); args.push(min); }
  if (Number.isFinite(max) && max < MAX_LEVEL) { where.push('level <= ?'); args.push(max); }

  const q = cleanText(p.get('q'), 40);
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(name LIKE ? ESCAPE '\\' OR author LIKE ? ESCAPE '\\')");
    args.push(like, like);
  }

  const order = p.get('sort') === 'top' ? 'likes DESC, created_at DESC' : 'created_at DESC';
  const page = Math.max(0, Math.min(100, Number(p.get('page')) || 0));
  const { results } = await env.DB
    .prepare(`SELECT ${PUBLIC_COLUMNS} FROM builds WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`)
    .bind(...args, PAGE_SIZE + 1, page * PAGE_SIZE)
    .all();

  return json(
    { builds: results.slice(0, PAGE_SIZE), hasMore: results.length > PAGE_SIZE },
  );
}

async function getBuild(id: string, env: Env) {
  const row = await env.DB.prepare(`SELECT ${PUBLIC_COLUMNS} FROM builds WHERE id = ? AND hidden = 0`).bind(id).first();
  if (!row) throw new HttpError(404, 'not found');
  return json(row);
}

async function publishBuild(request: Request, env: Env) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new HttpError(415, 'json expected');
  const raw = await request.text();
  if (raw.length > 4000) throw new HttpError(413, 'too large');
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'invalid json');
  }

  const level = codeLevel(body.code);
  const code = body.code as string;
  const name = cleanText(body.name, 60);
  if (name.length < 3) throw new HttpError(400, 'name too short');
  const author = cleanText(body.author, 30);
  const description = cleanText(body.description, 500, true);
  const cls = Number.isInteger(body.class) && (body.class as number) >= 0 && (body.class as number) < CLASS_COUNT
    ? (body.class as number) : -1;

  const ip = await visitorHash(request, env);
  const hourAgo = Date.now() - 3600_000;

  // same build published again by the same visitor → update that entry instead
  const existing = await env.DB
    .prepare('SELECT id FROM builds WHERE ip_hash = ? AND code = ? AND hidden = 0')
    .bind(ip, code).first<{ id: string }>();
  if (existing) {
    await env.DB
      .prepare('UPDATE builds SET name = ?, author = ?, description = ?, class = ? WHERE id = ?')
      .bind(name, author, description, cls, existing.id).run();
    return json({ id: existing.id, existing: true });
  }

  const recent = await env.DB
    .prepare('SELECT COUNT(*) AS n FROM builds WHERE ip_hash = ? AND created_at > ?')
    .bind(ip, hourAgo).first<{ n: number }>();
  if ((recent?.n ?? 0) >= PUBLISH_LIMIT_PER_HOUR) throw new HttpError(429, 'too many builds, try again later');

  const id = newId();
  await env.DB
    .prepare(`INSERT INTO builds (id, code, name, author, description, class, level, ip_hash, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, code, name, author, description, cls, level, ip, Date.now())
    .run();
  return json({ id }, 201);
}

async function vote(request: Request, id: string, kind: 'like' | 'report', env: Env) {
  const build = await env.DB.prepare('SELECT likes FROM builds WHERE id = ? AND hidden = 0').bind(id).first<{ likes: number }>();
  if (!build) throw new HttpError(404, 'not found');
  const ip = await visitorHash(request, env);
  const inserted = await env.DB
    .prepare('INSERT OR IGNORE INTO build_votes (build_id, ip_hash, kind) VALUES (?, ?, ?)')
    .bind(id, ip, kind).run();
  const isNew = (inserted.meta.changes ?? 0) > 0;

  if (kind === 'like') {
    if (isNew) await env.DB.prepare('UPDATE builds SET likes = likes + 1 WHERE id = ?').bind(id).run();
    return json({ likes: build.likes + (isNew ? 1 : 0) });
  }
  if (isNew) {
    await env.DB
      .prepare('UPDATE builds SET reports = reports + 1, hidden = CASE WHEN reports + 1 >= ? THEN 1 ELSE hidden END WHERE id = ?')
      .bind(REPORTS_TO_HIDE, id).run();
  }
  return json({ ok: true });
}

// ─── visitor counter ─────────────────────────────────────────────────────────

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor/i;

async function visitTotals(env: Env, day: string) {
  const { results } = await env.DB
    .prepare("SELECT key, value FROM counters WHERE key IN ('total', ?)")
    .bind(`day:${day}`)
    .all<{ key: string; value: number }>();
  const get = (k: string) => results.find((r) => r.key === k)?.value ?? 0;
  return { total: get('total'), today: get(`day:${day}`) };
}

async function countVisit(request: Request, env: Env) {
  const day = new Date().toISOString().slice(0, 10);
  const ua = request.headers.get('user-agent') ?? '';
  if (!BOT_UA.test(ua)) {
    // daily-rotating hash: the same person can't be followed from one day to the next
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const data = new TextEncoder().encode(`${env.IP_SALT ?? 'wakfu-job-calculator'}|${day}|${ip}|${ua}`);
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
    const visitor = [...digest.slice(0, 12)].map((b) => b.toString(16).padStart(2, '0')).join('');
    const inserted = await env.DB
      .prepare('INSERT OR IGNORE INTO visits (day, visitor) VALUES (?, ?)')
      .bind(day, visitor).run();
    if ((inserted.meta.changes ?? 0) > 0) {
      const bump = 'INSERT INTO counters (key, value) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET value = value + 1';
      const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
      await env.DB.batch([
        env.DB.prepare(bump).bind('total'),
        env.DB.prepare(bump).bind(`day:${day}`),
        env.DB.prepare('DELETE FROM visits WHERE day < ?').bind(yesterday),
      ]);
    }
  }
  return json(await visitTotals(env, day));
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname.replace(/\/+$/, '').split('/').slice(2); // ['builds', id?, action?]

  if (parts[0] === 'visit' || parts[0] === 'visits') {
    await ensureSchema(env.DB);
    if (parts[0] === 'visit' && request.method === 'POST') return countVisit(request, env);
    if (parts[0] === 'visits' && request.method === 'GET') return json(await visitTotals(env, new Date().toISOString().slice(0, 10)));
    throw new HttpError(405, 'method not allowed');
  }
  if (parts[0] !== 'builds') throw new HttpError(404, 'not found');
  const id = parts[1];
  if (id !== undefined && !/^[A-Za-z0-9]{8}$/.test(id)) throw new HttpError(404, 'not found');

  await ensureSchema(env.DB);

  if (request.method === 'GET') {
    if (!id) return listBuilds(url, env);
    if (parts.length === 2) return getBuild(id, env);
  }
  if (request.method === 'POST') {
    if (!id) return publishBuild(request, env);
    if (parts[2] === 'like' || parts[2] === 'report') return vote(request, id, parts[2], env);
  }
  throw new HttpError(405, 'method not allowed');
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await handleApi(request, env);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: 'server error' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
