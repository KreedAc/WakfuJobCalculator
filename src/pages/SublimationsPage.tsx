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
    <div className="w-full">
      <PageSeo title={t.sublimationsLibrary} description={t.sublimationsHowItWorks.slice(0, 155)} path="/sublimations" />
      <Sublimations translations={t} language={language} />
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <HowItWorks title={t.sublimationsHowItWorksTitle} text={t.sublimationsHowItWorks} />
      </div>
    </div>
  );
}
