import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface EA027Data {
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
}

function findEA027Data(): EA027Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA027Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-027') return obj as EA027Data;
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
  console.log('🎨 Completing EA-027 chapter and scene fields...\n');

  const ea027Data = findEA027Data();
  if (!ea027Data) {
    console.error('❌ EA-027 not found in outline');
    process.exit(1);
  }

  const ch = await db.select().from(chapters).where(eq(chapters.uniqueIdentifier, 'EA-027')).limit(1);
  if (ch.length === 0) {
    console.error('❌ EA-027 chapter not found in database');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-027: ${chapter.title}\n`);

  // Update chapter fields
  const chapterUpdates = {
    title: ea027Data.title,
    epicNovelPages: truncate(ea027Data.epic_novel_pages, 50),
    epicChapterFocus: ea027Data.epic_chapter_focus || null,
    epicNovelChapterFocus: ea027Data.epic_novel_chapter_focus || null,
    tarotFamily: truncate(ea027Data.tarot_family, 100),
    tarotCardItem: truncate(ea027Data.tarot_card_item, 100),
    heroJourneyBeat: truncate(ea027Data.hero_journey_beat, 100),
    saveTheCatBeat: truncate(ea027Data.save_the_cat_beat, 100),
    plotBeat: truncate(ea027Data.plot_beat, 100),
    summary: ea027Data.summary || null,
    characterArcs: ea027Data.character_arcs || null,
    storyGapsAddressed: ea027Data.story_gaps_addressed || null,
    locationDetails: ea027Data.location_details || null,
    seriesConnections: ea027Data.series_connections || null,
    epicPreliminarySceneDescription: ea027Data.epic_preliminary_scene_description || null,
  };

  await db.update(chapters).set(chapterUpdates).where(eq(chapters.id, chapter.id));
  console.log('✅ Chapter fields updated\n');

  const ea027Scenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(asc(scenes.sceneNumber));
  
  console.log(`📝 Adding all fields to ${ea027Scenes.length} scenes...\n`);

  const sceneData = [
    {
      // Scene 1
      pages: 'Page 391 - 395',
      description: 'Francisco and Zara enter the Chamber of Seven Paths where seven luminous archways represent potential cosmic service paths. Master Cordelia warns that not all are what they appear—some offer glory but lead to emptiness, others appear challenging but align with true purpose. They must integrate cosmic balance with strategic wisdom to distinguish genuine callings from ego-gratifying distractions.',
      focus: 'Francisco and Zara encounter seven potential service paths requiring discernment between authentic purpose and ego gratification',
      chapterSceneFocus: 'Ch27S1: Understanding that opportunity abundance requires wisdom to distinguish authentic callings from attractive illusions',
      preliminarySceneFocus: 'Dawn in legendary Chamber reveals seven paths where discernment determines choosing purpose over glory',
      preliminarySceneDescription: 'In the Chamber of Seven Paths, seven luminous archways pulse with distinct energies representing different cosmic service paths. Master Cordelia explains they can only choose one path, warning that some offer immediate glory but spiritual emptiness while others appear challenging but align with deepest purpose. Francisco wants to analyze systematically while Zara senses hidden dangers, both recognizing this test requires integrating balance wisdom with strategic discernment.',
      narrativeFunction: 'Establishes opportunity discernment as critical cosmic agent skill by presenting multiple attractive options where surface appeal masks deeper truth about authentic service.',
      sensoryDetail: 'Dawn light illuminating vast circular hall with seven luminous archways pulsing different colored energies. Flowing droplet patterns around each archway creating illusion of abundance. Master Cordelia\'s measured voice creating contemplative space. Temperature cool stillness encouraging careful observation. Visual beauty of options disguising complexity of choice.',
      internalConflict: 'Francisco struggles between scholar instinct to analyze all options systematically and recognition that some opportunities are designed to exploit analytical paralysis, learning discernment requires intuitive wisdom alongside intellectual assessment.',
      characterGrowthElement: 'Francisco learns that having many options doesn\'t mean having many good options—that abundance of opportunity requires wisdom to distinguish authentic purpose from ego-serving distractions.',
      seriesConnectionResonance: 'This opportunity discernment skill becomes essential throughout series as Francisco and Zara face increasingly sophisticated cosmic temptations disguised as legitimate service paths.',
      sceneCardProgression: 36,
      realWorldContext: 'Chamber of Seven Paths mirrors real decision points offering multiple attractive options—career paths, partnership opportunities, mission choices—where surface appeal disguises misalignment with values. Draws from research on decision fatigue and paralysis of choice showing abundant options can obscure best path.',
      timelineSignificance: 'How Francisco and Zara navigate the Seven Paths establishes their reputation for wise discernment, influencing what opportunities cosmic authorities offer them.',
      saveTheCatBeat: 'Approach to the Inmost Cave - Facing the Test of Discernment',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Francisco. Show his enhanced cosmic perception revealing energy patterns of each archway while recognizing this creates analytic overwhelm. Render his internal tension between wanting to systematically evaluate all options and Master Cordelia\'s warning about discernment requiring wisdom beyond analysis. Portray his recognition that some paths are designed to exploit his scholarly nature.',
        sudowrite_emotional_arc: 'Begin with Francisco\'s confidence in systematic evaluation. Build through growing awareness that analysis alone won\'t reveal authentic path. Peak at recognition that discernment requires integrating intuition with intellect. Resolve in humble acceptance that wisdom transcends analysis.',
        sudowrite_sensory_emphasis: 'Seven archways\' distinct colored energies creating visual complexity. Droplet patterns flowing around each creating illusion of movement and abundance. Cool temperature encouraging contemplation. Sound of Master Cordelia\'s voice measured and grave. Quality of choice-energy in chamber palpable.',
      },
      learning_objectives: {
        integration: 'Thich Nhat Hanh\'s teaching on "looking deeply" manifests as need to see beneath surface appearance. Goleman\'s work on emotional vs rational decision-making shows in balancing analysis with intuition. Sinek\'s "Start with Why" appears in using purpose clarity to filter options.',
        terminal_objectives: [
          'Recognize that abundant options require discernment wisdom, not just analytical skill',
          'Identify when opportunities exploit natural tendencies rather than serve authentic purpose',
          'Integrate intuitive wisdom with intellectual analysis for authentic decision-making',
        ],
      },
      foreshadowing_elements: [
        'The seven paths structure previews ongoing cosmic service choice points',
        'Master Cordelia\'s warning about glory versus purpose becomes recurring theme',
        'Francisco\'s analytic paralysis hints at growth edge requiring intuitive development',
        'References to "ego traps" preview cosmic forces actively trying to mislead agents',
        'The Chamber becoming significant location for major cosmic decision points',
        'Droplet symbolism connecting to fluidity of opportunity and deception',
      ],
    },
    {
      // Scene 2
      pages: 'Page 396 - 400',
      description: 'Francisco detects three paths with discordant frequencies—ego traps promising easy victories and recognition but hollow beneath surface. Four genuine paths remain, each with profound costs: Cosmic Knowledge requires sacrificing action for contemplation, Universal Protection demands constant vigilance, Cosmic Restoration involves painstaking delayed gratification, Dimensional Harmony requires surrendering individual recognition. They realize discernment means identifying which authentic path aligns with deepest values for greater good, not immediate ego gratification.',
      focus: 'Francisco and Zara eliminate ego-trap paths and evaluate authentic options requiring genuine sacrifice',
      chapterSceneFocus: 'Ch27S2: Learning to distinguish ego-gratifying fantasies from authentic callings requiring real sacrifice',
      preliminarySceneFocus: 'Morning examination reveals three illusory paths and four authentic options each demanding different sacrifices',
      preliminarySceneDescription: 'Through detailed examination, Francisco\'s cosmic perception detects three paths with subtly discordant frequencies showing magnificent visions of legendary status but hollow where authentic purpose should resonate. Zara senses the same wrongness—these are ego traps. Four genuine paths remain, each demanding profound costs. They discover opportunity discernment isn\'t finding the perfect path but identifying which authentic calling aligns with their values and serves greater good despite required sacrifices.',
      narrativeFunction: 'Demonstrates that true discernment requires seeing through attractive illusions and accepting that all authentic paths demand sacrifice—the question is which sacrifice serves genuine purpose.',
      sensoryDetail: 'Morning light revealing subtle details in archway energy patterns. Three paths showing magnificent images of Francisco and Zara as legendary figures but emitting hollow discordant frequencies. Four remaining paths glowing with steady unflashy light. Visual contrast between flashy presentation and authentic substance. Temperature warming with growing understanding.',
      internalConflict: 'Zara must confront her protective instinct being exploited by ego-trap paths promising universal protector glory. She learns true guardianship requires surrendering the validation that comes from visible heroic intervention.',
      characterGrowthElement: 'Zara discovers that her protective nature, while authentic, can be manipulated by opportunities promising recognition for heroism. True cosmic guardianship may require invisible prevention work without glory.',
      seriesConnectionResonance: 'Learning to see through ego-gratifying illusions becomes Zara\'s ongoing challenge as cosmic forces offer increasingly sophisticated temptations disguised as protection opportunities.',
      sceneCardProgression: 37,
      realWorldContext: 'Eliminating ego traps mirrors real discernment between opportunities offering external validation versus authentic purpose alignment. Draws from research on extrinsic versus intrinsic motivation showing sustainable fulfillment comes from purpose-aligned work regardless of recognition.',
      timelineSignificance: 'Successfully identifying and rejecting ego traps establishes Francisco and Zara as resistant to cosmic manipulation—making them valuable for assignments requiring incorruptible judgment.',
      saveTheCatBeat: 'The Ordeal - Confronting True Cost of Authentic Paths',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited in Zara. Show her guardianship senses detecting wrongness in ego-trap paths despite their attractive presentation. Render her recognition that these paths are designed to exploit her protective instinct with visions of universal protector glory. Portray her difficult acknowledgment that authentic guardianship may require surrendering visible recognition.',
        sudowrite_emotional_arc: 'Begin with Zara confidently using guardianship senses to evaluate paths. Build through disturbing recognition that ego traps specifically target her protective nature. Peak at difficult acceptance that true service may require invisible unglamorous work. Resolve in clear-eyed commitment to authentic purpose over validation.',
        sudowrite_sensory_emphasis: 'Three illusory paths\' discordant frequencies felt as wrongness in guardianship senses. Visual magnificence of ego-trap presentations contrasting with hollow energy signature. Four authentic paths\' steady unglamorous glow. Costs of each path felt as weight of sacrifice required. Morning light revealing truth beneath appearance.',
      },
      learning_objectives: {
        integration: 'Thich Nhat Hanh\'s teaching on attachment to outcome applies to releasing need for recognition. Goleman\'s work on ego versus purpose shows in identifying when validation-seeking drives choices. Sinek\'s emphasis on intrinsic motivation manifests in choosing purpose alignment over external rewards.',
        terminal_objectives: [
          'Identify when opportunities exploit authentic strengths for ego gratification',
          'Accept that all authentic paths require sacrifice—discernment means choosing which sacrifice serves purpose',
          'Release attachment to external validation in favor of purpose alignment',
        ],
      },
      foreshadowing_elements: [
        'Ego traps becoming more sophisticated in future cosmic encounters',
        'Zara\'s struggle with invisible protection work previews ongoing growth edge',
        'Four authentic paths each foreshadowing different cosmic service specializations',
        'References to "greater good versus immediate gratification" becoming series theme',
        'The costs of authentic paths preview sacrifices required throughout cosmic service',
        'Discordant frequencies as detection method for deception used in future scenarios',
      ],
    },
    {
      // Scene 3
      pages: 'Page 401 - 405',
      description: 'Francisco and Zara simultaneously reach for Path of Cosmic Restoration—neither most prestigious nor dramatic but resonating perfectly with learned dynamic balance and authentic service. Francisco recognizes restoration integrates scholarly understanding with practical action serving genuine need. Zara sees it allows protective instincts to evolve into sustainable guardianship teaching systems to self-regulate. Chamber dissolves into damaged realm of Aurelia presenting immediate challenges testing everything learned—complex damaged anchors, trust-shattered populations, systemic problems requiring patient unglamorous healing over dramatic heroics.',
      focus: 'Francisco and Zara commit to Path of Cosmic Restoration aligned with authentic purpose over ego gratification',
      chapterSceneFocus: 'Ch27S3: Choosing authentic calling aligned with values and purpose despite unglamorous nature and difficult challenges',
      preliminarySceneFocus: 'Afternoon decision reveals shared clarity choosing restoration path aligned with learned balance wisdom',
      preliminarySceneDescription: 'In shared clarity from Phoenix transformation and Destini experience, Francisco and Zara simultaneously choose the Path of Cosmic Restoration. It\'s neither intellectually prestigious nor dramatically heroic but resonates perfectly with their cosmic balance foundation and authentic service commitment. Master Cordelia\'s approving smile confirms wise discernment. Chamber transforms into damaged realm of Aurelia—fractured dimensional space requiring patient healing work rather than dramatic intervention, beginning their legacy through necessary restoration.',
      narrativeFunction: 'Completes opportunity discernment arc by showing Francisco and Zara commit to authentic calling aligned with their values despite unglamorous nature, establishing their cosmic service legacy path.',
      sensoryDetail: 'Afternoon light creating decisiveness atmosphere. Modest steady glow of restoration path calling to both simultaneously. Master Cordelia\'s smile of approval. Chamber dissolving sensation as reality shifts. Damaged realm of Aurelia materializing—fractured dimensional structures, disrupted energy flows, broken trust visible in inhabitants\' faces. Complexity of authentic restoration work becoming immediately apparent.',
      internalConflict: 'Francisco must accept that restoration path, while perfect for his purpose, won\'t bring the scholarly prestige he once craved. He chooses meaningful service over recognition, trusting authentic purpose satisfaction transcends external validation.',
      characterGrowthElement: 'Francisco integrates his scholarly identity with service orientation, choosing work that uses his knowledge for genuine need rather than intellectual prestige. He discovers authentic fulfillment comes from purpose alignment, not recognition.',
      seriesConnectionResonance: 'Choosing the Restoration Path establishes Francisco and Zara\'s cosmic service specialization and reputation as patient healers of complex systemic damage—their signature contribution throughout the series.',
      sceneCardProgression: 38,
      realWorldContext: 'Choosing restoration over prestige mirrors real decisions between high-status low-impact work versus unglamorous high-impact service. Draws from research showing purpose-aligned work provides deeper satisfaction than recognition-based achievement.',
      timelineSignificance: 'Committing to Cosmic Restoration path opens access to damaged realms throughout timelines requiring their patient systematic healing approach, establishing their unique cosmic service niche.',
      saveTheCatBeat: 'The Reward - Clarity and Commitment to Authentic Path',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Third Person Limited alternating Francisco and Zara. Show their simultaneous recognition of restoration path as perfect alignment. Render Francisco\'s acceptance of unglamorous over prestigious, Zara\'s recognition of sustainable over dramatic. Portray their transition from Chamber into damaged Aurelia, immediate complexity of real restoration work becoming apparent.',
        sudowrite_emotional_arc: 'Begin with both contemplating final authentic paths. Build through simultaneous recognition of restoration as perfect alignment. Peak at moment of shared committed choice. Resolve in purposeful readiness as Aurelia\'s challenges materialize, eager to begin meaningful work.',
        sudowrite_sensory_emphasis: 'Restoration path\'s modest steady glow calling to both. Afternoon light settling into decisiveness. Chamber dissolving creating disorientation then reforming as Aurelia. Fractured dimensional structures visible as reality tears. Disrupted energy creating visual and sensory chaos. Inhabitants\' expressions showing broken trust. Immediate complexity palpable.',
      },
      learning_objectives: {
        integration: 'Thich Nhat Hanh\'s "being peace" manifests in choosing work that embodies their values. Goleman\'s authentic purpose research shows in selecting based on purpose fit over external rewards. Sinek\'s "Infinite Game" thinking appears in choosing sustainable systemic work over quick heroic wins.',
        terminal_objectives: [
          'Commit to authentic calling aligned with values despite lack of prestige or glamour',
          'Trust that purpose alignment provides deeper fulfillment than external recognition',
          'Begin cosmic service legacy through patient systematic healing work',
        ],
      },
      foreshadowing_elements: [
        'Aurelia becoming first of many damaged realms requiring their restoration skills',
        'Restoration path establishing their reputation as patient systematic healers',
        'Broken trust theme previewing challenge of populations traumatized by failed helpers',
        'References to sustainable guardianship becoming Zara\'s specialty throughout series',
        'Francisco\'s integration of scholarship with practical service defining his cosmic contribution',
        'The unglamorous nature of their chosen work becoming source of authentic satisfaction',
      ],
    },
  ];

  for (let i = 0; i < ea027Scenes.length; i++) {
    const scene = ea027Scenes[i];
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

  console.log('\n🎉 EA-027 fully complete!');
}

main().then(() => process.exit(0)).catch((error) => { console.error('❌ Error:', error); process.exit(1); });
