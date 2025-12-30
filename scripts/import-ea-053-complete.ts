import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-053: Unity (Book 2, Chapter 13)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-053'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-053 not found. Run create-ea-053-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Unity Council Convenes',
      setup: 'In a vast hall constructed at the intersection of multiple timelines, representatives from the major timeline factions gather for the first Unity Council meeting—Medici diplomats in Renaissance finery, Alexandrian scholars with their geometric instruments, Byzantine generals in ceremonial armor, representatives from the Temporal Monks, and members of Francisco\'s informal network of faction rebels. Francisco stands at the center where timeline energies converge, feeling the weight of every eye upon him as he prepares to propose a unified framework for timeline stewardship. He wants to forge these disparate, historically antagonistic groups into a collaborative force that can face the mounting timeline instability together. But opposition emerges from all sides: the Medici question why they should trust a former student\'s authority, the Alexandrians debate whether unity compromises their preservation mission, the Byzantines fear that collaborative decision-making will be too slow when decisive action is needed, and old grudges between factions threaten to explode into open conflict. As Francisco attempts to mediate, the hall\'s architecture—shifting to reflect each faction\'s preferred reality—becomes chaotic, mirroring the political turbulence. The scene lands on Francisco\'s realization that before unity, he must first earn their trust not through power, but through vulnerability and shared purpose.',
      symbolism: 'The Empress embodies generative, nurturing leadership—Francisco must create the conditions for unity to grow organically rather than forcing compliance. The hall at the intersection of timelines represents integration: multiple realities coexisting without one dominating others. The shifting architecture symbolizes the chaos that precedes true unity, while Francisco at the convergence point embodies the threshold itself—the moment where old allegiances must be left behind to enter a new order of collective responsibility.',
      beat_goal: 'Establish the Unity Council as the central political arena where timeline factions must navigate their differences, introducing the key tensions that Francisco must resolve to achieve integration while demonstrating that his leadership approach centers on fostering collaboration rather than asserting dominance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Tension and determination',
      scene_tone: 'Diplomatic and fraught with political complexity',
      timeline_date: '5/1/1320 - Morning',
      timeline_variant: 'Unity Council Layer (Timeline Intersection)',
      location: 'Unity Council Hall - Central Chamber',
    },
    {
      scene_number: 2,
      scene_title: 'The Shared Vision of Stewardship',
      setup: 'At the Temporal Command Center that Francisco has established as his base of operations, he works through the night with his closest allies—including the faction rebels who chose adaptation over rigid allegiance—preparing a comprehensive presentation on timeline stewardship. The command center\'s monitoring systems display the growing instability across multiple timelines: anomalies increasing in frequency, reality breaches expanding, and ominous patterns suggesting coordinated manipulation. Francisco wants to present a vision compelling enough to unite the factions around shared responsibility rather than competitive exploitation of timeline possibilities. His allies help him craft language that speaks to each faction\'s values: security for the Byzantines, knowledge preservation for the Alexandrians, prosperity for the Medici, wisdom for the Temporal Monks. But as morning approaches and the Unity Council reconvenes, Francisco faces the ultimate test: asking these powerful groups to voluntarily limit their own timeline interventions, to accept oversight and accountability, to choose collective stewardship over individual advantage. When the Medici representative asks what stops this "unified stewardship" from becoming just another form of control, Francisco must demonstrate through the Trionfi cards how timeline balance requires nurturing growth rather than imposing order—the Empress principle applied to temporal reality itself. The scene lands on the factions\' cautious agreement to a trial period of unified coordination, marking Francisco\'s transition from wanderer to leader.',
      symbolism: 'The Temporal Command Center represents the Empress as abundance through organization—Francisco creating systems that nurture timeline health rather than exploit timeline resources. The monitoring displays showing growing instability embody the consequences of competitive faction behavior, illustrating what happens when disparate forces refuse to integrate. Francisco\'s inclusive language for each faction\'s values demonstrates the Empress principle of honoring what each element brings to the whole, while the trial period agreement represents crossing the threshold—tentatively stepping into the new world of unified action.',
      beat_goal: 'Francisco presents a compelling framework for timeline stewardship that respects each faction\'s core values while establishing collective responsibility, achieving the first fragile commitment to unified coordination and demonstrating that true leadership creates conditions for growth rather than imposing control through force.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Hope tempered by uncertainty',
      scene_tone: 'Strategic and inspiring with underlying tension',
      timeline_date: '5/2/1320 - Morning',
      timeline_variant: 'Primary Timeline - Command Center Layer',
      location: 'Temporal Command Center - Strategic Planning Chamber',
    },
    {
      scene_number: 3,
      scene_title: 'Dagon\'s Shadow Over Unity',
      setup: 'As the Unity Council prepares to implement its first coordinated timeline stabilization effort, Francisco\'s monitoring systems detect an anomaly: a pattern of reality breaches that shouldn\'t be possible given the factions\' recent history of interventions. Working with Alexandrian scholars to analyze the temporal signatures, Francisco discovers something chilling—the timeline instability bears markers of deliberate orchestration, a single directing intelligence that has been manipulating events across multiple realities to create exactly the kind of chaos that would destabilize all factions simultaneously. The revelation strikes the Unity Council like a shockwave: they haven\'t been competing against each other for timeline influence, they\'ve all been dancing to someone else\'s design. As Francisco traces the patterns deeper with his Trionfi cards, a name surfaces from the temporal data streams—Dagon, an entity whose manipulations extend back further than anyone suspected, who has been using faction conflicts to mask his own reality-reshaping agenda. The Byzantine general recognizes the name from ancient classified records: a being who sought to remake existence itself and was thought defeated millennia ago. Francisco realizes with growing horror that every faction\'s interventions, every timeline war, every reality breach has been feeding Dagon\'s power, creating the exact conditions needed for his return to full strength. The scene lands on the Unity Council\'s recognition that their choice is no longer whether to cooperate, but whether they can cooperate effectively enough to face a threat that has been playing them against each other for generations.',
      symbolism: 'The Empress represents the generative power of unity, but this scene introduces the shadow: Dagon as the force that has been preventing integration by keeping disparate elements in conflict. The temporal patterns revealing Dagon\'s manipulation embody the moment of crossing the threshold—once you see the true enemy, you cannot return to old conflicts and ignorance. The discovery that all faction interventions fed Dagon\'s agenda represents the Break into Two revelation: the world Francisco thought he understood (faction politics) was actually a facade hiding the real stakes (cosmic manipulation).',
      beat_goal: 'Reveal Dagon as the orchestrator of timeline chaos, transforming the Unity Council\'s purpose from managing faction conflicts to facing an existential threat that has been manipulating all factions toward mutual destruction, permanently raising the stakes and cementing the necessity of unified action against a common enemy who benefits from their division.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Dread and horrified realization',
      scene_tone: 'Dark revelation and escalating urgency',
      timeline_date: '5/4/1320 - Afternoon',
      timeline_variant: 'Primary Timeline with Deep Temporal Analysis',
      location: 'Temporal Command Center - Analysis Chamber, then Unity Council Hall',
    },
    {
      scene_number: 4,
      scene_title: 'The Threshold Crossed',
      setup: 'In the immediate aftermath of Dagon\'s revelation, the Unity Council faces its first true test: a massive coordinated reality breach attempting to destabilize three critical timeline junctions simultaneously—exactly the kind of crisis that would normally send factions scrambling to protect their own interests while leaving the broader temporal fabric to collapse. Francisco stands at the Temporal Command Center coordinating with faction representatives who must now trust not only him but each other, deploying their unique capabilities in synchronized harmony: Alexandrian scholars calculating optimal intervention points, Byzantine forces providing temporal stabilization at breach sites, Medici resources funding the massive energy requirements, and Temporal Monks maintaining meditative focus to prevent cascade failures. For the first time in timeline history, the factions operate as a unified team rather than competitors, and Francisco orchestrates it all through his Trionfi cards—not commanding but nurturing, not controlling but integrating, embodying the Empress principle in action. As the coordinated effort successfully seals the breaches, Francisco feels the shift: they have crossed the threshold together, entering the new world where unified stewardship is not just theory but practiced reality. The factions, having tasted success through collaboration, cannot return to their old isolated operations. In the celebration that follows, Francisco and his allies recognize the deeper truth: Dagon\'s attack was meant to shatter their fragile unity, but instead it forged them into something stronger. The scene lands on Francisco formally accepting his role as coordinator of the unified temporal stewardship, with all factions pledging to maintain the alliance as they prepare for the larger confrontation with Dagon that must inevitably come.',
      symbolism: 'The coordinated response to simultaneous breaches embodies the Empress as integration—multiple elements working in harmony create abundance (successful stabilization) that none could achieve alone. The threshold crossing manifests physically as the moment the factions act as one unified body rather than separate competing entities. Francisco\'s orchestration through nurturing rather than commanding demonstrates true Empress leadership: generative power that helps others flourish. The transformation from fragile agreement to proven partnership represents the completion of Break into Two—the characters have fully entered the upside-down world where the old rules (faction isolation) no longer apply and new rules (collective responsibility) now govern their reality.',
      beat_goal: 'The Unity Council successfully executes its first coordinated timeline stabilization operation, transforming theoretical cooperation into practical unified action and cementing Francisco\'s leadership role while demonstrating that collaborative stewardship can achieve what competitive individualism cannot, fully completing the threshold crossing into the new world of collective responsibility with permanently raised stakes.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Triumph and solidarity',
      scene_tone: 'Action-packed, triumphant, and emotionally resonant',
      timeline_date: '5/4/1320 - Evening',
      timeline_variant: 'Multiple Timelines Coordinated',
      location: 'Temporal Command Center coordinating with multiple breach sites',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 181 - 185',
      description: 'Francisco convenes the first Unity Council meeting at the intersection of multiple timelines, gathering representatives from historically antagonistic factions (Medici, Alexandrian, Byzantine, Temporal Monks) to propose unified timeline stewardship.',
      focus: 'Establishing the Unity Council as Francisco navigates political tensions between faction representatives who must learn to trust his leadership.',
      chapterSceneFocus: 'Ch53S1: Francisco convenes the Unity Council, bringing together antagonistic timeline factions in a hall at the intersection of multiple realities, where political tensions threaten to explode before he realizes trust must be earned through vulnerability rather than power.',
      preliminarySceneFocus: 'Unity Council convenes with faction representatives',
      preliminarySceneDescription: 'Major timeline factions gather for first Unity Council meeting with Francisco as coordinator',
      narrativeFunction: 'Establishes the political arena and key faction dynamics while introducing Francisco\'s leadership challenge of uniting disparate groups.',
      sensoryDetail: 'Vast hall at timeline intersection, shifting architecture reflecting different faction realities, Medici Renaissance finery, Alexandrian geometric instruments, Byzantine ceremonial armor, converging timeline energies.',
      internalConflict: 'Francisco\'s struggle between wanting to assert authority and needing to earn trust through vulnerability and shared purpose.',
      characterGrowthElement: 'Francisco learns that true leadership requires creating conditions for organic unity rather than forcing compliance through power.',
      seriesConnectionResonance: 'Sets up Francisco\'s role as coordinator of cosmic forces in later books; introduces faction politics that will dominate Books 3-6.',
      sceneCardProgression: 126,
      realWorldContext: 'Renaissance-era political councils, international summits requiring diplomatic finesse, the challenge of building coalitions from competing interests.',
      timelineSignificance: 'First attempt at unified timeline governance, marking shift from competitive faction dynamics to collaborative stewardship.',
      saveTheCatBeat: truncate('Break into Two - entering the new world of unified action', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'deliberate',
        narrative_mode: 'political_drama',
      }),
      learning_objectives: JSON.stringify([
        'Understanding coalition-building across diverse stakeholder groups',
        'Recognizing that sustainable leadership requires earned trust not imposed authority',
        'Navigating political tensions while maintaining focus on shared purpose',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Faction tensions that will resurface under pressure',
        'The need for vulnerability in leadership',
        'Timeline instability patterns hinting at orchestration',
      ]),
    },
    {
      pages: 'Page 185 - 188',
      description: 'Francisco and his allies work through the night at the Temporal Command Center, preparing a presentation on timeline stewardship that speaks to each faction\'s core values, culminating in the factions\' cautious agreement to trial unified coordination.',
      focus: 'Francisco presents a compelling framework for timeline stewardship that achieves the first fragile commitment to unified action.',
      chapterSceneFocus: 'Ch53S2: Francisco presents his vision for timeline stewardship, crafting language that honors each faction\'s values while asking them to accept collective responsibility, achieving cautious agreement to trial unified coordination.',
      preliminarySceneFocus: 'Shared vision of stewardship presented',
      preliminarySceneDescription: 'Francisco presents framework for unified timeline stewardship to Unity Council',
      narrativeFunction: 'Demonstrates Francisco\'s strategic and diplomatic skills while establishing the theoretical framework for unified timeline governance.',
      sensoryDetail: 'Temporal Command Center monitoring displays showing timeline anomalies, allies working through night, holographic presentations speaking to each faction\'s values, dawn breaking as council reconvenes.',
      internalConflict: 'Francisco\'s tension between comprehensive preparation and the uncertainty of whether his vision will be compelling enough to unite powerful groups.',
      characterGrowthElement: 'Francisco demonstrates Empress principle by creating systems that nurture timeline health rather than exploit resources.',
      seriesConnectionResonance: 'Establishes the stewardship philosophy that will guide Francisco\'s cosmic guardianship role in Books 7-9.',
      sceneCardProgression: 127,
      realWorldContext: 'Strategic planning sessions, crafting messages for diverse audiences, the challenge of asking powerful entities to voluntarily limit their own power for collective good.',
      timelineSignificance: 'First formal agreement on unified timeline coordination, marking theoretical shift from competition to collaboration.',
      saveTheCatBeat: truncate('Break into Two - commitment to new rules of engagement', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'building',
        narrative_mode: 'strategic_planning',
      }),
      learning_objectives: JSON.stringify([
        'Crafting inclusive frameworks that honor diverse values',
        'Understanding stewardship as nurturing growth vs. imposing control',
        'Building consensus through respect rather than coercion',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Monitoring systems detecting ominous patterns',
        'Fragility of the agreement under pressure',
        'The question of what threatens all factions equally',
      ]),
    },
    {
      pages: 'Page 188 - 192',
      description: 'Francisco discovers that timeline instability has been deliberately orchestrated by Dagon, an ancient entity who has been manipulating all factions to feed his power, transforming the Unity Council\'s purpose from managing conflicts to facing existential threat.',
      focus: 'Revelation of Dagon as the true antagonist who has been orchestrating timeline chaos to manipulate all factions.',
      chapterSceneFocus: 'Ch53S3: Francisco discovers Dagon has been orchestrating all timeline chaos, manipulating faction conflicts to mask his reality-reshaping agenda, forcing the Unity Council to recognize they face an existential threat that has been playing them against each other.',
      preliminarySceneFocus: 'Dagon revealed as orchestrator of chaos',
      preliminarySceneDescription: 'Francisco discovers Dagon\'s manipulation behind timeline instability',
      narrativeFunction: 'Major revelation that reframes the entire conflict, raises stakes permanently, and cements the necessity of unified action against common enemy.',
      sensoryDetail: 'Temporal analysis displays revealing patterns, Trionfi cards surfacing Dagon\'s name, Byzantine general\'s recognition, timeline data streams showing manipulation extending back generations, growing horror in Unity Council Hall.',
      internalConflict: 'Francisco\'s horror at realizing every intervention, including his own, may have been feeding Dagon\'s agenda.',
      characterGrowthElement: 'Francisco confronts the shadow of the Empress—the force that prevents integration by keeping elements in perpetual conflict.',
      seriesConnectionResonance: 'Introduces Dagon as the primary antagonist for Books 3-6; establishes the cosmic manipulation theme that dominates the series.',
      sceneCardProgression: 128,
      realWorldContext: 'Conspiracy revelations, discovering hidden puppet masters, the moment when conflicts reveal themselves as orchestrated by external force.',
      timelineSignificance: 'Reveals that timeline history has been shaped by Dagon\'s manipulation, recontextualizing all previous faction conflicts.',
      saveTheCatBeat: truncate('Break into Two - revelation of true stakes and real enemy', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'accelerating',
        narrative_mode: 'dark_revelation',
      }),
      learning_objectives: JSON.stringify([
        'Recognizing manipulation patterns in seemingly natural conflicts',
        'Understanding how antagonists benefit from keeping allies divided',
        'The moment when hidden stakes become visible and undeniable',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon\'s full capabilities remain unknown',
        'The larger confrontation that must come',
        'How deep Dagon\'s influence extends',
      ]),
    },
    {
      pages: 'Page 192 - 195',
      description: 'The Unity Council executes its first coordinated timeline stabilization operation against Dagon\'s attack, successfully sealing reality breaches through synchronized faction collaboration, cementing Francisco\'s leadership and completing the threshold crossing into unified action.',
      focus: 'First successful coordinated timeline operation proving that unified stewardship can achieve what competitive individualism cannot.',
      chapterSceneFocus: 'Ch53S4: The Unity Council executes its first coordinated response to simultaneous reality breaches, with Francisco orchestrating faction capabilities in synchronized harmony, successfully proving that unified stewardship works and cementing their threshold crossing into collective responsibility.',
      preliminarySceneFocus: 'Threshold crossed through unified action',
      preliminarySceneDescription: 'Unity Council successfully coordinates first timeline stabilization operation',
      narrativeFunction: 'Completes the Break into Two by transforming theoretical unity into proven partnership through successful crisis response.',
      sensoryDetail: 'Temporal Command Center coordinating multiple breach sites, Alexandrian calculations, Byzantine stabilization forces, Medici resources, Temporal Monks\' meditation, Francisco orchestrating through Trionfi cards, reality sealing, celebration of success.',
      internalConflict: 'Francisco\'s recognition that success brings permanent responsibility—the factions cannot return to isolation after tasting collaborative victory.',
      characterGrowthElement: 'Francisco embodies full Empress principle by nurturing faction collaboration that creates abundance (successful stabilization) none could achieve alone.',
      seriesConnectionResonance: 'Establishes the unified action pattern that will be crucial in later cosmic battles; proves Francisco\'s leadership model works.',
      sceneCardProgression: 129,
      realWorldContext: 'Crisis response coordination, successful coalition operations, the moment when theoretical partnerships prove themselves in action.',
      timelineSignificance: 'First coordinated timeline operation in history, establishing new paradigm of collective stewardship over competitive exploitation.',
      saveTheCatBeat: truncate('Break into Two - complete entry into upside-down world', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'climactic',
        narrative_mode: 'action_triumph',
      }),
      learning_objectives: JSON.stringify([
        'Witnessing how coordination amplifies individual capabilities',
        'Understanding leadership as orchestration rather than command',
        'Recognizing that success creates permanent transformation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Preparation for larger confrontation with Dagon',
        'Permanent alliance pledges and their implications',
        'The upside-down world they have fully entered',
      ]),
    },
  ];

  // Process each scene
  for (let i = 0; i < sceneData.length; i++) {
    const scene = sceneData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${scene.scene_number}: ${scene.scene_title}`);

    // Insert base scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: chapter.id,
        chapterUniqueIdentifier: 'EA-053',
        sceneNumber: scene.scene_number,
        title: scene.scene_title,
        setup: scene.setup,
        symbolism: scene.symbolism,
        beatGoal: scene.beat_goal,
        pov: scene.pov,
        tense: scene.tense,
        core_emotion: scene.core_emotion,
        scene_tone: scene.scene_tone,
        timeline_date: scene.timeline_date,
        timeline_variant: scene.timeline_variant,
        location: scene.location,
      })
      .returning();

    console.log(`   ✅ Inserted scene with ID: ${insertedScene.id}`);

    // Update with enhanced narrative fields
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
        saveTheCatBeat: enhancement.saveTheCatBeat,
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all scenes have complete data
  console.log('\n\n🔍 Verifying field completion...\n');

  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = Object.keys(scene);
    const populatedFields = fields.filter(key => {
      const value = scene[key as keyof typeof scene];
      return value !== null && value !== undefined;
    });

    const requiredFields = 31; // Total expected fields per scene
    const presentCount = populatedFields.length;
    const missingCount = requiredFields - presentCount;

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentCount}/${requiredFields}`);
    if (missingCount > 0) {
      console.log(`   ❌ Missing: ${missingCount}/${requiredFields}`);
    }
  }

  console.log(`\n✅ EA-053 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
