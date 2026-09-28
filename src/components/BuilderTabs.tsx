import { Link } from 'react-router-dom';
import { Shirt, Users } from 'lucide-react';

/** Switch between the Builder and the Community builds gallery. */
export function BuilderTabs({ current, labels }: { current: 'builder' | 'gallery'; labels: { builder: string; gallery: string } }) {
  const tab = (to: string, active: boolean, Icon: typeof Shirt, label: string) => (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
        ${active ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40' : 'text-emerald-200/60 hover:text-emerald-200 border border-transparent'}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
  return (
    <nav className="glass rounded-2xl p-1 flex gap-1 w-fit mx-auto mb-6" aria-label="Builder">
      {tab('/builder', current === 'builder', Shirt, labels.builder)}
      {tab('/builds', current === 'gallery', Users, labels.gallery)}
    </nav>
  );
}
