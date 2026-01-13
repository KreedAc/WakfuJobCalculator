export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null;
  rarity?: number | null;
  source?: string;
};

export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "ankama" | "wakassets" = "ankama"
) {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId =
    typeof itemOrId === "number" ? null : (itemOrId.gfxId ?? null);

  // IMPORTANTISSIMO: dalle tue prove, funziona solo con gfxId.
  const key = gfxId && Number.isFinite(gfxId) ? gfxId : id;

  if (provider === "ankama") {
    // Nota: con id puro ti torna 403, con gfxId torna 200
    return `https://static.ankama.com/wakfu/portal/game/item/115/${key}.png`;
  }

  return `https://vertylo.github.io/wakassets/items/${key}.png`;
}
