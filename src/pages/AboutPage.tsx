import { PageSeo } from '../components/PageSeo';
import { type Language } from '../constants/translations';
import { aboutContent } from '../content/about';

interface AboutPageProps {
  language: Language;
}

export function AboutPage({ language }: AboutPageProps) {

  const content = aboutContent[language];

  return (
    <>
      <PageSeo title={content.title} description={content.description} path="/about" />

      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="page-title mb-4">
            {content.title}
          </h1>
          <p className="text-emerald-100/70 text-center text-lg mb-12">
            {content.description}
          </p>

          <div className="space-y-8">
            {content.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-200">
                      {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="text-emerald-100/80 leading-relaxed">
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul className="space-y-2 mt-4">
                      {section.items.map((item, itemIdx) => (
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
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-center text-emerald-200/80 text-sm leading-relaxed">
              <strong className="text-emerald-300">Disclaimer:</strong> WAKFU is an MMORPG published by Ankama.
              This is an unofficial fan-made website with no connection to Ankama.
              All game content, artwork, and trademarks are property of Ankama.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
