import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { getItemIconUrl } from '../lib/wakfuData';

interface Props {
  /** graphic id (falls back to the item id) */
  gfx?: number | null;
  itemId: number;
  size: number;
  className?: string;
}

/**
 * Item icon with fallbacks: Ankama's image server first, then the community
 * mirror, then a neutral placeholder if neither has the picture.
 */
export function ItemImage({ gfx, itemId, size, className = '' }: Props) {
  const id = gfx ?? itemId;
  const [source, setSource] = useState<'ankama' | 'wakassets' | 'none'>('ankama');
  useEffect(() => setSource('ankama'), [id]);

  const box = `rounded-lg bg-surface2 border border-line object-contain shrink-0 ${className}`;
  if (source === 'none') {
    return (
      <span className={`${box} grid place-items-center text-subtle`} style={{ width: size, height: size }}>
        <Package style={{ width: size * 0.55, height: size * 0.55 }} />
      </span>
    );
  }
  return (
    <img
      src={getItemIconUrl(id, source)}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      className={box}
      style={{ width: size, height: size }}
      onError={() => setSource((s) => (s === 'ankama' ? 'wakassets' : 'none'))}
    />
  );
}
