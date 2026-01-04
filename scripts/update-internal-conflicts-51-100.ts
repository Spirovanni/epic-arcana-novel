import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, asc } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SceneAnalysis {
  scene_index: number;
  chapter_id: string;
  scene_number: number;
  title: string;
  pov: string;
  current_internal_conflict: string;
  characters_involved: string[];
  proposed_enhanced_conflict: string;
}

async function updateInternalConflicts() {
  console.log('🔄 Updating internal_conflict fields for scenes 51-100...\n');

  // Read the analysis file
  const analysisPath = path.join(__dirname, 'scenes-51-100-analysis.json');
  const analysis: SceneAnalysis[] = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

  let updatedCount = 0;
  const updates: Array<{ chapter: string; scene: number; title: string }> = [];

  // Get scenes 51-100 ordered by chapter and scene number
  const allScenes = await db
    .select({
      id: scenes.id,
      chapterId: scenes.chapterId,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      internalConflict: scenes.internalConflict
    })
    .from(scenes)
    .orderBy(asc(scenes.chapterId), asc(scenes.sceneNumber))
    .limit(100)
    .offset(50);

  // Get chapter numbers for each scene
  const sceneChapterMap = new Map();
  for (const scene of allScenes) {
    const [chapter] = await db
      .select({ chapterNumber: chapters.chapterNumber })
      .from(chapters)
      .where(eq(chapters.id, scene.chapterId))
      .limit(1);

    if (chapter) {
      sceneChapterMap.set(scene.id, chapter.chapterNumber);
    }
  }

  // Update each scene
  for (let i = 0; i < Math.min(allScenes.length, analysis.length); i++) {
    const scene = allScenes[i];
    const analysisItem = analysis[i];

    // Only update if the enhanced conflict is different and not empty
    if (analysisItem.proposed_enhanced_conflict &&
        analysisItem.proposed_enhanced_conflict !== scene.internalConflict) {

      await db
        .update(scenes)
        .set({ internalConflict: analysisItem.proposed_enhanced_conflict })
        .where(eq(scenes.id, scene.id));

      const chapterNum = sceneChapterMap.get(scene.id);
      updates.push({
        chapter: `Chapter ${chapterNum}`,
        scene: scene.sceneNumber,
        title: scene.title || 'Untitled'
      });

      updatedCount++;
    }
  }

  // Show updates
  if (updates.length > 0) {
    console.log(`📝 Updated ${updatedCount} internal_conflict fields:\n`);

    updates.slice(0, 20).forEach(update => {
      console.log(`${update.chapter} Scene ${update.scene}: "${update.title}"`);
    });

    if (updates.length > 20) {
      console.log(`\n... and ${updates.length - 20} more updates`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} internal_conflict fields in database`);
  } else {
    console.log('✅ All internal_conflict fields already up to date');
  }
}

updateInternalConflicts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
