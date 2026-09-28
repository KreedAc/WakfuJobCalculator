// URL format shared by the Builder and the Items Craft Guide:
// /items-craft-guide?items=12464,8047x2  (item id, optional "x<quantity>").

export interface CraftRow {
  itemId: number;
  qty: number;
}

export function formatCraftItems(rows: CraftRow[]): string {
  return rows.map((r) => (r.qty > 1 ? `${r.itemId}x${r.qty}` : String(r.itemId))).join(',');
}

export function parseCraftItems(value: string | null): CraftRow[] {
  if (!value) return [];
  const byId = new Map<number, number>();
  for (const part of value.split(',')) {
    const m = part.trim().match(/^(\d+)(?:x(\d+))?$/);
    if (!m) continue;
    const id = Number(m[1]);
    const qty = Math.min(999, Math.max(1, Number(m[2] ?? 1)));
    if (id > 0) byId.set(id, (byId.get(id) ?? 0) + qty);
  }
  return [...byId].map(([itemId, qty]) => ({ itemId, qty }));
}

export function craftGuideUrl(rows: CraftRow[]): string {
  return `/items-craft-guide?items=${formatCraftItems(rows)}`;
}
