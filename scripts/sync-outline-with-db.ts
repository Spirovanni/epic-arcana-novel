import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script syncs the enhanced scene data from the Neon database
 * back to the l_outline.json file for chapter EA-013
 */

async function main() {
  console.log('📖 Syncing enhanced data from database to outline file...\n');

  // Read the outline file
  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outlineContent = fs.readFileSync(outlinePath, 'utf-8');
  const outline = JSON.parse(outlineContent);

  // Chapters to update
  const chapters = ['EA-100', 'EA-101'];

  let totalScenesUpdated = 0;

  for (const chapterUniqueId of chapters) {
    console.log(`\n🔄 Processing ${chapterUniqueId}...`);

    // Get all scenes for this chapter from database
    const dbScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterUniqueIdentifier, chapterUniqueId))
      .orderBy(scenes.sceneNumber);

    if (dbScenes.length === 0) {
      console.log(`   ⚠️  No scenes found in database for ${chapterUniqueId}`);
      continue;
    }

    console.log(`   Found ${dbScenes.length} scenes in database`);

    // Find this chapter in the outline
    let chapterFound = false;
    let scenesUpdated = 0;

    // Navigate through the nested outline structure
    function updateChapterScenes(obj: any): boolean {
      if (typeof obj !== 'object' || obj === null) return false;

      // Check if this object has the chapter we're looking for
      if (obj.id === chapterUniqueId && obj.scenes && Array.isArray(obj.scenes)) {
        console.log(`   ✅ Found ${chapterUniqueId} in outline`);

        // Update each scene
        for (const dbScene of dbScenes) {
          const sceneIndex = obj.scenes.findIndex(
            (s: any) => s.scene_number === dbScene.sceneNumber
          );

          if (sceneIndex !== -1) {
            // Preserve existing fields and add/update with database fields
            const outlineScene = obj.scenes[sceneIndex];

            // Add enhanced fields from database
            const enhancedFields = {
              pages: dbScene.pages,
              description: dbScene.description,
              focus: dbScene.focus,
              chapterSceneFocus: dbScene.chapterSceneFocus,
              preliminarySceneFocus: dbScene.preliminarySceneFocus,
              preliminarySceneDescription: dbScene.preliminarySceneDescription,
              sensoryDetail: dbScene.sensoryDetail,
              internalConflict: dbScene.internalConflict,
              characterGrowthElement: dbScene.characterGrowthElement,
              seriesConnectionResonance: dbScene.seriesConnectionResonance,
              sceneCardProgression: dbScene.sceneCardProgression,
              realWorldContext: dbScene.realWorldContext,
              timelineSignificance: dbScene.timelineSignificance,
              saveTheCatBeat: dbScene.saveTheCatBeat,
            };

            // Parse JSON fields
            if (dbScene.sudowrite_metadata) {
              try {
                enhancedFields['sudowrite_metadata'] = JSON.parse(dbScene.sudowrite_metadata);
              } catch (e) {
                enhancedFields['sudowrite_metadata'] = dbScene.sudowrite_metadata;
              }
            }

            if (dbScene.learning_objectives) {
              try {
                enhancedFields['learning_objectives'] = JSON.parse(dbScene.learning_objectives);
              } catch (e) {
                enhancedFields['learning_objectives'] = dbScene.learning_objectives;
              }
            }

            if (dbScene.foreshadowing_elements) {
              try {
                enhancedFields['foreshadowing_elements'] = JSON.parse(dbScene.foreshadowing_elements);
              } catch (e) {
                enhancedFields['foreshadowing_elements'] = dbScene.foreshadowing_elements;
              }
            }

            // Update timeline_date if more specific in DB
            if (dbScene.timeline_date && dbScene.timeline_date.includes('/')) {
              enhancedFields['timeline_date'] = dbScene.timeline_date;
            }

            // Merge enhanced fields into outline scene
            Object.assign(outlineScene, enhancedFields);

            scenesUpdated++;
            console.log(`   ✅ Updated Scene ${dbScene.sceneNumber}: ${dbScene.title}`);
          } else {
            console.log(`   ⚠️  Scene ${dbScene.sceneNumber} not found in outline`);
          }
        }

        return true;
      }

      // Recursively search in nested objects
      for (const key in obj) {
        if (updateChapterScenes(obj[key])) {
          chapterFound = true;
        }
      }

      return chapterFound;
    }

    updateChapterScenes(outline);

    if (!chapterFound) {
      console.log(`   ❌ ${chapterUniqueId} not found in outline structure`);
    } else {
      totalScenesUpdated += scenesUpdated;
      console.log(`   📝 Updated ${scenesUpdated} scenes for ${chapterUniqueId}`);
    }
  }

  // Write updated outline back to file
  console.log('\n💾 Writing updated outline to file...');
  fs.writeFileSync(
    outlinePath,
    JSON.stringify(outline, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Sync complete!`);
  console.log(`📊 Total scenes updated: ${totalScenesUpdated}`);
  console.log(`📁 File updated: ${outlinePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
