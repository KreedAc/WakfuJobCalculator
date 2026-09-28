// Client for the public build gallery API served by worker/index.ts.

export interface PublicBuild {
  id: string;
  /** Builder share code (see encodeBuild) */
  code: string;
  name: string;
  author: string;
  description: string;
  /** index into CLASS_NAMES, -1 when not set */
  class: number;
  level: number;
  likes: number;
  created_at: number;
}

export interface BuildQuery {
  sort: 'new' | 'top';
  class: number;
  min: number;
  max: number;
  q: string;
  page: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/${path}`, init);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok || !body) throw new ApiError(res.status, body?.error ?? `HTTP ${res.status}`);
  return body as T;
}

export function listBuilds(query: BuildQuery) {
  const p = new URLSearchParams({ sort: query.sort, page: String(query.page) });
  if (query.class >= 0) p.set('class', String(query.class));
  if (query.min > 0) p.set('min', String(query.min));
  if (query.max > 0) p.set('max', String(query.max));
  if (query.q.trim()) p.set('q', query.q.trim());
  return request<{ builds: PublicBuild[]; hasMore: boolean }>(`builds?${p}`);
}

export function getBuild(id: string) {
  return request<PublicBuild>(`builds/${encodeURIComponent(id)}`);
}

export function publishBuild(data: { code: string; name: string; author: string; description: string; class: number }) {
  return request<{ id: string; existing?: boolean }>('builds', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function likeBuild(id: string) {
  return request<{ likes: number }>(`builds/${encodeURIComponent(id)}/like`, { method: 'POST' });
}

export function reportBuild(id: string) {
  return request<{ ok: true }>(`builds/${encodeURIComponent(id)}/report`, { method: 'POST' });
}

// ─── per-device memory (likes given, last author name) ──────────────────────

const LIKED_KEY = 'wakfu-liked-builds';
const AUTHOR_KEY = 'wakfu-build-author';

export function likedBuilds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export function rememberLike(id: string) {
  const ids = likedBuilds();
  ids.add(id);
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids].slice(-500)));
  } catch {
    // storage unavailable: the server still counts one like per visitor
  }
}

export function savedAuthor(): string {
  try {
    return localStorage.getItem(AUTHOR_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveAuthor(name: string) {
  try {
    localStorage.setItem(AUTHOR_KEY, name);
  } catch {
    // ignore
  }
}
