import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and, isNull } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fixes null scene titles for chapters 100-104 by reading from outline
 */

function findChapterData(outline: any, eaId: string): any {
  const search = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === eaId) return obj;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outline);
}

async function main() {
  console.log('🔧 Fixing null scene titles for chapters 100-104...\n');

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const chapterNumbers = [100, 101, 102, 104];

  for (const chapterNum of chapterNumbers) {
    const eaId = `EA-${chapterNum.toString().padStart(3, '0')}`;

    // Find existing chapter
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!chapter) {
      console.log(`❌ Chapter ${chapterNum} not found`);
      continue;
    }

    // Get chapter data from outline
    const chapterData = findChapterData(outline, eaId);

    if (!chapterData || !chapterData.scenes) {
      console.log(`⚠️  No scenes data for ${eaId}`);
      continue;
    }

    console.log(`📖 Chapter ${chapterNum}: ${chapter.title}`);

    // Find scenes with null titles
    const nullTitleScenes = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          isNull(scenes.title)
        )
      );

    console.log(`   Found ${nullTitleScenes.length} scenes with null titles`);

    for (const scene of nullTitleScenes) {
      // Find the corresponding scene in outline
      const outlineScene = chapterData.scenes.find(
        (s: any) => s.scene_number === scene.sceneNumber
      );

      if (!outlineScene) {
        console.log(`   ⚠️  No outline data for scene ${scene.sceneNumber}`);
        continue;
      }

      // Get title from outline (try scene_title first, then title)
      const title = outlineScene.scene_title || outlineScene.title;

      if (title) {
        await db
          .update(scenes)
          .set({ title: title })
          .where(eq(scenes.id, scene.id));

        console.log(`   ✅ Updated Scene ${scene.sceneNumber}: ${title}`);
      } else {
        console.log(`   ⚠️  No title found for scene ${scene.sceneNumber}`);
      }
    }

    console.log('');
  }

  console.log('✅ Title fix complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
