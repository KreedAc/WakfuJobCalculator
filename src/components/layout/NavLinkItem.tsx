import { Link } from 'react-router-dom';
import type { NavItem } from '../../lib/navigation';

interface Props {
  item: NavItem;
  label: string;
  active: boolean;
  soon: string;
  newBadge: string;
}

export function NavLinkItem({ item, label, active, soon, newBadge }: Props) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-[14.5px] font-medium transition-colors
        ${active
          ? 'bg-primary/10 text-fg shadow-[inset_3px_0_0_rgb(var(--primary))]'
          : 'text-muted hover:text-fg hover:bg-surface2'}`}
    >
      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : ''}`} />
      <span className="truncate">{label}</span>
      {item.wip && <span className="badge ml-auto">{soon}</span>}
      {item.isNew && !item.wip && <span className="badge badge-accent ml-auto">{newBadge}</span>}
    </Link>
  );
}
