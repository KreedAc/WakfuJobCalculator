import { PageSeo } from '../components/PageSeo';
import { Cookie } from 'lucide-react';
import { type Language } from '../constants/translations';
import { cookiePolicyContent } from '../content/cookie-policy';

interface CookiePolicyPageProps {
  language: Language;
}

export function CookiePolicyPage({ language }: CookiePolicyPageProps) {

  const pageContent = cookiePolicyContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={"Learn about how Wakfu Job Calculator uses cookies and similar technologies. Understand your privacy and control options."} path="/cookies" />

      <div className="max-w-3xl">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Cookie className="w-7 h-7 text-primary" />
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

          <p className="text-muted leading-relaxed mb-8">
            {pageContent.intro}
          </p>

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
                  <p className="text-muted leading-relaxed mt-4 text-sm">
                    {section.details}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-muted"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="mt-6 space-y-4">
                    {section.subsections.map((subsection, subIdx) => (
                      <div key={subIdx} className="pl-4 border-l-2 border-line">
                        <h3 className="text-lg font-semibold text-fg mb-2">
                          {subsection.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {subsection.content}
                        </p>
                        {subsection.examples && (
                          <p className="text-subtle text-xs leading-relaxed mt-2 italic">
                            {subsection.examples}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.providers && (
                  <ul className="space-y-2 mt-4">
                    {section.providers.map((provider, provIdx) => (
                      <li
                        key={provIdx}
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{provider}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.methods && (
                  <div className="mt-4 space-y-3">
                    {section.methods.map((method, methodIdx) => (
                      <div key={methodIdx} className="text-muted text-sm">
                        <span className="text-primary font-medium">
                          {method.split(':')[0]}:
                        </span>
                        <span> {method.split(':').slice(1).join(':')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.usage && (
                  <ul className="space-y-2 mt-4">
                    {section.usage.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="text-subtle leading-relaxed mt-4 text-sm italic bg-primary/10 p-3 rounded-lg border border-line">
                    {section.note}
                  </p>
                )}

                {section.commitment && (
                  <p className="text-muted leading-relaxed mt-4 text-sm">
                    {section.commitment}
                  </p>
                )}

                {section.lastUpdate && (
                  <p className="text-subtle leading-relaxed mt-4 text-sm">
                    {section.lastUpdate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
