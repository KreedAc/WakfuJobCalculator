import { useEffect } from 'react';

export function useClickOutside(
  elements: Array<{ id: string; onClose: () => void }>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(e: MouseEvent) {
      elements.forEach(({ id, onClose }) => {
        const menu = document.getElementById(`${id}-menu`);
        const btn = document.getElementById(`${id}-btn`);

        if (menu && btn && !menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
          onClose();
        }
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [elements, enabled]);
}
