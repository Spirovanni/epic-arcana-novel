import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

function truncate(str: string | null | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('🔍 Searching for EA-043 in outline...\n');

  // EA-043 Data extracted from outline
  const ea043Data = {
    unique_identifier: 'STG 2.1.1.3',
    title: 'Intense Force',
    specific_task_group_title: 'Intense Force',
    epic_novel_pages: 'Pages 16 - 30',
    epic_chapter_focus: 'Inciting Incident',
    epic_novel_chapter_focus: 'Scene I: The Ordinary World',
    tarot_family: 'Cups',
    tarot_card_item: 'Knight',
    hero_journey_beat: 'The Call to Adventure',
    save_the_cat_beat: 'Inciting Incident',
    summary: "The temporal storm intensifies, and Francisco discovers that his willpower alone can channel the Trionfi cards' power more effectively than complex rituals. He must overcome his academic need to understand everything before acting, learning to trust his instincts and inner resolve to protect those he loves.",
    character_arcs: {
      Francisco: 'Learning to trust intuition over intellect. His first real demonstration of leadership under pressure.',
      La_Signora: "Reveals her ability to see through temporal illusions, becoming Francisco's guide through the chaos.",
      Gherardo: "Witnesses Francisco's power firsthand, deepening his jealousy and sense of inadequacy.",
    },
    story_gaps_addressed: {
      trionfi_system: 'Establishes that emotional state and willpower affect card effectiveness - introduces the personal cost of power.',
      character_motivation: "Francisco's protective instincts toward his family become a driving force throughout the series.",
      power_systems: 'Shows how supernatural abilities drain the user and require recovery time.',
    },
    location_details: {
      reality_fractures: 'Parts of Bologna exist in multiple time periods simultaneously - Roman architecture overlapping with medieval and glimpses of future cities.',
      family_home_sanctuary: "Francisco's house becomes a stable point in the chaos, protected by his focused willpower.",
    },
    series_connections: {
      power_evolution: "Francisco's first major use of willpower to channel the cards, setting up his growth in Books 3-4.",
      protective_theme: 'Establishes Francisco\'s role as protector, which will evolve into cosmic guardian in Book 9.',
    },
    scenes: [
      {
        scene_number: 1,
        scene_title: 'Intuition Over Intellect',
        symbolism: "The Knight of Cups abandoning the chalice's complex vessel for direct emotional channeling: willpower itself becomes the ritual, demonstrating that mental grit and focused determination surpass elaborate technique when circumstances demand immediate, unwavering resolve and instinctive action.",
        beat_goal: 'Francisco discovers that willpower alone channels Trionfi power more effectively than rituals, learning to trust instinct over intellect and establishing the personal cost principle that emotional state affects card effectiveness.',
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Breakthrough realization and empowerment',
        scene_tone: 'Intense and revelatory',
        timeline_date: 'Post-Book 1 + 4 days (late afternoon)',
        timeline_variant: 'Reality Fractures Intensifying',
        location: "Bologna - Francisco's Family Home (Sanctuary Point)",
      },
      {
        scene_number: 2,
        scene_title: 'The Protector Awakens',
        symbolism: "The Knight charging despite mounting wounds: Francisco's willpower becomes both weapon and sacrifice, proving determination can reshape destiny while revealing that raw resolve demands personal cost—effort and recovery, not just sustained passion but sustainable practice of mental grit.",
        beat_goal: "Francisco demonstrates leadership under pressure by protecting trapped citizens through willpower-channeled cards, establishing that supernatural abilities drain users and require recovery, while Gherardo's witnessed jealousy deepens and Francisco's protective instincts become his driving force.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Protective determination and mounting exhaustion',
        scene_tone: 'Heroic yet draining',
        timeline_date: 'Post-Book 1 + 4 days (evening)',
        timeline_variant: 'Multiple Time Periods Overlapping',
        location: 'Bologna - Fractured Square (Roman/Medieval/Future Overlay)',
      },
      {
        scene_number: 3,
        scene_title: "Willpower's Limit",
        symbolism: "The Knight's horse faltering mid-charge: intense force without sustainable practice burns out, teaching that cultivating mental grit requires designing systems and routines that automatically reinforce perseverance rather than relying on raw determination alone, revealing willpower's finite nature.",
        beat_goal: 'Francisco confronts the physical and emotional cost of willpower-based power use, faces Gherardo\'s jealous confrontation and family opposition, and must choose between pushing beyond limits or abandoning Bologna, establishing that raw determination needs wisdom and sustainable practice to avoid self-destruction.',
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Desperate exhaustion and conflicted duty',
        scene_tone: 'Tense and intimate',
        timeline_date: 'Post-Book 1 + 4 days (late evening)',
        timeline_variant: 'Sanctuary Holding',
        location: "Bologna - Francisco's Family Home",
      },
      {
        scene_number: 4,
        scene_title: 'Resolve Renewed',
        symbolism: 'The Knight dismounting to tend the horse before continuing the charge: true willpower requires building keystone routines and habit systems that embed daily persistence rituals, proving that conquering obstacles demands not just raw determination but leveraging immediate rewards and adjusted practices to optimize long-term perseverance.',
        beat_goal: 'Francisco learns to sustain willpower through sustainable systems and distributed leadership, teaching others to help stabilize reality and transforming raw determination into persistent practice, establishing his evolution toward true guardianship through habit-building and team coordination rather than self-destructive solo heroics.',
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Renewed sustainable resolve and collaborative strength',
        scene_tone: 'Determined and purposeful',
        timeline_date: 'Post-Book 1 + 4 days (night)',
        timeline_variant: 'Sanctuary as Command Center',
        location: "Bologna - Francisco's Family Home / Preparing for Night Mission",
      },
    ],
  };

  const title = ea043Data.specific_task_group_title || ea043Data.title || 'Intense Force';

  console.log(`✅ Found EA-043: ${title}`);
  console.log(`   Scenes: ${ea043Data.scenes?.length || 0}\n`);

  // Find chapter 43 in database
  const allChapters = await db.select().from(chapters);
  let ch43 = allChapters.find(ch => ch.chapterNumber === 43);

  if (!ch43) {
    console.error(`❌ Chapter 43 not found in database`);
    console.log(`   Available chapter numbers: ${[...new Set(allChapters.map(ch => ch.chapterNumber))].sort((a, b) => a! - b!).join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ Found Chapter 43: ${ch43.title}\n`);

  // Check if scenes already exist for this chapter and delete them
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch43.id));

  if (existingScenes.length > 0) {
    console.log(`🗑️  Deleting ${existingScenes.length} existing scenes for EA-043...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, ch43.id));
  }

  // Update chapter with EA-043 data
  await db
    .update(chapters)
    .set({
      uniqueIdentifier: 'EA-043',
      title: title,
      epicNovelPages: truncate(ea043Data.epic_novel_pages, 50),
      epicChapterFocus: ea043Data.epic_chapter_focus,
      epicNovelChapterFocus: ea043Data.epic_novel_chapter_focus,
      tarotFamily: truncate(ea043Data.tarot_family, 100),
      tarotCardItem: truncate(ea043Data.tarot_card_item, 100),
      heroJourneyBeat: ea043Data.hero_journey_beat?.substring(0, 99) || null,
      saveTheCatBeat: ea043Data.save_the_cat_beat?.substring(0, 100) || null,
      summary: ea043Data.summary,
      characterArcs: typeof ea043Data.character_arcs === 'string'
        ? ea043Data.character_arcs
        : JSON.stringify(ea043Data.character_arcs),
      storyGapsAddressed: typeof ea043Data.story_gaps_addressed === 'string'
        ? ea043Data.story_gaps_addressed
        : JSON.stringify(ea043Data.story_gaps_addressed),
      locationDetails: typeof ea043Data.location_details === 'string'
        ? ea043Data.location_details
        : JSON.stringify(ea043Data.location_details),
      seriesConnections: typeof ea043Data.series_connections === 'string'
        ? ea043Data.series_connections
        : JSON.stringify(ea043Data.series_connections),
    })
    .where(eq(chapters.id, ch43.id));

  console.log('✅ Updated chapter with EA-043 data\n');

  // Import scenes with basic data from outline
  console.log('📝 Importing scenes with basic data...\n');

  const insertedScenes = [];

  for (const sceneData of ea043Data.scenes) {
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch43.id,
        chapterUniqueIdentifier: 'EA-043',
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.symbolism, // Using symbolism as setup
        symbolism: sceneData.symbolism,
        beatGoal: sceneData.beat_goal,
        pov: sceneData.pov,
        tense: sceneData.tense,
        core_emotion: truncate(sceneData.core_emotion, 255),
        scene_tone: truncate(sceneData.scene_tone, 255),
        timeline_date: sceneData.timeline_date,
        timeline_variant: sceneData.timeline_variant,
        location: sceneData.location,
      })
      .returning();

    console.log(`✅ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
    insertedScenes.push(insertedScene);
  }

  console.log('\n📝 Adding comprehensive scene fields...\n');

  // Enhanced scene data with all 29 fields
  const sceneEnhancements = [
    {
      // Scene 1: Intuition Over Intellect
      pages: 'Page 16 - 18',
      description: 'The temporal storm escalates around Bologna as reality fractures intensify. Francisco attempts his usual methodical card rituals—precise hand positions, careful incantations, measured breathing—but the chaos demands immediate action. In desperation, as his family home shudders from temporal pressure, he abandons technique entirely and channels pure willpower through the Knight of Cups card. The effect is instantaneous and powerful: reality stabilizes around his focused determination. Francisco experiences breakthrough realization: the cards respond to emotional intensity and mental grit more than elaborate procedures. This discovery challenges his academic instincts but reveals the personal cost principle—his emotional state directly affects power effectiveness.',
      focus: 'Francisco discovers willpower-based channeling surpasses ritual technique, learning to trust instinct over intellect',
      chapterSceneFocus: truncate('Ch43S1: Breakthrough discovery that willpower channels Trionfi power more effectively than rituals, establishing emotional intensity principle', 255),
      preliminarySceneFocus: 'Francisco abandons methodical rituals in temporal crisis, discovering raw willpower channels card power more effectively',
      preliminarySceneDescription: 'Temporal storm escalates around Bologna as reality fractures intensify. Francisco attempts usual methodical card rituals—precise hand positions, careful incantations, measured breathing—but chaos demands immediate action. In desperation, as family home shudders from temporal pressure, he abandons technique entirely and channels pure willpower through Knight of Cups card. Effect is instantaneous and powerful: reality stabilizes around focused determination. Francisco experiences breakthrough realization: cards respond to emotional intensity and mental grit more than elaborate procedures. This discovery challenges academic instincts but reveals personal cost principle—emotional state directly affects power effectiveness. The Knight of Cups abandoning complex vessel for direct emotional channeling demonstrates willpower itself becomes the ritual when circumstances demand immediate, unwavering resolve.',
      narrativeFunction: 'Establishes the core power system principle for Book 2: willpower and emotional intensity channel Trionfi cards more effectively than elaborate rituals. This scene demonstrates Francisco\'s growth from academic methodology toward instinctive action, introducing the personal cost concept that emotional state affects power effectiveness. The breakthrough revelation challenges his intellectual nature while setting up the protective determination that drives the chapter.',
      sensoryDetail: 'Reality fractures around Bologna—Roman columns phasing through medieval walls, glimpses of future cityscapes flickering. Family home shudders as temporal pressure mounts. Francisco\'s hands position cards with academic precision, voice steady through incantations, breathing measured—but nothing happens. Desperation rising as chaos intensifies. Then abandonment of technique: pure focused willpower channeled through Knight of Cups card gripped tight. Instantaneous power surge—reality snapping back into stability around his determination. The card feels hot in hand, his heart racing, breath ragged from emotional intensity rather than measured ritual.',
      internalConflict: 'Francisco struggles between academic methodology and instinctive action—his intellectual training insists on understanding before doing, but the temporal crisis demands immediate response. The breakthrough discovery that willpower surpasses ritual technique challenges his identity as careful scholar, forcing him to question whether his elaborate procedures were necessary at all or merely comforting illusions of control. He grapples with accepting that emotional intensity and mental grit produce results his careful study couldn\'t achieve.',
      characterGrowthElement: 'Francisco takes his first major step toward trusting intuition over intellect, discovering that his willpower itself—not academic knowledge—provides true power. This breakthrough challenges his scholar identity but awakens protective determination that becomes his driving force. He learns that emotional state and mental grit affect power effectiveness, introducing the personal cost principle that will define his journey: power demands not just technique but genuine emotional investment and unwavering resolve.',
      seriesConnectionResonance: 'Establishes the willpower-based power channeling that defines Francisco\'s unique approach throughout the series, contrasting with ritual-focused practitioners. This discovery of emotional intensity affecting card effectiveness sets up the personal cost theme explored across Books 2-4. The protective determination awakened here evolves into the cosmic guardian role of Book 9, while the tension between intellect and instinct becomes a recurring character conflict.',
      sceneCardProgression: 86,
      realWorldContext: 'The breakthrough that willpower surpasses elaborate technique mirrors real-world discoveries that intense focus and mental grit often outperform complex methodologies when immediate action is required. Francisco\'s struggle between intellectual understanding and instinctive response reflects how crisis situations demand trusting intuition over analysis paralysis. The revelation that emotional state affects effectiveness applies to any skill where passion and determination matter more than perfect execution.',
      timelineSignificance: 'Marks the shift from Reality Fractures Intensifying to Francisco\'s active intervention using willpower-based channeling—the first time he consciously stabilizes temporal chaos through pure determination rather than ritual. This late afternoon of Post-Book 1 + 4 days represents the threshold where Francisco becomes active guardian rather than passive survivor of timeline fracturing.',
      saveTheCatBeat: 'Inciting Incident - Discovery',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the mounting desperation as methodical rituals fail, the shuddering family home demanding immediate action, the abandonment of careful technique in favor of pure willpower channeling, the instantaneous power surge as reality stabilizes, the breakthrough realization that emotional intensity surpasses elaborate procedures, and the challenge to intellectual identity. Show the shift from academic methodology to instinctive determination.',
        sudowrite_emotional_arc: 'Begins with methodical academic approach, escalates through mounting desperation as rituals fail and crisis intensifies, breaks through with abandonment of technique and discovery of willpower channeling, reaches empowered revelation that challenges intellectual identity. The emotional journey is from careful scholarly control through desperate necessity to breakthrough realization and awakened protective determination.',
        sudowrite_sensory_emphasis: 'Emphasize reality fractures (Roman columns through medieval walls, future cityscapes flickering), family home shuddering from temporal pressure, precise ritual positions and measured breathing failing, desperate abandonment of technique, Knight of Cups card gripped tight, instantaneous power surge and reality snapping stable, card feeling hot in hand, heart racing from emotional intensity rather than ritual.',
      },
      learning_objectives: {
        integration: 'Willpower-Based Power Discovery and Instinct Over Intellect',
        terminal_objectives: [
          'Discover that willpower and emotional intensity channel Trionfi power more effectively than elaborate rituals, learning to trust instinct over intellectual methodology',
          'Understand the personal cost principle: emotional state directly affects power effectiveness, requiring genuine investment rather than detached technique',
          'Awaken protective determination as driving force, shifting from academic careful study toward instinctive action when crisis demands immediate response',
        ],
      },
      foreshadowing_elements: [
        'Willpower-based channeling discovery foreshadows Francisco\'s unique power approach throughout series',
        'Personal cost principle (emotional state affecting effectiveness) foreshadows power demands in Books 3-4',
        'Protective determination awakened here foreshadows evolution toward cosmic guardian role in Book 9',
      ],
    },
    {
      // Scene 2: The Protector Awakens
      pages: 'Page 19 - 23',
      description: 'Armed with his willpower-channeling discovery, Francisco ventures into Bologna\'s fractured square where multiple time periods overlap—Roman architecture phasing through medieval streets with glimpses of future cities. Trapped citizens scream as they shift between temporal layers. Francisco demonstrates leadership under pressure, using Knight of Cups channeled through pure determination to stabilize reality pockets and guide people to safety. La Signora appears, revealing her ability to see through temporal illusions and becoming Francisco\'s guide through chaos. But the sustained willpower channeling drains Francisco physically and emotionally—mounting exhaustion as supernatural abilities extract personal cost. Gherardo witnesses Francisco\'s heroic display, his jealousy deepening as he sees the power and respect Francisco commands. Francisco\'s protective instincts toward those he loves become the driving force that pushes him through exhaustion.',
      focus: 'Francisco demonstrates leadership protecting citizens through willpower-channeled cards, establishing power\'s personal cost',
      chapterSceneFocus: truncate('Ch43S2: Francisco demonstrates protective leadership under pressure while discovering supernatural power drains and requires recovery, with Gherardo\'s witnessed jealousy deepening', 255),
      preliminarySceneFocus: 'Francisco uses willpower channeling to protect trapped citizens in temporal overlaps, experiencing power\'s draining cost',
      preliminarySceneDescription: 'Armed with willpower-channeling discovery, Francisco ventures into Bologna\'s fractured square where multiple time periods overlap—Roman architecture phasing through medieval streets with glimpses of future cities. Trapped citizens scream as they shift between temporal layers. Francisco demonstrates leadership under pressure, using Knight of Cups channeled through pure determination to stabilize reality pockets and guide people to safety. La Signora appears, revealing ability to see through temporal illusions and becoming Francisco\'s guide through chaos. But sustained willpower channeling drains Francisco physically and emotionally—mounting exhaustion as supernatural abilities extract personal cost. Gherardo witnesses Francisco\'s heroic display, jealousy deepening as he sees power and respect Francisco commands. Francisco\'s protective instincts toward those he loves become driving force pushing through exhaustion. The Knight charging despite mounting wounds proves determination reshapes destiny while revealing raw resolve demands effort and recovery.',
      narrativeFunction: 'Demonstrates Francisco\'s willpower-based power in action while establishing the critical limitation: supernatural abilities drain users and require recovery time. This scene develops Francisco from solo discovery to protective leadership, introducing La Signora as guide and deepening Gherardo\'s jealous antagonism. The protective instincts awakened here become Francisco\'s primary motivation throughout the series, while the physical/emotional exhaustion introduces sustainable practice needs explored in later scenes.',
      sensoryDetail: 'Fractured square where time periods collide—Roman columns standing solid while medieval cobblestones phase through, future glass towers flickering in and out. Citizens screaming as they shift between temporal layers, bodies half-visible in different eras. Francisco channels Knight of Cups through pure willpower: reality pockets stabilizing around his determination, guided people stumbling to safety. La Signora\'s presence calm amidst chaos, her eyes seeing through illusions. But exhaustion mounting—muscles trembling, breath ragged, vision blurring as power drains. Gherardo watching from safe distance, face twisted with jealousy. Francisco\'s heart pounding with protective desperation.',
      internalConflict: 'Francisco struggles with the mounting physical and emotional cost of willpower channeling—his body trembling with exhaustion while his protective instincts demand he continue saving people. He grapples with the limitation that supernatural abilities drain the user, forcing the question: how much can he give before he collapses? The conflict between his need to protect those he loves and his body\'s clear warnings that raw determination has limits creates desperate tension. Gherardo\'s jealous observation adds social pressure Francisco doesn\'t have energy to address.',
      characterGrowthElement: 'Francisco evolves from solitary scholar to protective leader, his willpower channeling demonstrating both power and responsibility under pressure. He discovers that his protective instincts toward family and citizens provide the emotional intensity that makes cards effective—but also learns the harsh lesson that supernatural abilities exact physical and emotional cost requiring recovery. The growth toward leadership and the awakening of protective determination as driving force define his character arc, while the exhaustion teaches him that raw resolve alone isn\'t sustainable.',
      seriesConnectionResonance: 'Establishes Francisco\'s protective instincts as primary motivation throughout the series, evolving from defending Bologna citizens to cosmic-scale guardian duty in Book 9. La Signora\'s introduction as guide through temporal chaos sets up her mentor role across Books 2-4. Gherardo\'s witnessed jealousy deepens the antagonism that complicates Francisco\'s journey. The power drain and recovery requirement become recurring limitations that force Francisco toward sustainable practice rather than self-destructive heroics.',
      sceneCardProgression: 87,
      realWorldContext: 'The scene mirrors real-world leadership under crisis—stepping up to protect others despite mounting exhaustion and personal cost. Francisco\'s protective instincts driving him through physical limits reflect how genuine care for loved ones motivates heroic effort. The discovery that sustained intense effort drains and requires recovery applies to any demanding situation where passion alone can\'t replace sustainable practice. Gherardo\'s jealousy represents how visible success breeds resentment from those feeling inadequate.',
      timelineSignificance: 'Evening of Post-Book 1 + 4 days marks Francisco\'s first major intervention in Multiple Time Periods Overlapping—actively stabilizing reality rather than merely surviving fractures. This scene establishes that timeline chaos affects innocent citizens, raising stakes from personal survival to protective responsibility that defines Francisco\'s guardian evolution.',
      saveTheCatBeat: truncate('Inciting Incident - Raising the Stakes', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on venturing into fractured square with multiple time periods overlapping, citizens screaming between temporal layers, channeling Knight of Cups through pure determination to stabilize reality pockets, La Signora appearing as guide through chaos, mounting exhaustion as power drains physically and emotionally, Gherardo\'s jealous observation, protective instincts driving through limits. Show the heroic leadership battling against draining personal cost.',
        sudowrite_emotional_arc: 'Begins with determined venture into chaos armed with new discovery, escalates through protective leadership as citizens need saving, intensifies with mounting exhaustion and power drain, reaches desperate persistence driven by protective instincts despite body\'s warnings. The emotional journey is from empowered determination through heroic protection to draining exhaustion that reveals power\'s personal cost.',
        sudowrite_sensory_emphasis: 'Emphasize time periods colliding (Roman columns, medieval cobblestones phasing, future glass towers flickering), citizens screaming and shifting between temporal layers, reality stabilizing around willpower channeling, La Signora\'s calm presence seeing through illusions, trembling muscles and ragged breath from exhaustion, vision blurring as power drains, Gherardo\'s jealous face, heart pounding with protective desperation.',
      },
      learning_objectives: {
        integration: 'Protective Leadership and Power\'s Personal Cost',
        terminal_objectives: [
          'Demonstrate leadership under pressure by protecting trapped citizens through willpower-channeled power, establishing protective instincts as primary motivation',
          'Discover that supernatural abilities drain users physically and emotionally, requiring recovery time and revealing raw determination\'s limits',
          'Accept La Signora as guide through temporal chaos while navigating Gherardo\'s deepening jealousy and social complications of visible power',
        ],
      },
      foreshadowing_elements: [
        'Francisco\'s protective instincts toward citizens foreshadow evolution to cosmic guardian in Book 9',
        'Power drain and recovery requirement foreshadow sustainable practice needs developed in Scene 4',
        'La Signora as temporal chaos guide foreshadows mentor role across Books 2-4',
        'Gherardo\'s witnessed jealousy foreshadows antagonistic complications throughout series',
      ],
    },
    {
      // Scene 3: Willpower's Limit
      pages: 'Page 24 - 27',
      description: 'Francisco returns home trembling with exhaustion, willpower channeling having pushed him to physical and emotional breaking point. His family witnesses his drained state—mother frightened, father demanding he stop this dangerous involvement. Gherardo confronts him, jealous accusations pouring out about Francisco\'s power and heroism making everyone else inadequate. Francisco, too exhausted to manage social diplomacy, faces the stark choice: push beyond his limits and risk self-destruction, or abandon Bologna to temporal chaos. The Knight\'s horse faltering mid-charge symbolizes that intense force without sustainable practice burns out—cultivating mental grit requires designing systems and routines that automatically reinforce perseverance rather than relying on raw determination alone. Francisco must confront that raw willpower, however intense, has finite limits requiring wisdom about when to persist and when to recover.',
      focus: 'Francisco confronts willpower\'s physical/emotional cost and must choose between self-destructive persistence or abandoning Bologna',
      chapterSceneFocus: truncate('Ch43S3: Francisco faces exhaustion limits and family opposition, learning raw determination needs wisdom and sustainable practice to avoid self-destruction', 255),
      preliminarySceneFocus: 'Francisco returns home exhausted, facing family opposition and Gherardo\'s jealous confrontation about power\'s limits',
      preliminarySceneDescription: 'Francisco returns home trembling with exhaustion, willpower channeling having pushed him to physical and emotional breaking point. Family witnesses drained state—mother frightened, father demanding he stop dangerous involvement. Gherardo confronts him, jealous accusations pouring out about Francisco\'s power and heroism making everyone else inadequate. Francisco, too exhausted to manage social diplomacy, faces stark choice: push beyond limits and risk self-destruction, or abandon Bologna to temporal chaos. The Knight\'s horse faltering mid-charge symbolizes that intense force without sustainable practice burns out—cultivating mental grit requires designing systems and routines that automatically reinforce perseverance rather than relying on raw determination alone. Francisco must confront that raw willpower, however intense, has finite limits requiring wisdom about when to persist and when to recover. Desperate exhaustion meets conflicted duty in tense, intimate confrontation.',
      narrativeFunction: 'Forces Francisco to confront the critical limitation of willpower-based power: raw determination alone leads to self-destruction without sustainable practice and wisdom about limits. This scene creates the personal and social pressure that drives Francisco toward the systematic approach developed in Scene 4, while Gherardo\'s jealous confrontation and family opposition add emotional complexity. The stark choice between pushing beyond limits or abandoning Bologna establishes that heroism requires more than intense force—it demands sustainable systems.',
      sensoryDetail: 'Francisco stumbling through door, body trembling with exhaustion, vision blurred. Collapsing into chair as family watches frightened—mother\'s hands wringing, father\'s voice demanding he stop. Gherardo bursting in, face flushed with jealous anger, accusations sharp. Francisco too drained to argue, words slurring with fatigue. Every muscle aching from willpower channeling, heart still racing though body begs for rest. The Knight of Cups card in pocket feels heavy rather than empowering. Outside window, Bologna\'s reality fractures continue pulsing—temporal pressure unrelenting. The weight of choice crushing: self-destruction or abandonment.',
      internalConflict: 'Francisco battles between his protective instincts demanding he continue despite exhaustion and his body\'s clear warnings that pushing further risks self-destruction. He grapples with family opposition—mother\'s fear and father\'s demand to stop—knowing they\'re right about the danger but unable to abandon Bologna to chaos. Gherardo\'s jealous confrontation adds guilt: his power makes others feel inadequate, complicating heroic intentions. The stark realization that raw willpower has finite limits forces painful questioning: is intense determination enough, or does true perseverance require wisdom and sustainable practice?',
      characterGrowthElement: 'Francisco reaches the critical turning point where raw determination meets its limits—his willpower channeling has proven powerful but unsustainable. He must grow beyond relying on intense force alone, learning that cultivating mental grit requires designing systems and routines rather than burning out. The confrontation with family opposition and Gherardo\'s jealousy teaches that heroism isn\'t just about personal power but managing social relationships and accepting help. This scene forces the wisdom that persistence without recovery leads to self-destruction.',
      seriesConnectionResonance: 'Establishes the recurring pattern that Francisco\'s protective instincts sometimes push him toward self-destructive heroics, requiring intervention and sustainable system development explored across Books 2-4. Family opposition to dangerous involvement becomes ongoing tension. Gherardo\'s jealous confrontation deepens the antagonism complicating Francisco\'s journey. The realization that raw willpower needs wisdom foreshadows the evolution toward balanced guardianship rather than solo heroics in Book 9.',
      sceneCardProgression: 88,
      realWorldContext: 'The scene mirrors real-world experiences of burnout from unsustainable intense effort—protective instincts or passionate commitment pushing beyond healthy limits. Francisco\'s family opposition reflects how loved ones recognize self-destructive patterns before the driven person admits them. Gherardo\'s jealous confrontation represents how success breeds resentment and guilt about making others feel inadequate. The stark choice between persistence and recovery applies to any situation where raw determination alone can\'t replace sustainable practice.',
      timelineSignificance: 'Late evening of Post-Book 1 + 4 days marks the crisis point where Sanctuary Holding barely maintains stability—Francisco\'s exhaustion threatens the safe point his willpower created. This scene establishes that timeline protection requires more than individual heroics; it demands sustainable systems and distributed effort explored in Scene 4.',
      saveTheCatBeat: truncate('Debate - Personal Stakes', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on stumbling home trembling with exhaustion, collapsing as family watches frightened, father demanding he stop dangerous involvement, Gherardo\'s jealous confrontation about power making others inadequate, being too drained to manage social diplomacy, the crushing weight of choice between self-destructive persistence or abandoning Bologna, and the painful realization that raw willpower has finite limits. Show the desperate exhaustion meeting conflicted duty.',
        sudowrite_emotional_arc: 'Begins with physical/emotional breaking point and trembling exhaustion, descends through family fear and father\'s opposition, intensifies with Gherardo\'s jealous accusations and social guilt, reaches desperate conflicted choice between self-destruction and abandonment. The emotional journey is from drained collapse through social pressure to painful wisdom about willpower\'s finite nature.',
        sudowrite_sensory_emphasis: 'Emphasize stumbling entrance with trembling body and blurred vision, collapsing exhausted into chair, mother\'s wringing hands and father\'s demanding voice, Gherardo\'s flushed jealous face and sharp accusations, words slurring from fatigue, every muscle aching, heart racing despite begging for rest, Knight of Cups card feeling heavy, reality fractures pulsing outside, crushing weight of impossible choice.',
      },
      learning_objectives: {
        integration: 'Willpower\'s Limits and Need for Sustainable Practice',
        terminal_objectives: [
          'Confront the physical and emotional cost of willpower-based power, facing the breaking point where raw determination leads to self-destruction without recovery',
          'Navigate family opposition and Gherardo\'s jealous confrontation, learning that heroism complicates social relationships and creates guilt about making others feel inadequate',
          'Recognize that intense force without sustainable practice burns out, requiring wisdom about when to persist versus when to recover and build systematic routines that reinforce perseverance automatically',
        ],
      },
      foreshadowing_elements: [
        'The stark choice between self-destruction and abandonment foreshadows Scene 4\'s sustainable system development',
        'Family opposition to dangerous involvement foreshadows ongoing tension across Books 2-4',
        'Gherardo\'s jealous confrontation foreshadows antagonistic complications throughout series',
        'Recognition of willpower\'s limits foreshadows evolution toward balanced guardianship in Book 9',
      ],
    },
    {
      // Scene 4: Resolve Renewed
      pages: 'Page 28 - 30',
      description: 'In the depths of exhaustion and facing impossible choice, Francisco experiences breakthrough wisdom: the Knight dismounting to tend the horse before continuing the charge—true willpower requires building keystone routines and habit systems that embed daily persistence rituals rather than relying on raw determination alone. He gathers his family and willing neighbors, teaching them simple willpower channeling techniques that distribute the protective load. La Signora helps design sustainable shifts where people rotate through reality stabilization efforts, preventing individual burnout. Francisco establishes his family home as command center coordinating distributed leadership rather than solo heroics. This systematic approach leverages immediate rewards (saved neighbors, stable reality pockets) and adjusted practices that optimize long-term perseverance. By transforming raw determination into persistent practice through habit-building and team coordination, Francisco sustains his resolve and establishes evolution toward true guardianship.',
      focus: 'Francisco learns sustainable willpower through distributed leadership and habit systems, transforming raw determination into persistent practice',
      chapterSceneFocus: truncate('Ch43S4: Francisco develops sustainable willpower systems through distributed leadership and habit-building, evolving toward true guardianship rather than self-destructive solo heroics', 255),
      preliminarySceneFocus: 'Francisco teaches others willpower channeling to distribute protective load, establishing sustainable systems and team coordination',
      preliminarySceneDescription: 'In depths of exhaustion and facing impossible choice, Francisco experiences breakthrough wisdom: the Knight dismounting to tend horse before continuing charge—true willpower requires building keystone routines and habit systems that embed daily persistence rituals rather than relying on raw determination alone. He gathers family and willing neighbors, teaching simple willpower channeling techniques that distribute protective load. La Signora helps design sustainable shifts where people rotate through reality stabilization efforts, preventing individual burnout. Francisco establishes family home as command center coordinating distributed leadership rather than solo heroics. This systematic approach leverages immediate rewards (saved neighbors, stable reality pockets) and adjusted practices optimizing long-term perseverance. By transforming raw determination into persistent practice through habit-building and team coordination, Francisco sustains resolve and establishes evolution toward true guardianship. Renewed sustainable resolve and collaborative strength create determined, purposeful tone.',
      narrativeFunction: 'Resolves the chapter\'s central conflict by demonstrating that true willpower requires sustainable systems and distributed leadership rather than self-destructive solo heroics. This scene establishes Francisco\'s evolution from raw determination toward true guardianship through habit-building and team coordination, transforming the personal power discovery of Scene 1 into persistent practice that can protect Bologna long-term. La Signora\'s systematic guidance and family participation create the foundation for Francisco\'s leadership style throughout the series.',
      sensoryDetail: 'Francisco sitting exhausted yet clear-minded, gathering family and neighbors in home now serving as command center. Demonstrating simple willpower channeling techniques—focused breathing, determined visualization, card-holding grips. People practicing cautiously, small reality pockets stabilizing under their combined effort. La Signora sketching shift rotations on parchment, sustainable schedules preventing burnout. Outside window, Bologna\'s fractures still pulse but the coordinated team effort creates rhythm of stability. Immediate rewards visible: saved neighbors returning safely, reality pockets holding longer. Francisco\'s renewed resolve sustained not by raw determination alone but by systematic practice and collaborative strength.',
      internalConflict: 'Francisco struggles with accepting that his solo heroics approach was unsustainable—his protective instincts resist distributing responsibility, fearing others will be harmed. He grapples with trusting family and neighbors to channel willpower effectively, questioning whether teaching them puts them at risk. But the alternative is self-destruction or abandonment, forcing him to accept that true leadership means building systems and teams rather than bearing all burden alone. The shift from raw determination to sustainable practice challenges his identity as individual hero but awakens understanding that guardianship requires persistent practice through habit-building.',
      characterGrowthElement: 'Francisco achieves the critical evolution from raw willpower toward sustainable guardianship by learning that true mental grit requires building keystone routines and habit systems rather than relying on intense force alone. He transforms from solo hero to distributed leader, teaching others and coordinating team efforts that prevent individual burnout. This scene demonstrates growth from self-destructive determination toward wisdom about leveraging immediate rewards and adjusted practices that optimize long-term perseverance. The habit-building and team coordination establish his leadership approach throughout the series.',
      seriesConnectionResonance: 'Establishes Francisco\'s leadership philosophy: distributed guardianship through teaching and team coordination rather than solo heroics. This approach defines his evolution across Books 2-4 toward the cosmic guardian role of Book 9, where reality protection requires systematic cooperation. La Signora\'s systematic guidance positions her as mentor teaching sustainable practice. The habit-building and keystone routines become recurring tools Francisco uses to cultivate persistent mental grit. Family involvement creates ongoing support system despite their opposition to danger.',
      sceneCardProgression: 89,
      realWorldContext: 'The scene mirrors real-world wisdom that sustainable achievement requires building habit systems and distributing leadership rather than relying on raw determination alone. Francisco\'s teaching others to help reflects how true leadership empowers teams instead of bearing all burden solo. The sustainable shifts and rotation schedules apply to any long-term effort where preventing burnout requires systematic practice. Leveraging immediate rewards (visible success) and adjusted routines (scheduled shifts) demonstrates how optimizing persistence beats unsustainable intense force.',
      timelineSignificance: 'Night of Post-Book 1 + 4 days transforms family home into Sanctuary as Command Center—shifting from individual safe point to coordinated protection hub. This establishes the systematic approach to timeline stabilization that will evolve throughout Book 2, preparing for night mission and long-term reality protection rather than crisis-driven heroics.',
      saveTheCatBeat: truncate('Debate - Commitment', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on breakthrough wisdom in exhaustion that willpower requires habit systems not raw determination, gathering family and neighbors to teach distributed channeling techniques, La Signora designing sustainable shift rotations, establishing home as command center coordinating team efforts, visible immediate rewards as reality pockets stabilize under combined effort, and renewed resolve sustained by systematic practice and collaborative strength. Show the transformation from solo heroics to distributed guardianship.',
        sudowrite_emotional_arc: 'Begins with exhausted breakthrough wisdom about sustainable systems, moves through cautious teaching and team coordination, builds with visible success as distributed effort creates stability, reaches renewed sustainable resolve and collaborative empowerment. The emotional journey is from depleted wisdom through systematic team-building to determined purposeful guardianship sustained by habit-building.',
        sudowrite_sensory_emphasis: 'Emphasize exhausted yet clear-minded gathering of family and neighbors in command center home, demonstrated willpower channeling techniques (focused breathing, determined visualization, card grips), people practicing with small reality pockets stabilizing, La Signora\'s shift rotation schedules on parchment, Bologna\'s fractures pulsing against coordinated team rhythm, immediate visible rewards of saved neighbors and stable reality pockets, renewed resolve from systematic practice.',
      },
      learning_objectives: {
        integration: 'Sustainable Willpower Through Distributed Leadership and Habit Systems',
        terminal_objectives: [
          'Learn that true willpower requires building keystone routines and habit systems that embed daily persistence rituals rather than relying on raw determination alone',
          'Transform from solo heroics to distributed leadership by teaching others willpower channeling techniques and coordinating sustainable team efforts that prevent individual burnout',
          'Establish evolution toward true guardianship through habit-building and systematic practice that leverages immediate rewards and adjusted routines to optimize long-term perseverance',
        ],
      },
      foreshadowing_elements: [
        'Distributed leadership philosophy foreshadows Francisco\'s approach across Books 2-4 toward cosmic guardian coordination in Book 9',
        'La Signora\'s systematic guidance foreshadows mentor role teaching sustainable practice throughout series',
        'Habit-building and keystone routines foreshadow recurring tools Francisco uses for persistent mental grit',
        'Family involvement despite danger opposition foreshadows ongoing support system and relationship tension',
      ],
    },
  ];

  for (let i = 0; i < insertedScenes.length; i++) {
    const scene = insertedScenes[i];
    const enhancement = sceneEnhancements[i];

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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 100),
        sudowrite_metadata: JSON.stringify(enhancement.sudowrite_metadata),
        learning_objectives: JSON.stringify(enhancement.learning_objectives),
        foreshadowing_elements: JSON.stringify(enhancement.foreshadowing_elements),
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${i + 1}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-043 complete import finished!');
  console.log('⚡ INTENSE FORCE - Willpower Channeling Mastered!\n');

  // Verify all fields are populated
  console.log('\n📊 Verifying scene completion...\n');

  for (let i = 0; i < insertedScenes.length; i++) {
    const scene = insertedScenes[i];
    const [verifiedScene] = await db
      .select()
      .from(scenes)
      .where(eq(scenes.id, scene.id));

    const fields = [
      'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
      'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
      'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
      'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
      'learning_objectives', 'foreshadowing_elements', 'sceneNumber', 'title', 'setup',
      'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_date',
      'timeline_variant', 'location', 'chapterUniqueIdentifier',
    ];

    const populatedCount = fields.filter(field => verifiedScene[field as keyof typeof verifiedScene] != null).length;
    console.log(`Scene ${i + 1}: ${populatedCount}/${fields.length} fields populated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
