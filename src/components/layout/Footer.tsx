import { Link } from 'react-router-dom';
import { SHELL } from '../../content/shell';
import type { Language } from '../../constants/translations';

export function Footer({ language }: { language: Language }) {
  const f = SHELL[language].footer;
  const links: [string, string][] = [
    ['/about', f.about], ['/changelog', f.changelog], ['/contact', f.contact],
    ['/privacy', f.privacy], ['/terms', f.terms], ['/cookies', f.cookies], ['/disclaimer', f.legal],
  ];
  return (
    <footer className="mt-16 border-t border-line pt-6 pb-4 text-[13px] text-subtle">
      <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className="font-medium text-muted hover:text-fg transition-colors">{label}</Link>
        ))}
      </nav>
      <p className="max-w-3xl leading-relaxed">{f.disclaimer}</p>
      <p className="mt-2">© {new Date().getFullYear()} · {f.madeBy}</p>
    </footer>
  );
}
