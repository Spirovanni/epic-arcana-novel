import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHAPTER_NUMBER = 360;
const CHAPTER_ID = `EA-${CHAPTER_NUMBER}`;

const outlinePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const scenesPath = path.join(__dirname, `ea-${CHAPTER_NUMBER}-enhanced-scenes.json`);
const backupPath = path.join(__dirname, '..', 'data', `l_outline.json.backup-ea-${CHAPTER_NUMBER}`);

console.log(`Injecting enhanced scenes for chapter ${CHAPTER_ID}...`);

// Read the enhanced scenes
const enhancedScenes = JSON.parse(fs.readFileSync(scenesPath, 'utf-8'));
console.log(`Loaded ${enhancedScenes.length} enhanced scenes from ${scenesPath}`);

// Read the outline
const outlineContent = fs.readFileSync(outlinePath, 'utf-8');
const outline = JSON.parse(outlineContent);

// Create backup
fs.writeFileSync(backupPath, outlineContent);
console.log(`Created backup at ${backupPath}`);

// Find and update the chapter
function findAndUpdateChapter(obj: any, targetId: string, newScenes: any[]): boolean {
  if (obj && typeof obj === 'object') {
    if (obj.id === targetId && obj.scenes !== undefined) {
      console.log(`Found chapter ${targetId} with ${obj.scenes?.length || 0} existing scenes`);
      obj.scenes = newScenes;
      console.log(`Replaced with ${newScenes.length} enhanced scenes`);
      return true;
    }
    for (const key of Object.keys(obj)) {
      if (findAndUpdateChapter(obj[key], targetId, newScenes)) {
        return true;
      }
    }
  }
  return false;
}

const found = findAndUpdateChapter(outline, CHAPTER_ID, enhancedScenes);

if (!found) {
  console.error(`ERROR: Could not find chapter ${CHAPTER_ID} in outline`);
  process.exit(1);
}

// Write the updated outline
fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
console.log(`Successfully updated ${outlinePath}`);
console.log('Injection complete!');
