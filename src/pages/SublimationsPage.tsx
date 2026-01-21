import { Sublimations } from '../components/Sublimations';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface SublimationsPageProps {
  language: Language;
}

export function SublimationsPage({ language }: SublimationsPageProps) {
  const t = TRANSLATIONS[language];
  return <Sublimations translations={t} />;
}
