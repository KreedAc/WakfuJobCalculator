❯ node scripts/build-wakfu-data.mjs

Wakfu version: 1.90.1.48
Downloading recipes.json ...
Downloading recipeIngredients.json ...
Downloading recipeResults.json ...
recipes.compact: 5543
needed item ids: 8371
Streaming items.json and filtering ...

items.compact: 0
DONE ✅  Files in public/data/

~/project 5s
❯ head -c 200 public/data/items.compact.json && echo

[]

~/project
❯ python -c "import json; print(len(json.load(open('public/data/items.compact.json'))))"

jsh: "foo(" must be followed by )

~/project