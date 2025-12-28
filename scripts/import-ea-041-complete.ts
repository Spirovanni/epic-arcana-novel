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

interface EA041Data {
  id: string;
  title?: string;
  specific_task_group_title?: string;
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

function findEA041Data(): EA041Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA041Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-041') return obj as EA041Data;

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
  console.log('🔍 Searching for EA-041 in outline...\n');

  const ea041Data = findEA041Data();

  if (!ea041Data) {
    console.error('❌ EA-041 not found in outline');
    process.exit(1);
  }

  const title = ea041Data.specific_task_group_title || ea041Data.title || 'Abandoned Success';

  console.log(`✅ Found EA-041: ${title}`);
  console.log(`   Scenes: ${ea041Data.scenes?.length || 0}\n`);
  console.log('📖 BOOK 2 BEGINS - Abandoned Success!\n');

  // Find chapter 41 in the same book as EA-040
  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-041'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-041 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find EA-040 first to get the book ID
    const ea040 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueIdentifier, 'EA-040'))
      .limit(1);

    if (ea040.length === 0) {
      console.error('❌ EA-040 not found - cannot determine book ID');
      process.exit(1);
    }

    const ea040BookId = ea040[0].bookId;

    // EA-040 is chapter 40 (last chapter of Book 1), so EA-041 (chapter 41)
    // is in the next book (Book 2, which starts fresh at chapter 1)
    // Actually, check if chapter 41 exists anywhere
    const allChapters = await db.select().from(chapters);
    let ch41 = allChapters.find(ch => ch.chapterNumber === 41);

    if (!ch41) {
      console.error(`❌ Chapter 41 not found in database`);
      console.log(`   Available chapter numbers: ${[...new Set(allChapters.map(ch => ch.chapterNumber))].sort((a, b) => a! - b!).join(', ')}`);
      process.exit(1);
    }

    chapter = ch41;
    console.log(`✅ Found Chapter 41: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-041',
        title: title,
        epicNovelPages: truncate(ea041Data.epic_novel_pages, 50),
        epicChapterFocus: ea041Data.epic_chapter_focus,
        epicNovelChapterFocus: ea041Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea041Data.tarot_family, 100),
        tarotCardItem: truncate(ea041Data.tarot_card_item, 100),
        heroJourneyBeat: ea041Data.hero_journey_beat?.substring(0, 99) || null,
        saveTheCatBeat: ea041Data.save_the_cat_beat?.substring(0, 100) || null,
        summary: ea041Data.summary,
        characterArcs: typeof ea041Data.character_arcs === 'string'
          ? ea041Data.character_arcs
          : JSON.stringify(ea041Data.character_arcs),
        storyGapsAddressed: typeof ea041Data.story_gaps_addressed === 'string'
          ? ea041Data.story_gaps_addressed
          : JSON.stringify(ea041Data.story_gaps_addressed),
        locationDetails: typeof ea041Data.location_details === 'string'
          ? ea041Data.location_details
          : JSON.stringify(ea041Data.location_details),
        seriesConnections: typeof ea041Data.series_connections === 'string'
          ? ea041Data.series_connections
          : JSON.stringify(ea041Data.series_connections),
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-041 data\n');
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

  for (const sceneData of ea041Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-041',
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
      // Scene 1: Return to Smallness
      pages: 'Page 1 - 5',
      description: 'Francisco returns to his Bologna family home after cosmic adventures, the narrow stone corridors and familiar law books now feeling suffocating rather than comforting. His father\'s proud greeting and mother\'s relieved embrace should feel welcoming, but Francisco\'s mind echoes with Pangaea\'s vastness, cosmic battles\' weight, and Dagon\'s insidious whispers. He wants to feel the joy of homecoming and reconnection with ordinary life; his family wants their brilliant son back, expecting triumphant stories. Opposition arises from the gap between their expectations and his hollow reality—he survived, but the victory feels empty. The law scrolls that once excited him now seem trivial compared to dimensional fractures. As shadows move incorrectly in the corner of his vision (temporal echoes from alternate timelines), Francisco realizes he cannot articulate what he\'s lost. The scene lands on profound displacement.',
      focus: 'Francisco\'s return establishes his post-adventure hollowness and introduces temporal instability, demonstrating that unmet expectations leave him questioning whether survival equals success',
      chapterSceneFocus: truncate('Ch41S1: Post-adventure return reveals that surviving cosmic threats doesn\'t equal succeeding when expectations remain unmet', 255),
      preliminarySceneFocus: 'Francisco returns home but feels displaced, questioning whether survival without glory constitutes success',
      preliminarySceneDescription: 'Francisco returns to Bologna family home after cosmic adventures—narrow stone corridors and familiar law books now suffocating rather than comforting. Father\'s proud greeting and mother\'s relieved embrace should feel welcoming, but Francisco\'s mind echoes with Pangaea\'s vastness, cosmic battles, Dagon\'s whispers. He wants homecoming joy and ordinary life reconnection; family wants brilliant son back with triumphant stories. The Eight of Cups symbolism emerges: walking away from achievements that no longer fulfill, recognizing that past successes (surviving Dagon) feel abandoned because they didn\'t bring expected satisfaction. The home\'s smallness mirrors emotional constriction. Opposition: gap between expectations and hollow reality—survived but victory feels empty. Law scrolls once exciting now seem trivial versus dimensional fractures. As shadows move incorrectly (temporal echoes from alternate timelines), Francisco cannot articulate what he\'s lost. Profound displacement.',
      narrativeFunction: 'Establishes Book 2\'s opening emotional state: Francisco\'s post-adventure hollowness and the gap between survival and success. This scene introduces temporal instability through shadow echoes, demonstrating that unmet expectations and the loss of anticipated glory leave him questioning his heroic journey\'s worth.',
      sensoryDetail: 'The Bologna home feels constricting—narrow stone corridors pressing in, familiar law books lining walls like prison bars. Father\'s proud embrace, mother\'s relieved tears. Francisco\'s mind echoes with Pangaea\'s cosmic vastness creating disorienting contrast. Law scrolls\' musty parchment smell now seems trivial. Shadows move incorrectly in peripheral vision—temporal echoes manifesting as visual distortions. The weight of unspoken loss settles heavily. Home\'s smallness creates suffocating atmosphere.',
      internalConflict: 'Francisco struggles with inability to feel joy at homecoming despite genuine love for his family, questioning what\'s broken inside him that surviving cosmic threats doesn\'t bring triumph. He grapples with articulating his experience—how to explain dimensional battles and Dagon\'s corruption to people who exist in comfortable ordinary reality. The gap between who he was (excited law student) and who he is now (hollow survivor) creates profound identity crisis. Fear that he\'ll never belong anywhere again.',
      characterGrowthElement: 'Francisco begins Book 2 confronting the aftermath of Book 1\'s heroic journey—discovering that surviving doesn\'t equal succeeding and that unmet expectations (no glory, no triumphant return) create deeper wounds than physical dangers. He\'s learning that heroism\'s cost includes losing the person you were, and that displacement might be permanent. The temporal echoes hint at his growing awareness that multiple paths existed, deepening his sense of lost potential.',
      seriesConnectionResonance: 'The post-adventure hollowness establishes Francisco\'s vulnerability for Book 2\'s timeline manipulation challenges. His questioning whether survival equals success creates the emotional foundation for exploring alternate choices and paths not taken. The temporal instability (shadow echoes) introduces the mechanic that will dominate Book 2\'s plot: glimpses of alternate timelines and the temptation to change past decisions.',
      sceneCardProgression: 78,
      realWorldContext: 'The homecoming displacement mirrors real-world experiences of returning from transformative journeys (military service, study abroad, intense projects) and finding that home feels smaller, that family doesn\'t understand changed perspective, that previous passions now seem trivial. The gap between survival and success reflects how achieving goals sometimes brings emptiness rather than fulfillment. The inability to articulate experience reflects trauma\'s isolating nature.',
      timelineSignificance: 'Establishes the post-Book 1 timeline as unstable (Prime Timeline fragmenting), with temporal echoes indicating that Francisco\'s cosmic adventures have created timeline vulnerabilities. This instability will escalate throughout Book 2, making this homecoming the last moment of relative stability before reality\'s fabric tears.',
      saveTheCatBeat: 'Setup - Post-Adventure Ordinary World',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the constricting stone corridors versus memory of Pangaea\'s vastness, family\'s loving embrace feeling wrong, inability to feel joy or articulate loss, law scrolls\' triviality versus dimensional fractures, shadows moving incorrectly as temporal echoes, the profound displacement settling. Show the gap between who he was and who he is now.',
        sudowrite_emotional_arc: 'Begins with attempted homecoming warmth battling against hollowness, moves through mounting realization that surviving didn\'t bring success, reaches profound displacement as temporal echoes manifest. The emotional journey is from forced normalcy through creeping wrongness to isolated alienation.',
        sudowrite_sensory_emphasis: 'Emphasize narrow stone corridors pressing in, law books as prison bars, father\'s proud embrace and mother\'s tears, Pangaea\'s vast echoes creating contrast, parchment\'s musty smell, shadows moving incorrectly in peripheral vision, unspoken loss\'s weight, home\'s suffocating smallness.',
      },
      learning_objectives: {
        integration: 'Post-Adventure Reflection and Unmet Expectations',
        terminal_objectives: [
          'Recognize that surviving cosmic threats doesn\'t automatically equal succeeding when achievements fail to bring expected fulfillment or validation',
          'Acknowledge the gap between who you were before transformative experiences and who you become afterward, accepting that displacement may be permanent',
          'Begin reflecting on whether past achievements truly aligned with deeper values or merely pursued external glory and family expectations',
        ],
      },
      foreshadowing_elements: [
        'Temporal echoes (shadows moving incorrectly) foreshadow the timeline instability that will dominate Book 2',
        'The inability to articulate loss foreshadows Francisco\'s vulnerability to timeline manipulation',
        'The question of survival versus success foreshadows La Signora\'s teachings about reframing achievement',
      ],
    },
    {
      // Scene 2: The Weight of Glory Lost
      pages: 'Page 6 - 10',
      description: 'In his childhood study chamber, Francisco attempts to review Cicero\'s legal texts but finds himself staring at the Trionfi cards spread before him—cards that now show him flickering visions of alternate timelines where he made different choices during his encounter with Dagon. His younger brother Gherardo interrupts with thinly veiled resentment, diminished by Francisco\'s adventures and feeling left behind. Francisco wants validation that his choices mattered and his suffering had purpose; Gherardo wants recognition for staying dutiful while Francisco chased glory. La Signora (the mysterious presence growing closer) observes from the threshold, sensing Francisco\'s vulnerability. Opposition intensifies through family expectations (his father discussing prestigious law appointments), Gherardo\'s pointed comparisons, and Francisco\'s own fragmentary memories of paths not taken—timelines where he gained greater glory but at terrible costs. As echoes of conversations that never happened ripple through the room, Francisco questions whether his heroic journey was worth losing the person he used to be.',
      focus: 'Francisco confronts unmet family expectations and glimpses alternate timelines, establishing vulnerability to timeline manipulation through his desperate need for validation',
      chapterSceneFocus: truncate('Ch41S2: Trionfi cards reveal alternate timeline visions, deepening Francisco\'s doubt about choices made and glory lost', 255),
      preliminarySceneFocus: 'Francisco sees alternate timelines through Trionfi cards while confronting brother\'s resentment and family expectations',
      preliminarySceneDescription: 'In his childhood study chamber, Francisco attempts reviewing Cicero\'s legal texts but stares at Trionfi cards spread before him—cards now showing flickering visions of alternate timelines where he made different choices during Dagon encounter. Younger brother Gherardo interrupts with thinly veiled resentment, diminished by Francisco\'s adventures, feeling left behind. Francisco wants validation that choices mattered and suffering had purpose; Gherardo wants recognition for staying dutiful while Francisco chased glory. La Signora observes from threshold, sensing vulnerability. Eight cups abandoned on shore while seeker walks away: Francisco\'s past achievements (cosmic battles, dimensional rescues) lie behind, unfulfilling because they didn\'t bring glory or validation craved. Alternate timeline visions deepen lost potential sense. Opposition intensifies through family expectations (father discussing prestigious law appointments), Gherardo\'s pointed comparisons, fragmentary memories of paths not taken—timelines where he gained greater glory at terrible costs. As echoes of conversations that never happened ripple, Francisco questions whether heroic journey was worth losing who he used to be. Self-doubt and temporal disorientation.',
      narrativeFunction: 'Introduces the Trionfi system as gateway to alternate timeline visions, establishing Book 2\'s central mechanic. This scene deepens Francisco\'s vulnerability by showing him paths not taken—where different choices might have brought the glory and validation he craves—while introducing La Signora as observer of his fragile state and Gherardo as voice of resentment.',
      sensoryDetail: 'The study chamber feels too small—childhood desk, Cicero\'s legal texts spread but unread, Trionfi cards glowing with otherworldly light showing flickering alternate visions. Gherardo\'s resentful posture in the doorway, pointed words cutting. Father\'s voice from downstairs discussing law appointments. La Signora\'s mysterious presence at the threshold—beautiful, enigmatic, knowing. Fragmentary memories of alternate timelines overlaying current reality like double-exposed images. Echoes of conversations that never happened creating auditory dissonance. Temporal disorientation manifesting as vertigo.',
      internalConflict: 'Francisco struggles with desperate need for validation that his choices and suffering mattered, questioning whether alternate timeline versions of himself made wiser decisions. He grapples with Gherardo\'s resentment—guilt that his adventures diminished his brother combined with anger that Gherardo can\'t understand the cost. The fragmentary memories of paths not taken create agonizing what-ifs: timelines where he gained glory but lost his soul, or chose safety but never discovered his potential. Fear that he chose wrong battles against hope that his path had meaning.',
      characterGrowthElement: 'Francisco discovers the Trionfi cards now function as windows to alternate timelines, revealing that his reality is one of many possible branches. He confronts the painful truth that his family expected glory and validation from his return, not just survival. The glimpses of alternate choices—paths where he gained fame but committed atrocities, or avoided danger but remained ordinary—force him to question whether his current hollowness stems from wrong choices or unrealistic expectations. La Signora\'s observing presence suggests guidance is available if he\'s willing to seek it.',
      seriesConnectionResonance: 'The Trionfi timeline visions establish the mechanism for Book 2\'s exploration of alternate realities and choice consequences. Francisco\'s vulnerability to these visions—his desperate need to validate past decisions—creates the opening for timeline manipulation that will drive the plot. La Signora\'s introduction as observer positions her as Book 2\'s guide figure. Gherardo\'s resentment establishes family dynamics that will complicate Francisco\'s journey.',
      sceneCardProgression: 79,
      realWorldContext: 'The Trionfi visions mirror real-world regret and what-if thinking—obsessively reviewing past decisions and imagining alternate outcomes. Gherardo\'s resentment reflects how family members can feel diminished by others\' achievements and adventures. The fragmentary memories of paths not taken mirror how trauma and major life transitions create persistent wondering about roads not traveled. The desperate need for validation reflects how we seek external confirmation that our suffering had meaning.',
      timelineSignificance: 'Establishes that the Trionfi cards now reveal alternate timeline branches, demonstrating that Francisco\'s reality has fragmented into multiple possible paths. This marks the beginning of timeline destabilization that will accelerate throughout Book 2, with Francisco\'s emotional vulnerability creating entry points for timeline manipulation and reality shifts.',
      saveTheCatBeat: 'Setup - Catalyst Introduction',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on Trionfi cards glowing with flickering alternate timeline visions, Gherardo\'s resentful interruption and pointed words, desperate need for validation, fragmentary memories of paths not taken overlaying reality, La Signora\'s mysterious observing presence, father\'s voice discussing law appointments, echoes of conversations never happened, temporal disorientation as vertigo. Show the weight of choices made and glory lost.',
        sudowrite_emotional_arc: 'Begins with hollow attempt at normalcy (reviewing legal texts), moves through mounting agitation as alternate timeline visions intensify and Gherardo\'s resentment cuts deep, reaches self-doubt and temporal disorientation as Francisco questions whether his heroic journey was worth the cost. The emotional journey is from forced focus through painful confrontation to fragmenting reality.',
        sudowrite_sensory_emphasis: 'Emphasize study chamber\'s smallness, unread Cicero texts, Trionfi cards\' otherworldly glow with flickering visions, Gherardo\'s resentful posture and cutting words, father\'s voice from downstairs, La Signora\'s enigmatic threshold presence, fragmentary memories as double-exposed images, conversation echoes never happened, vertigo from temporal disorientation.',
      },
      learning_objectives: {
        integration: 'Alternate Timeline Awareness and Choice Validation',
        terminal_objectives: [
          'Confront the reality of paths not taken and alternate timeline versions where different choices brought different outcomes—some better, some worse',
          'Recognize that desperate need for external validation makes you vulnerable to manipulation and regret, questioning whether suffering had purpose',
          'Begin understanding that abandoned successes and unmet expectations require reflection on whether goals aligned with values or merely pursued glory',
        ],
      },
      foreshadowing_elements: [
        'The Trionfi timeline visions foreshadow Book 2\'s central plot of timeline exploration and manipulation',
        'La Signora\'s observing presence foreshadows her role as guide in Scene 3 and beyond',
        'Gherardo\'s resentment foreshadows family conflicts that will complicate Francisco\'s journey',
      ],
    },
    {
      // Scene 3: Survival Is Not Success
      pages: 'Page 11 - 15',
      description: 'Late evening, Francisco walks Bologna\'s stone streets alone, passing the university where his classmates continue their ordinary ambitions unaware of cosmic threats. He encounters a former rival who congratulates him on \'surviving\' his mysterious absence, the word \'surviving\' cutting deeper than intended. Francisco wants to understand why triumph feels like failure and whether meaning exists beyond glory; the city wants nothing from him, indifferent to his cosmic achievements. La Signora appears beside him in physical form for the first time—beautiful, enigmatic, knowing—offering cryptic insights about the difference between surviving and thriving, between achievement and fulfillment. Opposition comes from Francisco\'s own psyche: the realization that he escaped Dagon\'s trap but lost something essential in the process, that he\'s a hero without purpose, a survivor without joy. As temporal echoes intensify (shadows of himself from alternate timelines walking the same streets), La Signora whispers that abandoned successes can become doorways to greater understanding if he\'s willing to reflect rather than regret.',
      focus: 'Francisco articulates his core wound—surviving without succeeding—and encounters La Signora as catalyst for transforming past losses into future lessons through reflection',
      chapterSceneFocus: truncate('Ch41S3: La Signora appears, teaching that abandoned successes become doorways to understanding through reflection not regret', 255),
      preliminarySceneFocus: 'Francisco encounters La Signora who offers cryptic wisdom about transforming survival into meaning through reflection',
      preliminarySceneDescription: 'Late evening, Francisco walks Bologna stone streets alone, passing university where classmates continue ordinary ambitions unaware of cosmic threats. Former rival congratulates him on \'surviving\' mysterious absence, the word cutting deeper than intended. Francisco wants to understand why triumph feels like failure and whether meaning exists beyond glory; the city wants nothing, indifferent to cosmic achievements. La Signora appears beside him in physical form first time—beautiful, enigmatic, knowing—offering cryptic insights about difference between surviving and thriving, achievement and fulfillment. The Eight of Cups figure turns away from stacked achievements to seek deeper meaning: Francisco recognizes surviving isn\'t succeeding, and past near-victories must be reframed through reflection rather than glory-seeking. La Signora becomes guide toward reframing. Opposition from Francisco\'s psyche: escaped Dagon\'s trap but lost something essential, hero without purpose, survivor without joy. As temporal echoes intensify (shadows of himself from alternate timelines walking same streets), La Signora whispers abandoned successes can become doorways to greater understanding if willing to reflect rather than regret. Desperate yearning for purpose beyond mere survival.',
      narrativeFunction: 'Establishes Francisco\'s core Book 2 wound: surviving without succeeding, hero without purpose. La Signora\'s physical appearance introduces her as Book 2\'s guide figure offering the critical teaching that abandoned successes require reflection rather than regret to transform past losses into future lessons. This scene sets up the journey from glory-seeking to meaning-seeking.',
      sensoryDetail: 'Bologna\'s stone streets feel cold and empty under evening darkness. University windows glow with warmth Francisco can\'t access. Former rival\'s congratulations on \'surviving\' echoes painfully. La Signora manifests beside him—stunning beauty, enigmatic smile, knowing eyes that see through his soul. Her voice carries cryptic wisdom. Temporal echoes intensify—shadows of alternate Francisco versions walking same streets creating multiple overlapping silhouettes. The city\'s indifference to his cosmic achievements manifests as ordinary life continuing oblivious. Desperate yearning creates hollow ache.',
      internalConflict: 'Francisco struggles with articulating why triumph feels like failure—questioning whether the problem is his achievements (survived but didn\'t gain glory) or his expectations (seeking validation from wrong sources). He grapples with La Signora\'s cryptic teaching that reflection differs from regret, uncertain whether he can transform past losses into understanding or if he\'ll remain trapped in what-ifs. The realization that he\'s a hero without purpose, survivor without joy, creates existential crisis about whether heroic journeys inevitably lead to emptiness or if he missed some crucial lesson.',
      characterGrowthElement: 'Francisco achieves the critical articulation that survival doesn\'t equal success—naming his core wound allows him to begin addressing it. La Signora\'s appearance and teaching offer the first glimmer that his abandoned successes and unmet expectations might transform into wisdom if he shifts from glory-seeking to meaning-seeking, from regret to reflection. He\'s learning that past near-victories require reframing through different lens: not what glory was lost, but what understanding can be gained.',
      seriesConnectionResonance: 'This scene establishes the foundation for Francisco\'s Book 2 arc: transforming from glory-seeking hero to meaning-seeking guide. La Signora\'s teaching that abandoned successes become doorways to understanding through reflection creates the framework for how he\'ll process the timeline exploration ahead. The intensifying temporal echoes signal that timeline instability will soon force him to confront alternate choices directly rather than just glimpsing them.',
      sceneCardProgression: 80,
      realWorldContext: 'The encounter with the rival who says \'surviving\' mirrors how real-world achievements sometimes feel hollow when others don\'t recognize the struggle or when outcomes don\'t match expectations. La Signora\'s teaching about reflection versus regret applies to processing any experience where survival or achievement didn\'t bring expected fulfillment. The hero without purpose mirrors post-achievement depression and identity crises when defining goals are completed but meaning remains elusive.',
      timelineSignificance: 'Establishes that timeline echoes have intensified to visible manifestations (multiple Francisco shadows walking streets), demonstrating that reality\'s fragmentation is accelerating. This marks the threshold where Francisco must choose between drowning in regret about paths not taken or learning to reflect on abandoned successes. La Signora\'s appearance suggests that guidance is available for navigating timeline instability if he\'s willing to shift perspective.',
      saveTheCatBeat: 'Setup - Theme Stated',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on cold empty stone streets, university\'s warm glow he can\'t access, rival\'s painful \'surviving\' congratulations, La Signora manifesting beside him with stunning beauty and knowing eyes, her cryptic wisdom about surviving versus thriving, temporal echoes intensifying as multiple shadow versions walking same streets, city\'s indifference to cosmic achievements, the desperate yearning and hollow ache. Show the shift from regret to reflection possibility.',
        sudowrite_emotional_arc: 'Begins with lonely isolated walking through indifferent city, moves through painful encounter cutting to core wound, reaches desperate yearning mixed with first glimmer of hope as La Signora offers teaching about reflection transforming past losses. The emotional journey is from hollow isolation through articulated pain to tentative possibility of meaning beyond glory.',
        sudowrite_sensory_emphasis: 'Emphasize stone streets\' cold emptiness under evening darkness, university windows\' warm glow, rival\'s echoing \'surviving\' congratulations, La Signora\'s stunning manifestation with enigmatic smile and knowing eyes, temporal echoes as multiple overlapping shadow silhouettes, city\'s oblivious ordinary life continuing, desperate yearning as hollow ache.',
      },
      learning_objectives: {
        integration: 'Core Wound Articulation and Reflection Over Regret',
        terminal_objectives: [
          'Articulate the core wound that surviving doesn\'t equal succeeding—that achieving goals without fulfillment or being a hero without purpose creates existential emptiness',
          'Learn that abandoned successes and past losses can become doorways to greater understanding if approached through reflection rather than regret',
          'Begin shifting from glory-seeking to meaning-seeking, recognizing that external validation and triumph may not provide the fulfillment or purpose you seek',
        ],
      },
      foreshadowing_elements: [
        'La Signora\'s cryptic teaching foreshadows her ongoing role as Book 2 guide',
        'Temporal echoes intensifying to visible shadows foreshadows imminent timeline fracturing',
        'The teaching about reflection over regret foreshadows the choice Francisco must make when confronting alternate timelines directly',
      ],
    },
    {
      // Scene 4: The First Timeline Echo
      pages: 'Page 16 - 20',
      description: 'That night, Francisco dreams—or experiences—an alternate timeline where he accepted Dagon\'s offer and gained immense power but lost his humanity. He awakens gasping in his childhood bed, but the vision lingers with terrifying clarity: not a dream but a memory of a choice he didn\'t make yet somehow still made in another branch of reality. Francisco wants to dismiss it as nightmare; reality wants to stay stable. But temporal mechanics fracture further: he sees two reflections in his mirror, hears his mother\'s voice speaking words she never said, and finds Trionfi cards rearranged though he never touched them. La Signora\'s presence (now interwoven with his awareness) suggests these aren\'t hallucinations but glimpses of the timeline manipulation that Dagon\'s trap truly represented—not a single escape but a branching of possibilities that Francisco must now navigate. As he holds a card showing The Hermit seeking wisdom in solitude, Francisco understands: his abandoned success in Book 1 was never about glory but about learning to reflect on choices across multiple timelines.',
      focus: 'Francisco experiences his first concrete alternate timeline memory, confirming temporal instability and establishing that Book 2 will explore paths not taken',
      chapterSceneFocus: truncate('Ch41S4: First alternate timeline memory confirms temporal fracturing, transforming abandoned success into wisdom through reflection', 255),
      preliminarySceneFocus: 'Francisco experiences alternate timeline where he accepted Dagon\'s offer, awakening to timeline fracturing reality',
      preliminarySceneDescription: 'That night, Francisco dreams—or experiences—an alternate timeline where he accepted Dagon\'s offer and gained immense power but lost his humanity. He awakens gasping in childhood bed, but the vision lingers with terrifying clarity: not a dream but a memory of a choice he didn\'t make yet somehow still made in another branch of reality. Francisco wants to dismiss it as nightmare; reality wants to stay stable. Eight of Cups complete: Francisco has fully turned away from seeking glory in past achievements and begun the reflective journey toward deeper understanding. Timeline echoes represent emotional complexity of examining unfulfilled wins and recalibrating goals with renewed purpose. Temporal mechanics fracture further: he sees two reflections in mirror, hears mother\'s voice speaking words she never said, finds Trionfi cards rearranged though he never touched them. La Signora\'s presence (now interwoven with awareness) suggests these aren\'t hallucinations but glimpses of timeline manipulation that Dagon\'s trap truly represented—not single escape but branching of possibilities Francisco must now navigate. As he holds The Hermit card seeking wisdom in solitude, Francisco understands: his abandoned success in Book 1 was never about glory but about learning to reflect on choices across multiple timelines. Fearful acceptance of larger, stranger reality.',
      narrativeFunction: 'Establishes the concrete manifestation of timeline fracturing through Francisco\'s first alternate timeline memory—experiencing a choice he didn\'t make in this reality. This scene confirms that Book 2 will explore paths not taken and demonstrates how reflecting on abandoned success (the glory he didn\'t achieve) transforms into wisdom about navigating multiple timeline possibilities.',
      sensoryDetail: 'The dream-memory feels viscerally real—Dagon\'s offer accepted, immense power coursing through veins, humanity draining away. Awakening gasps in childhood bed, vision lingering with terrifying clarity. Mirror shows two reflections—current Francisco and alternate-choice Francisco overlapping. Mother\'s voice speaks words she never said in this timeline. Trionfi cards rearranged on desk despite being untouched. La Signora\'s presence woven through awareness like perfume. The Hermit card feels warm in hand. Reality fracturing manifests as sensory dissonance and temporal overlap.',
      internalConflict: 'Francisco struggles with distinguishing between dream and alternate timeline memory, questioning whether he\'s losing his mind or genuinely experiencing branches of reality. He grapples with the terrifying vision of himself having accepted Dagon\'s offer—that version gained power but lost humanity, forcing him to confront whether his current path\'s abandonment of glory was actually wisdom. The fear that reality is fracturing battles against La Signora\'s suggestion that these glimpses serve purpose—teaching him to navigate timeline possibilities rather than drowning in regret.',
      characterGrowthElement: 'Francisco achieves the critical understanding that his abandoned success in Book 1 (escaping Dagon without glory) wasn\'t failure but the beginning of learning to reflect on choices across multiple timelines. The alternate timeline memory—where he chose differently and gained power but lost humanity—demonstrates that the path not taken might have been worse. He\'s beginning to transform regret about unfulfilled wins into wisdom about recalibrating goals with renewed purpose, accepting that navigating timeline possibilities requires reflection rather than glory-seeking.',
      seriesConnectionResonance: 'The first concrete alternate timeline memory establishes the mechanism for Book 2\'s plot: Francisco will experience and navigate multiple timeline branches, each showing different choices and outcomes. La Signora\'s presence interwoven with his awareness positions her as guide for this journey. The Hermit card symbolism foreshadows Francisco\'s need for solitary wisdom-seeking as he processes timeline manipulation. This scene creates the foundation for exploring how past near-victories transform into resilience through reflection.',
      sceneCardProgression: 81,
      realWorldContext: 'The alternate timeline memory mirrors real-world experiences of vivid what-if scenarios and obsessive reviewing of different choices—the persistent wondering about roads not traveled. The inability to distinguish between dream and memory reflects how powerful regrets can feel like lived experiences. The vision of gaining power but losing humanity applies to any scenario where choosing success over values creates hollowness. The acceptance of larger, stranger reality mirrors how major life transitions expand understanding of what\'s possible.',
      timelineSignificance: 'Establishes that timeline fracturing has progressed from echoes and shadows to concrete alternate timeline memories that Francisco experiences as real. This night marks the threshold where Prime Timeline actively fragments into awareness of alternate branches, forcing Francisco to confront that Dagon\'s trap created not just escape but infinite branching possibilities he must now navigate.',
      saveTheCatBeat: 'Setup - Catalyst Confirmed',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the visceral dream-memory of accepting Dagon\'s offer with power coursing and humanity draining, gasping awake with vision lingering, seeing two reflections in mirror overlapping, mother\'s voice speaking words never said, Trionfi cards mysteriously rearranged, La Signora\'s presence woven through awareness, The Hermit card warm in hand, the fearful acceptance of timeline fracturing. Show the shift from nightmare dismissal to understanding abandoned success as wisdom.',
        sudowrite_emotional_arc: 'Begins with terrifying dream-memory of alternate choice, moves through disoriented awakening as reality fractures with double reflections and temporal anomalies, reaches fearful acceptance and dawning understanding that abandoned success teaches timeline navigation wisdom. The emotional journey is from nightmare terror through reality-questioning disorientation to fearful but purposeful acceptance.',
        sudowrite_sensory_emphasis: 'Emphasize dream-memory\'s visceral reality (power coursing, humanity draining), gasping awakening, mirror\'s two overlapping reflections, mother\'s voice speaking unspoken words, Trionfi cards mysteriously rearranged, La Signora\'s presence as woven perfume, The Hermit card\'s warmth, reality fracturing as sensory dissonance and temporal overlap.',
      },
      learning_objectives: {
        integration: 'Alternate Timeline Awareness and Wisdom Through Reflection',
        terminal_objectives: [
          'Experience and accept that alternate timeline branches exist where different choices led to different outcomes—some gaining power but losing humanity',
          'Transform abandoned success and unfulfilled wins into wisdom by reflecting on paths not taken rather than drowning in regret about glory lost',
          'Understand that navigating timeline possibilities requires accepting larger, stranger reality and learning to reflect on choices across multiple branches with renewed purpose',
        ],
      },
      foreshadowing_elements: [
        'The alternate timeline memory where Francisco accepted Dagon\'s offer foreshadows deeper exploration of that choice in Book 2',
        'La Signora\'s presence interwoven with awareness foreshadows her role as guide through timeline navigation',
        'The Hermit card symbolism foreshadows Francisco\'s solitary wisdom-seeking journey ahead',
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

  console.log('\n🎉 EA-041 complete import finished!');
  console.log('📖 BOOK 2 CHAPTER 1 - Abandoned Success Complete!\n');
  console.log('🔮 Timeline Exploration Begins!\n');
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
