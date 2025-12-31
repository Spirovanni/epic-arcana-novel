import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-075: New Business (Book 2, Chapter 35)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-075'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-075 not found. Run create-ea-075-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Landing',
      setup: 'The ships impact the \'Raw\' timeline. No explosion, just a heavy *thud* as physics assert themselves. They step out. The sky is purple static. The ground is shifting sand-glass. It is alien. Supplies are ruined. They have nothing. Francisco holds the Ace of Disks (metaphorical seed). \'We don\'t need supplies. We need to Make.\'',
      symbolism: 'The Shipwreck. Robinson Crusoe. The blank canvas.',
      beat_goal: 'The Crash. Assess the lack of resources.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Shock',
      scene_tone: 'Surreal',
      timeline_date: '10/30/1320 - Afternoon',
      timeline_variant: 'The Raw Zone',
      location: 'Crash Site',
    },
    {
      scene_number: 2,
      scene_title: 'The MVP',
      setup: 'Night is falling. The temperature drops to freezing. They need shelter *now*. Francisco outlines the MVP (Minimum Viable Product): A wall that stops wind. Not a fortress, just a wall. They use ship debris. It\'s ugly. It\'s barely standing. But it blocks the wind. It proves they can change this world. \'It\'s a start.\'',
      symbolism: 'The First Brick. The crude tool. The shift from Thinking to Doing.',
      beat_goal: 'The First Success. Proving viability.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Determined',
      scene_tone: 'Gritty',
      timeline_date: '10/30/1320 - Evening',
      timeline_variant: 'The Windbreak',
      location: 'Base Zero',
    },
    {
      scene_number: 3,
      scene_title: 'The Pivot',
      setup: 'The wall attracts \'void predators\' (energy leeches). The initial plan (Defense) made them a target. Francisco realizes they need to Pivot. \'Don\'t block the wind; use it.\' They reconfigure the debris into windmills/generators. The predators lose interest when the energy flows instead of stagnates. They turn the threat into a resource.',
      symbolism: 'Turning the sail. The Pivot. The Ace of Disks spinning.',
      beat_goal: 'The Iteration. Adapting to feedback.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Ingenuity',
      scene_tone: 'Active',
      timeline_date: '10/31/1320 - Early Morning',
      timeline_variant: 'The Generator',
      location: 'Base Zero',
    },
    {
      scene_number: 4,
      scene_title: 'The Seed',
      setup: 'Morning. The camp is ugly but functional. Power is humming. People are eating synthesized rations. Francisco plants a flag—not of conquest, but of foundation. He feels the Ace of Disks solidify. They have \'product-market fit\' with this reality. They can survive here. But can they leave?',
      symbolism: 'The Flag. The Hearth. The realization that they are no longer victims.',
      beat_goal: 'Resolution. Survival is secured.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Pride',
      scene_tone: 'Hopeful',
      timeline_date: '10/31/1320 - Afternoon',
      timeline_variant: 'The Camp',
      location: 'Base Zero',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 511 - 515',
      description: 'Ships impacting Raw timeline with heavy thud physics asserting—stepping out to purple static sky, shifting sand-glass ground—alien environment with ruined supplies having nothing—Francisco holding Ace Disks metaphorical seed declaring \"We don\'t need supplies. We need to Make\" assessing resource lack through Shipwreck Robinson Crusoe blank canvas crash reset shocking surreally.',
      focus: 'Crash assessing resource lack through blank canvas reset.',
      chapterSceneFocus: 'Ch75S1: Raw timeline impact heavy thud—purple static sky sand-glass ground alien—ruined supplies nothing—Francisco Ace Disks seed \"Need to Make\" assessing lack as Shipwreck Crusoe canvas crash resets shock surreal zero-resource.',
      preliminarySceneFocus: 'Shipwreck canvas resets zero shock',
      preliminarySceneDescription: 'Maker mindset replaces supply dependency surreally',
      narrativeFunction: 'Establishes Ace of Disks zero-point; demonstrates maker mindset over consumer mindset; resets survival challenge.',
      sensoryDetail: 'Ship impact, Raw timeline, heavy thud, physics assertion, purple static sky, shifting sand-glass ground, alien environment, ruined supplies, nothing having, Ace Disks holding, Make declaration, sand climbing boots, bird-wind silence, breath fogging strange air.',
      internalConflict: 'Francisco experiencing shock while immediately pivoting to maker mindset—accepting zero resources as creative opportunity.',
      characterGrowthElement: 'Francisco embracing Ace of Disks pure potential—becoming Maker/Founder, shifting from resource dependency to creative agency in void.',
      seriesConnectionResonance: 'Zero to One void creation; Ace energy for finale; rapid prototyping foundation for Book 3 Ark; survival mechanics establishing.',
      sceneCardProgression: 214,
      realWorldContext: 'Zero-based thinking, maker mindset, resource independence.',
      timelineSignificance: '10/30/1320 afternoon—crash into Raw timeline requiring entrepreneurial survival iteration from absolute zero.',
      saveTheCatBeat: truncate('Finale - zero-point crash requires making', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'surreal_shock',
        narrative_mode: 'creative_desperation',
      }),
      learning_objectives: JSON.stringify([
        'Zero to One void creation',
        'Maker over consumer mindset',
        'Resource independence thinking',
      ]),
      foreshadowing_elements: JSON.stringify([
        'MVP shelter building',
        'Lean Startup iteration',
        'First success proving viability',
      ]),
    },
    {
      pages: 'Page 515 - 518',
      description: 'Night falling temperature freezing requiring shelter now—Francisco outlining MVP Minimum Viable Product wall stopping wind not fortress—using ship debris ugly barely standing—blocking wind proving world-change capability \"It\'s a start\" as First Brick crude tool shifts Thinking to Doing proving viability gritty determined first success build.',
      focus: 'First Success proving viability through MVP thinking.',
      chapterSceneFocus: 'Ch75S2: Freezing night requiring now-shelter—Francisco MVP wall not fortress from debris ugly standing—wind-blocking proving world-change \"start\" as First Brick crude tool Thinking-to-Doing viability gritty build determined first success.',
      preliminarySceneFocus: 'First Brick proves Doing viability',
      preliminarySceneDescription: 'MVP wall demonstrates world-change capability gritty',
      narrativeFunction: 'Demonstrates Lean Startup MVP methodology; proves viability through minimal success; shifts from planning to execution.',
      sensoryDetail: 'Night falling, temperature freezing, shelter urgency, MVP outline, wall wind-stopping, fortress rejection, ship debris, ugly construction, barely standing, wind blocking, world-change proof, start declaration.',
      internalConflict: 'Francisco resisting perfectionism—accepting ugly but functional as validation, embracing determination over despair.',
      characterGrowthElement: 'Francisco embodying Ace of Disks maker energy—using Lean Startup MVP thinking to prove viability with minimal resources.',
      seriesConnectionResonance: 'Lean Startup MVP demonstration; Build-Measure-Learn beginning; rapid prototyping skills for Book 3; innovation under pressure showing.',
      sceneCardProgression: 215,
      realWorldContext: 'MVP methodology, lean thinking, minimum viable solution.',
      timelineSignificance: '10/30/1320 evening—4 hours post-crash, first viable shelter proving maker capability.',
      saveTheCatBeat: truncate('Finale - MVP proves viability minimally', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'gritty_building',
        narrative_mode: 'determined_making',
      }),
      learning_objectives: JSON.stringify([
        'Lean Startup MVP thinking',
        'Minimum viable solution',
        'Execution over perfection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Void predator attraction',
        'Pivot necessity',
        'Defense-to-resource transformation',
      ]),
    },
    {
      pages: 'Page 518 - 521',
      description: 'Wall attracting void predators energy leeches—initial Defense plan making them target—Francisco realizing Pivot need \"Don\'t block wind; use it\"—reconfiguring debris into windmills/generators—predators losing interest when energy flows not stagnates—turning threat into resource as sail turns Pivot Ace Disks spins adapting feedback iteration learning actively ingeniously.',
      focus: 'Iteration adapting to feedback through pivoting model.',
      chapterSceneFocus: 'Ch75S3: Wall attracting void predator leeches—Defense targeting requiring Pivot \"use wind not block\"—debris reconfiguring to windmills/generators—flow-interest-loss turning threat to resource as sail Pivot Ace spins feedback iteration learning active ingenious.',
      preliminarySceneFocus: 'Sail Pivot spins resource actively',
      preliminarySceneDescription: 'Feedback adaptation transforms threat ingeniously',
      narrativeFunction: 'Demonstrates Build-Measure-Learn iteration; shows Business Model pivot; turns liability into asset.',
      sensoryDetail: 'Wall standing, void predator attraction, energy leeches, Defense targeting, Pivot realization, wind use not block, debris reconfiguration, windmills building, generators creating, flow enabling, predator disinterest, threat-to-resource turn.',
      internalConflict: 'Francisco pivoting from defensive to flow thinking—embracing ingenuity over resistance, adapting rather than defending.',
      characterGrowthElement: 'Francisco demonstrating Ace of Disks spinning energy—using Business Model Generation pivot, learning from feedback to transform threat into resource.',
      seriesConnectionResonance: 'Business Model pivot demonstration; Build-Measure-Learn iteration; threat-to-resource alchemy; entrepreneurial adaptation.',
      sceneCardProgression: 216,
      realWorldContext: 'Business model pivoting, feedback adaptation, threat transformation.',
      timelineSignificance: '10/31/1320 early morning—12 hours post-crash, critical pivot transforming defense failure into energy success.',
      saveTheCatBeat: truncate('Finale - pivot transforms threat to resource', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'active_iteration',
        narrative_mode: 'ingenious_adaptation',
      }),
      learning_objectives: JSON.stringify([
        'Business Model Generation pivot',
        'Build-Measure-Learn iteration',
        'Threat-to-resource transformation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Functional camp emergence',
        'Product-market fit achievement',
        'Foundation flag planting',
      ]),
    },
    {
      pages: 'Page 521 - 525',
      description: 'Morning camp ugly but functional—power humming people eating synthesized rations—Francisco planting flag not conquest but foundation—feeling Ace Disks solidify achieving product-market fit with reality—survival secured but exit questioned as Flag Hearth realizes no-longer-victims resolving anchor survival hopeful proud seed foundation finale.',
      focus: 'Resolution securing survival through product-market fit achieved.',
      chapterSceneFocus: 'Ch75S4: Functional ugly camp power humming rations eating—Francisco foundation flag not conquest—Ace solidifying product-market fit reality—survival secured exit questioned as Flag Hearth victim-transcendence anchors hopeful proud seed resolution finale.',
      preliminarySceneFocus: 'Flag Hearth anchors victim-transcendence',
      preliminarySceneDescription: 'Product-market fit secures hopeful survival foundation',
      narrativeFunction: 'Resolves survival arc; establishes Minimum Viable Base; demonstrates product-market fit achievement; raises next challenge.',
      sensoryDetail: 'Morning arrival, ugly camp, functional state, power humming, synthesized rations, flag planting, foundation not conquest, Ace Disks solidifying, product-market fit, survival security, exit question, Novella coffee recycled cup, Francisco expansion sketching, sunrise less alien.',
      internalConflict: 'Francisco experiencing pride while questioning permanence—accepting survival victory while recognizing journey continues.',
      characterGrowthElement: 'Francisco completing Ace of Disks integration—achieving product-market fit through Build-Measure-Learn, transforming from victim to founder in 24 hours.',
      seriesConnectionResonance: 'Rapid prototyping validates for Book 3 Ark; Ace energy established for finale; survivor-to-crew transformation; entrepreneurial success pattern.',
      sceneCardProgression: 217,
      realWorldContext: 'Product-market fit, viable foundation, entrepreneurial validation.',
      timelineSignificance: '10/31/1320 afternoon—24 hours post-crash, Minimum Viable Base achieved through Lean Startup methodology, Book 2 finale complete.',
      saveTheCatBeat: truncate('Finale - product-market fit secures foundation', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'hopeful_resolution',
        narrative_mode: 'proud_foundation',
      }),
      learning_objectives: JSON.stringify([
        'Product-market fit achievement',
        'Minimum Viable Base success',
        'Victim to founder transformation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 3 Ark building',
        'Exit strategy needed',
        'Expansion planning beginning',
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
        chapterUniqueIdentifier: 'EA-075',
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

  console.log(`\n✅ EA-075 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
