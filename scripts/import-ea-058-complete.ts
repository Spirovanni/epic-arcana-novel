import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-058: Empathy (Book 2, Chapter 18)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-058'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-058 not found. Run create-ea-058-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Hangover of Victory',
      setup: 'The day after the Venetian treaty. Everyone is partying or posturing. Francisco enters the command center. It\'s a mess. The \'Big Picture\' is solved, but the details are crumbling. Food shipments are late. The portal stabilizers are misaligned. He realizes that \'Diplomacy\' (last chapter) was the easy part. \'Execution\' is the hard part. He cancels the victory parade and orders a inventory audit. The troops grumble. He feels like a killjoy, but the Knight of Pentacles knows that a parades don\'t win wars.',
      symbolism: 'The Knight of Pentacles reversed—stuck in the mud, drudgery. The contrast between the \'Goblet\' (Cups) and the \'Coin\' (Pentacles). The \'Inventory\' as a symbol of reality checking.',
      beat_goal: 'Establish the new conflict: Logistical entropy. Challenge Francisco\'s patience.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustrated responsibility',
      scene_tone: 'Dry and administrative',
      timeline_date: '6/8/1320 - Morning',
      timeline_variant: 'Sanctuary HQ',
      location: 'The Command Center',
    },
    {
      scene_number: 2,
      scene_title: 'The Routine',
      setup: 'Montage of the \'Grind\'. Francisco establishing the \'Empathy\' protocols (from STG title, subtly woven in). He listens to the complaints of the supply runners. He checks the perimeter fences personally. He creates a schedule and sticks to it. It is repetitive. It is unglamorous. But slowly, the chaos recedes. Predictability emerges. The faction leaders, initially annoyed, start to relax. They know that when they wake up, the coffee will be there and the shields will hold. Trust is built through consistency.',
      symbolism: 'The Knight of Pentacles upright—methodical progress. The \'Schedule\' as a holy text. The \'Fence\' as a boundary of safety.',
      beat_goal: 'Show the value of the \'Boring\' work. Francisco earns a different kind of respect—not awe, but reliance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Quiet satisfaction',
      scene_tone: 'Rhythmic and calm',
      timeline_date: '6/15/1320 - Afternoon',
      timeline_variant: 'Sanctuary HQ',
      location: 'Various (Perimeter, Mess Hall, Office)',
    },
    {
      scene_number: 3,
      scene_title: 'The Rot in the Lines',
      setup: 'During a routine inspection of the Logs (Logistics), Francisco notices a 0.5% variance in energy output. A \'Hero\' would ignore it. A \'General\' would delegate it. A \'Knight of Pentacles\' investigates it. He traces the line to a junction point. He finds a \'Rust Moth\'—a bio-temporal sabotage agent planted by Dagon. It eats supply lines silently. If he hadn\'t checked the logs, the entire Sanctuary would have collapsed in a week. He neutralizes it not with a sword, but with a exclusion seal (maintenance magic).',
      symbolism: 'The \'Rust Moth\' represents entropy/neglect. The \'0.5% variance\' represents the detail that matters. The victory is silent; no one even knows he saved them.',
      beat_goal: 'Validate the method. The \'boring\' work saved the day. The threat was invisible to anyone not paying attention to the details.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Vindication',
      scene_tone: 'Investigative and tense',
      timeline_date: '6/22/1320 - Afternoon',
      timeline_variant: 'Supply Junction Alpha',
      location: 'The Conduit Tunnel',
    },
    {
      scene_number: 4,
      scene_title: 'The Watchtower',
      setup: 'Francisco returns to the Watchtower. La Signora joins him. She asks why he did it himself. He says, \'Because I am the only one patient enough to look.\' She nods. She offers him a cup of coffee (black, practical). They look out over the Sanctuary. It is humming perfectly. It is boring. And it is safe. Francisco realizes he has grown. He doesn\'t need the applause anymore. He just needs the machine to work.',
      symbolism: 'The Watchtower—eternal vigilance. The \'Black Coffee\'—sobriety/grounding. The \'Hum\' of the machine—the music of the Pentacles.',
      beat_goal: 'Resolution. Character growth affirmed. He is ready for the next phase because his foundation is solid.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Serenity',
      scene_tone: 'Quiet and ending',
      timeline_date: '6/22/1320 - Night',
      timeline_variant: 'Sanctuary Ramparts',
      location: 'The Watchtower',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 256 - 260',
      description: 'Day after Venetian treaty, Francisco finds command center in chaos—food shipments late, portal stabilizers misaligned—realizing diplomacy was easy but execution is hard, canceling victory parade to order inventory audit despite grumbling troops.',
      focus: 'Establishing logistical entropy as new conflict and challenging Francisco\'s patience.',
      chapterSceneFocus: 'Ch58S1: Day after Venetian victory, Francisco discovers command center chaos with late shipments and misaligned systems, canceling celebrations to order inventory audit—realizing execution is harder than diplomacy and parades don\'t win wars.',
      preliminarySceneFocus: 'Victory hangover reveals logistics crisis',
      preliminarySceneDescription: 'Post-treaty chaos forces shift from celebration to execution',
      narrativeFunction: 'Establishes logistics as new conflict; grounds romantic rebellion in practical reality; introduces Knight of Pentacles theme.',
      sensoryDetail: 'Messy command center, partying troops, late food shipments, misaligned portal stabilizers, canceled victory parade, inventory audit orders, grumbling.',
      internalConflict: 'Francisco feeling like killjoy while knowing unglamorous work is necessary for survival.',
      characterGrowthElement: 'Francisco integrates Knight of Pentacles—learning reliability and routine matter more than glory.',
      seriesConnectionResonance: 'Establishes infrastructure crucial for rest of series; marks end of Francisco\'s impulsive hero phase.',
      sceneCardProgression: 146,
      realWorldContext: 'Post-victory logistics reality, the grind after celebration, execution challenges.',
      timelineSignificance: 'Transition from diplomatic triumph to operational sustainability challenge.',
      saveTheCatBeat: truncate('Fun and Games - discovering unglamorous work of sustaining victory', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'reality_check',
        narrative_mode: 'administrative_crisis',
      }),
      learning_objectives: JSON.stringify([
        'Logistics as unsexy but essential work',
        'Execution difficulty vs. diplomatic triumph',
        'Knight of Pentacles as practical leadership',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Supply chain vulnerabilities',
        'Need for systematic protocols',
        'Rust Moth sabotage lurking',
      ]),
    },
    {
      pages: 'Page 260 - 264',
      description: 'Montage of Francisco establishing empathy protocols—listening to supply runner complaints, personally checking perimeter fences, creating and maintaining schedule—building trust through consistency as chaos recedes into predictability and faction leaders relax knowing shields will hold.',
      focus: 'Showing value of boring work and earning reliance-based respect.',
      chapterSceneFocus: 'Ch58S2: Francisco establishes routine through empathy protocols—listening to complaints, personally checking perimeters, maintaining schedules—building trust through consistency as predictability emerges and faction leaders learn to rely on stable systems.',
      preliminarySceneFocus: 'Routine builds trust and stability',
      preliminarySceneDescription: 'Methodical work creates predictable safety',
      narrativeFunction: 'Demonstrates value of unglamorous work; shows Francisco earning different respect through reliability.',
      sensoryDetail: 'Supply runner complaints, perimeter fence checks, schedule creation, repetitive tasks, emerging predictability, coffee availability, shield stability, relaxed faction leaders.',
      internalConflict: 'Francisco finding satisfaction in quiet consistency rather than dramatic victories.',
      characterGrowthElement: 'Francisco discovers quiet satisfaction in methodical progress and earning reliance instead of awe.',
      seriesConnectionResonance: 'Supply line infrastructure becomes foundation for series; character maturity enables future leadership.',
      sceneCardProgression: 147,
      realWorldContext: 'Building systems through routine, trust from consistency, the power of showing up.',
      timelineSignificance: 'Sanctuary achieves operational stability through systematic protocols.',
      saveTheCatBeat: truncate('Fun and Games - mastering the grind that sustains victory', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'rhythmic_montage',
        narrative_mode: 'systematic_building',
      }),
      learning_objectives: JSON.stringify([
        'Consistency builds trust more than brilliance',
        'Empathy protocols as leadership tool',
        'Value of unglamorous essential work',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Log checking habit saving the day',
        'Attention to detail becoming crucial',
        'System vulnerability despite routine',
      ]),
    },
    {
      pages: 'Page 264 - 267',
      description: 'During routine log inspection, Francisco notices 0.5% energy variance—investigating rather than ignoring, he discovers Rust Moth bio-temporal sabotage agent eating supply lines that would have collapsed Sanctuary within week, neutralizing it with maintenance magic in silent victory no one witnesses.',
      focus: 'Validating methodical approach by catching invisible threat through detail attention.',
      chapterSceneFocus: 'Ch58S3: Francisco\'s routine log inspection reveals 0.5% variance leading to Rust Moth sabotage agent silently eating supply lines—investigating the tiny detail saves Sanctuary from week-away collapse through maintenance magic in victory no one witnesses.',
      preliminarySceneFocus: 'Detail attention catches silent sabotage',
      preliminarySceneDescription: 'Rust Moth discovered through log checking',
      narrativeFunction: 'Validates boring work as lifesaving; demonstrates invisible threats requiring constant vigilance.',
      sensoryDetail: '0.5% energy variance in logs, junction point tracing, Rust Moth bio-temporal agent, silently eating supply lines, exclusion seal maintenance magic, invisible threat.',
      internalConflict: 'Francisco vindicated that patient detail work saved everyone while knowing victory goes unrecognized.',
      characterGrowthElement: 'Francisco validates that patient attention to unglamorous details is heroism even without applause.',
      seriesConnectionResonance: 'Establishes Rust Moth as Dagon\'s subtle sabotage method; proves infrastructure vigilance necessity.',
      sceneCardProgression: 148,
      realWorldContext: 'Catching small problems before they become catastrophic, the unsexy work that saves lives.',
      timelineSignificance: 'Discovery of Dagon\'s silent sabotage tactics targeting infrastructure rather than dramatic attacks.',
      saveTheCatBeat: truncate('Fun and Games - proving unglamorous vigilance saves the day', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'investigative_tension',
        narrative_mode: 'detective_validation',
      }),
      learning_objectives: JSON.stringify([
        'Small variances indicating big problems',
        'Patient investigation vs. delegation',
        'Silent victories vs. dramatic triumphs',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon\'s subtle sabotage continuing',
        'Infrastructure as ongoing vulnerability',
        'Need for eternal vigilance',
      ]),
    },
    {
      pages: 'Page 267 - 270',
      description: 'Francisco returns to Watchtower where La Signora joins him—discussing why he investigated personally, sharing black coffee, observing perfectly humming Sanctuary—realizing he\'s grown past needing applause, finding contentment in quiet duty and the machine working.',
      focus: 'Affirming character growth and readiness for next phase through solid foundation.',
      chapterSceneFocus: 'Ch58S4: At Watchtower with La Signora, Francisco reflects on personally investigating threats, sharing practical black coffee while observing perfectly humming Sanctuary—realizing growth past needing applause into contentment with quiet duty and functional systems.',
      preliminarySceneFocus: 'Serenity in vigilance and duty',
      preliminarySceneDescription: 'Watchtower reflection affirms maturity and readiness',
      narrativeFunction: 'Resolves chapter arc; affirms character maturity; establishes readiness for next challenges.',
      sensoryDetail: 'Watchtower eternal vigilance, La Signora\'s presence, black practical coffee, perfectly humming Sanctuary, boring safety, serenity.',
      internalConflict: 'Francisco at peace with lack of recognition, content in duty itself rather than glory.',
      characterGrowthElement: 'Francisco completes evolution from impulsive hero to patient leader who finds meaning in unglamorous essential work.',
      seriesConnectionResonance: 'Watchtower vigilance becomes recurring motif; maturity enables later leadership challenges.',
      sceneCardProgression: 149,
      realWorldContext: 'Finding meaning in duty itself, maturity past needing applause, contentment in essential work.',
      timelineSignificance: 'Sanctuary achieves stable operational baseline enabling future expansion and conflict.',
      saveTheCatBeat: truncate('Fun and Games - completing mastery of sustaining victory', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'reflective_resolution',
        narrative_mode: 'serene_closure',
      }),
      learning_objectives: JSON.stringify([
        'Growth past needing recognition',
        'Contentment in essential duty',
        'Solid foundation enabling next challenges',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Next phase of expansion possible',
        'Eternal vigilance requirement',
        'La Signora as quartermaster partner',
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
        chapterUniqueIdentifier: 'EA-058',
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

  console.log(`\n✅ EA-058 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
