const fs = require('fs');

const map = JSON.parse(fs.readFileSync('image_mapping.json', 'utf8'));
let code = fs.readFileSync('src/context/CatalogContext.jsx', 'utf8');

const productsRegex = /const initialProducts = (\[[\s\S]*?\]);/;
const match = code.match(productsRegex);
if (!match) {
  console.log("Could not find initialProducts");
  process.exit(1);
}

const initialProducts = eval(match[1]);

initialProducts.forEach(product => {
  const name = product.name.trim();
  if (map[name]) {
    product.images = map[name];
    delete product.image;
  } else {
    product.images = [];
    delete product.image;
  }
});

code = code.replace(productsRegex, `const initialProducts = ${JSON.stringify(initialProducts, null, 2)};`);
code = code.replace(/const STORAGE_KEY = 'nura_catalog_v2';/g, "const STORAGE_KEY = 'nura_catalog_v3';");

fs.writeFileSync('src/context/CatalogContext.jsx', code);
console.log("Images injected successfully!");
