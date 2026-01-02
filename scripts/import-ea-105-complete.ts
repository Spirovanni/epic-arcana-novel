import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports all scenes for EA-105 with complete enhanced fields
 */

async function main() {
  console.log('📖 Importing scenes for Chapter EA-105: Surrender...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-105'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-105 not found. Run create-ea-105-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Read chapter data from JSON
  const chapterDataPath = path.join(__dirname, 'create-ea-105-chapter-data.json');
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
          eq(scenes.chapterUniqueIdentifier, 'EA-105'),
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
      chapterUniqueIdentifier: 'EA-105',
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
        pages: 'Page 361 - 366',
        description: truncate(
          'Multi-dimensional enemy assault neutralizes every strategy Francisco employs. His control attempts are weaponized against him. Temporal Guardians reveal this battle was designed unwinnable through personal action—Francisco\'s control prevents cosmic intervention.',
          500
        ),
        focus: truncate(
          'Establishing surrender necessity: Francisco\'s control preventing higher-order solution requiring ego-death to access cosmic intervention',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch105S1: Unwinnable battle design—Francisco\'s skillful control preventing cosmic forces from intervening',
          255
        ),
        preliminarySceneFocus: truncate('Futility revealing control as obstacle', 255),
        preliminarySceneDescription: truncate(
          'Every strategy anticipated and neutralized, protection weaponized, allies targeted—Five of Swords showing pyrrhic victory while Guardians reveal control itself prevents solution',
          500
        ),
        sensoryDetail: truncate(
          'Multi-dimensional assault cascading across network nodes, Francisco\'s desperate strategies collapsing one after another, Resource Web vulnerability points lighting up like targets, hostage refugees visible across timelines, Five of Swords manifestation showing isolated warrior, Guardians\' solemn pronouncement that his control blocks cosmic help',
          500
        ),
        internalConflict: truncate(
          'Francisco torn between desperate need to control and protect versus terrifying recognition that control itself is the problem',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco confronting that over-responsibility and need to be savior prevents actual salvation from manifesting',
          255
        ),
        seriesConnectionResonance: truncate(
          'Surrender necessity establishing pattern that cosmic-scale problems require ego-death and trust in higher intelligence',
          255
        ),
        sceneCardProgression: 312,
        realWorldContext: truncate(
          '11/27/1347 Hour of Futility—escalating futility creating crisis requiring surrender versus control paradigm shift',
          255
        ),
        timelineSignificance: truncate(
          'Unwinnable design reveals that some timeline challenges require cosmic intervention impossible while ego maintains control',
          255
        ),
        saveTheCatBeat: truncate('All is Lost - control becoming obstacle requiring surrender', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'extreme',
          pacing: 'escalating_futility',
          narrative_mode: 'surrender_necessity_revelation',
          emotional_arc: 'desperate_control_to_terrified_powerlessness',
        }),
        learning_objectives: JSON.stringify([
          'Over-responsibility and need to be savior can prevent actual solutions from manifesting',
          'Some problems are designed to be unsolvable through personal action—requiring cosmic intervention',
          'Control itself becomes obstacle when ego investment prevents surrender to higher intelligence',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Surrender pattern establishing requirement for cosmic-scale challenges in later books',
          'Ego-death as necessary transformation for accessing higher-order solutions',
          'Control versus trust paradigm crucial for humanity\'s cosmic transformation ahead',
        ]),
      };
    } else if (sceneData.scene_number === 2) {
      enhancedData = {
        pages: 'Page 367 - 371',
        description: truncate(
          'Zara confronts Francisco that his ego investment in being the savior prevents salvation. In Chamber of Letting Go, Francisco performs Five of Swords ritual—laying down weapons while enemies advance, surrendering identity and control through agonizing ego-death. Cosmic forces flood in.',
          500
        ),
        focus: truncate(
          'Demonstrating surrender as ego-death: releasing identity investment and control attachment making space for cosmic intervention',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch105S2: Francisco surrenders identity as savior through ritual ego-death—cosmic forces flood space created by release',
          255
        ),
        preliminarySceneFocus: truncate('Ego-death through radical acceptance', 255),
        preliminarySceneDescription: truncate(
          'Chamber of Letting Go ritual—Francisco releases control piece by piece, confronts terror of irrelevance, breathes into acceptance making space for cosmic intervention',
          500
        ),
        sensoryDetail: truncate(
          'Chamber\'s sacred geometry supporting ego-death process, Francisco\'s hands shaking as he lays down weapons symbolically, every breath a conscious choice to release control, terror of becoming irrelevant and unnecessary flooding awareness, moment of true surrender when cosmic light floods through opened space, Zara witnessing transformation with reverent tears',
          500
        ),
        internalConflict: truncate(
          'Francisco agonizing through deepest terror—becoming irrelevant, unnecessary, not the hero—choosing surrender anyway',
          255
        ),
        characterGrowthElement: truncate(
          'Francisco experiencing ego-death—releasing identity investment in being indispensable savior to become clear channel',
          255
        ),
        seriesConnectionResonance: truncate(
          'Ego-death capacity establishing foundation for ultimate sacrifice and cosmic alignment required in Books 7-9',
          255
        ),
        sceneCardProgression: 313,
        realWorldContext: truncate(
          '11/27/1347 Hour of Release—sacred time when ego surrenders and cosmic forces gain access through opened channel',
          255
        ),
        timelineSignificance: truncate(
          'Surrender moment creates timeline pivot—personal will releasing allows cosmic intelligence to reshape possibilities',
          255
        ),
        saveTheCatBeat: truncate('All is Lost resolution - ego-death enabling cosmic intervention', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'extreme',
          pacing: 'intimate_excruciating',
          narrative_mode: 'ego_death_transformation',
          emotional_arc: 'agonizing_vulnerability_to_profound_peace',
        }),
        learning_objectives: JSON.stringify([
          'Ego-death means releasing identity investment in being necessary, indispensable, or the hero',
          'Surrender creates space for cosmic intervention by removing ego-will bottleneck blocking divine flow',
          'Deepest terror—irrelevance and uselessness—must be confronted and accepted to access true purpose',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Chamber of Letting Go as recurring space for ego-death rituals in later books',
          'Surrender capacity becoming Francisco\'s ultimate spiritual power beyond temporal abilities',
          'Clear channel versus bottleneck distinction crucial for cosmic transformation work ahead',
        ]),
      };
    } else if (sceneData.scene_number === 3) {
      enhancedData = {
        pages: 'Page 372 - 375',
        description: truncate(
          'With Francisco\'s control released, cosmic intelligence orchestrates solution beyond his capacity. Unknown allies emerge, resources manifest unexpectedly, refugees self-coordinate salvation. Francisco becomes clear channel rather than bottleneck, discovering paradoxical power through surrender to higher purpose.',
          500
        ),
        focus: truncate(
          'Demonstrating surrender\'s paradoxical power: ego-death enabling cosmic intervention and distributed intelligence beyond individual capacity',
          255
        ),
        chapterSceneFocus: truncate(
          'Ch105S3: Cosmic intelligence moves through Francisco\'s surrender-space creating solutions beyond ego-planning',
          255
        ),
        preliminarySceneFocus: truncate('Miraculous flow through emptied ego', 255),
        preliminarySceneDescription: truncate(
          'Cosmic forces orchestrate elegant solutions—unknown allies emerge, refugees self-save through collective wisdom, network activates in divinely-guided patterns beyond individual design',
          500
        ),
        sensoryDetail: truncate(
          'Cosmic intelligence moving like invisible symphony conductor coordinating thousands of autonomous actions, allies materializing from unexpected sources responding to divine call, refugees\' coordinated self-liberation showing collective genius, network nodes pulsing in sacred geometric patterns, Francisco\'s awed humility witnessing power flowing through surrender-emptied space, Zara seeing distributed divinity versus concentrated ego-power',
          500
        ),
        internalConflict: truncate(
          'Zara experiencing reverent awe at cosmic intelligence in action—witnessing divinity manifest through collective surrender',
          255
        ),
        characterGrowthElement: truncate(
          'Zara understanding true empire means creating space for cosmic intelligence working through collective versus ego controlling followers',
          255
        ),
        seriesConnectionResonance: truncate(
          'Distributed cosmic intelligence model establishing template for humanity\'s transformation in Books 7-9 climax',
          255
        ),
        sceneCardProgression: 314,
        realWorldContext: truncate(
          '11/27-28/1347 Days of Cosmic Flow—sustained miraculous coordination showing surrender\'s transformative power',
          255
        ),
        timelineSignificance: truncate(
          'Surrender resolution demonstrates timeline protection through distributed divine intelligence versus individual heroic control',
          255
        ),
        saveTheCatBeat: truncate('Dedication resolution - cosmic power through ego-surrender', 100),
        sudowrite_metadata: JSON.stringify({
          intensity: 'profound',
          pacing: 'miraculous_transformative',
          narrative_mode: 'cosmic_intelligence_manifestation',
          emotional_arc: 'reverent_awe_at_divine_action',
        }),
        learning_objectives: JSON.stringify([
          'Cosmic intelligence orchestrates solutions more elegant than ego-planning when space is created through surrender',
          'True empire means servants creating channels for divine flow through collective versus leaders controlling followers',
          'Ultimate power flows through those who release personal will to serve as clear channels for higher purpose',
        ]),
        foreshadowing_elements: JSON.stringify([
          'Distributed divinity model becoming template for cosmic transformation in series climax',
          'Collective wisdom accessing divine intelligence beyond individual capacity crucial for Books 7-9',
          'Surrender as ultimate power establishing Francisco\'s spiritual leadership foundation',
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
  console.log(`   📖 Chapter: EA-105 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
