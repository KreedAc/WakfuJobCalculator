import { Sublimations } from '../components/Sublimations';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface SublimationsPageProps {
  language: Language;
}

export function SublimationsPage({ language }: SublimationsPageProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full">
      <Sublimations translations={t} />

      <div className="max-w-6xl mx-auto mt-12 px-4">
        <div className="backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-300 mb-4">
            {t.sublimationsHowItWorksTitle}
          </h2>
          <p className="text-emerald-100/90 leading-relaxed text-base">
            {t.sublimationsHowItWorks}
          </p>
        </div>
      </div>
    </div>
  );
}
