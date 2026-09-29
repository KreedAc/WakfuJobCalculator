// Server entry used only at build time by scripts/prerender.mjs to turn every
// route into static HTML (SEO + fast first paint), once per language. Not
// shipped to browsers.
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { Writable } from 'node:stream';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import App from './App';
import { ROUTES } from './routes';
import { LANGUAGES, LanguageContext, localePrefix, localizedPath, splitLocale } from './lib/locale';
import { dataUrl, putData } from './lib/pageData';

export const routes = ROUTES.map(({ path, changefreq, priority, inSitemap = true }) => ({ path, changefreq, priority, inSitemap }));
export const languages = LANGUAGES;
export { localizedPath };

export interface RenderResult {
  html: string;
  head: string;
  /** data files the page was rendered with: preloaded by the browser before hydrating */
  preload: string[];
}

export function render(url: string): Promise<RenderResult> {
  const { language, path: pagePath } = splitLocale(url);

  // the page's data, read from the build output (same files the browser will fetch)
  const files = ROUTES.find((r) => r.path === pagePath)?.data?.(language) ?? [];
  for (const f of files) putData(f, JSON.parse(readFileSync(path.resolve('dist/data', f), 'utf8')));

  const helmetContext: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk.toString(); cb(); },
    });
    sink.on('finish', () => {
      const h = helmetContext.helmet;
      const head = h
        ? [h.title.toString(), h.meta.toString(), h.link.toString(), h.script.toString()].join('\n')
        : '';
      resolve({ html, head, preload: files.map(dataUrl) });
    });

    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <LanguageContext.Provider value={language}>
            <StaticRouter location={url} basename={localePrefix(language) || '/'}>
              <App language={language} onLanguageChange={() => {}} />
            </StaticRouter>
          </LanguageContext.Provider>
        </HelmetProvider>
      </StrictMode>,
      {
        // wait for every lazy route to resolve so the HTML is complete
        onAllReady() { stream.pipe(sink); },
        onShellError: reject,
        onError(err) { reject(err); },
      },
    );
  });
}
