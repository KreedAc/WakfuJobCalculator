import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';

interface Props {
  labels: { light: string; dark: string; toggle: string };
  /** icon only, or icon + the name of the theme it switches to */
  withLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ labels, withLabel, className = '' }: Props) {
  const [theme, toggle] = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;
  const next = theme === 'dark' ? labels.light : labels.dark;
  return (
    <button
      type="button"
      onClick={toggle}
      title={labels.toggle}
      aria-label={`${labels.toggle}: ${next}`}
      className={withLabel ? `btn ${className}` : `icon-btn ${className}`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {withLabel && <span>{next}</span>}
    </button>
  );
}
