const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'perfumes');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const map = JSON.parse(fs.readFileSync('image_mapping.json', 'utf8'));

// Helper to download following redirects
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status: ${res.statusCode}`));
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  const localMap = {};
  
  for (const product in map) {
    localMap[product] = [];
    const urls = map[product];
    
    for (let i = 0; i < urls.length; i++) {
      const match = urls[i].match(/id=([^&]+)/);
      if (!match) continue;
      
      const id = match[1];
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      // Clean product name for filesystem
      const safeName = product.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeName}_${i}.jpg`;
      const dest = path.join(publicDir, filename);
      
      console.log(`Downloading ${product} [${i+1}/${urls.length}]...`);
      try {
        await downloadFile(downloadUrl, dest);
        localMap[product].push(`/perfumes/${filename}`);
        console.log(` -> Saved ${filename}`);
      } catch (err) {
        console.error(` -> Error downloading ${filename}:`, err.message);
      }
    }
  }

  console.log('\nAll downloads complete. Updating catalog context...');
  
  // Inject local paths into CatalogContext.jsx
  let code = fs.readFileSync('src/context/CatalogContext.jsx', 'utf8');
  const productsRegex = /const initialProducts = (\[[\s\S]*?\]);/;
  const matchCode = code.match(productsRegex);
  
  if (matchCode) {
    const initialProducts = eval(matchCode[1]);
    initialProducts.forEach(p => {
      if (localMap[p.name]) {
        p.images = localMap[p.name];
      }
    });
    
    code = code.replace(productsRegex, `const initialProducts = ${JSON.stringify(initialProducts, null, 2)};`);
    code = code.replace(/const STORAGE_KEY = 'nura_catalog_v3';/g, "const STORAGE_KEY = 'nura_catalog_v4';");
    fs.writeFileSync('src/context/CatalogContext.jsx', code);
    console.log("Catalog updated successfully!");
  }
}

main().catch(console.error);
