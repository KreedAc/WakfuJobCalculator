// Game data a page shows on its first render (sublimations, treasures, game
// updates). The prerenderer puts these files in the store before rendering, and
// the browser downloads them before hydrating (src/main.tsx), so the static HTML
// contains the full content for search engines and the first client render
// matches it. Later loads (another language, client-side navigation) go through
// the same cache.

declare const __DATA_VERSION__: string;

// Changes whenever a data file changes, so the service worker never serves an
// old copy that doesn't match freshly prerendered pages.
const VERSION = typeof __DATA_VERSION__ === 'string' ? __DATA_VERSION__ : 'dev';

export const dataUrl = (file: string) => `/data/${file}?v=${VERSION}`;

const store = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

/** Data already in memory (prerender, preloaded before hydration, or loaded earlier). */
export function peekData<T>(file: string): T | undefined {
  return store.get(file) as T | undefined;
}

export function putData(file: string, data: unknown) {
  store.set(file, data);
}

export function loadData<T>(file: string): Promise<T> {
  if (store.has(file)) return Promise.resolve(store.get(file) as T);
  let p = pending.get(file);
  if (!p) {
    p = fetch(dataUrl(file))
      .then((r) => {
        if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        store.set(file, d);
        return d;
      })
      .finally(() => pending.delete(file));
    pending.set(file, p);
  }
  return p as Promise<T>;
}
