import { Hammer, Scroll, Wrench, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentPath: string;
  navCalcLabel: string;
  navSubliLabel: string;
  navItemsCraftLabel: string;
  navTreasuresLabel: string;
}

function Btn({
  to,
  active,
  icon: Icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: any;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          : 'text-emerald-100/80 hover:bg-white/10 hover:text-emerald-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function Navbar({
  currentPath,
  navCalcLabel,
  navSubliLabel,
  navItemsCraftLabel,
  navTreasuresLabel,
}: NavbarProps) {
  return (
    <nav className="flex items-center gap-2 backdrop-blur-xl bg-gray-900/60 border border-white/10 shadow-xl rounded-2xl px-4 py-2">
      <Btn to="/" active={currentPath === '/'} icon={Hammer} label={navCalcLabel} />
      <Btn
        to="/sublimations"
        active={currentPath === '/sublimations'}
        icon={Scroll}
        label={navSubliLabel}
      />
      <Btn
        to="/items-craft-guide"
        active={currentPath === '/items-craft-guide'}
        icon={Wrench}
        label={navItemsCraftLabel}
      />
      <Btn
        to="/treasures"
        active={currentPath === '/treasures'}
        icon={Map}
        label={navTreasuresLabel}
      />
    </nav>
  );
}
