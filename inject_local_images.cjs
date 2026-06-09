const fs = require('fs');
const path = require('path');

const imageMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'product_images_local.json'), 'utf8'));
const catalogPath = path.join(__dirname, 'src', 'context', 'CatalogContext.jsx');
let catalog = fs.readFileSync(catalogPath, 'utf8');

let replaced = 0;
let notFound = 0;

for (const [productName, images] of Object.entries(imageMap)) {
  // Skip NAUTICA VOYAGE - not in catalog
  if (productName === 'NAUTICA VOYAGE') continue;

  // Build the images array string
  const imagesStr = JSON.stringify(images, null, 6).replace(/^/gm, '    ').trim();

  // Find the product in the catalog and replace its images array
  // We need to find "name": "PRODUCT_NAME" and then replace the next "images": [...]
  const nameEscaped = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `("name":\\s*"${nameEscaped}"[\\s\\S]*?"images":\\s*)\\[[^\\]]*\\]`,
    ''
  );

  if (pattern.test(catalog)) {
    catalog = catalog.replace(pattern, `$1${imagesStr}`);
    replaced++;
  } else {
    console.log('NOT FOUND in catalog:', productName);
    notFound++;
  }
}

fs.writeFileSync(catalogPath, catalog);
console.log(`Replaced images for ${replaced} products`);
console.log(`Not found: ${notFound} products`);
