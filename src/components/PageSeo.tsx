import { Helmet } from 'react-helmet-async';

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

function ogImageFor(path: string): string {
  return `${SITE_URL}/og/${OG_IMAGES[path] ?? 'default'}.jpg`;
}

interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  /** keep the page out of search results (e.g. unreleased features) */
  noindex?: boolean;
}

export function PageSeo({ title, description, path, noindex }: PageSeoProps) {
  const url = `${SITE_URL}${path}`;
  const image = ogImageFor(path);
  return (
    <Helmet>
      <title>{`${title} | Wakfu Job Calculator`}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={url} />
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
