import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Completing ALL EA-024 scene fields...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-024'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-024 not found');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-024: ${chapter.title}\n`);

  const ea024Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Adding all fields to ${ea024Scenes.length} scenes...\n`);

  // Complete data for all three scenes
  const sceneData = [
    {
      // Scene 1: The Academy Crisis
      pages: 'Page 346 - 350',
      focus: 'Francisco and Zara confront Academy factions dividing over cosmic defense approaches',
      chapterSceneFocus: 'Ch24S1: Understanding that true leadership requires harmonizing diverse perspectives rather than imposing singular vision',
      preliminarySceneFocus: 'Dawn crisis reveals Academy fracturing into three conflicting factions requiring harmonic leadership',
      preliminarySceneDescription:
        'At dawn, urgent Academy bells summon Francisco and Zara to crisis: three factions—Militant Guardians, Scholarly Preservationists, and Mystical Integrationists—have fractured Academy unity over cosmic defense approaches. Master Cornelius reveals traditional leadership has failed. Francisco and Zara recognize this as their first real-world test of divine harmonic principles learned from La Signora.',
      narrativeFunction:
        'Establishes the central conflict requiring Francisco and Zara to apply their divine training to a real leadership challenge. This scene demonstrates that mastering cosmic principles means nothing if they cannot create harmony in practical situations.',
      sensoryDetail:
        'Dawn light breaking over Academy towers, urgent bronze bells reverberating through stone corridors, the weight of tension in Council Chambers where three distinct groups cluster separately, Master Cornelius\'s aged appearance showing the toll of failed mediation, the visual divide of Academy robes sorted by faction colors.',
      internalConflict:
        'Francisco feels the weight of responsibility—this is not a theoretical exercise but real Academy unity at stake. He must trust that La Signora\'s teachings will work in messy reality, resisting the temptation to impose order through authority rather than creating harmony through integration.',
      characterGrowthElement:
        'Francisco transitions from theoretical understanding of harmonic principles to practical application under pressure. He learns that divine wisdom is tested not in sacred groves but in chaotic human conflicts where ego, fear, and urgency complicate every interaction.',
      seriesConnectionResonance:
        'This Academy crisis mirrors the broader cosmic conflicts Francisco and Zara will face throughout the series. Their success here establishes their credibility as harmonic leaders, foreshadowing their role in resolving larger universal disputes.',
      sceneCardProgression: 27,
      realWorldContext:
        'The Academy crisis mirrors real organizational conflicts where well-meaning groups fracture over methodology despite shared purpose. Draws from mediation scenarios in universities, religious institutions, and political coalitions where different factions see their approach as the only valid path. References transformative leadership models that integrate diverse perspectives rather than forcing consensus.',
      timelineSignificance:
        'Establishes Francisco and Zara\'s reputation as harmonic leaders within the Academy community. Their success here opens doors for greater cosmic responsibilities and demonstrates that divine training has practical application in institutional leadership.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited anchored in Francisco\'s consciousness. Show his intellectual analysis of the faction dynamics while feeling the emotional weight of Academy crisis. Render his internal process: recognizing La Signora\'s teachings apply here, identifying how mindful direction could restructure this conflict, wrestling with doubt about whether divine principles work in human chaos. Portray the physical sensations of leadership pressure—the eyes on him expecting solutions, the urgency in the air, his deliberate centering through breath to access present-moment clarity.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s shock at discovering Academy division—this is his home fractured. Build through his recognition that traditional approaches have failed and this requires new methods. Peak at the moment of decision: will he impose order or create harmony? Resolve in quiet determination as he commits to applying La Signora\'s harmonic principles despite uncertainty.',
        sudowrite_sensory_emphasis:
          'Emphasize dawn light creating long shadows in Council Chambers. Sound of urgent bells still echoing. Visual clustering of three distinct factions in separate areas. Master Cornelius\'s tired voice. The tension-filled silence between opposing groups. Temperature of the room—cool morning air charged with conflict energy.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s "The Art of Communicating" demonstrates that conscious listening transforms conflict—Francisco applies this by creating space for factions to be truly heard. Goleman\'s "Social Intelligence" shows how emotional awareness enables navigation of group dynamics—Francisco recognizes that beneath positional arguments lie deeper fears requiring empathetic engagement. Sinek\'s "Leaders Eat Last" manifests as Francisco prioritizing Academy unity over personal comfort or quick resolution.',
        terminal_objectives: [
          'Recognize when traditional leadership approaches fail and transformation requires new frameworks',
          'Apply divine harmonic principles to real-world organizational conflicts',
          'Identify the deeper emotional needs beneath surface-level factional positions',
        ],
      },
      foreshadowing_elements: [
        'The three-faction structure previews larger cosmic conflicts requiring integration of action, wisdom, and spirit',
        'Master Cornelius\'s failed traditional approach foreshadows why new leadership paradigms are needed cosmically',
        'The Academy crisis being resolved in one day hints at Francisco and Zara\'s growing mastery and efficiency',
        'References to "cosmic defense strategy" foreshadow larger threats requiring Academy preparation',
        'The urgency of the bells mirrors future cosmic summons requiring immediate harmonic response',
        'Francisco\'s recognition that this tests divine training previews ongoing theme of spiritual wisdom proving itself in practical application',
      ],
    },
    {
      // Scene 2: The Harmonic Council
      pages: 'Page 351 - 355',
      focus: 'Francisco and Zara restructure Academy discussions to enable empathetic understanding between factions',
      chapterSceneFocus: 'Ch24S2: Learning that structural changes enabling empathy can transform entrenched conflicts more effectively than persuasive arguments',
      preliminarySceneFocus: 'Implementing harmonic seating and mindful facilitation to reveal shared fears beneath opposing positions',
      preliminarySceneDescription:
        'Morning light fills the Council Chambers as Francisco and Zara implement La Signora\'s teachings by creating a "Harmonic Council" arrangement. Interwoven seating circles place faction members beside those they oppose, creating natural empathy opportunities. Through mindful direction and emotional protection, the session reveals core fears: Militants fear inadequate preparation, Preservationists fear losing ancient wisdom, Integrationists fear spiritual disconnection. Understanding dawns that apparent conflicts mask complementary concerns.',
      narrativeFunction:
        'Demonstrates Francisco and Zara\'s mastery of harmonic leadership through practical application. This scene shows that transformation doesn\'t require dramatic confrontation but rather skillful restructuring that enables natural understanding and connection.',
      sensoryDetail:
        'Morning sunlight streaming through high windows creating patterns on the circular seating arrangement, the visible shift in body language as faction members sit beside former opponents, the quality of silence deepening as people truly listen, tears on some faces as fears are spoken aloud, Zara\'s protective energy creating palpable safety, Francisco\'s calm voice guiding present-moment awareness.',
      internalConflict:
        'Zara must maintain protective emotional space while resisting the urge to solve problems for the factions. She learns that true protection means creating safety for people to discover their own solutions rather than shielding them from necessary vulnerability.',
      characterGrowthElement:
        'Zara evolves from protective guardian who prevents harm to harmonic facilitator who creates safe space for transformative vulnerability. She discovers that the deepest protection comes from enabling authentic connection rather than preventing all discomfort.',
      seriesConnectionResonance:
        'The Harmonic Council structure becomes a template used throughout the series for resolving cosmic conflicts. This scene establishes Francisco and Zara\'s signature approach: creating containers for transformation rather than imposing solutions.',
      sceneCardProgression: 28,
      realWorldContext:
        'Harmonic Council structure draws from restorative justice circles, council processes used in indigenous governance, and dialogue methodologies like Bohm Dialogue and Nonviolent Communication. Mirrors real transformations in organizational development when physical restructuring enables new interaction patterns. References research showing how seating arrangements dramatically impact group dynamics and empathy levels.',
      timelineSignificance:
        'This successful facilitation establishes Francisco and Zara\'s methodology for cosmic conflict resolution. The Harmonic Council approach becomes their signature contribution to cosmic leadership practices, used by other cosmic leaders throughout timelines.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited from Zara\'s perspective. Show her dual awareness: maintaining protective emotional field while observing faction members\' growing vulnerability. Render her sensory experience of energy shifts in the room—resistance dissolving, defensiveness softening, genuine curiosity emerging. Portray her internal recognition that this is working, that La Signora\'s teachings translate to practical leadership. When faction members begin crying or speaking their fears, show Zara\'s compassionate witness without rescue impulse.',
        sudowrite_emotional_arc:
          'Open with Zara\'s focused determination to hold protective space despite doubts. Build through her growing awareness that the structure is enabling natural transformation. Peak at the moment when she recognizes that true protection means allowing necessary vulnerability. Resolve in quiet confidence as she integrates this new understanding of protective leadership.',
        sudowrite_sensory_emphasis:
          'Morning light quality shifting as session progresses. The sound of authentic voices replacing defensive arguments. Visual transformation of body language—uncrossing arms, leaning in, meeting eyes. Temperature of emotional energy shifting from cold resistance to warm connection. The quality of silence becoming pregnant with understanding rather than hostile with tension.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s practice of deep listening manifests in the Harmonic Council structure that makes genuine hearing unavoidable. Goleman\'s emotional regulation techniques show in how Zara maintains calm protective field enabling others\' emotional expression. Sinek\'s concept of "Circle of Safety" becomes literal in the interwoven seating creating physical embodiment of mutual support.',
        terminal_objectives: [
          'Design structural interventions that enable natural transformation rather than forcing change',
          'Hold protective space that allows vulnerability without rescuing people from necessary discomfort',
          'Facilitate authentic expression of core fears and needs beneath surface positions',
        ],
      },
      foreshadowing_elements: [
        'The Harmonic Council structure will be used for major cosmic negotiations in future books',
        'Zara\'s protective emotional space technique becomes essential for dangerous cosmic dialogues',
        'The revelation that complementary perspectives strengthen rather than weaken previews cosmic alliance building',
        'References to "ancient wisdom" needing protection hint at future threats to cosmic knowledge',
        'The morning-to-understanding progression mirrors larger series arc of darkness to illumination',
        'Faction members\' tears and vulnerability foreshadow that cosmic transformation requires emotional honesty',
      ],
    },
    {
      // Scene 3: The Unified Academy Accords
      pages: 'Page 356 - 360',
      focus: 'Francisco and Zara guide factions in creating integrated cosmic defense strategy honoring all perspectives',
      chapterSceneFocus: 'Ch24S3: Creating comprehensive frameworks where diverse approaches strengthen rather than weaken collective capability',
      preliminarySceneFocus: 'Afternoon celebration as Academy factions sign accords transforming conflict into collaborative strength',
      preliminarySceneDescription:
        'As afternoon sun fills the Harmonic Gardens, Francisco and Zara guide creation of the Unified Academy Accords—a framework integrating all three faction approaches into comprehensive cosmic defense. Militants lead tactical preparedness, Preservationists maintain knowledge archives informing action, Integrationists ensure spiritual alignment. Beyond role assignment, the Accords establish interdependence: each group\'s success requires others\' contributions. In gardens where elements dance in harmony, the Academy community witnesses true harmonic convergence. Master Cornelius marvels as conflict transforms into collaborative strength.',
      narrativeFunction:
        'Completes the harmonic leadership demonstration by showing sustainable integration rather than temporary truce. This scene proves that Francisco and Zara have mastered divine principles by creating lasting transformation that strengthens all parties.',
      sensoryDetail:
        'Afternoon sunlight making the Harmonic Gardens glow, fire and water elements creating complementary displays, earth and air dancing together, the visual beauty of natural harmony mirroring social harmony being achieved, Master Cornelius\'s tears of relief and wonder, the ceremonial signing of accords with representatives from all factions standing together, celebratory atmosphere replacing morning\'s tension.',
      internalConflict:
        'Francisco must resist the satisfaction of accomplishment to maintain humble service orientation. He recognizes this success not as personal achievement but as faithful application of divine wisdom, knowing that pride would corrupt the very harmony he\'s facilitating.',
      characterGrowthElement:
        'Francisco integrates humility with effectiveness, learning that powerful leadership requires complete ego surrender. His satisfaction comes not from being recognized as the solution but from witnessing the Academy community\'s self-discovery of collaborative strength.',
      seriesConnectionResonance:
        'The Unified Academy Accords become the model for cosmic alliance structures throughout the series. This scene establishes that true integration honors diversity rather than demanding conformity, a principle essential for future universal coalitions.',
      sceneCardProgression: 29,
      realWorldContext:
        'The Unified Academy Accords mirror successful organizational integrations like the formation of interdisciplinary research institutes, alliance-building in international relations, and merger integration in business where diversity becomes competitive advantage. References systems thinking showing how integrated diversity creates resilience. Draws from ecological models where biodiversity strengthens ecosystems.',
      timelineSignificance:
        'The Accords establish a new Academy governance model that persists across timelines, influencing how cosmic institutions structure themselves for millennia. Francisco and Zara\'s approach becomes studied as exemplar of transformative harmonic leadership.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited back to Francisco\'s consciousness. Show his careful attention to ensuring all voices shape the Accords, his resistance to imposing his vision even when he could. Render his awareness of the Harmonic Gardens\' elements mirroring the social harmony being achieved. Portray his moment of recognition that this success validates La Signora\'s teachings while knowing he must maintain humility. When Master Cornelius shows wonder, show Francisco\'s quiet gratitude rather than pride.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s focused facilitation ensuring genuine integration rather than compromise. Build through growing recognition that something truly transformative is emerging. Peak at the signing moment when conflict has become collaboration. Resolve in deep satisfaction rooted in service rather than achievement—joy that comes from enabling others\' success.',
        sudowrite_sensory_emphasis:
          'Afternoon golden light throughout the Harmonic Gardens. Visual harmony of elemental displays—fire and water creating complementary beauty, earth and air in flowing interaction. Sound of agreement and celebration replacing conflict. Temperature perfect—neither too hot nor cold, reflecting achieved balance. The quality of energy shifted from fractured to integrated, visible in how people move and interact.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s "Interbeing" concept manifests as Francisco helps factions see their interdependence—each exists because of the others. Goleman\'s "Social Intelligence" appears in recognizing that collective intelligence emerges from integrated diversity. Sinek\'s "Infinite Game" thinking shows in creating sustainable structures for ongoing collaboration rather than temporary fixes.',
        terminal_objectives: [
          'Design integrative frameworks that transform competitive dynamics into collaborative strength',
          'Maintain humble service orientation while facilitating powerful transformations',
          'Create sustainable structures ensuring long-term harmony rather than temporary agreement',
        ],
      },
      foreshadowing_elements: [
        'The Accords model becomes template for cosmic alliance building in later books',
        'References to "cosmic defense strategy" hint at threats requiring this integrated approach',
        'Master Cornelius\'s wonder previews broader cosmic recognition of Francisco and Zara\'s capabilities',
        'The Harmonic Gardens becoming significant location foreshadows its use in future sacred gatherings',
        'Emphasis on interdependence previews cosmic-scale challenges requiring universal cooperation',
        'The afternoon completion within single day shows growing mastery enabling rapid transformation',
      ],
    },
  ];

  // Update each scene
  for (let i = 0; i < ea024Scenes.length; i++) {
    const scene = ea024Scenes[i];
    const data = sceneData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        pages: data.pages,
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
        sudowrite_metadata: data.sudowrite_metadata,
        learning_objectives: data.learning_objectives,
        foreshadowing_elements: data.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   📄 Pages: ${data.pages}`);
    console.log(`   🎯 Focus: ${data.focus.substring(0, 50)}...`);
    console.log(`   📋 Chapter Scene Focus: ${data.chapterSceneFocus.substring(0, 50)}...`);
    console.log(`   ✓ All 15 fields updated`);
    console.log('');
  }

  console.log('🎉 EA-024 all fields complete and uploaded to Neon DB!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
