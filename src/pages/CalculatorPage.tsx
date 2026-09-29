import { Calculator } from '../components/Calculator';
import { HowItWorks } from '../components/HowItWorks';
import { PageSeo } from '../components/PageSeo';
import { SEO } from '../content/seo';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface CalculatorPageProps {
  language: Language;
}

export function CalculatorPage({ language }: CalculatorPageProps) {
  const t = TRANSLATIONS[language];

  return (
    <div>
      <PageSeo {...SEO[language].xp} path="/xp-calculator" />
      <Calculator language={language} title={t.title} subtitle={t.subtitle} />
      <HowItWorks title={t.calcHowItWorksTitle} text={t.calcHowItWorks} className="mt-8" />
    </div>
  );
}
