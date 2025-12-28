import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

function truncate(str: string | null | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('🔍 Searching for EA-045 in outline...\n');

  // EA-045 Data extracted from outline
  const ea045Data = {
    unique_identifier: 'STG 2.1.2.2',
    title: 'Move Forward',
    specific_task_group_title: 'Move Forward',
    epic_novel_pages: 'Pages 61 - 75',
    epic_chapter_focus: 'Reaction',
    epic_novel_chapter_focus: 'Scene II: The Call to Adventure',
    tarot_family: 'Wands',
    tarot_card_item: 'Three',
    hero_journey_beat: 'Crossing the Threshold',
    save_the_cat_beat: 'Break into Two',
    summary: "After early setbacks with the Medici, Francisco boards the Zanetti Train for his first major timeline journey. He's forced to evolve his strategy and embrace new approaches to temporal travel. The train's conductor reveals that Francisco must learn to navigate not just physical timelines, but emotional and psychological ones as well.",
    character_arcs: {
      Francisco: 'Crossing the threshold into true temporal manipulation. Learning that timeline travel affects the soul as well as the body.',
      Train_Conductor: "Mysterious figure who serves as Francisco's guide to temporal mechanics - possibly a future version of himself.",
      La_Signora: "Joins Francisco on the train, revealing she's been traveling timelines longer than she initially admitted.",
    },
    story_gaps_addressed: {
      temporal_mechanics: 'Establishes the psychological cost of timeline travel - travelers experience memories from alternate versions of themselves.',
      trionfi_system: "The cards serve as anchors to Francisco's original timeline, preventing him from being lost in alternate realities.",
      character_motivation: "Francisco's desire to understand his role in the cosmic order drives him to accept the risks of timeline travel.",
    },
    location_details: {
      zanetti_train_interior: "Luxurious compartments that change based on the passenger's subconscious fears and desires, windows showing different time periods.",
      temporal_corridors: 'Passages between train cars that exist in multiple timelines simultaneously, requiring careful navigation.',
    },
    series_connections: {
      timeline_mastery: "Francisco's first lesson in timeline navigation, building toward his ultimate mastery in Books 8-9.",
      conductor_mystery: "Sets up the revelation that the conductor may be Francisco's future self, preparing for the meta-narrative elements of Book 9.",
    },
    scenes: [
      {
        scene_number: 1,
        scene_title: 'Boarding Into the Unknown',
        symbolism: "The Three of Wands embodies the chapter's progress theme: looking out from established ground toward horizons of possibility, leveraging past lessons (refusal of Medici/Roger) to accelerate growth and maintain forward momentum despite fear, demonstrating that progress requires moving beyond stagnation.",
        beat_goal: "Medici retaliation forces Francisco to board the Zanetti Train for his first major timeline journey, crossing the threshold from Bologna's safety into temporal travel, establishing that forward progress sometimes means leaving established ground and embracing uncertainty to break stagnation.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Exhilarating terror and committed momentum',
        scene_tone: 'Mysterious and adventurous',
        timeline_date: 'Post-Book 1 + 6 days (morning)',
        timeline_variant: 'Departing Prime Timeline',
        location: 'Bologna Station / Zanetti Train Boarding',
      },
      {
        scene_number: 2,
        scene_title: 'Compartments of Truth',
        symbolism: 'Three wands planted firmly while surveying new territory: Francisco must leverage rapid experimentation (trying different responses to compartment shifts) and reflective debriefs (understanding his fears) to drive continuous progress, demonstrating that moving forward requires iterative planning and learning from immediate feedback.',
        beat_goal: "Francisco learns that timeline travel affects the soul through psychological manifestations, evolves his strategy by using Trionfi cards as identity anchors, and discovers La Signora's extensive timeline experience, establishing the emotional and psychological costs of temporal navigation and the need for adaptive approaches.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Psychological struggle and adaptive learning',
        scene_tone: 'Surreal and challenging',
        timeline_date: 'Temporal Transit (unmeasured)',
        timeline_variant: 'Between Timelines',
        location: "Zanetti Train - Francisco's Compartment",
      },
      {
        scene_number: 3,
        scene_title: "The Conductor's Lesson",
        symbolism: 'Three wands pointing toward distant ships: progress requires tracking micro-wins and cumulative advances (each corridor navigation), reflecting weekly on progress (understanding emotional timeline layers), and translating insights into next steps (recognizing the conductor as possible future self), proving forward momentum demands learning from each incremental achievement.',
        beat_goal: "The mysterious conductor teaches Francisco that timeline navigation includes emotional and psychological dimensions, reveals travelers experience alternate-self memories, introduces the meta-narrative hint that the conductor may be Francisco's future self, and establishes that Trionfi cards anchor travelers to original timelines preventing identity loss.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Profound disorientation and recognition',
        scene_tone: 'Mysterious and revelatory',
        timeline_date: 'Temporal Corridor (outside linear time)',
        timeline_variant: 'Multiple Timelines Simultaneously',
        location: 'Zanetti Train - Temporal Corridors',
      },
      {
        scene_number: 4,
        scene_title: 'Windows to Possibilities',
        symbolism: 'Three wands firmly planted while ships approach: true progress requires aligning rational goals with emotional motivation (conductor\'s lesson), shaping environment to encourage essential behaviors (using cards as anchors), and scripting critical moves (remembering journey\'s purpose), demonstrating that moving forward demands disciplined essentialism—focusing on the vital few rather than infinite trivial distractions.',
        beat_goal: 'Francisco completes crossing the threshold by understanding that timeline travel demands disciplined essentialism and purpose-anchoring amidst infinite possibilities, establishing his readiness for timeline exploration while reinforcing that progress requires maintaining forward momentum through focused discipline rather than allowing distractions to impede growth.',
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Prepared determination and focused clarity',
        scene_tone: 'Contemplative and purposeful',
        timeline_date: 'Approaching First Timeline Destination',
        timeline_variant: 'Observation of Multiple Timelines',
        location: 'Zanetti Train - Observation Car',
      },
    ],
  };

  const title = ea045Data.specific_task_group_title || ea045Data.title || 'Move Forward';

  console.log(`✅ Found EA-045: ${title}`);
  console.log(`   Scenes: ${ea045Data.scenes?.length || 0}\n`);

  // Find chapter 45 in database
  const allChapters = await db.select().from(chapters);
  let ch45 = allChapters.find(ch => ch.chapterNumber === 45);

  if (!ch45) {
    console.error(`❌ Chapter 45 not found in database`);
    console.log(`   Available chapter numbers: ${[...new Set(allChapters.map(ch => ch.chapterNumber))].sort((a, b) => a! - b!).join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ Found Chapter 45: ${ch45.title}\n`);

  // Check if scenes already exist for this chapter and delete them
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch45.id));

  if (existingScenes.length > 0) {
    console.log(`🗑️  Deleting ${existingScenes.length} existing scenes for EA-045...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, ch45.id));
  }

  // Update chapter with EA-045 data
  await db
    .update(chapters)
    .set({
      uniqueIdentifier: 'EA-045',
      title: title,
      epicNovelPages: truncate(ea045Data.epic_novel_pages, 50),
      epicChapterFocus: ea045Data.epic_chapter_focus,
      epicNovelChapterFocus: ea045Data.epic_novel_chapter_focus,
      tarotFamily: truncate(ea045Data.tarot_family, 100),
      tarotCardItem: truncate(ea045Data.tarot_card_item, 100),
      heroJourneyBeat: ea045Data.hero_journey_beat?.substring(0, 99) || null,
      saveTheCatBeat: ea045Data.save_the_cat_beat?.substring(0, 100) || null,
      summary: ea045Data.summary,
      characterArcs: typeof ea045Data.character_arcs === 'string'
        ? ea045Data.character_arcs
        : JSON.stringify(ea045Data.character_arcs),
      storyGapsAddressed: typeof ea045Data.story_gaps_addressed === 'string'
        ? ea045Data.story_gaps_addressed
        : JSON.stringify(ea045Data.story_gaps_addressed),
      locationDetails: typeof ea045Data.location_details === 'string'
        ? ea045Data.location_details
        : JSON.stringify(ea045Data.location_details),
      seriesConnections: typeof ea045Data.series_connections === 'string'
        ? ea045Data.series_connections
        : JSON.stringify(ea045Data.series_connections),
    })
    .where(eq(chapters.id, ch45.id));

  console.log('✅ Updated chapter with EA-045 data\n');

  // Import scenes with basic data from outline
  console.log('📝 Importing scenes with basic data...\n');

  const insertedScenes = [];

  for (const sceneData of ea045Data.scenes) {
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch45.id,
        chapterUniqueIdentifier: 'EA-045',
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.symbolism,
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

  // Enhanced scene data with all 31 fields
  const sceneEnhancements = [
    {
      // Scene 1: Boarding Into the Unknown
      pages: 'Page 61 - 65',
      description: "The morning after forming his independent network, Francisco receives word that the Medici have begun seizing temporal artifacts across Bologna, freezing timelines to prevent his interference—a retaliation for his refusal. The message is clear: stay isolated or Bologna suffers. Francisco wants to protect his city without submitting to Medici control; Dante wants him to embrace the one option remaining: the Zanetti Train can take them beyond the Medici's reach to seek allies and knowledge in other timelines. Opposition comes from Francisco's fear of leaving (abandoning Bologna feels like cowardice), his inexperience with timeline travel, and La Signora's cryptic warning that the train demands payment he doesn't yet understand. But as temporal freezing spreads (citizens caught mid-motion, buildings locked between architectural states), Francisco realizes stagnation is death—he must move forward even into uncertainty. At Bologna's station, the Zanetti Train manifests with its mysterious conductor watching from the engine. Francisco, La Signora, and Novella board luxurious compartments that shimmer with temporal possibility. As the train lurches forward, Bologna disappears not behind them but across dimensions. The scene lands on exhilarating terror of crossing the threshold.",
      focus: 'Francisco boards Zanetti Train crossing threshold from Bologna into timeline travel to escape Medici stagnation',
      chapterSceneFocus: truncate('Ch45S1: Medici retaliation forces Francisco to board Zanetti Train, crossing threshold into temporal travel to break stagnation', 255),
      preliminarySceneFocus: 'Medici freeze Bologna forcing Francisco to board Zanetti Train for first timeline journey beyond their reach',
      preliminarySceneDescription: "Morning after forming independent network, Francisco receives word Medici seizing temporal artifacts across Bologna, freezing timelines preventing interference—retaliation for refusal. Message clear: stay isolated or Bologna suffers. Francisco wants protecting city without Medici submission; Dante wants embracing remaining option: Zanetti Train taking beyond Medici reach seeking allies and knowledge in other timelines. Opposition from Francisco's fear of leaving (abandoning Bologna feels cowardice), inexperience with timeline travel, La Signora's cryptic warning train demands payment he doesn't understand. But temporal freezing spreads (citizens caught mid-motion, buildings locked between architectural states), Francisco realizes stagnation is death—must move forward into uncertainty. Bologna station, Zanetti Train manifests with mysterious conductor watching from engine. Francisco, La Signora, Novella board luxurious compartments shimmering with temporal possibility. Train lurches forward, Bologna disappears not behind but across dimensions. Exhilarating terror crossing threshold.",
      narrativeFunction: "Establishes Francisco's first major timeline journey as consequence of Medici retaliation—his refusal of their control leads to Bologna's temporal freezing, forcing him to leave established ground. This scene crosses the threshold into true temporal travel, demonstrating that forward progress sometimes requires abandoning safety for uncertainty. The Zanetti Train's manifestation introduces the primary vehicle for Books 2-3's timeline exploration while establishing that stagnation (Medici-imposed freezing) is death—momentum is survival.",
      sensoryDetail: "Bologna frozen mid-motion—citizens caught mid-step, vendors holding fruit that won't fall, buildings locked between architectural states (half-Gothic, half-Renaissance, both, neither). The temporal pressure like ice spreading through city. At station, Zanetti Train materializing from nowhere—gleaming black engine, luxurious compartments with windows showing impossible views. Mysterious conductor's face half-hidden under cap, watching. Boarding onto plush seats that shimmer slightly, air inside carrying scent of possibilities. Train's lurch forward creating vertigo as Bologna doesn't recede but fades dimensionally—like watching city through water becoming vapor.",
      internalConflict: "Francisco struggles with leaving Bologna feeling like abandonment versus recognizing that staying means submission to Medici stagnation. He grapples with fear of the unknown timeline travel versus the terror of temporal freezing spreading through his city. The conflict intensifies through guilt about 'running away' battling against Dante's wisdom that strategic retreat enables future victory. La Signora's warning about payment adds dread to necessity. Ultimately he must accept that moving forward into uncertainty beats remaining in frozen captivity.",
      characterGrowthElement: "Francisco takes the critical step of crossing the threshold from established ground into unknown territory—literally boarding the train that will transform his understanding of temporal mechanics. He learns that progress sometimes requires leaving safety, that forward momentum beats stagnation even when the path ahead is uncertain. This growth from defensive positioning (protecting Bologna) to offensive exploration (seeking timeline allies) demonstrates maturity: recognizing that true protection sometimes means temporary departure to gain strength elsewhere.",
      seriesConnectionResonance: "Introduces the Zanetti Train as primary vehicle for timeline exploration across Books 2-3, establishing its manifestation mechanics and mysterious conductor. Francisco's boarding marks the shift from single-timeline focus (Bologna) to multi-timeline navigation that defines his journey toward cosmic guardianship in Books 8-9. The Medici's temporal freezing retaliation sets up their recurring antagonism. Novella's presence on the train positions her as Francisco's timeline companion, while La Signora's cryptic warnings foreshadow the psychological costs revealed in subsequent scenes.",
      sceneCardProgression: 94,
      realWorldContext: "The scene mirrors real-world experiences of being forced to leave established ground due to external pressure—whether geographical relocation, career pivots, or relationship departures necessitated by untenable stagnation. Francisco's fear that leaving equals abandonment reflects how strategic retreat often feels like cowardice before proving wise. The Medici freezing Bologna represents how powerful entities punish independence by restricting possibilities, forcing movement. The exhilarating terror of boarding applies to any threshold crossing where uncertainty beckons but stagnation threatens.",
      timelineSignificance: "Morning of Post-Book 1 + 6 days marks Francisco's departure from Prime Timeline for first major timeline journey. The Departing Prime Timeline variant establishes that timeline travel isn't linear movement but dimensional shifting—Bologna doesn't recede spatially but fades across realities. This scene sets the temporal mechanics foundation: timelines exist simultaneously, travel between them requires specialized vehicles (like Zanetti Train), and departure affects both traveler and origin point (Bologna frozen in Francisco's absence).",
      saveTheCatBeat: truncate('Break into Two - Threshold Crossed', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on Bologna frozen mid-motion (citizens caught mid-step, buildings locked architecturally), temporal pressure like ice spreading, Zanetti Train materializing at station (gleaming black, luxurious compartments, impossible window views), mysterious conductor half-hidden watching, boarding onto shimmering seats with scent of possibilities, train's lurch creating vertigo as Bologna fades dimensionally. Show the shift from guilty fear to committed momentum crossing threshold.",
        sudowrite_emotional_arc: 'Begins with guilty fear about leaving Bologna, escalates through rising terror as temporal freezing spreads, intensifies with dread at La Signora\'s payment warning, transforms through recognition that stagnation is death, resolves with exhilarating terror as threshold crossed. The emotional journey is from paralyzed guilt through mounting pressure to committed forward momentum despite uncertainty.',
        sudowrite_sensory_emphasis: 'Emphasize Bologna frozen (citizens mid-motion, buildings locked between states), temporal pressure as spreading ice, Zanetti Train materializing (black gleam, luxurious shimmer, impossible windows), conductor face half-hidden, plush seats carrying scent of possibilities, train lurch creating dimensional vertigo as Bologna fades across realities.',
      },
      learning_objectives: {
        integration: 'Strategic Forward Movement and Threshold Crossing',
        terminal_objectives: [
          "Recognize that forward progress sometimes requires leaving established ground when stagnation threatens—strategic retreat enables future strength rather than representing abandonment or cowardice",
          "Understand that external pressure forcing movement (Medici freezing Bologna) can catalyze necessary threshold crossing that fear alone prevented",
          "Accept that crossing thresholds into uncertainty creates exhilarating terror but beats remaining in untenable stagnation where powerful entities restrict possibilities",
        ],
      },
      foreshadowing_elements: [
        'Zanetti Train manifestation foreshadows its recurring role as timeline travel vehicle in Books 2-3',
        "Mysterious conductor watching foreshadows revelation of conductor's true identity (possibly Francisco's future self)",
        "La Signora's payment warning foreshadows psychological costs of timeline travel revealed in Scene 2",
      ],
    },
    {
      // Scene 2: Compartments of Truth
      pages: 'Page 66 - 69',
      description: "Inside the train, Francisco discovers the luxurious compartments are not what they seem—his cabin morphs based on his subconscious, first showing him a scholar's paradise (safety of academia he abandoned), then a courtroom where he's judged for every choice he's made, then a vision of Bologna burning while he rides away. Francisco wants to control these manifestations and understand the train's mechanics; La Signora wants him to stop resisting and let the compartments teach him. Opposition arises from Francisco's need for rational control (his old scholarly instincts fighting against intuitive navigation), the psychological assault of his fears made visible, and his realization that timeline travel isn't just physical but attacks the soul. La Signora reveals she's been traveling timelines far longer than admitted—centuries, perhaps millennia—and these manifestations are the train's way of preparing travelers for the identity dissolution that comes with experiencing alternate selves. Francisco must evolve his strategy: instead of fighting the visions, he uses Trionfi cards as anchors, focusing on The Star (hope), The Hermit (inner wisdom), and The World (completion) to ground his identity. The compartment stabilizes into a working space. The scene lands on adaptive breakthrough.",
      focus: "Timeline travel affects soul through psychological manifestations; Francisco evolves strategy using Trionfi as identity anchors",
      chapterSceneFocus: truncate('Ch45S2: Francisco learns timeline travel attacks soul psychologically, evolves strategy using Trionfi cards as identity anchors against dissolution', 255),
      preliminarySceneFocus: 'Train compartments morph based on subconscious fears; Francisco uses Trionfi cards as anchors against psychological assault',
      preliminarySceneDescription: "Inside train, Francisco discovers luxurious compartments morph based on subconscious—first showing scholar's paradise (safety of abandoned academia), then courtroom judging every choice, then Bologna burning while he rides away. Francisco wants controlling manifestations and understanding mechanics; La Signora wants him stopping resistance, letting compartments teach. Opposition from Francisco's rational control need (scholarly instincts fighting intuitive navigation), psychological assault of visible fears, realization timeline travel isn't just physical but soul-attacking. La Signora reveals traveling timelines far longer than admitted—centuries, perhaps millennia—these manifestations preparing travelers for identity dissolution from experiencing alternate selves. Francisco must evolve strategy: instead fighting visions, uses Trionfi cards as anchors, focusing Star (hope), Hermit (inner wisdom), World (completion) grounding identity. Compartment stabilizes into working space. Adaptive breakthrough.",
      narrativeFunction: "Establishes the psychological cost of timeline travel—the Zanetti Train's compartments attack travelers' identities by manifesting subconscious fears and guilt, preparing them for the identity dissolution that comes from experiencing alternate-self memories. This scene demonstrates Francisco's adaptive learning: when rational control fails, he evolves his strategy to use Trionfi cards as identity anchors. La Signora's revelation about traveling timelines for centuries positions her as experienced guide while explaining why she understands these mechanics intuitively.",
      sensoryDetail: "Compartment shifting impossibly—walls flowing from luxurious wood paneling into cold stone courtroom, windows showing scholar's study with books Francisco never read, then Bologna aflame. Each shift accompanied by emotional pressure: longing for academic safety, guilt under judgmental stares, horror at burning city. Air thick with accusation. Francisco's hands shaking as he pulls Trionfi cards, focusing on The Star's hopeful glow, The Hermit's steady wisdom, The World's completeness. Cards pulsing warmth as compartment's chaos slows, stabilizes—walls settling into neutral working space, pressure easing.",
      internalConflict: "Francisco battles between scholarly need for rational understanding versus accepting that timeline travel demands intuitive navigation beyond intellectual control. He grapples with visible manifestations of his deepest fears—abandoning academic safety, making wrong choices, leaving Bologna to burn—forcing confrontation with doubts he's suppressed. The conflict intensifies through La Signora's revelation that this psychological assault prepares for identity dissolution: experiencing alternate-self memories will challenge his sense of who he is. Ultimately he must learn to anchor identity not through control but through essential symbols.",
      characterGrowthElement: "Francisco achieves critical growth by evolving his strategy from rational control to adaptive anchoring—when compartment manifestations overwhelm scholarly analysis, he learns to use Trionfi cards as identity grounding. This demonstrates maturity: recognizing that some challenges require different approaches than academic methodology. His acceptance that timeline travel attacks the soul as well as spanning physical space prepares him for the deeper psychological navigation required in subsequent scenes. The breakthrough shows Francisco integrating intuitive and rational approaches rather than forcing everything through intellectual framework.",
      seriesConnectionResonance: "Establishes Trionfi cards' critical function as identity anchors during timeline travel—preventing the dissolution that comes from experiencing alternate selves. This anchoring role becomes essential across Books 2-4 as Francisco navigates increasingly complex timeline branches. La Signora's centuries-long timeline experience positions her as ancient guide whose wisdom transcends Francisco's nascent understanding. The compartment manifestations foreshadow the psychological challenges of alternate-self memories explored throughout Book 2.",
      sceneCardProgression: 95,
      realWorldContext: "The scene mirrors real-world psychological challenges when entering new territories—subconscious fears and doubts manifesting as internal accusations and visions of failure. Francisco's compartment shifts represent how uncertainty surfaces repressed guilt (abandoning safety, making wrong choices, leaving loved ones vulnerable). The adaptive breakthrough of using anchors (Trionfi cards) applies to any high-stress situation where rational control fails and grounding symbols/practices provide stability. La Signora's teaching reflects mentor wisdom that psychological preparation matters more than intellectual understanding.",
      timelineSignificance: "Temporal Transit (unmeasured) in Between Timelines variant establishes that timeline travel isn't instantaneous—the journey between realities creates liminal space where normal time doesn't apply. This between-state allows the train's compartments to access travelers' subconscious, manifesting fears and preparing for the identity challenges of multi-timeline navigation. The unmeasured quality reflects how psychological time differs from chronological: the compartment assault could last seconds or hours, measurement irrelevant to the soul-level transformation occurring.",
      saveTheCatBeat: truncate('Break into Two - New Rules', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on compartment shifting impossibly (wood paneling flowing to stone courtroom, windows showing unread books then burning Bologna), each shift bringing emotional pressure (longing, guilt, horror), air thick with accusation, hands shaking pulling Trionfi cards, focusing on Star's hopeful glow/Hermit's steady wisdom/World's completeness, cards pulsing warmth as chaos stabilizes. Show the shift from rational control attempt to adaptive anchoring breakthrough.",
        sudowrite_emotional_arc: 'Begins with confusion at compartment shifts, descends through psychological assault of manifested fears (academic abandonment, choice judgment, Bologna burning), intensifies with realization timeline travel attacks soul, transforms through adaptive strategy discovery (using cards as anchors), resolves with breakthrough stability. The emotional journey is from rational control failure through psychological crisis to adaptive anchoring success.',
        sudowrite_sensory_emphasis: 'Emphasize compartment impossible shifts (paneling to courtroom stone, windows showing alternate scenes), emotional pressure waves (longing/guilt/horror), air thick with accusation, shaking hands pulling Trionfi cards, Star glowing hopefully/Hermit steady/World complete, cards pulsing warmth, chaos slowing and stabilizing.',
      },
      learning_objectives: {
        integration: 'Adaptive Strategy Evolution and Identity Anchoring',
        terminal_objectives: [
          "Recognize that timeline travel creates psychological challenges requiring adaptive strategies—when rational control fails, intuitive anchoring through symbols/practices provides identity stability",
          "Understand that entering new territories surfaces subconscious fears and doubts manifesting as internal accusations, requiring confrontation rather than suppression",
          "Learn to evolve approach when initial methodology proves insufficient—integrating intuitive and rational methods rather than forcing everything through single framework",
        ],
      },
      foreshadowing_elements: [
        'Compartment manifestations foreshadow alternate-self memory experiences in later scenes',
        "La Signora's centuries-long timeline travel foreshadows revelations about her true ancient nature",
        'Trionfi cards as identity anchors foreshadows their critical role preventing dissolution across Books 2-4',
      ],
    },
    {
      // Scene 3: The Conductor's Lesson
      pages: 'Page 70 - 72',
      description: "Navigating temporal corridors between train cars—passages that exist in multiple timelines simultaneously—Francisco encounters the train's conductor, a figure whose face seems familiar yet impossible to place. The conductor wants Francisco to understand the deeper mechanics of timeline travel; Francisco wants concrete instructions for navigating safely. The conductor reveals unsettling truth: Francisco must learn to navigate not just physical timelines but emotional and psychological ones—every timeline branch represents not just alternate events but alternate emotional developments, alternate soul evolutions. Opposition intensifies through the corridor's disorienting effects (Francisco sees himself in adjacent timelines making different choices, experiencing different emotions, becoming different people), Novella's struggle to anchor timeline ribbons in this in-between space, and the conductor's enigmatic teaching style (questions instead of answers). But the conductor drops a revelation that changes everything: 'You're learning to navigate the timelines others have already walked. Eventually, you'll need to navigate the ones you'll walk.' When Francisco asks what that means, the conductor's face shifts—for just a moment, Francisco sees his own features, older and scarred. The scene lands on profound disorientation and dawning recognition.",
      focus: "Conductor teaches timeline navigation includes emotional/psychological dimensions; hints conductor may be Francisco's future self",
      chapterSceneFocus: truncate("Ch45S3: Mysterious conductor reveals timeline navigation spans emotional/psychological dimensions, hints he's Francisco's future self", 255),
      preliminarySceneFocus: 'Conductor teaches emotional timeline navigation; Francisco glimpses his own older face in conductor suggesting future self',
      preliminarySceneDescription: "Navigating temporal corridors between train cars—passages existing in multiple timelines simultaneously—Francisco encounters conductor whose face seems familiar yet impossible. Conductor wants Francisco understanding deeper timeline mechanics; Francisco wants concrete safe navigation instructions. Conductor reveals unsettling truth: must learn navigating not just physical timelines but emotional and psychological—every timeline branch represents not just alternate events but alternate emotional developments, alternate soul evolutions. Opposition through corridor's disorienting effects (Francisco seeing himself in adjacent timelines making different choices, experiencing different emotions, becoming different people), Novella struggling to anchor timeline ribbons in between-space, conductor's enigmatic teaching (questions not answers). Conductor drops revelation: 'You're learning navigating timelines others walked. Eventually need navigating ones you'll walk.' When Francisco asks meaning, conductor's face shifts—moment showing Francisco's own features, older and scarred. Profound disorientation and dawning recognition.",
      narrativeFunction: "Introduces the meta-narrative element that the conductor may be Francisco's future self—the 'timelines you'll walk' hint combined with the facial shift revelation. This scene deepens the psychological complexity of timeline navigation: branches represent not just alternate events but alternate emotional and soul evolutions, meaning Francisco experiences other versions of himself with different psychological developments. The corridor's disorienting multi-timeline existence demonstrates the practical mechanics while establishing that navigating these spaces requires more than physical movement.",
      sensoryDetail: "Temporal corridor stretching impossibly—walls existing in multiple states simultaneously (wooden, metal, stone, all, none). Through corridor walls seeing adjacent timelines: Francisco-who-accepted-Medici robed in wealth but hollow-eyed, Francisco-who-joined-Roger scarred from battles, Francisco-who-stayed-in-Bologna frozen mid-scream. Each vision carrying emotional weight—tasting the alternate-self's feelings, grief, rage, resignation. Conductor's presence steady amid chaos, face flickering between familiar and strange. Then the shift: conductor turning, features morphing into Francisco's own face but older, bearing scars Francisco hasn't earned yet. Novella gasping, timeline ribbons slipping through her fingers. Air crackling with temporal pressure.",
      internalConflict: "Francisco struggles with the disorienting vision of alternate selves—seeing himself making different choices and becoming different people challenges his sense of unified identity. He grapples with the conductor's enigmatic teaching style (questions instead of concrete answers) when he desperately wants clear instructions for navigation. The emotional weight of experiencing alternate-selves' feelings—tasting their grief, rage, resignation—forces confrontation with the roads not taken. When the conductor's face shifts to reveal Francisco's older features, the conflict intensifies: is this future inevitable, or one possibility among many? The profound disorientation of potential self-meeting undermines certainty about identity and destiny.",
      characterGrowthElement: "Francisco confronts the reality that timeline navigation spans emotional and psychological dimensions—he's not just traveling through physical space but through alternate versions of his own soul development. The glimpse of the conductor as possible future self introduces the concept that he may eventually navigate his own future timelines, preparing for meta-narrative elements in later books. His growth comes through accepting mystery and enigma rather than demanding concrete answers: some truths require experiencing rather than explaining. The recognition that every timeline branch creates alternate emotional developments deepens his understanding of what's at stake in his choices.",
      seriesConnectionResonance: "Establishes the conductor mystery that spans Books 2-3, building toward potential revelation that the conductor is Francisco's future self from Book 9's meta-narrative loop. The emotional/psychological timeline navigation concept becomes crucial for Books 4-5 where Francisco must navigate his own soul evolution across branches. Seeing alternate selves in corridor walls foreshadows the identity challenges when Francisco actively experiences alternate-timeline memories. Novella's struggle to anchor timeline ribbons in the corridor establishes her limitations and Francisco's unique capacities.",
      sceneCardProgression: 96,
      realWorldContext: "The scene mirrors real-world experiences of confronting alternate life paths—seeing how different choices would have created different emotional developments and psychological identities. Francisco's vision of alternate selves reflects the universal 'what if' contemplation: who would I be if I'd chosen differently? The conductor's enigmatic teaching represents mentor wisdom that some lessons require experience rather than explanation. The possible future-self meeting applies to any situation where current actions create future consequences we'll eventually face—the conductor suggesting Francisco is becoming who he'll need to be.",
      timelineSignificance: "Temporal Corridor (outside linear time) in Multiple Timelines Simultaneously variant establishes spaces that exist across realities at once—not in one timeline or another but in all and none. This between-state allows viewing adjacent timelines side-by-side, seeing alternate Francisco-versions in parallel. The 'outside linear time' quality means normal causation doesn't apply: the conductor can be Francisco's future self because in corridors, past/present/future overlap. This mechanics foundation enables the meta-narrative elements developed across the series.",
      saveTheCatBeat: truncate('Break into Two - Understanding Cost', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on corridor stretching impossibly (walls in multiple states simultaneously), seeing through walls to adjacent timelines (Francisco-with-Medici hollow-eyed, Francisco-with-Roger battle-scarred, Francisco-frozen mid-scream), tasting alternate-selves' emotions (grief/rage/resignation), conductor's steady presence amid chaos, the shift revealing conductor's face morphing into Francisco's older scarred features, Novella gasping with slipping ribbons, air crackling temporal pressure. Show the shift from seeking concrete answers to profound disoriented recognition.",
        sudowrite_emotional_arc: 'Begins with seeking concrete navigation instructions, descends through disorientation seeing alternate selves making different choices, intensifies through emotional weight of tasting alternate-feelings, transforms with conductor\'s revelation about navigating future timelines, peaks with conductor face-shift revealing possible future self. The emotional journey is from wanting certainty through disorienting complexity to profoundly disoriented recognition.',
        sudowrite_sensory_emphasis: 'Emphasize corridor impossible stretch (walls in multiple simultaneous states), visions through walls (alternate Franciscos with different choices/emotions/scars), tasting alternate-self emotions, conductor face flickering familiar/strange then morphing to older Francisco features, Novella gasping with slipping timeline ribbons, temporal pressure crackling air.',
      },
      learning_objectives: {
        integration: 'Multi-Dimensional Timeline Navigation and Future-Self Recognition',
        terminal_objectives: [
          "Understand that timeline navigation spans emotional and psychological dimensions—branches represent not just alternate events but alternate soul evolutions requiring navigation of different feeling-states",
          "Recognize that alternate life paths create different psychological identities—seeing how different choices would have developed different emotional and character aspects of self",
          "Accept that some wisdom requires experiencing mystery rather than receiving concrete explanations—enigmatic teaching prepares for truths that can't be simply told",
        ],
      },
      foreshadowing_elements: [
        "Conductor's possible future-self identity foreshadows Book 9 meta-narrative revelation about temporal loops",
        'Emotional timeline navigation foreshadows Books 4-5 where Francisco navigates soul evolution across branches',
        'Alternate-self visions foreshadow direct alternate-timeline memory experiences later in Book 2',
      ],
    },
    {
      // Scene 4: Windows to Possibilities
      pages: 'Page 73 - 75',
      description: "Emerging from the corridors into the train's observation car, Francisco, La Signora, and Novella watch through windows showing different time periods flickering past—Bologna in Roman glory, medieval splendor, Renaissance peak, and unfamiliar futures. Francisco wants to understand his destination and cosmic role; La Signora wants him to embrace the journey itself as the lesson. Novella, whose timeline perception abilities have strengthened during travel, points out patterns in the flickering windows: certain timelines keep recurring, as if the train is circling them. The conductor appears with final guidance before their first stop: 'You sought to move forward after the Medici's stagnation. But forward isn't a direction in timelines—it's a discipline. Every timeline you visit will tempt you to stay, to become the you that timeline creates. Progress means remembering why you began the journey even when infinite versions of home call you to stop.' As the train begins decelerating toward their first timeline destination, Francisco realizes the conductor's lesson: moving forward requires not just physical momentum but the disciplined pursuit of essential purpose amidst infinite distractions. The Trionfi cards pulse in recognition—they will be his reminder of what's essential. The scene lands on prepared determination for the threshold fully crossed.",
      focus: 'Francisco learns timeline progress requires disciplined essentialism—remembering journey purpose amidst infinite possibilities',
      chapterSceneFocus: truncate('Ch45S4: Conductor teaches timeline progress demands disciplined essentialism and purpose-anchoring to resist infinite distractions', 255),
      preliminarySceneFocus: "Observation car windows show multiple timelines; conductor teaches 'forward' in timelines means disciplined purpose-focus",
      preliminarySceneDescription: "Emerging from corridors into train's observation car, Francisco, La Signora, Novella watch through windows showing different time periods flickering past—Bologna in Roman glory, medieval splendor, Renaissance peak, unfamiliar futures. Francisco wants understanding destination and cosmic role; La Signora wants him embracing journey itself as lesson. Novella, timeline perception strengthened during travel, points out patterns in flickering windows: certain timelines recurring, as if train circling them. Conductor appears with final guidance before first stop: 'You sought moving forward after Medici stagnation. But forward isn't direction in timelines—it's discipline. Every timeline you visit tempts staying, becoming the you that timeline creates. Progress means remembering why you began journey even when infinite home versions call stopping.' Train decelerating toward first timeline destination, Francisco realizes conductor's lesson: moving forward requires not just physical momentum but disciplined essential purpose pursuit amidst infinite distractions. Trionfi cards pulse recognition—reminder of what's essential. Prepared determination for threshold fully crossed.",
      narrativeFunction: "Completes the threshold crossing by establishing the core discipline required for timeline exploration: remembering essential purpose amidst infinite possibilities that tempt staying/becoming alternate selves. This scene synthesizes the chapter's lessons—physical threshold crossed (Scene 1), psychological anchoring learned (Scene 2), emotional navigation understood (Scene 3), and now disciplined essentialism embraced (Scene 4). The conductor's final guidance positions 'forward' not as spatial direction but as focused discipline, setting the philosophical foundation for Books 2-3's timeline adventures.",
      sensoryDetail: "Observation car's panoramic windows showing timelines flickering past—Bologna in Roman marble glory, medieval stone majesty, Renaissance artistic peak, strange futures with impossible architectures. Each timeline's light different: golden-age warmth, medieval shadow-depth, Renaissance vibrant color, future chrome cold. Novella pointing to patterns—same timelines recurring in window-flickers, train circling them. Conductor appearing, presence commanding attention. Francisco's Trionfi cards suddenly pulsing in pocket, warmth spreading through chest as if recognizing truth. Train's deceleration creating gentle pressure forward. The first timeline destination materializing in windows, growing clearer.",
      internalConflict: "Francisco struggles with wanting concrete destination/purpose answers versus accepting that the journey itself teaches the lessons he needs. He grapples with the conductor's warning that infinite timelines will tempt him to stay—each offering a different version of 'home,' a different version of himself to become. The conflict intensifies through recognition that without disciplined essentialism, he could lose himself in infinite possibilities: which timeline's Francisco is the 'real' one? The Trionfi cards' pulsing recognition provides answer: they anchor what's essential. Ultimately he must embrace that progress isn't about reaching destination but maintaining focused purpose amidst distractions.",
      characterGrowthElement: "Francisco achieves the chapter's culminating growth: understanding that timeline progress requires disciplined essentialism—maintaining focused purpose when infinite possibilities tempt distraction. He learns that 'forward' in temporal terms means discipline rather than direction: the commitment to remember journey's purpose even when every timeline offers reasons to stop. The Trionfi cards' recognition as essential-purpose anchors demonstrates his integration of tools and wisdom: cards ground identity (Scene 2) and remind him of core purpose (Scene 4), enabling navigation without dissolution. This prepared determination marks threshold fully crossed—he's ready for timeline exploration.",
      seriesConnectionResonance: "Establishes the core challenge of Books 2-4: maintaining essential purpose and identity while exploring timelines that each tempt becoming different versions of Francisco. The conductor's lesson about 'forward' as discipline rather than direction provides philosophical foundation for timeline navigation across series. Novella's strengthened timeline perception during travel positions her as increasingly valuable companion. The Trionfi cards' pulsing recognition of essential purpose foreshadows their recurring role as anchors preventing Francisco from losing himself in infinite branches. Train approaching first destination sets up subsequent timeline adventures.",
      sceneCardProgression: 97,
      realWorldContext: "The scene mirrors real-world challenges of maintaining essential purpose amidst infinite distractions and possibilities—the modern abundance of choices that paradoxically makes focused progress harder. Francisco's lesson that 'forward isn't direction but discipline' applies to any long-term pursuit where countless alternatives tempt abandonment of core purpose. The conductor's warning that every timeline tempts staying reflects how each life path offers reasons to stop, settle, become the person that path creates. Disciplined essentialism—remembering why you began when infinite versions of home call you to stop—provides framework for sustained progress.",
      timelineSignificance: "Approaching First Timeline Destination in Observation of Multiple Timelines variant establishes that as train nears destinations, travelers can observe multiple timeline options simultaneously through windows. This observation phase allows pattern recognition (Novella noticing recurring timelines) before commitment to specific destination. The flickering windows showing Bologna across different eras demonstrate that timeline travel isn't just spatial but temporal: same location across different time periods represents different timeline branches. Train's deceleration marks transition from between-space travel to specific timeline arrival.",
      saveTheCatBeat: truncate('Break into Two - New Purpose', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on observation car panoramic windows showing timeline-flickers (Roman-glory Bologna, medieval-stone, Renaissance-vibrant, future-chrome impossibilities), each timeline's distinct light quality, Novella pointing to recurring patterns, conductor's commanding presence, Trionfi cards suddenly pulsing in pocket with chest-warmth spreading, train deceleration's gentle forward pressure, first destination materializing in windows. Show the shift from seeking destination to embracing disciplined purpose.",
        sudowrite_emotional_arc: 'Begins with wanting destination/purpose answers, moves through fascination at multiple timeline observations, transforms with conductor\'s lesson that forward means discipline not direction, deepens with recognition that cards anchor essential purpose, resolves with prepared determination as threshold fully crossed. The emotional journey is from seeking certainty through observation to disciplined essential purpose embrace.',
        sudowrite_sensory_emphasis: 'Emphasize panoramic windows timeline-flickers (Bologna across eras with different light qualities—golden/shadowed/vibrant/chrome), Novella pointing patterns, conductor presence commanding, Trionfi cards pulsing warmth spreading chest, train deceleration gentle pressure, first destination materializing clearer.',
      },
      learning_objectives: {
        integration: 'Disciplined Essentialism and Purpose-Anchored Progress',
        terminal_objectives: [
          "Understand that progress in complex environments requires disciplined essentialism—maintaining focused purpose when infinite possibilities offer distractions and reasons to stop or diverge",
          "Recognize that 'forward' means discipline rather than direction—the commitment to remember journey's core purpose even when abundant alternatives tempt settling into different versions of self/home",
          "Learn to use anchors (Trionfi cards, essential symbols) as reminders of what matters most, preventing loss of self/purpose amidst overwhelming choice and possibility",
        ],
      },
      foreshadowing_elements: [
        'Train approaching first timeline destination foreshadows subsequent timeline exploration adventures in Books 2-3',
        "Conductor's lesson about infinite timeline temptations foreshadows challenges Francisco faces staying true to purpose",
        "Novella's strengthened timeline perception foreshadows her evolving abilities and crucial role as companion",
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

  console.log('\n🎉 EA-045 complete import finished!');
  console.log('🚂 MOVE FORWARD - Timeline Journey Begins!\n');

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
