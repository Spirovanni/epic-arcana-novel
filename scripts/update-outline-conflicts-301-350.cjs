const fs = require('fs');
const path = require('path');

console.log('🔄 Updating internal_conflict fields in l_outline.json for scenes 301-350...\n');

// Read the analysis file
const analysisPath = path.join(__dirname, 'scenes-301-350-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// Create a lookup map by chapter_id and scene_number for faster matching
const analysisMap = new Map();
analysis.forEach(item => {
  const key = `${item.chapter_id}|${item.scene_number}`;
  analysisMap.set(key, item);
});

console.log(`Loaded ${analysis.length} analysis entries\n`);

// Read the outline
const outlinePath = path.join(__dirname, '../data/l_outline.json');
const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

let updatedCount = 0;
let processedCount = 0;

// Recursively find and update scenes
function processOutline(obj, chapterContext = null) {
  if (typeof obj === 'object' && obj !== null) {
    // Check if this object might be a chapter (has id or unique_identifier)
    let currentChapterId = chapterContext;
    if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) {
      currentChapterId = obj.id;
    } else if (obj.unique_identifier && typeof obj.unique_identifier === 'string' && obj.unique_identifier.startsWith('EA-')) {
      currentChapterId = obj.unique_identifier;
    }
    
    // Check if this object has scenes array
    if (obj.scenes && Array.isArray(obj.scenes)) {
      obj.scenes.forEach((scene) => {
        processedCount++;
        
        // Try to match by chapter_id and scene_number
        const sceneNumber = scene.scene_number || scene.sceneNumber;
        if (currentChapterId && sceneNumber !== undefined) {
          const key = `${currentChapterId}|${sceneNumber}`;
          const analysisItem = analysisMap.get(key);
          
          if (analysisItem) {
            // Handle both internal_conflict and internalConflict field names
            const currentConflict = scene.internal_conflict || scene.internalConflict || '';
            
            if (analysisItem.proposed_enhanced_conflict &&
                analysisItem.proposed_enhanced_conflict !== currentConflict) {

              // Update both field names to ensure consistency
              scene.internal_conflict = analysisItem.proposed_enhanced_conflict;
              scene.internalConflict = analysisItem.proposed_enhanced_conflict;
              updatedCount++;

              if (updatedCount <= 10) {
                console.log(`Updated scene ${analysisItem.scene_index} (${currentChapterId}, scene ${sceneNumber}): ${analysisItem.title || 'Untitled'}`);
                console.log(`  New conflict: ${analysisItem.proposed_enhanced_conflict.substring(0, 100)}...`);
                console.log('');
              }
            }
          }
        }
      });
    }

    // Recurse through all properties, passing chapter context
    for (const key in obj) {
      processOutline(obj[key], currentChapterId);
    }
  }
}

// Process the outline
processOutline(outline);

if (updatedCount > 0) {
  // Write back the outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`✅ Successfully updated ${updatedCount} internal_conflict fields in l_outline.json`);
  console.log(`   (Processed ${processedCount} total scenes in outline)`);
} else {
  console.log('✅ No updates needed in l_outline.json');
  console.log(`   (Processed ${processedCount} total scenes)`);
  console.log(`   (Looking for scenes matching ${analysis.length} analysis entries)`);
}

