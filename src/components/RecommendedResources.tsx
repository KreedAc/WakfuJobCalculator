import { ArrowUpRight } from 'lucide-react';
import { RESOURCES, RESOURCES_T } from '../content/resources';
import type { Language } from '../constants/translations';

/** Links to other Wakfu sites, opened in a new tab. */
export function RecommendedResources({ language, className = '' }: { language: Language; className?: string }) {
  const t = RESOURCES_T[language];
  return (
    <section className={className} aria-labelledby="resources-title">
      <h2 id="resources-title" className="section-title">{t.title}</h2>
      <p className="text-sm text-muted mt-1 mb-4">{t.subtitle}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {RESOURCES.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card group p-5 flex flex-col gap-2 transition-colors hover:border-line-strong hover:bg-surface2"
          >
            <span className="flex items-center gap-2 font-display font-bold text-base text-fg">
              {r.name}
              <ArrowUpRight className="w-4 h-4 text-subtle group-hover:text-primary transition-colors" />
            </span>
            <span className="text-[14px] text-muted leading-snug">{r.desc[language]}</span>
            <span className="mt-auto pt-1 text-xs text-primary font-medium">{r.host}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
