import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-103 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-103: Imagination...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-103'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-103 not found. Run create-ea-103-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-103-chapter-data.json');
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
          eq(scenes.chapterUniqueIdentifier, 'EA-103'),
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
      chapterUniqueIdentifier: 'EA-103',
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
        pages: 'Page 331 - 336',
        description: truncate(
          'Francisco enters the Chamber of Imaginal Realms where the Knight of Cups offers access to humanity\'s collective imagination—the realm where all possible futures exist in potential form before manifesting into timeline reality.',
          500
        ),
        focus: truncate(
          'Establishing creative ordeal: Francisco must learn to access imaginative vision without losing grounding in reality',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch103S1: Knight of Cups offers chalice of pure creative potential—access to imaginal realm where futures exist',
          255
        ),
        preliminarySceneFocus: truncate('The invitation to visionary consciousness', 255),
        preliminarySceneDescription: truncate(
          'Knight of Cups appears as living presence offering chalice filled with liquid light representing pure creative potential and access to collective imagination',
          500
        ),
        sensoryDetail: truncate(
          'Knight on horseback materializing from light, chalice filled with luminous liquid that shifts colors like aurora, Chamber of Imaginal Realms shimmering with potential forms not yet manifested, Zara\'s cautionary hand on Francisco\'s shoulder',
          500
        ),
        internalConflict: truncate(
          'Francisco torn between creative hunger to explore visionary realm and caution about losing grounding in messy reality',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco developing capacity to access imaginative vision as strategic tool rather than escapist fantasy',
          255
        ),
        seriesConnectionResonance: truncate(
          'Imaginal realm access establishing creative capacity crucial for reshaping timeline possibilities in later books',
          255
        ),
        sceneCardProgression: 307,
        realWorldContext: truncate(
          '11/21/1347 Dawn—three days post-fourth-path choice when creative expansion becomes accessible',
          255
        ),
        timelineSignificance: truncate(
          'Imaginal threshold opening shows that timelines are shaped by collective imagination before manifesting as reality',
          255
        ),
        saveTheCatBeat: truncate('Supreme Ordeal - creative breakthrough invitation', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'medium-high',
          pacing: 'mystical_inviting',
          narrative_mode: 'visionary_threshold',
          emotional_arc: 'anticipation_with_creative_hunger',
        }),
        learning_objectives: JSON.stringify([
          'Creative vision requires temporary surrender of analytical thinking to access imaginative consciousness',
          'Imaginal realm is where all possible futures exist in potential before manifesting into timeline reality',
          'Accessing visionary capacity without losing grounding requires disciplined practice and partnership support',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Knight of Cups methodology establishing template for accessing creative vision throughout series',
          'Imaginal realm as space where Francisco will learn to reshape timeline possibilities',
          'Danger of becoming lost in beautiful visions foreshadowing later temptations to escape difficult reality',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 337 - 341',
        description: truncate(
          'Francisco drinks from the Knight\'s chalice and experiences thousands of branching futures—utopian harmony, apocalyptic collapse, comfortable mediocrity. The visions reveal that his choices help determine which imaginal possibilities become reality.',
          500
        ),
        focus: truncate(
          'Demonstrating imaginative vision\'s power and scope: seeing multiple futures reveals stakes and creative responsibility',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch103S2: Francisco sees thousand futures showing humanity\'s potential depends on creative courage to imagine beyond limits',
          255
        ),
        preliminarySceneFocus: truncate('Multiple futures revealing creative possibility versus predetermined fate', 255),
        preliminarySceneDescription: truncate(
          'Vision expands to show futures from utopian timeline harmony to apocalyptic collapse, all dependent on collective imagination and will',
          500
        ),
        sensoryDetail: truncate(
          'Thousands of futures cascading through consciousness like infinite branching rivers, visceral experience of joy and horror across possibilities, Knight\'s steady presence guiding through overwhelming expansion, cosmic transformation visible as humanity\'s evolutionary potential',
          500
        ),
        internalConflict: truncate(
          'Francisco overwhelmed by awe transforming into terrified responsibility—his choices affecting infinite beings across timelines',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco expanding understanding from timeline protection to timeline creation—imagination as reality-shaping force',
          255
        ),
        seriesConnectionResonance: truncate(
          'Vision of cosmic transformation connecting current journey to humanity\'s evolutionary role in Books 7-9',
          255
        ),
        sceneCardProgression: 308,
        realWorldContext: truncate(
          '11/21/1347 Visionary Hour—timeless moment in imaginal realm where all possibilities exist simultaneously',
          255
        ),
        timelineSignificance: truncate(
          'Vision reveals that timeline wars arise from failure to imagine collectively—creative courage prevents apocalyptic futures',
          255
        ),
        saveTheCatBeat: truncate('Supreme Ordeal - cosmic vision revealing ultimate stakes', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'extreme',
          pacing: 'expansive_overwhelming',
          narrative_mode: 'visionary_revelation',
          emotional_arc: 'awe_to_terrified_responsibility',
        }),
        learning_objectives: JSON.stringify([
          'Multiple futures aren\'t predetermined fates but creative potentials waiting for imagination to give form',
          'Individual choices connect to collective evolution—creative courage shapes which possibilities manifest',
          'Cosmic transformation depends on humanity\'s capacity to imagine beyond known limits and constraints',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Utopian timeline harmony establishing goal Francisco works toward in later books',
          'Apocalyptic collapse possibility showing stakes if collective imagination fails',
          'Cosmic transformation vision connecting to series climax in Books 7-9',
        ]),
      };
    } else if (sceneData.scene_number === 3) {
      enhancedData = {
        pages: 'Page 342 - 345',
        description: truncate(
          'Francisco risks becoming lost in beautiful visions until Zara\'s voice anchors him. The Knight teaches that romantic idealism must be grounded in practical commitment. Vision clarifies purpose, but transformation requires daily manifestation work.',
          500
        ),
        focus: truncate(
          'Demonstrating grounded visionary leadership: integrating imaginative expansion with practical commitment to manifestation',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch103S3: Francisco integrates vision with pragmatism—daily practices making visionary capacity sustainable',
          255
        ),
        preliminarySceneFocus: truncate('Grounded imagination through partnership and discipline', 255),
        preliminarySceneDescription: truncate(
          'Zara\'s anchoring prevents Francisco from escaping into beautiful possibilities, teaching that imagination without action is escapism not creation',
          500
        ),
        sensoryDetail: truncate(
          'Utopian future\'s seductive call like siren song, Zara\'s voice cutting through as lifeline to reality, Knight\'s final lesson delivered with compassionate firmness, return to Chamber feeling both diminished and enhanced—reality as one possibility among infinite options',
          500
        ),
        internalConflict: truncate(
          'Zara balancing protective concern with recognition that Francisco needs visionary capacity—supporting without smothering',
          255
        ),
        characterGrowthElement: truncate(
          'Zara demonstrating that partnership means preventing ungrounded idealism while encouraging authentic creative vision',
          255
        ),
        seriesConnectionResonance: truncate(
          'Integration of vision and pragmatism establishing leadership template for navigating cosmic complexity throughout series',
          255
        ),
        sceneCardProgression: 309,
        realWorldContext: truncate(
          '11/21/1347 Return—grounding in Prime Timeline with expanded consciousness and daily practices to maintain vision',
          255
        ),
        timelineSignificance: truncate(
          'Vision integration creates foundation for timeline reshaping—seeing current reality as changeable rather than fixed fate',
          255
        ),
        saveTheCatBeat: truncate('Supreme Ordeal - vision grounded in practical commitment', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'grounding_integrative',
          narrative_mode: 'vision_manifestation_bridge',
          emotional_arc: 'protective_concern_to_collaborative_inspiration',
        }),
        learning_objectives: JSON.stringify([
          'Romantic idealism must be grounded in practical commitment—vision without action is escapism',
          'Daily disciplined practices sustain visionary capacity while maintaining effectiveness in current reality',
          'Partnership prevents ungrounded vision through anchoring while supporting authentic creative expansion',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Daily imaginal practices establishing sustainable visionary methodology for ongoing timeline work',
          'Fourth path gaining creative dimension—selective engagement becomes strategic imagination deployment',
          'Vision-pragmatism integration as maturation preparing Francisco for escalating cosmic leadership',
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
  console.log(`   📖 Chapter: EA-103 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
