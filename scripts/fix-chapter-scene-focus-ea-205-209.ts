import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix chapterSceneFocus format for EA-205 through EA-209
 * Format: Ch[NUM]S[SCENE]: [Description]—[Framework details and implications]
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  chapterSceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-205: Sacrifice
  {
    chapterNumber: 205,
    sceneNumber: 1,
    chapterSceneFocus: "Ch205S1: Sacrifice Proving Ground establishes necessity—Campbell's Road of Trials framework showing first trial reveals old approaches blocking transformation demanding paradigm shift commitment"
  },
  {
    chapterNumber: 205,
    sceneNumber: 2,
    chapterSceneFocus: "Ch205S2: Risk Acceptance Chamber advances sacrifice—Sandberg's risk-taking framework showing fear override through trade-off planning and support systems enabling commitment deepening"
  },
  {
    chapterNumber: 205,
    sceneNumber: 3,
    chapterSceneFocus: "Ch205S3: Focus Purification Forge refines sacrifice—Newport's deep work framework showing shallow commitment elimination and deep work scheduling enabling mission concentration"
  },
  {
    chapterNumber: 205,
    sceneNumber: 4,
    chapterSceneFocus: "Ch205S4: Ultimate Commitment Mirror completes sacrifice—Campbell-Sandberg-Newport convergence showing integrated sacrifice, risk embodiment, and focus maintenance achieving total dedication"
  },

  // EA-206: Promise
  {
    chapterNumber: 206,
    sceneNumber: 1,
    chapterSceneFocus: "Ch206S1: Golden Circle Revelation establishes purpose—Sinek's Start with Why framework showing why-articulation (purpose-quest linkage) enables vision clarity and cosmic alchemist identity"
  },
  {
    chapterNumber: 206,
    sceneNumber: 2,
    chapterSceneFocus: "Ch206S2: Impeccable Word Forge advances promise—Ruiz's Four Agreements framework showing clear promise definition with upholding steps and daily progress tracking demonstrating integrity"
  },
  {
    chapterNumber: 206,
    sceneNumber: 3,
    chapterSceneFocus: "Ch206S3: Mission Statement Crucible refines promise—Covey's begin-with-end framework showing mission drafting with milestone identification and accountability checks enabling journey planning"
  },
  {
    chapterNumber: 206,
    sceneNumber: 4,
    chapterSceneFocus: "Ch206S4: Ultimate Promise Covenant completes commitment—Sinek-Ruiz-Covey convergence showing purpose-promise-mission integration unifying vision complete pledging universal restoration"
  },

  // EA-207: Mental Shift
  {
    chapterNumber: 207,
    sceneNumber: 1,
    chapterSceneFocus: "Ch207S1: Growth Mindset Nexus confronts refusal—Dweck's growth mindset framework showing fixed belief identification and limitation reframing enabling obstacle-as-opportunity perspective shift"
  },
  {
    chapterNumber: 207,
    sceneNumber: 2,
    chapterSceneFocus: "Ch207S2: Path-Shaping Chamber facilitates change—Heath brothers' Switch framework showing bright spots identification, critical moves scripting, and environment modification overcoming implementation resistance"
  },
  {
    chapterNumber: 207,
    sceneNumber: 3,
    chapterSceneFocus: "Ch207S3: Two Systems Crucible optimizes thinking—Kahneman's dual-process framework showing System 1/2 understanding and deliberate reasoning engagement enabling decision quality through processing slowdown"
  },
  {
    chapterNumber: 207,
    sceneNumber: 4,
    chapterSceneFocus: "Ch207S4: Ultimate Mental Shift Gateway completes transformation—Dweck-Heath-Kahneman convergence showing growth mindset-path shaping-systems balance integration completing refusal override achieving mental evolution"
  },

  // EA-208: Well-Grounded
  {
    chapterNumber: 208,
    sceneNumber: 1,
    chapterSceneFocus: "Ch208S1: Emotional Awareness Sanctum establishes grounding—Goleman's emotional intelligence framework showing emotion pattern identification and feeling labeling enabling regulation strategies despite transformation overwhelm"
  },
  {
    chapterNumber: 208,
    sceneNumber: 2,
    chapterSceneFocus: "Ch208S2: Radical Acceptance Crucible advances stability—Brach's radical acceptance framework showing reality resistance confrontation and limit acceptance enabling peace despite imperfection"
  },
  {
    chapterNumber: 208,
    sceneNumber: 3,
    chapterSceneFocus: "Ch208S3: Mindful Presence Chamber cultivates balance—Thich Nhat Hanh's mindfulness framework showing breathing practice, reactivity pausing, and body sensation awareness integrating daily presence"
  },
  {
    chapterNumber: 208,
    sceneNumber: 4,
    chapterSceneFocus: "Ch208S4: Ultimate Grounding Gateway completes well-grounded—Goleman-Brach-Hanh convergence showing awareness-acceptance-presence integration unifying stability complete achieving transformation stabilization"
  },

  // EA-209: Meticulous
  {
    chapterNumber: 209,
    sceneNumber: 1,
    chapterSceneFocus: "Ch209S1: Deep Focus Trap reveals refusal deepening—Newport's deep work framework showing distraction elimination excess and deep work obsession becoming perfectionism trap preventing action launch"
  },
  {
    chapterNumber: 209,
    sceneNumber: 2,
    chapterSceneFocus: "Ch209S2: Infinite Checklist Chamber exposes thoroughness excess—Gawande's checklist framework showing complexity management becoming endless checklist creation preventing task completion"
  },
  {
    chapterNumber: 209,
    sceneNumber: 3,
    chapterSceneFocus: "Ch209S3: Perpetual Organization Nexus reveals organization obsession—Allen's GTD framework showing task capture and action definition becoming endless organization preventing actual implementation"
  },
  {
    chapterNumber: 209,
    sceneNumber: 4,
    chapterSceneFocus: "Ch209S4: Imperfect Action Threshold achieves breakthrough—Newport-Gawande-Allen convergence showing perfectionism release through adequate planning acceptance enabling flawed action launch despite meticulous resistance"
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
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-csf-205-209.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-csf-205-209.json`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing chapterSceneFocus format for EA-205 through EA-209\n');
  console.log('Expected format: Ch[NUM]S[SCENE]: [Description]—[Framework details]\n');

  // Update database first
  await updateDatabase();

  // Then update outline
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-205 (Sacrifice): 4 scenes');
  console.log('  EA-206 (Promise): 4 scenes');
  console.log('  EA-207 (Mental Shift): 4 scenes');
  console.log('  EA-208 (Well-Grounded): 4 scenes');
  console.log('  EA-209 (Meticulous): 4 scenes');
  console.log('  Total: 20 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
