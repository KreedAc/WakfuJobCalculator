import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Calculator } from '../components/Calculator';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface CalculatorPageProps {
  language: Language;
}

export function CalculatorPage({ language }: CalculatorPageProps) {
  const t = TRANSLATIONS[language];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <Calculator language={language} translations={t} />

      <div className="max-w-4xl mx-auto mt-12 px-4">
        <div className="backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-white/5 transition-colors duration-200"
          >
            <h2 className="text-sm md:text-base font-bold text-emerald-300">
              {t.calcHowItWorksTitle}
            </h2>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-emerald-300 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-emerald-300 flex-shrink-0" />
            )}
          </button>

          {isExpanded && (
            <div className="px-3 md:px-4 pb-3 md:pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-emerald-100/90 leading-relaxed text-[10px]">
                {t.calcHowItWorks}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
