import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { Language } from '../constants/translations';

const COPY: Record<Language, { title: string; text: string; home: string }> = {
  en: { title: 'Page not found', text: "This page doesn't exist or has moved.", home: 'Back to the XP Calculator' },
  fr: { title: 'Page introuvable', text: "Cette page n'existe pas ou a été déplacée.", home: "Retour au calculateur d'XP" },
  es: { title: 'Página no encontrada', text: 'Esta página no existe o se ha movido.', home: 'Volver a la calculadora de XP' },
  pt: { title: 'Página não encontrada', text: 'Esta página não existe ou foi movida.', home: 'Voltar à calculadora de XP' },
};

export function NotFoundPage({ language }: { language: Language }) {
  const c = COPY[language];
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <Helmet>
        <title>{`${c.title} | Wakfu Job Calculator`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="text-7xl font-extrabold text-emerald-300/80 mb-4">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-emerald-100 mb-2">{c.title}</h1>
      <p className="text-emerald-100/70 mb-8">{c.text}</p>
      <Link
        to="/"
        className="px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all"
      >
        {c.home}
      </Link>
    </div>
  );
}
