import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Mapping of scene IDs to their new timeline_date values
// Book 2 starts 3/7/1320 (EA-040), Book 1 ended 3/6/1320
const dateUpdates: Record<string, string> = {
  // EA-040 - already correct format
  'EA-040-S1': '3/7/1320 - Dawn',
  'EA-040-S2': '3/7/1320 - Morning',
  'EA-040-S3': '3/7/1320 - Afternoon',
  
  // EA-041 - Post-Book 1 = 3/8/1320
  'EA-041-S1': '3/8/1320 - Morning',
  'EA-041-S2': '3/9/1320 - Afternoon',
  'EA-041-S3': '3/10/1320 - Morning',
  'EA-041-S4': '3/11/1320 - Night',
  
  // EA-042 - Post-Book 1 + 4 days = 3/12/1320
  'EA-042-S1': '3/12/1320 - Dawn',
  'EA-042-S2': '3/12/1320 - Morning',
  'EA-042-S3': '3/12/1320 - Late Morning',
  'EA-042-S4': '3/12/1320 - Afternoon',
  
  // EA-043 - Post-Book 1 + 4 days = 3/12/1320 (same day, continues)
  'EA-043-S1': '3/12/1320 - Late Afternoon',
  'EA-043-S2': '3/12/1320 - Evening',
  'EA-043-S3': '3/12/1320 - Late Evening',
  'EA-043-S4': '3/12/1320 - Night',
  
  // EA-044 - Post-Book 1 + 5 days = 3/13/1320
  'EA-044-S1': '3/13/1320 - Dawn',
  'EA-044-S2': '3/13/1320 - Morning',
  'EA-044-S3': '3/13/1320 - Afternoon',
  'EA-044-S4': '3/13/1320 - Evening',
  
  // EA-045 - Post-Book 1 + 6 days = 3/14/1320 (temporal train journey)
  'EA-045-S1': '3/14/1320 - Morning',
  'EA-045-S2': '3/14/1320 - Temporal Transit',
  'EA-045-S3': '3/14/1320 - Temporal Corridor',
  'EA-045-S4': '3/14/1320 - Late Afternoon',
  
  // EA-046 - Timeline Terminal (between timelines) = 3/15/1320
  'EA-046-S1': '3/15/1320 - Temporal Space',
  'EA-046-S2': '3/15/1320 - Temporal Space',
  'EA-046-S3': '3/15/1320 - Temporal Space',
  'EA-046-S4': '3/15/1320 - Temporal Space',
  
  // EA-047 - Multi-timeline convergence = 3/16/1320
  'EA-047-S1': '3/16/1320 - Morning',
  'EA-047-S2': '3/16/1320 - Afternoon',
  'EA-047-S3': '3/16/1320 - Evening',
  'EA-047-S4': '3/16/1320 - Night',
  
  // EA-048 - Post-Book 1 + 2 weeks = 3/22/1320 (14 days from 3/8)
  'EA-048-S1': '3/22/1320 - Morning',
  'EA-048-S2': '3/22/1320 - Afternoon',
  'EA-048-S3': '3/22/1320 - Evening',
  'EA-048-S4': '3/22/1320 - Night',
  
  // EA-049 - Post-Book 1 + 3-4 weeks = 3/29-4/6/1320
  'EA-049-S1': '3/29/1320 - Night',
  'EA-049-S2': '3/30/1320 - Dawn',
  'EA-049-S3': '3/30/1320 - Midday',
  'EA-049-S4': '4/6/1320 - Evening',
  
  // EA-050 - Post-Book 1 + 5 weeks = 4/13/1320 (35 days from 3/8)
  'EA-050-S1': '4/13/1320 - Morning',
  'EA-050-S2': '4/13/1320 - Afternoon',
  'EA-050-S3': '4/13/1320 - Evening',
  'EA-050-S4': '4/13/1320 - Night',
  
  // EA-051 - Post-Book 1 + 6 weeks = 4/20/1320 (42 days from 3/8)
  'EA-051-S1': '4/20/1320 - Morning',
  'EA-051-S2': '4/20/1320 - Morning',
  'EA-051-S3': '4/20/1320 - Afternoon',
  'EA-051-S4': '4/20/1320 - Evening',
  
  // EA-052 - Post-Book 1 + 7 weeks = 4/27/1320 (49 days from 3/8)
  'EA-052-S1': '4/27/1320 - Morning',
  'EA-052-S2': '4/27/1320 - Afternoon',
  'EA-052-S3': '4/27/1320 - Night',
  'EA-052-S4': '4/29/1320 - Morning',
};

async function main() {
  console.log('📅 Updating Book 2 timeline dates to match Book 1 format...\n');
  
  const allScenes = await db.select().from(scenes);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const [sceneKey, newDate] of Object.entries(dateUpdates)) {
    const [chapterID, sceneNumPart] = sceneKey.split('-S');
    const sceneNum = parseInt(sceneNumPart);
    
    // Find the scene
    const scene = allScenes.find(s => 
      s.chapterUniqueIdentifier === chapterID && s.sceneNumber === sceneNum
    );
    
    if (!scene) {
      console.log(`⚠️  Scene not found: ${sceneKey}`);
      skippedCount++;
      continue;
    }
    
    // Update the scene
    await db
      .update(scenes)
      .set({ timeline_date: newDate })
      .where(eq(scenes.id, scene.id));
    
    console.log(`✅ Updated ${sceneKey}: ${scene.timeline_date} → ${newDate}`);
    updatedCount++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updatedCount} scenes`);
  console.log(`   Skipped: ${skippedCount} scenes`);
  console.log(`\n✅ Book 2 timeline dates have been standardized!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
