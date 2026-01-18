import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "focus" column for EA-194 through EA-210
 * Format: [Character] [action/framework]—[detailed explanation of mechanism, implications, and results]
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  focus: string;
}

const fixes: SceneFix[] = [
  // EA-194: Mental Clarity (S1 and S2 already good, only S3 needs fix)
  {
    chapterNumber: 194,
    sceneNumber: 3,
    focus: "Francisco integrating Tolle's present-moment awareness with Newport's deep work and Kahneman's deliberate thinking—complete mental clarity emerges through mindful presence anchoring concentration and analysis in now, transcending distraction and bias through conscious attention to immediate experience creating precision-ultimate cognitive state."
  },

  // EA-195: Shared Wealth (S1 and S2 already good, only S3 needs fix)
  {
    chapterNumber: 195,
    sceneNumber: 3,
    focus: "Francisco implementing Hill & Brandeau's collective genius framework integrating Christensen's inclusive innovation and Sundararajan's sharing platform—distributed leadership transcends hierarchical bottlenecks enabling collaborative prosperity through amplified collective intelligence where diverse perspectives combine creating wealth-shared beyond individual capacity."
  },

  // EA-198: Justice (all 3 scenes need complete rewrite)
  {
    chapterNumber: 198,
    sceneNumber: 1,
    focus: "Francisco employing Sandel's justice philosophy to analyze post-rescue decisions for fairness—stakeholder identification and decision critique using equity principles enable balanced resolution despite expedience pressure, establishing accountability framework where fair outcomes serve universal healing better than quick fixes."
  },
  {
    chapterNumber: 198,
    sceneNumber: 2,
    focus: "Francisco applying Fisher & Ury's principled negotiation framework transcending positional bargaining—separating people from problem, mapping interests versus positions, generating multiple options, and applying objective criteria enable win-win outcomes preventing deadlock, advancing justice through interest-based resolution."
  },
  {
    chapterNumber: 198,
    sceneNumber: 3,
    focus: "Francisco implementing Covey's trust restoration through demonstrated accountability—defining specific trust metrics, establishing scheduled checkpoints, and communicating progress transparently rebuild credibility and complete justice sequence, enabling healing through accountable action versus empty promises."
  },

  // EA-199: Incentivize (all 3 scenes need complete rewrite)
  {
    chapterNumber: 199,
    sceneNumber: 1,
    focus: "Francisco establishing Pink's autonomy-mastery-purpose framework for sustainable guardian motivation—choice-enabling freedom, mastery pathways, and purpose clarity create intrinsic drive transcending control-based compliance, autonomous guardians innovating solutions that controlled ones never discover despite efficiency temptation."
  },
  {
    chapterNumber: 199,
    sceneNumber: 2,
    focus: "Francisco implementing Cialdini's reciprocity principle through unconditional gift culture—giving freely without expectation creates reciprocal momentum and collaborative abundance transcending transactional obligation brittleness, relational reciprocity generating innovation that tracked debts prevent through generosity-inspiring generosity."
  },
  {
    chapterNumber: 199,
    sceneNumber: 3,
    focus: "Francisco integrating Duckworth's grit framework with autonomy and reciprocity through passion-connected practice—identity-based persistence where guardians define themselves through cosmic work enables enduring effort transcending forced routine and fading interest, intrinsic purpose sustaining commitment when external motivation fails."
  },

  // EA-205: Sacrifice (all 4 scenes need complete rewrite)
  {
    chapterNumber: 205,
    sceneNumber: 1,
    focus: "Francisco encountering Campbell's Road of Trials sacrifice necessity—first trial revealing old approaches blocking transformation demands paradigm release and commitment deepening, sacrifice framework showing growth requires releasing familiar patterns despite security temptation creating space for cosmic alchemist emergence."
  },
  {
    chapterNumber: 205,
    sceneNumber: 2,
    focus: "Francisco employing Sandberg's risk-taking framework overriding fear through strategic acceptance—trade-off planning, mitigation strategies, and support system enlistment enable commitment deepening beyond safety zone, calculated risk-acceptance advancing sacrifice through courage development transcending loss-avoidance paralysis."
  },
  {
    chapterNumber: 205,
    sceneNumber: 3,
    focus: "Francisco implementing Newport's deep work discipline purifying focus through shallow elimination—audit revealing low-value commitments, strategic dropping, and deep work scheduling enable mission concentration, focus-purification refining sacrifice by directing limited time toward highest-impact cosmic activities eliminating distractions."
  },
  {
    chapterNumber: 205,
    sceneNumber: 4,
    focus: "Francisco integrating Campbell-Sandberg-Newport convergence achieving ultimate commitment—sacrifice enacted through paradigm release, risk embodied through fear override, focus maintained through shallow elimination combine creating total dedication, complete sacrifice framework enabling cosmic alchemist identity through integrated transformation."
  },

  // EA-206: Promise (all 4 scenes need complete rewrite)
  {
    chapterNumber: 206,
    sceneNumber: 1,
    focus: "Francisco discovering Sinek's Golden Circle purpose through why-articulation—linking deepest motivation to cosmic restoration quest creates vision clarity and cosmic alchemist identity, purpose-discovery revealing how personal passion connects to universal mission enabling authentic commitment beyond obligation."
  },
  {
    chapterNumber: 206,
    sceneNumber: 2,
    focus: "Francisco forging Ruiz's Impeccable Word through clear promise definition—outlining specific upholding steps and tracking daily progress demonstrates integrity, promise-making framework showing words create reality when aligned with action, impeccable commitment establishing trustworthy character through demonstrated follow-through."
  },
  {
    chapterNumber: 206,
    sceneNumber: 3,
    focus: "Francisco crafting Covey's mission statement through begin-with-end framework—envisioning destination enables backward planning with milestone identification and accountability scheduling, mission-composition translating vision into actionable journey map providing navigation guidance and progress measurement structure."
  },
  {
    chapterNumber: 206,
    sceneNumber: 4,
    focus: "Francisco establishing ultimate promise covenant integrating Sinek-Ruiz-Covey frameworks—purpose why-mission integration unifies vision complete pledging universal restoration, promise-completion framework showing partial commitments insufficient as cosmic guardianship requires total dedication synthesizing passion, integrity, and strategic planning."
  },

  // EA-207: Mental Shift (all 4 scenes need complete rewrite)
  {
    chapterNumber: 207,
    sceneNumber: 1,
    focus: "Francisco discovering Dweck's growth mindset confronting fixed beliefs—identifying limitation thoughts and reframing obstacles as opportunities enables perspective shift, mindset-transformation showing challenges reveal capacity for development when viewed as training rather than judgment creating learning orientation."
  },
  {
    chapterNumber: 207,
    sceneNumber: 2,
    focus: "Francisco applying Heath brothers' Switch framework facilitating change implementation—identifying bright spots, scripting critical moves, and modifying environment overcome resistance, path-shaping showing change succeeds through systematic adjustment of circumstances and clarity of direction transcending motivation-dependence alone."
  },
  {
    chapterNumber: 207,
    sceneNumber: 3,
    focus: "Francisco employing Kahneman's dual-process framework optimizing thinking quality—understanding System 1 fast intuition versus System 2 deliberate reasoning enables engaging appropriate cognitive mode for decisions, systems-balance showing complex choices require slow analytical processing despite intuition's efficiency appeal preventing bias errors."
  },
  {
    chapterNumber: 207,
    sceneNumber: 4,
    focus: "Francisco achieving ultimate mental shift integrating Dweck-Heath-Kahneman frameworks—growth mindset-path shaping-systems balance convergence completes transformation, perspective-completion showing refusal overcome through combined belief change, environmental adjustment, and processing optimization enabling mental evolution beyond fixed patterns."
  },

  // EA-208: Well-Grounded (all 4 scenes need complete rewrite)
  {
    chapterNumber: 208,
    sceneNumber: 1,
    focus: "Francisco developing Goleman's emotional intelligence through awareness grounding—identifying emotion patterns and labeling feelings accurately enables regulation strategies, emotional-awareness showing transformation overwhelm becomes manageable through conscious recognition and naming of internal states creating stability foundation."
  },
  {
    chapterNumber: 208,
    sceneNumber: 2,
    focus: "Francisco practicing Brach's radical acceptance releasing reality resistance—confronting truth without fighting and accepting transformation limits enables peace despite imperfection, acceptance-framework showing serenity emerges from embracing what is rather than demanding what should be, releasing control enabling genuine stability."
  },
  {
    chapterNumber: 208,
    sceneNumber: 3,
    focus: "Francisco cultivating Thich Nhat Hanh's mindfulness through present-moment practice—breathing exercises, reactivity pausing, and body sensation awareness integrate daily presence, mindfulness-grounding showing awareness anchored in now prevents fragmentation and creates response space between stimulus and reaction enabling conscious choice."
  },
  {
    chapterNumber: 208,
    sceneNumber: 4,
    focus: "Francisco completing well-grounded integration through Goleman-Brach-Hanh convergence—awareness-acceptance-presence synthesis unifies stability achieving transformation stabilization, grounding-completion showing emotional intelligence, radical acceptance, and mindful presence combine creating unshakeable foundation enabling continued cosmic work."
  },

  // EA-209: Meticulous (all 4 scenes need complete rewrite)
  {
    chapterNumber: 209,
    sceneNumber: 1,
    focus: "Francisco confronting Newport's deep work framework shadow revealing perfectionism trap—distraction elimination excess and deep work obsession becoming action avoidance, focus-trap showing excellence tools misapplied create paralysis when thoroughness becomes endless preparation preventing launch despite readiness."
  },
  {
    chapterNumber: 209,
    sceneNumber: 2,
    focus: "Francisco encountering Gawande's checklist framework shadow exposing complexity obsession—comprehensiveness pursuit creating infinite checklist expansion preventing completion, thoroughness-excess showing useful tool becomes obstacle when complexity management devolves into perpetual refinement avoiding actual task execution."
  },
  {
    chapterNumber: 209,
    sceneNumber: 3,
    focus: "Francisco facing Allen's GTD framework shadow revealing organization obsession—task capture and action definition becoming endless system perfection preventing implementation, organization-trap showing productivity methodology misused creates perpetual arranging avoiding doing despite perfect capture structure."
  },
  {
    chapterNumber: 209,
    sceneNumber: 4,
    focus: "Francisco achieving breakthrough through Newport-Gawande-Allen integration releasing perfectionism—adequate planning acceptance enables imperfect action launch transcending meticulous resistance, action-threshold showing flawed execution beats perfect preparation as done-adequately surpasses planned-perfectly enabling transformation despite imperfection fears."
  },

  // EA-210: Originality (all 4 scenes need complete rewrite)
  {
    chapterNumber: 210,
    sceneNumber: 1,
    focus: "Francisco receiving Campbell's supernatural aid through mentor guidance paradox—allies-mentors-helpers framework showing wisdom gifts and insight integration enable creative prototype development, mentor-discovery revealing originality emerges from integrating received guidance with personal innovation despite pressure for conventional solutions."
  },
  {
    chapterNumber: 210,
    sceneNumber: 2,
    focus: "Francisco accessing Nichols' blue mind flow state through water-inspired clarity—recalling aquatic peace moments and analyzing trigger mechanisms enable creative ritual design, flow-framework showing consistent innovation requires environmental cues and mental preparation transcending waiting for inspiration enabling sustainable creativity."
  },
  {
    chapterNumber: 210,
    sceneNumber: 3,
    focus: "Francisco building Kelley brothers' creative confidence overcoming self-doubt—confronting limiting beliefs, reframing opportunities positively, and prototyping boldly with peer feedback enable courage development, confidence-framework showing innovation fears dissolve through small experiments and supportive feedback transcending doubt paralysis."
  },
  {
    chapterNumber: 210,
    sceneNumber: 4,
    focus: "Francisco achieving ultimate originality through Campbell-Nichols-Kelley convergence—mentor guidance-flow state-creative confidence integration unifies innovation complete, originality-completion showing breakthrough emerges from combining received wisdom, consistent creative practice, and courage to share imperfect work enabling transformation through authentic innovation."
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
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
      .set({ focus: fix.focus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated focus`);
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
