const fs = require('fs');
const path = require('path');
console.log('🔄 Updating internal_conflict fields for scenes 901-950...\n');
const analysis = JSON.parse(fs.readFileSync(path.join(__dirname, 'scenes-901-950-analysis.json'), 'utf8'));
const analysisMap = new Map(); analysis.forEach(item => analysisMap.set(`${item.chapter_id}|${item.scene_number}`, item));
console.log(`Loaded ${analysis.length} entries\n`);
const outlinePath = path.join(__dirname, '../data/l_outline.json');
const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
let updatedCount = 0, processedCount = 0;
function processOutline(obj, chapterContext = null) {
  if (typeof obj === 'object' && obj !== null) {
    let currentChapterId = chapterContext;
    if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) currentChapterId = obj.id;
    else if (obj.unique_identifier && typeof obj.unique_identifier === 'string' && obj.unique_identifier.startsWith('EA-')) currentChapterId = obj.unique_identifier;
    if (obj.scenes && Array.isArray(obj.scenes)) {
      obj.scenes.forEach((scene) => {
        processedCount++;
        const sceneNumber = scene.scene_number || scene.sceneNumber;
        if (currentChapterId && sceneNumber !== undefined) {
          const analysisItem = analysisMap.get(`${currentChapterId}|${sceneNumber}`);
          if (analysisItem) {
            const currentConflict = scene.internal_conflict || scene.internalConflict || '';
            if (analysisItem.proposed_enhanced_conflict && analysisItem.proposed_enhanced_conflict !== currentConflict) {
              scene.internal_conflict = analysisItem.proposed_enhanced_conflict;
              scene.internalConflict = analysisItem.proposed_enhanced_conflict;
              updatedCount++;
              if (updatedCount <= 5) console.log(`Updated scene ${analysisItem.scene_index} (${currentChapterId}, scene ${sceneNumber})`);
            }
          }
        }
      });
    }
    for (const key in obj) processOutline(obj[key], currentChapterId);
  }
}
processOutline(outline);
if (updatedCount > 0) {
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`\n✅ Successfully updated ${updatedCount} fields`);
} else console.log(`✅ No updates needed`);
