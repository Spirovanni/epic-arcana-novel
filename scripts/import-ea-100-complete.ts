import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-100 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-100: Home Advantage...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-100'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-100 not found. Run create-ea-100-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-100-chapter-data.json');
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
          eq(scenes.chapterUniqueIdentifier, 'EA-100'),
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
      chapterUniqueIdentifier: 'EA-100',
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
        pages: 'Page 286 - 291',
        description: truncate(
          'Francisco stands alone in Obsidian Chamber where Dagon manifests offering ultimate knowledge and power. The temptation targets Francisco\'s deepest virtue—his desire to help others—by showing visions of perfect futures he could create.',
          500
        ),
        focus: truncate(
          'Establishing supreme temptation that appeals to Francisco\'s greatest strength turned against him',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch100S1: Dagon offers Francisco everything—knowledge, power, perfection—targeting his desire to help',
          255
        ),
        preliminarySceneFocus: truncate('The seductive beauty of absolute power', 255),
        preliminarySceneDescription: truncate(
          'Dagon manifests in devastating splendor offering Francisco ultimate knowledge and reality mastery in exchange for allegiance',
          500
        ),
        sensoryDetail: truncate(
          'Obsidian walls reflecting infinite timelines, Dagon\'s form shifting between serpent and angel, visions of perfected worlds shimmering in the air, the weight of unlimited possibility pressing on Francisco\'s consciousness',
          500
        ),
        internalConflict: truncate(
          'Francisco\'s deepest desire to help and heal warring with recognition that accepting means surrendering to corruption',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco confronting that even his greatest virtue can become a weapon against him if he\'s not grounded in authentic relationships',
          255
        ),
        seriesConnectionResonance: truncate(
          'Dagon\'s temptation establishes pattern of how ancient powers will attempt to corrupt Francisco throughout the series',
          255
        ),
        sceneCardProgression: 298,
        realWorldContext: truncate(
          '11/15/1347 Midpoint Hour—moment of supreme choice where character is truly tested and proven',
          255
        ),
        timelineSignificance: truncate(
          'The Midpoint Ordeal creates timeline nexus where Francisco\'s choice reverberates across all possible futures',
          255
        ),
        saveTheCatBeat: truncate('Midpoint - false peak of apparent power before true testing', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'extreme',
          pacing: 'seductive_terrifying',
          narrative_mode: 'temptation_establishing',
          emotional_arc: 'desire_warring_with_dread',
        }),
        learning_objectives: JSON.stringify([
          'Greatest virtues can become vulnerabilities when targeted by sophisticated corruption',
          'Temptation that appeals to desire to help is more dangerous than temptation that appeals to greed',
          'Individual salvation offered at cost of collective good is always a trap',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Dagon\'s respect for Francisco despite refusal signals ongoing relationship throughout series',
          'Perfect futures shown represent individualist trap Francisco will help others avoid',
          'Test of reliability establishing pattern for cosmic leadership requirements',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 292 - 296',
        description: truncate(
          'Francisco nearly succumbs to Dagon\'s offer until he remembers specific people and relationships. Drawing on his narrative gift, he reframes the temptation—recognizing those perfect futures would erase real people\'s authentic struggles.',
          500
        ),
        focus: truncate(
          'Francisco using familiar strengths—relationships and narrative reframing—to resist ultimate temptation',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch100S2: Francisco anchors himself in memories of specific people, uses narrative gift to reframe offer',
          255
        ),
        preliminarySceneFocus: truncate('Memory and relationship as resistance tools', 255),
        preliminarySceneDescription: truncate(
          'Francisco\'s hand extends toward acceptance then he remembers: Zara, Master Lumina, students, refugees—specific people grounding him in authentic community over individual power',
          500
        ),
        sensoryDetail: truncate(
          'Threads of light manifesting as Francisco remembers each person, his narrative gift reshaping the chamber\'s reality, corrupted Four of Wands transforming back to authentic celebration symbol, warmth of real connection displacing cold perfection',
          500
        ),
        internalConflict: truncate(
          'Francisco torn between desire for power to help and recognition that real help means walking alongside rather than fixing',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco discovering his core strength isn\'t power to fix everything but courage to accompany others through struggle',
          255
        ),
        seriesConnectionResonance: truncate(
          'Narrative reframing ability establishing foundation for how Francisco will help others resist corruption throughout series',
          255
        ),
        sceneCardProgression: 299,
        realWorldContext: truncate(
          '11/15/1347 Hour of Choice—clarity emerging from confusion through connection to authentic relationships',
          255
        ),
        timelineSignificance: truncate(
          'Francisco\'s choice to value authentic community over individual perfection creates new timeline possibility',
          255
        ),
        saveTheCatBeat: truncate('Midpoint - hero uses familiar tools to navigate supreme crisis', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'intimate_defiant',
          narrative_mode: 'resistance_through_connection',
          emotional_arc: 'clarity_from_confusion',
        }),
        learning_objectives: JSON.stringify([
          'Leveraging core strengths in crisis requires conscious recognition of what those strengths truly are',
          'Real relationships provide stronger grounding than abstract principles during temptation',
          'Narrative reframing transforms seduction into clarity by revealing hidden costs',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Francisco\'s narrative gift will be crucial tool throughout series for helping others see truth',
          'Community as anchor establishing pattern for collective resistance strategies',
          'Authentic Four of Wands energy showing home is relationships not power',
        ]),
      };
    } else if (sceneData.scene_number === 3) {
      enhancedData = {
        pages: 'Page 297 - 300',
        description: truncate(
          'Francisco speaks clear refusal to Dagon who withdraws with respect. The Council of Temporal Guardians appears, confirming this was a test of reliability at limits. Francisco\'s character is proven—he will not compromise core values under any pressure.',
          500
        ),
        focus: truncate(
          'Proving Francisco\'s reliability and establishing readiness for cosmic responsibility through resistance to ultimate temptation',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch100S3: Francisco\'s clear refusal proves reliability at limits, Guardians confirm character proven',
          255
        ),
        preliminarySceneFocus: truncate('Character proved through ultimate test', 255),
        preliminarySceneDescription: truncate(
          'Francisco states his choice with absolute clarity: serving the world as it is alongside those he loves rather than perfecting it alone. His reliability is proven at limits.',
          500
        ),
        sensoryDetail: truncate(
          'Francisco\'s voice carrying absolute conviction, Dagon\'s rage brief and acknowledging, Temporal Guardians materializing in confirmation, Four of Wands blazing with authentic celebration energy, foundation of character proven unshakeable',
          500
        ),
        internalConflict: truncate(
          'Francisco\'s humbled gratitude warring with recognition of greater challenges ahead that this ordeal prepared him for',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco embodying values so completely that they become unshakeable foundation rather than aspirational beliefs',
          255
        ),
        seriesConnectionResonance: truncate(
          'Reliability proven here establishing Francisco as leader capable of cosmic responsibility throughout remaining books',
          255
        ),
        sceneCardProgression: 300,
        realWorldContext: truncate(
          '11/15/1347 Hour of Proof—character confirmation creating cosmic recognition of Francisco\'s readiness',
          255
        ),
        timelineSignificance: truncate(
          'Francisco\'s proved reliability creates timeline stability that will be crucial for future cosmic conflicts',
          255
        ),
        saveTheCatBeat: truncate('Midpoint - hero emerges from test fundamentally proven and ready', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'profound',
          pacing: 'victorious_transformative',
          narrative_mode: 'character_confirmation',
          emotional_arc: 'triumphant_clarity_and_gratitude',
        }),
        learning_objectives: JSON.stringify([
          'True reliability is embodied values tested at absolute limits under maximum pressure',
          'Cosmic responsibility requires leaders who cannot be corrupted by any temptation',
          'Character proven through resistance becomes foundation for greater challenges ahead',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Dagon\'s respect despite refusal signals complex ongoing relationship throughout series',
          'Guardians\' recognition establishing Francisco\'s role in cosmic leadership collective',
          'Four of Wands foundation representing unshakeable commitment to collective good',
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
  console.log(`   📖 Chapter: EA-100 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
