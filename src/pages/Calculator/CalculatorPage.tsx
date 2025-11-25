import React, { useState } from "react";
import { Hammer, BookOpen } from "lucide-react";

const professions = [
  "Armorer",
  "Baker",
  "Chef",
  "Handyman",
  "Jeweler",
  "Leather Dealer",
  "Tailor",
  "Weapons Master",
] as const;

const levelRanges = [
  { range: "2 - 10", expDiff: 7500 },
  { range: "10 - 20", expDiff: 22500 },
  { range: "20 - 30", expDiff: 37500 },
  { range: "30 - 40", expDiff: 52500 },
  { range: "40 - 50", expDiff: 67500 },
  { range: "50 - 60", expDiff: 82500 },
  { range: "60 - 70", expDiff: 97500 },
  { range: "70 - 80", expDiff: 112500 },
  { range: "80 - 90", expDiff: 127500 },
  { range: "90 - 100", expDiff: 142500 },
  { range: "100 - 110", expDiff: 157500 },
  { range: "110 - 120", expDiff: 172500 },
  { range: "120 - 130", expDiff: 187500 },
  { range: "130 - 140", expDiff: 202500 },
  { range: "140 - 150", expDiff: 217500 },
  { range: "150 - 160", expDiff: 232500 },
];

const i18n = {
  en: {
    title: "Wakfu Crafting XP Calculator",
    subtitle:
      "Select your profession, choose a level range, and enter the EXP per crafted item.",
    selectProfession: "Select Profession",
    selectRange: "Select Level Range",
    expPerItem: "EXP per Crafted Item",
    expPlaceholder: "e.g. 150",
    calculate: "Calculate Required Crafts",
    resultsFor: "Results for",
    firstResource: "Collect the first resource quantity:",
    secondResource: "Collect the second resource quantity:",
    craftsNeeded: "Crafts Needed",
    xpDiff: "XP Difference",
    alert: "Please fill all fields and select a profession and level range.",
    createdBy: "Created by",
  },
} as const;

type Lang = keyof typeof i18n;

interface Result {
  range: string;
  expDiff: number;
  selectedProfession: string;
  craftCount: number;
  resourceCount: number;
}

export function CalculatorPage() {
  const [lang] = useState<Lang>("en");
  const t = i18n[lang];

  const [expPerItem, setExpPerItem] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);

    if (!expItem || expItem <= 0 || !selectedRange || !selectedProfession) {
      alert(t.alert);
      return;
    }

    const selected = levelRanges.find((r) => r.range === selectedRange);
    if (!selected) return;

    const craftCount = Math.ceil(selected.expDiff / expItem);
    const resourceCount = craftCount * 5;

    setResult({ ...selected, selectedProfession, craftCount, resourceCount });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl w-full mx-auto bg-black/60 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40">
            <Hammer className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-emerald-50 flex items-center gap-2">
              {t.title}
            </h2>
            <p className="text-sm text-emerald-100/80">{t.subtitle}</p>
          </div>
        </div>

        <form
          onSubmit={handleCalculate}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200">
                {t.selectProfession}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                  <Hammer className="w-4 h-4" />
                </span>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 text-emerald-50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                >
                  <option value="">-- {t.selectProfession} --</option>
                  {professions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200">
                {t.selectRange}
              </label>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 text-emerald-50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                <option value="">-- {t.selectRange} --</option>
                {levelRanges.map((r) => (
                  <option key={r.range} value={r.range}>
                    {r.range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-200">
              {t.expPerItem}
            </label>
            <input
              type="number"
              min={1}
              step={1}
              placeholder={t.expPlaceholder}
              value={expPerItem}
              onChange={(e) => setExpPerItem(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 text-emerald-50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg shadow-emerald-900/40 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            {t.calculate}
          </button>
        </form>

        {result && (
          <div className="mt-8 border border-emerald-500/40 rounded-2xl bg-black/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
              <Hammer className="w-5 h-5 text-emerald-400" />
              {t.resultsFor} {result.selectedProfession} ({result.range})
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-emerald-100/80">{t.firstResource}</span>
                <span className="font-mono text-lg text-emerald-200">
                  {result.resourceCount.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-emerald-100/80">{t.secondResource}</span>
                <span className="font-mono text-lg text-emerald-200">
                  {result.resourceCount.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                <span className="text-emerald-100">{t.craftsNeeded}</span>
                <span className="font-mono text-2xl text-emerald-400">
                  {result.craftCount.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-emerald-100/70">{t.xpDiff}</span>
                <span className="font-mono text-emerald-200">
                  {result.expDiff.toLocaleString()} XP
                </span>
              </li>
            </ul>
          </div>
        )}

        <p className="mt-6 text-[11px] text-emerald-200/50 text-center">
          {new Date().getFullYear()} {t.createdBy} KreedAc &amp; LadyKreedAc
        </p>
      </div>
    </div>
  );
}
