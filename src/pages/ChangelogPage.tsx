import { PageSeo } from '../components/PageSeo';
import { Clock, Plus, Wrench, Bug, Sparkles } from 'lucide-react';
import { type Language } from '../constants/translations';
import { changelog, changelogContent, type ChangeType } from '../content/changelog';

interface ChangelogPageProps {
  language: Language;
}

export function ChangelogPage({ language }: ChangelogPageProps) {
  const content = changelogContent[language];

  const getChangeIcon = (type: ChangeType) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4" />;
      case 'improvement':
        return <Sparkles className="w-4 h-4" />;
      case 'fix':
        return <Bug className="w-4 h-4" />;
      case 'update':
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getChangeColor = (type: ChangeType) => {
    switch (type) {
      case 'feature':
        return 'bg-primary/20 border-line text-primary';
      case 'improvement':
        return 'bg-primary/15 border-primary/30 text-primary';
      case 'fix':
        return 'bg-warning/15 border-warning/30 text-warning';
      case 'update':
        return 'bg-success/15 border-success/30 text-success';
    }
  };

  return (
    <>
      <PageSeo title={content.title} description={content.description} path="/changelog" />

      <div className="max-w-3xl">
        <div>
          <h1 className="page-title mb-4">
            {content.title}
          </h1>
          <p className="page-subtitle mb-8">
            {content.description}
          </p>

          <div className="space-y-4">
            {changelog.map((entry) => (
              <div
                key={entry.version}
                className="card p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-primary font-bold text-lg">
                        v{entry.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-subtle text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {entry.changes.map((change, changeIdx) => (
                    <div
                      key={changeIdx}
                      className="flex items-start gap-3 group"
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${getChangeColor(change.type)}`}>
                        {getChangeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-semibold mb-1 ${getChangeColor(change.type).split(' ')[2]}`}>
                          {content.typeLabels[change.type]}
                        </div>
                        <p className="text-muted leading-relaxed">
                          {change.text[language]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-muted text-sm">
              {content.comingSoon}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
