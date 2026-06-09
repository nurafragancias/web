const fs = require('fs');
const content = fs.readFileSync('C:/Users/Mirko Ponce/.gemini/antigravity/brain/7bf3cb51-d711-49de-a3d4-832db4d01ac8/.system_generated/steps/400/content.md', 'utf8');

// Extract all image filenames mentioned
const imgMatches = content.match(/[\w\s\-']+\.(jpg|jpeg|png|webp)/gi) || [];
const uniqueNames = [...new Set(imgMatches.filter(n => !n.toLowerCase().includes('logo') && !n.toLowerCase().includes('drive') && !n.toLowerCase().includes('broken') && !n.toLowerCase().includes('icon') && !n.toLowerCase().includes('al-')))];

console.log('Unique perfume image names found:');
uniqueNames.forEach(n => console.log(n.trim()));
console.log('\nTotal:', uniqueNames.length);

// Extract all IDs found
const allIds = content.match(/['"](1[a-zA-Z0-9_-]{25,50})['"]/g) || [];
const uniqueIds = [...new Set(allIds.map(m => m.replace(/['"]/g, '')))].filter(id => id !== '1UI_GOhjYAO9mWzVYFOpx6EpKxYfJzXk0');
console.log('\nAll file IDs (excluding folder ID):');
uniqueIds.forEach(id => console.log(id));
console.log('\nTotal IDs:', uniqueIds.length);
