const fs = require('fs');
const content = fs.readFileSync('C:/Users/Mirko Ponce/.gemini/antigravity/brain/7bf3cb51-d711-49de-a3d4-832db4d01ac8/.system_generated/steps/400/content.md', 'utf8');

// Find file IDs embedded in the page
const fileIdMatches = content.match(/['"](1[a-zA-Z0-9_-]{25,})['"]/g) || [];
const fileIds = [...new Set(fileIdMatches.map(m => m.replace(/['"]/g, '')))].filter(id => id.length > 25 && id.length < 60);

// Find file names / titles
const nameMatches = content.match(/title['"]\s*:\s*['"]([^'"]+)['"]/g) || [];
const names = nameMatches.map(m => m.match(/['"]([^'"]+)['"]$/)[1]);

console.log('File IDs found:', fileIds.length);
fileIds.slice(0, 30).forEach(id => console.log(id));

console.log('\nNames found:', names.length);
names.slice(0, 30).forEach(n => console.log(n));

// Also look for any jpg/png/jpeg references
const imgMatches = content.match(/[\w\s\-']+\.(jpg|jpeg|png|webp)/gi) || [];
console.log('\nImage filenames:', imgMatches.slice(0, 30));
