import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { PageSeo } from './PageSeo';
import { BUILDER_WIP, useBuilderPreview } from '../lib/featureFlags';
import type { Language } from '../constants/translations';

const COPY: Record<Language, { badge: string; text: string; back: string }> = {
  en: {
    badge: 'Work in progress',
    text: 'We are building this tool right now. It will be available soon: come back in a few days!',
    back: 'Back to the XP Calculator',
  },
  fr: {
    badge: 'En cours de développement',
    text: 'Nous construisons cet outil en ce moment. Il sera bientôt disponible : revenez dans quelques jours !',
    back: 'Retour au Calculateur XP',
  },
  es: {
    badge: 'En desarrollo',
    text: 'Estamos construyendo esta herramienta ahora mismo. Estará disponible pronto: ¡vuelve en unos días!',
    back: 'Volver a la Calculadora XP',
  },
  pt: {
    badge: 'Em desenvolvimento',
    text: 'Estamos construindo esta ferramenta agora mesmo. Ela estará disponível em breve: volte em alguns dias!',
    back: 'Voltar à Calculadora XP',
  },
};

interface Props {
  language: Language;
  title: string;
  path: string;
  children: ReactNode;
}

/** Shows `children` when the feature is live (or previewed), a "Work in progress" page otherwise. */
export function BuilderWipGate({ language, title, path, children }: Props) {
  const preview = useBuilderPreview();
  if (!BUILDER_WIP || preview) return <>{children}</>;
  const c = COPY[language];
  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center animate-in fade-in duration-500">
      <PageSeo title={title} description={c.text} path={path} noindex />
      <h1 className="page-title mb-6">{title}</h1>
      <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 text-sm font-semibold uppercase tracking-wide">
          <Construction className="w-4 h-4" /> {c.badge}
        </span>
        <p className="text-emerald-100/80 text-base leading-relaxed">{c.text}</p>
        <Link to="/" className="text-emerald-300 hover:text-emerald-200 underline text-sm font-medium">{c.back}</Link>
      </div>
    </div>
  );
}
