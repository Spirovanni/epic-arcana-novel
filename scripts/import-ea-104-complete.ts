import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-104 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-104: Empire...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-104'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-104 not found. Run create-ea-104-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-104-chapter-data.json');
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
          eq(scenes.chapterUniqueIdentifier, 'EA-104'),
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
      chapterUniqueIdentifier: 'EA-104',
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
        pages: 'Page 346 - 353',
        description: truncate(
          'Coordinated enemy assault systematically destroys Resource Web, scatters Francisco\'s community, and captures timeline refugees. Francisco stands in ruins of Hall of Deliberation, abandoned by those he served, facing the King of Disks\' trial of building empire from devastation.',
          500
        ),
        focus: truncate(
          'Establishing all-is-lost devastation: systematic destruction testing whether Francisco builds empire through dependency or sustainable inspiration',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch104S1: Enemies dismantle Francisco\'s systems—Resource Web collapses, allies scatter, refugees captured',
          255
        ),
        preliminarySceneFocus: truncate('Devastation revealing leadership\'s true test', 255),
        preliminarySceneDescription: truncate(
          'Coordinated assault destroys what Francisco built, scatters community, captures those he swore to protect—King of Disks appears on rubble showing sovereignty tested in ruins',
          500
        ),
        sensoryDetail: truncate(
          'Collapsed Resource Web nodes flickering and dying, Hall of Deliberation walls cracked and unstable, scattered belongings of fled allies, King of Disks sitting calmly on rubble throne, eerie silence where vibrant community once gathered, Zara\'s steady presence feeling like weight rather than comfort',
          500
        ),
        internalConflict: truncate(
          'Francisco torn between bitter retreat to self-protection and grim determination to rebuild despite abandonment',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco confronting that building dependent followers creates vulnerability—true empire requires autonomous commitment',
          255
        ),
        seriesConnectionResonance: truncate(
          'Devastation establishing pattern that empire-building requires resilient systems surviving individual leader\'s failure',
          255
        ),
        sceneCardProgression: 310,
        realWorldContext: truncate(
          '11/24/1347 Dawn—coordinated assault timing exploits Francisco\'s visionary expansion moment of vulnerability',
          255
        ),
        timelineSignificance: truncate(
          'Systematic destruction reveals that success creates visibility attracting sophisticated opposition—empire requires resilience design',
          255
        ),
        saveTheCatBeat: truncate('All is Lost - catastrophic defeat testing leadership foundation', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'extreme',
          pacing: 'bleak_catastrophic',
          narrative_mode: 'devastation_trial',
          emotional_arc: 'devastation_to_grim_determination',
        }),
        learning_objectives: JSON.stringify([
          'Success creates vulnerability as enemies study systems and strike at foundations',
          'Dependent followers abandon leaders in crisis—empire requires autonomous commitment not dependency',
          'True sovereignty means responsibility for reconstruction through devastation not just celebration of achievement',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Distributed systems design preventing single-point failure crucial for later timeline conflicts',
          'Servant leadership model establishing foundation for inspiring autonomous commitment',
          'Resilience through catastrophe preparing Francisco for cosmic-scale challenges ahead',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 354 - 360',
        description: truncate(
          'Francisco begins rebuilding with his own hands. People emerge from hiding, joining not through commands but through demonstrated commitment. He builds distributed network and rescues refugees through collective action, discovering empire means sustainable systems inspiring autonomous purpose.',
          500
        ),
        focus: truncate(
          'Demonstrating empire-building through sustainable influence: inspiring autonomous commitment surviving catastrophe and leader absence',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch104S2: Francisco builds distributed network through servant leadership—empire of empowered autonomous commitment',
          255
        ),
        preliminarySceneFocus: truncate('Building empire through service and inspiration', 255),
        preliminarySceneDescription: truncate(
          'Francisco rebuilds with hands not words, inspiring others to join through demonstrated purpose—creates distributed empire of autonomous commitment united by shared values',
          500
        ),
        sensoryDetail: truncate(
          'Francisco\'s hands moving stones and rebuilding foundations, people emerging one by one from hiding to watch then join, coordinated rescue effort showing collective power, distributed nodes materializing across landscape, refugees\' faces showing gratitude for coordinated liberation, King of Disks\' approving presence as empire takes sustainable form',
          500
        ),
        internalConflict: truncate(
          'Zara awed by transformation from individual hero to empire-builder creating systems that survive without constant direction',
          255
        ),
        characterGrowthElement: truncate(
          'Zara witnessing that true empire means building people\'s capacity for autonomous leadership rather than dependent followership',
          255
        ),
        seriesConnectionResonance: truncate(
          'Empire-building methodology establishing template for collective power structures required in cosmic transformation Books 7-9',
          255
        ),
        sceneCardProgression: 311,
        realWorldContext: truncate(
          '11/24-25/1347 Reconstruction Days—sustained commitment demonstrating empire built through persistent service not heroic moments',
          255
        ),
        timelineSignificance: truncate(
          'Distributed empire creation establishes resilient timeline protection surviving individual failures and coordinated attacks',
          255
        ),
        saveTheCatBeat: truncate('All is Lost resolution - empire rising from ashes through inspiration', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'rising_empowering',
          narrative_mode: 'empire_building_demonstration',
          emotional_arc: 'awe_at_collective_transformation',
        }),
        learning_objectives: JSON.stringify([
          'Servant leadership inspires through demonstrated commitment rather than commanding or inspiring speeches',
          'True empire means sustainable systems and autonomous commitment surviving leader\'s absence or failure',
          'Distributed networks survive centralized attacks—resilience requires decentralized strength and coordinated autonomy',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Servant leadership model becoming Francisco\'s signature approach throughout remaining books',
          'Distributed network architecture establishing pattern for timeline protection systems',
          'Collective rescue power showing empire as coordinated autonomous action not individual heroism',
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
  console.log(`   📖 Chapter: EA-104 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
