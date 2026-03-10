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
    <div className="w-full flex flex-col items-center px-4">
      <Calculator language={language} translations={t} />

      <div className="max-w-4xl w-full mx-auto mt-12">
        <div className="glass rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-white/5 transition-all duration-200"
          >
            <h2 className="text-sm md:text-base font-bold text-cyan-200">
              {t.calcHowItWorksTitle}
            </h2>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-cyan-200 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-cyan-200 flex-shrink-0" />
            )}
          </button>

          {isExpanded && (
            <div className="px-3 md:px-4 pb-3 md:pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-white/90 leading-relaxed text-[10px]">
                {t.calcHowItWorks}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
