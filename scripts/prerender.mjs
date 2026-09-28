// scripts/prerender.mjs
//
// Build step run after `vite build` + the SSR build: renders every route in
// src/routes.tsx to static HTML so search engines and ad crawlers see full
// page content without executing JavaScript. Also writes 404.html and the
// sitemap from the same route list, so they can never drift apart.
//
// Output layout matches Cloudflare static assets "auto-trailing-slash"
// handling: /builder → dist/builder.html, / → dist/index.html.

import { promises as fsp } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

process.env.NODE_ENV = "production";

const SITE_URL = "https://wakfujobcalculator.com";
const DIST = path.resolve("dist");
const SERVER_ENTRY = path.resolve("dist-server/entry-server.js");

// Per-page SEO tags come from Helmet; drop the template's static defaults so
// every prerendered page has exactly one of each.
const PER_PAGE_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[\s\S]*?\/>\s*/,
  /<link\s+rel="canonical"[\s\S]*?\/>\s*/,
  /<meta\s+property="og:(title|description|url|image)"[\s\S]*?\/>\s*/g,
  /<meta\s+name="twitter:(title|description|image)"[\s\S]*?\/>\s*/g,
];

function stripDefaults(template) {
  let out = template;
  for (const re of PER_PAGE_TAGS) out = out.replace(re, "");
  return out;
}

function fileFor(route) {
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, `${route.replace(/^\//, "")}.html`);
}

function inject(template, { html, head }) {
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("index.html template is missing <div id=\"root\"></div>");
  }
  // a page that sets its own robots tag (404, unreleased pages) replaces the default one
  const base = head.includes('name="robots"')
    ? template.replace(/<meta\s+name="robots"[\s\S]*?\/>\s*/, "")
    : template;
  return base
    .replace("</head>", `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

async function main() {
  const { render, routes } = await import(pathToFileURL(SERVER_ENTRY).href);
  const template = stripDefaults(await fsp.readFile(path.join(DIST, "index.html"), "utf8"));

  for (const { path: route } of routes) {
    const result = await render(route);
    if (!result.html.trim()) throw new Error(`Empty render for ${route}`);
    const file = fileFor(route);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    await fsp.writeFile(file, inject(template, result));
    console.log(`prerendered ${route.padEnd(40)} ${Math.round(result.html.length / 1024)} KB`);
  }

  // Unknown URLs are served this page with a real 404 status (not_found_handling).
  const notFound = await render("/__not-found__");
  await fsp.writeFile(path.join(DIST, "404.html"), inject(template, notFound));
  console.log("prerendered 404.html");

  const today = new Date().toISOString().slice(0, 10);
  const sitemapRoutes = routes.filter((r) => r.inSitemap);
  const urls = sitemapRoutes
    .map(({ path: route, changefreq, priority }) =>
      `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`)
    .join("\n");
  await fsp.writeFile(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`sitemap.xml: ${sitemapRoutes.length} URLs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
