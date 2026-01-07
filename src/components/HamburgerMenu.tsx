import { Menu, Hammer, Scroll } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
  navCalcLabel: string;
  navSubliLabel: string;
}

export function HamburgerMenu({
  isOpen,
  onToggle,
  currentPath,
  navCalcLabel,
  navSubliLabel
}: HamburgerMenuProps) {
  return (
    <div className="relative">
      <button
        id="hamburger-btn"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/10 border border-white/20 backdrop-blur shadow transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      {isOpen && (
        <div
          id="hamburger-menu"
          role="menu"
          className="absolute left-0 mt-2 w-64 rounded-xl overflow-hidden border border-white/20 bg-gray-900/95 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Navigation</p>
          </div>
          <Link
            to="/"
            className={`w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5 flex items-center gap-2 ${currentPath === '/' ? 'bg-white/10 text-emerald-300' : ''}`}
          >
            <Hammer className="w-4 h-4" />
            {navCalcLabel}
          </Link>
          <Link
            to="/sublimations"
            className={`w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5 flex items-center gap-2 ${currentPath === '/sublimations' ? 'bg-white/10 text-emerald-300' : ''}`}
          >
            <Scroll className="w-4 h-4" />
            {navSubliLabel}
          </Link>
          <button disabled className="w-full text-left px-4 py-3 opacity-50 cursor-not-allowed text-sm font-medium">Work in progress</button>
        </div>
      )}
    </div>
  );
}
