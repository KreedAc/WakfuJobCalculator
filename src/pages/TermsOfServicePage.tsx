import { PageSeo } from '../components/PageSeo';
import { FileText } from 'lucide-react';
import { type Language } from '../constants/translations';
import { termsOfServiceContent } from '../content/terms-of-service';

interface TermsOfServicePageProps {
  language: Language;
}

export function TermsOfServicePage({ language }: TermsOfServicePageProps) {

  const pageContent = termsOfServiceContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={`Terms of Service for Wakfu Job Calculator. Read our terms and conditions for using the website.`} path="/terms" />

      <div className="max-w-3xl">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
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

          <div className="space-y-4 mt-6">
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

                {section.additional && (
                  <p className="text-muted leading-relaxed mt-4 text-sm">
                    {section.additional}
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
