import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hash of the game data files: appended to their URLs (src/lib/pageData.ts) so a
// data update never meets a stale cached copy. Same value in both builds.
function dataVersion() {
  const hash = createHash('sha1');
  for (const f of readdirSync('public/data').filter((f) => f.endsWith('.json')).sort()) {
    hash.update(f).update(readFileSync(`public/data/${f}`));
  }
  return hash.digest('hex').slice(0, 10);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __DATA_VERSION__: JSON.stringify(dataVersion()),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  ssr: {
    // CommonJS package without named ESM exports: bundle it into the
    // prerender build instead of importing it from node_modules.
    noExternal: ['react-helmet-async'],
  },
});
