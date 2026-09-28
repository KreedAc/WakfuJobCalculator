// Site navigation, shared by the sidebar, the mobile tab bar, the "More"
// sheet, breadcrumbs, the Home tool grid and the search palette.
import {
  LayoutDashboard, Hammer, Wrench, Scroll, Swords, Shirt, Map, BookOpen, type LucideIcon,
} from 'lucide-react';
import { BUILDER_WIP } from './featureFlags';
import type { NavGroupId, NavId } from '../content/shell';

export interface NavItem {
  id: NavId;
  path: string;
  icon: LucideIcon;
  /** other paths that belong to this item (e.g. guide subpages) */
  also?: string[];
  wip?: boolean;
  isNew?: boolean;
}

export const HOME: NavItem = { id: 'home', path: '/', icon: LayoutDashboard };

export const NAV_GROUPS: { id: NavGroupId; items: NavItem[] }[] = [
  {
    id: 'crafting',
    items: [
      { id: 'xp', path: '/xp-calculator', icon: Hammer },
      { id: 'craft', path: '/items-craft-guide', icon: Wrench },
    ],
  },
  {
    id: 'equipment',
    items: [
      { id: 'subli', path: '/sublimations', icon: Scroll },
      { id: 'combat', path: '/combat-calc', icon: Swords },
      { id: 'builder', path: '/builder', icon: Shirt, also: ['/builds'], wip: BUILDER_WIP },
    ],
  },
  {
    id: 'explore',
    items: [
      { id: 'treasures', path: '/treasures', icon: Map },
      { id: 'guides', path: '/guides', icon: BookOpen },
    ],
  },
];

export const ALL_NAV: NavItem[] = [HOME, ...NAV_GROUPS.flatMap((g) => g.items)];

export function isActive(item: NavItem, path: string): boolean {
  if (item.path === '/') return path === '/';
  return [item.path, ...(item.also ?? [])].some((p) => path === p || path.startsWith(`${p}/`));
}

/** The nav item and group for a path (for breadcrumbs). */
export function locate(path: string): { item: NavItem; group?: NavGroupId } | null {
  if (path === '/') return { item: HOME };
  for (const g of NAV_GROUPS) {
    const item = g.items.find((i) => isActive(i, path));
    if (item) return { item, group: g.id };
  }
  return null;
}
