import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-082: Disruption (Book 3, Chapter 2)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-082'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-082 not found. Run create-ea-082-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Invitation',
      setup: 'The carriage ride. Silence. The Swiss Guard is armed with plasma pikes (anachronism). Francisco realizes this isn\'t a social call. He tries to use magic; dampeners in the carriage block him. He is powerless.',
      symbolism: 'The Cage. The blocking of the Ace (power).',
      beat_goal: 'The Reality Check. Establishing vulnerability.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Anxiety',
      scene_tone: 'Claustrophobic',
      timeline_date: '5/8/1321 - Night',
      timeline_variant: 'The Carriage',
      location: 'Streets of Bologna',
    },
    {
      scene_number: 2,
      scene_title: 'The Offer',
      setup: 'Colonna\'s study. He pours wine. He talks about \'Order\'. He reveals the Church\'s secret: they prune timelines to keep the \'Sacred Timeline\' pure. He wants Francisco to be the Pruner. \'You have the talent. We have the mandate.\' It is seductive. Order vs Chaos.',
      symbolism: 'The Apple. The High Mountain.',
      beat_goal: 'The Proposal. The villain makes sense.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Temptation',
      scene_tone: 'Seductive',
      timeline_date: '5/9/1321 - Late Night',
      timeline_variant: 'Colonna Palace',
      location: 'The Cardinal\'s Study',
    },
    {
      scene_number: 3,
      scene_title: 'The Planning',
      setup: 'Francisco is released. He returns to Novella. They pace the floor (Two of Wands pacing). \'If I say no, they kill me. If I say yes, they own me.\' He looks at the wand in his hand. He needs a third option. He needs to Disrupt the game.',
      symbolism: 'The Crossroads. The Two Wands planted in the ground.',
      beat_goal: 'The Debate. Weighing options.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Desperation',
      scene_tone: 'Frenetic',
      timeline_date: '5/9/1321 - Early Morning',
      timeline_variant: 'Francisco\'s Apartment',
      location: 'Home',
    },
    {
      scene_number: 4,
      scene_title: 'The Choice',
      setup: 'Dawn. The 24 hours are ticking. Francisco decides. He won\'t join, and he won\'t run. He will *infiltrate*. He will accept the offer to destroy it from within. It is a dangerous path. He tells Novella: \'I\'ll take their wand. And I\'ll use it to burn their map.\'',
      symbolism: 'The Trojan Horse. The decision made.',
      beat_goal: 'Resolution (of the scene). The plan is set.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Resolve',
      scene_tone: 'Grim',
      timeline_date: '5/9/1321 - Dawn',
      timeline_variant: 'Francisco\'s Apartment',
      location: 'Home',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 16 - 20',
      description: 'Carriage riding silence—Swiss Guard plasma pikes armed anachronism—Francisco social-call realizing not—magic trying dampeners blocking powerless as Cage Ace-power blocking reality-checks establishing vulnerability transport anxious claustrophobic Innovator DNA constraints questioning forced carriage Inciting Incident begins.',
      focus: 'Reality check establishing vulnerability through power blocking.',
      chapterSceneFocus: 'Ch82S1: Carriage silence Guard pikes armed—Francisco social-not realizing magic-trying dampeners blocking powerless as Cage Ace-blocking reality-checks vulnerability transport anxious claustrophobic constraints questioning forced Inciting begins.',
      preliminarySceneFocus: 'Cage blocks Ace powerless anxious',
      preliminarySceneDescription: 'Vulnerability established constraints questioned claustrophobic',
      narrativeFunction: 'Establishes vulnerability; demonstrates power blocking; transports to confrontation; begins Inciting Incident.',
      sensoryDetail: 'Carriage riding, silence, Swiss Guard, plasma pikes, anachronism, social call recognition, magic attempting, dampeners blocking, powerlessness, cage feeling, Ace power blocked.',
      internalConflict: 'Francisco experiencing anxiety—realizing loss of power, recognizing serious threat, feeling trapped and vulnerable.',
      characterGrowthElement: 'Francisco confronting vulnerability—losing Ace power temporarily, questioning constraints through Innovator DNA methodology, forced into big leagues.',
      seriesConnectionResonance: 'Vatican Temporal Authority introduction; power dampening demonstrating; vulnerability establishing; Faustian bargain setup; political landscape revealing.',
      sceneCardProgression: 242,
      realWorldContext: 'Innovator DNA questioning constraints, vulnerability recognition, power loss.',
      timelineSignificance: '5/8/1321 night—Cardinal summoning Francisco to Palace, power blocked establishing vulnerability, Inciting Incident beginning.',
      saveTheCatBeat: truncate('Inciting Incident - summoned powerless', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'claustrophobic_tension',
        narrative_mode: 'anxious_vulnerability',
      }),
      learning_objectives: JSON.stringify([
        'Innovator DNA questioning constraints',
        'Vulnerability recognition necessity',
        'Power loss coping strategies',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Faustian bargain offer',
        'Timeline pruning revelation',
        'Order vs Chaos choice',
      ]),
    },
    {
      pages: 'Page 20 - 24',
      description: 'Colonna study wine-pouring Order-talking—Church secret revealing timelines pruning Sacred-Timeline pure-keeping—Pruner wanting Francisco \'talent mandate\'—seductive Order-Chaos as Apple High Mountain proposes villain-makes-sense temptation seductive wine-swirling history-map erased fireplace-heat Creative Confidence uncertainty embracing.',
      focus: 'Proposal making villain sense through seductive offer.',
      chapterSceneFocus: 'Ch82S2: Colonna study wine Order-talking Church revealing timelines pruning Sacred pure—Pruner wanting \'talent mandate\' seductive Order-Chaos as Apple Mountain proposes villain-sense temptation wine-swirling map-erased fireplace Creative uncertainty embraces.',
      preliminarySceneFocus: 'Apple Mountain tempts seductively villain-sense',
      preliminarySceneDescription: 'Order-Chaos choice seduces pruning revelation tempts',
      narrativeFunction: 'Reveals Vatican Temporal Authority; demonstrates timeline pruning; makes villain sympathetic; creates seductive temptation.',
      sensoryDetail: 'Colonna study, wine pouring, Order discussion, Church secret, timelines pruning, Sacred Timeline, pure keeping, Pruner role, talent mandate, seductive presentation, Order vs Chaos, wine swirling, history map, erased timelines, fireplace heat.',
      internalConflict: 'Francisco experiencing temptation—hearing seductive logic, seeing power offered, recognizing villain makes sense, feeling dread and ambition.',
      characterGrowthElement: 'Francisco facing Two of Wands choice—standing on parapet looking at world offered, confronting Order vs Chaos decision, embracing uncertainty through Creative Confidence.',
      seriesConnectionResonance: 'Faustian bargain core offer; Temporal Compact laws Book 5 setup; timeline pruning revealing; Sacred Timeline concept; political landscape establishing.',
      sceneCardProgression: 243,
      realWorldContext: 'Creative Confidence embracing uncertainty, Order vs Chaos philosophy, seductive power.',
      timelineSignificance: '5/9/1321 late night—Colonna revealing timeline pruning secret, offering Pruner role, creating Two of Wands choice confrontation.',
      saveTheCatBeat: truncate('Inciting Incident - Faustian bargain offered', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'seductive_temptation',
        narrative_mode: 'dread_ambition_mix',
      }),
      learning_objectives: JSON.stringify([
        'Creative Confidence uncertainty embracing',
        'Order vs Chaos philosophical choice',
        'Seductive villain logic recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Deliberation with Novella',
        'Third option seeking',
        'Infiltration decision',
      ]),
    },
    {
      pages: 'Page 24 - 27',
      description: 'Francisco released returning Novella—floor pacing Two Wands—\'no kills yes owns\'—wand hand-holding third-option needing Disrupt-game as Crossroads Two Wands planted-ground debates weighing-options deliberation desperate frenetic Originals status-quo challenging breaking routines adaptability.',
      focus: 'Debate weighing options through deliberation desperation.',
      chapterSceneFocus: 'Ch82S3: Francisco released Novella returning floor-pacing Two Wands \'no kills yes owns\' wand-holding third-option Disrupt-game as Crossroads planted debates weighing deliberation desperate frenetic Originals status-quo challenges breaks routines adapts.',
      preliminarySceneFocus: 'Crossroads Wands debate desperate frenetic',
      preliminarySceneDescription: 'Third option sought status-quo challenged desperately',
      narrativeFunction: 'Demonstrates Two of Wands deliberation; shows Novella as Voice of Caution; creates desperate search for third option.',
      sensoryDetail: 'Francisco released, Novella returning, floor pacing, Two Wands, no kills declaration, yes owns warning, wand in hand, third option need, Disrupt game, Crossroads, Two Wands planted, ground decision.',
      internalConflict: 'Francisco experiencing desperation—recognizing no-win binary choice, seeking third option, needing to Disrupt the game, feeling trapped.',
      characterGrowthElement: 'Francisco embodying Two of Wands Crossroads—pacing deliberation, challenging status quo through Originals methodology, breaking routines for adaptability, seeking disruption.',
      seriesConnectionResonance: 'Disruption adaptability demonstrating; breaking routines establishing; status quo challenging; third option seeking; Novella caution voice.',
      sceneCardProgression: 244,
      realWorldContext: 'Originals challenging status quo, disruption methodology, flexible thinking.',
      timelineSignificance: '5/9/1321 early morning—Francisco deliberating with Novella, seeking third option beyond binary choice, Disruption methodology applying.',
      saveTheCatBeat: truncate('Inciting Incident - seeking third option', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'frenetic_deliberation',
        narrative_mode: 'desperate_seeking',
      }),
      learning_objectives: JSON.stringify([
        'Originals status quo challenging',
        'Disruption flexible thinking cultivation',
        'Third option creative problem-solving',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Infiltration decision',
        'Trojan Horse strategy',
        'Burning the map plan',
      ]),
    },
    {
      pages: 'Page 27 - 30',
      description: 'Dawn 24-hours ticking—Francisco deciding won\'t-join won\'t-run will-infiltrate—accept-offer destroy-from-within dangerous-path—Novella telling \'take wand burn map\' as Trojan Horse decision-made resolves scene-plan set grim resolve sun-rising rooftops packing jaw-set Disruptive Questioning breakthrough.',
      focus: 'Resolution setting plan through infiltration decision.',
      chapterSceneFocus: 'Ch82S4: Dawn 24-hours deciding won\'t-join/run will-infiltrate—accept destroy-within dangerous Novella \'wand-take map-burn\' as Trojan Horse decision resolves plan-set grim resolve sun-rising packing jaw-set Disruptive breakthrough questions fuel.',
      preliminarySceneFocus: 'Trojan Horse resolves grim decision',
      preliminarySceneDescription: 'Infiltration plan set destroying-within dangerously resolved',
      narrativeFunction: 'Resolves Inciting Incident; establishes infiltration strategy; demonstrates Disruptive Questioning; sets dangerous path.',
      sensoryDetail: 'Dawn arrival, 24 hours ticking, Francisco deciding, won\'t join, won\'t run, will infiltrate, accept offer, destroy from within, dangerous path, Novella telling, take wand, burn map, sun rising, red rooftops, packing bag, jaw set grim.',
      internalConflict: 'Francisco experiencing resolve—choosing dangerous infiltration path, accepting risk to destroy from within, setting grim determination.',
      characterGrowthElement: 'Francisco making Two of Wands choice—choosing infiltration as third option, using Disruptive Questioning to fuel breakthrough, embracing uncertainty with resolve.',
      seriesConnectionResonance: 'Infiltration strategy establishing; Trojan Horse approach; Faustian bargain acceptance with subversion; Disruptive Questioning breakthrough; dangerous path Book 3.',
      sceneCardProgression: 245,
      realWorldContext: 'Disruptive Questioning breakthrough methodology, infiltration strategy, dangerous resolve.',
      timelineSignificance: '5/9/1321 dawn—Francisco choosing infiltration strategy, accepting Cardinal offer to destroy from within, Inciting Incident resolved with dangerous path set.',
      saveTheCatBeat: truncate('Inciting Incident - infiltration chosen', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'grim_resolution',
        narrative_mode: 'resolved_determination',
      }),
      learning_objectives: JSON.stringify([
        'Disruptive Questioning fueling breakthroughs',
        'Infiltration strategy development',
        'Dangerous path acceptance resolve',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Church infiltration Book 3',
        'Map burning symbolism',
        'Dangerous path consequences',
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
        chapterUniqueIdentifier: 'EA-082',
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

  console.log(`\n✅ EA-082 import complete!`);
  console.log(`\n🎭 The Faustian bargain is set - Francisco chooses infiltration!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
