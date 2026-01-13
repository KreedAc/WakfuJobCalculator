import fs from "node:fs";

const items = JSON.parse(fs.readFileSync("public/data/items.compact.json","utf8"));
const recipes = JSON.parse(fs.readFileSync("public/data/recipes.compact.json","utf8"));

const itemSet = new Set(items.map(i => i.id));
let missing = 0;

for (const r of recipes) {
  if (!itemSet.has(r.resultItemId)) missing++;
  for (const ing of r.ingredients) if (!itemSet.has(ing.itemId)) missing++;
}

console.log({ items: items.length, recipes: recipes.length, missingRefs: missing });
console.log("sample item:", items[0]);
console.log("sample recipe:", recipes[0]);
