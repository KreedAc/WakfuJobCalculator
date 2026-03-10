import { useState } from 'react';
import { BookOpen, Hammer, Scroll } from 'lucide-react';
import type { Language } from '../constants/translations';
import type { ProfessionId } from '../constants/professions';
import { PROFESSION_IDS, PROFESSION_NAMES, PROFESSION_RECIPES } from '../constants/professions';
import { LEVEL_RANGES, type LevelRange } from '../constants/levelRanges';

interface Translations {
  selectProfession: string;
  selectRange: string;
  recipe: string;
  expPerItem: string;
  expPlaceholder: string;
  calculate: string;
  resultsFor: string;
  firstResource: string;
  secondResource: string;
  craftsNeeded: string;
  xpDiff: string;
  alert: string;
  title: string;
  subtitle: string;
}

interface CalculatorProps {
  language: Language;
  translations: Translations;
}

interface CalculationResult extends LevelRange {
  selectedProfession: ProfessionId;
  craftCount: number;
  resourceCount: number;
}

export function Calculator({ language, translations: t }: CalculatorProps) {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<ProfessionId | ''>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);
    if (!expItem || expItem <= 0 || !selectedRange || !selectedProfession) {
      alert(t.alert);
      return;
    }
    const selected = LEVEL_RANGES.find(r => r.range === selectedRange);
    if (!selected) return;
    const craftCount = Math.ceil(selected.expDiff / expItem);
    const resourceCount = craftCount * (selectedProfession === 'Leather Dealer' ? 4 : 5);
    setResult({
      ...selected,
      selectedProfession: selectedProfession as ProfessionId,
      craftCount,
      resourceCount
    });
  }

  const currentRangeRecipeObj = LEVEL_RANGES.find(r => r.range === selectedRange)?.recipe;
  const currentRangeRecipe = currentRangeRecipeObj ? currentRangeRecipeObj[language] : t.recipe;
  const currentProfessionRecipe = selectedProfession ? PROFESSION_RECIPES[language][selectedProfession as ProfessionId] : '';
  const recipeDisplay = `${currentRangeRecipe}${currentProfessionRecipe ? `  ${currentProfessionRecipe}` : ''}`;

  return (
    <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in duration-500">
      <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_8px_12px_rgba(0,0,0,0.3)] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-100 to-blue-200">
        {t.title}
      </h1>
      <p className="text-slate-800/90 mb-10 text-center max-w-2xl text-lg leading-relaxed drop-shadow-lg">
        {t.subtitle}
      </p>

      <form onSubmit={handleCalculate} className="glass rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-sky-200 ml-1">{t.selectProfession}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-sky-300">
                <Hammer className="w-5 h-5" />
              </div>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value as ProfessionId)}
                className="glass-soft w-full p-4 pl-12 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 appearance-none cursor-pointer transition-all duration-200"
                required
              >
                <option value="" className="bg-gray-900 text-gray-400">-- {t.selectProfession} --</option>
                {PROFESSION_IDS.map((p) => (
                  <option key={p} value={p} className="bg-gray-900">
                    {PROFESSION_NAMES[language][p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-sky-200 ml-1">{t.selectRange}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-sky-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="glass-soft w-full p-4 pl-12 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 appearance-none cursor-pointer transition-all duration-200"
                required
              >
                <option value="" className="bg-gray-900 text-gray-400">-- {t.selectRange} --</option>
                {LEVEL_RANGES.map((r, i) => (
                  <option key={i} value={r.range} className="bg-gray-900">{r.range}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-sky-200 ml-1">{t.recipe}</label>
            <div className="glass-soft p-4 rounded-xl text-slate-800 font-medium flex items-center gap-3">
              <Scroll className="w-5 h-5 text-sky-300" />
              {recipeDisplay}
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-sky-200 ml-1">{t.expPerItem}</label>
            <div className="relative">
              <input
                type="number"
                value={expPerItem}
                onChange={(e) => setExpPerItem(e.target.value)}
                placeholder={t.expPlaceholder}
                className="glass-soft w-full p-4 rounded-xl text-slate-800 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-200"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-sky-300/70 text-sm font-medium">
                XP
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:from-sky-600 active:to-blue-700 text-slate-800 shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl"
        >
          {t.calculate}
        </button>
      </form>

      {result && (
        <div className="mt-8 glass-strong rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-white/5 to-white/10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 flex-wrap">
              <Hammer className="w-6 h-6 text-sky-300" />
              {t.resultsFor} <span className="text-sky-200">{PROFESSION_NAMES[language][result.selectedProfession]}</span>
              <span className="text-sm px-3 py-1 glass-soft rounded-full text-slate-800 ml-auto">
                {result.range}
              </span>
            </h2>
          </div>
          <div className="p-8">
            <ul className="space-y-4">
              <li className="flex items-center justify-between p-4 glass-soft rounded-xl">
                <span className="text-slate-800/80">{t.firstResource}</span>
                <span className="font-bold text-2xl text-slate-800 font-mono">{result.resourceCount.toLocaleString()}</span>
              </li>
              <li className="flex items-center justify-between p-4 glass-soft rounded-xl">
                <span className="text-slate-800/80">{t.secondResource}</span>
                <span className="font-bold text-2xl text-slate-800 font-mono">{result.resourceCount.toLocaleString()}</span>
              </li>
              <div className="my-2 border-t border-white/20" />
              <li className="flex items-center justify-between">
                <span className="text-sky-200 font-medium">{t.craftsNeeded}</span>
                <span className="font-bold text-3xl text-sky-300 font-mono drop-shadow-sm">
                  {result.craftCount.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-800/60 text-sm">{t.xpDiff}</span>
                <span className="font-medium text-slate-800/60 font-mono">{result.expDiff.toLocaleString()} XP</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
