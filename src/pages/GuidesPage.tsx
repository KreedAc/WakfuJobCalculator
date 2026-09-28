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

      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="page-title mb-4">
            {pageContent.title}
          </h1>
          <p className="text-emerald-100/70 text-center text-lg mb-8">
            {pageContent.description}
          </p>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-12">
            <p className="text-emerald-100/90 leading-relaxed">
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
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-emerald-200 mb-2 group-hover:text-emerald-300 transition-colors">
                        {guide.title}
                      </h2>
                      <span className="text-emerald-400/60 text-xs font-medium">
                        {guide.readTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-emerald-100/70 text-sm leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  <div className="space-y-1">
                    {guide.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="flex items-center gap-2 text-emerald-100/60 text-xs"
                      >
                        <span className="text-emerald-400">•</span>
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
