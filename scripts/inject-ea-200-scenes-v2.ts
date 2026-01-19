import * as fs from 'fs';
import * as path from 'path';

/**
 * Safely inject enhanced scenes for EA-200 into l_outline.json
 */

async function main() {
  const eaId = 'EA-200';
  console.log(`📝 Injecting enhanced scenes for ${eaId}...\n`);

  // Read the enhanced scenes
  const enhancedScenesPath = path.join(process.cwd(), 'scripts', 'ea-200-enhanced-scenes-v2.json');
  const enhancedScenes = JSON.parse(fs.readFileSync(enhancedScenesPath, 'utf-8'));
  console.log(`✅ Loaded ${enhancedScenes.length} enhanced scenes from ea-200-enhanced-scenes-v2.json\n`);

  // Read the outline
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));
  console.log(`✅ Loaded outline from data/l_outline.json\n`);

  // Find and update EA-200 in the outline
  function findAndUpdate(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    if (obj.id === eaId) {
      console.log(`✅ Found ${eaId} in outline`);
      console.log(`   Current chapter: ${obj.chapter}`);
      console.log(`   Title: ${obj.specific_task_group_title}`);
      console.log(`   Existing scenes: ${obj.scenes ? obj.scenes.length : 0}\n`);
      
      // Replace scenes array
      obj.scenes = enhancedScenes;
      console.log(`✅ Replaced scenes array with ${enhancedScenes.length} enhanced scenes\n`);
      return true;
    }

    // Recursively search
    for (const key of Object.keys(obj)) {
      if (findAndUpdate(obj[key])) {
        return true;
      }
    }
    return false;
  }

  const found = findAndUpdate(outline);
  
  if (!found) {
    throw new Error(`${eaId} not found in outline`);
  }

  // Create backup
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-ea-200.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`💾 Created backup at data/l_outline.backup-ea-200.json\n`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Successfully updated data/l_outline.json`);
  console.log(`   ${eaId} now has ${enhancedScenes.length} enhanced scenes\n`);
  console.log(`✨ Injection complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
