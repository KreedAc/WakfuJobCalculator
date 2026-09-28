import { Link } from 'react-router-dom';
import { Shirt, Users } from 'lucide-react';

/** Switch between the Builder and the Community builds gallery. */
export function BuilderTabs({ current, labels }: { current: 'builder' | 'gallery'; labels: { builder: string; gallery: string } }) {
  const tab = (to: string, active: boolean, Icon: typeof Shirt, label: string) => (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
        ${active ? 'bg-primary/20 text-fg border border-line' : 'text-subtle hover:text-fg border border-transparent'}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
  return (
    <nav className="flex gap-1 p-1 rounded-xl border border-line bg-bg2 w-fit" aria-label="Builder">
      {tab('/builder', current === 'builder', Shirt, labels.builder)}
      {tab('/builds', current === 'gallery', Users, labels.gallery)}
    </nav>
  );
}
