import { PageSeo } from '../components/PageSeo';
import { type Language } from '../constants/translations';
import { contactContent } from '../content/contact';

interface ContactPageProps {
  language: Language;
}

export function ContactPage({ language }: ContactPageProps) {

  const pageContent = contactContent[language];

  return (
    <>
      <PageSeo title={pageContent.title} description={pageContent.description} path="/contact" />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="page-title mb-4">
            {pageContent.title}
          </h1>
          <p className="text-emerald-100/70 text-center text-lg mb-12">
            {pageContent.description}
          </p>

          <div className="space-y-8">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-emerald-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-200">
                      {section.title}
                    </h2>
                  </div>

                  <p className="text-emerald-100/80 leading-relaxed">
                    {section.content}
                  </p>

                  {section.action && (
                    <p className="text-emerald-300 font-medium mt-3">
                      {section.action}
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

                  {section.additional && (
                    <p className="text-emerald-100/70 leading-relaxed mt-4 text-sm">
                      {section.additional}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="text-center text-emerald-200/90 text-sm leading-relaxed">
                <strong className="text-emerald-300">Important:</strong> {pageContent.note}
              </p>
            </div>

            <div className="text-center text-emerald-200/70 text-sm">
              {pageContent.credits}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
