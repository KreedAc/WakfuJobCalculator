// Cloudflare Worker: serves the public visitor counter (/api/*) from the D1
// database bound as DB. Every other request goes straight to the static
// assets (wrangler.jsonc routes only /api/* through this code).
//
//   POST /api/visit    count this visitor once per day, returns the totals
//   GET  /api/visits   totals only
//
// Visitors are identified only by a salted SHA-256 that changes every day
// (IP + user agent + date); those rows are deleted after two days and only
// the totals are kept. The IP itself is never stored.

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /** optional secret (wrangler secret put IP_SALT); a constant is used otherwise */
  IP_SALT?: string;
}

// Created on first use, so the database needs no manual setup.
const SCHEMA = [
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

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const today = () => new Date().toISOString().slice(0, 10);

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
  const day = today();
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
  const path = new URL(request.url).pathname.replace(/\/+$/, '');
  if (path !== '/api/visit' && path !== '/api/visits') throw new HttpError(404, 'not found');
  await ensureSchema(env.DB);
  if (path === '/api/visit' && request.method === 'POST') return countVisit(request, env);
  if (path === '/api/visits' && request.method === 'GET') return json(await visitTotals(env, today()));
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
