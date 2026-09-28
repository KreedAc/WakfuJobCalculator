import { PageSeo } from '../../components/PageSeo';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type Language } from '../../constants/translations';
import { beginnersGuideContent } from '../../content/beginners-guide-professions';

interface BeginnersGuideProfessionsProps {
  language: Language;
}

export function BeginnersGuideProfessions({ language }: BeginnersGuideProfessionsProps) {

  const pageContent = beginnersGuideContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={pageContent.description} path="/guides/beginners-guide-professions" />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{pageContent.backToGuides}</span>
          </Link>

          <h1 className="page-title mb-2">
            {pageContent.title}
          </h1>
          <p className="text-emerald-100/60 text-sm mb-8">{pageContent.lastUpdated}</p>

          <div className="space-y-10">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  {IconComponent && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-emerald-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-emerald-200">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  {!IconComponent && (
                    <h2 className="text-2xl font-bold text-emerald-200 mb-4">
                      {section.title}
                    </h2>
                  )}

                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-emerald-100/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-center text-emerald-200/90">
              Ready to start planning your profession journey? Use our{' '}
              <Link to="/" className="text-emerald-300 font-bold hover:underline">
                XP Calculator
              </Link>{' '}
              to find the most efficient leveling path!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
