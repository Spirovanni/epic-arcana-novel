import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-102 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-102: Known Options...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-102'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-102 not found. Run create-ea-102-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-102-chapter-data.json');
  const chapterData = JSON.parse(fs.readFileSync(chapterDataPath, 'utf-8'));

  let sceneCount = 0;

  for (const sceneData of chapterData.scenes) {
    console.log(`\n📝 Processing Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);

    // Check if scene already exists
    const existingScene = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-102'),
          eq(scenes.sceneNumber, sceneData.scene_number)
        )
      )
      .limit(1);

    if (existingScene.length > 0) {
      console.log(`   ⚠️  Scene ${sceneData.scene_number} already exists. Skipping.`);
      continue;
    }

    // Step 1: Insert base scene data
    const baseSceneData = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-102',
      sceneNumber: sceneData.scene_number,
      title: truncate(sceneData.scene_title, 255),
      setup: sceneData.setup,
      symbolism: sceneData.symbolism,
      beatGoal: sceneData.beat_goal,
      pov: sceneData.pov,
      tense: sceneData.tense,
      core_emotion: sceneData.core_emotion,
      scene_tone: sceneData.scene_tone,
      timeline_date: sceneData.timeline_date || null,
      timeline_variant: sceneData.timeline_variant || null,
      location: sceneData.location || null,
      narrativeFunction: sceneData.narrative_function || null,
    };

    const [insertedScene] = await db.insert(scenes).values(baseSceneData).returning();
    console.log(`   ✅ Base scene inserted (ID: ${insertedScene.id})`);

    // Step 2: Update with enhanced fields
    let enhancedData: any = {};

    // Determine page range and enhanced content based on scene number
    if (sceneData.scene_number === 1) {
      enhancedData = {
        pages: 'Page 316 - 321',
        description: truncate(
          'Three factions approach Francisco with distinct proposals after his resistance to Dagon. Each option appears in vision-chalices showing possible futures, but something feels off. Success makes them targets for co-option rather than direct conflict.',
          500
        ),
        focus: truncate(
          'Establishing decision-making challenge with multiple seemingly-valid options containing hidden trade-offs',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch102S1: Three factions offer distinct paths—knowledge for inaction, power for aggression, safety for submission',
          255
        ),
        preliminarySceneFocus: truncate('Multiple seductive possibilities requiring discernment', 255),
        preliminarySceneDescription: truncate(
          'Seven of Cups manifests as vision-chalices showing three futures, each hiding costs beneath appealing outcomes',
          500
        ),
        sensoryDetail: truncate(
          'Seven chalices swirling with luminous visions, each showing Francisco\'s community thriving but with subtle wrongness in the edges, the weight of three sealed proposals on the table, Zara\'s cautious expression as sophisticated danger manifests',
          500
        ),
        internalConflict: truncate(
          'Francisco torn between gratitude for options and suspicion that success attracts control attempts disguised as opportunities',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco developing strategic caution—recognizing that not all offered paths serve authentic goals',
          255
        ),
        seriesConnectionResonance: truncate(
          'Pattern of sophisticated co-option attempts that will escalate throughout series as Francisco\'s influence grows',
          255
        ),
        sceneCardProgression: 304,
        realWorldContext: truncate(
          '11/18/1347 Morning—three days post-ordeal when consequences manifest as competing strategic proposals',
          255
        ),
        timelineSignificance: truncate(
          'Decision point where Francisco\'s choice determines whether he maintains autonomy or becomes controlled through seduction',
          255
        ),
        saveTheCatBeat: truncate('Reaction setup - multiple paths emerging requiring evaluation', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'medium-high',
          pacing: 'deliberative_cautious',
          narrative_mode: 'strategic_uncertainty',
          emotional_arc: 'responsibility_weight_with_mounting_pressure',
        }),
        learning_objectives: JSON.stringify([
          'Success attracts sophisticated control attempts disguised as opportunities',
          'Multiple valid-appearing options often contain hidden trade-offs requiring systematic evaluation',
          'Strategic caution demonstrates mature leadership rather than timidity or fear',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Seven of Cups challenge establishing pattern for discernment tests throughout series',
          'Sophisticated enemies adapting strategies from direct conflict to co-option attempts',
          'Fourth-path thinking—creative synthesis beyond presented false dilemmas',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 322 - 326',
        description: truncate(
          'Francisco and Zara systematically evaluate each chalice-vision, probing beneath surface appeal to reveal hidden costs. A fourth possibility emerges through creative synthesis—refusing false dilemmas to forge an authentic path.',
          500
        ),
        focus: truncate(
          'Demonstrating strategic option evaluation: systematic analysis revealing hidden costs and generating creative alternatives',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch102S2: Mapping trade-offs for each option reveals all three betray core values in different ways',
          255
        ),
        preliminarySceneFocus: truncate('Systematic discernment dissolving illusions', 255),
        preliminarySceneDescription: truncate(
          'Collaborative analysis exposes each chalice-vision\'s true costs, revealing that the real choice is rejecting all three to forge a fourth path',
          500
        ),
        sensoryDetail: truncate(
          'Decision matrix materializing as they map options, chalices fading as false choices are exposed, the moment creative synthesis emerges showing a path not contained in any presented option, partnership energy flowing between Francisco and Zara',
          500
        ),
        internalConflict: truncate(
          'Zara balancing analytical rigor with openness to creative solutions beyond presented frameworks',
          255
        ),
        characterGrowthElement: truncate(
          'Zara demonstrating that true partnership means systematic collaboration in complex decision-making',
          255
        ),
        seriesConnectionResonance: truncate(
          'Decision-making methodology establishing template for how Francisco/Zara dyad approaches complex choices throughout series',
          255
        ),
        sceneCardProgression: 305,
        realWorldContext: truncate(
          '11/18/1347 Afternoon—intensive analysis session revealing that all presented options contain unacceptable compromises',
          255
        ),
        timelineSignificance: truncate(
          'Methodical evaluation creates timeline clarity—discernment prevents choosing paths that would compromise future options',
          255
        ),
        saveTheCatBeat: truncate('Reaction - systematic evaluation revealing creative alternatives', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'medium',
          pacing: 'methodical_revelatory',
          narrative_mode: 'analytical_synthesis',
          emotional_arc: 'clarity_emerging_through_collaboration',
        }),
        learning_objectives: JSON.stringify([
          'Systematic option evaluation means probing beneath surface appeal to reveal true costs and benefits',
          'Creative problem-solving often requires rejecting false dilemmas to synthesize new alternatives',
          'Partnership enhances decision quality through complementary perspectives and collaborative analysis',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Fourth-path methodology will be crucial for navigating impossible choices in later books',
          'Francisco/Zara analytical partnership becoming template for how dyad approaches complexity',
          'Systematic discernment as skill that will be tested repeatedly under increasing pressure',
        ]),
      };
    } else if (sceneData.scene_number === 3) {
      enhancedData = {
        pages: 'Page 327 - 330',
        description: truncate(
          'Francisco presents his decision: selective engagement—the fourth path forged through creative synthesis. The three factions react with frustration while his community recognizes mature leadership that honors values completely.',
          500
        ),
        focus: truncate(
          'Demonstrating values-aligned strategic choice: rejecting imposed options to forge creative path requiring sustained commitment',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch102S3: Francisco chooses fourth path—selective engagement refusing all control frameworks',
          255
        ),
        preliminarySceneFocus: truncate('Decisive clarity through principled choice', 255),
        preliminarySceneDescription: truncate(
          'Francisco\'s fourth-path decision frustrates control-seeking factions while community recognizes mature strategic leadership',
          500
        ),
        sensoryDetail: truncate(
          'Seven chalices dissolving as illusions are rejected, factions\' visible frustration at Francisco\'s refusal to be controlled, community\'s expressions of recognition and support, Temporal Guardians manifesting in acknowledgment of growth',
          500
        ),
        internalConflict: truncate(
          'Francisco balancing desire to please with commitment to authentic path serving collective good over individual approval',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco embodying mature leadership—making hard choices that disappoint some while serving greater values',
          255
        ),
        seriesConnectionResonance: truncate(
          'Independent strategic thinking establishing Francisco as leader who cannot be controlled through seduction or pressure',
          255
        ),
        sceneCardProgression: 306,
        realWorldContext: truncate(
          '11/18/1347 Evening—public commitment to fourth path requiring sustained creativity and discipline',
          255
        ),
        timelineSignificance: truncate(
          'Path selection creates timeline foundation for maintained autonomy enabling authentic service throughout series',
          255
        ),
        saveTheCatBeat: truncate('Reaction - committed decision establishing strategic direction', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'decisive_principled',
          narrative_mode: 'values_alignment_confirmation',
          emotional_arc: 'resolute_clarity_and_determination',
        }),
        learning_objectives: JSON.stringify([
          'Authentic leadership means making choices that honor values even when they disappoint those seeking control',
          'Creative fourth-path solutions require sustained commitment and discipline harder than choosing presented options',
          'Strategic courage means accepting harder paths that maintain integrity rather than easier compromises',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Fourth-path commitment establishing pattern of Francisco rejecting control throughout series',
          'Community support validating independent decision-making as foundation for collective trust',
          'Guardians\' recognition confirming Francisco\'s readiness for escalating strategic complexity ahead',
        ]),
      };
    }

    // Update scene with enhanced fields
    await db
      .update(scenes)
      .set(enhancedData)
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Enhanced fields added`);
    sceneCount++;
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   📊 Total scenes imported: ${sceneCount}`);
  console.log(`   📖 Chapter: EA-102 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
