const fs = require('fs');
const content = fs.readFileSync('C:/Users/Mirko Ponce/.gemini/antigravity/brain/7bf3cb51-d711-49de-a3d4-832db4d01ac8/.system_generated/steps/400/content.md', 'utf8');

// The Drive HTML embeds file data as JSON arrays. Let's find patterns like [id, name, ...]
// Typically in Drive pages, the data is in a format: ["FILE_ID","filename.jpg",...]
// Let's search for patterns where a file ID is near a .jpg/.png filename

const results = [];
const idPattern = /1[a-zA-Z0-9_-]{25,50}/g;
const allIds = [];
let match;

while ((match = idPattern.exec(content)) !== null) {
  const id = match[0];
  if (id === '1UI_GOhjYAO9mWzVYFOpx6EpKxYfJzXk0') continue;
  
  // Look for a filename near this ID (within 500 chars after)
  const after = content.substring(match.index, match.index + 500);
  const nameMatch = after.match(/([A-Z0-9][A-Z0-9\s\-'&]+\.(?:jpg|jpeg|png|JPG|JPEG|PNG))/);
  
  if (nameMatch) {
    const name = nameMatch[1].trim();
    // Avoid duplicates
    if (!results.find(r => r.id === id && r.name === name)) {
      results.push({ id, name });
    }
  }
}

// Deduplicate by ID, keep first match
const seen = new Set();
const unique = results.filter(r => {
  if (seen.has(r.id)) return false;
  seen.add(r.id);
  return true;
});

console.log(JSON.stringify(unique, null, 2));
console.log('\nTotal unique file-name pairs:', unique.length);
