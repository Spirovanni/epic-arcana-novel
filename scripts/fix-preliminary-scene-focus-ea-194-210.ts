import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "preliminary_scene_focus" column for EA-194 through EA-210
 * Format: "Daughter [action/description] [progression/context]"
 * MAX LENGTH: 255 characters
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  preliminarySceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-194: Mental Clarity (S3 only)
  {
    chapterNumber: 194,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter integrating clarity practices into complete mental precision through present-moment awareness"
  },

  // EA-195: Shared Wealth (S3 only)
  {
    chapterNumber: 195,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter completing wealth distribution through collective genius transcending hierarchical limits"
  },

  // EA-198: Justice
  {
    chapterNumber: 198,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter establishing cosmic fairness through stakeholder analysis despite expedience pressure"
  },
  {
    chapterNumber: 198,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter advancing justice through principled negotiation transcending positional deadlock"
  },
  {
    chapterNumber: 198,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter completing justice through demonstrated accountability enabling universal healing"
  },

  // EA-199: Incentivize
  {
    chapterNumber: 199,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter establishing sustainable motivation foundation choosing autonomy over control despite uncertainty"
  },
  {
    chapterNumber: 199,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter deepening engagement through gift culture transcending transactional obligation"
  },
  {
    chapterNumber: 199,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter completing motivation mastery through passion-connected persistence enabling enduring legacy"
  },

  // EA-205: Sacrifice
  {
    chapterNumber: 205,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter confronting sacrifice necessity releasing old paradigms despite security temptation"
  },
  {
    chapterNumber: 205,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter accepting strategic risks overriding fear through courage development"
  },
  {
    chapterNumber: 205,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter purifying focus eliminating shallow commitments concentrating on mission impact"
  },
  {
    chapterNumber: 205,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving ultimate commitment integrating sacrifice, risk, and focus into total dedication"
  },

  // EA-206: Promise
  {
    chapterNumber: 206,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering core purpose articulating why behind cosmic restoration quest"
  },
  {
    chapterNumber: 206,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter forging impeccable word defining clear promises demonstrating integrity through action"
  },
  {
    chapterNumber: 206,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter composing mission statement envisioning destination planning journey with milestones"
  },
  {
    chapterNumber: 206,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter sealing ultimate promise covenant pledging universal restoration with total dedication"
  },

  // EA-207: Mental Shift
  {
    chapterNumber: 207,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter confronting fixed beliefs reframing obstacles as growth opportunities despite doubt"
  },
  {
    chapterNumber: 207,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter shaping implementation path identifying bright spots modifying environment for change"
  },
  {
    chapterNumber: 207,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter optimizing thinking processes engaging deliberate reasoning for complex decisions"
  },
  {
    chapterNumber: 207,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter completing mental transformation integrating mindset, path, and systems into evolution"
  },

  // EA-208: Well-Grounded
  {
    chapterNumber: 208,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter building emotional awareness identifying patterns labeling feelings enabling regulation"
  },
  {
    chapterNumber: 208,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter practicing radical acceptance releasing resistance embracing reality finding peace"
  },
  {
    chapterNumber: 208,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter cultivating mindful presence anchoring awareness in now creating response space"
  },
  {
    chapterNumber: 208,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving ultimate grounding integrating awareness, acceptance, and presence into stability"
  },

  // EA-209: Meticulous
  {
    chapterNumber: 209,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter trapped in perfectionism obsessing over focus avoiding action through preparation"
  },
  {
    chapterNumber: 209,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter multiplying complexity creating infinite checklists preventing task completion"
  },
  {
    chapterNumber: 209,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter perfecting organization endlessly arranging systems avoiding actual implementation"
  },
  {
    chapterNumber: 209,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter breaking through perfectionism releasing meticulous resistance launching flawed action"
  },

  // EA-210: Originality
  {
    chapterNumber: 210,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter receiving supernatural aid integrating mentor wisdom with personal innovation"
  },
  {
    chapterNumber: 210,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter accessing flow states designing creative rituals for consistent innovation"
  },
  {
    chapterNumber: 210,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter building creative confidence prototyping boldly overcoming innovation fears"
  },
  {
    chapterNumber: 210,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving ultimate originality integrating guidance, flow, and courage into breakthrough"
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    // Verify length
    if (fix.preliminarySceneFocus.length > 255) {
      console.log(`   ⚠️  WARNING: Ch${fix.chapterNumber}S${fix.sceneNumber} is ${fix.preliminarySceneFocus.length} chars (exceeds 255)`);
      continue;
    }

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

  // Group fixes by chapter
  const chapterUpdates = new Map<string, Map<number, string>>();
  
  for (const fix of fixes) {
    const eaId = `EA-${fix.chapterNumber.toString().padStart(3, '0')}`;
    if (!chapterUpdates.has(eaId)) {
      chapterUpdates.set(eaId, new Map());
    }
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.preliminarySceneFocus);
  }

  // Update each chapter
  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  // Create backup
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-prelim-194-210.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-prelim-194-210.json`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing "preliminary_scene_focus" column for EA-194 through EA-210\n');
  console.log('Expected format: "Daughter [action/description] [progression/context]"\n');
  console.log('Max length: 255 characters\n');

  // Update database first
  await updateDatabase();

  // Then update outline
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-194: 1 scene (S3 was NULL)');
  console.log('  EA-195: 1 scene (S3 was NULL)');
  console.log('  EA-198: 3 scenes (all brief)');
  console.log('  EA-199: 3 scenes (all brief)');
  console.log('  EA-205: 4 scenes (all brief)');
  console.log('  EA-206: 4 scenes (all brief)');
  console.log('  EA-207: 4 scenes (1 NULL, 3 brief)');
  console.log('  EA-208: 4 scenes (1 NULL, 3 brief)');
  console.log('  EA-209: 4 scenes (1 NULL, 3 brief)');
  console.log('  EA-210: 4 scenes (all brief)');
  console.log('  Total: 32 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
