const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images', 'products');
const allFiles = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

// Filter out IMG_ and Copia files
const namedFiles = allFiles.filter(f => !f.startsWith('IMG_') && !f.startsWith('Copia') && !f.startsWith('PRECIOS'));

// Mapping: filename patterns -> product name in catalog
const fileToProduct = {
  '9 AM DIVE': ' 9 AM DIVE EDP 100ML',
  '9 PM REBEL': ' 9 PM REBEL EDP 100ML',
  'AFNAN 9 PM': ' 9 PM MASC EDP 100ML',
  'AFNAN 9PM': ' 9 PM MASC EDP 100ML',
  'AL HARAMAIN AMBER OUD GOLD EDITION': 'AMBER OUD GOLD EDITION EDP 120ML',
  'AL NOBLE SAAFER': 'AL NOBLE SAFEER EDP 100ML',
  'AL WATANIAH DAR AL WARD': 'SABAH AL WARD 100ML',
  'ARMAF ODYSSEY LIMONI': 'ODYSSEY LIMONI EDP 100ML',
  'ARMAF ODYSSEY MANDARIN SKY': 'ODYSSEY MANDARIN SKY EDP 100ML',
  'ASDAAF ANDALEEB': 'ANDALEEB EDP 100ML',
  'BADEE AMESTHYST': "BADE'E AL OUD AMETHYST EDP 100ML",
  'BADEE AMHESTYST': "BADE'E AL OUD AMETHYST EDP 100ML",
  'BADEE FOR GLORY': "BADE'E AL OUD FOR GLORY EDP 100ML",
  'BADEE HONOR & GLORY': "BADE'E AL OUD HONOR & GLORY EDP 100ML",
  'BADEEE HONOR & GLORY': "BADE'E AL OUD HONOR & GLORY EDP 100ML",
  'BADEE NOBLE BLUSH': "BADE'E AL OUD NOBLE BLUSH EDP 100ML",
  'BADEE SUBLIME': "BADE'E AL OUD SUBLIME EDP 100ML",
  'BHARARA VIKING': 'VIKING BEIRUT EDP 100ML',
  'BOURBON': 'ASAD BOURBON EDP 100ML',
  'LATTAFA ASAD BOURBON': 'ASAD BOURBON EDP 100ML',
  'LATTAFA ASAD': 'ASAD EDP 100ML',
  'CLUB DE NUIT ICONIC': 'CLUB DE NUIT ICONIC EDP 105ML',
  'CLUB DE NUIT INTENSE MAN': 'CLUB DE NUIT INTENSE MAN EDT 105ML',
  'CLUB DE NUIT MILESTONE': 'CLUB DE NUIT MILESTONE EDP 105ML',
  'CLUB DE NUIT SILAGE': 'CLUB DE NUIT SILLAGE EDP 105ML',
  'CLUB DE NUIT URBAN MAN ELIXIR': 'CLUB DE NUIT URBAN MAN ELIXIR EDP 105ML',
  'CLUB DE NUIT WOMAN': 'CLUB DE NUIT WOMAN EDP 105ML',
  'CORAL BLUSH': 'CORAL BLUSH 80ML',
  'coral blush': 'CORAL BLUSH 80ML',
  'Coral blush': 'CORAL BLUSH 80ML',
  'ECLAIRE': 'ECLAIRE EDP 100ML',
  'LATTAFA ECLAIRE': 'ECLAIRE EDP 100ML',
  'EMEER': 'EMEER EDP 100ML',
  'FAKHAR BLACK': 'FAKHAR BLACK EDP 100ML',
  'FAKHAR EXTRAIT': 'FAKHAR EXTRAIT EDP 100ML',
  'FAKHAR WOMAN': 'FAKHAR WOMAN EDP 100ML',
  'HAWAS FOR HIM': 'HAWAS FOR HIM EDP 100ML',
  'RASASI HAWAS FOR HIM': 'HAWAS FOR HIM EDP 100ML',
  'JEAN LOWE NOIR': 'JEAN LOWE OMBRE EDP 100ML',
  'JPG LE MALE ELIXIR': 'LE MALE ELIXIR PARFUM 125ML',
  'JPG LE MALE LE PARFUM': 'LE MALE LE PARFUM 125ML',
  'LATTAFA CANDY MUSK': 'MUSK CANDY ROSE EDP 100ML',
  'LATTAFA HAYA': 'HAYA EDP 100ML',
  'LATTAFA HAYAATI': 'HAYAATI GOLD ELIXIR EDP 100ML',
  'LATTAFA KHAMRAH': 'KHAMRAH EDP 100ML',
  'LATTAFA MAYAR CHERRY': 'MAYAR CHERRY INTENSE 100ML',
  'LATTAFA MAYAR': 'MAYAR EDP 100ML',
  'LATTAFA ODYSSEY LIMONI': 'ODYSSEY LIMONI EDP 100ML',
  'LATTAFA THE KINGDOM': 'THE KINGDOM FOR MEN EDP 100ML',
  'MAHIIR BLACK': 'MAAHIR BLACK EDP 100ML',
  'MAHIIR GOLD': 'MAAHIR GOLD EDP 100ML',
  'MAHIR GOLD': 'MAAHIR GOLD EDP 100ML',
  'MAYAR CHERRY': 'MAYAR CHERRY INTENSE 100ML',
  'MAYAR': 'MAYAR EDP 100ML',
  'ODYSSEY CANDEE': 'ODYSSEY CANDEE EDP 100ML',
  'ODYSSEY LIMONI': 'ODYSSEY LIMONI EDP 100ML',
  'ODYSSEY MANDARIN SKY': 'ODYSSEY MANDARIN SKY EDP 100ML',
  'PHILOS PURA': 'PHILOS PURA EDP 100ML',
  'THE KINGDOM': 'THE KINGDOM FOR MEN EDP 100ML',
  'Ventana marine': 'VENTANA MARINE EDP 100ML',
  'Ventana Marine': 'VENTANA MARINE EDP 100ML',
  'YARA CANDY': 'YARA CANDY WOMAN EDP 100ML',
  'YARA MOI': 'YARA MOI EDP 100ML',
  'YARA TOUS': 'YARA TOUS EDP 100ML',
  'YARA WOMAN': 'YARA WOMAN EDP 100ML',
  'LATTAFA HAYA 2': 'HAYA EDP 100ML',
  'LATTAFA HAYA 4': 'HAYA EDP 100ML',
  'Nautica voyage': 'NAUTICA VOYAGE',
  'AFNAN 9 PM 3': ' 9 PM MASC EDP 100ML',
  'AFNAN 9 PM 5': ' 9 PM MASC EDP 100ML',
  'AFNAN 9PM 2': ' 9 PM MASC EDP 100ML',
  'AFNAN 9PM 4': ' 9 PM MASC EDP 100ML',
  'JPG LE MALE ELIXIR 2': 'LE MALE ELIXIR PARFUM 125ML',
  'JPG LE MALE LE PARFUM 2': 'LE MALE LE PARFUM 125ML',
};

