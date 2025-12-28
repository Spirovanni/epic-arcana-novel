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

interface EA030Data {
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

function findEA030Data(): EA030Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA030Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-030') return obj as EA030Data;

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
  console.log('🔍 Searching for EA-030 in outline...\n');

  const ea030Data = findEA030Data();

  if (!ea030Data) {
    console.error('❌ EA-030 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-030: ${ea030Data.title}`);
  console.log(`   Scenes: ${ea030Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 30 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-030'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-030 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 30 in the same book
    const ch30 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 30))
      .limit(10);

    const correctChapter = ch30.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 30 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 30: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-030',
        title: ea030Data.title,
        epicNovelPages: truncate(ea030Data.epic_novel_pages, 50),
        epicChapterFocus: ea030Data.epic_chapter_focus,
        epicNovelChapterFocus: ea030Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea030Data.tarot_family, 100),
        tarotCardItem: truncate(ea030Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea030Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea030Data.save_the_cat_beat, 255),
        summary: ea030Data.summary,
        characterArcs: ea030Data.character_arcs,
        storyGapsAddressed: ea030Data.story_gaps_addressed,
        locationDetails: ea030Data.location_details,
        seriesConnections: ea030Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-030 data\n');
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

  for (const sceneData of ea030Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-030',
      sceneNumber: sceneData.scene_number,
      title: truncate(sceneData.scene_title, 255),
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      pov: truncate(sceneData.pov, 100),
      tense: truncate(sceneData.tense, 100),
      coreEmotion: truncate(sceneData.core_emotion, 100),
      sceneTone: truncate(sceneData.scene_tone, 100),
      timelineDate: truncate(sceneData.timeline_date, 50),
      timelineVariant: truncate(sceneData.timeline_variant, 100),
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
      // Scene 1: The Assessment of Damage
      pages: 'Page 431 - 435',
      description: 'Francisco and Zara return to face the aftermath of the Korthak-7 catastrophe with La Signora, who demonstrates compassionate accountability. Through holographic reconstruction, they witness both their catastrophic failure and their innovative breakthrough, learning to hold paradoxical truths in balanced tension without collapsing into either guilt or defensiveness.',
      focus: 'Francisco and Zara learn to hold the paradox of catastrophic failure and innovative success in balanced tension, facing consequences with accountability rather than shame',
      chapterSceneFocus: 'Ch30S1: Learning that true accountability means holding paradoxical truths in balanced tension without collapsing into guilt or defensiveness',
      preliminarySceneFocus: 'La Signora guides Francisco and Zara through compassionate assessment of their Korthak-7 failure',
      preliminarySceneDescription: 'In the Academy Restoration Facility at dawn, Francisco and Zara return to face the consequences of their catastrophic failure on Korthak-7. La Signora creates a holographic reconstruction showing both the devastating destruction and the innovative breakthrough that emerged from disruption. The assessment is neither punishing nor dismissive, teaching them to hold the paradox of failure and success simultaneously—accepting full responsibility while recognizing genuine innovation. They must develop the emotional maturity to face consequences without collapsing into guilt or defensiveness, learning that true mastery includes owning mistakes while maintaining faith in growth.',
      narrativeFunction: 'Establishes the theme of balanced choice and compassionate accountability, creating the foundation for sustainable restoration rather than reactive correction. This scene demonstrates that facing consequences honestly is the prerequisite for making wise choices going forward.',
      sensoryDetail: 'The Restoration Facility hums with diagnostic energy, holographic projections shimmer in three-dimensional space showing destruction and innovation simultaneously. La Signora\'s presence radiates both firmness and compassion. Francisco feels the weight of responsibility without crushing shame, while Zara\'s analytical mind processes the paradoxical data without defensive rationalization.',
      internalConflict: 'Francisco struggles between accepting responsibility and defending their innovative approach. Zara battles the urge to justify their actions with data while knowing they caused real harm. Both must develop the emotional capacity to hold paradoxical truths without collapsing into either guilt or denial.',
      characterGrowthElement: 'Francisco develops emotional maturity to face consequences with accountability rather than shame. Zara learns to balance analytical understanding with emotional responsibility. Both grow in their capacity to hold paradoxical truths simultaneously—they failed catastrophically AND they innovated genuinely.',
      seriesConnectionResonance: 'Establishes the principle that cosmic responsibility includes owning mistakes honestly while maintaining faith in growth. This compassionate accountability will become a hallmark of mature cosmic service throughout the series, demonstrating that true mastery includes learning from failure.',
      sceneCardProgression: 45,
      realWorldContext: 'The Restoration Facility mirrors real-world accountability processes where leaders must face consequences without defensive rationalization. The holographic assessment reflects how modern data visualization can show multiple truths simultaneously, teaching that wisdom includes holding paradoxes in tension.',
      timelineSignificance: 'Establishes that February 25, 1320 becomes the day Francisco and Zara learn compassionate accountability, setting the pattern for how cosmic agents face consequences with maturity rather than shame. This honest assessment creates the foundation for sustainable restoration.',
      saveTheCatBeat: 'The Resurrection - Compassionate Accountability',
      sudowriteMetadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the weight of responsibility without crushing shame, the struggle to accept accountability while maintaining self-worth. Show him learning to hold failure and innovation as simultaneous truths.',
        sudowrite_emotional_arc: 'Begins with defensive tension, moves through the discomfort of honest assessment, culminates in the relief of accountability without shame. The emotional journey is from fear of judgment to acceptance of paradoxical truth.',
        sudowrite_sensory_emphasis: 'Emphasize the shimmer of holographic projections showing destruction and creation, the hum of diagnostic systems, the warmth of La Signora\'s compassionate firmness, the physical sensation of holding opposing truths in tension.',
      },
      learningObjectives: {
        integration: 'Compassionate Accountability and Balanced Assessment',
        terminal_objectives: [
          'Hold paradoxical truths (catastrophic failure AND genuine innovation) in balanced tension without collapsing into guilt or denial',
          'Accept full responsibility for consequences while maintaining faith in growth and learning',
          'Develop emotional maturity to face assessment with accountability rather than defensiveness or shame',
        ],
      },
      foreshadowingElements: [
        'The holographic reconstruction showing both destruction and innovation foreshadows the balanced choice they must make',
        'La Signora\'s compassionate accountability establishes the pattern for how cosmic service handles mistakes',
        'The paradoxical truths they must hold foreshadow the difficult choice in the Chamber of Balanced Choices',
      ],
    },
    {
      // Scene 2: The Chamber of Balanced Choices
      pages: 'Page 436 - 440',
      description: 'In the Chamber of Balanced Choices, Francisco and Zara face three restoration approaches, each with amplified consequences. Option 1 offers immediate patching but loses their innovation. Option 2 provides safe reconstruction but destroys their breakthrough. Option 3 proposes collaborative healing with sustainable resilience but requires trusting those they harmed. No perfect solution exists—they must choose the difficult sustainable path over the easy fix.',
      focus: 'Francisco and Zara must choose between three imperfect restoration approaches, learning that wisdom means selecting the difficult sustainable path rather than the easy immediate fix',
      chapterSceneFocus: 'Ch30S2: Understanding that true wisdom means choosing the difficult sustainable path over the easy immediate fix, even when no perfect solution exists',
      preliminarySceneFocus: 'Francisco and Zara face three restoration approaches in the Chamber of Balanced Choices, each with amplified trade-offs',
      preliminarySceneDescription: 'In the Chamber of Balanced Choices, a crystalline space where decisions manifest as visible consequences, Francisco and Zara encounter three restoration approaches for Korthak-7. The Immediate Patching option offers quick stability but erases their innovative disruption. The Comprehensive Reconstruction option provides safe predictability but destroys the breakthrough potential. The Collaborative Healing option creates sustainable resilience through partnership with the inhabitants they harmed, but requires vulnerability and trust. Each choice is amplified to show its long-term consequences, teaching them that wisdom isn\'t about finding perfect solutions—it\'s about choosing the difficult sustainable path over the easy temporary fix.',
      narrativeFunction: 'Creates the central decision point of the chapter, forcing Francisco and Zara to choose between immediate comfort and sustainable wisdom. This scene establishes that cosmic responsibility includes making difficult choices with no perfect options, trusting in collaborative partnership over control.',
      sensoryDetail: 'The Chamber is crystalline and multifaceted, each restoration option manifesting as a visible branching path showing future consequences. Option 1 glows with immediate stability but dims into forgotten potential. Option 2 shines with safe predictability but crystallizes into rigid limitation. Option 3 pulses with uncertain energy but grows into organic partnership. The air vibrates with decision-weight.',
      internalConflict: 'Francisco is tempted by the safety of Comprehensive Reconstruction, wanting to undo their mistake completely. Zara is drawn to Immediate Patching, seeking to stabilize quickly and move forward. Both struggle with the vulnerability required by Collaborative Healing—trusting those they harmed feels impossibly difficult. They must overcome the urge for control and embrace partnership.',
      characterGrowthElement: 'Francisco learns that true leadership means choosing sustainable partnership over safe control. Zara develops the wisdom to select long-term resilience over short-term stability. Both grow in their capacity to accept imperfect solutions and trust in collaborative wisdom rather than individual mastery.',
      seriesConnectionResonance: 'Establishes the principle that cosmic service prioritizes sustainable partnership over immediate control. This choice will echo through the series as characters learn that true wisdom includes accepting imperfect solutions and trusting in collaboration. The decision to partner with those they harmed demonstrates mature cosmic responsibility.',
      sceneCardProgression: 46,
      realWorldContext: 'The Chamber of Balanced Choices reflects real-world decision-making where leaders face imperfect options with visible trade-offs. The three approaches mirror how organizations choose between quick fixes, safe reconstruction, or difficult collaborative change. The lesson that sustainable solutions require vulnerability and trust applies to leadership and conflict resolution.',
      timelineSignificance: 'Establishes that this morning on February 25, 1320 becomes the moment Francisco and Zara choose sustainable partnership over easy control, setting the pattern for how cosmic agents make difficult decisions with imperfect options. This choice will influence restoration approaches throughout history.',
      saveTheCatBeat: 'The Road Back - The Choice of Sustainable Partnership',
      sudowriteMetadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the temptation of safety versus the call of sustainable wisdom, the fear of trusting those he harmed, the weight of choosing imperfection over control. Show him learning to embrace collaborative partnership.',
        sudowrite_emotional_arc: 'Begins with the overwhelm of imperfect choices, moves through the temptation of easy solutions, culminates in the courageous choice of difficult sustainable partnership. The emotional journey is from control-seeking to trust-embracing.',
        sudowrite_sensory_emphasis: 'Emphasize the crystalline visualization of future consequences, the glow and pulse of each restoration path, the weight of decision in the air, the physical sensation of choosing vulnerability over safety.',
      },
      learningObjectives: {
        integration: 'Balanced Decision-Making and Sustainable Choice',
        terminal_objectives: [
          'Choose sustainable partnership over immediate control when facing imperfect restoration options',
          'Accept that wisdom includes selecting difficult long-term solutions rather than easy short-term fixes',
          'Develop the courage to trust collaborative healing even when it requires vulnerability with those they harmed',
        ],
      },
      foreshadowingElements: [
        'The choice of Collaborative Healing foreshadows the partnership approach they will implement in Scene 3',
        'The visible consequences of each path foreshadow the ongoing development of decision-making wisdom',
        'The vulnerability required for Option 3 foreshadows the trust and apology needed for restoration',
      ],
    },
    {
      // Scene 3: The Restoration Begins
      pages: 'Page 441 - 445',
      description: 'Francisco and Zara return to Korthak-7 not as fixers but as collaborative healers, offering genuine apology without defensiveness. The inhabitants, possessing intuitive understanding of disrupted dimensions, become true partners in restoration. Together they create sustainable resilience through shared responsibility and mutual respect, demonstrating that the most powerful cosmic service emerges from partnership rather than individual mastery.',
      focus: 'Francisco and Zara return as collaborative healers rather than fixers, creating sustainable restoration through genuine partnership with those they harmed',
      chapterSceneFocus: 'Ch30S3: Demonstrating that the most powerful cosmic service emerges from collaborative partnership and shared responsibility rather than individual mastery',
      preliminarySceneFocus: 'Francisco and Zara implement collaborative healing on Korthak-7, partnering with the inhabitants they harmed',
      preliminarySceneDescription: 'In the afternoon light at the Korthak-7 restoration site, Francisco and Zara return not as cosmic masters fixing their mistake, but as collaborative partners seeking healing together. Francisco offers genuine apology without defensiveness, acknowledging harm while expressing hope for partnership. The inhabitants, who possess intuitive understanding of dimensional disruption from living through it, become true co-creators of restoration. Together they weave a healing process that combines cosmic technique with indigenous wisdom, creating sustainable resilience through shared responsibility. The restoration is slower and more organic than a unilateral fix would have been, but it grows roots of genuine partnership and mutual respect.',
      narrativeFunction: 'Resolves the chapter by demonstrating the successful implementation of sustainable collaborative partnership. This scene establishes that true cosmic service includes genuine apology, humble partnership, and shared creation rather than individual mastery. It shows the fruit of choosing the difficult sustainable path.',
      sensoryDetail: 'The Korthak-7 landscape shimmers with disrupted dimensional energy gradually stabilizing. Francisco and Zara work side by side with inhabitants whose hands weave intuitive patterns of repair. The air vibrates with collaborative resonance as cosmic technique and indigenous wisdom merge. The restoration grows organically like roots spreading through soil, slower but deeper than quick fixes.',
      internalConflict: 'Francisco struggles with the humility of apologizing without making excuses, wanting to explain their intentions but knowing true apology requires accepting impact over intent. Zara battles the impulse to take charge and direct the restoration, learning to listen and follow the inhabitants\' lead. Both must surrender control and trust in partnership.',
      characterGrowthElement: 'Francisco develops the humility to apologize genuinely without defensiveness, accepting that impact matters more than intention. Zara learns to follow rather than lead, trusting in others\' wisdom and expertise. Both grow in their capacity for true collaborative partnership, recognizing that shared creation is more powerful than individual mastery.',
      seriesConnectionResonance: 'Establishes the template for cosmic restoration that will be used throughout the series—genuine apology, humble partnership, and collaborative co-creation that honors local wisdom. This approach will become the hallmark of mature cosmic service, demonstrating that the most powerful interventions emerge from shared responsibility.',
      sceneCardProgression: 47,
      realWorldContext: 'The collaborative restoration mirrors real-world conflict resolution and community healing where genuine apology and humble partnership create sustainable change. The integration of cosmic technique with indigenous wisdom reflects how effective solutions honor local knowledge. The slower organic growth of partnership reflects how sustainable change takes time.',
      timelineSignificance: 'Establishes that this afternoon on February 25, 1320 becomes the moment Francisco and Zara implement collaborative cosmic restoration, creating the template for partnership-based service that will be used throughout history. This restoration approach will influence how cosmic agents work with communities they serve.',
      saveTheCatBeat: 'The Road Back - Restoration Through Collaboration',
      sudowriteMetadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the humility of genuine apology, the surrender of control in collaborative partnership, the joy of co-creation with those he harmed. Show him learning that shared responsibility is more powerful than individual mastery.',
        sudowrite_emotional_arc: 'Begins with the vulnerability of returning to face those they harmed, moves through the relief of genuine partnership, culminates in the deep satisfaction of collaborative restoration. The emotional journey is from apprehension to authentic connection.',
        sudowrite_sensory_emphasis: 'Emphasize the shimmer of gradually stabilizing dimensions, the weaving patterns of collaborative repair, the vibration of merged wisdom traditions, the organic growth of sustainable restoration like roots spreading.',
      },
      learningObjectives: {
        integration: 'Collaborative Restoration and Shared Responsibility',
        terminal_objectives: [
          'Offer genuine apology without defensiveness, accepting impact over intention in taking responsibility for harm',
          'Practice humble collaborative partnership that honors local wisdom and expertise over cosmic mastery',
          'Create sustainable restoration through shared responsibility and co-creation rather than unilateral fixing',
        ],
      },
      foreshadowingElements: [
        'The collaborative restoration template foreshadows future cosmic service approaches throughout the series',
        'The integration of cosmic technique with indigenous wisdom foreshadows ongoing partnerships with local communities',
        'The sustainable resilience created through shared responsibility foreshadows the long-term impact of partnership-based cosmic service',
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
        sudowriteMetadata: enhancement.sudowriteMetadata,
        learningObjectives: enhancement.learningObjectives,
        foreshadowingElements: enhancement.foreshadowingElements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-030 complete import finished!');
  console.log('\n📊 Verifying scene completion...\n');

  // Verify all fields are populated
  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  for (const scene of finalScenes) {
    const fields = [
      'title',
      'setup',
      'symbolism',
      'beatGoal',
      'pov',
      'tense',
      'coreEmotion',
      'sceneTone',
      'timelineDate',
      'timelineVariant',
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
      'sudowriteMetadata',
      'learningObjectives',
      'foreshadowingElements',
    ];

    const populatedCount = fields.filter((field) => {
      const value = (scene as any)[field];
      return value !== null && value !== undefined;
    }).length;

    console.log(`Scene ${scene.sceneNumber}: ${populatedCount}/${fields.length} fields populated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
