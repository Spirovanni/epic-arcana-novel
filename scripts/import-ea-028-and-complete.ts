import { eq, asc } from 'drizzle-orm';
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

interface EA028Data {
  id: string;
  title: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  plot_beat?: string;
  summary?: string;
  character_arcs?: string;
  story_gaps_addressed?: string;
  location_details?: string;
  series_connections?: string;
  epic_preliminary_scene_description?: string;
  scenes: SceneData[];
}

function findEA028Data(): EA028Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));
  const search = (obj: any): EA028Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-028') return obj as EA028Data;
    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };
  return search(outlineData);
}

function truncate(value: string | null | undefined, maxLength: number): string | null {
  if (!value) return null;
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength - 3) + '...';
}

async function main() {
  console.log('🔍 Processing EA-028...\n');
  const ea028Data = findEA028Data();
  if (!ea028Data) {
    console.error('❌ EA-028 not found');
    process.exit(1);
  }

  // Import basic data
  const ea023 = await db.select().from(chapters).where(eq(chapters.uniqueIdentifier, 'EA-023')).limit(1);
  if (ea023.length === 0) {
    console.error('❌ EA-023 not found');
    process.exit(1);
  }
  const bookId = ea023[0].bookId;

  let chapter = (await db.select().from(chapters).where(eq(chapters.uniqueIdentifier, 'EA-028')).limit(1))[0];
  if (!chapter) {
    const ch28 = await db.select().from(chapters).where(eq(chapters.chapterNumber, 28)).limit(10);
    const correctChapter = ch28.find((ch) => ch.bookId === bookId);
    if (!correctChapter) {
      console.error('❌ Chapter 28 not found');
      process.exit(1);
    }
    chapter = correctChapter;
    await db.update(chapters).set({ uniqueIdentifier: 'EA-028', title: ea028Data.title }).where(eq(chapters.id, chapter.id));
  }

  // Delete existing scenes
  await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));

  // Import scenes
  for (const sceneData of ea028Data.scenes || []) {
    await db.insert(scenes).values({
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-028',
      sceneNumber: sceneData.scene_number,
      title: sceneData.scene_title?.substring(0, 255) || null,
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      pov: sceneData.pov?.substring(0, 100) || null,
      tense: sceneData.tense?.substring(0, 100) || null,
      core_emotion: sceneData.core_emotion?.substring(0, 100) || null,
      scene_tone: sceneData.scene_tone?.substring(0, 100) || null,
      timeline_date: sceneData.timeline_date?.substring(0, 50) || null,
      timeline_variant: sceneData.timeline_variant?.substring(0, 100) || null,
      location: sceneData.location?.substring(0, 255) || null,
    });
  }

  console.log('✅ EA-028 basic import complete\n');

  // Update chapter fields
  await db.update(chapters).set({
    title: ea028Data.title,
    epicNovelPages: truncate(ea028Data.epic_novel_pages, 50),
    epicChapterFocus: ea028Data.epic_chapter_focus || null,
    epicNovelChapterFocus: ea028Data.epic_novel_chapter_focus || null,
    tarotFamily: truncate(ea028Data.tarot_family, 100),
    tarotCardItem: truncate(ea028Data.tarot_card_item, 100),
    heroJourneyBeat: truncate(ea028Data.hero_journey_beat, 100),
    saveTheCatBeat: truncate(ea028Data.save_the_cat_beat, 100),
    plotBeat: truncate(ea028Data.plot_beat, 100),
    summary: ea028Data.summary || null,
    characterArcs: ea028Data.character_arcs || null,
    storyGapsAddressed: ea028Data.story_gaps_addressed || null,
    locationDetails: ea028Data.location_details || null,
    seriesConnections: ea028Data.series_connections || null,
    epicPreliminarySceneDescription: ea028Data.epic_preliminary_scene_description || null,
  }).where(eq(chapters.id, chapter.id));

  console.log('✅ Chapter fields updated\n');

  // Get scenes and add all fields
  const ea028Scenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(asc(scenes.sceneNumber));

  const sceneData = [
    {
      // Scene 1
      pages: 'Page 406 - 410',
      description: 'Francisco and Zara receive summons to Academy Achievement Facility where Master Cornelius and full Council await displaying holographic records of legendary cosmic agents. Introduction to Six Chambers evaluating different critical aspects: Balance Arena, Discernment Sanctum, Manipulation Observatory, Strategy Nexus, Synergy Garden, and Mastery Crucible. Six Challenge Guardians materialize as objective evaluators.',
      focus: 'Francisco and Zara face comprehensive mastery evaluation through Six Chambers testing all cosmic competencies',
      chapterSceneFocus: 'Ch28S1: Understanding that cosmic advancement requires demonstrating comprehensive mastery across all dimensions',
      preliminarySceneFocus: 'Dawn summons to prestigious evaluation facility where six specialized chambers await comprehensive testing',
      preliminarySceneDescription: 'At the crystalline evaluation complex, Master Cornelius and Academy Council present the Six Chambers of Achievement—specialized environments testing Balance, Discernment, Energy Manipulation, Strategy, Synergy, and integrated Mastery. The Six Challenge Guardians materialize as ancient cosmic entities serving as objective evaluators. Francisco and Zara recognize this comprehensive evaluation will validate their readiness for advanced cosmic assignments through rigorous multidimensional assessment.',
      narrativeFunction: 'Establishes high-stakes comprehensive evaluation validating Francisco and Zara\'s integration of all previous learning through formal multidimensional testing.',
      sensoryDetail: 'Dawn light on crystalline evaluation complex creating prisms throughout facility. Holographic records of legendary agents floating in Grand Assessment Hall. Six Challenge Guardians materializing with ancient cosmic presence. Temperature perfect controlled environment for objective assessment. Visual magnificence of achievement standards.',
      internalConflict: 'Francisco faces performance pressure balancing confidence from previous successes with recognition that this evaluation determines cosmic agent career trajectory—comprehensive failure means returning to student status.',
      characterGrowthElement: 'Francisco learns to perform under comprehensive evaluation pressure by trusting integrated learning rather than trying to impress evaluators—authentic demonstration beats performance anxiety.',
      seriesConnectionResonance: 'This achievement evaluation becomes template for how Francisco and Zara\'s cosmic competence is assessed throughout their career—comprehensive demonstration rather than specialized expertise.',
      sceneCardProgression: 39,
      realWorldContext: 'Six Chambers evaluation mirrors real comprehensive assessments—medical boards, military qualification courses, professional certifications—where multidimensional competence must be demonstrated under pressure.',
      timelineSignificance: 'Success in Six Chambers evaluation opens access to advanced independent cosmic missions, while failure would require additional supervised training delaying their service career.',
      saveTheCatBeat: 'The Ordeal - Comprehensive Test of All Abilities',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Francisco. Show his mixed emotions: confidence from previous successes, respect for evaluation gravity, determination to demonstrate integrated learning. Render the crystalline facility\'s magnificence creating appropriate assessment atmosphere. Portray his recognition that this evaluation determines cosmic service trajectory.',
        sudowrite_emotional_arc: 'Begin with Francisco\'s determined focus facing evaluation. Build through respectful nervousness as Chambers\' complexity revealed. Peak at acceptance that comprehensive assessment is fair measure of readiness. Resolve in calm readiness to demonstrate authentic integrated mastery.',
        sudowrite_sensory_emphasis: 'Crystalline complex creating visual clarity and transparency. Holographic legendary agents establishing high standards. Challenge Guardians\' ancient presence palpable. Dawn light perfect for beginning comprehensive evaluation. Temperature controlled precision.',
      },
      learning_objectives: {
        integration: 'All previous learning—cosmic balance, opportunity discernment, restoration commitment—must be integrated and demonstrated comprehensively rather than sequentially.',
        terminal_objectives: [
          'Perform under comprehensive evaluation pressure by trusting integrated learning',
          'Demonstrate multidimensional cosmic competence across all critical skill areas',
          'Accept rigorous objective assessment as fair validation of readiness',
        ],
      },
      foreshadowing_elements: [
        'Six Chambers becoming standard for cosmic agent qualification',
        'Challenge Guardians\' objective assessment establishing reputation system',
        'Holographic legacy records previewing Francisco and Zara joining legendary agents',
        'Comprehensive evaluation pattern used for future advancement assessments',
        'The facility becoming site for other significant cosmic qualifications',
        'Ancient evaluator entities suggesting cosmic forces observing their progress',
      ],
    },
    {
      // Scene 2
      pages: 'Page 411 - 415',
      description: 'Francisco and Zara successfully complete first four chambers: Balance Arena maintaining equilibrium through seven gravitational disturbances, Discernment Sanctum identifying three genuine opportunities among twenty-seven anomalies, Energy Manipulation Observatory channeling seventeen energy streams, Strategy Nexus making critical decisions with incomplete information. They synthesize balance mastery, opportunity discernment, and restoration techniques into seamless cosmic action. Challenge Guardians observe with approval; Council members exchange impressed glances.',
      focus: 'Francisco and Zara demonstrate integrated mastery across four progressively complex trials',
      chapterSceneFocus: 'Ch28S2: Proving that integrated learning enables seamless performance across diverse complex challenges',
      preliminarySceneFocus: 'Morning trials showcase synthesis of all previous learning into cohesive cosmic competence',
      preliminarySceneDescription: 'Through four progressively complex chambers, Francisco and Zara demonstrate comprehensive integration: maintaining cosmic balance through shifting forces, rapidly discerning authentic opportunities from deceptions, precisely controlling multiple energy streams, and making strategic decisions despite incomplete information. Their seamless performance proves that previous learning from Destini, Seven Paths, and Aurelia has synthesized into cohesive cosmic competence. Challenge Guardians\' approval and Council\'s impressed reactions validate their readiness.',
      narrativeFunction: 'Demonstrates successful integration of all previous learning through progressively difficult trials, building confidence and external validation before final ultimate test.',
      sensoryDetail: 'Balance Arena\'s shifting gravitational forces felt throughout body. Twenty-seven cosmic anomalies creating visual complexity in Discernment Sanctum. Seventeen energy streams as visible flowing colors in Manipulation Observatory. Strategy Nexus presenting rapid-fire decisions with mounting pressure. Challenge Guardians\' subtle approval gestures. Council members\' exchanged impressed glances.',
      internalConflict: 'Zara must resist overconfidence after early successes, recognizing that final two chambers will be exponentially harder and that complacency could cause comprehensive failure despite strong start.',
      characterGrowthElement: 'Zara learns to celebrate progress while maintaining focus—success in early stages doesn\'t guarantee final achievement, requiring sustained excellence rather than coasting on momentum.',
      seriesConnectionResonance: 'This pattern of progressive difficulty with sustained excellence requirement becomes characteristic of their cosmic missions—early success must be maintained through increasing complexity.',
      sceneCardProgression: 40,
      realWorldContext: 'Progressive trials mirror real qualification processes where early stages build confidence but final tests require peak sustained performance—medical residencies, special forces selection, championship competitions.',
      timelineSignificance: 'Impressing Challenge Guardians and Council in early chambers establishes positive reputation that influences future assignment offerings and cosmic community perception.',
      saveTheCatBeat: 'The Reward - Demonstrating Progressive Mastery',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Zara. Show her exhilaration as each chamber\'s challenge is met and overcome. Render the mounting confidence tempered by awareness that harder tests await. Portray her partnership with Francisco becoming seamless through trials—wordless coordination emerging from integrated training.',
        sudowrite_emotional_arc: 'Begin with Zara\'s focused determination entering first chamber. Build through rising confidence as challenges are successfully met. Peak at recognition that final chambers will be exponentially harder. Resolve in calibrated confidence—celebrating success while maintaining vigilant focus.',
        sudowrite_sensory_emphasis: 'Shifting gravitational forces creating disorientation then adaptation. Visual overwhelming complexity of twenty-seven anomalies. Seventeen energy streams\' colors and flows. Rapid strategic decisions\' mounting time pressure. Challenge Guardians\' subtle approval. Council\'s impressed expressions.',
      },
      learning_objectives: {
        integration: 'Demonstrates that true mastery means seamlessly applying diverse skills in progressively complex situations without compartmentalizing learning into separate categories.',
        terminal_objectives: [
          'Maintain sustained excellence through progressively difficult challenges',
          'Resist overconfidence while celebrating legitimate progress',
          'Integrate diverse skills seamlessly rather than switching between specializations',
        ],
      },
      foreshadowing_elements: [
        'Progressive difficulty pattern becoming characteristic of their cosmic missions',
        'Seamless partnership coordination previewing deeper bond development',
        'Challenge Guardians\' approval establishing their growing cosmic reputation',
        'Council\'s impressed reactions previewing future leadership opportunities',
        'The four chambers\' skills becoming foundation for future cosmic work',
        'References to final two chambers\' exponential difficulty building suspense',
      ],
    },
    {
      // Scene 3
      pages: 'Page 416 - 420',
      description: 'Final two chambers: Synergy Garden requiring wordless coordination maintaining delicate balance while healing three damaged zones simultaneously, and Mastery Crucible combining every previous challenge—shifting gravity, hidden opportunities, seventeen energy streams, contradictory strategic data, perfect collaborative harmony—all simultaneously. Twenty intense minutes of peak performance results in zero casualties and damaged region improved beyond original state. Challenge Guardians bow (gesture given twice in century). Master Cornelius announces fewer than twenty agents in 300 years achieved this. Their achievement record joins holographic legacy.',
      focus: 'Francisco and Zara achieve peak collaborative mastery earning legendary recognition',
      chapterSceneFocus: 'Ch28S3: Demonstrating that true mastery integrates all skills seamlessly under ultimate pressure',
      preliminarySceneFocus: 'Afternoon culmination through wordless partnership and comprehensive integrated excellence',
      preliminarySceneDescription: 'In final chambers, Francisco and Zara demonstrate seamless collaborative mastery: Synergy Garden\'s wordless coordination healing damaged zones, Mastery Crucible\'s comprehensive crisis combining all previous challenges simultaneously. Twenty minutes of peak sustained performance achieves zero casualties with improvement beyond original state. Challenge Guardians\' century-rare bow, Master Cornelius\'s announcement of historical achievement, joining legendary agents\' holographic records—validation of complete transformation from students to accomplished cosmic agents.',
      narrativeFunction: 'Completes achievement arc through peak performance demonstration earning historical recognition, validating their comprehensive transformation and establishing legendary status among cosmic servants.',
      sensoryDetail: 'Afternoon light filling chambers with culmination energy. Synergy Garden\'s flowing ecosystem requiring wordless coordination. Mastery Crucible\'s overwhelming simultaneous challenges creating sensory overload demanding perfect focus. Twenty-minute duration feeling both eternal and instant. Challenge Guardians\' synchronized bow creating profound moment. Master Cornelius\'s voice carrying historical weight. Holographic legacy records expanding to include their achievement.',
      internalConflict: 'Francisco must accept legendary achievement recognition while maintaining humility—extraordinary performance doesn\'t make him superior to others, just demonstrates faithful application of cosmic service principles.',
      characterGrowthElement: 'Francisco integrates achievement with humility, learning that historical recognition comes not from being special but from faithful dedication to cosmic service principles—excellence serves purpose, not ego.',
      seriesConnectionResonance: 'This legendary achievement establishes Francisco and Zara\'s reputation enabling access to most critical cosmic missions while creating expectation of continued excellence throughout their service.',
      sceneCardProgression: 41,
      realWorldContext: 'Achieving legendary status through comprehensive demonstration mirrors real rare achievements—Olympic medals, Nobel recognition, military honors—where sustained peak performance under ultimate pressure earns historical place.',
      timelineSignificance: 'Joining legendary agents\' holographic records establishes Francisco and Zara\'s name across cosmic timelines, their methods studied by future cosmic agents for centuries.',
      saveTheCatBeat: 'The Resurrection - Achieving Legendary Mastery Status',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited alternating Francisco and Zara. Show their wordless synchronization in Synergy Garden—deep partnership transcending verbal communication. Render the Mastery Crucible\'s overwhelming simultaneous challenges requiring every skill integrated seamlessly. Portray the twenty-minute peak performance as flow state. Capture the profound moment of Challenge Guardians\' bow and Master Cornelius\'s historical announcement.',
        sudowrite_emotional_arc: 'Begin with determination facing final chambers. Build through exhilarating flow state of peak integrated performance. Peak at profound recognition as Challenge Guardians bow and historical achievement announced. Resolve in humble triumphant gratitude—achievement earned through faithful service, not personal superiority.',
        sudowrite_sensory_emphasis: 'Synergy Garden\'s living ecosystem flows. Mastery Crucible\'s overwhelming simultaneous challenges. Twenty-minute duration\'s timeless quality in flow state. Challenge Guardians\' synchronized bow creating profound silence. Master Cornelius\'s voice weighted with history. Holographic records expanding to include their achievement. Afternoon light seeming to celebrate.',
      },
      learning_objectives: {
        integration: 'Ultimate demonstration that all cosmic service learning—balance, discernment, restoration, partnership—integrates into seamless excellence under ultimate comprehensive pressure.',
        terminal_objectives: [
          'Perform at sustained peak excellence integrating all skills simultaneously',
          'Accept legendary achievement recognition while maintaining humble service orientation',
          'Establish reputation and legacy through demonstrated comprehensive mastery',
        ],
      },
      foreshadowing_elements: [
        'Legendary status opening access to most critical cosmic missions ahead',
        'Their methods becoming studied by future cosmic agents',
        'Challenge Guardians\' bow suggesting cosmic forces acknowledging their significance',
        'Wordless partnership synchronization previewing deepest possible collaborative bond',
        'Holographic legacy establishing their influence across timelines',
        'Reference to "fewer than twenty in 300 years" emphasizing extraordinary rarity',
      ],
    },
  ];

  for (let i = 0; i < ea028Scenes.length; i++) {
    const scene = ea028Scenes[i];
    const data = sceneData[i];
    if (!data) continue;

    await db.update(scenes).set({
      pages: data.pages,
      description: data.description,
      focus: data.focus,
      chapterSceneFocus: data.chapterSceneFocus,
      preliminarySceneFocus: data.preliminarySceneFocus,
      preliminarySceneDescription: data.preliminarySceneDescription,
      narrativeFunction: data.narrativeFunction,
      sensoryDetail: data.sensoryDetail,
      internalConflict: data.internalConflict,
      characterGrowthElement: data.characterGrowthElement,
      seriesConnectionResonance: data.seriesConnectionResonance,
      sceneCardProgression: data.sceneCardProgression,
      realWorldContext: data.realWorldContext,
      timelineSignificance: data.timelineSignificance,
      saveTheCatBeat: data.saveTheCatBeat,
      sudowrite_metadata: data.sudowrite_metadata,
      learning_objectives: data.learning_objectives,
      foreshadowing_elements: data.foreshadowing_elements,
    }).where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title} - All fields updated`);
  }

  console.log('\n🎉 EA-028 fully complete!');
}

main().then(() => process.exit(0)).catch((error) => { console.error('❌ Error:', error); process.exit(1); });