// Build product -> images map
const productImages = {};

for (const file of namedFiles) {
  // Extract base name: remove extension and (N) suffix
  let baseName = file.replace(/\.(jpg|jpeg|png)$/i, '');
  baseName = baseName.replace(/\(\d+\)$/, '').trim();
  // Also handle double dots
  baseName = baseName.replace(/\.$/, '').trim();

  const productName = fileToProduct[baseName];
  if (!productName) {
    console.log('UNMAPPED:', baseName, '->', file);
    continue;
  }

  if (!productImages[productName]) productImages[productName] = [];
  // URL encode the filename for the web path
  const encodedFile = encodeURIComponent(file).replace(/%20/g, '%20');
  productImages[productName].push('/images/products/' + encodedFile);
}

// Limit to max 3 images per product
for (const key of Object.keys(productImages)) {
  if (productImages[key].length > 3) {
    productImages[key] = productImages[key].slice(0, 3);
  }
}

console.log('\n=== PRODUCT IMAGE MAPPING ===');
const sorted = Object.keys(productImages).sort();
for (const p of sorted) {
  console.log(`${p}: ${productImages[p].length} images`);
}
console.log('\nTotal products with images:', sorted.length);

// Save as JSON
fs.writeFileSync(path.join(__dirname, 'product_images_local.json'), JSON.stringify(productImages, null, 2));
console.log('Saved to product_images_local.json');
