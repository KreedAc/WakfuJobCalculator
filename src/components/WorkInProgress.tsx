import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { PageSeo } from './PageSeo';
import { PageHeader } from './ui/PageHeader';
import { BUILDER_WIP, useBuilderPreview } from '../lib/featureFlags';
import type { Language } from '../constants/translations';

const COPY: Record<Language, { badge: string; text: string; back: string }> = {
  en: {
    badge: 'Work in progress',
    text: 'We are building this tool right now. It will be available soon: come back in a few days!',
    back: 'Back to Home',
  },
  fr: {
    badge: 'En cours de développement',
    text: 'Nous construisons cet outil en ce moment. Il sera bientôt disponible : revenez dans quelques jours !',
    back: "Retour à l'accueil",
  },
  es: {
    badge: 'En desarrollo',
    text: 'Estamos construyendo esta herramienta ahora mismo. Estará disponible pronto: ¡vuelve en unos días!',
    back: 'Volver al inicio',
  },
  pt: {
    badge: 'Em desenvolvimento',
    text: 'Estamos construindo esta ferramenta agora mesmo. Ela estará disponível em breve: volte em alguns dias!',
    back: 'Voltar ao início',
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
    <div>
      <PageSeo title={title} description={c.text} path={path} noindex />
      <PageHeader title={title} />
      <div className="card p-6 md:p-8 max-w-2xl flex flex-col items-start gap-4">
        <span className="badge border-transparent bg-warning/15 text-warning text-xs uppercase tracking-wide px-3 py-1">
          <Construction className="w-3.5 h-3.5" /> {c.badge}
        </span>
        <p className="text-muted leading-relaxed">{c.text}</p>
        <Link to="/" className="btn">{c.back}</Link>
      </div>
    </div>
  );
}
