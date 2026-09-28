import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { openSearch } from '../components/layout/searchEvents';
import type { Language } from '../constants/translations';

const COPY: Record<Language, { title: string; text: string; home: string; search: string }> = {
  en: { title: 'Page not found', text: "This page doesn't exist or has moved.", home: 'Back to Home', search: 'Search the site' },
  fr: { title: 'Page introuvable', text: "Cette page n'existe pas ou a été déplacée.", home: "Retour à l'accueil", search: 'Rechercher sur le site' },
  es: { title: 'Página no encontrada', text: 'Esta página no existe o se ha movido.', home: 'Volver al inicio', search: 'Buscar en el sitio' },
  pt: { title: 'Página não encontrada', text: 'Esta página não existe ou foi movida.', home: 'Voltar ao início', search: 'Buscar no site' },
};

export function NotFoundPage({ language }: { language: Language }) {
  const c = COPY[language];
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <Helmet>
        <title>{`${c.title} | Wakfu Job Calculator`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="font-display text-7xl font-extrabold text-primary mb-4">404</div>
      <h1 className="page-title mb-2">{c.title}</h1>
      <p className="text-muted mb-8">{c.text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary h-11 px-5">{c.home}</Link>
        <button type="button" onClick={() => openSearch()} className="btn h-11 px-5">
          <Search className="w-4 h-4" /> {c.search}
        </button>
      </div>
    </div>
  );
}
