import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  ssr: {
    // CommonJS package without named ESM exports: bundle it into the
    // prerender build instead of importing it from node_modules.
    noExternal: ['react-helmet-async'],
  },
});
