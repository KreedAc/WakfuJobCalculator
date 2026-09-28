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

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Cookie className="w-7 h-7 text-emerald-300" />
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

          <p className="text-emerald-100/80 leading-relaxed mb-8">
            {pageContent.intro}
          </p>

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
                  <p className="text-emerald-100/70 leading-relaxed mt-4 text-sm">
                    {section.details}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-emerald-100/80"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="mt-6 space-y-4">
                    {section.subsections.map((subsection, subIdx) => (
                      <div key={subIdx} className="pl-4 border-l-2 border-emerald-500/30">
                        <h3 className="text-lg font-semibold text-emerald-200 mb-2">
                          {subsection.title}
                        </h3>
                        <p className="text-emerald-100/70 text-sm leading-relaxed">
                          {subsection.content}
                        </p>
                        {subsection.examples && (
                          <p className="text-emerald-100/60 text-xs leading-relaxed mt-2 italic">
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
                        className="flex items-start gap-2 text-emerald-100/80 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{provider}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.methods && (
                  <div className="mt-4 space-y-3">
                    {section.methods.map((method, methodIdx) => (
                      <div key={methodIdx} className="text-emerald-100/70 text-sm">
                        <span className="text-emerald-300 font-medium">
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
                        className="flex items-start gap-2 text-emerald-100/80 text-sm"
                      >
                        <span className="text-emerald-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="text-emerald-100/60 leading-relaxed mt-4 text-sm italic bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    {section.note}
                  </p>
                )}

                {section.commitment && (
                  <p className="text-emerald-100/70 leading-relaxed mt-4 text-sm">
                    {section.commitment}
                  </p>
                )}

                {section.lastUpdate && (
                  <p className="text-emerald-100/60 leading-relaxed mt-4 text-sm">
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
