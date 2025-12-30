import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-065: Valor (Book 2, Chapter 25)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-065'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-065 not found. Run create-ea-065-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Wave Breaks',
      setup: 'The alarms dissolve into the roar of impact. The outer wards shatter. Francisco sees the Legion pouring in—not chaotic, but terrifyingly synchronized. He realizes the simulation drills were child\'s play. This is extermination. He grabs the Quartermaster. \'Abandon the supplies. Save the people.\'',
      symbolism: 'The Broken Shield. The Tsunami.',
      beat_goal: 'The Realization. Shifting gears to survival mode.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Clarity',
      scene_tone: 'Catastrophic',
      timeline_date: '7/28/1320 - Morning',
      timeline_variant: 'Sanctuary',
      location: 'Central Hub',
    },
    {
      scene_number: 2,
      scene_title: 'The Hardest Push',
      setup: 'The corridor to the Gate is clogged. Novella is trying to organize a defense, but they are overrun. Francisco makes the call. He creates a kinetic barrier, shoving his own allies—including Novella—towards safety. He locks eyes with her. \'This is my post,\' he says. It\'s a lie to make her leave, but a truth for his soul.',
      symbolism: 'The Severed Bond. The Door Closing.',
      beat_goal: 'The Sacrifice. Cutting the cord.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Love/Grief',
      scene_tone: 'Intimate/Tragic',
      timeline_date: '7/28/1320 - Midmorning',
      timeline_variant: 'Corridor',
      location: 'Blast Doors',
    },
    {
      scene_number: 3,
      scene_title: 'Seven of Wands',
      setup: 'Alone. The blast doors are behind him. The Legion is in front. He climbs a mound of fallen masonry. He holds his wand like a spear. The imagery is exact—the Seven of Wands. He is the Vantage Point. They come at him from below. He fights with a \'Valorous\' frenzy. Spells, rubble, gravity. He is not fighting to live; he is fighting for the clock ticking in his head.',
      symbolism: 'The High Ground. The Lone Wolf.',
      beat_goal: 'The Action Climax. Absolute defiance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Feral Determination',
      scene_tone: 'Visceral/Mythic',
      timeline_date: '7/28/1320 - Late Morning',
      timeline_variant: 'The Choke Point',
      location: 'Ruined Corridor',
    },
    {
      scene_number: 4,
      scene_title: 'Buried',
      setup: 'Time is up. The Gate signal fades (they are away). Francisco has nothing left. His wand is cracked. The Legion surges up the mound. He looks up at the unstable archway. \'Bring it down.\' He blasts the keystone of the arch. The world ends in a roar of stone. Darkness. Silence. Then, a faint groan in the dust.',
      symbolism: 'The Tomb. The Womb (Rebirth).',
      beat_goal: 'The Resolution. The cost paid.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Acceptance',
      scene_tone: 'Heavy/Final',
      timeline_date: '7/28/1320 - Noon',
      timeline_variant: 'Rubble',
      location: 'Under the Mountain',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 361 - 365',
      description: 'Alarms dissolving into impact roar as outer wards shatter—Legion pouring in terrifyingly synchronized not chaotic—Francisco realizing simulation drills child\'s play facing extermination, grabbing Quartermaster ordering abandon supplies save people shifting survival mode.',
      focus: 'Realization shifting gears to survival mode.',
      chapterSceneFocus: 'Ch65S1: Impact roar shattering outer wards as Legion pours terrifyingly synchronized—Francisco realizing extermination not drills—ordering abandon supplies save people as clarity shifts survival mode from broken shield facing tsunami.',
      preliminarySceneFocus: 'Broken shield faces tsunami',
      preliminarySceneDescription: 'Extermination realization shifts survival',
      narrativeFunction: 'Establishes catastrophic crisis; demonstrates Legion\'s synchronized threat; shows Francisco\'s survival prioritization.',
      sensoryDetail: 'Alarms dissolving, impact roar, shattering wards, Legion pouring, synchronized movement, extermination realization, Quartermaster grabbed, supplies abandoned, people saved.',
      internalConflict: 'Francisco accepting extermination reality requiring immediate survival triage.',
      characterGrowthElement: 'Francisco instantly prioritizing people over resources in catastrophic crisis—clarity under pressure.',
      seriesConnectionResonance: 'Legion revealed as unified consciousness; establishes coordinated threat level; sets up heroic last stand.',
      sceneCardProgression: 174,
      realWorldContext: 'Crisis triage, people over resources, synchronized threat coordination.',
      timelineSignificance: 'D-Day Legion breach—catastrophic assault forcing immediate evacuation decisions.',
      saveTheCatBeat: truncate('All Is Lost - Legion breaches in synchronized wave', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'catastrophic_impact',
        narrative_mode: 'clarity_crisis',
      }),
      learning_objectives: JSON.stringify([
        'Legion as synchronized consciousness',
        'People over supplies triage',
        'Extermination versus drill reality',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Novella forced evacuation coming',
        'Francisco staying behind',
        'Choke point last stand',
      ]),
    },
    {
      pages: 'Page 365 - 368',
      description: 'Clogged Gate corridor with Novella organizing overrun defense—Francisco creating kinetic barrier shoving allies including Novella towards safety—locking eyes declaring "This is my post" as lie making her leave but truth for soul severing bond closing door.',
      focus: 'Sacrifice cutting the cord through forced evacuation.',
      chapterSceneFocus: 'Ch65S2: Overrun corridor defense failing—Francisco creating kinetic barrier forcing Novella and allies towards Gate safety—eye-locked declaration "This is my post" severing bond as lie forcing departure but soul truth cutting cord.',
      preliminarySceneFocus: 'Severed bond closes door',
      preliminarySceneDescription: 'Love forces grief-sacrifice separation',
      narrativeFunction: 'Creates emotional sacrifice; forces Novella\'s traumatic departure; establishes Francisco\'s acceptance of fate.',
      sensoryDetail: 'Clogged corridor, Novella organizing, overrun defense, kinetic barrier creation, allies shoved, eye contact locked, post declaration, bond severed, door closing.',
      internalConflict: 'Francisco lying to force Novella\'s survival while accepting truth of his own sacrifice.',
      characterGrowthElement: 'Francisco transcending Commander to Shield—accepting death to save others, especially Novella.',
      seriesConnectionResonance: 'Novella trauma cementing future resolve; emotional anchor established; love as fighting motivation.',
      sceneCardProgression: 175,
      realWorldContext: 'Forced sacrifice separation, lying for loved one\'s safety, accepting death for purpose.',
      timelineSignificance: 'Critical moment forcing allies through Gate—Francisco staying as rearguard sacrificing himself.',
      saveTheCatBeat: truncate('All Is Lost - Francisco forces Novella away to die alone', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'intimate_tragic',
        narrative_mode: 'love_grief',
      }),
      learning_objectives: JSON.stringify([
        'Love forcing separation',
        'Lie as loving truth',
        'Sacrifice accepting death',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Seven of Wands stand coming',
        'Valorous frenzy battle',
        'Ceiling collapse finale',
      ]),
    },
    {
      pages: 'Page 368 - 372',
      description: 'Alone with blast doors behind, Legion ahead—climbing fallen masonry mound holding wand like spear embodying Seven of Wands Vantage Point—fighting valorous frenzy with spells, rubble, gravity as they come from below, not fighting to live but for clock ticking buying evacuation time.',
      focus: 'Action climax through absolute defiance stand.',
      chapterSceneFocus: 'Ch65S3: Alone atop masonry mound holding wand-spear embodying Seven of Wands high ground—Legion attacking from below met with valorous frenzy spells, rubble, gravity—fighting not for life but clock ticking buying evacuation time in absolute defiance.',
      preliminarySceneFocus: 'High ground lone wolf stands',
      preliminarySceneDescription: 'Vantage point defies overwhelming horde',
      narrativeFunction: 'Delivers action climax; embodies Seven of Wands archetype; demonstrates heroic combat limits.',
      sensoryDetail: 'Alone, blast doors behind, Legion ahead, masonry mound climbed, wand like spear, Vantage Point imagery, attacking from below, valorous frenzy, spells rubble gravity, clock ticking.',
      internalConflict: 'Francisco fighting purely for time bought, accepting death while maximizing every second.',
      characterGrowthElement: 'Francisco achieving ultimate Seven of Wands defiance—lone defender on high ground refusing to yield despite impossible odds.',
      seriesConnectionResonance: 'Legend building "Eternal" stand; physical scars for Book 3; heroic combat upper limits shown.',
      sceneCardProgression: 176,
      realWorldContext: 'Rearguard action, buying time with life, defiant last stand.',
      timelineSignificance: '43-minute stand holding choke point—every second bought enabling ally escape.',
      saveTheCatBeat: truncate('All Is Lost - lone stand against impossible odds', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'visceral_mythic',
        narrative_mode: 'feral_determination',
      }),
      learning_objectives: JSON.stringify([
        'Seven of Wands archetype embodied',
        'Fighting for time not survival',
        'Heroic combat limits demonstrated',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Ceiling collapse imminent',
        'Survival sliver possible',
        'Tomb/womb rebirth symbolism',
      ]),
    },
    {
      pages: 'Page 372 - 375',
      description: 'Gate signal fading confirming evacuation complete—Francisco with nothing left, cracked wand, Legion surging—looking up at unstable archway commanding "Bring it down," blasting keystone as world ends in stone roar—darkness, silence, then faint groan in dust suggesting survival sliver.',
      focus: 'Resolution through cost paid and rebirth hope.',
      chapterSceneFocus: 'Ch65S4: Fading Gate signal confirming escape—exhausted Francisco with cracked wand facing surging Legion—blasting unstable archway keystone collapsing world in stone roar—darkness and silence broken by faint dust-groan suggesting tomb/womb rebirth hope after cost paid.',
      preliminarySceneFocus: 'Tomb becomes womb rebirth',
      preliminarySceneDescription: 'Collapse darkness holds survival hope',
      narrativeFunction: 'Resolves chapter; pays ultimate cost; leaves survival hope; completes sacrifice arc.',
      sensoryDetail: 'Gate signal fading, nothing left, cracked wand, Legion surging, unstable archway, keystone blast, stone roar, world ending, darkness, silence, faint groan, dust.',
      internalConflict: 'Francisco accepting death with peace having fulfilled purpose, finding acceptance in sacrifice.',
      characterGrowthElement: 'Francisco completing transformation to Shield—accepting potential death with purpose-found peace after buying evacuation time.',
      seriesConnectionResonance: 'Physical scars carried to Book 3; legend of "Eternal" stand begins; rebirth symbolism for resurrection arc.',
      sceneCardProgression: 177,
      realWorldContext: 'Mission accomplished through sacrifice, acceptance in death, hope in darkness.',
      timelineSignificance: 'Final collapse after 43-minute stand—allies safe, Francisco buried with survival possibility.',
      saveTheCatBeat: truncate('All Is Lost - collapse buries hero with hope sliver', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'heavy_final',
        narrative_mode: 'acceptance_peace',
      }),
      learning_objectives: JSON.stringify([
        'Sacrifice completing purpose',
        'Acceptance finding peace',
        'Tomb as womb rebirth symbol',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 3 physical scars',
        'Eternal legend building',
        'Resurrection arc setup',
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
        chapterUniqueIdentifier: 'EA-065',
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

  console.log(`\n✅ EA-065 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
