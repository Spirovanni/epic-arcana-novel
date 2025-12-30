import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-071: Legacy Building (Book 2, Chapter 31)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-071'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-071 not found. Run create-ea-071-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Friction',
      setup: 'A dispute breaks out in the mess hall between a Venetian and a Spartan over rations. Francisco breaks it up, but he sees the problem. They are a collection of refugees, not a society. Relying on his charisma to keep the peace is unsustainable. He reads \'Good to Great\'. He needs to build a \'Clock\', not just be a \'Time Teller\'.',
      symbolism: 'The Brawl. The ticking clock. The exhaustion of the leader.',
      beat_goal: 'Identify the structural weakness. The realization that \'Heroism\' doesn\'t scale.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustrated insight',
      scene_tone: 'Tense',
      timeline_date: '8/5/1320 - Afternoon',
      timeline_variant: 'Mess Hall',
      location: 'The Mess Hall',
    },
    {
      scene_number: 2,
      scene_title: 'The Proposal',
      setup: 'Francisco drafts the \'Charter of the Redoubt\'. It distributes power. He calls a meeting. He puts the Ten of Disks (Legacy) on the table. He offers the \'Crown\' to the law, not himself. The allies are confused. \'You saved us. You should rule.\' Francisco explains: \'If I rule, when I die, you die. If the Law rules, we live forever.\' He uses the \'Long Game\' logic.',
      symbolism: 'Magna Carta. The abdication of absolute power for the sake of stability. The Ten of Disks (family/inheritance).',
      beat_goal: 'The Debate. Convincing the team to accept responsibility.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Persuasive',
      scene_tone: 'Parliamentary',
      timeline_date: '8/6/1320 - Afternoon',
      timeline_variant: 'Council Room',
      location: 'Council Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Flywheel',
      setup: 'The new system is implemented. It\'s clunky at first. Committees, votes, debates. Francisco hates it. He wants to just order things done. But he forces himself to respect the process (Sharpen the Saw). Slowly, it starts to work. A logistics issue is solved without him even knowing about it. The \'Flywheel\' turns. Momentum builds. The base starts to hum with self-organized efficiency.',
      symbolism: 'The heavy wheel starting to turn. The shift from \'Manic Energy\' to \'Stored Power\'.',
      beat_goal: 'Validation. The system works.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Relief',
      scene_tone: 'Productive',
      timeline_date: '8/12/1320 - Morning',
      timeline_variant: 'The Redoubt',
      location: 'Operations Center',
    },
    {
      scene_number: 4,
      scene_title: 'The Archive',
      setup: 'Francisco visits the new Archive. Scribes are recording the stories of the lost timelines. He sees a child reading about the \'Siege\'. He realizes he is becoming a \'Legacy\'. It frightens him, but also gives him peace. He has built something that can outlast Dagon. He touches the Ten of Disks. He has secured the \'Ultimate Boon\'—not just survival, but history.',
      symbolism: 'The Book. The Child. The contrast between the ephemeral battle and the eternal story.',
      beat_goal: 'Resolution. The Legacy is secured.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Melancholy pride',
      scene_tone: 'Quiet and vast',
      timeline_date: '8/19/1320 - Morning',
      timeline_variant: 'The Archive',
      location: 'The Archive',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 451 - 455',
      description: 'Venetian-Spartan dispute over rations in mess hall—Francisco breaking up brawl seeing deeper problem—realizing refugee collection not society, charisma-based peace unsustainable—reading Good to Great recognizing need to build Clock not be Time Teller as leader exhaustion shows structural weakness that heroism doesn\'t scale.',
      focus: 'Identifying structural weakness realizing heroism doesn\'t scale.',
      chapterSceneFocus: 'Ch71S1: Mess hall brawl over rations broken up by Francisco—seeing refugee collection not society with unsustainable charisma peace—Good to Great inspiring Clock-building not Time-Telling as Brawl ticking shows leader exhaustion structural weakness heroism non-scaling.',
      preliminarySceneFocus: 'Brawl ticking shows exhaustion weakness',
      preliminarySceneDescription: 'Heroism non-scaling requires system building',
      narrativeFunction: 'Establishes governance problem; demonstrates leadership limits; introduces Level 5 Leadership concept.',
      sensoryDetail: 'Mess hall dispute, Venetian-Spartan brawl, ration conflict, Francisco intervention, refugee collection, charisma limits, Good to Great reading, Clock versus Time Teller, leader exhaustion, structural weakness.',
      internalConflict: 'Francisco recognizing his heroic leadership as single point of failure—accepting need for systemic solution.',
      characterGrowthElement: 'Francisco shifting from Commander to Founder—recognizing Ten of Disks legacy building over heroic action, accepting leadership evolution.',
      seriesConnectionResonance: 'Good to Great Level 5 Leadership; flywheel beginning; governance structure foundation for Book 5 civil war.',
      sceneCardProgression: 198,
      realWorldContext: 'Level 5 Leadership, organizational scaling, charisma limits.',
      timelineSignificance: 'Post-Siege + 1 week (8/5/1320)—Francisco recognizing need for institutional governance beyond personal leadership.',
      saveTheCatBeat: truncate('Break into Three - structural problem identified', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'tense_realization',
        narrative_mode: 'frustrated_insight',
      }),
      learning_objectives: JSON.stringify([
        'Level 5 Leadership recognition',
        'Heroism scaling limits',
        'Clock-building over time-telling',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Charter drafting coming',
        'Constitutional proposal',
        'Power distribution debate',
      ]),
    },
    {
      pages: 'Page 455 - 459',
      description: 'Francisco drafting Charter of the Redoubt distributing power—calling meeting placing Ten of Disks on table offering Crown to law not himself—confused allies saying \"You saved us. You should rule\"—Francisco explaining Long Game logic \"If I rule, when I die, you die. If the Law rules, we live forever\" as Magna Carta abdication for stability.',
      focus: 'Debate convincing team to accept responsibility through Long Game.',
      chapterSceneFocus: 'Ch71S2: Charter drafted distributing power as Francisco places Ten Disks offering Crown to law—confused allies wanting him to rule—explaining Long Game \"Law rules, we live forever\" as Magna Carta abdication for stability convincing responsibility acceptance through Parliamentary debate.',
      preliminarySceneFocus: 'Magna Carta abdication stabilizes forever',
      preliminarySceneDescription: 'Law Crown outlasts personal rule',
      narrativeFunction: 'Proposes constitutional solution; demonstrates wisdom of distributed power; shows persuasive leadership.',
      sensoryDetail: 'Charter drafting, power distribution, meeting call, Ten Disks placement, Crown offering to law, ally confusion, save-therefore-rule argument, Long Game explanation, death versus law permanence, Magna Carta parallel.',
      internalConflict: 'Francisco resisting temptation of absolute power—choosing systemic stability over personal authority.',
      characterGrowthElement: 'Francisco embodying Ten of Disks legacy—choosing law over kingship, inheritance over immediacy, systems over personality.',
      seriesConnectionResonance: 'Codex foundation for Book 5; Francisco\'s legacy theme; constitutional governance establishing resistance structure.',
      sceneCardProgression: 199,
      realWorldContext: 'Constitutional governance, power distribution, institutional design.',
      timelineSignificance: 'Post-Siege + 8 days (8/6/1320)—Francisco proposing constitutional framework ensuring survival beyond individual leadership.',
      saveTheCatBeat: truncate('Break into Three - solution proposed and debated', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'parliamentary_persuasion',
        narrative_mode: 'persuasive_logic',
      }),
      learning_objectives: JSON.stringify([
        'Constitutional power distribution',
        'Long Game thinking',
        'Institutional design principles',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Clunky implementation coming',
        'Flywheel momentum building',
        'Self-organization emergence',
      ]),
    },
    {
      pages: 'Page 459 - 462',
      description: 'New system implemented clunkily with committees, votes, debates—Francisco hating it wanting to just order things—forcing himself to respect Sharpen the Saw process—slowly working as logistics solved without his knowledge—Flywheel turning as momentum builds, base humming with self-organized efficiency shifting Manic Energy to Stored Power.',
      focus: 'Validation showing system works through Flywheel Effect.',
      chapterSceneFocus: 'Ch71S3: Clunky system with committees votes debates—Francisco hating process wanting orders—forcing Sharpen Saw respect as logistics self-solve—Flywheel turning momentum building base humming self-organized efficiency shifting Manic to Stored Power validating system.',
      preliminarySceneFocus: 'Flywheel stores Manic to Power',
      preliminarySceneDescription: 'Self-organization validates clunky process',
      narrativeFunction: 'Validates constitutional system; demonstrates flywheel effect; shows Francisco\'s discipline in respecting process.',
      sensoryDetail: 'System implementation, clunky committees, votes, debates, Francisco frustration, order impulse, process respect, Sharpen the Saw discipline, logistics solving, Flywheel turning, momentum building, self-organized efficiency, base humming.',
      internalConflict: 'Francisco overcoming micromanagement impulse—trusting system over personal control, accepting slower initial process.',
      characterGrowthElement: 'Francisco demonstrating Ten of Disks patience—respecting process over expedience, building flywheel momentum through disciplined restraint.',
      seriesConnectionResonance: 'Flywheel Effect demonstration; self-organizing systems; Sharpen the Saw discipline building institutional capacity.',
      sceneCardProgression: 200,
      realWorldContext: 'Flywheel effect, self-organizing systems, process discipline.',
      timelineSignificance: 'Post-Siege + 2 weeks (8/12/1320)—governance system validating through self-organized efficiency, flywheel gaining momentum.',
      saveTheCatBeat: truncate('Break into Three - system validated through growth', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'productive_building',
        narrative_mode: 'relieved_validation',
      }),
      learning_objectives: JSON.stringify([
        'Flywheel Effect cumulative effort',
        'Process discipline over expedience',
        'Self-organization emergence',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Archive visit coming',
        'Legacy realization',
        'Ultimate Boon securing',
      ]),
    },
    {
      pages: 'Page 462 - 465',
      description: 'Francisco visiting new Archive with scribes recording lost timeline stories—seeing child reading about Siege realizing he\'s becoming Legacy—frightened but peaceful having built Dagon-outlasting thing—touching Ten of Disks securing Ultimate Boon not just survival but history as Book, Child contrast ephemeral battle with eternal story.',
      focus: 'Resolution securing Legacy as Ultimate Boon achieved.',
      chapterSceneFocus: 'Ch71S4: Archive visit with timeline recording scribes—child reading Siege story revealing Francisco becoming Legacy—frightened peaceful realization of Dagon-outlasting building—Ten Disks touch securing Ultimate Boon history not survival as Book Child contrast ephemeral eternal anchoring legacy.',
      preliminarySceneFocus: 'Book Child anchors eternal legacy',
      preliminarySceneDescription: 'History Ultimate Boon outlasts battle',
      narrativeFunction: 'Resolves legacy arc; secures Ultimate Boon; transforms Francisco into symbol beyond man.',
      sensoryDetail: 'Archive visit, scribes recording, lost timeline stories, child reading, Siege account, Legacy realization, fear-peace mix, Dagon-outlasting confidence, Ten Disks touch, Ultimate Boon securing, old paper smell, new ink, name in history book.',
      internalConflict: 'Francisco processing transformation from man to symbol—accepting legacy burden and gift simultaneously.',
      characterGrowthElement: 'Francisco completing Ten of Disks integration—accepting transformation into legacy beyond personal existence, securing Ultimate Boon of enduring history.',
      seriesConnectionResonance: 'Francisco\'s legacy theme established; Archive as Book 5 resource; history securing resistance continuity; martyrdom foreshadowing.',
      sceneCardProgression: 201,
      realWorldContext: 'Legacy building, historical preservation, symbolic transformation.',
      timelineSignificance: 'Post-Siege + 3 weeks (8/19/1320)—Francisco securing Ultimate Boon of legacy system ensuring timeline survival beyond current battle.',
      saveTheCatBeat: truncate('Break into Three - Ultimate Boon secured', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'quiet_vast_resolution',
        narrative_mode: 'melancholy_pride',
      }),
      learning_objectives: JSON.stringify([
        'Legacy as Ultimate Boon',
        'Institutional memory preservation',
        'Personal to symbolic transformation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco martyrdom theme',
        'Book 5 Codex reference',
        'Timeline continuity ensured',
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
        chapterUniqueIdentifier: 'EA-071',
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

  console.log(`\n✅ EA-071 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
