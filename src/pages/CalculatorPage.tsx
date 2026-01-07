import { Calculator } from '../components/Calculator';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface CalculatorPageProps {
  language: Language;
}

export function CalculatorPage({ language }: CalculatorPageProps) {
  const t = TRANSLATIONS[language];

  return <Calculator language={language} translations={t} />;
}
