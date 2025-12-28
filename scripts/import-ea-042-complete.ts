import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface SceneData {
  scene_number: number;
  scene_title: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
}

interface EA042Data {
  id: string;
  title?: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  summary?: string;
  character_arcs?: any;
  story_gaps_addressed?: any;
  location_details?: any;
  series_connections?: any;
  scenes: SceneData[];
}

function findEA042Data(): EA042Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA042Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-042') return obj as EA042Data;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

function truncate(str: string | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('🔍 Searching for EA-042 in outline...\n');

  const ea042Data = findEA042Data();

  if (!ea042Data) {
    console.error('❌ EA-042 not found in outline');
    process.exit(1);
  }

  const title = ea042Data.title || 'Intense Force';

  console.log(`✅ Found EA-042: ${title}`);
  console.log(`   Scenes: ${ea042Data.scenes?.length || 0}\n`);

  // Find chapter 42
  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-042'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-042 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 42
    const allChapters = await db.select().from(chapters);
    let ch42 = allChapters.find(ch => ch.chapterNumber === 42);

    if (!ch42) {
      console.error(`❌ Chapter 42 not found in database`);
      process.exit(1);
    }

    chapter = ch42;
    console.log(`✅ Found Chapter 42: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-042',
        title: title,
        epicNovelPages: truncate(ea042Data.epic_novel_pages, 50),
        epicChapterFocus: ea042Data.epic_chapter_focus,
        epicNovelChapterFocus: ea042Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea042Data.tarot_family, 100),
        tarotCardItem: truncate(ea042Data.tarot_card_item, 100),
        heroJourneyBeat: ea042Data.hero_journey_beat?.substring(0, 99) || null,
        saveTheCatBeat: ea042Data.save_the_cat_beat?.substring(0, 100) || null,
        summary: ea042Data.summary,
        characterArcs: typeof ea042Data.character_arcs === 'string'
          ? ea042Data.character_arcs
          : JSON.stringify(ea042Data.character_arcs),
        storyGapsAddressed: typeof ea042Data.story_gaps_addressed === 'string'
          ? ea042Data.story_gaps_addressed
          : JSON.stringify(ea042Data.story_gaps_addressed),
        locationDetails: typeof ea042Data.location_details === 'string'
          ? ea042Data.location_details
          : JSON.stringify(ea042Data.location_details),
        seriesConnections: typeof ea042Data.series_connections === 'string'
          ? ea042Data.series_connections
          : JSON.stringify(ea042Data.series_connections),
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-042 data\n');
  }

  // Check existing scenes
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  if (existingScenes.length > 0) {
    console.log(`⚠️  Found ${existingScenes.length} existing scenes. Deleting them first...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  }

  // Import scenes with basic data
  console.log('📝 Importing scenes with basic data...\n');

  for (const sceneData of ea042Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-042',
      sceneNumber: sceneData.scene_number,
      title: truncate(sceneData.scene_title, 255),
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      pov: truncate(sceneData.pov, 100),
      tense: truncate(sceneData.tense, 100),
      core_emotion: truncate(sceneData.core_emotion, 255),
      scene_tone: truncate(sceneData.scene_tone, 255),
      timeline_date: truncate(sceneData.timeline_date, 50),
      timeline_variant: truncate(sceneData.timeline_variant, 100),
      location: truncate(sceneData.location, 255),
    };

    await db.insert(scenes).values(sceneInsert);

    console.log(`✅ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
  }

  console.log('\n📝 Adding comprehensive scene fields...\n');

  // Get the scenes we just inserted
  const insertedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  const sceneEnhancements = [
    {
      // Scene 1: Reality Fractures
      pages: 'Page 16 - 20',
      description: 'Francisco awakens to screams outside his Bologna home as dawn light flickers between different eras—medieval stone giving way to Renaissance marble, then snapping back. In the Piazza Maggiore, panicked citizens age decades in seconds then revert to childhood, buildings shift architectural styles mid-breath, and the air crackles with temporal energy. Francisco wants to believe this is another nightmare like the timeline echoes; his family wants him to explain what\'s happening and make it stop. Opposition erupts from all sides: the chaos is accelerating, his father demands rational answers Francisco doesn\'t have, and his own post-adventure hollowness threatens to paralyze him when action is required. But as a young girl (no more than seven) suddenly ages into an elderly woman before his eyes, screaming in confusion, something ignites in Francisco—a reserve of focused determination he\'s never accessed. La Signora\'s whispered words from their encounter echo: \"Intense force lies dormant until crisis awakens it.\" Francisco rushes toward the Piazza, reaching for his Trionfi cards.',
      focus: 'The temporal storm crisis forces Francisco to tap into dormant reserves of intense willpower and determination, transforming him from passive survivor into active protector',
      chapterSceneFocus: truncate('Ch42S1: Temporal chaos erupts, awakening Francisco\'s dormant intense willpower as crisis demands immediate protective action', 255),
      preliminarySceneFocus: 'Timeline collapse creates chaos in Bologna, forcing Francisco to access reserves of intense determination',
      preliminarySceneDescription: 'Francisco awakens to screams as dawn light flickers between eras—medieval stone becoming Renaissance marble then snapping back. In Piazza Maggiore, panicked citizens age decades in seconds then revert to childhood, buildings shift architectural styles mid-breath, air crackles with temporal energy. Francisco wants to believe this is another nightmare like timeline echoes; his family wants explanation and solutions. The Knight of Cups symbolism emerges: charging forward with intense emotional force when circumstances demand action. Temporal chaos represents obstacles requiring raw determination and unwavering resolve to reshape reality itself. Opposition: accelerating chaos, father demanding rational answers Francisco lacks, post-adventure hollowness threatening paralysis when action required. But as young girl ages into elderly woman before his eyes, screaming in confusion, something ignites—reserve of focused determination never accessed. La Signora\'s words echo: \"Intense force lies dormant until crisis awakens it.\" Francisco rushes toward Piazza, reaching for Trionfi cards. Urgent mobilization.',
      narrativeFunction: 'Establishes the temporal storm crisis as the Call to Adventure for Book 2, forcing Francisco to transform from passive post-adventure survivor into active protector. This scene demonstrates that intense willpower and determination lie dormant until crisis awakens them, introducing the chapter\'s theme of harnessing inner resolve to meet impossible challenges.',
      sensoryDetail: 'Dawn light flickers unstably between different historical eras. Medieval stone walls ripple becoming Renaissance marble then snap back violently. Screams echo through narrow streets. Piazza Maggiore crowds with panicked citizens—faces aging decades in heartbeats, skin wrinkling and smoothing repeatedly. Buildings shift architectural styles mid-breath creating disorienting visual chaos. Air crackles with visible temporal energy as purple-blue lightning. Young girl\'s terrified scream as her body ages catastrophically. La Signora\'s whispered words echoing in memory. Trionfi cards feeling urgent in Francisco\'s hand.',
      internalConflict: 'Francisco struggles with wanting to dismiss this as nightmare versus accepting it\'s real crisis requiring action, his post-adventure hollowness whispering he\'s too damaged and exhausted to help anyone. He grapples with his father\'s demand for rational explanations when Francisco barely understands temporal mechanics himself. The paralysis of feeling inadequate battles against the igniting spark of determination when witnessing innocent suffering—particularly the young girl aging catastrophically. Fear that he\'ll fail when people need him most versus the emerging fierce resolve.',
      characterGrowthElement: 'Francisco discovers that intense willpower lies dormant within him, accessible when crisis demands immediate protective action rather than personal glory. The sight of innocent suffering—especially the young girl aging—ignites reserves of focused determination he\'s never tapped, transforming him from passive survivor questioning whether survival equals success into active protector for whom success means saving others. He\'s learning that inner resolve awakens not through deliberate cultivation but through circumstances demanding unwavering response.',
      seriesConnectionResonance: 'The temporal storm crisis establishes the ongoing threat for Book 2: timeline convergence points that Francisco must stabilize across Europe. His awakening of dormant intense willpower creates the foundation for his evolution toward cosmic guardian. The Trionfi cards\' potential for defensive protective use rather than just exploration becomes crucial for the series. This scene begins Francisco\'s transformation from reluctant hero to determined leader.',
      sceneCardProgression: 82,
      realWorldContext: 'The temporal crisis mirrors real-world moments when catastrophic events force individuals to access reserves of strength and determination they didn\'t know they possessed—natural disasters, medical emergencies, protecting loved ones. The paralysis of post-trauma hollowness battling against crisis-activated resolve reflects how trauma survivors often find unexpected capabilities when circumstances demand immediate action. The young girl\'s suffering representing the catalyst for action mirrors how witnessing innocent vulnerability often ignites protective determination.',
      timelineSignificance: 'Establishes that timeline convergence has escalated from Francisco\'s personal echoes to catastrophic public collapse affecting all Bologna citizens. This marks the threshold where temporal instability becomes existential threat requiring immediate intervention, forcing Francisco to channel intense willpower into reality stabilization or watch innocent people suffer the consequences of cosmic forces beyond their understanding.',
      saveTheCatBeat: 'Inciting Incident - Timeline Crisis Erupts',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on awakening to screams with dawn light flickering between eras, witnessing Piazza chaos as citizens age and de-age, buildings shifting architectural styles, father demanding explanations, the paralyzing hollowness threatening inaction, seeing the young girl age catastrophically and scream, the igniting spark of fierce determination, La Signora\'s words echoing, rushing toward Piazza with Trionfi cards. Show the transformation from passive to active.',
        sudowrite_emotional_arc: 'Begins with disoriented awakening hoping this is nightmare, moves through mounting horror and paralyzed inadequacy as crisis accelerates, reaches ignited urgent determination as witnessing innocent suffering awakens dormant intense willpower. The emotional journey is from paralyzed hollowness through horrified inadequacy to fierce protective mobilization.',
        sudowrite_sensory_emphasis: 'Emphasize flickering dawn light between eras, medieval stone rippling to Renaissance marble, screams echoing, citizens aging and de-aging repeatedly, buildings shifting styles mid-breath, air crackling with purple-blue temporal lightning, young girl\'s catastrophic aging and terrified scream, Trionfi cards urgent in hand.',
      },
      learning_objectives: {
        integration: 'Crisis-Activated Willpower and Protective Determination',
        terminal_objectives: [
          'Recognize that intense willpower and determination lie dormant within you, accessible when crisis demands immediate protective action rather than personal achievement',
          'Transform from passive survivor questioning your worth into active protector for whom success means saving others from suffering',
          'Access reserves of focused resolve you didn\'t know existed by allowing witnessing innocent vulnerability to ignite fierce protective determination',
        ],
      },
      foreshadowing_elements: [
        'La Signora\'s words about intense force lying dormant foreshadow Francisco\'s ongoing willpower development',
        'The temporal chaos foreshadows timeline convergence points Francisco must stabilize throughout Book 2',
        'Francisco reaching for Trionfi cards foreshadows their defensive protective capabilities revealed in Scene 3',
      ],
    },
    {
      // Scene 2: The Train Manifests
      pages: 'Page 21 - 24',
      description: 'As Francisco reaches the Piazza\'s center, the Zanetti Train materializes—not at the distant station but violently erupting into existence in the square itself, surrounded by crackling arcs of temporal lightning. The train\'s doors open and Dante emerges, aged and urgent, carrying instruments that measure timeline convergence. Francisco wants answers about what\'s causing this collapse; Dante wants Francisco\'s immediate help stabilizing the convergence points before Bologna is erased from existence. Dante reveals the stakes: multiple timelines are colliding because of ripple effects from Francisco\'s Book 1 choices—the temporal web is more interconnected than anyone knew, and innocent people suffer the consequences. Opposition intensifies through the storm\'s acceleration (buildings now phasing between centuries per second), arriving passengers from alternate timelines adding to the confusion, and Francisco\'s self-doubt—can his willpower alone stop catastrophic timeline collapse? But Dante\'s faith is absolute: \"You crossed dimensions and survived Dagon. Now channel that same intense force into stabilization.\" Francisco grips his Trionfi cards, feeling them pulse with protective potential.',
      focus: 'Dante\'s arrival establishes timeline convergence mechanics and raises stakes—Francisco\'s past choices affect innocent people—while introducing Trionfi cards\' defensive capabilities',
      chapterSceneFocus: truncate('Ch42S2: Zanetti Train arrival reveals timeline convergence caused by Francisco\'s choices, demanding he channel willpower into stabilization', 255),
      preliminarySceneFocus: 'Dante arrives via Zanetti Train, revealing Francisco\'s choices caused convergence requiring immediate stabilization',
      preliminarySceneDescription: 'As Francisco reaches Piazza center, Zanetti Train materializes—not at distant station but violently erupting in square itself, surrounded by crackling temporal lightning arcs. Doors open and Dante emerges aged and urgent, carrying timeline convergence instruments. Francisco wants answers about collapse causes; Dante wants immediate stabilization help before Bologna\'s erasure. The Knight charging into battle symbolism: Francisco harnessing inner resolve to meet unexpected challenges. Train\'s violent arrival represents destiny demanding he reshape reality through focused mental grit, proving determination can overcome seemingly impossible obstacles. Dante reveals stakes: multiple timelines colliding because of Francisco\'s Book 1 choice ripple effects—temporal web more interconnected than known, innocent people suffering consequences. Opposition intensifies: storm accelerating (buildings phasing between centuries per second), alternate timeline passengers adding confusion, Francisco\'s self-doubt about willpower stopping catastrophic collapse. But Dante\'s absolute faith: \"You crossed dimensions and survived Dagon. Channel that same intense force into stabilization.\" Francisco grips Trionfi cards, feeling protective potential pulse. Committed resolve despite overwhelming odds.',
      narrativeFunction: 'Establishes the timeline convergence mechanics crucial for Book 2\'s plot and raises moral stakes by revealing Francisco\'s past choices created ripple effects harming innocent people. This scene introduces Dante as guide who believes in Francisco\'s capability, teaching him that Trionfi cards can stabilize reality defensively through channeled willpower, not just explore timelines.',
      sensoryDetail: 'The Zanetti Train erupts into existence with explosive force—crackling arcs of temporal lightning surrounding its materialization. Dante steps off aged beyond his years, face lined with urgency and fatigue. Timeline convergence instruments hum and beep measuring dimensional stress. Buildings phasing between centuries creates nauseating visual strobing—Romanesque to Gothic to Baroque per second. Alternate timeline passengers emerge disoriented adding to chaos. Trionfi cards pulse with protective energy Francisco can physically feel. Dante\'s absolute faith radiating through his conviction.',
      internalConflict: 'Francisco struggles with guilt learning his Book 1 choices caused this catastrophe—questioning whether his heroic journey created more harm than good, whether innocent suffering is the price of his cosmic growth. He grapples with self-doubt about whether his willpower alone can stop timeline collapse of this magnitude, feeling inadequate compared to Dante\'s aged expertise. The temptation to flee and let someone else handle this battles against Dante\'s absolute faith that Francisco possesses the necessary intense force. Fear that channeling determination into stabilization might fail catastrophically.',
      characterGrowthElement: 'Francisco learns that his actions have far-reaching consequences beyond personal survival—that the temporal web interconnects all choices, making him responsible for protecting innocent people affected by his cosmic journey. Dante\'s absolute faith teaches Francisco to trust his own intense willpower even when self-doubt whispers inadequacy. He discovers the Trionfi cards can channel focused determination into defensive reality stabilization, not just exploratory timeline viewing—transforming them from passive observation tools into active protective instruments.',
      seriesConnectionResonance: 'The timeline convergence mechanics established here become the central threat for Book 2 and crucial for Books 8-9. Dante\'s role as Francisco\'s guide and faith-keeper positions him as the mentor figure who believes in Francisco\'s potential when Francisco doubts himself. The revelation that Trionfi cards can stabilize reality through channeled willpower creates the foundation for Francisco\'s defensive cosmic guardian abilities throughout the series.',
      sceneCardProgression: 83,
      realWorldContext: 'The revelation that past choices created unintended harm mirrors real-world experiences where well-intentioned actions have unforeseen negative consequences—the moral weight of recognizing your decisions affect others beyond immediate awareness. Dante\'s absolute faith despite Francisco\'s self-doubt reflects how mentors often see potential their students can\'t yet perceive. The need to channel willpower into stabilization rather than just exploration mirrors how maturity requires using capabilities for protection and service rather than personal gain.',
      timelineSignificance: 'Establishes that Francisco\'s Book 1 choices created ripple effects throughout the temporal web, causing convergence points that threaten to erase entire cities from existence. This revelation transforms timeline instability from personal consequence into moral responsibility—Francisco must stabilize convergence points to prevent innocent suffering from his cosmic actions. The Zanetti Train\'s ability to manifest at crisis points becomes crucial for rapid response.',
      saveTheCatBeat: 'Inciting Incident - Stakes Revealed',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on Zanetti Train erupting violently into Piazza with temporal lightning, Dante emerging aged and urgent with convergence instruments, learning his choices caused this catastrophe and guilt flooding, buildings phasing between centuries nauseating strobing, alternate passengers adding confusion, self-doubt about willpower\'s adequacy, Dante\'s absolute faith radiating conviction, Trionfi cards pulsing with protective potential, committed resolve forming despite overwhelming odds. Show transformation from guilt to determined responsibility.',
        sudowrite_emotional_arc: 'Begins with desperate need for answers as crisis escalates, moves through guilt and self-doubt learning he caused innocent suffering, reaches committed resolve as Dante\'s faith and Trionfi cards\' protective pulse awaken determination to channel intense force into stabilization. The emotional journey is from seeking external solutions through guilt-ridden inadequacy to accepting responsibility with fierce determination.',
        sudowrite_sensory_emphasis: 'Emphasize Train erupting with explosive temporal lightning, Dante aged and urgent, convergence instruments humming and beeping, buildings phasing Romanesque-Gothic-Baroque per second creating nauseating strobing, alternate passengers disoriented, Trionfi cards pulsing protectively, Dante\'s faith radiating absolute conviction.',
      },
      learning_objectives: {
        integration: 'Moral Responsibility and Channeled Willpower',
        terminal_objectives: [
          'Accept that your past choices create ripple effects affecting innocent others throughout interconnected systems—cosmic or mundane—requiring you to take responsibility for unintended consequences',
          'Learn to channel intense willpower into defensive protective actions rather than just exploratory personal growth, transforming capabilities from self-serving to service-oriented',
          'Trust mentors\' faith in your potential even when self-doubt whispers inadequacy, recognizing that their perspective may see capabilities you can\'t yet perceive',
        ],
      },
      foreshadowing_elements: [
        'Timeline convergence mechanics foreshadow the ongoing stabilization mission throughout Book 2',
        'Dante\'s aged appearance foreshadows the personal cost of cosmic guardianship',
        'Trionfi cards\' protective pulse foreshadows Francisco\'s defensive capabilities revealed in Scene 3',
      ],
    },
    {
      // Scene 3: Cards of Protection
      pages: 'Page 25 - 27',
      description: 'Francisco spreads his Trionfi cards in a protective circle around his family (who\'ve followed him to the Piazza), around Gherardo (resentment forgotten in terror), around the aging-and-de-aging citizens. He doesn\'t fully understand the mechanism, but focused determination guides his hands—The Tower to absorb chaos, The Star to anchor hope, The World to stabilize boundaries between timelines. Francisco wants to shield everyone while learning this new defensive application; Novella (arrived with Dante) wants to help, revealing she can perceive the timeline shifts as colored ribbons weaving through space. Opposition comes from Francisco\'s inexperience (he\'s only used cards for exploration, never protection), the storm\'s relentless pressure threatening to shatter his concentration, and his lingering hollowness trying to convince him he\'s not strong enough. But as Novella describes which timeline ribbons are fraying and where, Francisco channels intense willpower into each card placement—not hoping or wishing, but commanding reality to stabilize through sheer mental force. Citizens stop flickering between ages. Buildings lock into their proper century. The temporal lightning recedes slightly. Francisco discovers: sustained passion and persistence can outlast even timeline chaos.',
      focus: 'Francisco successfully uses Trionfi cards defensively, demonstrating how focused willpower and persistent effort can stabilize reality when combined with Novella\'s perception',
      chapterSceneFocus: truncate('Ch42S3: Francisco uses Trionfi cards protectively for first time, channeling willpower to stabilize reality and save citizens', 255),
      preliminarySceneFocus: 'Francisco creates protective circle with Trionfi cards, channeling determination to stabilize timeline chaos',
      preliminarySceneDescription: 'Francisco spreads Trionfi cards in protective circle around family (following to Piazza), around Gherardo (resentment forgotten in terror), around aging-de-aging citizens. Doesn\'t fully understand mechanism, but focused determination guides hands—Tower to absorb chaos, Star to anchor hope, World to stabilize timeline boundaries. Francisco wants to shield everyone while learning defensive application; Novella (arrived with Dante) wants to help, revealing she perceives timeline shifts as colored ribbons weaving through space. The Knight wielding cup as vessel and weapon: Francisco\'s willpower becomes tool to channel cosmic forces, demonstrating raw determination combined with focused practice can reshape even destiny when obstacles demand unwavering resolve. Opposition: inexperience (only used cards for exploration never protection), storm\'s relentless pressure threatening concentration shattering, lingering hollowness trying to convince him he\'s not strong enough. But as Novella describes which ribbons fray and where, Francisco channels intense willpower into each placement—not hoping but commanding reality stabilize through sheer mental force. Citizens stop flickering. Buildings lock into proper century. Temporal lightning recedes. Hard-won temporary victory.',
      narrativeFunction: 'Demonstrates Francisco\'s successful first defensive use of Trionfi cards, proving that focused willpower channeled through persistent effort can stabilize reality even without complete understanding. This scene introduces Novella\'s latent temporal perception abilities and establishes the partnership between Francisco\'s determination and others\' unique gifts, showing that sustained passion can outlast impossible circumstances.',
      sensoryDetail: 'Trionfi cards spread in protective circle glow with channeled energy. The Tower card absorbs chaotic temporal energy visibly. The Star card radiates anchoring light. The World card pulses creating boundary stabilization. Novella\'s eyes see colored ribbons weaving through space—timeline threads visible only to her perception. Citizens\' flickering slows then stops. Buildings\' architectural phasing decelerates then locks. Temporal lightning recedes from purple-blue intensity to distant crackling. Francisco\'s hands trembling with sustained concentration. Sweat beading despite cool morning air.',
      internalConflict: 'Francisco struggles with inexperience—having only used cards for exploration, uncertain how defensive protection works, afraid his incomplete understanding will cause failure. He grapples with the storm\'s relentless pressure threatening to shatter his concentration, questioning whether his willpower can sustain long enough. The lingering hollowness whispers he\'s not strong enough for this, that he should let someone more qualified handle protection. Fear that commanding reality through mental force is hubris rather than capability.',
      characterGrowthElement: 'Francisco discovers that he can channel intense willpower into Trionfi cards to reshape reality defensively, not just observe timelines—learning that focused determination combined with persistent effort creates protective force even without complete theoretical understanding. Novella\'s partnership teaches him that his willpower amplifies when combined with others\' unique perceptions, transforming solo effort into collaborative cosmic protection. He proves to himself that sustained passion and persistence can outlast even timeline chaos, building confidence in his emerging guardian capabilities.',
      seriesConnectionResonance: 'The defensive Trionfi card usage becomes Francisco\'s signature protective capability throughout the series. Novella\'s timeline perception abilities establish her as crucial partner for Book 2\'s convergence stabilization missions. The discovery that willpower channeled through cards can command reality stabilization creates the foundation for Francisco\'s cosmic guardian techniques in future books. The temporary victory demonstrates the ongoing challenge—stabilization requires constant vigilance.',
      sceneCardProgression: 84,
      realWorldContext: 'The protective circle mirrors real-world crisis responses where individuals must act decisively despite incomplete understanding—medical emergencies, disaster response, protecting vulnerable populations. Novella\'s unique perception helping Francisco\'s willpower reflects how effective crisis response combines different capabilities and perspectives. The discovery that sustained determination outlasts chaos applies to any situation requiring persistent effort through overwhelming circumstances—the power of not giving up even when success seems impossible.',
      timelineSignificance: 'Establishes that focused willpower channeled through Trionfi cards can temporarily stabilize timeline convergence points, preventing catastrophic collapse and protecting innocent people from temporal chaos. This temporary victory demonstrates both Francisco\'s growing capabilities and the ongoing nature of the threat—stabilization requires sustained effort, not just single heroic moments.',
      saveTheCatBeat: 'Debate - Proving Capability Through Action',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on spreading Trionfi cards in protective circle around family and Gherardo and citizens, focused determination guiding hands despite incomplete understanding, Tower absorbing chaos, Star anchoring hope, World stabilizing boundaries, Novella revealing she sees colored timeline ribbons, inexperience and hollowness whispering inadequacy, channeling intense willpower not hoping but commanding, citizens\' flickering stopping, buildings locking into proper century, temporal lightning receding, the trembling triumph of hard-won victory. Show transformation from uncertain attempt to commanding confidence.',
        sudowrite_emotional_arc: 'Begins with desperate protective attempt despite inexperience and self-doubt, moves through sustained fierce concentration as Novella\'s perception guides placement, reaches triumphant discovery that willpower can command reality stabilization as citizens stop flickering and chaos recedes. The emotional journey is from uncertain protective desperation through sustained focused determination to hard-won victorious confidence.',
        sudowrite_sensory_emphasis: 'Emphasize Trionfi cards glowing with channeled energy, Tower absorbing chaos visibly, Star radiating anchoring light, World pulsing boundary stabilization, Novella\'s eyes seeing colored ribbons, citizens\' flickering slowing and stopping, buildings\' phasing decelerating and locking, temporal lightning receding, hands trembling with concentration, sweat beading.',
      },
      learning_objectives: {
        integration: 'Channeled Willpower and Collaborative Protection',
        terminal_objectives: [
          'Discover that focused willpower can channel cosmic forces to reshape reality defensively even without complete theoretical understanding—that determination enables action despite uncertainty',
          'Learn that your capabilities amplify when combined with others\' unique perceptions and gifts, transforming solo effort into collaborative cosmic protection',
          'Prove that sustained passion and persistence can outlast even overwhelming chaos, building confidence that intense determination creates lasting protective force',
        ],
      },
      foreshadowing_elements: [
        'Novella\'s timeline ribbon perception foreshadows her crucial role in future convergence stabilization missions',
        'The temporary nature of stabilization foreshadows the ongoing vigilance required throughout Book 2',
        'Francisco\'s commanding rather than hoping foreshadows his evolution toward authoritative cosmic guardian',
      ],
    },
    {
      // Scene 4: The Guardian's Threshold
      pages: 'Page 28 - 30',
      description: 'As the immediate crisis stabilizes but doesn\'t resolve, Dante reveals the full truth: this is only the first timeline convergence point, and more will follow across Europe unless Francisco helps locate and stabilize them all. Francisco wants to refuse—he\'s exhausted, still hollow from Book 1\'s aftermath, craving ordinary life. His family wants him safe at home; Gherardo, witnessing his brother\'s power, wants... something complex Francisco can\'t yet name. But Novella, eyes still seeing timeline ribbons, speaks what Francisco already knows: refusing means watching innocents suffer the consequences of his past choices, and he can no longer be a passive survivor. Opposition comes not from external forces but Francisco\'s own fear of commitment, of stepping fully into the guardian role, of channeling his willpower toward long-term cosmic protection rather than personal recovery. Yet as he looks at the citizens he just saved, at the young girl now restored to her proper age clinging to her mother, at the Trionfi cards still glowing with protective energy, Francisco makes his choice. He will master this intense force within him. He will build the mental grit to persevere through timeline after timeline. He will become what circumstances demand.',
      focus: 'Francisco accepts the Call to Adventure and commits to becoming a timeline guardian, transforming from reluctant survivor into determined cosmic protector committed to long-term perseverance',
      chapterSceneFocus: truncate('Ch42S4: Francisco accepts guardian role despite exhaustion, committing to master willpower for long-term cosmic protection', 255),
      preliminarySceneFocus: 'Francisco accepts Call to Adventure as timeline guardian despite craving ordinary life and recovery',
      preliminarySceneDescription: 'As immediate crisis stabilizes but doesn\'t resolve, Dante reveals full truth: this is only first timeline convergence point, more will follow across Europe unless Francisco helps locate and stabilize them all. Francisco wants to refuse—exhausted, still hollow from Book 1, craving ordinary life. Family wants him safe home; Gherardo witnessing brother\'s power wants something complex Francisco can\'t name. But Novella, eyes still seeing timeline ribbons, speaks what Francisco knows: refusing means watching innocents suffer consequences of his past choices, and he can no longer be passive survivor. The Knight\'s charge complete symbolism: Francisco fully commits to harnessing inner resolve as way of life, not just crisis response. Acceptance embodies theme that cultivating willpower and sustained determination isn\'t about single victories but building perseverance to reshape destiny repeatedly, proving raw determination can become disciplined mastery. Opposition from Francisco\'s fear of commitment, stepping fully into guardian role, channeling willpower toward long-term cosmic protection rather than personal recovery. Yet looking at saved citizens, young girl restored clinging to mother, Trionfi cards glowing protectively, Francisco chooses. Will master this intense force. Build mental grit to persevere through timeline after timeline. Become what circumstances demand. Resolute acceptance.',
      narrativeFunction: 'Completes Francisco\'s transformation from reluctant post-adventure survivor to committed cosmic guardian, establishing his long-term mission for Book 2 and beyond. This scene demonstrates that true willpower requires sustained commitment to persevere repeatedly when circumstances demand unwavering resolve, not just single crisis responses, marking Francisco\'s full acceptance of the Call to Adventure.',
      sensoryDetail: 'The Piazza now stable but showing scars—temporal lightning burn marks on stones, disoriented citizens slowly recovering awareness. Dante\'s aged face lined with solemn certainty about ongoing threat. Family\'s anxious faces wanting Francisco safe. Gherardo\'s complex expression mixing awe, resentment, and something unnameable. Novella\'s eyes still seeing colored timeline ribbons weaving future possibilities. The young girl clinging to her mother, restored to proper age, alive because of Francisco\'s intervention. Trionfi cards still glowing faintly with residual protective energy. Francisco\'s exhaustion warring with emerging resolute purpose.',
      internalConflict: 'Francisco struggles with desperate desire for ordinary life recovery versus moral obligation to protect innocents from consequences of his cosmic choices. He grapples with exhaustion and lingering hollowness telling him he\'s earned rest, that someone else should handle ongoing guardianship, that he\'s given enough. Fear of long-term commitment to cosmic protection battles against the knowledge that refusing means watching innocents suffer. The temptation to return to passive survival versus accepting active guardian responsibility. Recognition that choosing this path means sacrificing ordinary life permanently.',
      characterGrowthElement: 'Francisco completes his transformation by accepting that true willpower isn\'t about single crisis responses but building sustained determination to persevere repeatedly when circumstances demand protection. He chooses to become a timeline guardian not from desire for glory or external validation, but from moral responsibility to prevent innocent suffering caused by his cosmic actions. The decision to master intense force within him and build mental grit for long-term perseverance marks his evolution from reluctant hero to committed cosmic protector who reshapes destiny through disciplined determined mastery rather than raw emotional force.',
      seriesConnectionResonance: 'Francisco\'s acceptance of the guardian role establishes his primary mission for Book 2—locating and stabilizing timeline convergence points across Europe. His commitment to mastering willpower and building sustained determination creates the foundation for his evolution throughout Books 3-9 as cosmic protector. The recognition that this choice means sacrificing ordinary life sets up ongoing tension between personal desires and cosmic responsibilities. Novella\'s role as truth-speaker who voices what Francisco already knows positions her as moral compass.',
      sceneCardProgression: 85,
      realWorldContext: 'The choice between ordinary life recovery and ongoing service mirrors real-world decisions where individuals with unique capabilities must choose between personal comfort and using their gifts to help others—healthcare workers during crises, activists fighting injustice, caregivers sacrificing personal goals. The recognition that single heroic acts aren\'t enough, that sustained commitment is required, reflects how meaningful change demands long-term perseverance rather than momentary effort. The acceptance of permanent sacrifice for moral responsibility applies to any calling that demands prioritizing service over personal desires.',
      timelineSignificance: 'Establishes that Francisco commits to becoming timeline guardian for the foreseeable future, accepting responsibility for stabilizing convergence points created by cosmic forces and his own choices. This decision marks the threshold where he steps from ordinary life into permanent cosmic service, transforming temporal instability from abstract threat into personal mission requiring sustained vigilance and determination across multiple timelines and locations.',
      saveTheCatBeat: 'Break into Two - Accepting the Journey',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on stable but scarred Piazza, Dante revealing ongoing convergence point threat, desperate desire for ordinary life and recovery, family wanting him safe, Gherardo\'s complex unnameable expression, Novella speaking moral truth about refusing meaning innocent suffering, exhaustion warring with emerging purpose, looking at saved citizens especially young girl restored, Trionfi cards glowing protectively, making the choice to master intense force and build mental grit, accepting what circumstances demand. Show the transformation from tempted refusal to resolute acceptance.',
        sudowrite_emotional_arc: 'Begins with exhausted desperation for ordinary life recovery as Dante reveals ongoing threat, moves through internal battle between personal desires and moral responsibility, reaches resolute acceptance as looking at saved citizens crystallizes commitment to guardian role and sustained perseverance. The emotional journey is from tempted refusal through moral wrestling to purposeful determined acceptance.',
        sudowrite_sensory_emphasis: 'Emphasize stable Piazza showing temporal burn scars, Dante\'s aged solemn face, family\'s anxious wanting him safe, Gherardo\'s complex mixing awe and resentment, Novella\'s eyes seeing timeline ribbons, young girl clinging to mother alive because of Francisco, Trionfi cards\' faint protective glow, exhaustion warring with emerging resolute purpose.',
      },
      learning_objectives: {
        integration: 'Long-Term Commitment and Sustained Determination',
        terminal_objectives: [
          'Accept that true willpower and determination require sustained long-term commitment to persevere repeatedly when circumstances demand protection, not just single crisis responses',
          'Choose to prioritize moral responsibility to prevent innocent suffering over personal desires for ordinary life recovery, recognizing that unique capabilities create obligations',
          'Commit to mastering intense force within you and building mental grit for ongoing perseverance, transforming raw determination into disciplined mastery through dedicated practice',
        ],
      },
      foreshadowing_elements: [
        'The ongoing convergence point mission foreshadows Francisco\'s travels across Europe throughout Book 2',
        'Gherardo\'s complex unnameable reaction foreshadows future sibling conflicts about Francisco\'s cosmic path',
        'Novella\'s moral compass role foreshadows her ongoing influence on Francisco\'s decisions',
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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 255),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-042 complete import finished!');
  console.log('⚡ INTENSE FORCE - Timeline Guardian Mission Begins!\n');
  console.log('\n📊 Verifying scene completion...\n');

  // Verify all fields are populated
  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  const allFields = [
    'title',
    'setup',
    'symbolism',
    'beatGoal',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'timeline_date',
    'timeline_variant',
    'location',
    'pages',
    'description',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'preliminarySceneDescription',
    'narrativeFunction',
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
  ];

  for (const scene of finalScenes) {
    const populatedCount = allFields.filter((field) => {
      const value = (scene as any)[field];
      return value !== null && value !== undefined;
    }).length;

    console.log(`Scene ${scene.sceneNumber}: ${populatedCount}/${allFields.length} fields populated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
