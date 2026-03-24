import { Hammer, Scroll, Wrench, Map, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentPath: string;
  navCalcLabel: string;
  navSubliLabel: string;
  navItemsCraftLabel: string;
  navTreasuresLabel: string;
  navCombatCalcLabel: string; // ← NUOVO
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
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        active
          ? 'glass-soft text-emerald-300 shadow-lg shadow-emerald-500/10'
          : 'text-emerald-100/80 hover:glass-soft hover:text-emerald-200 hover:shadow-md hover:shadow-emerald-500/5'
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
  navCombatCalcLabel, // ← NUOVO
}: NavbarProps) {
  return (
    <nav className="glass flex items-center gap-2 rounded-2xl px-4 py-2">
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
      <Btn
        to="/combat-calc"
        active={currentPath === '/combat-calc'}
        icon={Swords}
        label={navCombatCalcLabel}
      /> {/* ← NUOVO */}
    </nav>
  );
}
