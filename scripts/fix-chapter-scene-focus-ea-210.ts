import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix chapterSceneFocus format for EA-210
 * Format: Ch[NUM]S[SCENE]: [Description]—[Framework details and implications]
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  chapterSceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-210: Originality
  {
    chapterNumber: 210,
    sceneNumber: 1,
    chapterSceneFocus: "Ch210S1: Mentor's Paradox Chamber discovers originality—Campbell's allies-mentors-helpers framework showing guidance gifts from supernatural aid enable insight integration and creative prototype development despite pressure"
  },
  {
    chapterNumber: 210,
    sceneNumber: 2,
    chapterSceneFocus: "Ch210S2: Blue Mind Sanctum accesses flow—Nichols' blue mind framework showing water-inspired clarity moments and trigger mechanism analysis enable creative ritual design for consistent flow state access"
  },
  {
    chapterNumber: 210,
    sceneNumber: 3,
    chapterSceneFocus: "Ch210S3: Creative Confidence Forge builds courage—Kelley brothers' creative confidence framework showing limiting belief confrontation and opportunity reframing enable bold prototyping with peer feedback overcoming self-doubt"
  },
  {
    chapterNumber: 210,
    sceneNumber: 4,
    chapterSceneFocus: "Ch210S4: Ultimate Originality Gateway completes innovation—Campbell-Nichols-Kelley convergence showing mentor guidance-flow state-creative confidence integration unifying creativity complete achieving breakthrough demonstration"
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  for (const fix of fixes) {
    // Find the chapter
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, fix.chapterNumber))
      .limit(1);

    if (!chapter) {
      console.log(`   ⚠️  Chapter ${fix.chapterNumber} not found, skipping`);
      continue;
    }

    // Find and update the scene
    const result = await db
      .update(scenes)
      .set({ chapterSceneFocus: fix.chapterSceneFocus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated`);
    } else {
      console.log(`   ⚠️  Ch${fix.chapterNumber}S${fix.sceneNumber}: Scene not found`);
    }
  }

  console.log('\n✅ Database updated!\n');
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
          scene.chapterSceneFocus = newValue;
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

  // Group fixes by chapter
  const chapterUpdates = new Map<string, Map<number, string>>();
  
  for (const fix of fixes) {
    const eaId = `EA-${fix.chapterNumber.toString().padStart(3, '0')}`;
    if (!chapterUpdates.has(eaId)) {
      chapterUpdates.set(eaId, new Map());
    }
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.chapterSceneFocus);
  }

  // Update each chapter
  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  // Create backup
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-csf-210.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-csf-210.json`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing chapterSceneFocus format for EA-210\n');
  console.log('Expected format: Ch[NUM]S[SCENE]: [Description]—[Framework details]\n');

  // Update database first
  await updateDatabase();

  // Then update outline
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-210 (Originality): 4 scenes');
  console.log('  Total: 4 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
