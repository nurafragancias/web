const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Parsed from Drive HTML - valid IDs only (no -0-16 suffix)
const driveFiles = [
  { id: '1KgPXul6VN-pyVwM0kqgU3X-QBwC31wpF', name: '9 AM DIVE.jpg' },
  { id: '1gpFUB8gCY-fU_Kpml95pTPgjyGyXTgHX', name: '9 AM DIVE.jpg' },
  { id: '1ld0gVKqw1DwEO82-NhQb-UvhAS93jiiA', name: '9 AM DIVE.jpg' },
  { id: '1TOWuJPiqor1SL5VmcfRwwNVgPfl8J1n2', name: '9 PM REBEL.JPG' },
  { id: '1VjUCZg5J8MqXDpdoAoMR9vFwl2WwqH1-', name: '9 PM REBEL.JPG' },
  { id: '1XJyTvXL6lQedyOH4hJHJ0ElEDsdw6wc0', name: '9 PM REBEL.JPG' },
  { id: '1FTMiCARbIBDYLBvuT8NIOez7GnZEW2NQ', name: '9 PM REBEL.jpg' },
  { id: '1yJJT9PUJGk5hfQOJk3XiMzrGEDMagqNw', name: '9 PM REBEL.jpg' },
  { id: '1QtvRAqAygb2rBYqOxp7Hg3yg0zVS_X8C', name: 'AFNAN 9 PM 3.jpg' },
  { id: '1DmZnGe_Q2puMZv-NuEWZ6YF4GMJu3pXf', name: 'AFNAN 9 PM 5.jpg' },
  { id: '1pUkjt8OCIaYomXCWZzOQWYlOl2dmzNUh', name: 'AFNAN 9 PM.jpg' },
  { id: '13YR5Z7SNylJNPP_YhQPDN-GC-Mst1fSE', name: 'AFNAN 9PM 2.jpg' },
  { id: '1fV3P_9TaMa__P7OGsLLocFzWP03U72dw', name: 'AFNAN 9PM 4.jpg' },
  { id: '1PjEuIiqAv2_GMRFSv0aE5e018pfrMlz-', name: 'AL HARAMAIN AMBER OUD GOLD EDITION.jpg' },
  { id: '1s4bhwzF-naW11jN4o7R3Zi271d_GXRed', name: 'AL HARAMAIN AMBER OUD GOLD EDITION.JPG' },
  { id: '1qk4KPX8ohwnaz0toTtmyKBv5USB2JkUX', name: 'AL HARAMAIN AMBER OUD GOLD EDITION.JPG' },
  { id: '1J0EAhUebm-DULcYdILhyDum9hWqKLB87', name: 'AL HARAMAIN AMBER OUD GOLD EDITION.jpg' },
  { id: '1uHqHkR3W--abFdF8C4ErNrIemjfqbUqb', name: 'AL NOBLE SAAFER.jpg' },
  { id: '1kdVyAecg4ZfcAOloGPlZjA8Zp3__tHLc', name: 'AL NOBLE SAAFER.jpg' },
  { id: '1RFiBWQW94jjrMpIQRIjMRdfSfmODRMQX', name: 'AL NOBLE SAAFER.jpg' },
  { id: '1brww1WvobISlNltqIfoemkSNhd-HRWJl', name: 'AL NOBLE SAAFER.jpg' },
  { id: '19h2SkFFCYydkZe3keUAeMnhNQ6I14K9b', name: 'AL WATANIAH DAR AL WARD.jpg' },
  { id: '1zNNiz96PaQbXQuD8qtret1z0flUs9VXr', name: 'AL WATANIAH DAR AL WARD.jpg' },
  { id: '1PlamtmnrHOJ8BQCK1k4qdeh9DUm5n7q3', name: 'AL WATANIAH DAR AL WARD.jpg' },
  { id: '1DiynshEHjuSyolXpeWrvuCeBgPTK1jmw', name: 'ARMAF ODYSSEY LIMONI.jpg' },
  { id: '1KglnHQ5kxsVVA8eULtc4hQEdyclJWjtS', name: 'ARMAF ODYSSEY MANDARIN SKY.jpg' },
  { id: '1UaG43XTqYPvRdSeHYEB9YoKki8uz5WYJ', name: 'ASDAAF ANDALEEB.jpg' },
  { id: '14sm9o95TX3MEs6xRiFfJxpjZ-TNmMKM_', name: 'ASDAAF ANDALEEB.jpg' },
  { id: '1tJEer11LFXsPlr5Clk_WtkGGQjWa6l7i', name: 'ASDAAF ANDALEEB.jpg' },
  { id: '1FmWxrR2Oyghyd5EC298Jcgihn_JS5Q_Q', name: 'BADEE AMESTHYST.jpg' },
  { id: '1Qn190YUwSxPgaQZdAybjGwiWaHGGOaRQ', name: 'BADEE AMESTHYST.jpg' },
  { id: '1folJL0EK3reXKcg7BeR2K6922KCvRRol', name: 'BADEE AMESTHYST.jpg' },
  { id: '1ujxFRUa6q2eIxE99jMZFYH_OIXz9Ph_3', name: 'BADEE AMHESTYST.JPG' },
  { id: '15jW4NO3abkRZDuymoYFlhmzB7PSJSx0Z', name: 'BADEE FOR GLORY.JPG' },
  { id: '1jiav5hna_LqJ8GTJSfm625kWUrn_3f27', name: 'BADEE FOR GLORY.jpg' },
  { id: '1mc8pedCdBwLftwGYy8VXguBHz1oBMeuM', name: 'BADEE FOR GLORY.JPG' },
  { id: '1yPIUjOy_f4w4-PB6D_3kluS5epH1e11H', name: 'BADEE FOR GLORY.JPG' },
  { id: '1ptnlpK3cuTV_slGSDBY9UT99GkEwklLO', name: 'BADEE NOBLE BLUSH.JPG' },
  { id: '1-2dvWLK6edMGODtyUMLZwC3au8o2o6L9', name: 'BADEE NOBLE BLUSH.jpg' },
  { id: '1dEhGhI9d8QlNMtzJyfjSoOnWHRYaExqJ', name: 'BADEE NOBLE BLUSH.JPG' },
  { id: '1-bS6tkGNyfAsmu2urdRe_XgWnO2CJLnt', name: 'BADEE NOBLE BLUSH.jpg' },
  { id: '1qA3kIaLUa_-jpgqf18dT2iM4J51Z1iD8', name: 'BADEE NOBLE BLUSH.jpg' },
  { id: '1NUG7yv8NREUXgXlLV6AB7tG5yUjzsvBU', name: 'BADEE SUBLIME.jpg' },
  { id: '1u8SAU-Da9yvpZRW9SD0kAWPJVnP5Sf2v', name: 'BADEE SUBLIME.jpg' },
  { id: '1V0u3UVFf5z0vS3SSdnQDpSd_bkBN8TaQ', name: 'BADEE SUBLIME.JPG' },
  { id: '14y95i9N2FLpfXqFnSQyGRc_1mKGzyOjj', name: 'BADEE SUBLIME.jpg' },
  { id: '1WpyOW_84aLraYcIGIRn6kUnT2PfUxZI2', name: 'BADEE SUBLIME.jpg' },
  { id: '1waOuO6OYnG7KTPZ21JZAEQCrc-2t9iig', name: 'BADEE SUBLIME.jpg' },
  { id: '1pCbW9O9HFU_UWoYi8ww9-T1ompfWulWo', name: 'BADEE SUBLIME.jpg' },
  { id: '1FYhghags0uGK3ntNjTDf5_N_JE-UdcET', name: 'GLORY.JPG' },
];

