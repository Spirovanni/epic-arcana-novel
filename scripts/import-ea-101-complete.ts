import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-101 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-101: Mutual Respect...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-101'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-101 not found. Run create-ea-101-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-101-chapter-data.json');
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
          eq(scenes.chapterUniqueIdentifier, 'EA-101'),
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
      chapterUniqueIdentifier: 'EA-101',
      sceneNumber: sceneData.scene_number,
      title: truncate(sceneData.scene_title, 255),
      setup: sceneData.setup,
      symbolism: sceneData.symbolism,
      beatGoal: sceneData.beat_goal,
      pov: sceneData.pov,
      tense: sceneData.tense,
      coreEmotion: sceneData.core_emotion,
      sceneTone: sceneData.scene_tone,
      timelineDate: sceneData.timeline_date || null,
      timelineVariant: sceneData.timeline_variant || null,
    };

    const [insertedScene] = await db.insert(scenes).values(baseSceneData).returning();
    console.log(`   ✅ Base scene inserted (ID: ${insertedScene.id})`);

    // Step 2: Update with enhanced fields
    let enhancedData: any = {};

    // Determine page range and enhanced content based on scene number
    if (sceneData.scene_number === 1) {
      enhancedData = {
        pages: 'Page 301 - 305',
        description: truncate(
          'Francisco emerges from Obsidian Chamber expecting solitude but finds his community assembled—waiting. They bore witness to his ordeal and gather to honor his choice through their presence, not their demands.',
          500
        ),
        focus: truncate(
          'Establishing that Francisco\'s private ordeal has strengthened rather than isolated him from community through mutual witness',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch101S1: Community assembled to witness and honor Francisco\'s ordeal without intrusion or demand',
          255
        ),
        preliminarySceneFocus: truncate('Community witness as honoring presence', 255),
        preliminarySceneDescription: truncate(
          'Francisco finds his community waiting outside the Obsidian Chamber, having felt the cosmic ripple of his temptation and chosen to bear witness through respectful presence',
          500
        ),
        sensoryDetail: truncate(
          'Assembled faces showing care without intrusion, Zara\'s tears of relief and solidarity, Two of Cups manifesting and multiplying into web of connection linking all present, warmth of recognition without expectation of explanation',
          500
        ),
        internalConflict: truncate(
          'Francisco overwhelmed by unexpected belonging warring with vulnerability of being so deeply seen',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco learning to receive community support and recognition without shame or deflection',
          255
        ),
        seriesConnectionResonance: truncate(
          'Community witness pattern establishing how collective consciousness operates throughout the series',
          255
        ),
        sceneCardProgression: 301,
        realWorldContext: truncate(
          '11/15/1347 Post-Ordeal Dusk—transition from individual trial to collective recognition and support',
          255
        ),
        timelineSignificance: truncate(
          'Community convergence creates timeline reinforcement of Francisco\'s choice through collective witnessing',
          255
        ),
        saveTheCatBeat: truncate('Reversal - unexpected support strengthening rather than isolating', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'medium-high',
          pacing: 'tender_celebratory',
          narrative_mode: 'collective_honoring',
          emotional_arc: 'overwhelmed_gratitude_and_belonging',
        }),
        learning_objectives: JSON.stringify([
          'Authentic community honors trials without demanding explanations or performances',
          'Individual ordeals impact collective consciousness when spiritually attuned',
          'Active respect means being present and available without intrusion',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Two of Cups multiplying into network foreshadows collective partnership structures',
          'Community witness establishing pattern for how allies support each other throughout series',
          'Spiritual attunement showing how advanced practitioners sense cosmic events',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 306 - 310',
        description: truncate(
          'The Circles of Trust ritual unfolds: veterans of cosmic ordeals share not their temptations but their anchors—the relationships and principles that held them fast. Francisco joins this empathic dialogue, recognizing common ground across unique trials.',
          500
        ),
        focus: truncate(
          'Demonstrating mutual respect through active listening and empathic dialogue that builds unbreakable alliances',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch101S2: Circles of Trust ritual—structured sharing that honors differing ordeals while revealing universal patterns',
          255
        ),
        preliminarySceneFocus: truncate('Empathic dialogue forging deeper trust', 255),
        preliminarySceneDescription: truncate(
          'Veterans of supreme ordeals share their resistance anchors in structured ritual, creating sacred space for vulnerability and mutual recognition of moral courage',
          500
        ),
        sensoryDetail: truncate(
          'Hall of Solidarity\'s sacred geometry supporting vulnerable sharing, voices carrying weight of lived experience, silence between testimonies holding reverent witnessing, Francisco\'s simple words about love and collective service resonating with profound authenticity',
          500
        ),
        internalConflict: truncate(
          'Zara (POV) moved by witnessing universal pattern of moral courage while honoring each person\'s unique ordeal',
          255
        ),
        characterGrowthElement: truncate(
          'Zara deepening understanding of how structured vulnerability creates trust stronger than spontaneous connection',
          255
        ),
        seriesConnectionResonance: truncate(
          'Circles of Trust ritual establishing ongoing practice for processing cosmic trials throughout series',
          255
        ),
        sceneCardProgression: 302,
        realWorldContext: truncate(
          '11/15/1347 Evening of Solidarity—sacred time for processing individual ordeals through collective witnessing',
          255
        ),
        timelineSignificance: truncate(
          'Shared testimonies create timeline threads linking veterans of ordeals across time and space',
          255
        ),
        saveTheCatBeat: truncate('Reversal - structured sharing deepening bonds beyond crisis moment', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'profound',
          pacing: 'sacred_intimate',
          narrative_mode: 'collective_witnessing',
          emotional_arc: 'reverent_connection_deepening',
        }),
        learning_objectives: JSON.stringify([
          'Structured vulnerability creates deeper trust than unstructured emotional sharing',
          'Honoring differing experiences while recognizing common patterns builds alliance',
          'Moral courage is universal even when specific trials are unique',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Circles ritual will be used for processing future cosmic trials throughout series',
          'Veterans\' presence establishing mentorship network across temporal boundaries',
          'Sacred space creation showing importance of intentional containers for vulnerability',
        ]),
      };
    } else if (sceneData.scene_number === 3) {
      enhancedData = {
        pages: 'Page 311 - 315',
        description: truncate(
          'Francisco and Zara recognized as true dyad by Temporal Guardians—two voices speaking complementary truth. Their partnership deepened through trial becomes visible as shared light that strengthens rather than diminishes individual brilliance.',
          500
        ),
        focus: truncate(
          'Establishing reward of deepened trust and partnership enabling future challenges, proving mutual respect as foundation for resilience',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch101S3: Francisco/Zara recognized as true dyad—conscious partnership forged through proven reliability',
          255
        ),
        preliminarySceneFocus: truncate('Partnership elevated through trial', 255),
        preliminarySceneDescription: truncate(
          'Two of Cups blazing permanently between Francisco and Zara as Guardians recognize their evolution from talented collaborators to true dyad capable of speaking complementary truth',
          500
        ),
        sensoryDetail: truncate(
          'Two of Cups energy settling into Francisco and Zara\'s bond as visible shared light, individual brilliance strengthened rather than merged, community\'s presence confirming partnership enables broader connection, Guardians manifesting with recognition of readiness for greater challenges',
          500
        ),
        internalConflict: truncate(
          'Francisco feeling profound trust in partnership while recognizing greater challenges ahead that will test this bond',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco and Zara embodying healthy interdependence—strengthened by partnership without loss of individual sovereignty',
          255
        ),
        seriesConnectionResonance: truncate(
          'Dyad recognition establishing partnership structure that will be crucial for cosmic challenges in remaining books',
          255
        ),
        sceneCardProgression: 303,
        realWorldContext: truncate(
          '11/15/1347 Night of Recognition—cosmic acknowledgment of partnership forged through mutual respect and proven reliability',
          255
        ),
        timelineSignificance: truncate(
          'Dyad formation creates new timeline possibility pattern—partnership enabling achievements impossible individually',
          255
        ),
        saveTheCatBeat: truncate('Reversal - partnership formalized as foundation for future trials', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'transformative',
          pacing: 'triumphant_relational',
          narrative_mode: 'partnership_confirmation',
          emotional_arc: 'profound_trust_and_empowerment',
        }),
        learning_objectives: JSON.stringify([
          'True partnership strengthens individual capacity rather than requiring fusion or compromise',
          'Mutual respect tested through trial becomes foundation for cosmic-scale capability',
          'Healthy interdependence enables achievements impossible through individual excellence alone',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Francisco/Zara dyad will be tested and strengthened throughout remaining books',
          'Two of Cups energy establishing template for other partnership formations in series',
          'Guardian recognition signaling greater cosmic responsibilities ahead requiring partnership strength',
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
  console.log(`   📖 Chapter: EA-101 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
