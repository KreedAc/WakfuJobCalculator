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
    <nav className="flex items-center gap-2 backdrop-blur-xl bg-gray-900/60 border border-white/10 shadow-xl rounded-2xl px-4 py-2">
      <Link
        to="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'text-emerald-100/80 hover:bg-white/10 hover:text-emerald-200'
        }`}
      >
        <Hammer className="w-4 h-4" />
        <span className="hidden sm:inline">{navCalcLabel}</span>
      </Link>

      <Link
        to="/sublimations"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/sublimations'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'text-emerald-100/80 hover:bg-white/10 hover:text-emerald-200'
        }`}
      >
        <Scroll className="w-4 h-4" />
        <span className="hidden sm:inline">{navSubliLabel}</span>
      </Link>

      <Link
        to="/items-craft-guide"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPath === '/items-craft-guide'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'text-emerald-100/80 hover:bg-white/10 hover:text-emerald-200'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span className="hidden sm:inline">{navItemsCraftLabel}</span>
      </Link>
    </nav>
  );
}
