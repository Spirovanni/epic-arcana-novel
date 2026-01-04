const fs = require('fs');
const path = require('path');

console.log('🔄 Updating internal_conflict fields in l_outline.json...\n');

// Read the analysis file
const analysisPath = path.join(__dirname, 'first-50-scenes-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// Read the outline
const outlinePath = path.join(__dirname, '../data/l_outline.json');
const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

let updatedCount = 0;
let sceneIndex = 0;

// Recursively find and update scenes
function processOutline(obj) {
  if (typeof obj === 'object' && obj !== null) {
    // Check if this object has scenes array
    if (obj.scenes && Array.isArray(obj.scenes)) {
      obj.scenes.forEach((scene) => {
        if (sceneIndex < analysis.length) {
          const analysisItem = analysis[sceneIndex];

          // Update the internal_conflict field if enhanced version exists
          if (analysisItem.proposed_enhanced_conflict &&
              analysisItem.proposed_enhanced_conflict !== scene.internal_conflict) {

            scene.internal_conflict = analysisItem.proposed_enhanced_conflict;
            updatedCount++;

            if (updatedCount <= 10) {
              console.log(`Updated scene ${sceneIndex + 1}: ${analysisItem.title}`);
              console.log(`  New conflict: ${analysisItem.proposed_enhanced_conflict.substring(0, 100)}...`);
              console.log('');
            }
          }

          sceneIndex++;
        }
      });
    }

    // Recurse through all properties
    for (const key in obj) {
      processOutline(obj[key]);
    }
  }
}

// Process the outline
processOutline(outline);

if (updatedCount > 0) {
  // Write back the outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`✅ Successfully updated ${updatedCount} internal_conflict fields in l_outline.json`);
  console.log(`   (Processed ${sceneIndex} scenes total)`);
} else {
  console.log('✅ No updates needed in l_outline.json');
}
