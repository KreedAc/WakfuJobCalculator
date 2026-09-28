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

      <div className="max-w-3xl">
        <div>
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-primary hover:text-fg mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{pageContent.backToGuides}</span>
          </Link>

          <h1 className="page-title mb-2">
            {pageContent.title}
          </h1>
          <p className="text-subtle text-sm mb-8">{pageContent.lastUpdated}</p>

          <div className="space-y-4">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div key={idx} className="card p-5 md:p-6">
                  {IconComponent && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="section-title text-xl">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  {!IconComponent && (
                    <h2 className="section-title text-xl mb-4">
                      {section.title}
                    </h2>
                  )}

                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-muted leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-muted">
              Ready to start planning your profession journey? Use our{' '}
              <Link to="/" className="text-primary font-bold hover:underline">
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
