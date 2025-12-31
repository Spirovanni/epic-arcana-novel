import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-073: Benevolence (Book 2, Chapter 33)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-073'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-073 not found. Run create-ea-073-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Call for Help',
      setup: 'The Redoubt is under fire. Dagon\'s siege engines are pounding the walls. The \'Legacy\' (EA-071) is threatened. They need to leave. A distress signal comes from the Boundary Lands. It\'s the Grey Traders. They are pinned down by a Dagon patrol. The Council says \'Let them die; it\'s a distraction.\' Francisco says \'No. We help.\'',
      symbolism: 'The Distress Flare. The ignored plea. The choice between Self-Preservation and Benevolence.',
      beat_goal: 'The Moral Choice. Choosing to act against tactical logic.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Empathic resolve',
      scene_tone: 'Urgent',
      timeline_date: '10/29/1320 - Morning',
      timeline_variant: 'War Room',
      location: 'War Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Gift',
      setup: 'Francisco leads a sortie to save the Traders. They drive off the patrol. He meets the Captain, a suspicious, scarred woman. She expects a demand for payment. Francisco sees their starving children (The Orphanage). He calls for the supply wagons. He starts unloading the food. \'This is for you.\' The Captain is stunned. \'What do you want?\' \'Nothing. We are neighbors.\'',
      symbolism: 'The Bread breaking. The Six of Disks image (merchant giving alms). The scales balancing.',
      beat_goal: 'The Action. The unexpected act of grace.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Pure generosity',
      scene_tone: 'Moving',
      timeline_date: '10/29/1320 - Late Afternoon',
      timeline_variant: 'The Grey Camp',
      location: 'The Boundary Lands',
    },
    {
      scene_number: 3,
      scene_title: 'The Exchange',
      setup: 'That night, in the Trader camp. The Captain sits with Francisco. She explains why they hide. Dagon hunts them. Because Francisco helped them, she trusts him. She reveals a secret path through the \'Slipstream\' that Dagon doesn\'t know. It\'s the \'Magic Flight\' route. \'You gave us life,\' she says. \'We give you the road.\' The Reciprocity Loop (Give and Take) completes.',
      symbolism: 'The Map appearing on the table. The shaking of hands. The circle closing.',
      beat_goal: 'The Reward. The solution appears because of the character\'s virtue.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Validated',
      scene_tone: 'Secretive',
      timeline_date: '10/29/1320 - Night',
      timeline_variant: 'Captain\'s Tent',
      location: 'Trade Camp',
    },
    {
      scene_number: 4,
      scene_title: 'The Open Road',
      setup: 'The withdrawal begins. The Redoubt is evacuated. The Grey Traders guide the convoy into the mists. Dagon\'s forces breach the empty base moments later. They find nothing. Francisco looks back at the empty shell of his \'Legacy\'. It hurts to leave, but he knows the *people* are safe because he chose Benevolence over Defense. They vanish into the Slipstream.',
      symbolism: 'The Empty Fortress. The Fog swallowing the army. The transition from Earth (Redoubt) to Air (Flight).',
      beat_goal: 'Resolution. The Escape begins.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Bittersweet relief',
      scene_tone: 'Misty',
      timeline_date: '10/30/1320 - Morning',
      timeline_variant: 'The Slipstream',
      location: 'The Boundary',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 481 - 485',
      description: 'Redoubt under fire from Dagon siege engines pounding walls—Legacy threatened requiring evacuation—distress signal from Boundary Lands Grey Traders pinned by Dagon patrol—Council saying \"Let them die; distraction\" rejected by Francisco \"No. We help\" choosing empathic resolve against tactical logic through Distress Flare ignored plea Self-Preservation versus Benevolence choice.',
      focus: 'Moral Choice choosing to act against tactical logic.',
      chapterSceneFocus: 'Ch73S1: Siege engines pounding Redoubt walls threatening Legacy requiring evacuation—Boundary Lands distress from pinned Grey Traders—Council rejecting as distraction overruled by Francisco helping choosing Benevolence over Self-Preservation through ignored plea moral test.',
      preliminarySceneFocus: 'Flare plea tests Self-Preservation choice',
      preliminarySceneDescription: 'Benevolence chosen against tactical logic urgently',
      narrativeFunction: 'Establishes moral test; demonstrates empathic leadership over tactical cold calculation; introduces Grey Traders.',
      sensoryDetail: 'Redoubt fire, Dagon siege engines, wall pounding, Legacy threat, evacuation need, distress signal, Boundary Lands, Grey Traders, Dagon patrol pinning, Council dismissal, distraction label, Francisco refusal, help declaration.',
      internalConflict: 'Francisco choosing empathy over tactical advantage—risking resources to help strangers during crisis.',
      characterGrowthElement: 'Francisco embodying Six of Disks benevolence—placing others\' interests first despite tactical disadvantage, practicing Go-Giver principles.',
      seriesConnectionResonance: 'Go-Giver demonstration; ethical leadership versus tyranny contrast; Trader network foundation; karma mechanic establishing Book 3 payoff.',
      sceneCardProgression: 206,
      realWorldContext: 'Empathic leadership, moral choice under pressure, helping despite cost.',
      timelineSignificance: 'Post-Siege + 3 months (10/29/1320)—Dagon overwhelming attack forcing evacuation, Francisco choosing benevolence establishing escape route.',
      saveTheCatBeat: truncate('Break into Three - moral choice over tactics', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'urgent_moral',
        narrative_mode: 'empathic_resolve',
      }),
      learning_objectives: JSON.stringify([
        'Go-Giver principle application',
        'Empathy over tactics',
        'Moral leadership under pressure',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Gift giving coming',
        'Starving children revelation',
        'Unexpected generosity shocking',
      ]),
    },
    {
      pages: 'Page 485 - 488',
      description: 'Francisco leading sortie saving Traders driving off patrol—meeting suspicious scarred Captain expecting payment demand—seeing starving Orphanage children calling supply wagons—unloading food declaring \"This is for you\" stunning Captain asking \"What do you want?\" answered \"Nothing. We are neighbors\" as Bread breaks Six Disks merchant giving alms balancing scales through unexpected grace act.',
      focus: 'Action through unexpected act of grace moving generously.',
      chapterSceneFocus: 'Ch73S2: Sortie saving Traders driving patrol off—suspicious Captain expecting payment seeing starving children—Francisco unloading food \"This is for you\" stunning \"What want?\" answered \"Nothing. Neighbors\" as Bread Six Disks alms balance scales through pure generosity grace turn.',
      preliminarySceneFocus: 'Bread Six Disks balances scales',
      preliminarySceneDescription: 'Pure generosity shocks expecting payment gracefully',
      narrativeFunction: 'Delivers benevolent action; shocks cynical Traders with generosity; demonstrates Six of Disks giving freely.',
      sensoryDetail: 'Sortie leading, Trader saving, patrol driving, Captain meeting, suspicious scar, payment expectation, Orphanage children, starvation sight, supply wagon call, food unloading, gift declaration, Captain stunning, want question, neighbor answer, hand hovering weapon dropping, children eyes widening, fresh fruit, soldiers proud.',
      internalConflict: 'Francisco giving freely without expectation—trusting benevolence over transactional thinking.',
      characterGrowthElement: 'Francisco demonstrating Six of Disks pure generosity—giving to scales without demanding return, embodying merchant giving alms imagery.',
      seriesConnectionResonance: 'Six of Disks act establishing Trader trust; orphanage protection revealing; neighbor ethic versus tyranny; generosity opening doors force seals.',
      sceneCardProgression: 207,
      realWorldContext: 'Strategic generosity, giving without expectation, trust building.',
      timelineSignificance: 'Hours after distress (10/29/1320 late afternoon)—Francisco\'s gift establishing trust foundation for escape route revelation.',
      saveTheCatBeat: truncate('Break into Three - generosity shocks cynics', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'moving_graceful',
        narrative_mode: 'pure_generosity',
      }),
      learning_objectives: JSON.stringify([
        'Strategic generosity power',
        'Giving without expectation',
        'Trust through benevolence',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Reciprocity loop completing',
        'Slipstream path revelation',
        'Road gifting coming',
      ]),
    },
    {
      pages: 'Page 488 - 491',
      description: 'Night in Trader camp Captain sitting with Francisco—explaining Dagon hunting why they hide—Francisco help creating trust revealing secret Slipstream path Dagon doesn\'t know—Magic Flight route offered \"You gave us life, we give you the road\" completing Give and Take Reciprocity Loop as Map appears table hands shake circle closes validating virtue reward.',
      focus: 'Reward where solution appears because of character virtue.',
      chapterSceneFocus: 'Ch73S3: Night camp Captain explaining Dagon hunt hiding—Francisco help creating trust revealing secret Slipstream Dagon-unknown—Magic Flight \"life-given road-given\" completing Give Take Reciprocity as Map hands circle close validating virtue secretive Boon reward.',
      preliminarySceneFocus: 'Map hands circle close virtue',
      preliminarySceneDescription: 'Reciprocity completes virtue rewarding secretively',
      narrativeFunction: 'Delivers reciprocity payoff; reveals escape solution; demonstrates Give and Take principle completion.',
      sensoryDetail: 'Night timing, Trader camp, Captain sitting, Dagon hunt explanation, hiding reasons, help-created trust, secret path revelation, Slipstream mention, Dagon ignorance, Magic Flight route, life-road exchange, Reciprocity completion, Map appearing, hand shaking, circle closing.',
      internalConflict: 'Francisco receiving unexpected reward—validating benevolence strategy over force-based approach.',
      characterGrowthElement: 'Francisco experiencing Six of Disks reciprocity—learning giving creates value, successful givers receive, virtue rewarded materially.',
      seriesConnectionResonance: 'Give and Take demonstration; Trader courier network established; Slipstream path critical for escape; karma mechanic validated.',
      sceneCardProgression: 208,
      realWorldContext: 'Reciprocity principle, value creation through giving, virtue rewarded.',
      timelineSignificance: 'Night 10/29/1320—critical escape path revealed through benevolence, enabling Redoubt evacuation next morning.',
      saveTheCatBeat: truncate('Break into Three - virtue rewarded with solution', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'secretive_revelation',
        narrative_mode: 'validated_trust',
      }),
      learning_objectives: JSON.stringify([
        'Give and Take reciprocity',
        'Value creation through giving',
        'Virtue material rewards',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Evacuation beginning',
        'Empty fortress leaving',
        'Slipstream vanishing',
      ]),
    },
    {
      pages: 'Page 491 - 495',
      description: 'Withdrawal beginning with Redoubt evacuation—Grey Traders guiding convoy into mists—Dagon forces breaching empty base finding nothing—Francisco looking back at empty Legacy shell—hurting to leave but knowing people safe through Benevolence over Defense choice—vanishing into Slipstream as Empty Fortress Fog swallows army transitioning Earth Redoubt to Air Flight departure.',
      focus: 'Resolution showing Escape begins bittersweet misty.',
      chapterSceneFocus: 'Ch73S4: Evacuation withdrawal with Trader mist guidance—Dagon breaching empty finding nothing—Francisco viewing empty Legacy shell—leave-hurt but people-safe through Benevolence choice—Slipstream vanishing as Fortress Fog Earth-to-Air Flight transition departing bittersweet.',
      preliminarySceneFocus: 'Fortress Fog swallows Air Flight',
      preliminarySceneDescription: 'Benevolence saves people leaving legacy bittersweet',
      narrativeFunction: 'Resolves escape arc; demonstrates benevolence payoff; transitions from static defense to mobile flight.',
      sensoryDetail: 'Withdrawal beginning, Redoubt evacuation, Trader guidance, mist convoy, Dagon breach, empty base, nothing found, Legacy looking back, empty shell, leave hurting, people safety, Benevolence choice validation, Slipstream vanishing, Novella Captain nod, rear guard check, fog silence.',
      internalConflict: 'Francisco accepting Legacy loss—prioritizing people over place, embodying benevolence over defensive attachment.',
      characterGrowthElement: 'Francisco completing Six of Disks benevolence—accepting material loss for people preservation, validating giving over hoarding or defending.',
      seriesConnectionResonance: 'Escape route explanation; ethical leadership payoff; Trader network courier established; Earth-to-Air elemental transition; Road Back journey beginning.',
      sceneCardProgression: 209,
      realWorldContext: 'Strategic retreat, people over place priority, benevolence validation.',
      timelineSignificance: 'Next morning 10/30/1320—successful evacuation through benevolence-earned Trader guidance, Redoubt abandoned but people preserved.',
      saveTheCatBeat: truncate('Break into Three - benevolence enables escape', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'misty_departure',
        narrative_mode: 'bittersweet_relief',
      }),
      learning_objectives: JSON.stringify([
        'People over place priority',
        'Benevolence strategic validation',
        'Material loss for preservation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Flight journey continuing',
        'Trader network future use',
        'Book 3 karma payoff',
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
        chapterUniqueIdentifier: 'EA-073',
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

  console.log(`\n✅ EA-073 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
