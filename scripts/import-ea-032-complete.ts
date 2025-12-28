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

interface EA032Data {
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

function findEA032Data(): EA032Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA032Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-032') return obj as EA032Data;

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
  console.log('🔍 Searching for EA-032 in outline...\n');

  const ea032Data = findEA032Data();

  if (!ea032Data) {
    console.error('❌ EA-032 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-032: ${ea032Data.title}`);
  console.log(`   Scenes: ${ea032Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 32 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-032'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-032 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 32 in the same book
    const ch32 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 32))
      .limit(10);

    const correctChapter = ch32.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 32 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 32: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-032',
        title: ea032Data.title,
        epicNovelPages: truncate(ea032Data.epic_novel_pages, 50),
        epicChapterFocus: ea032Data.epic_chapter_focus,
        epicNovelChapterFocus: ea032Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea032Data.tarot_family, 100),
        tarotCardItem: truncate(ea032Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea032Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea032Data.save_the_cat_beat, 255),
        summary: ea032Data.summary,
        characterArcs: ea032Data.character_arcs,
        storyGapsAddressed: ea032Data.story_gaps_addressed,
        locationDetails: ea032Data.location_details,
        seriesConnections: ea032Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-032 data\n');
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

  for (const sceneData of ea032Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-032',
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
      // Scene 1: The Passionate Colleague
      pages: 'Page 466 - 470',
      description: 'Francisco and Zara encounter Agent Theron, a brilliant cosmic agent whose admirable dedication has descended into destructive obsession. His presentation reveals compelling insights about dimensional threats but alarming methods—preemptive unilateral interventions, bypassing protocols, isolated decision-making, and exhausted unsustainable intensity. Theron insists he alone comprehends cosmic dangers, revealing the warning signs that distinguish constructive passion serving cosmic good from destructive obsession serving ego.',
      focus: 'Francisco and Zara recognize warning signs of passion becoming destructive obsession as they encounter Agent Theron, whose isolated intensity and unilateral certainty demonstrate how dedication can transform into harm',
      chapterSceneFocus: 'Ch32S1: Learning to distinguish between constructive passion that serves the greater good and dangerous obsession that harms others through isolation and control',
      preliminarySceneFocus: 'Francisco and Zara meet Agent Theron, recognizing troubling patterns in his passionate but isolated approach to cosmic service',
      preliminarySceneDescription: 'At dawn in Training Arena Sigma-9, Francisco and Zara encounter Agent Theron, a brilliant cosmic agent known for impressive solo rescues whose intensity has grown troubling. Theron presents compelling evidence of dimensional threats and proposed interventions, but his methods reveal destructive patterns: preemptive restructuring without consent, aggressive manipulation prioritizing short-term stability, unilateral decision-making excluding collaboration, and conviction that his assessment justifies any action. His exhausted intensity, shaking hands, and statement that "I alone understood the danger" reveal how admirable passion has transformed into consuming obsession. The Five of Swords pattern emerges as Theron\'s commitment scatters into conflicts with protocols, collaboration, empathy, and self-awareness.',
      narrativeFunction: 'Introduces Agent Theron as a cautionary example of passion becoming obsession, establishing the warning signs that Francisco and Zara must learn to recognize and address. This scene sets up the conflict resolution challenge and demonstrates the fine line between healthy dedication and destructive fanaticism.',
      sensoryDetail: 'Training Arena Sigma-9 crackles with charged emotional atmosphere. Theron\'s dimensional projections shimmer with impressive but alarming detail. His eyes carry exhausted intensity, hands shake as he gestures. His voice holds the edge of someone who\'s lost perspective. The contrast between his brilliant insights and troubling isolation creates palpable tension.',
      internalConflict: 'Francisco struggles with recognizing parallels to their own overconfidence at Korthak-7 while seeing how Theron\'s prevented disaster validated rather than corrected his patterns. Zara grapples with the challenge of confronting destructive behavior without destroying the person. Both must distinguish between passion that uplifts and obsession that controls.',
      characterGrowthElement: 'Francisco develops wisdom to distinguish constructive passion from dangerous obsession by recognizing warning signs: isolation, unilateral certainty, bypassing accountability, exhausted unsustainability. Zara begins developing conflict resolution skills by understanding that intervention requires confronting harm while preserving the person. Both learn that authentic leadership includes difficult conversations with colleagues whose intensity has become counterproductive.',
      seriesConnectionResonance: 'Francisco\'s ability to recognize when passion becomes obsession helps him identify corrupted allies throughout the series. His understanding of warning signs becomes crucial for maintaining focus during emotional peaks of the timeline war and for preventing resistance forces from descending into the very fanaticism they oppose.',
      sceneCardProgression: 51,
      realWorldContext: 'The Arena mirrors real-world professional environments where passionate colleagues\' intensity crosses into destructive territory. Theron\'s pattern reflects how brilliant isolated individuals can lose perspective, how prevented disasters can validate problematic approaches, and how dedication without collaboration becomes dangerous. The warning signs apply to recognizing burnout and obsession in any field.',
      timelineSignificance: 'Establishes that February 27, 1320 becomes the day Francisco and Zara begin learning to recognize and address destructive passion patterns, developing skills that will become essential for maintaining healthy intensity in cosmic service and resistance movements throughout the timeline war.',
      saveTheCatBeat: 'All Is Lost - Recognition of Destructive Passion',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the unsettling recognition of seeing passion transform into obsession, the parallel to their own overconfidence, the concern for a colleague losing his way. Show him understanding the warning signs while feeling uncertain how to help.',
        sudowrite_emotional_arc: 'Begins with expectation of routine practice, moves through growing alarm at Theron\'s patterns, culminates in concerned recognition of destructive trajectory. The emotional journey is from normalcy to cautionary awareness.',
        sudowrite_sensory_emphasis: 'Emphasize the charged atmosphere of passionate debate, Theron\'s exhausted intensity in eyes and shaking hands, the shimmer of impressive but alarming projections, the edge in his voice revealing lost perspective.',
      },
      learning_objectives: {
        integration: 'Passion Wisdom and Obsession Recognition',
        terminal_objectives: [
          'Distinguish between constructive passion serving cosmic good and destructive obsession serving ego through recognizing warning signs',
          'Identify patterns of isolation, unilateral certainty, bypassing accountability, and exhausted intensity that indicate passion becoming harmful',
          'Understand that prevented disasters without collaborative learning can validate problematic approaches rather than correct them',
        ],
      },
      foreshadowing_elements: [
        'Theron\'s Five of Swords pattern foreshadows the five escalating conflicts that will demonstrate how obsession multiplies problems',
        'The parallel to Korthak-7 foreshadows Francisco and Zara using their catastrophic learning to help Theron find wisdom',
        'The warning signs foreshadow the intervention strategy they\'ll develop in Scene 3 for channeling passion constructively',
      ],
    },
    {
      // Scene 2: The Five Escalating Conflicts
      pages: 'Page 471 - 475',
      description: 'Theron\'s obsessive methods create five escalating conflicts demonstrating how unchecked passion multiplies problems. Each conflict deepens his isolation while reinforcing his conviction: bypassing protocols leads to suspension he sees as obstruction, colleagues questioning his Arkan-3 intervention are dismissed as lacking vision, dimensional entities feeling violated are rationalized as primitive, Francisco and Zara\'s parallel learning is rejected, and his internal warnings are buried beneath frantic activity. The tragic self-fulfilling prophecy shows passion transforming from uplifting service into controlling domination.',
      focus: 'Francisco and Zara witness how Theron\'s obsession creates five escalating conflicts, each deepening his isolation while reinforcing conviction, demonstrating the tragic multiplication of problems when passion becomes unbalanced',
      chapterSceneFocus: 'Ch32S2: Understanding how unchecked intensity multiplies problems by destroying accountability, alienating allies, violating those served, rejecting learning, and burying self-awareness',
      preliminarySceneFocus: 'Five escalating conflicts demonstrate how Theron\'s obsession transforms dedication into destruction through self-reinforcing isolation',
      preliminarySceneDescription: 'Morning descends into crisis as Theron\'s methods create five destructive conflicts. Conflict One: He bypasses protocols for preemptive restructuring in Arkan-3, gets suspended, interprets accountability as obstruction. Conflict Two: Colleagues question his intervention that prevented one instability but created three new problems, he dismisses feedback as lacking vision. Conflict Three: Arkan-3 entities protest feeling violated by unilateral intervention, he rationalizes their distress as primitive failure to appreciate his protection. Conflict Four: Francisco and Zara share their Korthak-7 learning hoping to help, Theron rejects the comparison claiming his success validates his approach. Conflict Five: His internal warnings (exhaustion, isolation, lost perspective) are buried beneath frantic activity. Each conflict deepens isolation while reinforcing his conviction that opposition proves his unique understanding—a tragic self-fulfilling prophecy where excessive zeal generates opposition he interprets as validation.',
      narrativeFunction: 'Demonstrates through concrete escalating conflicts how unchecked passion multiplies problems rather than solving them. This scene shows the Five of Swords pattern in action, establishing that the line between constructive dedication and destructive fanaticism lies in whether passion collaborates or dominates.',
      sensoryDetail: 'Morning\'s escalation vibrates with mounting tension. Arkan-3 projections show Theron\'s intervention preventing one problem while creating three more. Colleague voices carry concern shifting to alarm. Dimensional entity protests pulse with violated agency. Francisco and Zara\'s earnest sharing meets Theron\'s dismissive certainty. His hands shake more violently, eyes burn with exhausted intensity, voice grows more strident with each conflict.',
      internalConflict: 'Francisco struggles with watching someone\'s strengths become their destruction, knowing intervention is needed but uncertain how to reach someone so convinced of their rightness. Zara grapples with growing alarm as each conflict deepens rather than corrects Theron\'s trajectory. Both must find ways to address destructive patterns without destroying the person.',
      characterGrowthElement: 'Francisco develops understanding of how obsession creates self-fulfilling prophecies where opposition generated by excess becomes interpreted as validation. Zara learns to recognize the tragic escalation pattern where each conflict reinforces rather than corrects destructive conviction. Both grow in their capacity to see how passion serving becomes obsession controlling when disconnected from collaboration, empathy, and self-awareness.',
      seriesConnectionResonance: 'Francisco\'s experience witnessing escalating obsession patterns helps him recognize when passionate resistance forces risk becoming the very fanaticism they oppose. His understanding of self-fulfilling prophecies where opposition reinforces conviction becomes crucial for maintaining balanced resistance approaches during the timeline war.',
      sceneCardProgression: 52,
      realWorldContext: 'The five conflicts mirror real-world patterns where passionate individuals\' excessive zeal generates opposition they interpret as validation, creating self-reinforcing isolation. The conflicts reflect how lack of accountability, dismissing feedback, violating stakeholder agency, rejecting parallel learning, and burying self-awareness multiply organizational problems. The pattern applies to recognizing fanaticism in any domain.',
      timelineSignificance: 'Establishes how unchecked intensity creates escalating crisis through self-reinforcing conviction patterns. The five conflicts demonstrate that morning of February 27, 1320 becomes a cautionary example of how passion transforms into destructive obsession when disconnected from collaborative wisdom and sustainable practice.',
      saveTheCatBeat: 'All Is Lost - Multiplying Conflicts',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Zara\'s POV: Focus on watching each conflict deepen the crisis while Theron\'s conviction grows stronger, the tragic recognition of someone creating their own destruction, the growing alarm mixed with compassion for gifts being wasted. Show her seeing the escalation pattern.',
        sudowrite_emotional_arc: 'Begins with concern about Theron\'s first conflict, moves through mounting alarm as each escalates, culminates in tragic recognition of self-fulfilling prophecy. The emotional journey is from worry to devastated understanding.',
        sudowrite_sensory_emphasis: 'Emphasize the mounting tension of each successive conflict, Theron\'s increasing physical signs of exhaustion and agitation, the contrast between his brilliant capabilities and destructive trajectory, the visible multiplication of problems.',
      },
      learning_objectives: {
        integration: 'Conflict Escalation and Self-Fulfilling Obsession',
        terminal_objectives: [
          'Recognize how unchecked passion creates self-fulfilling prophecies where opposition generated by excess becomes interpreted as validation',
          'Understand the five conflict pattern: destroying accountability, alienating allies, violating stakeholders, rejecting learning, burying self-awareness',
          'Identify escalation dynamics where each conflict reinforces rather than corrects destructive conviction through increasing isolation',
        ],
      },
      foreshadowing_elements: [
        'The five conflicts creating self-reinforcing isolation foreshadows the intervention approach needed to break the cycle',
        'Theron\'s rejection of Francisco and Zara\'s parallel learning foreshadows the breakthrough when he finally accepts their experience',
        'The buried internal warnings foreshadow the turning point when Theron\'s exhausted self-awareness finally surfaces',
      ],
    },
    {
      // Scene 3: Channeling the Storm
      pages: 'Page 476 - 480',
      description: 'At the Mediation Center, Francisco and Zara work with Master Cordelia to develop intervention strategy that channels Theron\'s genuine insights constructively while establishing boundaries. Drawing on their Korthak-7 learning, they create structured approach: integrating his detection capabilities into the six-station network, requiring collaborative review, mandating structured rest, assigning partnership modeling balance, and conditioning participation on emotional regulation. Through six hours of patient compassionate mediation, Theron cycles through resistance until his buried self-awareness surfaces: his dedication had become the catastrophe he was trying to prevent. The five swords transform from weapons back into tools of service as passion reconnects with collaboration, sustainability, empathy, and humility.',
      focus: 'Francisco and Zara execute compassionate intervention that transforms Theron\'s destructive obsession into sustainable constructive passion by honoring his gifts while establishing collaborative accountability and healing his isolation',
      chapterSceneFocus: 'Ch32S3: Demonstrating that authentic cosmic leadership requires difficult compassionate interventions that channel passionate intensity constructively through collaboration, boundaries, and sustained support',
      preliminarySceneFocus: 'Francisco and Zara develop and execute intervention strategy that transforms Theron\'s storm of obsession into constructive passion',
      preliminarySceneDescription: 'At the Mediation Center, Francisco and Zara consult with Master Cordelia about intervention strategy. Drawing on their catastrophic Korthak-7 learning, they design structured approach: integrate Theron\'s legitimate detection insights into the six-station network (honoring gifts), require collaborative review (strengthening not obstructing), mandate supervised rest (addressing exhaustion), assign partnership (healing isolation), condition participation on emotional regulation (managing intensity). The six-hour mediation becomes testament to patience as Theron cycles through resistance, rationalization, anger, grief, finally reaching tentative recognition. Francisco shares brutal honesty about their near-catastrophe teaching humility. Zara describes collaborative restoration building more trust than false confidence. The turning point comes when Theron\'s buried self-awareness surfaces: "my dedication became the very catastrophe I was trying to prevent." Through structured support, his storm of consuming passion transforms into sustainable intensity as the five swords become tools of service again, reconnected with collaboration, sustainability, empathy, and humility.',
      narrativeFunction: 'Completes the passion wisdom arc by showing successful intervention that channels destructive obsession into constructive passion. This scene demonstrates that authentic leadership requires difficult compassionate conversations confronting harmful patterns while preserving the person, establishing that passion serves when collaborative but destroys when isolated.',
      sensoryDetail: 'The Mediation Center emanates calm purposeful atmosphere designed for channeling intensity. Six hours unfold with patient compassionate rhythm. Theron\'s resistance manifests in defensive body language gradually softening. The turning point arrives with exhausted tears as buried self-awareness finally surfaces. Master Cordelia\'s wisdom pervades. The transformation from consuming isolation to sustainable connection becomes palpable as Theron leaves exhausted but no longer alone.',
      internalConflict: 'Francisco struggles with sharing the brutal honesty of their Korthak-7 catastrophe, exposing their deepest failure to help a colleague. Zara grapples with balancing compassion for Theron\'s suffering with firmness about necessary boundaries. Both must trust that patient sustained intervention will succeed despite cycles of resistance.',
      characterGrowthElement: 'Francisco completes his passion wisdom development by learning to channel destructive intensity into constructive service through compassionate intervention honoring gifts while establishing boundaries. Zara masters conflict resolution skills for de-escalating passionate disputes while preserving positive energy through structured support and patient compassion. Both achieve understanding that authentic leadership includes difficult conversations confronting harm while healing the person.',
      seriesConnectionResonance: 'Francisco\'s methods for channeling intense emotion constructively become essential for motivating others during dark periods of the timeline war. His compassionate intervention approach becomes the template for maintaining unity among passionate resistance forces without descending into the fanaticism they oppose. His ability to honor intensity while requiring collaboration shapes resistance culture.',
      sceneCardProgression: 53,
      realWorldContext: 'The Mediation Center intervention mirrors real-world practices for addressing burnout and obsession in passionate professionals. The structured approach of honoring capabilities while establishing boundaries, mandating self-care, and healing isolation through partnership reflects best practices in organizational psychology. The six-hour patient process reflects that transforming destructive patterns requires sustained compassionate support.',
      timelineSignificance: 'Establishes that this afternoon marks the transformation of destructive obsession into sustainable passion through structured compassionate intervention. The approach of honoring gifts while requiring collaboration becomes the model for managing intense dedication throughout cosmic service and resistance movements, preventing the tragedy of brilliant passionate agents destroying themselves and others.',
      saveTheCatBeat: 'Dark Night of the Soul - Transformation Through Compassion',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco and Zara alternating: Focus on the patience required for sustained intervention, the vulnerability of sharing catastrophic failure to build trust, the satisfaction of seeing transformation through compassionate boundaries. Show them learning that leadership includes difficult healing conversations.',
        sudowrite_emotional_arc: 'Begins with determined intervention strategy, moves through the patience of cycling resistance, culminates in profound satisfaction as Theron\'s self-awareness surfaces and healing begins. The emotional journey is from purposeful firmness to compassionate connection.',
        sudowrite_sensory_emphasis: 'Emphasize the calm purposeful atmosphere of the Mediation Center, the six-hour rhythm of patient compassion, Theron\'s gradual softening from resistance to recognition, the turning point of exhausted tears, the palpable transformation from isolation to connection.',
      },
      learning_objectives: {
        integration: 'Compassionate Intervention and Passion Transformation',
        terminal_objectives: [
          'Execute compassionate intervention that channels destructive obsession into sustainable passion by honoring gifts while establishing collaborative boundaries',
          'Apply patient sustained support through cycling resistance until buried self-awareness surfaces and transformation becomes possible',
          'Demonstrate that authentic leadership requires difficult conversations confronting harmful patterns while preserving and healing the person',
        ],
      },
      foreshadowing_elements: [
        'The intervention template foreshadows how Francisco will maintain unity among passionate resistance forces during the timeline war',
        'The methods for channeling intensity constructively foreshadow his approach to motivating others during dark periods',
        'The compassionate boundaries preventing fanaticism foreshadow resistance culture that opposes tyranny without becoming tyrannical',
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

  console.log('\n🎉 EA-032 complete import finished!');
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
