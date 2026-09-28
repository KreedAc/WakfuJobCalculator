import { PageSeo } from '../components/PageSeo';
import { AlertTriangle } from 'lucide-react';
import { type Language } from '../constants/translations';
import { disclaimerContent } from '../content/disclaimer';

interface DisclaimerPageProps {
  language: Language;
}

export function DisclaimerPage({ language }: DisclaimerPageProps) {

  const pageContent = disclaimerContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={"Important disclaimer for Wakfu Job Calculator. Read about limitations, accuracy, and terms of use."} path="/disclaimer" />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="page-title">
                {pageContent.title}
              </h1>
              <p className="text-emerald-100/60 text-sm mt-1">
                {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <p className="text-emerald-100/90 leading-relaxed">
              {pageContent.intro}
            </p>
          </div>

          <div className="space-y-8">
            {pageContent.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-emerald-200 mb-4">
                  {section.title}
                </h2>
                <p className="text-emerald-100/80 leading-relaxed">
                  {section.content}
                </p>

                {section.details && (
                  <ul className="space-y-2 mt-4">
                    {section.details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.warnings && (
                  <ul className="space-y-2 mt-4">
                    {section.warnings.map((warning, warnIdx) => (
                      <li
                        key={warnIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.points && (
                  <ul className="space-y-2 mt-4">
                    {section.points.map((point, pointIdx) => (
                      <li
                        key={pointIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.notes && (
                  <ul className="space-y-2 mt-4">
                    {section.notes.map((note, noteIdx) => (
                      <li
                        key={noteIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.disclaimers && (
                  <ul className="space-y-2 mt-4">
                    {section.disclaimers.map((disclaimer, disclaimerIdx) => (
                      <li
                        key={disclaimerIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{disclaimer}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.liabilities && (
                  <ul className="space-y-2 mt-4">
                    {section.liabilities.map((liability, liabilityIdx) => (
                      <li
                        key={liabilityIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{liability}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.warranties && (
                  <ul className="space-y-2 mt-4">
                    {section.warranties.map((warranty, warrantyIdx) => (
                      <li
                        key={warrantyIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{warranty}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.adNotes && (
                  <ul className="space-y-2 mt-4">
                    {section.adNotes.map((adNote, adNoteIdx) => (
                      <li
                        key={adNoteIdx}
                        className="flex items-start gap-2 text-emerald-100/70 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{adNote}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.recommendation && (
                  <p className="text-emerald-100/80 leading-relaxed mt-4 text-sm font-medium bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    {section.recommendation}
                  </p>
                )}

                {section.note && (
                  <p className="text-emerald-100/70 leading-relaxed mt-4 text-sm italic">
                    {section.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-emerald-500/15 border-2 border-emerald-500/30 rounded-2xl">
            <p className="text-center text-emerald-200 font-semibold leading-relaxed">
              {pageContent.finalNote}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
