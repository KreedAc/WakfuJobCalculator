import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  /** buttons on the right (below the title on phones) */
  actions?: ReactNode;
  /** small line above the title (credit, badge…) */
  eyebrow?: ReactNode;
  className?: string;
}

/** Page title block shared by every page: left-aligned, one h1. */
export function PageHeader({ title, subtitle, actions, eyebrow, className = '' }: Props) {
  return (
    <header className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 md:mb-8 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
