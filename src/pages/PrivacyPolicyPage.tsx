import { PageSeo } from '../components/PageSeo';
import { Shield } from 'lucide-react';
import { type Language } from '../constants/translations';
import { privacyPolicyContent } from '../content/privacy-policy';

interface PrivacyPolicyPageProps {
  language: Language;
}

export function PrivacyPolicyPage({ language }: PrivacyPolicyPageProps) {

  const pageContent = privacyPolicyContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={`Privacy Policy for Wakfu Job Calculator. Learn about how we collect, use, and protect your data.`} path="/privacy" />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-emerald-300" />
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

          <div className="space-y-8 mt-10">
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

                {section.additional && (
                  <p className="text-emerald-100/70 leading-relaxed mt-4 text-sm">
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
