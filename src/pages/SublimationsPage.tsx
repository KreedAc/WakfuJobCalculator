import { Sublimations } from '../components/Sublimations';
import { HowItWorks } from '../components/HowItWorks';
import { PageSeo } from '../components/PageSeo';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface SublimationsPageProps {
  language: Language;
}

export function SublimationsPage({ language }: SublimationsPageProps) {
  const t = TRANSLATIONS[language];

  return (
    <div>
      <PageSeo title={t.sublimationsLibrary} description={t.sublimationsHowItWorks.slice(0, 155)} path="/sublimations" />
      <Sublimations translations={t} language={language} />
      <HowItWorks title={t.sublimationsHowItWorksTitle} text={t.sublimationsHowItWorks} className="mt-8" />
    </div>
  );
}
