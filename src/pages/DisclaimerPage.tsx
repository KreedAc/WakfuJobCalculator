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

      <div className="max-w-3xl">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="page-title">
                {pageContent.title}
              </h1>
              <p className="text-subtle text-sm mt-1">
                {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          <div className="bg-primary/10 border border-line rounded-2xl p-6 mb-8">
            <p className="text-muted leading-relaxed">
              {pageContent.intro}
            </p>
          </div>

          <div className="space-y-4">
            {pageContent.sections.map((section, idx) => (
              <div
                key={idx}
                className="card p-5 md:p-6"
              >
                <h2 className="section-title text-xl mb-4">
                  {section.title}
                </h2>
                <p className="text-muted leading-relaxed">
                  {section.content}
                </p>

                {section.details && (
                  <ul className="space-y-2 mt-4">
                    {section.details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="text-primary mt-1.5">⚠</span>
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{adNote}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.recommendation && (
                  <p className="text-muted leading-relaxed mt-4 text-sm font-medium bg-primary/10 p-4 rounded-lg border border-line">
                    {section.recommendation}
                  </p>
                )}

                {section.note && (
                  <p className="text-muted leading-relaxed mt-4 text-sm italic">
                    {section.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/15 border-2 border-line rounded-2xl">
            <p className="text-fg font-semibold leading-relaxed">
              {pageContent.finalNote}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
