import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-086: Apathy (Book 3, Chapter 6)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-086'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-086 not found. Run create-ea-086-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Safe House',
      setup: 'Interior. Day (but shutters closed). Dust motes. Francisco lies on a cot, staring at a crack in the ceiling. He hasn\'t shaved. The magic feels distant, like a limb that\'s been slept on.',
      symbolism: 'The Four of Cups (Closed posture). The Stagnant Water.',
      beat_goal: 'Establishing the State. The depth of the depression.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Apathy',
      scene_tone: 'Oppressive',
      timeline_date: '6/1/1321 - Day',
      timeline_variant: 'Safe House',
      location: 'Bedroom',
    },
    {
      scene_number: 2,
      scene_title: 'The Offer Rejected',
      setup: 'La Signora brings a map. \'There is a disturbance in the hills. We should check it.\' Francisco pushes it away. \'Let someone else be the hero.\' He sees the cup being offered (symbolically) and rejects it.',
      symbolism: 'The Fourth Cup. Refusal of the Call.',
      beat_goal: 'The Conflict. Resistance to re-engaging.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Irritation',
      scene_tone: 'Tense',
      timeline_date: '6/1/1321 - Afternoon',
      timeline_variant: 'Safe House',
      location: 'Kitchen',
    },
    {
      scene_number: 3,
      scene_title: 'The Walk',
      setup: 'Francisco goes out. The air is fresh but it smells flat to him. He wanders the village. People are living normal lives. He feels alien. He sees a child chasing a ball near an old ruin. The air shimmers.',
      symbolism: 'The World Continuing. The Glitch.',
      beat_goal: 'Please (The Spark). Seeing the anomaly.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Detachment',
      scene_tone: 'Observational',
      timeline_date: '6/1/1321 - Late Afternoon',
      timeline_variant: 'Village',
      location: 'The Ruins',
    },
    {
      scene_number: 4,
      scene_title: 'The Catch',
      setup: 'The ball rolls into the shimmer. The child runs after it. The ruin wall collapses (timeline decay). Francisco moves before he thinks. A blast of kinetic energy holds the wall up. The child grabs the ball and runs out. Francisco drops the wall. He is panting. He feels *something*.',
      symbolism: 'The Spark of Action. The Awakening.',
      beat_goal: 'The Action. Breaking the apathy.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Adrenaline',
      scene_tone: 'Active',
      timeline_date: '6/1/1321 - Sunset',
      timeline_variant: 'Village',
      location: 'The Ruins',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 76 - 80',
      description: 'Interior day shutters-closed dust-motes—Francisco cot lying ceiling-crack staring unshaved—magic distant limb-slept-on feeling as Four Cups closed-posture Stagnant-Water establishes depression depth Low-Point apathy oppressive Drive autonomy-purpose lacking Sleeper shut-down trauma-processing hero-burnout showing weeks-later safe-house suffocating numb.',
      focus: 'State establishing depression depth through apathy.',
      chapterSceneFocus: 'Ch86S1: Interior shutters-closed dust Francisco cot ceiling-crack staring unshaved magic distant limb-slept as Four Cups closed Stagnant-Water establishes depression depth Low-Point apathy oppressive Drive autonomy-purpose lacking Sleeper shut-down trauma burnout weeks safe-house numb.',
      preliminarySceneFocus: 'Four Cups closed Stagnant oppressive',
      preliminarySceneDescription: 'Depression depth apathy lacking purpose numbly',
      narrativeFunction: 'Establishes Four of Cups apathy; demonstrates trauma shutdown; shows Drive autonomy/purpose lack; creates oppressive Low Point.',
      sensoryDetail: 'Interior day, shutters closed, dust motes, Francisco lying, cot, ceiling crack staring, unshaved, magic distant, limb slept-on feeling, Four Cups, closed posture, stagnant water, depression depth, safe house dusty dim suffocating.',
      internalConflict: 'Francisco experiencing apathy—shut down from trauma, magic feeling distant, lacking autonomy and purpose, processing brother loss through numbness.',
      characterGrowthElement: 'Francisco embodying Sleeper—shut down processing trauma, experiencing Four of Cups stagnation, lacking Drive autonomy/purpose, hero burnout showing realistic cost.',
      seriesConnectionResonance: 'Dark night precursor Book 7; hero burnout realistic; Call refusal classic beat; trauma processing demonstrating; safe house location establishing.',
      sceneCardProgression: 258,
      realWorldContext: 'Drive autonomy/purpose necessity, trauma shutdown, depression realism.',
      timelineSignificance: '6/1/1321 day—weeks after Bologna departure, Francisco deep in apathy safe house, trauma processing through shutdown.',
      saveTheCatBeat: truncate('Call to Adventure - apathy depth established', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'oppressive_stagnant',
        narrative_mode: 'numb_apathetic',
      }),
      learning_objectives: JSON.stringify([
        'Drive autonomy/purpose necessity understanding',
        'Trauma shutdown realistic portrayal',
        'Four of Cups stagnation recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'La Signora offer rejection',
        'Fourth Cup refusal',
        'Call to Adventure resistance',
      ]),
    },
    {
      pages: 'Page 80 - 83',
      description: 'La-Signora map bringing hills-disturbance checking—Francisco pushing-away \'someone-else hero\'—cup offered symbolically rejecting as Fourth-Cup Refusal-Call conflicts resistance re-engaging Friction tense irritation soup-steam rising lips tight map curling table Caretaker worried hero-burnout patient prodding.',
      focus: 'Conflict resisting re-engagement through Call refusal.',
      chapterSceneFocus: 'Ch86S2: La-Signora map hills-disturbance bringing Francisco pushing \'else hero\' cup offered rejecting as Fourth-Cup Refusal-Call conflicts resisting re-engaging Friction tense irritation soup-steam lips tight map curling Caretaker worried burnout patient prods.',
      preliminarySceneFocus: 'Fourth-Cup Refusal conflicts tense',
      preliminarySceneDescription: 'Call resisted re-engagement rejected irritation friction',
      narrativeFunction: 'Demonstrates Fourth Cup refusal; shows Call to Adventure resistance; creates friction with La Signora; establishes classic refusal beat.',
      sensoryDetail: 'La Signora entering, map bringing, hills disturbance, checking suggestion, Francisco pushing away, someone else hero, cup offered symbolically, rejection, Fourth Cup, Refusal Call, soup steam rising, tight lips, map curling table.',
      internalConflict: 'Francisco experiencing irritation—resisting re-engagement, rejecting Fourth Cup offered, wanting someone else to be hero, friction with Caretaker patience.',
      characterGrowthElement: 'Francisco refusing Call to Adventure—rejecting Fourth Cup offered, resisting re-engagement despite La Signora patient prodding, demonstrating classic refusal beat.',
      seriesConnectionResonance: 'Call refusal classic beat; La Signora Caretaker role; hero burnout continuation; safe house tension; friction building re-engagement resistance.',
      sceneCardProgression: 259,
      realWorldContext: 'Call to Adventure refusal, hero burnout resistance, caretaker friction.',
      timelineSignificance: '6/1/1321 afternoon—La Signora attempting engagement, Francisco refusing Call, Fourth Cup rejection demonstrating resistance.',
      saveTheCatBeat: truncate('Call to Adventure - Fourth Cup refused', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'tense_friction',
        narrative_mode: 'irritated_resistant',
      }),
      learning_objectives: JSON.stringify([
        'Call to Adventure refusal beat understanding',
        'Hero burnout resistance recognition',
        'Caretaker friction dynamics',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Village walk coming',
        'Temporal rift anomaly',
        'Child danger spark',
      ]),
    },
    {
      pages: 'Page 83 - 86',
      description: 'Francisco going-out air-fresh flat-smelling—village wandering normal-lives people—alien feeling child ball-chasing ruin old air-shimmering as World-Continuing Glitch sparks anomaly-seeing Inciting-Micro detachment observational Atomic-Habits cue small temporal-rift foreshadowing paradox village-square child danger-approaching.',
      focus: 'Spark seeing anomaly through detachment observation.',
      chapterSceneFocus: 'Ch86S3: Francisco out air-fresh flat village wandering normal-lives alien feeling child ball-chasing ruin air-shimmer as World-Continuing Glitch sparks anomaly-seeing Inciting-Micro detachment observational Atomic-Habits cue small temporal-rift foreshadows paradox child danger approaches.',
      preliminarySceneFocus: 'World-Continuing Glitch sparks detached',
      preliminarySceneDescription: 'Anomaly observed temporal rift foreshadowing detachment',
      narrativeFunction: 'Creates Inciting Incident micro-spark; demonstrates temporal rift anomaly; foreshadows paradox; shows Atomic Habits small cue.',
      sensoryDetail: 'Francisco going out, air fresh, flat smelling, village wandering, normal lives people, alien feeling, child chasing ball, old ruin, air shimmering, World Continuing, Glitch, anomaly, temporal rift, paradox foreshadowing.',
      internalConflict: 'Francisco experiencing detachment—feeling alien among normal lives, observing world continuing without him, noticing temporal anomaly shimmer passively.',
      characterGrowthElement: 'Francisco observing Glitch—seeing temporal rift anomaly through detached observation, Atomic Habits small cue triggering, World Continuing alien feeling demonstrating disconnect.',
      seriesConnectionResonance: 'Temporal rift paradox foreshadowing; Atomic Habits cue establishing; village square location; child character introducing; micro Inciting Incident.',
      sceneCardProgression: 260,
      realWorldContext: 'Atomic Habits small cue recognition, detachment observation, temporal anomaly.',
      timelineSignificance: '6/1/1321 late afternoon—Francisco wandering village detached, temporal rift anomaly observed, child danger approaching spark.',
      saveTheCatBeat: truncate('Call to Adventure - anomaly sparks cue', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'observational_detached',
        narrative_mode: 'alien_noticing',
      }),
      learning_objectives: JSON.stringify([
        'Atomic Habits small cue power',
        'Temporal anomaly recognition',
        'Detachment observation state',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Wall collapse coming',
        'Instinctive action saving',
        'Numbness cracking awakening',
      ]),
    },
    {
      pages: 'Page 86 - 90',
      description: 'Ball shimmer-rolling child running-after—ruin wall collapsing timeline-decay—Francisco thinking-before moving kinetic-blast wall-holding—child ball-grabbing running-out wall dropping—panting feeling something as Spark-Action Awakening breaks apathy Turn adrenaline active dust throat-coating child eyes-wide hand trembling use-not-fear numbness-cracks.',
      focus: 'Action breaking apathy through instinctive saving.',
      chapterSceneFocus: 'Ch86S4: Ball shimmer rolling child running wall collapsing timeline-decay Francisco thinking-before moving kinetic-blast holding child grabbing running wall dropping panting feeling something as Spark-Action Awakening breaks apathy Turn adrenaline active dust throat child eyes hand trembling use numbness-cracks.',
      preliminarySceneFocus: 'Spark-Action Awakening breaks adrenaline',
      preliminarySceneDescription: 'Apathy broken instinct saves feeling something',
      narrativeFunction: 'Breaks apathy through instinctive action; demonstrates numbness cracking; saves child awakening purpose; creates Turn moment.',
      sensoryDetail: 'Ball rolling shimmer, child running after, ruin wall collapsing, timeline decay, Francisco moving before thinking, kinetic blast, wall holding, child grabbing ball, running out, wall dropping, panting, feeling something, dust coating throat, child eyes wide, hand trembling use not fear.',
      internalConflict: 'Francisco experiencing adrenaline—moving before thinking instinctively, feeling something after numbness, hand trembling from use not fear, apathy cracking.',
      characterGrowthElement: 'Francisco awakening through Spark of Action—saving child instinctively breaking Four of Cups apathy, feeling something cracking numbness, hand trembling from magical use awakening purpose.',
      seriesConnectionResonance: 'Numbness cracking awakening; child saved minor character; temporal decay demonstrating; instinctive action breaking apathy; Dark night precursor ending; Call answered.',
      sceneCardProgression: 261,
      realWorldContext: 'Instinctive action over thought, purpose awakening through saving, apathy breaking.',
      timelineSignificance: '6/1/1321 sunset—child saved from temporal rift collapse, Francisco instinctively acting, numbness cracking feeling something, Call to Adventure answered.',
      saveTheCatBeat: truncate('Call to Adventure - child saves awakening', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'active_instinctive',
        narrative_mode: 'adrenaline_awakening',
      }),
      learning_objectives: JSON.stringify([
        'Instinctive action power understanding',
        'Purpose awakening through saving',
        'Apathy breaking recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Re-engagement beginning Chapter 7',
        'Purpose renewed continuing',
        'Temporal investigation starting',
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
        chapterUniqueIdentifier: 'EA-086',
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

  console.log(`\n✅ EA-086 import complete!`);
  console.log(`\n⚡ The numbness has cracked - Francisco feels something again!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
