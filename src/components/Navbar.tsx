import { Hammer, Scroll, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentPath: string;
  navCalcLabel: string;
  navSubliLabel: string;
  navItemsCraftLabel: string;
}

export function Navbar({
  currentPath,
  navCalcLabel,
  navSubliLabel,
  navItemsCraftLabel
}: NavbarProps) {
  return (
    <nav className="flex items-center gap-2 backdrop-blur-xl bg-white/80 border border-emerald-500/25 shadow-xl rounded-2xl px-4 py-2">
      <Link
        to="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/'
            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
        }`}
      >
        <Hammer className="w-4 h-4" />
        <span className="hidden sm:inline">{navCalcLabel}</span>
      </Link>

      <Link
        to="/sublimations"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/sublimations'
            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
        }`}
      >
        <Scroll className="w-4 h-4" />
        <span className="hidden sm:inline">{navSubliLabel}</span>
      </Link>

      <Link
        to="/items-craft-guide"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/items-craft-guide'
            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span className="hidden sm:inline">{navItemsCraftLabel}</span>
      </Link>
    </nav>
  );
}
