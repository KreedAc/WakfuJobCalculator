import { HelmetProvider, Helmet } from 'react-helmet-async';

const SITE_URL = 'https://wakfujobcalculator.com';

interface PageSeoProps {
  title: string;
  description: string;
  path: string;
}

export function PageSeo({ title, description, path }: PageSeoProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title} | Wakfu Job Calculator</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}${path}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}${path}`} />
      </Helmet>
    </HelmetProvider>
  );
}
