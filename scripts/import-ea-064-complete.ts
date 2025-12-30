import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-064: Playfulness (Book 2, Chapter 24)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-064'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-064 not found. Run create-ea-064-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'Burnout',
      setup: 'Day 4 of Seeding. No sleep. Mistakes are compounding. A junior technician drops a stabilizer. It shatters. The alarms don\'t blare; they whimper. The air turns purple. Everyone freezes, waiting for death. This is the \'All is Lost\' moment—not because of an enemy, but because of their own frailty.',
      symbolism: 'The Dropped Cup. The spilled wine. The limit of human endurance.',
      beat_goal: 'Establish the tension point.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Dread',
      scene_tone: 'High anxiety',
      timeline_date: '7/21/1320 - Morning',
      timeline_variant: 'Sanctuary Ops',
      location: 'The Anchor Deck',
    },
    {
      scene_number: 2,
      scene_title: 'The Glitch',
      setup: 'The purple fog doesn\'t kill them. It rewrites their linguistic centers. The Quartermaster tries to report damage, but it comes out as a limerick. \'The shield is down, the power is low / We have nowhere else to go.\' Silence. Then Francisco snorts. Then he laughs. It\'s hysterical, bordering on manic. But it shatters the fear. They aren\'t dying; they\'re ridiculous.',
      symbolism: 'The Jester. The upside-down world. Laughter as banishing ritual.',
      beat_goal: 'The Release. Breaking the grip of fear.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Hysteria/Joy',
      scene_tone: 'Absurdist',
      timeline_date: '7/21/1320 - Midmorning',
      timeline_variant: 'Sanctuary Ops (Warped)',
      location: 'The Anchor Deck',
    },
    {
      scene_number: 3,
      scene_title: 'Gamification',
      setup: 'Francisco seizes the mood. \'New rule. If you rhyme, you pay a fine. If you fix a unit, you get a point.\' He throws up a scoreboard. The work transforms from a death march into a sport. Novella creates a \'Trick Shot\' bonus for seeding timelines with flair. The energy shifts from heavy (Ten of Wands) to light (Six of Cups). Efficiency doubles.',
      symbolism: 'The Game Board. The Playground. Flow state.',
      beat_goal: 'The Action. Joy as fuel.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Competitive fun',
      scene_tone: 'High energy',
      timeline_date: '7/21/1320 - Afternoon',
      timeline_variant: 'Sanctuary Ops',
      location: 'The Ops Room',
    },
    {
      scene_number: 4,
      scene_title: 'The Father\'s Nod',
      setup: 'The sensors pick up a Dagon-signal. He is watching. The team freezes. But there is no attack. Just a single pulse on the monitor—a waveform that looks like a slow nod. \'He enjoyed that,\' La Signora whispers. Francisco realizes he has done something deeper than fighting: he has entertained the God. He has proven that Humanity is interesting. That is their safety.',
      symbolism: 'The King of Cups acknowledging the Page. Atonement (At-one-ment).',
      beat_goal: 'Resolution. Survival through style.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Chilled respect',
      scene_tone: 'Ominous but calm',
      timeline_date: '7/21/1320 - Evening',
      timeline_variant: 'The Void Window',
      location: 'The Observation Deck',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 346 - 350',
      description: 'Day 4 Seeding with no sleep, mistakes compounding—junior technician drops stabilizer shattering it, alarms whimpering not blaring as air turns purple—everyone freezing waiting for death in All is Lost moment from their own frailty not enemy.',
      focus: 'Establishing tension point from human limitations.',
      chapterSceneFocus: 'Ch64S1: Day 4 Seeding exhaustion with compounding mistakes—dropped stabilizer shattering, whimpering alarms, purple air—everyone freezing awaiting death from frailty not enemy in All is Lost moment of human endurance limits.',
      preliminarySceneFocus: 'Dropped cup spills endurance',
      preliminarySceneDescription: 'Burnout creates critical failure point',
      narrativeFunction: 'Establishes All is Lost crisis; shows human frailty as threat; creates tension requiring release.',
      sensoryDetail: 'Day 4 no sleep, compounding mistakes, dropped stabilizer, shattering, whimpering alarms, purple air, frozen waiting, death anticipation.',
      internalConflict: 'Francisco facing team collapse from exhaustion rather than external attack.',
      characterGrowthElement: 'Francisco confronting human limitations requiring different response than tactical solutions.',
      seriesConnectionResonance: 'Human frailty as vulnerability; reality-anchor mechanics revealed; sets up playful response.',
      sceneCardProgression: 170,
      realWorldContext: 'Burnout crisis, human endurance limits, exhaustion-induced errors.',
      timelineSignificance: 'Seeding operation Day 4—critical failure from team exhaustion threatening mission.',
      saveTheCatBeat: truncate('All Is Lost - team burnout creates critical failure', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'high_anxiety',
        narrative_mode: 'dread_tension',
      }),
      learning_objectives: JSON.stringify([
        'Human frailty as threat',
        'Burnout consequences',
        'Reality-anchor failure effects',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Glitch rewrites coming',
        'Laughter breaking fear',
        'Playfulness as solution',
      ]),
    },
    {
      pages: 'Page 350 - 353',
      description: 'Purple fog not killing but rewriting linguistic centers—Quartermaster damage report emerging as limerick "The shield is down, the power is low / We have nowhere else to go"—silence then Francisco snorting, laughing hysterically bordering manic, shattering fear revealing they\'re ridiculous not dying.',
      focus: 'Breaking fear grip through absurdist release.',
      chapterSceneFocus: 'Ch64S2: Purple fog rewriting linguistic centers into limericks—Quartermaster reporting damage poetically—Francisco\'s hysterical manic laughter shattering fear as team realizes ridiculous absurdity over death threat releasing tension.',
      preliminarySceneFocus: 'Jester laughter banishes fear',
      preliminarySceneDescription: 'Upside-down world becomes absurd release',
      narrativeFunction: 'Provides release through absurdity; demonstrates laughter as fear-banishing; shifts tone from dread to joy.',
      sensoryDetail: 'Purple fog, rewritten linguistic centers, limerick damage reports, silence, Francisco snorting, hysterical laughter, manic bordering, shattered fear, ridiculous not dying.',
      internalConflict: 'Francisco choosing laughter over panic in absurd crisis.',
      characterGrowthElement: 'Francisco discovering Six of Cups playfulness as fear-breaking tool—hysteria becoming liberation.',
      seriesConnectionResonance: 'Laughter as banishing ritual; absurdity as human advantage; Jester archetype emerging.',
      sceneCardProgression: 171,
      realWorldContext: 'Laughter breaking tension, absurdity releasing fear, hysteria as liberation.',
      timelineSignificance: 'Reality glitch creates surreal effects—linguistic rewrites revealing physics breakdown.',
      saveTheCatBeat: truncate('All Is Lost - absurdity breaks fear grip', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'absurdist_release',
        narrative_mode: 'hysteria_joy',
      }),
      learning_objectives: JSON.stringify([
        'Laughter as fear banishment',
        'Absurdity releasing tension',
        'Ridiculous over deadly reframe',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Gamification coming',
        'Flow state shift',
        'Dagon watching',
      ]),
    },
    {
      pages: 'Page 353 - 357',
      description: 'Francisco seizing mood with new rule—rhyme pays fine, fix gets point—throwing up scoreboard transforming work from death march to sport—Novella creating Trick Shot bonus for flair seeding—energy shifting from Ten of Wands heavy to Six of Cups light doubling efficiency.',
      focus: 'Joy as fuel through gamification action.',
      chapterSceneFocus: 'Ch64S3: Francisco gamifying with rhyme-fine fix-point rules and scoreboard—transforming death march to sport as Novella adds Trick Shot flair bonus—energy shifting from Ten of Wands burden to Six of Cups play doubling efficiency through joy fuel.',
      preliminarySceneFocus: 'Game board creates flow state',
      preliminarySceneDescription: 'Playground energy doubles efficiency',
      narrativeFunction: 'Implements playful solution; demonstrates joy increasing competence; shifts from heavy to light energy.',
      sensoryDetail: 'Mood seized, new rules declared, scoreboard thrown up, death march transforming to sport, Trick Shot bonus, flair seeding, energy shifting, efficiency doubling.',
      internalConflict: 'Francisco channeling absurdity into productive playfulness.',
      characterGrowthElement: 'Francisco mastering Six of Cups—learning playful flexibility outperforms serious brittleness under pressure.',
      seriesConnectionResonance: 'Gamification as leadership tool; flow state optimization; creativity as human advantage over Simulacra.',
      sceneCardProgression: 172,
      realWorldContext: 'Gamification increasing engagement, flow state productivity, joy as performance fuel.',
      timelineSignificance: 'Seeding efficiency doubles through playful reframe—mission success through mood shift.',
      saveTheCatBeat: truncate('All Is Lost - playfulness doubles efficiency', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'high_energy_flow',
        narrative_mode: 'competitive_fun',
      }),
      learning_objectives: JSON.stringify([
        'Joy as productivity fuel',
        'Gamification effectiveness',
        'Playful flexibility over serious brittleness',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon signal coming',
        'Mutual respect moment',
        'Entertainment as safety',
      ]),
    },
    {
      pages: 'Page 357 - 360',
      description: 'Sensors detecting Dagon-signal watching—team freezing but no attack comes—single monitor pulse showing waveform like slow nod—La Signora whispering "He enjoyed that" as Francisco realizes entertaining God proves Humanity interesting creating safety through style not fighting.',
      focus: 'Resolution through survival via entertaining style.',
      chapterSceneFocus: 'Ch64S4: Dagon-signal detected watching—team frozen anticipating attack receiving only waveform nod pulse—La Signora interpreting enjoyment as Francisco realizes entertaining God proving Humanity interesting creates safety through style achieving Atonement mutual respect.',
      preliminarySceneFocus: 'King acknowledges Page',
      preliminarySceneDescription: 'Atonement through entertaining interest',
      narrativeFunction: 'Resolves chapter; establishes mutual respect with antagonist; redefines survival as interesting over threatening.',
      sensoryDetail: 'Dagon-signal sensors, team freezing, no attack, single pulse, waveform slow nod, La Signora whisper, God entertainment, Humanity interesting, style safety.',
      internalConflict: 'Francisco understanding entertainment creates safety more than combat prowess.',
      characterGrowthElement: 'Francisco achieving Atonement with Father archetype—earning respect through creativity not confrontation.',
      seriesConnectionResonance: 'Dagon shifts from bug-squashing to player-watching; Trickster archetype preparation for Book 5; entertainment as survival.',
      sceneCardProgression: 173,
      realWorldContext: 'Earning respect through creativity, interesting over threatening, style as survival.',
      timelineSignificance: 'First mutual respect moment with Dagon—shifting from extermination to observation interest.',
      saveTheCatBeat: truncate('All Is Lost - respect earned through entertainment', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'ominous_calm',
        narrative_mode: 'chilled_respect',
      }),
      learning_objectives: JSON.stringify([
        'Entertainment as safety strategy',
        'Mutual respect through creativity',
        'Interesting beats threatening',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon\'s increased danger from respect',
        'Trickster roles in Book 5',
        'Creativity as unique human advantage',
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
        chapterUniqueIdentifier: 'EA-064',
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

  console.log(`\n✅ EA-064 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
