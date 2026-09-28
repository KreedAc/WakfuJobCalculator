import { PageSeo } from '../components/PageSeo';
import { Link } from 'react-router-dom';
import { type Language } from '../constants/translations';
import { guidesContent } from '../content/guides';

interface GuidesPageProps {
  language: Language;
}

export function GuidesPage({ language }: GuidesPageProps) {

  const pageContent = guidesContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={pageContent.description} path="/guides" />

      <div className="max-w-5xl">
        <div>
          <h1 className="page-title mb-4">
            {pageContent.title}
          </h1>
          <p className="page-subtitle mb-8">
            {pageContent.description}
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-12">
            <p className="text-muted leading-relaxed">
              {pageContent.intro}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pageContent.guides.map((guide, idx) => {
              const IconComponent = guide.icon;
              return (
                <Link
                  key={idx}
                  to={`/guides/${guide.slug}`}
                  className="card p-5 md:p-6 hover:bg-surface2 hover:border-line transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="section-title mb-2 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h2>
                      <span className="text-primary text-xs font-medium">
                        {guide.readTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  <div className="space-y-1">
                    {guide.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="flex items-center gap-2 text-subtle text-xs"
                      >
                        <span className="text-primary">•</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
