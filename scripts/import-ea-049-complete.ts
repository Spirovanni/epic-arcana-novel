import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-049: Patience (Book 2, Chapter 9)...\n');

  // Get chapter EA-049
  const [ch49] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-049'))
    .limit(1);

  if (!ch49) {
    console.error('❌ EA-049 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch49.title} (ID: ${ch49.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Weight of Knowledge',
      setup: 'On the Zanetti Train after witnessing the horrors of timeline manipulation, Francisco sits alone in his compartment as night falls, the Trionfi cards spread before him untouched. Francisco wants to continue his quest, to find a way to use timeline power for good, but the images of the trapped and erased haunt him—what if he becomes like them? Gherardo bursts in, demanding action now that they understand the stakes, arguing that delay means more suffering; Francisco wants time to think, to understand the path forward. Opposition mounts from all sides: Gherardo\'s impatience and accusations of cowardice, the urgency of the trapped people\'s suffering, and Francisco\'s own fear that hesitation equals weakness. But Dante appears with unexpected news: the train is diverting to a temporal monastery where Francisco can learn what the Alexandrians and Byzantines never did—the discipline of restraint. The scene lands on Francisco accepting the detour, choosing contemplation over immediate action.',
      symbolism: 'The Page of Swords embodies the chapter\'s patience theme: a student approaching knowledge with discipline rather than rushing to use incomplete understanding. Francisco\'s untouched Trionfi cards represent the wisdom of pausing before wielding power, while Gherardo\'s impatience foreshadows the danger of acting without proper timing.',
      beat_goal: 'Francisco\'s doubt reaches its peak after the dark revelations, forcing him to choose between Gherardo\'s push for immediate action and Dante\'s invitation to learn patience, establishing the central tension between rushing to use power and waiting for wisdom.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Doubt and internal conflict',
      scene_tone: 'Tense and introspective',
      timeline_date: 'Post-Book 1 + 3 weeks (night)',
      timeline_variant: 'Primary Timeline',
      location: 'Zanetti Train - Francisco\'s Compartment',
    },
    {
      scene_number: 2,
      scene_title: 'Between Timeline Storms',
      setup: 'The Zanetti Train shifts into a calm space between timeline storms, and through the windows Francisco sees the impossible: a monastery suspended in crystalline stillness while chaos rages at its edges. Francisco wants to understand how this place can exist peacefully amid temporal turbulence; the Temporal Monks want him to stop analyzing and simply experience the calm. Opposition emerges from Francisco\'s analytical mind (trying to solve the mystery intellectually), Gherardo\'s visible frustration with what he sees as wasted time, and the contrast between the monastery\'s peace and the urgency of the suffering they\'ve witnessed. But as Francisco steps onto the platform and feels time itself move differently—not slower or faster, but with intentional rhythm—something shifts. The lead monk, an elderly woman who exists simultaneously at multiple ages, greets him: "Power wielded in haste creates chaos. Power wielded with patience shapes destinies." The scene lands on Francisco\'s first glimpse of a different approach to timeline manipulation.',
      symbolism: 'The monastery suspended between timeline storms embodies the Page of Swords\' learning posture: finding calm center amid chaos to study rather than react. The elderly monk\'s simultaneous ages represent mastery through patient observation, showing Francisco that true power comes from understanding timing rather than forcing immediate results.',
      beat_goal: 'Francisco arrives at the temporal monastery and encounters the Temporal Monks, experiencing for the first time that timeline manipulation can be approached through contemplative discipline rather than emotional intensity, planting the seed that patience itself is a form of power.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Wonder and curiosity',
      scene_tone: 'Mystical and contemplative',
      timeline_date: 'Post-Book 1 + 3 weeks (dawn)',
      timeline_variant: 'Temporal Calm Space',
      location: 'Temporal Monastery - Entry Platform',
    },
    {
      scene_number: 3,
      scene_title: 'Meditation Gardens of Time',
      setup: 'In the monastery\'s meditation gardens, Francisco joins the Temporal Monks in their practice, learning to perceive timeline branches without being overwhelmed by attempting to change them. Francisco wants to master these techniques quickly so he can return to help the trapped and erased; the monks want him to understand that rushing the learning process defeats its purpose. Opposition intensifies through Francisco\'s impatience (every moment here feels like abandoning those who suffer), the exercises\' frustrating subtlety (he can see timeline branches but not affect them), and Gherardo\'s increasingly hostile presence at the garden\'s edge, watching with barely contained contempt. But as Francisco finally manages to hold his awareness across three simultaneous timeline branches without trying to alter them, he experiences a revelation: the Trionfi cards in his hand pulse with new warmth, responding to his centered calm in ways they never did to his emotional intensity. The elderly monk smiles: "The cards reward patience. Force creates ripples. Patience creates rivers." The scene lands on Francisco\'s first successful temporal meditation.',
      symbolism: 'The meditation gardens where time flows differently embody the Page of Swords\' study of craft: learning to observe and understand before attempting to master. Francisco\'s ability to perceive timelines without changing them represents the discipline of patience—power comes from knowing when NOT to act as much as when to act.',
      beat_goal: 'Francisco learns temporal meditation techniques that allow calm perception of timeline branches without emotional overwhelm, discovering that the Trionfi cards respond more effectively to centered patience than to urgent intensity, fundamentally shifting his approach to timeline power.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Concentration and breakthrough',
      scene_tone: 'Meditative and revelatory',
      timeline_date: 'Post-Book 1 + 3 weeks (midday)',
      timeline_variant: 'Meditation Garden (Multiple Timelines Perceived)',
      location: 'Temporal Monastery - Meditation Gardens',
    },
    {
      scene_number: 4,
      scene_title: 'The Patience to Ripen',
      setup: 'On his final evening at the monastery, Francisco walks with the elderly monk through gardens where flowers bloom across centuries in compressed moments, each petal opening at its perfect time. Francisco wants reassurance that patience doesn\'t equal inaction, that waiting doesn\'t mean abandoning those who suffer; the monk wants him to understand the difference between patience and paralysis. Opposition comes from Francisco\'s lingering guilt (people are trapped while he studies), Gherardo\'s open challenge ("While you meditate, they suffer"), and Francisco\'s fear that he\'s using contemplation as an excuse to avoid difficult action. But the monk shows Francisco a rosebud that has taken three centuries to bloom in normal time, yet will open in minutes here: "True patience knows the right moment. The Alexandrians trapped people because they couldn\'t wait for knowledge to unfold naturally. The Byzantines erased timelines because they couldn\'t wait for conflicts to resolve. You will face choices that demand immediate action. But you will also face choices that demand you wait for the proper moment—and wisdom is knowing which is which." Francisco realizes his time here wasn\'t delay but preparation. The scene lands on Francisco\'s integration of patience as a tool, not a weakness.',
      symbolism: 'The century-spanning rosebud represents the Page of Swords\' core lesson: mastery requires letting understanding ripen at its own pace. Francisco\'s integration of contemplative practice with his quest embodies the balance between study and action—the page who learns discipline before becoming the knight who charges into battle.',
      beat_goal: 'Francisco integrates the monastery\'s teachings on patience and timing, understanding that wisdom lies in discerning when to act immediately versus when to wait for the proper moment, preparing him to face future timeline choices with both power and restraint as the journey continues.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Integration and resolve',
      scene_tone: 'Contemplative and empowering',
      timeline_date: 'Post-Book 1 + 4 weeks (evening)',
      timeline_variant: 'Meditation Garden (Compressed Time)',
      location: 'Temporal Monastery - Century Gardens',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Weight of Knowledge
      pages: 'Page 121 - 124',
      description: 'Francisco grapples with doubt after witnessing timeline manipulation horrors, choosing between Gherardo\'s demand for immediate action and Dante\'s invitation to learn patience at a temporal monastery.',
      focus: 'Francisco\'s doubt reaches its peak as he must choose between rushing to use power and waiting to develop wisdom',
      chapterSceneFocus: 'Ch49S1: Francisco confronts doubt after dark revelations, faces Gherardo\'s push for immediate action versus Dante\'s monastery invitation, chooses contemplation over rushing to wield power',
      preliminarySceneFocus: 'Choosing contemplation over immediate reactive action',
      preliminarySceneDescription: 'Francisco\'s choice to accept the monastery detour represents choosing to develop wisdom through patience rather than rushing to use incomplete understanding',
      narrativeFunction: 'Establishes the central tension between impatience to act and wisdom of waiting, setting up Francisco\'s learning arc about timing and restraint',
      sensoryDetail: 'Trionfi cards spread untouched before Francisco in dark compartment, Gherardo bursting in with urgent demands, Dante\'s calm announcement of monastery diversion',
      internalConflict: 'Francisco torn between fear that hesitation equals weakness and intuition that rushing equals danger, haunted by images of trapped and erased victims',
      characterGrowthElement: 'Francisco makes first conscious choice to pause and learn rather than react immediately, beginning shift from emotion-driven to disciplined approach',
      seriesConnectionResonance: 'Patience theme introduction becomes crucial for Book 9 ultimate choice to wait for humanity to mature rather than forcing change',
      sceneCardProgression: 110,
      realWorldContext: 'Night on Zanetti Train three weeks post-disillusionment, Francisco wrestling with whether to continue quest',
      timelineSignificance: 'Critical decision point choosing study over immediate action',
      saveTheCatBeat: 'Fun and Games - exploring the virtue of patience as alternative to rushed power use',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-slow - allowing doubt and decision to breathe',
        tension_level: 'High internal - pressure to act versus wisdom to wait',
        emotional_arc: 'Doubt → Pressure → Internal conflict → Resolution',
      }),
      learning_objectives: JSON.stringify([
        'Understand that pausing before action is wisdom not weakness',
        'Recognize that incomplete understanding makes power dangerous',
        'Accept that timing is as important as capability',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Gherardo\'s impatience setting up eventual betrayal',
        'Francisco\'s choice to learn patience (crucial for Book 9)',
        'Untouched Trionfi cards suggesting new relationship with power',
      ]),
    },
    {
      // Scene 2: Between Timeline Storms
      pages: 'Page 125 - 128',
      description: 'Francisco arrives at temporal monastery suspended in calm between timeline storms, encountering Temporal Monks who teach that patience itself is a form of power through contemplative discipline.',
      focus: 'Francisco experiences for the first time that timeline manipulation can be approached through contemplative discipline rather than emotional intensity',
      chapterSceneFocus: 'Ch49S2: Francisco arrives at monastery suspended between timeline storms, encounters elderly monk existing at multiple ages, experiences time moving with intentional rhythm revealing patience as power form',
      preliminarySceneFocus: 'Experiencing calm center amid chaos for study not reaction',
      preliminarySceneDescription: 'Monastery\'s crystalline stillness amid raging temporal chaos demonstrates finding centered calm to observe and learn rather than react',
      narrativeFunction: 'Introduces temporal monastery and contemplative approach to timeline power, establishing alternative to both Alexandrian and Byzantine methods',
      sensoryDetail: 'Monastery suspended in crystalline stillness, timeline storms raging at edges, time moving with intentional rhythm, elderly monk existing simultaneously at multiple ages',
      internalConflict: 'Francisco\'s analytical mind trying to solve mystery versus monks\' invitation to simply experience, urgency of suffering witnessed versus peace of monastery',
      characterGrowthElement: 'Francisco begins shifting from analytical problem-solving to experiential learning, opening to contemplative wisdom',
      seriesConnectionResonance: 'Contemplative practice techniques learned here help Francisco maintain sanity during timeline convergence of Books 7-8',
      sceneCardProgression: 111,
      realWorldContext: 'Dawn arrival at temporal sanctuary existing in calm spaces between timeline turbulence',
      timelineSignificance: 'Entry into temporal calm space revealing new approach to power',
      saveTheCatBeat: 'Fun and Games - discovering monastery teachings on patience and timing',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow mystical - allowing wonder and new understanding to emerge',
        tension_level: 'Moderate - contrast between peace and remembered urgency',
        emotional_arc: 'Doubt → Wonder → Curiosity → Opening',
      }),
      learning_objectives: JSON.stringify([
        'Recognize that contemplative discipline offers alternative to force',
        'Experience centered calm as foundation for perceiving truth',
        'Understand that timing matters more than speed',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Elderly monk\'s simultaneous ages (mastery through patience theme)',
        'Gherardo\'s visible frustration (betrayal setup)',
        'Monastery teachings (crucial for later books)',
      ]),
    },
    {
      // Scene 3: Meditation Gardens of Time
      pages: 'Page 129 - 132',
      description: 'Francisco learns temporal meditation to perceive timeline branches without trying to change them, discovering Trionfi cards respond more effectively to centered patience than urgent emotional intensity.',
      focus: 'Francisco discovers that the Trionfi cards respond to calm patience rather than emotional force, fundamentally shifting his relationship with timeline power',
      chapterSceneFocus: 'Ch49S3: Francisco learns temporal meditation perceiving timeline branches without altering them, discovers Trionfi cards respond to centered calm over emotional intensity, experiences power of disciplined restraint',
      preliminarySceneFocus: 'Learning to observe and understand before attempting mastery',
      preliminarySceneDescription: 'Meditation practice teaches Francisco that perceiving timelines without changing them develops discipline—knowing when not to act is as powerful as knowing when to act',
      narrativeFunction: 'Establishes temporal meditation as Francisco\'s new approach and reveals Trionfi cards respond to patience not force, fundamentally transforming his power relationship',
      sensoryDetail: 'Meditation gardens with time flowing differently, Francisco holding awareness across three timeline branches simultaneously, Trionfi cards pulsing with new warmth, Gherardo watching with contempt at garden edge',
      internalConflict: 'Francisco\'s impatience to help suffering victims versus monks\' teaching that rushing defeats purpose, frustration at seeing without affecting versus breakthrough of centered perception',
      characterGrowthElement: 'Francisco achieves first successful temporal meditation, learning that restraint and observation build power more effectively than emotional intensity',
      seriesConnectionResonance: 'Temporal meditation techniques become essential tool throughout series, especially during crisis moments in Books 4-8',
      sceneCardProgression: 112,
      realWorldContext: 'Midday in meditation gardens where compressed time allows extended practice',
      timelineSignificance: 'Multiple timelines perceived simultaneously without interference',
      saveTheCatBeat: 'Fun and Games - mastering contemplative techniques and discovering patience rewards',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow meditative - space for practice and breakthrough',
        tension_level: 'Building then releasing - frustration to revelation',
        emotional_arc: 'Impatience → Frustration → Concentration → Breakthrough',
      }),
      learning_objectives: JSON.stringify([
        'Develop ability to perceive without immediately attempting to change',
        'Recognize that cards respond to centered calm over emotional force',
        'Understand that discipline of restraint builds greater power',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Trionfi cards\' new response pattern (evolved relationship with power)',
        'Gherardo\'s increasing hostility (betrayal approaching)',
        'Temporal meditation mastery (crucial for Books 7-8 convergence)',
      ]),
    },
    {
      // Scene 4: The Patience to Ripen
      pages: 'Page 133 - 135',
      description: 'Francisco integrates monastery teachings on discerning when to act immediately versus when to wait for proper moment, understanding patience as preparation not delay, completing his transformation from reactive to disciplined approach.',
      focus: 'Francisco integrates understanding that wisdom lies in discerning when to act versus when to wait, completing his shift to patient mastery',
      chapterSceneFocus: 'Ch49S4: Francisco integrates patience teachings through century-spanning rosebud lesson, learns to discern immediate action versus proper timing, understands monastery time as preparation not delay',
      preliminarySceneFocus: 'Integrating patience as tool not weakness for wise action',
      preliminarySceneDescription: 'Francisco completes transformation understanding that mastery requires letting understanding ripen, balancing study with action as disciplined student preparing for challenges ahead',
      narrativeFunction: 'Resolves chapter arc by integrating patience as essential tool, establishing Francisco\'s mature approach balancing contemplation and action for series journey',
      sensoryDetail: 'Flowers blooming across centuries in compressed moments, rosebud taking three centuries to bloom yet opening in minutes, each petal opening at perfect time',
      internalConflict: 'Francisco\'s lingering guilt about trapped victims versus understanding preparation enables better help, fear of using contemplation as avoidance versus recognizing genuine wisdom development',
      characterGrowthElement: 'Francisco integrates patience as active tool for discerning timing, completing shift from emotion-driven reaction to wisdom-grounded action',
      seriesConnectionResonance: 'Understanding of proper timing becomes Francisco\'s defining trait and enables his Book 9 choice to wait for humanity rather than force change',
      sceneCardProgression: 113,
      realWorldContext: 'Final evening at monastery in century gardens where time compression allows rapid natural blooming',
      timelineSignificance: 'One week spent in monastery (four weeks total post-Book 1)',
      saveTheCatBeat: 'Fun and Games conclusion - establishing patience foundation for journey ahead',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow contemplative - space for integration and resolution',
        tension_level: 'Low to moderate - internal resolution after learning',
        emotional_arc: 'Guilt → Questioning → Understanding → Integration',
      }),
      learning_objectives: JSON.stringify([
        'Discern when situations demand immediate action versus proper timing',
        'Recognize patience as preparation enabling better action not avoidance',
        'Integrate contemplative discipline with quest for wisdom-based power use',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Wisdom of timing (crucial for all future books)',
        'Balance between study and action (Francisco\'s defining trait)',
        'Proper moment discernment (Book 9 ultimate choice foundation)',
      ]),
    },
  ];

  // Insert or update each scene
  for (let i = 0; i < scenesData.length; i++) {
    const sceneData = scenesData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);

    // Insert basic scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch49.id,
        chapterUniqueIdentifier: 'EA-049',
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.setup,
        symbolism: sceneData.symbolism,
        beatGoal: sceneData.beat_goal,
        pov: sceneData.pov,
        tense: sceneData.tense,
        core_emotion: truncate(sceneData.core_emotion, 255),
        scene_tone: truncate(sceneData.scene_tone, 255),
        timeline_date: sceneData.timeline_date,
        timeline_variant: sceneData.timeline_variant,
        location: sceneData.location,
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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 100),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all fields are populated
  console.log('\n\n🔍 Verifying field completion...\n');

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch49.id));

  const allFields = [
    'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
    'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
    'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
    'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
    'learning_objectives', 'foreshadowing_elements', 'sceneNumber', 'title', 'setup',
    'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_date',
    'timeline_variant', 'location', 'chapterUniqueIdentifier',
  ];

  for (const scene of chapterScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))) {
    const missingFields: string[] = [];
    const presentFields: string[] = [];

    for (const field of allFields) {
      const value = scene[field as keyof typeof scene];
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentFields.length}/${allFields.length}`);
    console.log(`   ❌ Missing: ${missingFields.length}/${allFields.length}`);

    if (missingFields.length > 0) {
      console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }
  }

  console.log('\n✅ EA-049 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
