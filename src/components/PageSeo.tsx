import { Helmet } from 'react-helmet-async';
import { LANGUAGES, localizedPath, useLanguage } from '../lib/locale';
import type { Language } from '../constants/translations';

const SITE_URL = 'https://wakfujobcalculator.com';

// Social preview images generated per tool (public/og/*.jpg); other pages use the default.
const OG_IMAGES: Record<string, string> = {
  '/xp-calculator': 'xp-calculator',
  '/sublimations': 'sublimations',
  '/items-craft-guide': 'items-craft-guide',
  '/combat-calc': 'combat-calc',
  '/treasures': 'treasures',
  '/guides': 'guides',
  '/game-updates': 'game-updates',
};

const OG_LOCALE: Record<Language, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES', pt: 'pt_BR' };

// The site name is added when it fits in a search result line (~65 characters).
const SITE_NAME = 'Wakfu Job Calculator';
function fullTitle(title: string) {
  return title.includes(SITE_NAME) || title.length + SITE_NAME.length + 3 > 65 ? title : `${title} | ${SITE_NAME}`;
}

function ogImageFor(path: string): string {
  return `${SITE_URL}/og/${OG_IMAGES[path] ?? 'default'}.jpg`;
}

interface PageSeoProps {
  title: string;
  description: string;
  /** page path without the language prefix, e.g. "/treasures" */
  path: string;
  /** keep the page out of search results (e.g. unreleased features) */
  noindex?: boolean;
}

export function PageSeo({ title, description, path, noindex }: PageSeoProps) {
  const language = useLanguage();
  const url = `${SITE_URL}${localizedPath(language, path)}`;
  const image = ogImageFor(path);
  return (
    <Helmet>
      <title>{fullTitle(title)}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={url} />
      {/* the same page in every language, so search engines show the right one */}
      {!noindex && LANGUAGES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${SITE_URL}${localizedPath(l, path)}`} />
      ))}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${localizedPath('en', path)}`} />}
      <meta property="og:locale" content={OG_LOCALE[language]} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
