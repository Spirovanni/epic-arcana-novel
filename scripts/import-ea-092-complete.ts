import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-092: Abundance (Book 3, Chapter 12)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-092'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-092 not found. Run create-ea-092-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Ambush',
      setup: 'Forest Road. The team is in position. Francisco signals. It\'s not a battle; it\'s a surgical strike. They disable the wheels. They disarm the guards. \'Go home,\' Francisco tells the guards. \'Tell your Bishop we thank him for the donation.\'',
      symbolism: 'The Harvest. Reaping rewards.',
      beat_goal: 'The Victory. Securing abundance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Competence',
      scene_tone: 'Action/Light',
      timeline_date: '6/7/1321 - Day',
      timeline_variant: 'Forest',
      location: 'Road',
    },
    {
      scene_number: 2,
      scene_title: 'The Return',
      setup: 'Rolling the wagons into the Sanctuary. The cheers of the 12. Unloading the casks. The smell of bread baking. Francisco feels the tension of EA-090 melting away.',
      symbolism: 'The Full Cup.',
      beat_goal: 'The Relief. tangible rewards.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Validaton',
      scene_tone: 'Happy',
      timeline_date: '6/7/1321 - Evening',
      timeline_variant: 'Sanctuary',
      location: 'Courtyard',
    },
    {
      scene_number: 3,
      scene_title: 'The Toast',
      setup: 'The Feast. Francisco stands up. He raises his cup (Three of Cups). He looks at his \'Essential\' team. \'To those we lost, and those we found.\' They drink. Bonds are forged here that will last until death.',
      symbolism: 'The Three of Cups (Community).',
      beat_goal: 'The Connection. Solidifying the team.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Love',
      scene_tone: 'Warm',
      timeline_date: '6/7/1321 - Night',
      timeline_variant: 'Sanctuary',
      location: 'Mess Hall',
    },
    {
      scene_number: 4,
      scene_title: 'The Aftermath',
      setup: 'Late night. The fire is dying. Francisco and the Twin Scholars look at the stars. They talk about the future, not with fear (as in EA-086) but with hope. \'We can actually do this,\' Francisco whispers.',
      symbolism: 'The Stars. Limitless possibility.',
      beat_goal: 'The Hope. Forward momentum.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Peace',
      scene_tone: 'Quiet',
      timeline_date: '6/7/1321 - Late Night',
      timeline_variant: 'Sanctuary',
      location: 'Roof',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 166 - 170',
      description: 'Forest road team-positioned Francisco signaling—not-battle surgical-strike wheels-disabling guards-disarming Go-home telling Bishop-thank-donation as Harvest rewards-reaping victory abundance-securing competence action-light 7-Habits Win-Win thinking EA-091-scroll intel-using convoy-intercepting team-competence.',
      focus: 'Victory securing abundance through surgical raid.',
      chapterSceneFocus: 'Ch92S1: Forest road team-positioned Francisco signaling not-battle surgical-strike wheels-disabling guards-disarming Go-home telling Bishop-thank-donation as Harvest rewards-reaping victory abundance-secures competence action-light 7-Habits Win-Win thinking EA-091-scroll intel convoy-intercepts team-competence.',
      preliminarySceneFocus: 'Harvest rewards-reaping competence action-light',
      preliminarySceneDescription: 'Ambush victory abundance securing surgically competent',
      narrativeFunction: 'Demonstrates Three of Cups abundance beginning through successful raid; shows 7 Habits Win-Win thinking guards released; establishes EA-091 Courage scroll intel payoff; creates team competence surgical strike execution.',
      sensoryDetail: 'Forest road setting, team positioned, Francisco signaling, not battle choice, surgical strike precision, wheels disabling, guards disarming, Go home command, Bishop thank donation message, Harvest symbolism, rewards reaping, victory moment, abundance securing.',
      internalConflict: 'Francisco experiencing competence—executing surgical raid successfully using EA-091 scroll intelligence, choosing Win-Win releasing guards not killing, securing abundance wagons for sanctuary team.',
      characterGrowthElement: 'Francisco becoming Provider—using Seven of Swords stolen intel successfully raiding Vatican convoy, applying 7 Habits Win-Win principle releasing guards peacefully, securing Three of Cups abundance resources demonstrating team competence leadership.',
      seriesConnectionResonance: 'EA-091 scroll intelligence payoff; EA-090 Removal decision validating through abundance feeding core twelve; Three of Cups celebration beginning; toast final book recalling; team dynamics demonstrating Francisco following reason.',
      sceneCardProgression: 282,
      realWorldContext: '7 Habits Win-Win thinking application, surgical precision execution, abundance mindset.',
      timelineSignificance: '6/7/1321 day—day after EA-091 Seven Swords heist, Francisco using stolen scroll intel raiding Vatican convoy successfully, securing abundance wagons Three of Cups celebration beginning.',
      saveTheCatBeat: truncate('Allies Mentors - raid won abundance secured', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'action_light_surgical',
        narrative_mode: 'competent_victorious',
      }),
      learning_objectives: JSON.stringify([
        '7 Habits Win-Win thinking mastery',
        'Surgical precision raid execution',
        'Abundance mindset securing resources',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Wagons sanctuary rolling',
        'Twelve cheering return',
        'EA-090 tension melting',
      ]),
    },
    {
      pages: 'Page 170 - 174',
      description: 'Wagons sanctuary-rolling twelve-cheering—casks unloading bread-smell baking EA-090-tension melting-away as Full-Cup relief tangible-rewards validation happy bread-golden-crust wine-red-pouring firelight-smiling party-setup morale-refilling emotional-tank Provider people-happy.',
      focus: 'Relief experiencing tangible rewards through wagon return.',
      chapterSceneFocus: 'Ch92S2: Wagons sanctuary-rolling twelve-cheering casks unloading bread-smell baking EA-090-tension melting-away as Full-Cup relief tangible-rewards validation happy bread-golden-crust wine-red-pouring firelight-smiling party-setup morale-refills emotional-tank Provider people-happy.',
      preliminarySceneFocus: 'Full-Cup relief validation happy',
      preliminarySceneDescription: 'Return relieves tangible rewards validating happily',
      narrativeFunction: 'Demonstrates Full Cup tangible rewards arrival; shows EA-090 Three Swords tension melting through abundance; creates party setup atmosphere golden bread wine pouring; establishes morale refilling emotional tank group.',
      sensoryDetail: 'Wagons rolling, sanctuary entrance, twelve members cheering, casks unloading, bread smell baking, EA-090 tension melting, Full Cup symbolism, relief feeling, tangible rewards, validation experiencing, happy atmosphere, bread golden crust, wine red pouring, firelight on smiling faces.',
      internalConflict: 'Francisco experiencing validation—seeing EA-090 Removal decision justified through abundance feeding core twelve, feeling tension melting away replaced by joy, witnessing people happy for first time providing relief.',
      characterGrowthElement: 'Francisco achieving Provider satisfaction—bringing abundance resources sanctuary after EA-090 painful separation, seeing tangible rewards morale refilling emotional tank, experiencing validation people happy justifying Removal decision leadership.',
      seriesConnectionResonance: 'EA-090 Removal decision validation; morale emotional tank refilling demonstrating; Three of Cups feast preparing; team dynamics Francisco following showing; abundance mindset shift from scarcity survival.',
      sceneCardProgression: 283,
      realWorldContext: 'Abundance mindset shift scarcity, morale emotional tank refilling, tangible rewards validation.',
      timelineSignificance: '6/7/1321 evening—same day after forest raid, Francisco returning sanctuary with abundance wagons, twelve cheering EA-090 tension melting, Three of Cups feast preparing morale restored.',
      saveTheCatBeat: truncate('Allies Mentors - returned morale restored', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'happy_celebratory',
        narrative_mode: 'validated_relieved',
      }),
      learning_objectives: JSON.stringify([
        'Abundance mindset shift from scarcity',
        'Morale emotional tank refilling importance',
        'Tangible rewards validation power',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Feast Francisco standing',
        'Cup raising Three Cups',
        'Toast those lost found',
      ]),
    },
    {
      pages: 'Page 174 - 177',
      description: 'Feast Francisco standing-up cup-raising Three-Cups—Essential-team looking To-those-lost-those-found toasting drinking—bonds death-lasting forging as Three-Cups Community connection team-solidifying love warm Abundance-Book gratitude Midpoint-High joy-fighting-for celebration toast-final-book-recalls.',
      focus: 'Connection solidifying team through Three Cups toast.',
      chapterSceneFocus: 'Ch92S3: Feast Francisco standing cup-raising Three-Cups Essential-team looking To-those-lost-those-found toasting drinking bonds death-lasting forging as Three-Cups Community connection team-solidifies love warm Abundance-Book gratitude Midpoint-High joy-fighting celebration toast-final-book-recalls.',
      preliminarySceneFocus: 'Three-Cups Community love warm',
      preliminarySceneDescription: 'Toast connects team solidifying bonds loving warmly',
      narrativeFunction: 'Climaxes Three of Cups celebration community connection; demonstrates Abundance Book gratitude practice toast those lost found; shows bonds forging lasting until death team solidification; establishes Midpoint High joy what fighting for realization.',
      sensoryDetail: 'Feast setting, Francisco standing up, cup raising, Three of Cups moment, Essential team looking, To those we lost and those we found toast, drinking together, bonds forging, death lasting commitment, Community symbolism, connection deepening, team solidifying, love feeling, warm atmosphere.',
      internalConflict: 'Francisco experiencing love—toasting Essential team realizing bonds forging lasting death, feeling gratitude those lost honoring those found celebrating, understanding joy not just survival what fighting for Community connection.',
      characterGrowthElement: 'Francisco embodying Provider leader—raising Three of Cups toast Essential team celebrating abundance, applying Abundance Book gratitude principle honoring lost celebrating found, realizing Midpoint High joy life not just survival what Community fighting for.',
      seriesConnectionResonance: 'Toast final book before end recalling establishing; Three of Cups Community bonds death lasting forging; Midpoint High joy fighting for defining; team dynamics solidifying Francisco leadership; abundance gratitude celebrating shift scarcity.',
      sceneCardProgression: 284,
      realWorldContext: 'Abundance Book gratitude practice, Three of Cups community celebration, bonds forging commitment.',
      timelineSignificance: '6/7/1321 night—feast evening, Francisco raising Three of Cups toast Essential team, celebrating abundance Community connection, Midpoint High joy fighting for realizing bonds death lasting forging.',
      saveTheCatBeat: truncate('Allies Mentors - bonds forged joy realized', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'warm_celebratory',
        narrative_mode: 'loving_grateful',
      }),
      learning_objectives: JSON.stringify([
        'Abundance Book gratitude practice mastery',
        'Three of Cups community celebration',
        'Bonds forging lasting commitment',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Stars looking future discussing',
        'Hope not fear speaking',
        'We can do this believing',
      ]),
    },
    {
      pages: 'Page 177 - 180',
      description: 'Late night fire-dying—Francisco Twin-Scholars stars-looking future-talking fear-not hope—We-can-do-this whispering as Stars Limitless-possibility hope forward-momentum peace quiet laughter-fading sky-vastness smiling-forcing-without bridge-Ch13 Abundance-mindset EA-086-contrast.',
      focus: 'Hope building forward momentum through stars future.',
      chapterSceneFocus: 'Ch92S4: Late night fire-dying Francisco Twin-Scholars stars-looking future-talking fear-not hope We-can-do-this whispering as Stars Limitless-possibility hope forward-momentum peace quiet laughter-fading sky-vastness smiling-forcing-without bridge-Ch13 Abundance-mindset EA-086-contrast.',
      preliminarySceneFocus: 'Stars Limitless-possibility peace quiet',
      preliminarySceneDescription: 'Aftermath hopes forward peacefully quietly believing',
      narrativeFunction: 'Resolves Three of Cups celebration with peaceful hope; demonstrates EA-086 Apathy contrast hope not fear future discussing; shows limitless possibility Stars symbolism forward momentum; bridges to Chapter 13 continuing mission readiness.',
      sensoryDetail: 'Late night timing, fire dying down, Francisco presence, Twin Scholars companionship, stars looking up, future discussing, fear absence, hope presence, We can actually do this whisper, Stars symbolism, limitless possibility, laughter fading silence, sky vastness, smiling without forcing, peaceful atmosphere.',
      internalConflict: 'Francisco experiencing peace—discussing future with hope not fear contrasting EA-086 Apathy, believing we can actually do this mission possible, smiling genuinely without forcing showing emotional health restoration abundance mindset.',
      characterGrowthElement: 'Francisco completing Provider transformation—experiencing Three of Cups aftermath peaceful hope discussing future, contrasting EA-086 Four Cups Apathy numbness with Stars limitless possibility belief, achieving emotional health smiling genuinely abundance mindset established mission ready.',
      seriesConnectionResonance: 'EA-086 Apathy contrast demonstrating growth; Stars limitless possibility establishing hope; Chapter 13 bridge continuing mission; abundance mindset scarcity shift completing; emotional health restoration showing; team dynamics solidified ready.',
      sceneCardProgression: 285,
      realWorldContext: 'Abundance mindset completion, hope forward momentum, emotional health restoration.',
      timelineSignificance: '6/7/1321 late night—feast aftermath, Francisco with Twin Scholars stars looking, discussing future hope not fear, believing mission possible abundance mindset established Chapter 13 ready.',
      saveTheCatBeat: truncate('Allies Mentors - hope established ready forward', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'quiet_peaceful',
        narrative_mode: 'hopeful_peaceful',
      }),
      learning_objectives: JSON.stringify([
        'Abundance mindset completion mastery',
        'Hope forward momentum building',
        'Emotional health restoration recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Chapter 13 mission continuing',
        'Team ready solidified',
        'Abundance mindset maintained',
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
        chapterUniqueIdentifier: 'EA-092',
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

  console.log(`\n✅ EA-092 import complete!`);
  console.log(`\n🍷 The Three of Cups celebration - Abundance, Community, and Joy realized!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
