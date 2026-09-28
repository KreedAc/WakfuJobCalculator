import { Calculator } from '../components/Calculator';
import { HowItWorks } from '../components/HowItWorks';
import { PageSeo } from '../components/PageSeo';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface CalculatorPageProps {
  language: Language;
}

export function CalculatorPage({ language }: CalculatorPageProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full flex flex-col items-center px-4">
      <PageSeo title={t.title} description={t.subtitle} path="/" />
      <Calculator language={language} translations={t} />
      <HowItWorks title={t.calcHowItWorksTitle} text={t.calcHowItWorks} className="max-w-4xl w-full mx-auto mt-12" />
    </div>
  );
}
