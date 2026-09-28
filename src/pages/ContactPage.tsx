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

      <div className="max-w-3xl">
        <div>
          <h1 className="page-title mb-4">
            {pageContent.title}
          </h1>
          <p className="page-subtitle mb-8">
            {pageContent.description}
          </p>

          <div className="space-y-4">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="card p-5 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="section-title text-xl">
                      {section.title}
                    </h2>
                  </div>

                  <p className="text-muted leading-relaxed">
                    {section.content}
                  </p>

                  {section.action && (
                    <p className="text-primary font-medium mt-3">
                      {section.action}
                    </p>
                  )}

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
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <p className="text-muted text-sm leading-relaxed">
                <strong className="text-primary">Important:</strong> {pageContent.note}
              </p>
            </div>

            <div className="text-muted text-sm">
              {pageContent.credits}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
