import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🔄 Syncing timeline_date fields to database for chapters after EA-097...\n');

  // Read the outline
  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

  let updatedCount = 0;
  const updates: Array<{ chapter: string; scene: number; timeline_date: string }> = [];

  // Recursively find chapters
  function findChapters(obj: any): any[] {
    const chaptersFound: any[] = [];

    if (typeof obj === 'object' && obj !== null) {
      if (obj.id && obj.id.startsWith('EA-')) {
        chaptersFound.push(obj);
      }

      for (const key in obj) {
        chaptersFound.push(...findChapters(obj[key]));
      }
    }

    return chaptersFound;
  }

  const allChapters = findChapters(outline);

  // Process chapters after EA-097
  for (const chapterData of allChapters) {
    const chapterNum = parseInt(chapterData.id.split('-')[1]);

    if (chapterNum <= 97 || !chapterData.scenes || !Array.isArray(chapterData.scenes)) {
      continue;
    }

    // Find the chapter in the database
    const [dbChapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!dbChapter) {
      console.log(`⚠️  Chapter ${chapterData.id} not found in database`);
      continue;
    }

    // Update each scene's timeline_date
    for (let i = 0; i < chapterData.scenes.length; i++) {
      const sceneData = chapterData.scenes[i];
      const sceneNumber = i + 1;

      if (!sceneData.timeline_date) {
        continue;
      }

      // Find the scene in the database
      const [dbScene] = await db
        .select()
        .from(scenes)
        .where(and(
          eq(scenes.chapterId, dbChapter.id),
          eq(scenes.sceneNumber, sceneNumber)
        ))
        .limit(1);

      if (!dbScene) {
        console.log(`⚠️  Scene ${sceneNumber} in chapter ${chapterData.id} not found in database`);
        continue;
      }

      // Update if different
      if (dbScene.timeline_date !== sceneData.timeline_date) {
        await db
          .update(scenes)
          .set({ timeline_date: sceneData.timeline_date })
          .where(eq(scenes.id, dbScene.id));

        updates.push({
          chapter: chapterData.id,
          scene: sceneNumber,
          timeline_date: sceneData.timeline_date
        });

        updatedCount++;
      }
    }
  }

  // Show updates
  if (updates.length > 0) {
    console.log(`📝 Updated ${updatedCount} timeline_date fields:\n`);

    updates.slice(0, 20).forEach(update => {
      console.log(`${update.chapter} Scene ${update.scene}: "${update.timeline_date}"`);
    });

    if (updates.length > 20) {
      console.log(`\n... and ${updates.length - 20} more updates`);
    }

    console.log(`\n✅ Successfully synced ${updatedCount} timeline_date fields to database`);
  } else {
    console.log('✅ All timeline_date fields already in sync');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
