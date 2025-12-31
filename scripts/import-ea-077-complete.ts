import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-077: Intellectual Dynamo (Book 2, Chapter 37)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-077'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-077 not found. Run create-ea-077-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Hunter',
      setup: 'The sensors scream. The sky tears open. The Interceptor lands. It ignores the Beacon and targets the life signs. Francisco orders a volley. The Interceptor\'s shields flare and adapt. It fires a return shot that vaporizes the windmill (EA-075). It is invincible to \'Old Ways\'.',
      symbolism: 'The Terminator. The Futility of Tradition.',
      beat_goal: 'The Threat. Establishing the enemy\'s superiority.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Fear',
      scene_tone: 'Action-horror',
      timeline_date: '11/6/1320 - Late Evening',
      timeline_variant: 'The Perimeter',
      location: 'Base Zero',
    },
    {
      scene_number: 2,
      scene_title: 'The Brainstorm',
      setup: 'Francisco drags the leaders into the bunker. \'Standard tactics are dead. Give me bad ideas. fast.\' He forces them into \'Divergent Thinking\'. The Engineer suggests a gravity bomb. \'We don\'t have the mass.\' The Mystic suggests a temporal loop. \'We don\'t have the power.\' Then, Novella looks at the Beacon. \'It\'s broadcasting a signal. What if we broadcast... gravity?\'',
      symbolism: 'The Spark in the heavy air. The Knight of Swords charging.',
      beat_goal: 'The Idea. The pivot from fear to creativity.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frantic hope',
      scene_tone: 'Fast-paced',
      timeline_date: '11/6/1320 - Night',
      timeline_variant: 'The Bunker',
      location: 'Base Zero',
    },
    {
      scene_number: 3,
      scene_title: 'The Prototype',
      setup: 'They have 5 minutes before the shield fails. They tear the Beacon apart. They rewire the core. It is the ugliest weapon ever made. Wires duct-taped, crystals exposed. The Knight of Swords doesn\'t care about safety; he cares about speed. They aim it at the Hunter. The Hunter charges.',
      symbolism: 'Frankenstein\'s Monster. The desperate gamble.',
      beat_goal: 'The Action. Execution of the insane plan.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Adrenaline',
      scene_tone: 'Chaotic',
      timeline_date: '11/6/1320 - Night',
      timeline_variant: 'The Breach',
      location: 'Base Zero',
    },
    {
      scene_number: 4,
      scene_title: 'The Surprise',
      setup: 'They activate the device. No laser beam. Just a sound—a \'thrum\' that shakes the teeth. The gravity around the Hunter multiplies by 100. The machine crumples like a soda can. Its AI cannot adapt to physics breaking. It implodes. Silence returns. The team stares at their junk-weapon. They are alive.',
      symbolism: 'David and Goliath. The victory of Mind over Matter.',
      beat_goal: 'Resolution. The immediate threat is gone.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Disbelief',
      scene_tone: 'Stunned',
      timeline_date: '11/6/1320 - Night',
      timeline_variant: 'The Wreckage',
      location: 'Base Zero',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 541 - 545',
      description: 'Sensors screaming sky tearing Interceptor landing—ignoring Beacon targeting life—Francisco ordering volley shields adapting flaring—return shot vaporizing windmill invincible to Old Ways as Terminator Futility Tradition threatens crisis establishing enemy superiority action-horror fear obstacle adaptive AI.',
      focus: 'Threat establishing enemy superiority through invincibility.',
      chapterSceneFocus: 'Ch77S1: Sensors screaming Interceptor landing life-targeting—volley adapting shields windmill-vaporizing Old Ways invincible as Terminator Futility threatens crisis enemy superior action-horror fear adaptive AI obstacle establishes.',
      preliminarySceneFocus: 'Terminator Futility threatens invincibility',
      preliminarySceneDescription: 'Adaptive AI establishes superiority action-horror',
      narrativeFunction: 'Establishes final boss threat; demonstrates adaptive AI; invalidates conventional tactics.',
      sensoryDetail: 'Sensors screaming, sky tearing, Interceptor landing, Beacon ignoring, life sign targeting, volley order, shields flaring adapting, return shot, windmill vaporization, Old Ways futility, sleek black machine, adaptive shields, impossible defense.',
      internalConflict: 'Francisco experiencing fear while maintaining command—recognizing conventional tactics will fail.',
      characterGrowthElement: 'Francisco facing Knight of Swords necessity—confronting enemy requiring intellectual speed over brute force, innovation over tradition.',
      seriesConnectionResonance: 'Adaptive AI enemy establishing; innovation-over-tradition theme; Pulse Weapon invention setup; Book 2 climax beginning.',
      sceneCardProgression: 222,
      realWorldContext: 'Adaptive learning AI, innovation necessity, status quo failure.',
      timelineSignificance: '11/6/1320 late evening—1 hour after rescue contact, Dagon Hunter arriving forcing intellectual battle.',
      saveTheCatBeat: truncate('Finale - adaptive enemy invalidates tradition', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'action_horror_crisis',
        narrative_mode: 'fear_recognition',
      }),
      learning_objectives: JSON.stringify([
        'Originals status quo failure',
        'Adaptive enemy recognition',
        'Innovation necessity establishment',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Divergent Thinking required',
        'Beacon repurposing coming',
        'Gravity weapon invention',
      ]),
    },
    {
      pages: 'Page 545 - 548',
      description: 'Francisco dragging leaders bunker \'Standard tactics dead. Bad ideas fast\'—forcing Divergent Thinking—Engineer gravity bomb no-mass, Mystic temporal loop no-power—Novella Beacon looking \'broadcast gravity?\' as Spark heavy air Knight Swords charging pivots fear to creativity ideating plan frantically fast-paced hoping brainstorm.',
      focus: 'Idea pivoting fear to creativity through divergent thinking.',
      chapterSceneFocus: 'Ch77S2: Francisco bunker-dragging \'tactics dead bad ideas fast\' Divergent forcing—gravity bomb no-mass loop no-power—Novella \'broadcast gravity\' as Spark Knight charging fear-to-creativity pivot ideates plan frantic fast hope brainstorms.',
      preliminarySceneFocus: 'Spark Knight charges creativity pivot',
      preliminarySceneDescription: 'Divergent thinking ideates gravity broadcast frantically',
      narrativeFunction: 'Demonstrates rapid ideation under pressure; introduces Novella\'s breakthrough; shows Intellectual Dynamo methodology.',
      sensoryDetail: 'Leaders dragging, bunker entry, Standard tactics death, bad ideas demand, fast urgency, Divergent Thinking forcing, gravity bomb suggestion, mass lack, temporal loop suggestion, power lack, Beacon observation, gravity broadcast idea, dust falling ceiling, formulas dirt floor, lightbulb moment Novella eyes, impact vibrations.',
      internalConflict: 'Francisco experiencing frantic hope—forcing creativity against survival instinct urging conventional defense.',
      characterGrowthElement: 'Francisco embodying Knight of Swords aggressive intellect—using Intellectual Dynamo rapid ideation, encouraging wild ideas under fire.',
      seriesConnectionResonance: 'Intellectual Dynamo demonstration; Originals divergent thinking; Creative Confidence rapid prototyping setup; signature tactic establishing.',
      sceneCardProgression: 223,
      realWorldContext: 'Rapid ideation techniques, divergent thinking, creative desperation.',
      timelineSignificance: '11/6/1320 night—minutes after Hunter landing, breakthrough idea emerging under extreme pressure.',
      saveTheCatBeat: truncate('Finale - divergent thinking sparks solution', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'fast_brainstorm',
        narrative_mode: 'frantic_hope',
      }),
      learning_objectives: JSON.stringify([
        'Intellectual Dynamo rapid ideation',
        'Divergent thinking under pressure',
        'Wild ideas encouragement',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Beacon destruction coming',
        'Gravity weapon prototype',
        'Speed over safety',
      ]),
    },
    {
      pages: 'Page 548 - 552',
      description: '5 minutes before shield fails—tearing Beacon rewiring core—ugliest weapon wires duct-taped crystals exposed—Knight Swords speed-not-safety caring—aiming Hunter charging as Frankenstein Monster desperate gamble executes insane plan climaxing action chaotically adrenaline rapid-prototyping building-to-think.',
      focus: 'Action executing insane plan through rapid prototyping.',
      chapterSceneFocus: 'Ch77S3: 5-minute shield-fail—Beacon tearing core rewiring ugly weapon duct-tape crystals—Knight speed-not-safety—Hunter aiming charging as Frankenstein gamble executes insane climax chaotic adrenaline rapid-prototype builds.',
      preliminarySceneFocus: 'Frankenstein gamble executes chaotically',
      preliminarySceneDescription: 'Rapid prototype builds speed-not-safety adrenaline',
      narrativeFunction: 'Executes rapid prototyping under fire; demonstrates Knight of Swords speed priority; creates maximum tension climax.',
      sensoryDetail: '5-minute deadline, shield failing, Beacon tearing, core rewiring, ugliest weapon, wires duct-taped, crystals exposed, safety disregard, speed priority, Hunter aiming, charge beginning, desperate construction, frantic assembly, hands bleeding building.',
      internalConflict: 'Francisco experiencing adrenaline—trusting rapid prototyping over careful engineering, accepting catastrophic failure risk.',
      characterGrowthElement: 'Francisco demonstrating Knight of Swords complete integration—prioritizing speed over safety, building to think rather than thinking to build.',
      seriesConnectionResonance: 'Creative Confidence rapid prototyping; Thinkertoys idea techniques; Pulse Weapon creation origin; change-the-game signature establishing.',
      sceneCardProgression: 224,
      realWorldContext: 'Rapid prototyping, building to think, speed over perfection.',
      timelineSignificance: '11/6/1320 night—5 minutes to shield collapse, rapid prototype construction climax.',
      saveTheCatBeat: truncate('Finale - rapid prototype executes gamble', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'chaotic_building',
        narrative_mode: 'adrenaline_execution',
      }),
      learning_objectives: JSON.stringify([
        'Creative Confidence rapid prototyping',
        'Building to think methodology',
        'Speed over safety necessity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Physics-breaking weapon',
        'Hunter implosion coming',
        'Mind over Matter victory',
      ]),
    },
    {
      pages: 'Page 552 - 555',
      description: 'Device activating no laser just thrum shaking teeth—gravity multiplying 100x Hunter crumpling soda-can—AI cannot adapt physics breaking imploding—silence returning team staring junk-weapon alive as David Goliath Mind-over-Matter victory resolves threat stunned disbelief smoke rising Francisco manic laughing Beacon destroyed.',
      focus: 'Resolution showing threat resolved through Mind over Matter.',
      chapterSceneFocus: 'Ch77S4: Device activating thrum teeth-shaking—100x gravity Hunter crumpling can—AI physics-breaking imploding silence—junk-weapon staring alive as David Goliath Mind-Matter victory resolves stunned disbelief smoke Francisco laughing Beacon loss.',
      preliminarySceneFocus: 'David Goliath Mind-Matter victories',
      preliminarySceneDescription: 'Physics-breaking weapon resolves stunned disbelief',
      narrativeFunction: 'Resolves Hunter threat; validates rapid innovation; establishes Pulse Weapon legacy; completes Knight of Swords integration.',
      sensoryDetail: 'Device activation, no laser, thrum sound, teeth shaking, gravity multiplying, 100x force, Hunter crumpling, soda can compression, AI adaptation failure, physics breaking, implosion, silence return, junk-weapon staring, alive realization, smoke rising, crushed machine, Francisco manic laugh, Beacon destroyed recognition.',
      internalConflict: 'Francisco experiencing disbelief—processing innovation victory while recognizing Beacon sacrifice cost.',
      characterGrowthElement: 'Francisco completing Knight of Swords mastery—achieving Mind over Matter victory through aggressive intellect, establishing change-the-game signature tactic.',
      seriesConnectionResonance: 'Pulse Weapon invention becoming standard sidearm Books 3-6; adaptive tactics signature establishing; innovation-over-force theme; Knight Swords complete.',
      sceneCardProgression: 225,
      realWorldContext: 'Innovation triumph, intellectual victory, creative problem-solving success.',
      timelineSignificance: '11/6/1320 night—Hunter defeated through rapid innovation, Rescue from Without arc complete, Book 2 climax concluded.',
      saveTheCatBeat: truncate('Finale - innovation crushes impossible enemy', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'stunned_resolution',
        narrative_mode: 'disbelief_triumph',
      }),
      learning_objectives: JSON.stringify([
        'Innovation over force victory',
        'Mind over Matter demonstration',
        'Rapid ideation validation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Pulse Weapon future use',
        'Adaptive tactics continuing',
        'Book 2 finale approaching',
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
        chapterUniqueIdentifier: 'EA-077',
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

  console.log(`\n✅ EA-077 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
