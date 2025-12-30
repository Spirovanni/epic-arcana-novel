import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-069: Excitable Curiosity (Book 2, Chapter 29)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-069'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-069 not found. Run create-ea-069-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Glitch',
      setup: 'The simulation runs red. The device works, but the backlash will destroy the Redoubt. The room falls into silence. It\'s the \'Dark Night\' again. They did everything right, and it failed. Francisco refuses to accept the binary \'Pass/Fail\'. He enters \'Curiosity Mode\'. He walks around the problem. \'What exactly is the backlash?\' \'Harmonic resonance.\' \'Resonance with what?\'',
      symbolism: 'The Red Light. The unanswerable question. The refusal to accept the \'Expert\' verdict.',
      beat_goal: 'Re-open the problem. Shift from \'Execution\' back to \'Exploration\'.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Restless inquiry',
      scene_tone: 'Frustrated but active',
      timeline_date: '7/29/1320 - Afternoon',
      timeline_variant: 'War Room',
      location: 'War Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Signal',
      setup: 'Francisco leaves the War Room. He follows the sound of the resonance. It leads him to the Signal Room. The operators are exhausted. The noise is a drone. Francisco listens. He taps his foot. \'It has a rhythm.\' He asks to isolate the track. It\'s not noise; it\'s data. He realizes Dagon isn\'t just attacking; he\'s *talking* to his fleet. The jamming is a two-way street.',
      symbolism: 'The Noise becoming Music. The \'Ear\' vs. the \'Eye\'. Finding the signal in the noise.',
      beat_goal: 'The Discovery. The \'Page of Wands\' finds the secret path.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Wonder',
      scene_tone: 'Mysterious',
      timeline_date: '7/29/1320 - Late Afternoon',
      timeline_variant: 'Signal Room',
      location: 'Signal Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Pivot',
      setup: 'Francisco bursts back into the War Room. \'It\'s not a wall; it\'s a door.\' He explains. If they tune their device to the enemy\'s frequency (B-flat), the backlash disappears. In fact, it amplifies their output. They can ride Dagon\'s own energy network. The experts are skeptical. \'That\'s insane.\' \'It\'s original.\' He forces them to run the sim with the new variable. The red light turns green. The room explodes in disbelief.',
      symbolism: 'Turning the Key. The \'Green Light\' returning. The triumph of the \'Crazy Idea\'.',
      beat_goal: 'Validate the discovery. Lock in the victory condition.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Ecstatic',
      scene_tone: 'High energy',
      timeline_date: '7/29/1320 - Evening',
      timeline_variant: 'War Room',
      location: 'War Room',
    },
    {
      scene_number: 4,
      scene_title: 'The Spark',
      setup: 'They adjust the device. The frequency matches. The hum changes from a drone to a harmony. Francisco stands at the observation deck. He sees the enemy fleet not as a threat, but as a fuel source. He smiles. He has moved through Valor, Reflection, Openness, Method, and finally Curiosity. He is ready. \'Light it up.\'',
      symbolism: 'The Harmony. The conductor raising the baton. The spark igniting the engine.',
      beat_goal: 'Resolution. The preparations are complete. The climax begins.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Joyful anticipation',
      scene_tone: 'Electric',
      timeline_date: '7/29/1320 - Night',
      timeline_variant: 'Observation Deck',
      location: 'Observation Deck',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 421 - 424',
      description: 'Simulation running red—device works but backlash destroys Redoubt—room falling into Dark Night silence despite everything done right—Francisco refusing binary Pass/Fail entering Curiosity Mode—walking around problem asking \"What exactly is the backlash?\" \"Harmonic resonance\" \"Resonance with what?\" refusing Expert verdict.',
      focus: 'Re-opening problem shifting from Execution back to Exploration.',
      chapterSceneFocus: 'Ch69S1: Red simulation showing backlash destruction—Dark Night silence after doing everything right—Francisco refusing binary thinking entering Curiosity Mode questioning harmonic resonance refusing Expert verdict as Red Light poses unanswerable question.',
      preliminarySceneFocus: 'Red Light questions Expert verdict',
      preliminarySceneDescription: 'Curiosity refuses binary failure thinking',
      narrativeFunction: 'Introduces crisis twist; establishes Page of Wands childlike inquiry; shifts from methodical execution back to curious exploration.',
      sensoryDetail: 'Red simulation, device working, backlash threat, Redoubt destruction, silence, Dark Night, everything right yet failing, binary refusal, Curiosity Mode, problem walking, backlash question, harmonic resonance, Expert verdict rejection.',
      internalConflict: 'Francisco maintaining curiosity despite expertise saying problem unsolvable—trusting beginner\'s mind over expert certainty.',
      characterGrowthElement: 'Francisco integrating Page of Wands excitable curiosity—reclaiming wonder and play in darkest moment, asking childish questions experts dismiss.',
      seriesConnectionResonance: 'Curiosity as weapon established; finding glitch as Book 5 simulation clue; beginner\'s mind conquering expert paralysis.',
      sceneCardProgression: 190,
      realWorldContext: 'Beginner\'s mind, curious inquiry over expertise, questioning assumptions.',
      timelineSignificance: 'Post-Siege + 14 hours—device simulation failure threatening entire EA-068 methodical effort requiring curiosity breakthrough.',
      saveTheCatBeat: truncate('Dark Night of the Soul - expertise fails, curiosity begins', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'frustrated_active',
        narrative_mode: 'restless_inquiry',
      }),
      learning_objectives: JSON.stringify([
        'Curiosity Mode questioning everything',
        'Beginner mind over expert paralysis',
        'Binary thinking rejection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Signal room discovery coming',
        'Noise becoming music revelation',
        'Dagon frequency breakthrough',
      ]),
    },
    {
      pages: 'Page 424 - 427',
      description: 'Francisco leaving War Room following resonance sound to Signal Room—exhausted operators amid drone noise—Francisco listening, tapping foot recognizing \"It has a rhythm\"—isolating track revealing not noise but data—realizing Dagon talking to fleet, jamming as two-way street as Noise becomes Music finding signal.',
      focus: 'Discovery showing Page of Wands finding secret path.',
      chapterSceneFocus: 'Ch69S2: Francisco following resonance to Signal Room exhausted operators—listening tapping foot recognizing rhythm asking track isolation—revealing data not noise as Dagon talks to fleet jamming two-way as Noise becomes Music Ear finding signal secret path.',
      preliminarySceneFocus: 'Noise becomes Music signal found',
      preliminarySceneDescription: 'Ear listening reveals two-way data street',
      narrativeFunction: 'Delivers key discovery clue; demonstrates listening over looking; reveals Dagon\'s communication method as vulnerability.',
      sensoryDetail: 'War Room exit, resonance sound following, Signal Room, exhausted operators, drone noise, Francisco listening, foot tapping, rhythm recognition, track isolation, data revelation, Dagon fleet talking, two-way jamming.',
      internalConflict: 'Francisco trusting intuitive pattern recognition over technical analysis—following curiosity despite exhaustion.',
      characterGrowthElement: 'Francisco embodying Page of Wands wonder—using Ear over Eye, finding music in noise through childlike listening.',
      seriesConnectionResonance: 'Jamming as carrier wave clue; signal in noise as metaphor; understanding enemy as lethal weapon.',
      sceneCardProgression: 191,
      realWorldContext: 'Pattern recognition, signal processing, listening as discovery tool.',
      timelineSignificance: 'Post-Siege + 14.5 hours—critical discovery that jamming is two-way communication enabling breakthrough.',
      saveTheCatBeat: truncate('Dark Night of the Soul - wonder finds hidden signal', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'mysterious_discovery',
        narrative_mode: 'wonder_listening',
      }),
      learning_objectives: JSON.stringify([
        'Signal in noise discovery',
        'Listening over looking',
        'Pattern recognition through wonder',
      ]),
      foreshadowing_elements: JSON.stringify([
        'B-flat frequency significance',
        'Pivot breakthrough coming',
        'Green light validation',
      ]),
    },
    {
      pages: 'Page 427 - 431',
      description: 'Francisco bursting into War Room declaring \"It\'s not a wall; it\'s a door\"—explaining tuning to enemy B-flat frequency eliminates backlash, amplifies output—riding Dagon\'s energy network—experts skeptical \"That\'s insane\" countered \"It\'s original\"—forcing new variable simulation—red light turning green as room explodes in disbelief as Key turns.',
      focus: 'Validating discovery locking in victory condition.',
      chapterSceneFocus: 'Ch69S3: Francisco bursting in declaring wall-to-door—explaining B-flat tuning eliminating backlash amplifying output riding Dagon network—countering skeptical \"insane\" with \"original\"—forcing new simulation turning red to green as Key turns validating Crazy Idea triumphantly.',
      preliminarySceneFocus: 'Key turns Green Light returns',
      preliminarySceneDescription: 'Crazy Idea validation conquers skepticism',
      narrativeFunction: 'Validates curious discovery through simulation; demonstrates original thinking triumph; converts experts from skeptics to believers.',
      sensoryDetail: 'War Room burst, wall-to-door declaration, B-flat tuning explanation, backlash elimination, output amplification, Dagon network riding, expert skepticism, insane-original exchange, simulation forcing, red to green, room exploding, disbelief.',
      internalConflict: 'Francisco championing novel concept against expert resistance—trusting original insight over conventional wisdom.',
      characterGrowthElement: 'Francisco completing Page of Wands integration—championing crazy idea with joyful confidence, validating curiosity-driven discovery.',
      seriesConnectionResonance: 'Originals championing established; hybrid magic-tech ultimate synthesis; enemy weakness through lack of imagination revealed.',
      sceneCardProgression: 192,
      realWorldContext: 'Championing novel ideas, original thinking validation, converting skeptics.',
      timelineSignificance: 'Post-Siege + 15 hours—breakthrough validation transforming methodical plan into winning gambit through curiosity.',
      saveTheCatBeat: truncate('Dark Night of the Soul - original thinking validated', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'high_energy_breakthrough',
        narrative_mode: 'ecstatic_validation',
      }),
      learning_objectives: JSON.stringify([
        'Championing novel concepts',
        'Original thinking over convention',
        'Skepticism to belief conversion',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Final device adjustment',
        'Harmony replacing drone',
        'Climax beginning',
      ]),
    },
    {
      pages: 'Page 431 - 435',
      description: 'Device adjusted with frequency matching—hum changing from drone to harmony—Francisco at observation deck seeing enemy fleet as fuel source not threat—smiling having moved through Valor, Reflection, Openness, Method, finally Curiosity—ready ordering \"Light it up\" as Harmony conductor raises baton sparking engine for climax preparation.',
      focus: 'Resolution showing preparations complete and climax beginning.',
      chapterSceneFocus: 'Ch69S4: Frequency-matched device humming harmony not drone—Francisco at deck seeing fleet as fuel not threat—smiling through Valor Reflection Openness Method Curiosity journey ready ordering \"Light it up\" as Harmony conductor sparks engine launching climax preparations complete.',
      preliminarySceneFocus: 'Harmony conductor sparks engine',
      preliminarySceneDescription: 'Curiosity journey completes climax launch',
      narrativeFunction: 'Resolves Dark Night preparation arc; integrates five-chapter journey (Valor-Curiosity); launches climax with joyful anticipation.',
      sensoryDetail: 'Device adjustment, frequency matching, drone to harmony shift, observation deck, enemy fleet as fuel, smile, Valor-Curiosity journey, ready state, Light it up order, conductor baton, engine spark, breath holding.',
      internalConflict: 'Francisco embodying complete transformation—joyful anticipation replacing grim determination through wisdom integration.',
      characterGrowthElement: 'Francisco completing five-chapter arc—integrating Valor (EA-065), Reflection (EA-066), Openness (EA-067), Method (EA-068), Curiosity (EA-069) into unified readiness.',
      seriesConnectionResonance: 'Innovator\'s DNA associational thinking victory; preparations complete for climax; tone shift from Grim Survival to Adventure.',
      sceneCardProgression: 193,
      realWorldContext: 'Associational thinking, journey integration, joyful preparation.',
      timelineSignificance: 'Post-Siege + 16 hours—complete Dark Night arc with Francisco ready for climax, 5-chapter preparation journey complete.',
      saveTheCatBeat: truncate('Dark Night of the Soul - curiosity completes preparation', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'electric_launch',
        narrative_mode: 'joyful_anticipation',
      }),
      learning_objectives: JSON.stringify([
        'Associational thinking synthesis',
        'Multi-chapter journey integration',
        'Joyful anticipation over grim determination',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Climax beginning next chapter',
        'Device deployment imminent',
        'Adventure tone returning',
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
        chapterUniqueIdentifier: 'EA-069',
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

  console.log(`\n✅ EA-069 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
