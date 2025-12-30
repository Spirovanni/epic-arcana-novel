import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-066: Reflective Energy (Book 2, Chapter 26)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-066'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-066 not found. Run create-ea-066-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Silence After',
      setup: 'The guns are cold. The wounded are being treated. The adrenaline crash hits Francisco hard. He walks away from the celebration of survival. He feels hollow, not triumphant. He finds a quiet, dark room at the back of the Redoubt—an old cistern with still, black water. He sits by it. He tries to write a report, but he can only write \'Why?\'. The \'Deep Work\' concept of isolation is forced upon him.',
      symbolism: 'The Cistern = The Subconscious (Cups/Water). The darkness represents the \'Unknown\' parts of himself. The inability to write \'official\' words shows the failure of bureaucracy to capture the human experience.',
      beat_goal: 'Transition from Action to Reflection. Isolate the hero.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhaustion',
      scene_tone: 'Still and echoing',
      timeline_date: '7/28/1320 - Early Afternoon',
      timeline_variant: 'The Broken Redoubt (Cistern)',
      location: 'The Cistern Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Mirror',
      setup: 'La Signora enters. She doesn\'t speak at first. She just sits. She brings a \'Cup\' (tea/water). She asks the Socratic question: \'What did you lose today?\' Francisco answers \'My certainty.\' She smiles. \'Good. Kings with certainty are dangerous. Kings with questions are wise.\' She forces him to look at his fear not as a failure, but as a signal. This is the \'Reflective Practitioner\' model—learning from the event.',
      symbolism: 'The Queen of Cups (La Signora) offering the Cup of Wisdom. The \'Mirror\' conversation. Dealing with the Shadow Self.',
      beat_goal: 'Reframe the negative (Fear/Doubt) into a positive (Wisdom/Caution).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Vulnerable openness',
      scene_tone: 'Intimate and soft',
      timeline_date: '7/28/1320 - Afternoon',
      timeline_variant: 'The Broken Redoubt',
      location: 'The Cistern Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Integration',
      setup: 'Francisco remains alone. He meditates on the lesson. He visualizes the battle again, not with panic, but with detachment (Marcus Aurelius style). He sees the patterns of Dagon\'s attack he missed before because he was too busy being \'brave\'. He realizes Dagon wasn\'t trying to kill them; he was trying to corral them. The fear *was* the weapon. By seeing this, he neutralizes it. He writes a new entry in his journal: \'The obstacle was the Fear. I have removed the obstacle.\'',
      symbolism: 'The \'Third Eye\' opening. Integrating the Shadow. The pen moving smoothly on the paper now (flow state).',
      beat_goal: 'The Epiphany. Gaining a tactical advantage through emotional insight.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Cold clarity',
      scene_tone: 'Lucid and sharp',
      timeline_date: '7/28/1320 - Late Afternoon',
      timeline_variant: 'The Broken Redoubt',
      location: 'The Cistern Room',
    },
    {
      scene_number: 4,
      scene_title: 'The Return',
      setup: 'Francisco leaves the cistern. He walks back into the main camp. He looks different—calmer, heavier, but more grounded. The allies look to him. He doesn\'t shout. He speaks quietly, but everyone hears him. He gives orders that are nuanced, factoring in the fear he felt. He is no longer just the \'General\' (Wands); he is the \'Philosopher King\' (Cups + Swords). He has digested the experience and turned it into fuel.',
      symbolism: 'Emerging from the Cave/Womb. The literal \'Return\' of the Hero. The quiet authority vs. the loud bravery of the previous chapter.',
      beat_goal: 'Resolution. Show the change in state. Prepare for the strategic shift in the next chapter.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Quiet power',
      scene_tone: 'Resonant',
      timeline_date: '7/28/1320 - Evening',
      timeline_variant: 'The Broken Redoubt (Main Hall)',
      location: 'Main Hall',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 376 - 380',
      description: 'Cold guns, wounded being treated, adrenaline crash hitting hard—Francisco walking away from survival celebration feeling hollow not triumphant—finding quiet dark cistern room with still black water—sitting trying to write report but only managing "Why?" as Deep Work isolation forced upon him.',
      focus: 'Transitioning from Action to Reflection by isolating hero.',
      chapterSceneFocus: 'Ch66S1: Post-battle adrenaline crash driving hollow Francisco from celebration to quiet dark cistern with still black water—attempting report writing but only producing "Why?" as Deep Work isolation forces transition from action to reflection.',
      preliminarySceneFocus: 'Cistern subconscious beckons isolation',
      preliminarySceneDescription: 'Hollow exhaustion seeks dark water reflection',
      narrativeFunction: 'Transitions from action to reflection; isolates hero for introspection; establishes Queen of Cups water symbolism.',
      sensoryDetail: 'Cold guns, wounded treatment, adrenaline crash, hollow feeling, survival celebration avoided, quiet dark room, old cistern, still black water, sitting, report attempt, only "Why?" written.',
      internalConflict: 'Francisco unable to process heroic experience through bureaucratic reporting—needing deeper understanding.',
      characterGrowthElement: 'Francisco recognizing need for reflection over action—beginning shift from Man of Action to Man of Wisdom.',
      seriesConnectionResonance: 'Queen of Cups reflection establishing philosophical foundation; Marcus Aurelius Meditations influence beginning.',
      sceneCardProgression: 178,
      realWorldContext: 'Post-trauma processing, Deep Work isolation, bureaucracy failing human experience.',
      timelineSignificance: 'Hours after EA-065 collapse—Francisco withdrawing for necessary emotional processing.',
      saveTheCatBeat: truncate('All Is Lost - hollow victory requires understanding', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'still_echoing',
        narrative_mode: 'exhausted_isolation',
      }),
      learning_objectives: JSON.stringify([
        'Action requiring reflection processing',
        'Deep Work isolation necessity',
        'Bureaucracy inadequate for human experience',
      ]),
      foreshadowing_elements: JSON.stringify([
        'La Signora mirror coming',
        'Fear reframing wisdom',
        'Philosopher King emergence',
      ]),
    },
    {
      pages: 'Page 380 - 383',
      description: 'La Signora entering silently sitting bringing Cup tea/water—asking Socratic "What did you lose today?" answered "My certainty"—her smile teaching "Kings with certainty dangerous, kings with questions wise"—forcing fear reframe from failure to signal as Reflective Practitioner learning from event.',
      focus: 'Reframing negative Fear/Doubt into positive Wisdom/Caution.',
      chapterSceneFocus: 'Ch66S2: La Signora silently entering with Cup asking Socratic question receiving "certainty" loss answer—teaching wisdom through questions not certainty—reframing Francisco\'s fear from failure to signal as Reflective Practitioner Queen of Cups offering wisdom mirror.',
      preliminarySceneFocus: 'Mirror wisdom reframes fear',
      preliminarySceneDescription: 'Queen offers cup reframing shadow',
      narrativeFunction: 'Provides wisdom mentor guidance; reframes trauma as learning; establishes Queen of Cups archetype.',
      sensoryDetail: 'La Signora entering, silent sitting, Cup brought, tea/water, Socratic question, certainty loss, smile, kings wisdom teaching, fear signal reframe.',
      internalConflict: 'Francisco opening vulnerability to accept fear as data not weakness.',
      characterGrowthElement: 'Francisco learning to see fear as signal for wisdom—Queen of Cups emotional mastery through La Signora\'s mirror.',
      seriesConnectionResonance: 'La Signora as Queen of Cups mentor; Reflective Practitioner model; Shadow Self integration beginning.',
      sceneCardProgression: 179,
      realWorldContext: 'Socratic mentorship, fear as data signal, vulnerability as strength.',
      timelineSignificance: 'La Signora providing critical reframe enabling Francisco\'s transformation to Philosopher King.',
      saveTheCatBeat: truncate('All Is Lost - wisdom reframes fear as signal', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'intimate_soft',
        narrative_mode: 'vulnerable_openness',
      }),
      learning_objectives: JSON.stringify([
        'Questions wiser than certainty',
        'Fear as signal not failure',
        'Shadow Self as teacher',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Marcus Aurelius meditation coming',
        'Dagon pattern recognition',
        'Fear as weapon neutralized',
      ]),
    },
    {
      pages: 'Page 383 - 387',
      description: 'Francisco alone meditating on lesson—visualizing battle with Marcus Aurelius detachment not panic—seeing missed Dagon attack patterns from being too busy being brave—realizing Dagon corralling not killing, fear itself the weapon—neutralizing by recognition, journaling "The obstacle was the Fear. I have removed the obstacle."',
      focus: 'Epiphany gaining tactical advantage through emotional insight.',
      chapterSceneFocus: 'Ch66S3: Francisco meditating with Marcus Aurelius detachment replacing panic—recognizing Dagon\'s corral strategy missed while being brave—realizing fear as weapon neutralized through recognition journaling obstacle removal as Third Eye opens integrating Shadow.',
      preliminarySceneFocus: 'Third Eye integrates shadow',
      preliminarySceneDescription: 'Detachment reveals corralling weapon',
      narrativeFunction: 'Delivers epiphany; reveals Dagon\'s true strategy; demonstrates emotional insight as tactical advantage.',
      sensoryDetail: 'Alone meditation, lesson contemplation, battle visualization, Marcus Aurelius detachment, pattern recognition, Dagon corral strategy, fear weapon realization, neutralization, journal writing, smooth pen flow.',
      internalConflict: 'Francisco achieving detachment to see truth hidden by brave performance.',
      characterGrowthElement: 'Francisco integrating Shadow through Marcus Aurelius style meditation—achieving Third Eye clarity turning trauma into tactical advantage.',
      seriesConnectionResonance: 'Marcus Aurelius Meditations direct influence; Dagon corral strategy revealed; fear weapon neutralized philosophically.',
      sceneCardProgression: 180,
      realWorldContext: 'Meditation clarity, detachment revealing patterns, emotional insight as tactical advantage.',
      timelineSignificance: 'Critical epiphany revealing Dagon\'s psychological warfare—fear as primary weapon now neutralized.',
      saveTheCatBeat: truncate('All Is Lost - clarity reveals fear weapon neutralized', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'lucid_sharp',
        narrative_mode: 'cold_clarity',
      }),
      learning_objectives: JSON.stringify([
        'Detachment enabling pattern recognition',
        'Fear as corralling weapon',
        'Shadow integration through meditation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Philosopher King emergence',
        'Quiet authority replacing loud bravery',
        'Strategic shift next chapter',
      ]),
    },
    {
      pages: 'Page 387 - 390',
      description: 'Francisco leaving cistern returning to main camp looking different—calmer, heavier, more grounded—allies responding to quiet speech everyone hears—giving nuanced orders factoring in fear—no longer just General (Wands) but Philosopher King (Cups + Swords) having digested experience into fuel emerging from cave/womb.',
      focus: 'Resolution showing change in state preparing strategic shift.',
      chapterSceneFocus: 'Ch66S4: Francisco emerging from cistern looking calmer, heavier, grounded—quiet speech heard by all giving nuanced fear-factoring orders—transformed from General to Philosopher King having digested trauma into fuel as literal Hero Return from cave/womb with quiet authority.',
      preliminarySceneFocus: 'Cave return births Philosopher King',
      preliminarySceneDescription: 'Quiet authority replaces loud bravery',
      narrativeFunction: 'Resolves transformation arc; demonstrates wisdom integration; prepares for strategic shift.',
      sensoryDetail: 'Cistern exit, main camp return, different appearance, calmer heavier grounded, allies looking, quiet speech, everyone hearing, nuanced orders, fear factored, Philosopher King emergence.',
      internalConflict: 'Francisco embodying integrated wisdom—comfortable with quiet power over loud performance.',
      characterGrowthElement: 'Francisco completing transformation to Philosopher King—combining Cups emotional wisdom with Swords strategic thinking, quiet authority over loud bravery.',
      seriesConnectionResonance: 'Philosopher King archetype established; quiet authority as leadership style; moral compass foundation for war.',
      sceneCardProgression: 181,
      realWorldContext: 'Wisdom integration, quiet authority, trauma as fuel not wound.',
      timelineSignificance: 'Francisco\'s transformation complete—ready for strategic shift with philosophical foundation enabling moral war leadership.',
      saveTheCatBeat: truncate('All Is Lost - Philosopher King emerges from reflection', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'resonant_return',
        narrative_mode: 'quiet_power',
      }),
      learning_objectives: JSON.stringify([
        'Wisdom integration completing transformation',
        'Quiet authority over loud bravery',
        'Trauma digested as fuel',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Strategic shift enabled',
        'Moral compass guiding war',
        'Philosopher King leadership continuing',
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
        chapterUniqueIdentifier: 'EA-066',
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

  console.log(`\n✅ EA-066 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
