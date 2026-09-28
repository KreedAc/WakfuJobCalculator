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

      <div className="max-w-3xl">
        <div>
          <h1 className="page-title mb-4">
            {content.title}
          </h1>
          <p className="page-subtitle mb-8">
            {content.description}
          </p>

          <div className="space-y-4">
            {content.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="card p-5 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="section-title text-xl">
                      {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="text-muted leading-relaxed">
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul className="space-y-2 mt-4">
                      {section.items.map((item, itemIdx) => (
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
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Disclaimer:</strong> WAKFU is an MMORPG published by Ankama.
              This is an unofficial fan-made website with no connection to Ankama.
              All game content, artwork, and trademarks are property of Ankama.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
