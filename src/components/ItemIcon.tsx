import { useState } from 'react';
import { getItemIconUrl } from '../lib/wakfuData';
import type { EquipmentItem } from '../lib/builder';

/** Official item icon, with the first letters of the name as a fallback. */
export function ItemIcon({ item, size = 40 }: { item: EquipmentItem; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (!item.gfx || failed) {
    return (
      <span
        className="flex items-center justify-center rounded bg-surface2 text-primary text-[10px] font-bold shrink-0"
        style={{ width: size, height: size }}
        title={item.name}
      >
        {item.name.slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={getItemIconUrl(item.gfx)}
      alt={item.name}
      title={item.name}
      width={size}
      height={size}
      loading="lazy"
      className="rounded object-contain bg-surface2 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}
