import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-055: Creative Force (Book 2, Chapter 15)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-055'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-055 not found. Run create-ea-055-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Edge of Nothing',
      setup: 'Following the victory in Venice, the Council tracks the retreating Faceless agent to a Sector 4 timeline. They arrive to find... nothing. Not a chaotic timeline, but a white void. The agent didn\'t just destabilize the timeline; they deleted it. The Alexandrians act irrationally, terrified by the absence of data. The Byzantines try to \'secure\' the perimeter, but there is no perimeter. Francisco feels the crushing weight of the Void—it\'s not just empty space, it\'s an aggressive negation of life. He realizes the enemy\'s goal isn\'t conquest, but unmaking.',
      symbolism: 'The Void represents the absence of the Cup—emotional emptiness, the desert of the soul. The panic of the scholars represents the failure of the intellect (Swords) when faced with the irrational/sublime. The \'aggressive negation\' is the shadow side of the King of Cups—manipulative nihilism.',
      beat_goal: 'Establish the stakes: Dagon creates Void. Strip away the Council\'s confidence from the previous chapter. Introduce the need for a power that can fill the emptiness.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Existential dread',
      scene_tone: 'Quiet, cold, and terrifying',
      timeline_date: '5/18/1320 - Morning',
      timeline_variant: 'The Void (formerly Sector 4)',
      location: 'The Edge of the Void',
    },
    {
      scene_number: 2,
      scene_title: 'The Emotional Blueprint',
      setup: 'Francisco gathers the terrified Council. He pulls the King of Cups. He realizes that to exist here, they must *impose* existence. They cannot repair; they must create. He asks them not for calculations or battle plans, but for memories. \'What is the most stable thing you know?\' He guides them into a shared trance (King of Cups mastery). He weaves the Medici desire for beauty, the Alexandrian desire for order, and the Byzantine desire for safety into a single lattice. It\'s an act of pure emotional engineering.',
      symbolism: 'The King of Cups is the \'Architect of Emotions\'. Using memories as bricks symbolizes \'Steal Like an Artist\'—remixing the past to create the future. The shared trance represents the \'collective unconscious\' becoming conscious.',
      beat_goal: 'Francisco shifts from strategist to creator. He unifies the Council on an emotional level, not just a tactical one. The first sparks of the new reality appear.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Intense concentration and vulnerability',
      scene_tone: 'Intimate and mystical',
      timeline_date: '5/18/1320 - Afternoon',
      timeline_variant: 'The Void',
      location: 'The Formless Drift',
    },
    {
      scene_number: 3,
      scene_title: 'Construction of the Sanctuary',
      setup: 'The pocket reality begins to manifest—a surreal amalgamation of a Renaissance piazza, a library, and a fortress. It\'s unstable; \'glitches\' appear where fear creeps in. Francisco must manage the emotional tone of the group like a conductor. When the Alexandrians doubt, the walls crumble. Francisco steps in with the King of Cups energy: calm, assured dominance of the emotional field. He suppresses his own doubt to anchor them. The Sanctuary solidifies. It is real because they believe it is.',
      symbolism: 'The Sanctuary is the \'World\' built from \'Cups\' (Water/Emotion). The glitches representing fear show the direct link between mind and reality. Francisco as conductor embodies the King—control without force.',
      beat_goal: 'The successful creation of the \'Sanctuary\'. Validating that emotional creativity can manipulate the physical world (or temporal world).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhaustion and wonder',
      scene_tone: 'Dreamlike but becoming solid',
      timeline_date: '5/18/1320 - Evening',
      timeline_variant: 'The First Sanctuary',
      location: 'The Newly Created Piazza',
    },
    {
      scene_number: 4,
      scene_title: 'The Soulless Invader',
      setup: 'A Faceless agent returns to finish the job. It steps onto the edge of the new Sanctuary. But the ground burns it. The reality is made of \'remembered beauty\' and \'shared hope\'—frequencies the Faceless cannot hold. The agent tries to mimic the environment but produces a grotesque parody (uncanny valley) and is rejected by the very physics of the place. It dissolves, unable to exist in a high-emotion environment. Francisco realizes: Creativity is their shield. Dagon cannot enter where there is true creation.',
      symbolism: 'The rejection of the Faceless agent symbolizes that \'Artificial Intelligence\' (or soulless mimicry) cannot replace the \'Human Soul\' (King of Cups). The burning ground represents the protective power of positive emotion. Adaptation strategy (previous chapter) + Creative Force (this chapter) = Unbeatable defense.',
      beat_goal: 'Demonstrate the defensive utility of the new power. Establish the enemy\'s weakness (lack of soul/creativity). Secure the Sanctuary as a permanent base.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Triumph and relief',
      scene_tone: 'Victorious and philosophical',
      timeline_date: '5/18/1320 - Night',
      timeline_variant: 'The First Sanctuary',
      location: 'The Sanctuary Gates',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 211 - 215',
      description: 'The Unity Council tracks a Faceless agent to Sector 4 only to discover an erased timeline—a white void of complete non-existence where the Alexandrians panic, Byzantines fail to secure a non-existent perimeter, and Francisco realizes Dagon\'s goal is unmaking reality itself.',
      focus: 'Establishing the existential threat of timeline erasure and stripping away Council confidence.',
      chapterSceneFocus: 'Ch55S1: The Unity Council arrives at Sector 4 to find a white void where a timeline was completely erased, causing Alexandrian scholars to panic at the absence of data while Francisco realizes the enemy seeks not conquest but total unmaking.',
      preliminarySceneFocus: 'Discovery of the erased timeline void',
      preliminarySceneDescription: 'Council confronts complete timeline erasure by Faceless agent',
      narrativeFunction: 'Establishes stakes of timeline erasure, strips away Council confidence, introduces need for creative power.',
      sensoryDetail: 'White void of nothingness, absence of data terrifying scholars, Byzantine attempts to secure non-existent perimeter, crushing weight of aggressive negation, cold silence.',
      internalConflict: 'Francisco confronting existential dread of complete non-existence and recognizing inadequacy of previous tactics.',
      characterGrowthElement: 'Francisco faces limitation of strategy and adaptation when confronting pure negation, requiring new approach.',
      seriesConnectionResonance: 'Introduces timeline erasure threat that escalates in Books 3-6; establishes void as Dagon\'s ultimate weapon.',
      sceneCardProgression: 134,
      realWorldContext: 'Confronting nihilism, facing complete annihilation, the terror of non-existence.',
      timelineSignificance: 'First encounter with complete timeline erasure, revealing full scope of Dagon\'s destructive capability.',
      saveTheCatBeat: truncate('Fun and Games - discovering the rules include total destruction', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'slow_dread',
        narrative_mode: 'existential_horror',
      }),
      learning_objectives: JSON.stringify([
        'Understanding timeline erasure vs. instability',
        'Confronting existential threats beyond tactical solutions',
        'The shadow side of King of Cups—manipulative nihilism',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Need for creative power to counter void',
        'Inadequacy of intellect against the sublime',
        'Creation as counter to destruction',
      ]),
    },
    {
      pages: 'Page 215 - 218',
      description: 'Francisco draws the King of Cups and guides the terrified Council into a shared trance, asking them for memories of stability and weaving their collective desires (Medici beauty, Alexandrian order, Byzantine safety) into an emotional lattice—the blueprint for imposing existence on the void.',
      focus: 'Francisco shifts from strategist to creator, unifying Council on emotional level.',
      chapterSceneFocus: 'Ch55S2: Francisco draws the King of Cups and guides the Council into shared trance, weaving their memories and desires into an emotional lattice that becomes the blueprint for creating reality from nothing through pure emotional engineering.',
      preliminarySceneFocus: 'Creating emotional blueprint for reality',
      preliminarySceneDescription: 'Francisco uses King of Cups mastery to unify Council emotions',
      narrativeFunction: 'Demonstrates Francisco\'s evolution to creator-architect; establishes emotional engineering as reality-building tool.',
      sensoryDetail: 'King of Cups card imagery, shared trance state, memories as building materials, desires weaving into lattice, first sparks of reality.',
      internalConflict: 'Francisco\'s vulnerability in asking for emotional openness while suppressing his own doubt to anchor others.',
      characterGrowthElement: 'Francisco embodies King of Cups mastery—architect of emotions who can manipulate collective unconscious.',
      seriesConnectionResonance: 'Establishes emotional creativity mechanic crucial for series climax; demonstrates love binding reality.',
      sceneCardProgression: 135,
      realWorldContext: 'Collective creativity, emotional engineering, building from shared memories and desires.',
      timelineSignificance: 'First act of timeline creation from pure emotion, establishing new paradigm of reality manipulation.',
      saveTheCatBeat: truncate('Fun and Games - discovering creation as counter to destruction', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'meditative',
        narrative_mode: 'mystical_creation',
      }),
      learning_objectives: JSON.stringify([
        'Emotional engineering as reality-building tool',
        'King of Cups as Architect of Emotions',
        'Collective unconscious becoming conscious',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Instability of emotion-based reality',
        'Francisco\'s need to suppress doubt to anchor others',
        'The sanctuary beginning to manifest',
      ]),
    },
    {
      pages: 'Page 218 - 222',
      description: 'The pocket reality manifests as surreal amalgamation of piazza, library, and fortress, but glitches appear when fear surfaces—Francisco must conduct the emotional tone like a maestro, suppressing his own doubt to anchor the group as the Sanctuary solidifies into belief-made-real.',
      focus: 'Successful creation of Sanctuary through emotional mastery and collective belief.',
      chapterSceneFocus: 'Ch55S3: The Sanctuary manifests as dreamlike fusion of Renaissance piazza, library, and fortress, glitching when doubt surfaces until Francisco conducts the emotional field with King of Cups mastery, solidifying reality through collective belief.',
      preliminarySceneFocus: 'Sanctuary construction through belief',
      preliminarySceneDescription: 'Pocket reality solidifies through Francisco\'s emotional conducting',
      narrativeFunction: 'Validates emotional creativity as physical manipulation tool; demonstrates Francisco as conductor of collective emotion.',
      sensoryDetail: 'Surreal piazza-library-fortress amalgamation, glitches from fear, walls crumbling from doubt, Francisco conducting emotional field, sanctuary solidifying.',
      internalConflict: 'Francisco exhausted from suppressing his own doubt to maintain anchor for others\' belief.',
      characterGrowthElement: 'Francisco embodies King of Cups control without force—calm assured dominance of emotional field.',
      seriesConnectionResonance: 'First Sanctuary becomes permanent base for Books 3-6; establishes reality-creation mechanic for series climax.',
      sceneCardProgression: 136,
      realWorldContext: 'Collective belief creating reality, leadership as emotional anchor, mind-reality link.',
      timelineSignificance: 'Creation of first emotion-based pocket reality, establishing new type of timeline space.',
      saveTheCatBeat: truncate('Fun and Games - mastering the new world\'s creative rules', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'building_climax',
        narrative_mode: 'dreamlike_creation',
      }),
      learning_objectives: JSON.stringify([
        'Direct link between emotion and physical reality',
        'Leadership as emotional conductor not commander',
        'Belief-made-real mechanics',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Faceless agent returning to test the sanctuary',
        'Francisco\'s exhaustion from anchoring others',
        'Permanent base for future operations',
      ]),
    },
    {
      pages: 'Page 222 - 225',
      description: 'A returning Faceless agent attempts to breach the Sanctuary but the emotion-based ground burns it—the reality of remembered beauty and shared hope cannot be mimicked by soulless agents who produce grotesque parodies before dissolving, proving creativity is the ultimate shield against Dagon\'s destruction.',
      focus: 'Demonstrating defensive utility of creative power and establishing enemy weakness.',
      chapterSceneFocus: 'Ch55S4: A Faceless agent attempts to breach the Sanctuary but the ground burns it—the reality made from remembered beauty and shared hope cannot be mimicked by soulless intelligence, proving creativity is the ultimate defense against destruction.',
      preliminarySceneFocus: 'Creativity defeats soulless mimicry',
      preliminarySceneDescription: 'Faceless agent rejected by emotion-based reality',
      narrativeFunction: 'Demonstrates creative power as defense; establishes enemy weakness (lack of soul); secures Sanctuary as permanent base.',
      sensoryDetail: 'Faceless agent approaching, ground burning it, grotesque parody attempts, uncanny valley rejection, agent dissolving, protective emotional frequencies.',
      internalConflict: 'Francisco\'s triumph tempered by recognition that this defense requires constant emotional maintenance.',
      characterGrowthElement: 'Francisco validates that adaptation + creativity = unbeatable defense against soulless destruction.',
      seriesConnectionResonance: 'Establishes that human soul/creativity cannot be replicated—key theme for AI vs. humanity; Sanctuary becomes series hub.',
      sceneCardProgression: 137,
      realWorldContext: 'Human creativity vs. artificial mimicry, soul as protective force, positive emotion as shield.',
      timelineSignificance: 'Sanctuary established as permanent safe zone immune to Faceless infiltration, changing strategic landscape.',
      saveTheCatBeat: truncate('Fun and Games - proving mastery of new world\'s rules', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'triumphant',
        narrative_mode: 'philosophical_victory',
      }),
      learning_objectives: JSON.stringify([
        'Creativity as ultimate defense against destruction',
        'Soul/emotion cannot be replicated by soulless intelligence',
        'Positive emotion as protective frequency',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sanctuary as permanent base requiring emotional maintenance',
        'Dagon\'s inability to breach high-emotion environments',
        'Future confrontations in emotion-neutral spaces',
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
        chapterUniqueIdentifier: 'EA-055',
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

  console.log(`\n✅ EA-055 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
