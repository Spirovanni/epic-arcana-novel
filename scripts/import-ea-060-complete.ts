import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-060: Backbone (Book 2, Chapter 20)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-060'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-060 not found. Run create-ea-060-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Eye of the Storm',
      setup: 'The alarms don\'t ring. They just stop existing. The sky turns the color of a bruise. Dagon steps out of the air in the center of the Plaza. He looks like a man, but the geometry around him is wrong. Francisco confronts him. Dagon speaks calmly: \'Your construction is inefficient. I have come to delete it.\' He offers Francisco a choice: Step aside and be spared, or hold the line and be erased. The temptation is real—Francisco knows he is outmatched.',
      symbolism: 'The Devil (Temptation) vs. The Nine of Wands (Refusal). Dagon as the \'Architect of Entropy\'.',
      beat_goal: 'The Arrival. Establish the impossible odds.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Terrified awe',
      scene_tone: 'Quiet dread',
      timeline_date: '7/6/1320 - Morning',
      timeline_variant: 'Sanctuary Plaza (Distorted)',
      location: 'The Epicenter',
    },
    {
      scene_number: 2,
      scene_title: 'The Stress Test',
      setup: 'The duel begins. It is not fireballs; it is physics. Dagon increases the gravitational constant of the pocket dimension. Buildings start to buckle. Bones creak. Francisco counters by reinforcing the \'Concept\' of the Sanctuary (using King of Cups creativity hardened into Nine of Rings solidity). He pours his own life force into the walls. \'You say it is weak; I say it is Home.\' It is a battle of definitions. Dagon defines them as \'Error\'. Francisco defines them as \'Necessary\'.',
      symbolism: 'The Weight of the World. Atlas holding the sky. Fortitude as a structural force.',
      beat_goal: 'The Struggle. Show the cost of resistance. Physical torment.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Physical agony',
      scene_tone: 'Visceral and heavy',
      timeline_date: '7/6/1320 - The Long Minute',
      timeline_variant: 'Sanctuary (Cracking)',
      location: 'The Plaza',
    },
    {
      scene_number: 3,
      scene_title: 'The Breaking Point',
      setup: 'Francisco is failing. The pain is too much. He sees the cracks in the library, the fountain, the faces of his frozen friends. He wants to let go. Dagon whispers: \'It is simple entropy, Francisco. Let it fall.\' Then, Novella (who has some resistance due to her origin) moves. She doesn\'t attack Dagon; she touches Francisco\'s hand. That single connection breaks Dagon\'s logic. \'Why reinforce a failing structure?\' Francisco smiles through blood teeth. \'Because I love it.\' He anchors the reality not in logic, but in love.',
      symbolism: 'Love as the \'Fifth Element\' or the \'glitch\' in Dagon\'s system. The \'Touch\' grounding the hero.',
      beat_goal: 'The Turn. Finding the strength that Dagon cannot calculate.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Defiant love',
      scene_tone: 'Transcendent',
      timeline_date: '7/6/1320 - The Breaking Point',
      timeline_variant: 'Sanctuary (Stable)',
      location: 'The Anchor Point',
    },
    {
      scene_number: 4,
      scene_title: 'Still Standing',
      setup: 'Dagon stops. He calculates. To destroy them now would require energy expenditure that exceeds his \'Efficiency\' parameters. He assesses Francisco: \'You are... anomalously durable.\' He fades away, leaving a warning that this was only a test. Time crashes back into motion. The birds fly. The buildings settle. Francisco falls to his knees. He didn\'t win. He didn\'t hurt Dagon. But the Sanctuary is still there. The \'Nine of Rings\' is the card of the survivor.',
      symbolism: 'The Survivor standing amidst the wreckage. Victory redefined as \'Not Losing\'.',
      beat_goal: 'Resolution. Survival. Counting the cost.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhausted relief',
      scene_tone: 'Quiet aftermath',
      timeline_date: '7/6/1320 - Evening',
      timeline_variant: 'Sanctuary (Scarred)',
      location: 'The Plaza Ruins',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 286 - 290',
      description: 'Alarms stop existing as bruise-colored sky appears and Dagon materializes in Plaza center with wrong geometry—offering Francisco choice to step aside or be erased while his construction is deleted for inefficiency—temptation real as Francisco knows he\'s outmatched facing impossible odds.',
      focus: 'Establishing Dagon\'s arrival and impossible odds.',
      chapterSceneFocus: 'Ch60S1: Dagon materializes in Plaza with reality-warping presence offering Francisco choice between stepping aside or erasure—declaring Sanctuary inefficient construction to be deleted while Francisco faces impossible odds knowing he\'s vastly outmatched.',
      preliminarySceneFocus: 'Dagon\'s personal assault begins',
      preliminarySceneDescription: 'Reality distorts as cosmic threat arrives',
      narrativeFunction: 'Establishes Midpoint climax; demonstrates Dagon\'s cosmic power; presents impossible choice.',
      sensoryDetail: 'Non-existent alarms, bruise-colored sky, materializing from air, wrong geometry, calm deletion declaration, choice offered, temptation real, outmatched knowledge.',
      internalConflict: 'Francisco knowing he\'s outmatched while facing choice between survival and duty.',
      characterGrowthElement: 'Francisco confronting vastly superior power while choosing to stand despite knowing odds.',
      seriesConnectionResonance: 'Establishes Dagon\'s cosmic scale; sets up Book 7 origin reveal; defines power differential.',
      sceneCardProgression: 154,
      realWorldContext: 'Facing impossible odds, temptation to flee, choosing duty over survival.',
      timelineSignificance: 'Midpoint shift from building to surviving; Dagon\'s first personal assault on Sanctuary.',
      saveTheCatBeat: truncate('Midpoint - Dagon breaches Sanctuary personally', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'quiet_dread',
        narrative_mode: 'cosmic_arrival',
      }),
      learning_objectives: JSON.stringify([
        'Villain power scale established',
        'Temptation versus duty',
        'Impossible odds confrontation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Physics-based duel coming',
        'Fortitude as survival strategy',
        'Novella\'s grounding role',
      ]),
    },
    {
      pages: 'Page 290 - 293',
      description: 'Physics-based duel begins as Dagon increases pocket dimension\'s gravitational constant—buildings buckling, bones creaking—Francisco countering by reinforcing Sanctuary Concept with life force poured into walls, defining them as Necessary versus Dagon\'s Error in battle of definitions over Home.',
      focus: 'Showing cost of resistance through physical torment.',
      chapterSceneFocus: 'Ch60S2: Dagon manipulates physics increasing gravity as buildings buckle and bones creak—Francisco pouring life force into walls to reinforce Sanctuary Concept hardened from creativity into solidity, battling definitions of Error versus Necessary over Home.',
      preliminarySceneFocus: 'Physics duel tests endurance limits',
      preliminarySceneDescription: 'Gravitational assault versus conceptual defense',
      narrativeFunction: 'Demonstrates duel mechanics; shows Francisco\'s strategy shift from power to endurance; establishes physical cost.',
      sensoryDetail: 'Not fireballs but physics, increasing gravitational constant, buckling buildings, creaking bones, life force pouring, reinforced Concept, battle of definitions.',
      internalConflict: 'Francisco enduring immense physical pain while maintaining conceptual resistance.',
      characterGrowthElement: 'Francisco discovering fortitude through redefining victory as endurance rather than defeating opponent.',
      seriesConnectionResonance: 'Establishes conceptual anchoring as Francisco\'s ultimate defense; life force sacrifice theme.',
      sceneCardProgression: 155,
      realWorldContext: 'Enduring impossible pressure, redefining home as worth, sacrifice for protection.',
      timelineSignificance: 'Testing Sanctuary\'s pocket reality structural limits under cosmic assault.',
      saveTheCatBeat: truncate('Midpoint - physics duel tests Sanctuary limits', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'visceral_struggle',
        narrative_mode: 'physical_torment',
      }),
      learning_objectives: JSON.stringify([
        'Physics as weapon system',
        'Conceptual anchoring defense',
        'Endurance versus power',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco approaching breaking point',
        'Love as logic-breaking force',
        'Novella\'s intervention coming',
      ]),
    },
    {
      pages: 'Page 293 - 297',
      description: 'Francisco failing under too-much pain—seeing cracks everywhere, wanting to let go as Dagon whispers entropy—then Novella moves touching his hand breaking Dagon\'s logic, Francisco smiling through blood teeth anchoring reality in love not logic as glitch in Dagon\'s system.',
      focus: 'Finding strength Dagon cannot calculate through love.',
      chapterSceneFocus: 'Ch60S3: Francisco failing under immense pain ready to let go as Dagon whispers entropy—Novella touching his hand breaks Dagon\'s logic allowing Francisco to anchor reality in love not calculation, smiling through blood as glitch defeats system.',
      preliminarySceneFocus: 'Love breaks calculated entropy',
      preliminarySceneDescription: 'Touch anchors hero past logic',
      narrativeFunction: 'Provides turning point; demonstrates love as incalculable force; shows Novella\'s crucial role.',
      sensoryDetail: 'Failing strength, too-much pain, cracks everywhere, frozen friends\' faces, entropy whisper, Novella moving, hand touch, logic breaking, blood teeth smile, love anchoring.',
      internalConflict: 'Francisco at breaking point choosing love over logical surrender.',
      characterGrowthElement: 'Francisco transcending logic to anchor in emotion—discovering love as ultimate grounding force.',
      seriesConnectionResonance: 'Establishes love as Fifth Element; Novella as grounding anchor; Dagon\'s limitation revealed.',
      sceneCardProgression: 156,
      realWorldContext: 'Love transcending logic, human connection defeating calculation, choosing heart over reason.',
      timelineSignificance: 'Love proves incalculable to Dagon\'s optimization, stabilizing Sanctuary through emotion.',
      saveTheCatBeat: truncate('Midpoint - love as incalculable strength', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'transcendent_turn',
        narrative_mode: 'emotional_breakthrough',
      }),
      learning_objectives: JSON.stringify([
        'Love as system glitch',
        'Emotion versus calculation',
        'Connection as grounding force',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon\'s efficiency parameters',
        'Survival as victory redefined',
        'Leadership scars acquired',
      ]),
    },
    {
      pages: 'Page 297 - 300',
      description: 'Dagon calculates destruction exceeds efficiency parameters—assessing Francisco as anomalously durable before fading with test warning—time crashing back as birds fly and buildings settle, Francisco falling to knees having not won or hurt Dagon but Sanctuary still standing as Nine of Rings survivor.',
      focus: 'Resolution through survival and counting cost.',
      chapterSceneFocus: 'Ch60S4: Dagon calculating that destruction exceeds efficiency withdraws calling Francisco anomalously durable—time resuming as Francisco falls to knees having survived not won, Sanctuary damaged but standing as Nine of Rings survivor counting cost.',
      preliminarySceneFocus: 'Survival redefines victory',
      preliminarySceneDescription: 'Standing amid wreckage equals triumph',
      narrativeFunction: 'Resolves Midpoint; redefines victory as survival; establishes lasting consequences; shifts narrative to active defense.',
      sensoryDetail: 'Dagon stopping, calculating, efficiency parameters, anomalous durability assessment, fading warning, time crashing back, flying birds, settling buildings, falling to knees, still standing.',
      internalConflict: 'Francisco accepting survival as victory despite not defeating enemy.',
      characterGrowthElement: 'Francisco completing Midpoint transformation—learning endurance defines leadership more than triumph.',
      seriesConnectionResonance: 'Acquires leadership scar; establishes Dagon\'s efficiency limitation; proves Sanctuary durability.',
      sceneCardProgression: 157,
      realWorldContext: 'Survival as victory, endurance over conquest, accepting cost of standing.',
      timelineSignificance: 'Sanctuary proves survivable under direct assault; narrative shifts from building to defending.',
      saveTheCatBeat: truncate('Midpoint - survival proves fortitude', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'exhausted_resolution',
        narrative_mode: 'quiet_aftermath',
      }),
      learning_objectives: JSON.stringify([
        'Victory redefined as not losing',
        'Fortitude as Nine of Rings',
        'Endurance proving leadership',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon returning with new tactics',
        'Leadership scars permanent',
        'Active defense phase beginning',
      ]),
    },
  ];

  // Process each scene
  for (let i = 0; i < sceneData.length; i++) {
    const scene = sceneData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${scene.scene_number}: ${scene.scene_title}`);

    // Insert base scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: chapter.id,
        chapterUniqueIdentifier: 'EA-060',
        sceneNumber: scene.scene_number,
        title: scene.scene_title,
        setup: scene.setup,
        symbolism: scene.symbolism,
        beatGoal: scene.beat_goal,
        pov: scene.pov,
        tense: scene.tense,
        core_emotion: scene.core_emotion,
        scene_tone: scene.scene_tone,
        timeline_date: scene.timeline_date,
        timeline_variant: scene.timeline_variant,
        location: scene.location,
      })
      .returning();

    console.log(`   ✅ Inserted scene with ID: ${insertedScene.id}`);

    // Update with enhanced narrative fields
    await db
      .update(scenes)
      .set({
        pages: enhancement.pages,
        description: enhancement.description,
        focus: truncate(enhancement.focus, 255),
        chapterSceneFocus: truncate(enhancement.chapterSceneFocus, 255),
        preliminarySceneFocus: truncate(enhancement.preliminarySceneFocus, 255),
        preliminarySceneDescription: enhancement.preliminarySceneDescription,
        narrativeFunction: enhancement.narrativeFunction,
        sensoryDetail: enhancement.sensoryDetail,
        internalConflict: enhancement.internalConflict,
        characterGrowthElement: enhancement.characterGrowthElement,
        seriesConnectionResonance: enhancement.seriesConnectionResonance,
        sceneCardProgression: enhancement.sceneCardProgression,
        realWorldContext: enhancement.realWorldContext,
        timelineSignificance: enhancement.timelineSignificance,
        saveTheCatBeat: enhancement.saveTheCatBeat,
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all scenes have complete data
  console.log('\n\n🔍 Verifying field completion...\n');

  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = Object.keys(scene);
    const populatedFields = fields.filter(key => {
      const value = scene[key as keyof typeof scene];
      return value !== null && value !== undefined;
    });

    const requiredFields = 31;
    const presentCount = populatedFields.length;
    const missingCount = requiredFields - presentCount;

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentCount}/${requiredFields}`);
    if (missingCount > 0) {
      console.log(`   ❌ Missing: ${missingCount}/${requiredFields}`);
    }
  }

  console.log(`\n✅ EA-060 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
