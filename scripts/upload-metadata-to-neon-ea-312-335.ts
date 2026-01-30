import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chapterRange = Array.from({ length: 24 }, (_, i) => 312 + i); // EA-312 to EA-335

async function main() {
  console.log('📤 Uploading scene metadata to Neon database...\n');

  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  // Helper function to find chapter scenes in outline
  function findChapterScenes(obj: any, eaId: string): any[] | null {
    if (typeof obj !== 'object' || obj === null) return null;

    if (obj.id === eaId && obj.scenes && Array.isArray(obj.scenes)) {
      return obj.scenes;
    }

    for (const key in obj) {
      const result = findChapterScenes(obj[key], eaId);
      if (result) return result;
    }

    return null;
  }

  let totalUpdated = 0;
  let chapterCount = 0;

  for (const chapterNumber of chapterRange) {
    const eaId = `EA-${chapterNumber}`;

    try {
      // Get chapter from database
      const [chapter] = await db.select().from(chapters)
        .where(eq(chapters.chapterNumber, chapterNumber))
        .limit(1);

      if (!chapter) {
        console.log(`⚠️  ${eaId}: Chapter not found in database, skipping...`);
        continue;
      }

      // Get scenes from outline
      const outlineScenes = findChapterScenes(outline, eaId);
      if (!outlineScenes || outlineScenes.length === 0) {
        console.log(`⚠️  ${eaId}: No scenes in outline, skipping...`);
        continue;
      }

      // Get scenes from database
      const dbScenes = await db.select().from(scenes)
        .where(eq(scenes.chapterId, chapter.id))
        .orderBy(scenes.sceneNumber);

      if (dbScenes.length === 0) {
        console.log(`⚠️  ${eaId}: No scenes in database, skipping...`);
        continue;
      }

      console.log(`✅ ${eaId}: ${chapter.title} (${dbScenes.length} scenes)`);
      chapterCount++;

      // Update each scene
      for (let i = 0; i < dbScenes.length; i++) {
        const dbScene = dbScenes[i];
        const outlineScene = outlineScenes[i];

        if (!outlineScene) {
          console.log(`   ⚠️  Scene ${i + 1}: No matching outline scene`);
          continue;
        }

        // Update with metadata from outline
        await db.update(scenes)
          .set({
            pov: outlineScene.pov || null,
            tense: outlineScene.tense || null,
            core_emotion: outlineScene.core_emotion || null,
            scene_tone: outlineScene.scene_tone || null,
          })
          .where(eq(scenes.id, dbScene.id));

        console.log(`   ✅ Scene ${dbScene.sceneNumber}: ${dbScene.title}`);
        console.log(`      POV: ${outlineScene.pov || 'null'}`);
        console.log(`      Tense: ${outlineScene.tense || 'null'}`);
        console.log(`      Emotion: ${outlineScene.core_emotion?.substring(0, 50) || 'null'}...`);
        console.log(`      Tone: ${outlineScene.scene_tone?.substring(0, 50) || 'null'}...`);
        totalUpdated++;
      }

      console.log('');
    } catch (error) {
      console.error(`❌ ${eaId}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`\n✨ Upload complete!`);
  console.log(`   📊 Chapters processed: ${chapterCount}/24`);
  console.log(`   📝 Scenes updated: ${totalUpdated}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
