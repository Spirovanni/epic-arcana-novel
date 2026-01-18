import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix chapterSceneFocus format for EA-194, EA-195, EA-198, EA-199
 * Format should be: Ch[NUM]S[SCENE]: [Description]—[Framework details and implications]
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  chapterSceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-194: Mental Clarity
  {
    chapterNumber: 194,
    sceneNumber: 1,
    chapterSceneFocus: "Ch194S1: Deep Work Sanctuary establishes clarity—Newport's distraction elimination framework showing focused concentration enables precision thinking despite scattered attention pressure"
  },
  {
    chapterNumber: 194,
    sceneNumber: 2,
    chapterSceneFocus: "Ch194S2: Deliberate Thinking Arena refines clarity—Kahneman's System 2 framework showing slow analytical thinking checks biases revealing systematic decision-making prevents fast intuition errors"
  },
  {
    chapterNumber: 194,
    sceneNumber: 3,
    chapterSceneFocus: "Ch194S3: Present Moment Nexus completes clarity—Kabat-Zinn's mindfulness framework showing present-moment awareness integrates deep work and deliberation enabling complete mental clarity through conscious presence"
  },

  // EA-195: Shared Wealth
  {
    chapterNumber: 195,
    sceneNumber: 1,
    chapterSceneFocus: "Ch195S1: Inclusive Innovation Foundry establishes equity—Christensen's inclusive innovation framework showing underserved market focus enables wealth distribution countering concentrated few"
  },
  {
    chapterNumber: 195,
    sceneNumber: 2,
    chapterSceneFocus: "Ch195S2: Sharing Platform Nexus refines equity—Sundararajan's sharing economy framework showing platform design translates theory into practical implementation enabling resource democratization"
  },
  {
    chapterNumber: 195,
    sceneNumber: 3,
    chapterSceneFocus: "Ch195S3: Collective Genius Summit completes wealth—Hill & Brandeau's collective genius framework showing distributed leadership transcends hierarchy enabling shared prosperity through collaborative innovation"
  },

  // EA-198: Justice
  {
    chapterNumber: 198,
    sceneNumber: 1,
    chapterSceneFocus: "Ch198S1: Rescue Aftermath establishes justice—Sandel's fairness analysis framework showing stakeholder identification and decision critique enable equitable resolution despite expedience pressure"
  },
  {
    chapterNumber: 198,
    sceneNumber: 2,
    chapterSceneFocus: "Ch198S2: Principled Negotiation advances justice—Fisher & Ury's interest-based framework showing position transcending and option generation enable win-win outcomes preventing positional bargaining deadlock"
  },
  {
    chapterNumber: 198,
    sceneNumber: 3,
    chapterSceneFocus: "Ch198S3: Accountability Demonstration completes justice—Covey's trust restoration framework showing metric definition and transparent reporting rebuild trust enabling healing through demonstrated accountability"
  },

  // EA-199: Incentivize
  {
    chapterNumber: 199,
    sceneNumber: 1,
    chapterSceneFocus: "Ch199S1: Legacy Creation establishes motivation—Pink's autonomy framework showing choice-enabling freedom creates sustainable guardian systems despite control efficiency temptation"
  },
  {
    chapterNumber: 199,
    sceneNumber: 2,
    chapterSceneFocus: "Ch199S2: Engagement Deepening advances motivation—Cialdini's reciprocity framework showing unconditional gift culture generates reciprocal momentum preventing transactional obligation brittleness"
  },
  {
    chapterNumber: 199,
    sceneNumber: 3,
    chapterSceneFocus: "Ch199S3: Legacy Completion achieves motivation—Duckworth's grit framework showing passion-connected identity-based practice enables enduring persistence transcending forced routine and fading interest"
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

      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title}`);
      
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
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-csf.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-csf.json`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing chapterSceneFocus format for EA-194, EA-195, EA-198, EA-199\n');
  console.log('Expected format: Ch[NUM]S[SCENE]: [Description]—[Framework details]\n');

  // Update database first
  await updateDatabase();

  // Then update outline
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-194: 3 scenes');
  console.log('  EA-195: 3 scenes');
  console.log('  EA-198: 3 scenes');
  console.log('  EA-199: 3 scenes');
  console.log('  Total: 12 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
