import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-052: Recuperation (Book 2, Chapter 12)...\n');

  // Get chapter EA-052
  const [ch52] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-052'))
    .limit(1);

  if (!ch52) {
    console.error('❌ EA-052 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch52.title} (ID: ${ch52.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Weight of Aftermath',
      setup: 'On the Zanetti Train after Roger\'s temporal funeral, Francisco sits in the observation car watching realities blur past, unable to sleep despite exhaustion that reaches his bones. His new allies from the factions—the Medici scholar, Alexandrian rebel, Byzantine soldier—sit scattered around the car, each processing grief in their own way, none meeting anyone\'s eyes. Francisco wants to be strong for them, to lead them forward, but he feels hollowed out; they want reassurance that Roger\'s death meant something, that their choice to leave their factions wasn\'t in vain. Opposition mounts from all sides: Francisco\'s own unprocessed trauma (he hasn\'t allowed himself to cry or rage), the weight of responsibility for these people who followed him, and the dangerous fact that the train\'s trajectory is becoming erratic—Dante can\'t maintain course when the navigator is this emotionally disrupted. But La Signora enters quietly, sits beside Francisco without speaking, and eventually says: "You can\'t lead them anywhere if you won\'t let yourself rest. The Four of Swords teaches us that laying down arms doesn\'t mean surrender—it means gathering strength." The scene lands on Francisco\'s recognition that he needs to heal before he can help anyone else.',
      symbolism: 'The Four of Swords (Feathers) embodies the chapter\'s recuperation theme: a warrior laying down weapons not in defeat but in necessary rest. The erratic train trajectory represents how unprocessed trauma disrupts not just the individual but everyone connected to them—healing isn\'t selfish, it\'s essential infrastructure.',
      beat_goal: 'Francisco confronts his inability to process Roger\'s death while trying to lead his new allies, learning from La Signora that leadership requires self-care and that healing isn\'t weakness but necessary preparation for the journey ahead.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhaustion and emotional numbness',
      scene_tone: 'Quiet and heavy',
      timeline_date: 'Post-Book 1 + 7 weeks',
      timeline_variant: 'Primary Timeline (Unstable)',
      location: 'Zanetti Train - Observation Car',
    },
    {
      scene_number: 2,
      scene_title: 'Finding Sanctuary',
      setup: 'La Signora takes control of the train with Dante\'s grateful permission, steering them toward a place Francisco didn\'t know existed: a sanctuary timeline, a pocket of reality that exists in temporal stillness while the rest of the multiverse churns. Francisco wants to understand how such a place is possible, how time can stop without freezing; La Signora wants him to stop analyzing and simply experience rest. Opposition emerges through Francisco\'s resistance to stopping (every moment feels like abandoning the mission), his allies\' wariness of La Signora\'s power (they\'ve never seen her take command like this), and the sanctuary\'s entrance requirements—to pass through, each person must consciously choose to set down their burdens temporarily. But as the train slides into the sanctuary and Francisco feels time\'s pressure lift for the first time since Roger\'s death, something inside him breaks open: he finally weeps, not quietly but with wrenching sobs that feel like they\'ll never stop. La Signora holds him while the others watch, and gradually, one by one, they begin crying too. The sanctuary accepts them all. The scene lands on collective grief becoming the gateway to healing.',
      symbolism: 'The sanctuary timeline embodies the Four of Swords\' sacred rest: a space deliberately carved out of time\'s flow where weapons (trauma, duty, fear) can be laid aside. The requirement to consciously choose rest represents how healing demands active surrender—you can\'t be forced to recover, you must choose it.',
      beat_goal: 'La Signora guides the group to a sanctuary timeline where time flows differently, and Francisco\'s resistance to rest finally breaks, allowing collective grief to become the foundation for genuine healing as they enter a space designed for recovery.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Breaking open and release',
      scene_tone: 'Cathartic and gentle',
      timeline_date: 'Post-Book 1 + 7 weeks (continuous)',
      timeline_variant: 'Sanctuary Timeline (Temporal Stillness)',
      location: 'Sanctuary Timeline - Entrance/Threshold',
    },
    {
      scene_number: 3,
      scene_title: 'Sharing Scars',
      setup: 'In the sanctuary\'s healing space—a garden where seasons exist simultaneously, spring flowers blooming beside autumn leaves beside winter snow—the group gathers around a fire that burns in impossible colors reflecting different temporal energies. Francisco wants to know his allies better, to understand why they left their factions; they want to share their stories but fear judgment for their pasts. Opposition builds through each person\'s shame about their faction\'s actions (the Medici scholar participated in economic manipulations, the Alexandrian rebel helped trap people in loops, the Byzantine soldier erased timelines), their fear that Francisco will reject them once he knows the truth, and the vulnerability required to expose wounds still raw. But La Signora shares first, revealing her own history—millennia of watching people she loved die, choices she made that haunted her across timelines, the weight of power she couldn\'t put down until she learned what the Four of Swords teaches: rest isn\'t absence of strength, it\'s trust in your own resilience. Her honesty creates permission for the others. They speak through the night as time flows strangely, one by one laying their burdens in the space between them, and Francisco realizes these people aren\'t just allies—they\'re becoming family. The scene lands on the Catalan Company truly forming as chosen family through shared vulnerability.',
      symbolism: 'The multi-seasonal garden represents the Four of Swords\' contemplative space: a place where all times and truths can exist together without conflict, where rest means integration rather than avoidance. The fire burning in temporal colors embodies how shared stories transform individual pain into collective strength—alchemy of the wounded becoming healers.',
      beat_goal: 'La Signora creates space for the group to share their traumatic pasts and faction guilt, modeling vulnerability that allows Francisco and his allies to truly bond through honesty, transforming from temporary companions into the Catalan Company—a chosen family built on authentic connection.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Vulnerability and deepening connection',
      scene_tone: 'Intimate and revelatory',
      timeline_date: 'Post-Book 1 + 7 weeks (first night in sanctuary)',
      timeline_variant: 'Sanctuary Timeline (Multi-temporal Garden)',
      location: 'Sanctuary Timeline - Healing Garden',
    },
    {
      scene_number: 4,
      scene_title: 'The Practice of Rest',
      setup: 'On their third day in the sanctuary (which feels like both hours and weeks due to time\'s strange flow), Francisco wakes to find La Signora teaching the others meditation techniques that integrate temporal awareness with psychological healing. Francisco wants to plan their next moves, to strategize about the factions and threats ahead; La Signora wants him to understand that rest is itself a practice, not just an absence of action. Opposition comes from Francisco\'s ingrained habit of always moving forward (rest feels like weakness), the group\'s nervous awareness that they can\'t hide in the sanctuary forever (reality waits beyond), and Francisco\'s fear that if he truly stops, he\'ll discover he can\'t start again. But as La Signora guides him through the meditation—perceiving his own timeline without trying to change it, observing his grief without running from it—Francisco experiences something revolutionary: he sees Roger\'s death not as an ending requiring revenge or redemption, but as a moment that taught him the true cost of this path, making him more qualified to walk it, not less. When they finally prepare to leave the sanctuary, Francisco feels different—not healed completely, but fundamentally changed. He\'s learned what the Four of Swords promised: that rest restores not by erasing wounds but by teaching you to carry them with grace. The scene lands on Francisco ready to lead because he\'s learned to rest.',
      symbolism: 'The meditation practice embodies the Four of Swords\' ultimate teaching: rest as active cultivation of resilience, not passive withdrawal. Francisco observing his timeline without trying to change it represents the maturity of acceptance—the warrior who lays down weapons not because the battle is over, but because they trust they\'ll pick them up again when needed.',
      beat_goal: 'Francisco learns that rest is an active practice of resilience-building through La Signora\'s temporal meditation teachings, reaching a mature acceptance of Roger\'s death and his own capacity to lead, preparing to re-enter the world not healed but fundamentally strengthened by choosing to rest.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Integration and readiness',
      scene_tone: 'Peaceful and transformative',
      timeline_date: 'Post-Book 1 + 7 weeks (sanctuary day 3)',
      timeline_variant: 'Sanctuary Timeline (Meditation Space)',
      location: 'Sanctuary Timeline - Contemplation Chamber',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Weight of Aftermath
      pages: 'Page 166 - 169',
      description: 'Francisco confronts inability to process Roger\'s death while trying to lead new allies, learning from La Signora that leadership requires self-care and healing isn\'t weakness but necessary preparation.',
      focus: 'Francisco learns that unprocessed trauma disrupts not just individual but everyone connected, recognizing need to heal before helping others',
      chapterSceneFocus: 'Ch52S1: Francisco confronts inability to process Roger\'s death while leading allies, discovers unprocessed trauma disrupts entire group, learns from La Signora that healing is essential infrastructure not selfish weakness',
      preliminarySceneFocus: 'Recognizing need for rest and recovery after trauma',
      preliminarySceneDescription: 'Erratic train trajectory demonstrates how unprocessed trauma affects everyone, teaching that laying down arms to rest means gathering strength not surrendering',
      narrativeFunction: 'Establishes necessity of healing and rest after Roger\'s death, introducing sanctuary timeline concept and Four of Swords theme',
      sensoryDetail: 'Realities blurring past train windows, scattered allies not meeting eyes, train trajectory becoming erratic, La Signora entering quietly to sit beside Francisco',
      internalConflict: 'Francisco\'s desire to be strong for others versus hollowed-out exhaustion, responsibility weight versus unprocessed trauma threatening group safety',
      characterGrowthElement: 'Francisco recognizes that healing isn\'t weakness but necessary leadership responsibility, beginning to understand self-care as essential infrastructure',
      seriesConnectionResonance: 'Understanding healing importance becomes crucial for series ultimate message of hope and Francisco\'s ability to sustain leadership through Books 7-9',
      sceneCardProgression: 122,
      realWorldContext: 'Seven weeks post-Book 1, aftermath of Roger\'s temporal funeral on unstable train',
      timelineSignificance: 'Primary timeline unstable due to Francisco\'s emotional disruption affecting navigation',
      saveTheCatBeat: 'Fun and Games - exploring allies, mentors, and helpers through healing',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow heavy - allowing exhaustion and numbness to breathe',
        tension_level: 'Moderate - danger of erratic trajectory versus quiet internal crisis',
        emotional_arc: 'Numbness → Hollowed out → Resistance → Recognition',
      }),
      learning_objectives: JSON.stringify([
        'Recognize that unprocessed trauma disrupts entire system not just individual',
        'Understand that leadership requires caring for own wellbeing to help others',
        'Accept that laying down arms to rest means gathering strength not surrender',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sanctuary timeline introduction (healing space for series)',
        'Chosen family formation (Catalan Company becoming essential)',
        'Rest as active practice (theme through remaining books)',
      ]),
    },
    {
      // Scene 2: Finding Sanctuary
      pages: 'Page 170 - 173',
      description: 'La Signora guides group to sanctuary timeline where Francisco\'s resistance to rest breaks, allowing collective grief to become foundation for genuine healing in space designed for recovery.',
      focus: 'Francisco\'s resistance to rest finally breaks in sanctuary timeline, enabling collective grief and healing through conscious choice',
      chapterSceneFocus: 'Ch52S2: La Signora guides group to sanctuary timeline in temporal stillness, Francisco\'s resistance breaks allowing collective grief, healing begins through conscious choice to set down burdens',
      preliminarySceneFocus: 'Choosing active surrender to allow healing',
      preliminarySceneDescription: 'Sanctuary timeline as space carved from time\'s flow demonstrates that healing requires conscious choice—you can\'t be forced to recover, must actively choose surrender',
      narrativeFunction: 'Introduces sanctuary timeline mechanics and demonstrates collective healing through shared vulnerability, establishing Catalan Company bonds',
      sensoryDetail: 'Train sliding into temporal stillness, time\'s pressure lifting palpably, Francisco weeping with wrenching sobs, others crying one by one, sanctuary accepting them all',
      internalConflict: 'Francisco\'s resistance to stopping versus desperate need for rest, analyzing mindset versus simply experiencing, mission urgency versus healing necessity',
      characterGrowthElement: 'Francisco breaks open emotionally, allowing vulnerability and collective grief to create foundation for genuine healing',
      seriesConnectionResonance: 'Sanctuary timeline becomes recurring refuge and collective healing creates bond enabling Books 7-9 collective action',
      sceneCardProgression: 123,
      realWorldContext: 'Continuous from Scene 1, entering pocket of reality existing in temporal stillness',
      timelineSignificance: 'Sanctuary timeline in temporal stillness while multiverse churns outside',
      saveTheCatBeat: 'Fun and Games - discovering sanctuary and collective healing',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow cathartic - allowing emotional breaking and release',
        tension_level: 'High building then releasing - resistance breaking to catharsis',
        emotional_arc: 'Resistance → Breaking → Release → Acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Understand that healing demands active conscious choice not forced recovery',
        'Recognize that collective grief creates foundation for genuine healing',
        'Accept that choosing to set down burdens temporarily enables strength building',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sanctuary timeline as recurring series refuge',
        'Collective healing enabling later collective action',
        'Conscious choice theme (crucial for Book 9 decisions)',
      ]),
    },
    {
      // Scene 3: Sharing Scars
      pages: 'Page 174 - 177',
      description: 'La Signora models vulnerability by sharing her own traumatic history, creating permission for group to share faction guilt and bond through honesty, transforming into Catalan Company chosen family.',
      focus: 'Group transforms from temporary companions to chosen family through shared vulnerability and authentic connection',
      chapterSceneFocus: 'Ch52S3: La Signora models vulnerability sharing millennia of trauma, creates permission for allies to share faction guilt, group bonds through honesty transforming into Catalan Company chosen family',
      preliminarySceneFocus: 'Building authentic bonds through shared vulnerability',
      preliminarySceneDescription: 'Multi-seasonal garden where all times coexist demonstrates contemplative space where rest means integration not avoidance, shared stories transform pain into collective strength',
      narrativeFunction: 'Establishes Catalan Company as chosen family through authentic vulnerable sharing, creating bonds essential for series arc',
      sensoryDetail: 'Garden with spring flowers, autumn leaves, winter snow coexisting, fire burning impossible temporal colors, night lasting through strange time flow, burdens laid in space between them',
      internalConflict: 'Each person\'s shame about faction actions versus need to share, fear of rejection versus desire for authentic connection, vulnerability requirements versus protective walls',
      characterGrowthElement: 'Group transforms through vulnerability from allies to chosen family, Francisco realizes authentic bonds require honesty about wounds',
      seriesConnectionResonance: 'Chosen family bonds formed here become essential for collective action required in Books 7-9 climax',
      sceneCardProgression: 124,
      realWorldContext: 'First night in sanctuary healing garden where seasons exist simultaneously',
      timelineSignificance: 'Multi-temporal garden where time flows strangely enabling extended sharing',
      saveTheCatBeat: 'Fun and Games - forming genuine bonds through vulnerability',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow intimate - space for deep sharing and connection',
        tension_level: 'Moderate - vulnerability risk versus deepening trust',
        emotional_arc: 'Fear → Shame → Vulnerability → Connection',
      }),
      learning_objectives: JSON.stringify([
        'Understand that authentic bonds require vulnerability about wounds',
        'Recognize that shared stories transform individual pain into collective strength',
        'Accept that chosen family forms through honesty not perfection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Catalan Company bonds (essential for Books 7-9)',
        'La Signora\'s full history (revealed more in later books)',
        'Shared vulnerability as power source (series theme)',
      ]),
    },
    {
      // Scene 4: The Practice of Rest
      pages: 'Page 178 - 180',
      description: 'Francisco learns rest as active resilience practice through temporal meditation, achieving mature acceptance of Roger\'s death and readiness to lead, preparing to re-enter world fundamentally strengthened.',
      focus: 'Francisco achieves mature acceptance through meditation practice, understanding rest as active resilience cultivation preparing him to lead',
      chapterSceneFocus: 'Ch52S4: Francisco learns rest as active resilience practice through temporal meditation, achieves mature acceptance of Roger\'s death, prepares to re-enter world not healed but fundamentally strengthened by choosing rest',
      preliminarySceneFocus: 'Integrating rest as active practice for sustainable leadership',
      preliminarySceneDescription: 'Meditation practice demonstrates rest as active resilience cultivation—warrior laying down weapons trusting ability to pick them up when needed, acceptance as maturity marker',
      narrativeFunction: 'Resolves chapter arc by establishing rest as ongoing practice, Francisco achieving acceptance enabling continued leadership despite wounds',
      sensoryDetail: 'Third sanctuary day feeling like hours and weeks simultaneously, meditation techniques integrating temporal awareness with psychological healing, Francisco perceiving his timeline without changing it',
      internalConflict: 'Francisco\'s habit of forward motion versus learning to stop, planning future versus being present, fear of inability to restart versus trust in resilience',
      characterGrowthElement: 'Francisco integrates rest as active practice, achieving mature acceptance that wounds make him more qualified not less, learning to carry grief with grace',
      seriesConnectionResonance: 'Rest as practice becomes Francisco\'s sustainability tool through series, enabling leadership through Books 7-9 without burnout',
      sceneCardProgression: 125,
      realWorldContext: 'Third day in sanctuary with undefined external time passage, contemplation chamber for meditation',
      timelineSignificance: 'Meditation space where Francisco perceives his own timeline without trying to change it',
      saveTheCatBeat: 'Fun and Games conclusion - mastering recuperation before re-entering quest',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow peaceful - space for integration and transformation',
        tension_level: 'Low - internal resolution versus external preparation',
        emotional_arc: 'Resistance → Practice → Acceptance → Integration',
      }),
      learning_objectives: JSON.stringify([
        'Understand that rest is active resilience practice not passive withdrawal',
        'Achieve acceptance that wounds qualify rather than disqualify for path',
        'Integrate ability to carry grief with grace as leadership capacity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Rest practice sustaining Francisco through series',
        'Mature acceptance enabling difficult choices',
        'Trust in resilience (Book 9 ultimate test)',
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
        chapterId: ch52.id,
        chapterUniqueIdentifier: 'EA-052',
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
    .where(eq(scenes.chapterId, ch52.id));

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

  console.log('\n✅ EA-052 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
