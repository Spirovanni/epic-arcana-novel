import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix remaining "preliminary_scene_focus" for EA-194 S1-S2 and EA-195 S1-S2
 * Format: "Daughter [action/description] [progression/context]"
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  preliminarySceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-194: Mental Clarity (S1 and S2 still have old format)
  {
    chapterNumber: 194,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering clarity foundation eliminating distractions through deep work discipline"
  },
  {
    chapterNumber: 194,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter refining clarity through deliberate thinking checking biases with systematic analysis"
  },

  // EA-195: Shared Wealth (S1 and S2 still have old format)
  {
    chapterNumber: 195,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering equity foundation serving underserved through inclusive innovation"
  },
  {
    chapterNumber: 195,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter advancing equity through platform design enabling practical resource sharing"
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, fix.chapterNumber))
      .limit(1);

    if (!chapter) {
      console.log(`   ⚠️  Chapter ${fix.chapterNumber} not found, skipping`);
      continue;
    }

    const result = await db
      .update(scenes)
      .set({ preliminarySceneFocus: fix.preliminarySceneFocus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated (${fix.preliminarySceneFocus.length} chars)`);
      updateCount++;
    } else {
      console.log(`   ⚠️  Ch${fix.chapterNumber}S${fix.sceneNumber}: Scene not found`);
    }
  }

  console.log(`\n✅ Database updated! ${updateCount} scenes modified.\n`);
}

function updateOutline() {
  console.log('📝 Updating outline file...\n');

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdateChapter(obj: any, eaId: string, sceneUpdates: Map<number, string>): boolean {
    if (!obj || typeof obj !== 'object') return false;

    if (obj.id === eaId) {
      if (!obj.scenes) {
        console.log(`   ⚠️  ${eaId}: No scenes array`);
        return true;
      }

      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title || obj.title}`);
      
      for (const [sceneNum, newValue] of sceneUpdates.entries()) {
        const scene = obj.scenes.find((s: any) => s.scene_number === sceneNum);
        if (scene) {
          scene.preliminarySceneFocus = newValue;
          console.log(`   ✅ Updated Scene ${sceneNum}`);
        } else {
          console.log(`   ⚠️  Scene ${sceneNum} not found`);
        }
      }
      
      return true;
    }

    for (const key of Object.keys(obj)) {
      if (findAndUpdateChapter(obj[key], eaId, sceneUpdates)) {
        return true;
      }
    }
    return false;
  }

  const chapterUpdates = new Map<string, Map<number, string>>();
  
  for (const fix of fixes) {
    const eaId = `EA-${fix.chapterNumber.toString().padStart(3, '0')}`;
    if (!chapterUpdates.has(eaId)) {
      chapterUpdates.set(eaId, new Map());
    }
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.preliminarySceneFocus);
  }

  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-prelim-194-195-final.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-prelim-194-195-final.json`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing remaining "preliminary_scene_focus" for EA-194 and EA-195\n');
  console.log('Converting old compressed format to Daughter archetype format\n');

  await updateDatabase();
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-194: 2 scenes (S1-S2 converted from old format)');
  console.log('  EA-195: 2 scenes (S1-S2 converted from old format)');
  console.log('  Total: 4 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
