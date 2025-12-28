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

interface EA033Data {
  id: string;
  title: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  summary?: string;
  character_arcs?: string;
  story_gaps_addressed?: string;
  location_details?: string;
  series_connections?: string;
  scenes: SceneData[];
}

function findEA033Data(): EA033Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA033Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-033') return obj as EA033Data;

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
  console.log('🔍 Searching for EA-033 in outline...\n');

  const ea033Data = findEA033Data();

  if (!ea033Data) {
    console.error('❌ EA-033 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-033: ${ea033Data.title}`);
  console.log(`   Scenes: ${ea033Data.scenes?.length || 0}\n`);
  console.log(`⚠️  NOTE: EA-033 appears to have same content as EA-032 - possible outline data duplication\n`);

  // Find the chapter - it should be chapter 33 in the same book as EA-023
  const ea023 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ea023.length === 0) {
    console.error('❌ EA-023 not found - cannot determine book ID');
    process.exit(1);
  }

  const bookId = ea023[0].bookId;

  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-033'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-033 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 33 in the same book
    const ch33 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 33))
      .limit(10);

    const correctChapter = ch33.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 33 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 33: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-033',
        title: ea033Data.title,
        epicNovelPages: truncate(ea033Data.epic_novel_pages, 50),
        epicChapterFocus: ea033Data.epic_chapter_focus,
        epicNovelChapterFocus: ea033Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea033Data.tarot_family, 100),
        tarotCardItem: truncate(ea033Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea033Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea033Data.save_the_cat_beat, 255),
        summary: ea033Data.summary,
        characterArcs: ea033Data.character_arcs,
        storyGapsAddressed: ea033Data.story_gaps_addressed,
        locationDetails: ea033Data.location_details,
        seriesConnections: ea033Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-033 data\n');
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

  for (const sceneData of ea033Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-033',
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
      // Scene 1: The Passionate Colleague (Seven of Wands context)
      pages: 'Page 481 - 485',
      description: 'Francisco and Zara encounter Agent Theron, a brilliant cosmic agent whose admirable dedication has descended into destructive obsession. His presentation reveals compelling insights about dimensional threats but alarming methods—preemptive unilateral interventions, bypassing protocols, isolated decision-making, and exhausted unsustainable intensity. Theron insists he alone comprehends cosmic dangers, revealing the warning signs that distinguish constructive passion serving cosmic good from destructive obsession serving ego. (Seven of Wands: defending passionate vision but isolated from support)',
      focus: 'Francisco and Zara recognize warning signs of passion becoming destructive obsession as they encounter Agent Theron, whose isolated intensity and unilateral certainty demonstrate how dedication can transform into harm',
      chapterSceneFocus: 'Ch33S1: Learning to distinguish between constructive passion that serves the greater good and dangerous obsession that harms others through isolation and defensive certainty',
      preliminarySceneFocus: 'Francisco and Zara meet Agent Theron, recognizing troubling patterns in his passionate but isolated defensive approach',
      preliminarySceneDescription: 'At dawn in Training Arena Sigma-9, Francisco and Zara encounter Agent Theron defending his vision of cosmic service against all opposition. Theron presents compelling evidence of dimensional threats and proposed interventions, but his methods reveal destructive patterns: preemptive restructuring without consent, aggressive manipulation prioritizing short-term stability, unilateral decision-making excluding collaboration, and conviction that his assessment justifies any action. His exhausted intensity, shaking hands, and defensive stance reveal how admirable passion has transformed into consuming obsession. The Seven of Wands pattern emerges as Theron stands alone defending his vision, isolated from collaborative support.',
      narrativeFunction: 'Introduces Agent Theron as a cautionary example of passionate vision defended in isolation becoming obsession, establishing the warning signs that Francisco and Zara must learn to recognize and address. This scene sets up the conflict resolution challenge and demonstrates how defensive certainty without collaborative support becomes destructive.',
      sensoryDetail: 'Training Arena Sigma-9 crackles with charged emotional atmosphere. Theron stands alone defending his vision, dimensional projections shimmering with impressive but alarming detail. His eyes carry exhausted intensity, hands shake as he gestures defensively. His voice holds the edge of someone who\'s lost perspective while defending against all opposition. The isolation is palpable.',
      internalConflict: 'Francisco struggles with recognizing the Seven of Wands pattern—passionate vision defended alone without support transforms into dangerous isolation. Zara grapples with understanding how defending a vision can isolate someone from the very collaboration that would strengthen it. Both must learn the difference between healthy defense of values and destructive defensive isolation.',
      characterGrowthElement: 'Francisco develops wisdom to recognize when passionate defense of vision becomes destructive isolation by seeing warning signs: standing alone against all feedback, defensive rejection of collaboration, exhausted unsustainability from fighting without support. Zara begins understanding that even good visions become dangerous when defended in isolation from collaborative wisdom.',
      seriesConnectionResonance: 'Francisco\'s understanding of the Seven of Wands pattern—passionate vision defended alone becoming obsession—helps him recognize when resistance forces risk isolating themselves through defensive certainty. His learning that even righteous causes require collaborative support becomes crucial during the timeline war.',
      sceneCardProgression: 54,
      realWorldContext: 'The Arena mirrors situations where passionate individuals defend their vision against all opposition, becoming isolated through defensive certainty. Theron\'s pattern reflects how standing alone for principles, without accepting collaborative support and feedback, transforms healthy conviction into destructive obsession. The Seven of Wands warning applies to recognizing when defense becomes isolation.',
      timelineSignificance: 'Establishes that February 27, 1320 becomes the day Francisco and Zara learn to recognize the Seven of Wands pattern of passionate vision defended in isolation, developing understanding that will help them maintain collaborative resistance rather than isolated defensive certainty during the timeline war.',
      saveTheCatBeat: 'All Is Lost - Defensive Isolation',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on recognizing the Seven of Wands pattern—Theron defending his passionate vision alone, isolated from collaborative support, his defensiveness against all feedback transforming dedication into obsession. Show Francisco understanding defensive certainty as warning sign.',
        sudowrite_emotional_arc: 'Begins with expectation of routine practice, moves through recognition of Theron\'s defensive isolation, culminates in concerned awareness of passionate vision without collaborative support becoming destructive. The emotional journey is from normalcy to cautionary understanding.',
        sudowrite_sensory_emphasis: 'Emphasize Theron standing alone in defensive posture, the charged atmosphere of someone fighting all opposition, exhausted intensity in eyes and defensive gestures, the palpable isolation of passionate vision without support.',
      },
      learning_objectives: {
        integration: 'Seven of Wands Wisdom and Defensive Isolation Recognition',
        terminal_objectives: [
          'Recognize the Seven of Wands pattern where passionate vision defended in isolation transforms into destructive obsession',
          'Understand that even righteous causes become dangerous when defended alone without accepting collaborative support and feedback',
          'Distinguish between healthy defense of values and destructive defensive isolation that rejects all input as opposition',
        ],
      },
      foreshadowing_elements: [
        'Theron\'s defensive isolation foreshadows the intervention needed to reconnect passionate vision with collaborative support',
        'The Seven of Wands pattern foreshadows Francisco learning to maintain passionate resistance while accepting collaboration',
        'The warning about defending alone foreshadows the importance of unified resistance during the timeline war',
      ],
    },
    {
      // Scene 2: The Five Escalating Conflicts
      pages: 'Page 486 - 490',
      description: 'Theron\'s defensive obsessive methods create escalating conflicts demonstrating how passionate vision defended in isolation multiplies problems. Each conflict deepens his isolation while reinforcing his defensive conviction: bypassing protocols, colleagues questioning his judgment, dimensional entities feeling violated, Francisco and Zara\'s parallel learning rejected, and internal warnings buried. The tragic pattern shows passionate defense transforming from protecting values into fighting everyone.',
      focus: 'Francisco and Zara witness how Theron\'s defensive obsession creates escalating conflicts, each deepening his isolation while reinforcing conviction that he must fight alone against all opposition',
      chapterSceneFocus: 'Ch33S2: Understanding how defensive passion fought alone multiplies problems by creating opposition, isolating from allies, and transforming value defense into destructive fighting',
      preliminarySceneFocus: 'Escalating conflicts demonstrate how Theron\'s defensive isolation transforms passionate vision into destructive fighting against everyone',
      preliminarySceneDescription: 'Morning descends into crisis as Theron\'s defensive methods create escalating conflicts. His defensive certainty makes him bypass protocols (fighting Academy oversight), dismiss colleague feedback (fighting potential allies), rationalize violated stakeholders (fighting those he claims to protect), reject Francisco and Zara\'s learning (fighting wisdom), and bury internal warnings (fighting his own better judgment). Each conflict deepens isolation while reinforcing his conviction that universal opposition proves he alone understands—a tragic Seven of Wands distortion where defending vision becomes fighting everyone, where standing firm becomes standing alone, where passionate values become weapons wounding all.',
      narrativeFunction: 'Demonstrates through concrete escalating conflicts how defensive passion fought in isolation multiplies opposition rather than defending values. This scene shows the Seven of Wands pattern distorted into destructive fighting, establishing that passionate vision requires collaborative support not defensive isolation.',
      sensoryDetail: 'Morning\'s escalation vibrates with mounting defensive tension. Theron\'s posture becomes increasingly combative, fighting against each source of feedback. His defensive reactions intensify with each conflict—protocol becomes enemy, colleagues become opposition, stakeholders become ignorant, parallel learning becomes threat, self-awareness becomes buried. The isolation intensifies as fighting becomes his only response.',
      internalConflict: 'Francisco struggles with watching defensive passion create the very opposition Theron fears, seeing how fighting alone transforms values defense into destruction. Zara grapples with understanding how each defensive fight reinforces Theron\'s isolation. Both must recognize that passionate vision defended without collaboration creates self-fulfilling isolation.',
      characterGrowthElement: 'Francisco develops understanding of how the Seven of Wands pattern distorted creates self-fulfilling defensive isolation where fighting creates opposition that reinforces the need to fight. Zara learns that passionate values defended alone transform defense into destructive fighting. Both grow in seeing how vision requires collaborative support not defensive combat.',
      seriesConnectionResonance: 'Francisco\'s experience witnessing defensive passion creating opposition helps him ensure resistance forces don\'t isolate themselves through fighting everyone. His understanding that passionate causes defended alone become destructive becomes crucial for maintaining collaborative resistance without defensive isolation.',
      sceneCardProgression: 55,
      realWorldContext: 'The conflicts mirror patterns where passionate defenders\' combativeness creates opposition they interpret as validation for fighting harder, creating self-reinforcing isolation. The pattern reflects how standing alone for principles without accepting support transforms value defense into destructive fighting against everyone. Applies to recognizing when defense becomes combat.',
      timelineSignificance: 'Establishes how defensive passion fought in isolation creates escalating opposition through self-reinforcing combat patterns. This morning demonstrates the Seven of Wands distortion where defending vision alone transforms into fighting everyone, becoming a cautionary example.',
      saveTheCatBeat: 'All Is Lost - Fighting Alone',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Zara\'s POV: Focus on watching each defensive fight deepen isolation while Theron\'s conviction to fight alone grows stronger, the tragic recognition of passionate vision defended becoming destructive combat, seeing the Seven of Wands distortion multiply opposition.',
        sudowrite_emotional_arc: 'Begins with concern about defensive patterns, moves through alarm as fighting intensifies, culminates in tragic recognition of passionate defense creating the opposition it fears. The emotional journey is from worry to devastated understanding of self-fulfilling combat.',
        sudowrite_sensory_emphasis: 'Emphasize mounting defensive tension, Theron\'s increasingly combative posture fighting each source of feedback, the visible transformation from defending values to fighting everyone, the intensifying isolation.',
      },
      learning_objectives: {
        integration: 'Defensive Isolation and Self-Fulfilling Combat',
        terminal_objectives: [
          'Recognize how the Seven of Wands pattern distorted creates self-fulfilling defensive isolation through fighting creating opposition',
          'Understand that passionate vision defended alone transforms value defense into destructive combat against everyone including allies',
          'Identify how fighting without accepting collaborative support reinforces conviction that standing alone is necessary',
        ],
      },
      foreshadowing_elements: [
        'The defensive fighting creating opposition foreshadows the intervention needed to reconnect passion with collaboration',
        'Theron\'s rejection of support foreshadows the breakthrough when he accepts he can\'t fight alone successfully',
        'The self-fulfilling combat pattern foreshadows Francisco ensuring resistance maintains collaborative support',
      ],
    },
    {
      // Scene 3: Channeling the Storm
      pages: 'Page 491 - 495',
      description: 'At the Mediation Center, Francisco and Zara develop intervention strategy that transforms Theron\'s defensive isolation into collaborative passionate service. Drawing on their learning, they create structured approach: integrating his insights into the six-station network (collaborative support), requiring review (strengthening not opposing), mandating rest (sustainable passion), assigning partnership (ending isolation), conditioning on emotional regulation. Through patient mediation, Theron\'s buried self-awareness surfaces: defending alone created the opposition he feared. Passionate vision reconnects with collaborative support.',
      focus: 'Francisco and Zara execute intervention that transforms Theron\'s defensive isolated passion into collaborative passionate service by providing the support his vision always needed',
      chapterSceneFocus: 'Ch33S3: Demonstrating that passionate vision serves best when supported collaboratively, not defended alone—transforming defensive isolation into collaborative passionate service',
      preliminarySceneFocus: 'Francisco and Zara transform Theron\'s defensive isolation into collaborative passion through structured supportive intervention',
      preliminarySceneDescription: 'At the Mediation Center, Francisco and Zara design intervention providing the collaborative support Theron\'s passionate vision always needed but he defensively rejected. They integrate his insights into the network (support not opposition), require collaborative review (strengthening not fighting), mandate rest (sustainability), assign partnership (ending isolation), condition participation on accepting support. Through patient mediation, Theron cycles through defensive resistance until buried self-awareness surfaces: fighting alone created the very opposition he feared, defending isolated prevented the collaborative support that would have strengthened his vision. Passionate vision transforms from defended alone to supported collaboratively—the Seven of Wands pattern healing as he accepts support.',
      narrativeFunction: 'Completes the Seven of Wands wisdom arc by showing successful intervention that transforms defensive isolated passion into collaborative passionate service. Demonstrates that passionate vision serves best when accepting collaborative support rather than defending alone, establishing that values defended need support not isolation.',
      sensoryDetail: 'The Mediation Center emanates supportive collaborative atmosphere. Six hours unfold with patient offering of support Theron defensively resisted. His defensive posture gradually softens as he recognizes support isn\'t opposition. The turning point arrives when he accepts he can\'t fight alone successfully. The transformation from defensive combat to collaborative support becomes palpable as isolation heals through accepting partnership.',
      internalConflict: 'Francisco struggles with helping Theron see that offering support isn\'t opposition to his vision. Zara grapples with patience as defensive rejection of help cycles before acceptance. Both must trust that persistent offering of collaborative support will transform defensive isolation.',
      characterGrowthElement: 'Francisco completes Seven of Wands wisdom by learning passionate vision serves best with collaborative support not defensive isolation, that offering partnership strengthens rather than opposes values. Zara masters helping defensive passion accept support without fighting. Both achieve understanding that authentic passionate service requires collaboration not combat.',
      seriesConnectionResonance: 'Francisco\'s methods for transforming defensive isolation into collaborative passion become essential for maintaining unified resistance that accepts diverse support rather than fighting alone. His understanding that passionate causes need collaborative support shapes resistance culture of unity not isolation.',
      sceneCardProgression: 56,
      realWorldContext: 'The intervention mirrors practices for helping passionate defenders recognize that accepting support strengthens rather than opposes their vision. The structured approach of offering collaboration rather than fighting reflects that passionate values serve best with support not isolation. The transformation reflects healing the Seven of Wands pattern through accepting partnership.',
      timelineSignificance: 'Establishes that this afternoon marks transformation of defensive isolated passion into collaborative passionate service through accepting support. The approach of offering partnership to passionate vision becomes the model for unified resistance accepting diverse collaborative support rather than defensive isolation.',
      saveTheCatBeat: 'Dark Night of the Soul - Accepting Collaborative Support',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco and Zara alternating: Focus on patient offering of support to defensive passion, the satisfaction of seeing Theron recognize that collaboration strengthens rather than opposes vision, watching defensive isolation heal through accepting partnership. Show them learning passionate service needs support.',
        sudowrite_emotional_arc: 'Begins with determined supportive intervention, moves through patience as defensive rejection cycles, culminates in profound satisfaction as Theron accepts collaborative support and defensive isolation heals. The emotional journey is from offering support to watching partnership transform combat.',
        sudowrite_sensory_emphasis: 'Emphasize the supportive atmosphere of the Mediation Center, six-hour patient offering of collaboration, Theron\'s gradual softening from defensive fighting to accepting support, the palpable transformation from isolation to partnership.',
      },
      learning_objectives: {
        integration: 'Seven of Wands Healing and Collaborative Passionate Service',
        terminal_objectives: [
          'Transform defensive isolated passion into collaborative passionate service by offering partnership that strengthens rather than opposes vision',
          'Help passionate defenders recognize that accepting collaborative support serves values better than fighting alone',
          'Demonstrate that authentic passionate service requires partnership and support not defensive isolation and combat',
        ],
      },
      foreshadowing_elements: [
        'The transformation template foreshadows how Francisco will help resistance forces accept collaborative support rather than fight alone',
        'The methods for offering partnership to passionate vision foreshadow resistance culture of collaborative unity',
        'The healing of defensive isolation foreshadows maintaining unified resistance through accepting diverse support',
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
        focus: enhancement.focus,
        chapterSceneFocus: truncate(enhancement.chapterSceneFocus, 255),
        preliminarySceneFocus: enhancement.preliminarySceneFocus,
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

  console.log('\n🎉 EA-033 complete import finished!');
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