// Product name matching rules: Drive filename -> catalog product name keywords
// We map the "base name" (without extension) to possible catalog product matches
const nameToProductMap = {
  '9 AM DIVE': '9 AM DIVE',
  '9 PM REBEL': '9 PM REBEL',
  'AFNAN 9 PM': '9 PM MASC',
  'AFNAN 9PM': '9 PM MASC',
  'AFNAN 9 PM 3': '9 PM MASC',
  'AFNAN 9 PM 5': '9 PM MASC',
  'AFNAN 9PM 2': '9 PM MASC',
  'AFNAN 9PM 4': '9 PM MASC',
  'AL HARAMAIN AMBER OUD GOLD EDITION': 'AMBER OUD GOLD EDITION',
  'AL NOBLE SAAFER': 'AL NOBLE SAFEER',
  'AL WATANIAH DAR AL WARD': 'SABAH AL WARD',
  'ARMAF ODYSSEY LIMONI': 'ODYSSEY LIMONI',
  'ARMAF ODYSSEY MANDARIN SKY': 'ODYSSEY MANDARIN SKY',
  'ASDAAF ANDALEEB': 'ANDALEEB',
  'BADEE AMESTHYST': "BADE'E AL OUD AMETHYST",
  'BADEE AMHESTYST': "BADE'E AL OUD AMETHYST",
  'BADEE FOR GLORY': "BADE'E AL OUD FOR GLORY",
  'BADEE NOBLE BLUSH': "BADE'E AL OUD NOBLE BLUSH",
  'BADEE SUBLIME': "BADE'E AL OUD SUBLIME",
  'GLORY': "BADE'E AL OUD HONOR",
};

// Group files by product
const productImages = {};
for (const file of driveFiles) {
  const baseName = file.name.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '');
  const productKey = nameToProductMap[baseName];
  if (!productKey) continue;
  
  if (!productImages[productKey]) productImages[productKey] = [];
  // Use Google Drive thumbnail URL (works for public shared files)
  const url = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
  if (!productImages[productKey].includes(url)) {
    productImages[productKey].push(url);
  }
}

// Limit to max 3 images per product (best ones)
for (const key of Object.keys(productImages)) {
  if (productImages[key].length > 3) {
    productImages[key] = productImages[key].slice(0, 3);
  }
}

console.log('Product image mapping:');
console.log(JSON.stringify(productImages, null, 2));
console.log('\nProducts with images:', Object.keys(productImages).length);

// Save mapping for next step
fs.writeFileSync('image_mapping.json', JSON.stringify(productImages, null, 2));
console.log('Saved to image_mapping.json');
