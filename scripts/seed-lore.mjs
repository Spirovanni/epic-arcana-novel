async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function seedTimelineEvents(db) {
  // ... existing code ...
}

async function seedCharacters(db) {
  // ... existing code ...
}

async function seedTrionfiCards(db) {
  // ... existing code ...
} 