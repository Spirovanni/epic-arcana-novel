import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "focus" column for EA-194 through EA-210
 * Format: [Character] [action/framework]—[detailed mechanism and implications]
 * MAX LENGTH: 255 characters
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  focus: string;
}

// Helper to ensure focus is under 255 chars
function truncate(text: string): string {
  return text.length > 255 ? text.substring(0, 252) + '...' : text;
}

const fixes: SceneFix[] = [
  // EA-194: Mental Clarity (S3 only)
  {
    chapterNumber: 194,
    sceneNumber: 3,
    focus: truncate("Francisco integrating Tolle's presence with Newport's deep work and Kahneman's deliberation—mindful awareness anchoring concentration in now transcends distraction and bias creating precision-ultimate cognitive state")
  },

  // EA-195: Shared Wealth (S3 only)
  {
    chapterNumber: 195,
    sceneNumber: 3,
    focus: truncate("Francisco implementing Hill & Brandeau's collective genius with Christensen's inclusive innovation and Sundararajan's platform—distributed leadership enables collaborative prosperity through amplified collective intelligence")
  },

  // EA-198: Justice
  {
    chapterNumber: 198,
    sceneNumber: 1,
    focus: truncate("Francisco employing Sandel's justice philosophy analyzing post-rescue decisions—stakeholder identification and decision critique using equity principles enable balanced resolution despite expedience pressure")
  },
  {
    chapterNumber: 198,
    sceneNumber: 2,
    focus: truncate("Francisco applying Fisher & Ury's principled negotiation transcending positions—mapping interests, generating options, applying objective criteria enable win-win outcomes preventing deadlock")
  },
  {
    chapterNumber: 198,
    sceneNumber: 3,
    focus: truncate("Francisco implementing Covey's trust restoration through demonstrated accountability—defining metrics, establishing checkpoints, communicating transparently rebuild credibility completing justice sequence")
  },

  // EA-199: Incentivize
  {
    chapterNumber: 199,
    sceneNumber: 1,
    focus: truncate("Francisco establishing Pink's autonomy-mastery-purpose framework—choice-enabling freedom and purpose clarity create intrinsic drive transcending control, autonomous guardians innovating beyond controlled ones")
  },
  {
    chapterNumber: 199,
    sceneNumber: 2,
    focus: truncate("Francisco implementing Cialdini's reciprocity through gift culture—giving freely creates reciprocal momentum transcending transactional brittleness, relational reciprocity generating innovation tracked debts prevent")
  },
  {
    chapterNumber: 199,
    sceneNumber: 3,
    focus: truncate("Francisco integrating Duckworth's grit with autonomy and reciprocity—identity-based persistence where guardians define themselves through work enables enduring effort transcending forced routine and fading interest")
  },

  // EA-205: Sacrifice
  {
    chapterNumber: 205,
    sceneNumber: 1,
    focus: truncate("Francisco encountering Campbell's Road of Trials sacrifice necessity—first trial reveals old approaches blocking transformation demanding paradigm release creating space for cosmic alchemist emergence")
  },
  {
    chapterNumber: 205,
    sceneNumber: 2,
    focus: truncate("Francisco employing Sandberg's risk-taking overriding fear through strategic acceptance—trade-off planning and support enlistment enable commitment deepening beyond safety zone through courage development")
  },
  {
    chapterNumber: 205,
    sceneNumber: 3,
    focus: truncate("Francisco implementing Newport's deep work purifying focus through shallow elimination—auditing low-value commitments and scheduling deep blocks enable mission concentration directing time toward highest-impact activities")
  },
  {
    chapterNumber: 205,
    sceneNumber: 4,
    focus: truncate("Francisco integrating Campbell-Sandberg-Newport convergence achieving ultimate commitment—sacrifice enacted, risk embodied, focus maintained combine creating total dedication enabling cosmic alchemist identity")
  },

  // EA-206: Promise
  {
    chapterNumber: 206,
    sceneNumber: 1,
    focus: truncate("Francisco discovering Sinek's Golden Circle through why-articulation—linking motivation to cosmic restoration creates vision clarity and cosmic alchemist identity revealing how passion connects to universal mission")
  },
  {
    chapterNumber: 206,
    sceneNumber: 2,
    focus: truncate("Francisco forging Ruiz's Impeccable Word through clear promise definition—outlining upholding steps and tracking progress demonstrates integrity showing words create reality when aligned with action")
  },
  {
    chapterNumber: 206,
    sceneNumber: 3,
    focus: truncate("Francisco crafting Covey's mission statement through begin-with-end—envisioning destination enables backward planning with milestones and accountability translating vision into actionable journey map")
  },
  {
    chapterNumber: 206,
    sceneNumber: 4,
    focus: truncate("Francisco establishing ultimate promise covenant integrating Sinek-Ruiz-Covey—purpose-promise-mission unity pledges universal restoration showing cosmic guardianship requires total dedication synthesizing passion and integrity")
  },

  // EA-207: Mental Shift
  {
    chapterNumber: 207,
    sceneNumber: 1,
    focus: truncate("Francisco discovering Dweck's growth mindset confronting fixed beliefs—reframing obstacles as opportunities enables perspective shift viewing challenges as training rather than judgment creating learning orientation")
  },
  {
    chapterNumber: 207,
    sceneNumber: 2,
    focus: truncate("Francisco applying Heath brothers' Switch facilitating change—identifying bright spots, scripting moves, modifying environment overcome resistance showing change succeeds through systematic adjustment transcending motivation-dependence")
  },
  {
    chapterNumber: 207,
    sceneNumber: 3,
    focus: truncate("Francisco employing Kahneman's dual-process optimizing thinking—understanding System 1/2 enables engaging appropriate mode showing complex choices require slow analytical processing despite intuition's efficiency appeal")
  },
  {
    chapterNumber: 207,
    sceneNumber: 4,
    focus: truncate("Francisco achieving ultimate mental shift integrating Dweck-Heath-Kahneman—growth mindset-path shaping-systems balance convergence completes transformation overcoming refusal through combined belief change and processing optimization")
  },

  // EA-208: Well-Grounded
  {
    chapterNumber: 208,
    sceneNumber: 1,
    focus: truncate("Francisco developing Goleman's emotional intelligence through awareness—identifying emotion patterns and labeling feelings enables regulation strategies showing transformation overwhelm becomes manageable through conscious recognition")
  },
  {
    chapterNumber: 208,
    sceneNumber: 2,
    focus: truncate("Francisco practicing Brach's radical acceptance releasing resistance—confronting truth and accepting limits enables peace despite imperfection showing serenity emerges from embracing what is rather than demanding what should be")
  },
  {
    chapterNumber: 208,
    sceneNumber: 3,
    focus: truncate("Francisco cultivating Thich Nhat Hanh's mindfulness through presence practice—breathing exercises and reactivity pausing integrate daily presence showing awareness anchored in now creates response space between stimulus and reaction")
  },
  {
    chapterNumber: 208,
    sceneNumber: 4,
    focus: truncate("Francisco completing well-grounded integration through Goleman-Brach-Hanh—awareness-acceptance-presence synthesis achieves transformation stabilization showing emotional intelligence, acceptance, and mindfulness combine creating unshakeable foundation")
  },

  // EA-209: Meticulous
  {
    chapterNumber: 209,
    sceneNumber: 1,
    focus: truncate("Francisco confronting Newport's deep work shadow revealing perfectionism trap—distraction elimination excess becoming action avoidance showing excellence tools misapplied create paralysis when thoroughness becomes endless preparation")
  },
  {
    chapterNumber: 209,
    sceneNumber: 2,
    focus: truncate("Francisco encountering Gawande's checklist shadow exposing complexity obsession—comprehensiveness creating infinite expansion preventing completion showing useful tool becomes obstacle when complexity devolves into perpetual refinement")
  },
  {
    chapterNumber: 209,
    sceneNumber: 3,
    focus: truncate("Francisco facing Allen's GTD shadow revealing organization obsession—task capture becoming endless system perfection preventing implementation showing productivity methodology misused creates perpetual arranging avoiding doing")
  },
  {
    chapterNumber: 209,
    sceneNumber: 4,
    focus: truncate("Francisco achieving breakthrough through Newport-Gawande-Allen integration releasing perfectionism—adequate planning acceptance enables imperfect action showing done-adequately surpasses planned-perfectly enabling transformation despite imperfection fears")
  },

  // EA-210: Originality
  {
    chapterNumber: 210,
    sceneNumber: 1,
    focus: truncate("Francisco receiving Campbell's supernatural aid through mentor guidance—allies-mentors-helpers showing wisdom gifts enable creative prototype development revealing originality emerges from integrating guidance with personal innovation")
  },
  {
    chapterNumber: 210,
    sceneNumber: 2,
    focus: truncate("Francisco accessing Nichols' blue mind flow through water-inspired clarity—analyzing trigger mechanisms enables creative ritual design showing consistent innovation requires environmental cues transcending waiting for inspiration")
  },
  {
    chapterNumber: 210,
    sceneNumber: 3,
    focus: truncate("Francisco building Kelley brothers' creative confidence overcoming doubt—confronting limiting beliefs and prototyping boldly with feedback enable courage development showing innovation fears dissolve through small experiments")
  },
  {
    chapterNumber: 210,
    sceneNumber: 4,
    focus: truncate("Francisco achieving ultimate originality through Campbell-Nichols-Kelley convergence—mentor guidance-flow state-confidence integration unifies innovation showing breakthrough emerges from combining received wisdom, creative practice, and courage")
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    // Verify length
    if (fix.focus.length > 255) {
      console.log(`   ⚠️  WARNING: Ch${fix.chapterNumber}S${fix.sceneNumber} focus is ${fix.focus.length} chars (exceeds 255)`);
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
      .set({ focus: fix.focus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated (${fix.focus.length} chars)`);
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
          scene.focus = newValue;
          console.log(`   ✅ Updated Scene ${sceneNum} focus`);
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
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.focus);
  }

  // Update each chapter
  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  // Create backup
  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-focus-194-210.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-focus-194-210.json`);

  // Write updated outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing "focus" column for EA-194 through EA-210\n');
  console.log('Expected format: [Character] [action/framework]—[detailed mechanism and implications]\n');
  console.log('Max length: 255 characters\n');

  // Update database first
  await updateDatabase();

  // Then update outline
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated scenes:');
  console.log('  EA-194: 1 scene (S3 was missing)');
  console.log('  EA-195: 1 scene (S3 was missing)');
  console.log('  EA-198: 3 scenes (all brief)');
  console.log('  EA-199: 3 scenes (all brief)');
  console.log('  EA-205: 4 scenes (all brief)');
  console.log('  EA-206: 4 scenes (all brief)');
  console.log('  EA-207: 4 scenes (all brief)');
  console.log('  EA-208: 4 scenes (all brief)');
  console.log('  EA-209: 4 scenes (all brief)');
  console.log('  EA-210: 4 scenes (all brief)');
  console.log('  Total: 32 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
