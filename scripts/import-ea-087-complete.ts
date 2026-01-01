import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-087: Ingenuity (Book 3, Chapter 7)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-087'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-087 not found. Run create-ea-087-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Stuck Village',
      setup: 'They arrive at the village gate. Everything seems normal, then—skip. Like a scratched record. The scene repeats. Francisco checks his pocket watch. It\'s stopped.',
      symbolism: 'The Broken Circle. The Ouroboros.',
      beat_goal: 'The Observation. Identifying the anomaly.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Intrigue',
      scene_tone: 'Surreal',
      timeline_date: '6/2/1321 - Noon (Repeated)',
      timeline_variant: 'Village Gate',
      location: 'Outskirts',
    },
    {
      scene_number: 2,
      scene_title: 'The Analysis',
      setup: 'Francisco sits on a wall, sketching diagrams in the dirt. La Signora calms the panicked Mayor (who remembers the loops). Francisco ignores them. \'It\'s an interference pattern.\' He realizes he needs to create a standing wave to cancel it out.',
      symbolism: 'The Two of Disks (The Lemniscate). Balancing forces.',
      beat_goal: 'The Hypothesis. Formulating a plan.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Focus',
      scene_tone: 'Academic',
      timeline_date: '6/2/1321 - Noon + 10 min',
      timeline_variant: 'Village Square',
      location: 'The Square',
    },
    {
      scene_number: 3,
      scene_title: 'The Experiment',
      setup: 'He needs a catalyst. He positions La Signora at the north end and himself at the south. They must channel energy precisely when the bell strikes. It requires perfect timing. \'Do not improvise,\' he orders her coldly.',
      symbolism: 'The Fulcrum. The scale tipping.',
      beat_goal: 'The Execution. Testing the theory.',
      pov: '3rd Person Limited (La Signora)',
      tense: 'Past Tense',
      core_emotion: 'Determination',
      scene_tone: 'Precise',
      timeline_date: '6/2/1321 - Noon - 1 min',
      timeline_variant: 'Village Square',
      location: 'North/South Axis',
    },
    {
      scene_number: 4,
      scene_title: 'The Balance',
      setup: 'The bell tolls. The wave hits. The air screams. For a second, reality blurs. Francisco holds the two timelines apart (Atlas imagery). He shifts the cart\'s wheel by an inch. The cart passes. Time moves forward. The sun finally sets. He collapses, drained but successful.',
      symbolism: 'Entropy Restored. The Arrow of Time.',
      beat_goal: 'Success. The loop is broken.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Relief',
      scene_tone: 'Triumphant (Quietly)',
      timeline_date: '6/2/1321 - Sunset (Finally)',
      timeline_variant: 'Village Square',
      location: 'The Square',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 91 - 95',
      description: 'Village gate arriving normal-seeming—skip scratched-record repeating Francisco pocket-watch checking stopped—as Broken Circle Ouroboros observes anomaly identifies surreal intrigue Lateral-Thinking pattern-observing loop-recognizing reality-breaking Technician analyzing passion-lacking skill-pure time-stopped temporal-anomaly.',
      focus: 'Observation identifying anomaly through loop recognition.',
      chapterSceneFocus: 'Ch87S1: Village gate normal skip scratched-record repeating Francisco watch checking stopped as Broken Circle Ouroboros observes anomaly identifies surreal intrigue Lateral-Thinking pattern-observing loop-recognizes reality-breaks Technician analyzes passion-lacks skill-pure time-stopped temporal.',
      preliminarySceneFocus: 'Broken Circle Ouroboros surreal intrigue',
      preliminarySceneDescription: 'Loop observes anomaly identifying pattern scratched-record',
      narrativeFunction: 'Establishes temporal loop puzzle; demonstrates Francisco\'s analytical detachment; introduces Two of Disks challenge; creates surreal mystery.',
      sensoryDetail: 'Village gate arriving, normal appearance, skip happening, scratched record effect, scene repeating, Francisco observing, pocket watch checking, stopped time, Broken Circle, Ouroboros symbolism, loop recognition, temporal anomaly.',
      internalConflict: 'Francisco experiencing intrigue—detached curiosity about temporal anomaly, Technician mode analyzing without passion, loop observing systematically.',
      characterGrowthElement: 'Francisco embodying Technician—analyzing temporal loop with cold precision, using Lateral Thinking to observe patterns, working without passion only skill demonstrating magus competence.',
      seriesConnectionResonance: 'Loop theory establishing final boss defeat; temporal mechanics defining universe rules; magus competence demonstrating genius not just blaster; Two of Disks balance theme introducing.',
      sceneCardProgression: 262,
      realWorldContext: 'Lateral Thinking pattern observation, temporal loop mechanics, analytical detachment.',
      timelineSignificance: '6/2/1321 noon—day after child rescue EA-086, Francisco at time-looped village beginning Two of Disks balance challenge, temporal mechanics demonstrating.',
      saveTheCatBeat: truncate('Action - temporal anomaly observed', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'surreal_observation',
        narrative_mode: 'detached_analytical',
      }),
      learning_objectives: JSON.stringify([
        'Lateral Thinking pattern observation mastery',
        'Temporal loop mechanics understanding',
        'Analytical detachment skill demonstration',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Interference pattern analysis',
        'Standing wave solution',
        'Two of Disks balance requirement',
      ]),
    },
    {
      pages: 'Page 95 - 99',
      description: 'Francisco wall sitting dirt-diagrams sketching—La-Signora Mayor calming loops-remembering panicked—Francisco ignoring interference-pattern—standing-wave creating cancel-out realizing as Two Disks Lemniscate balancing-forces hypothesizes plan-formulates academic focus geometric-shapes dirt Mayor-sweat sun-zenith fixed Technician planning passion-lacking.',
      focus: 'Hypothesis formulating plan through interference pattern analysis.',
      chapterSceneFocus: 'Ch87S2: Francisco wall sitting dirt diagrams sketching La-Signora Mayor calming loops-remembering ignoring interference-pattern standing-wave cancel realizing as Two Disks Lemniscate balances-forces hypothesizes plans academic focus geometric dirt sweat sun-zenith Technician plans passion-lacks.',
      preliminarySceneFocus: 'Two Disks Lemniscate balances academic',
      preliminarySceneDescription: 'Analysis hypothesizes plan formulating interference-pattern focused',
      narrativeFunction: 'Demonstrates Two of Disks principle application; shows Francisco ignoring emotional needs focusing on math; creates standing wave solution; establishes La Signora empathy role.',
      sensoryDetail: 'Wall sitting, dirt diagrams sketching, geometric shapes, La Signora presence, Mayor calming, panic remembering, loops recalling, Francisco ignoring, interference pattern identifying, standing wave concept, sun zenith fixed, sweat on Mayor brow.',
      internalConflict: 'Francisco experiencing focus—cold calculation ignoring emotional chaos, Technician solving two-body problem mathematically, La Signora handling people while he handles math.',
      characterGrowthElement: 'Francisco demonstrating Technician detachment—sketching diagrams while Mayor panics showing cold competence, applying Two of Disks balance principle to temporal interference, reliable but emotionally cold.',
      seriesConnectionResonance: 'Two of Disks balance mastery; interference pattern mechanics establishing; La Signora empathy role contrasting Francisco coldness; loop theory developing final boss defeat knowledge.',
      sceneCardProgression: 263,
      realWorldContext: 'Two of Disks balance principle, interference patterns, empathy vs analysis contrast.',
      timelineSignificance: '6/2/1321 noon + 10 min—within loop time, Francisco formulating standing wave solution, Two of Disks principle applying to temporal interference.',
      saveTheCatBeat: truncate('Action - interference pattern solved theoretically', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'academic_planning',
        narrative_mode: 'focused_calculating',
      }),
      learning_objectives: JSON.stringify([
        'Two of Disks balance principle understanding',
        'Interference pattern mechanics',
        'Analytical vs empathy contrast recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Catalyst positioning requirement',
        'Perfect timing necessity',
        'Cold orders to La Signora',
      ]),
    },
    {
      pages: 'Page 99 - 102',
      description: 'Catalyst needing—La-Signora north Francisco south positioning—energy channeling bell-strikes precisely perfect-timing requiring improvise-not—coldly ordering as Fulcrum scale-tipping executes theory-tests precise determination Creative-Confidence rapid-prototyping positioning exact timing-critical Technician commanding emotional-coldness demonstrating.',
      focus: 'Execution testing theory through precise positioning.',
      chapterSceneFocus: 'Ch87S3: Catalyst needing La-Signora north Francisco south positioning energy bell-strikes channeling precisely timing-perfect \'improvise-not\' coldly ordering as Fulcrum scale-tips executes tests precise determination Creative-Confidence prototyping positioning timing Technician commands coldness.',
      preliminarySceneFocus: 'Fulcrum scale-tips precise determined',
      preliminarySceneDescription: 'Execution tests theory positioning precisely commanding',
      narrativeFunction: 'Demonstrates Francisco\'s cold commanding style; shows La Signora POV experiencing orders; creates tension through perfect timing requirement; establishes Creative Confidence rapid prototyping.',
      sensoryDetail: 'Catalyst needing, La Signora positioning north, Francisco positioning south, energy channeling preparation, bell strike timing, perfect precision requirement, do not improvise order, cold commanding, Fulcrum symbolism, scale tipping.',
      internalConflict: 'La Signora experiencing determination—following Francisco\'s cold orders precisely, trusting his genius despite emotional distance, executing without improvisation under pressure.',
      characterGrowthElement: 'Francisco demonstrating cold Technician command—ordering La Signora without warmth showing reliable competence lacking passion, applying Creative Confidence through rapid prototyping experimentation, demanding precision.',
      seriesConnectionResonance: 'La Signora partnership establishing through contrasting warmth; Francisco emotional coldness demonstrating post-trauma shutdown; Creative Confidence skill showing; loop solution executing.',
      sceneCardProgression: 264,
      realWorldContext: 'Creative Confidence rapid prototyping, precise execution, cold leadership.',
      timelineSignificance: '6/2/1321 noon - 1 min—moments before bell strike, Francisco and La Signora positioning for precise energy channeling, loop breaking attempt executing.',
      saveTheCatBeat: truncate('Action - theory executed with precision', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'precise_execution',
        narrative_mode: 'determined_focused',
      }),
      learning_objectives: JSON.stringify([
        'Creative Confidence rapid prototyping execution',
        'Precise timing critical importance',
        'Cold leadership effectiveness vs warmth',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Bell tolling climax',
        'Reality blurring',
        'Atlas imagery timeline holding',
      ]),
    },
    {
      pages: 'Page 102 - 105',
      description: 'Bell tolls wave hits air screams—reality blurs second—Francisco timelines-two apart-holding Atlas-imagery—cart-wheel inch shifting passes—time forward-moves sun sets-finally—collapsing drained successful as Entropy-Restored Arrow-Time success loop-broken quietly-triumphant relief shadow-long stretching hands-dusting birds-sounding time-flowing Technician succeeding dry-satisfaction.',
      focus: 'Success breaking loop through entropy restoration.',
      chapterSceneFocus: 'Ch87S4: Bell tolls wave hits air screams reality blurs Francisco timelines-two apart-holds Atlas cart-wheel inch shifts passes time forward sun sets-finally collapses drained successful as Entropy-Restored Arrow-Time success loop-breaks quietly-triumphant relief shadow stretches hands-dust birds-sound time-flows Technician succeeds dry.',
      preliminarySceneFocus: 'Entropy-Restored Arrow-Time quietly-triumphant relief',
      preliminarySceneDescription: 'Success breaks loop restoring time triumphantly drained',
      narrativeFunction: 'Resolves temporal loop puzzle; demonstrates Atlas burden imagery; shows dry satisfaction not joy; establishes time flowing restoration through sound and shadow.',
      sensoryDetail: 'Bell tolling, wave hitting, air screaming, reality blurring, timelines holding apart, Atlas imagery, cart wheel shifting inch, cart passing, time moving forward, sun finally setting, collapsing drained, long shadow stretching, hands dusting, birds suddenly sounding.',
      internalConflict: 'Francisco experiencing relief—dry satisfaction from competent work without passion, drained from holding timelines apart, successful but emotionally cold Technician mode.',
      characterGrowthElement: 'Francisco achieving Two of Disks balance—juggling two timelines successfully through precise adjustment, feeling dry satisfaction demonstrating emotional shutdown, working reliably without passion showing trauma aftermath.',
      seriesConnectionResonance: 'Loop theory mastered informing final boss strategy; Atlas burden imagery foreshadowing series weight; dry satisfaction contrasting earlier passion showing trauma impact; time flow restoration symbolizing hope.',
      sceneCardProgression: 265,
      realWorldContext: 'Two of Disks balance mastery, competence without passion, trauma emotional impact.',
      timelineSignificance: '6/2/1321 sunset (finally)—loop broken after being stuck at noon, time flowing forward restored, Francisco successful but emotionally hollow demonstrating trauma shutdown.',
      saveTheCatBeat: truncate('Action - loop broken success achieved', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'triumphant_quiet',
        narrative_mode: 'relieved_drained',
      }),
      learning_objectives: JSON.stringify([
        'Two of Disks balance principle mastery',
        'Success without passion recognition',
        'Trauma emotional shutdown impact understanding',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Competence without passion continuing',
        'La Signora concern for emotional state',
        'Dry satisfaction replacing joy pattern',
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
        chapterUniqueIdentifier: 'EA-087',
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

  console.log(`\n✅ EA-087 import complete!`);
  console.log(`\n⚖️ The Two of Disks balance achieved - the loop is broken, time flows again!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
