// Server entry used only at build time by scripts/prerender.mjs to turn every
// route into static HTML (SEO + fast first paint). Not shipped to browsers.
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { Writable } from 'node:stream';
import App from './App';
import { ROUTES } from './routes';

export const routes = ROUTES.map(({ path, changefreq, priority }) => ({ path, changefreq, priority }));

export interface RenderResult {
  html: string;
  head: string;
}

export function render(url: string): Promise<RenderResult> {
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
      resolve({ html, head });
    });

    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
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
