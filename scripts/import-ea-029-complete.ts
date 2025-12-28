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

interface EA029Data {
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

function findEA029Data(): EA029Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));
  const search = (obj: any): EA029Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-029') return obj as EA029Data;
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
  console.log('🔍 Processing EA-029...\n');
  const ea029Data = findEA029Data();
  if (!ea029Data) {
    console.error('❌ EA-029 not found');
    process.exit(1);
  }

  const ea023 = await db.select().from(chapters).where(eq(chapters.uniqueIdentifier, 'EA-023')).limit(1);
  if (ea023.length === 0) {
    console.error('❌ EA-023 not found');
    process.exit(1);
  }
  const bookId = ea023[0].bookId;

  let chapter = (await db.select().from(chapters).where(eq(chapters.uniqueIdentifier, 'EA-029')).limit(1))[0];
  if (!chapter) {
    const ch29 = await db.select().from(chapters).where(eq(chapters.chapterNumber, 29)).limit(10);
    const correctChapter = ch29.find((ch) => ch.bookId === bookId);
    if (!correctChapter) {
      console.error('❌ Chapter 29 not found');
      process.exit(1);
    }
    chapter = correctChapter;
    await db.update(chapters).set({ uniqueIdentifier: 'EA-029', title: ea029Data.title }).where(eq(chapters.id, chapter.id));
  }

  await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));

  for (const sceneData of ea029Data.scenes || []) {
    await db.insert(scenes).values({
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-029',
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

  console.log('✅ EA-029 basic import complete\n');

  await db.update(chapters).set({
    title: ea029Data.title,
    epicNovelPages: truncate(ea029Data.epic_novel_pages, 50),
    epicChapterFocus: ea029Data.epic_chapter_focus || null,
    epicNovelChapterFocus: ea029Data.epic_novel_chapter_focus || null,
    tarotFamily: truncate(ea029Data.tarot_family, 100),
    tarotCardItem: truncate(ea029Data.tarot_card_item, 100),
    heroJourneyBeat: truncate(ea029Data.hero_journey_beat, 100),
    saveTheCatBeat: truncate(ea029Data.save_the_cat_beat, 100),
    plotBeat: truncate(ea029Data.plot_beat, 100),
    summary: ea029Data.summary || null,
    characterArcs: ea029Data.character_arcs || null,
    storyGapsAddressed: ea029Data.story_gaps_addressed || null,
    locationDetails: ea029Data.location_details || null,
    seriesConnections: ea029Data.series_connections || null,
    epicPreliminarySceneDescription: ea029Data.epic_preliminary_scene_description || null,
  }).where(eq(chapters.id, chapter.id));

  console.log('✅ Chapter fields updated\n');

  const ea029Scenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(asc(scenes.sceneNumber));

  const sceneData = [
    {
      // Scene 1: The Mission Assignment
      pages: 'Page 421 - 425',
      description: 'Just one day after legendary Six Chambers achievement, Francisco and Zara receive urgent summons for their first independent mission: stabilizing Dimension Korthak-7. They accept eagerly, still basking in triumph, but disturbing patterns emerge at entry portal—dimensional instabilities aren\'t behaving according to Academy models, suggesting deeper systemic issues than briefing indicated.',
      focus: 'Francisco and Zara\'s post-victory confidence meets first independent mission revealing unexpected complexity',
      chapterSceneFocus: 'Ch29S1: Understanding that proven competence in controlled environments doesn\'t guarantee readiness for unpredictable reality',
      preliminarySceneFocus: 'Dawn confidence after legendary achievement meets disturbing realization of inadequate preparation',
      preliminarySceneDescription: 'One day after Six Chambers triumph, Francisco and Zara eagerly accept their first independent cosmic mission to stabilize Dimension Korthak-7. Their confidence is high from legendary achievement, but as they arrive at the entry portal, disturbing patterns emerge. The dimensional instabilities aren\'t behaving according to Academy models, suggesting the mission involves deeper systemic complexity than the briefing indicated. Growing unease pierces their confidence.',
      narrativeFunction: 'Establishes transition from controlled evaluation success to unpredictable real-world complexity, introducing the disruption theme where confident competence meets inadequate preparation.',
      sensoryDetail: 'Dawn light at Mission Assignment Chamber still carrying yesterday\'s triumphant energy. Entry portal to Korthak-7 showing dimensional instabilities creating visual distortions. Energy patterns flowing in ways Academy models don\'t predict. Master Cornelius\'s unusual urgency creating tension. Temperature shifts near portal indicating dimensional boundary. Growing sense of wrongness beneath apparent routine mission.',
      internalConflict: 'Francisco struggles between confidence from legendary achievement and growing recognition that this situation doesn\'t match training scenarios—his analytical mind detecting misalignment while ego resists acknowledging inadequacy.',
      characterGrowthElement: 'Francisco learns that confidence from controlled success can blind agents to real-world complexity requiring humility to acknowledge when situations exceed preparation.',
      seriesConnectionResonance: 'This pattern of success-bred overconfidence meeting reality becomes recurring growth edge—each achievement level brings new complexity requiring continued humility and learning.',
      sceneCardProgression: 42,
      realWorldContext: 'Post-achievement overconfidence mirrors real phenomena where recent success creates false sense of mastery—newly certified professionals, athletes after big wins, graduates entering workforce—where controlled environment achievement doesn\'t predict real-world performance.',
      timelineSignificance: 'How Francisco and Zara handle their first independent mission establishes their reputation for either humble adaptability or rigid protocol application, influencing future assignment complexity.',
      saveTheCatBeat: 'All Is Lost - Confidence Meets Complexity',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Francisco. Show his confidence from yesterday\'s legendary achievement creating eager anticipation. Render his enhanced perception detecting wrongness in dimensional patterns while ego wants to dismiss concerns. Portray growing unease as analytical mind recognizes significant deviation from Academy models while confidence resists acknowledging inadequacy.',
        sudowrite_emotional_arc: 'Begin with Francisco\'s triumphant confidence after Six Chambers. Build through eager acceptance of first independent mission. Peak at disturbing recognition that patterns don\'t match training. Resolve in unsettling awareness that preparation may be insufficient.',
        sudowrite_sensory_emphasis: 'Entry portal\'s dimensional distortions creating visual anomalies. Energy flows defying Academy model predictions. Master Cornelius\'s urgent tone contrasting with routine briefing. Temperature fluctuations near dimensional boundary. Quality of wrongness beneath surface normalcy.',
      },
      learning_objectives: {
        integration: 'Recent success creating confidence that blinds to current inadequacy—must balance achievement recognition with situational humility about unknown complexities.',
        terminal_objectives: [
          'Recognize when current situation exceeds preparation despite recent successes',
          'Maintain humility about competence limits even after legendary achievements',
          'Trust analytical perception when it conflicts with ego-driven confidence',
        ],
      },
      foreshadowing_elements: [
        'Dimensional patterns not matching models previewing catastrophic failure ahead',
        'Francisco\'s ignored unease foreshadowing consequences of dismissing intuition',
        'Deeper systemic issues hinting at Academy training\'s incomplete preparation',
        'The urgency suggesting cosmic authorities know this mission exceeds standard difficulty',
        'Three Wounds theme beginning with first wound: overreliance on proven methods',
        'Korthak-7\'s unique architecture previewing need for unprecedented innovation',
      ],
    },
    {
      // Scene 2: The Triple Cascade Failure
      pages: 'Page 426 - 430',
      description: 'Morning descends into nightmare as Francisco and Zara\'s Academy-standard stabilization procedures trigger catastrophic triple cascade failure across three interconnected dimensional subsystems. Energy-balancing techniques overload Korthak-7\'s unique architecture. Desperate containment creates exponential new problems. Dimensional zone transforms into chaos—reality tears, time flowing backward, gravitational anomalies. Thousands of sentient beings endangered because two "accomplished cosmic agents" applied textbook solutions to situation defying textbooks.',
      focus: 'Francisco and Zara\'s proven methods catastrophically fail, actively worsening crisis with thousands at stake',
      chapterSceneFocus: 'Ch29S2: Learning that well-intentioned actions based on inadequate understanding can cause catastrophic harm',
      preliminarySceneFocus: 'Morning crisis reveals proven methods not only failing but actively causing exponential cascade disaster',
      preliminarySceneDescription: 'Francisco and Zara\'s Academy-standard procedures trigger devastating cascade failure propagating across three dimensional subsystems in precisely the sequence they were trained to prevent. Energy techniques overload unique architecture. Containment efforts create exponential problems. Korthak-7 transforms into chaos with reality tears, time distortions, gravitational anomalies. Thousands endangered by accomplished agents applying textbook solutions to situation defying textbooks. Crushing weight of catastrophic failure and responsibility.',
      narrativeFunction: 'Demonstrates complete devastation of proven methods causing active harm, forcing confrontation with inadequate understanding and emotional weight of endangering thousands through confident incompetence.',
      sensoryDetail: 'Morning light becoming nightmarish as systems cascade into failure. Visual reality tears creating dimensional wounds. Time flowing backward in zones creating temporal dissonance. Gravitational anomalies felt as body-weight fluctuations. Sound of alarms escalating across all subsystems. Desperate energy as containment attempts worsen crisis. Temperature chaos reflecting dimensional instability. Thousands of inhabitants\' fear palpable.',
      internalConflict: 'Zara faces crushing realization that her protective instincts and proven techniques are actively harming those she\'s trying to save—the ultimate guardian failure where competent action causes disaster through systemic misunderstanding.',
      characterGrowthElement: 'Zara learns that good intentions and proven methods guarantee nothing—that cosmic service requires systemic understanding before intervention, as competent action without adequate comprehension creates catastrophic harm.',
      seriesConnectionResonance: 'This catastrophic failure becomes Zara\'s foundational teaching about intervention humility—never again assuming protective capability without systemic understanding, no matter how proven techniques appear.',
      sceneCardProgression: 43,
      realWorldContext: 'Cascade failure from proven methods mirrors real disasters—financial crises from sophisticated models, medical harm from standard procedures applied to atypical cases, engineering failures from textbook approaches meeting unique conditions.',
      timelineSignificance: 'This failure could end their cosmic agent careers, but how they respond—with innovation or despair—determines whether they become legendary problem-solvers or cautionary tales.',
      saveTheCatBeat: 'Dark Night of the Soul - Catastrophic Failure and Crushing Responsibility',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Zara. Show her desperate protective instincts driving increasingly frantic interventions. Render her growing horror as each proven technique worsens crisis. Portray crushing recognition that she\'s endangering thousands through competent application of inadequate understanding. Capture overwhelming weight of guardian failure.',
        sudowrite_emotional_arc: 'Begin with Zara\'s confident application of proven procedures. Build through mounting panic as techniques fail. Peak at devastating recognition that she\'s causing harm trying to help. Resolve in overwhelming crisis and responsibility for thousands endangered by her actions.',
        sudowrite_sensory_emphasis: 'Reality tears visible as dimensional fabric wounds. Time distortions creating temporal chaos. Gravitational anomalies physically disorienting. Escalating alarm cascades across all systems. Inhabitants\' terror felt through guardianship senses. Energy of exponential worsening. Temperature reflecting dimensional instability chaos.',
      },
      learning_objectives: {
        integration: 'Proven competence without systemic understanding creates catastrophic harm—must develop humility to recognize when situations exceed current comprehension before acting.',
        terminal_objectives: [
          'Accept that proven methods can cause catastrophic harm when applied to misunderstood situations',
          'Develop humility to pause intervention when systems behave unexpectedly',
          'Recognize that good intentions guarantee nothing without adequate systemic understanding',
        ],
      },
      foreshadowing_elements: [
        'Triple cascade representing Three Wounds piercing three layers of competence',
        'Reality tears previewing need to work with disruption rather than against it',
        'Thousands endangered establishing real stakes beyond ego or reputation',
        'Exponential worsening showing how fighting misunderstood systems amplifies damage',
        'Time distortions hinting at Korthak-7\'s transformation attempting different temporal structure',
        'The devastation creating necessity for unprecedented innovation in final scene',
      ],
    },
    {
      // Scene 3: Innovation Through Disruption
      pages: 'Page 431 - 435',
      description: 'Afternoon finds Francisco and Zara amid chaos they created, all methods exhausted, training failed, facing imminent collapse and thousands of deaths. In desperation something shifts—Francisco stops forcing Korthak-7 to match Academy models and truly observes what dimension is actually doing. Enhanced perception reveals instabilities aren\'t breakdowns but purposeful reconfigurations—Korthak-7 is evolving. They realize need to facilitate natural transformation rather than restore previous state. Three intense hours of trial-and-error innovation develops unprecedented techniques: working with disruption, facilitating change versus forcing stability. Korthak-7 transforms into hybrid dimensional structure more stable, resilient, adaptable than original configuration.',
      focus: 'Francisco and Zara transform catastrophic failure into innovative breakthrough by facilitating natural transformation',
      chapterSceneFocus: 'Ch29S3: Discovering that working with disruption rather than fighting it creates antifragile breakthrough solutions',
      preliminarySceneFocus: 'Afternoon paradigm shift transforms desperation into innovation by facilitating rather than forcing change',
      preliminarySceneDescription: 'Amid chaos they\'ve created, all methods exhausted, Francisco and Zara experience profound paradigm shift. Francisco stops forcing Korthak-7 to match models and truly observes—dimensional instabilities are purposeful reconfigurations, the dimension is evolving. They realize they must facilitate natural transformation rather than restore previous state. Three hours of trial-and-error innovation under extreme pressure develops unprecedented techniques working with disruption. Korthak-7 transforms into hybrid structure more stable and resilient than original. Catastrophic failure becomes innovative breakthrough.',
      narrativeFunction: 'Completes disruption resilience arc by showing transformation from catastrophic failure to innovative breakthrough through paradigm shift from fighting change to facilitating natural evolution.',
      sensoryDetail: 'Afternoon light settling over chaos as paradigm shifts. Reality tears transforming from wounds into new boundaries forming. Energy flows reorganizing into unprecedented stable patterns. Three hours feeling both eternal and instant in innovation urgency. Visual transformation as hybrid dimensional structure emerges. Inhabitants\' awe witnessing unprecedented cosmic service. Temperature stabilizing into new equilibrium. Quality of breakthrough understanding washing away desperation.',
      internalConflict: 'Francisco must accept that the greatest innovation of his cosmic career emerged from catastrophic failure and desperation rather than achievement and planning—that disruption and necessity drove growth impossible through success.',
      characterGrowthElement: 'Francisco learns that true cosmic mastery means courage to abandon all proven methods when circumstances demand, trusting innovation capacity over established protocols when reality requires unprecedented responses.',
      seriesConnectionResonance: 'This innovation-through-disruption becomes their signature capability—where other cosmic agents apply standard solutions, Francisco and Zara create unprecedented approaches when situations demand novelty.',
      sceneCardProgression: 44,
      realWorldContext: 'Innovation through catastrophic failure mirrors real breakthrough discoveries—penicillin from contamination, Post-it notes from failed glue, many scientific advances from unexpected results forcing paradigm shifts when fighting anomalies proved futile.',
      timelineSignificance: 'Developing unprecedented techniques establishes Francisco and Zara as innovators rather than protocol-followers, attracting assignments requiring creative problem-solving beyond standard cosmic agent capabilities.',
      saveTheCatBeat: 'The Resurrection - Innovation and Transformation Through Disruption',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited alternating Francisco and Zara. Show Francisco\'s paradigm shift from forcing to observing—the moment he releases control and truly sees Korthak-7\'s purposeful evolution. Render Zara perceiving pattern in apparent chaos. Portray their three-hour innovation flow state developing unprecedented techniques. Capture transformation from devastation to breakthrough.',
        sudowrite_emotional_arc: 'Begin with desperation amid exhausted methods and imminent catastrophe. Build through paradigm shift as observation reveals purposeful transformation. Peak at breakthrough innovation working with rather than against disruption. Resolve in profound humility—growth earned through failure transformed into wisdom.',
        sudowrite_sensory_emphasis: 'Reality tears becoming new boundaries forming. Energy reorganizing into stable unprecedented patterns. Three-hour innovation urgency creating flow-state timelessness. Hybrid dimensional structure emerging visually. Inhabitants witnessing awe. Stabilizing temperature into new equilibrium. Breakthrough understanding replacing desperation.',
      },
      learning_objectives: {
        integration: 'Greatest innovation emerges when all proven methods fail and necessity forces paradigm shifts—must develop courage to abandon familiar approaches when reality demands unprecedented responses.',
        terminal_objectives: [
          'Transform catastrophic failure into innovative breakthrough through paradigm shifts',
          'Develop courage to abandon all proven methods when circumstances demand novelty',
          'Recognize that working with disruption creates antifragile solutions versus fighting change',
        ],
      },
      foreshadowing_elements: [
        'Innovation-through-disruption becoming signature capability throughout series',
        'Hybrid dimensional structures previewing antifragile cosmic architecture developments',
        'Trial-and-error under pressure establishing methodology for future unprecedented challenges',
        'Three Wounds healing into wisdom representing growth through failure pattern',
        'Facilitation versus force becoming core cosmic service philosophy',
        'Korthak-7 transformation inspiring similar evolution approaches in other dimensions',
      ],
    },
  ];

  for (let i = 0; i < ea029Scenes.length; i++) {
    const scene = ea029Scenes[i];
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

  console.log('\n🎉 EA-029 fully complete!');
}

main().then(() => process.exit(0)).catch((error) => { console.error('❌ Error:', error); process.exit(1); });
