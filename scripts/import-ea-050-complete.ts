import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-050: Instability (Book 2, Chapter 10)...\n');

  // Get chapter EA-050
  const [ch50] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-050'))
    .limit(1);

  if (!ch50) {
    console.error('❌ EA-050 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch50.title} (ID: ${ch50.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Factions Converge',
      setup: 'The Zanetti Train arrives at a faction meeting ground—a vast hall where architecture constantly shifts between Byzantine grandeur, Alexandrian geometry, and Medici opulence as temporal distortions pulse through the walls. Representatives from every major timeline faction surround Francisco, each demanding he join their cause: the Medici offer wealth and influence, the Alexandrians promise knowledge and protection, the Byzantines guarantee military might, and smaller factions whisper desperate pleas. Francisco wants to stay independent, to complete his mission without becoming anyone\'s pawn; the factions want his Trionfi card mastery and his connection to timeline convergence points, each insisting neutrality is impossible. Opposition intensifies from all sides: the factions\' escalating pressure (threats mixed with promises), the hall\'s architecture reflecting their competing realities and making it hard to think clearly, and Francisco\'s own temptation—each offer genuinely addresses real needs. But as the pressure mounts and the hall\'s instability mirrors the chaos in Francisco\'s mind, La Signora appears at the hall\'s center, unmoved by the shifting reality: "Watch how they try to control the instability. Now watch what happens when you embrace it instead." The scene lands on Francisco\'s realization that the factions fear the chaos he could learn to navigate.',
      symbolism: 'The Five of Cups embodies the chapter\'s instability theme: multiple offerings (cups) presented amid chaos, with the challenge being to choose without grasping for false stability. The constantly shifting architecture represents the futility of seeking solid ground in timeline politics—adaptation matters more than allegiance.',
      beat_goal: 'Francisco encounters the major timeline factions all pressuring him to join their causes, establishing the stakes of remaining independent and introducing La Signora\'s teaching that instability itself can be a source of power rather than something to be controlled.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Pressure and overwhelm',
      scene_tone: 'Chaotic and intense',
      timeline_date: 'Post-Book 1 + 5 weeks',
      timeline_variant: 'Faction Meeting Ground (Multiple Timelines Overlapping)',
      location: 'Faction Meeting Ground - Central Hall',
    },
    {
      scene_number: 2,
      scene_title: 'Dancing in the Flux',
      setup: 'La Signora leads Francisco out of the faction hall into an unstable timeline—a reality where the ground shifts between cobblestone, marble, dirt, and void from step to step, where buildings appear and vanish mid-breath, and where the laws of physics negotiate moment by moment. Francisco wants stable footing, a reliable path forward; La Signora wants him to stop fighting the instability and move with it instead. Opposition mounts through the environment\'s hostility (each step risks falling into temporal void), Francisco\'s ingrained habit of seeking control (trying to predict and prevent each shift), and his fear that embracing chaos means losing himself entirely. But as La Signora demonstrates—walking through the flux as if dancing, letting each shift inform her next movement rather than resisting it—Francisco attempts to follow. His first steps are clumsy, fighting the changes, but gradually something shifts: when he stops trying to impose order and instead reads the rhythm of the instability, his Trionfi cards begin to pulse in sync with the temporal fluctuations. "The factions pour their cups into forms, desperate to hold shape," La Signora teaches. "But you can be like water—adapting to every vessel while remaining yourself." The scene lands on Francisco\'s first successful navigation of pure instability.',
      symbolism: 'The unstable timeline embodies the Five of Cups\' adaptation lesson: loss of stable ground forces discovery of fluid strength. La Signora dancing through chaos represents mastery—not controlling instability but finding creative power within it, like water that gains strength by adapting to every container.',
      beat_goal: 'Francisco learns to embrace timeline instability as a source of creative power through La Signora\'s teaching, discovering that navigating chaos requires fluid adaptation rather than rigid control, fundamentally shifting his relationship with temporal magic from domination to partnership.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Fear transforming to exhilaration',
      scene_tone: 'Dynamic and revelatory',
      timeline_date: 'Post-Book 1 + 5 weeks (same day)',
      timeline_variant: 'Unstable Timeline (Constant Flux)',
      location: 'Unstable Timeline Region - Shifting Landscape',
    },
    {
      scene_number: 3,
      scene_title: 'The Pressure Test',
      setup: 'Back at the faction meeting ground, the timeline groups reconvene with Francisco, but this time he\'s different—moving with the hall\'s shifts rather than resisting them, staying centered while architecture warps around him. The Medici representative escalates to direct threats: join us or face economic ruin across all timelines where your family exists. Francisco wants to maintain independence while keeping his family safe; the factions want to break his resolve through fear. Opposition intensifies through the Medici\'s very real threats (they have the power to follow through), the other factions joining in with their own ultimatums (creating a coordinated assault), and Francisco\'s legitimate terror for his family\'s safety across multiple realities. But as the pressure peaks and the hall\'s instability surges in response to the tension, Francisco discovers something: while the factions try to control the chaos to intimidate him, he can read its rhythms and move through their threatening formations like water through cracks. He positions himself at a convergence point where three timeline distortions meet, a place of such instability that none of the factions can maintain solid footing. "This is my answer," Francisco announces, standing calm in chaos while they struggle for balance. "I\'ll walk the unstable paths none of you dare navigate." The scene lands on Francisco claiming his independence through mastery of instability.',
      symbolism: 'The convergence point where Francisco stands represents the Five of Cups\' core power: finding strength precisely where others see only loss and chaos. While the factions clutch their cups (stable realities) and fear spilling them, Francisco demonstrates the freedom that comes from releasing the need for solid ground.',
      beat_goal: 'Francisco turns the factions\' coordinated pressure against them by demonstrating his newfound ability to thrive in timeline instability they fear, claiming independence by mastering the chaotic spaces they cannot control and establishing himself as a player who operates by different rules.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Defiance and empowerment',
      scene_tone: 'Tense and triumphant',
      timeline_date: 'Post-Book 1 + 5 weeks (evening)',
      timeline_variant: 'Faction Meeting Ground (Critical Instability)',
      location: 'Faction Meeting Ground - Convergence Point',
    },
    {
      scene_number: 4,
      scene_title: 'Allies in Chaos',
      setup: 'As Francisco departs the faction meeting ground, refusing all formal alliances, he discovers unexpected support: several individuals from different factions—a young Medici scholar tired of her family\'s control schemes, an Alexandrian rebel questioning preservation dogma, a Byzantine soldier disillusioned with erasure tactics—approach him quietly. They want to learn what he learned from La Signora, to find freedom in the unstable spaces between faction lines; Francisco wants to understand if accepting these individuals as informal allies compromises his independence. Opposition emerges from the faction leaders\' furious surveillance (accepting these rebels means making enemies), the individuals\' own mixed motivations (some genuinely seek freedom, others might be spies), and Francisco\'s fear of responsibility—if he teaches them and they\'re hurt, is he complicit? But as they gather in an unstable zone where faction authority cannot reach, Francisco realizes this is different from faction allegiance: these are fellow travelers choosing the fluid path over rigid structure, finding strength in adaptation rather than control. La Signora appears briefly, approving: "The Five of Cups shows spilled vessels, but look—there are still cups standing. These are yours to fill, not with faction loyalty, but with shared purpose born from chaos." The scene lands on Francisco building a loose network of chaos-navigators, allies bound by adaptability rather than authority.',
      symbolism: 'The informal alliance represents the Five of Cups\' hidden gift: what appears as loss (no formal faction backing) reveals itself as gain (freedom to build genuine connections). The rebels leaving their factions to join Francisco in unstable spaces embody choosing fluid strength over rigid security—the chapter\'s core theme of bending without breaking.',
      beat_goal: 'Francisco builds an informal network of faction rebels who choose adaptability over allegiance, establishing allies bound by shared embrace of instability rather than rigid authority, setting up his unique position as a leader who navigates chaos while the factions cling to crumbling structures.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Hope and connection',
      scene_tone: 'Hopeful and conspiratorial',
      timeline_date: 'Post-Book 1 + 5 weeks (night)',
      timeline_variant: 'Unstable Zone (Between Faction Territories)',
      location: 'Neutral Unstable Zone - Beyond Faction Reach',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Factions Converge
      pages: 'Page 136 - 139',
      description: 'Francisco encounters major timeline factions pressuring him to join their causes, establishing stakes of independence and learning that instability itself can be power rather than weakness.',
      focus: 'Francisco faces mounting faction pressure while discovering that embracing instability offers more power than seeking false stability',
      chapterSceneFocus: 'Ch50S1: Francisco encounters major factions demanding allegiance, experiences escalating pressure amid shifting architecture, realizes factions fear the chaos he could navigate',
      preliminarySceneFocus: 'Experiencing mounting demands requiring adaptation',
      preliminarySceneDescription: 'Faction meeting ground with constantly shifting architecture demonstrates futility of seeking solid ground in timeline politics—adaptation matters more than allegiance',
      narrativeFunction: 'Establishes faction politics pressure and introduces La Signora\'s teaching that instability is source of power not limitation',
      sensoryDetail: 'Architecture constantly shifting between Byzantine grandeur, Alexandrian geometry, and Medici opulence, temporal distortions pulsing through walls, competing faction representatives surrounding Francisco',
      internalConflict: 'Francisco torn between temptation of faction offers addressing real needs versus desire for independence, seeking stability versus learning to embrace chaos',
      characterGrowthElement: 'Francisco begins shifting from viewing instability as problem to recognizing it as potential source of power',
      seriesConnectionResonance: 'Adaptability theme becomes essential for Book 9 reality-reshaping events requiring comfort with uncertainty',
      sceneCardProgression: 118,
      realWorldContext: 'Five weeks post-monastery, faction meeting ground where temporal distortions make thinking clearly difficult',
      timelineSignificance: 'Multiple timelines overlapping as factions from different realities converge',
      saveTheCatBeat: 'Fun and Games - exploring faction politics and pressure',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium intense - building pressure through escalation',
        tension_level: 'High - multiple factions pressuring simultaneously',
        emotional_arc: 'Overwhelm → Pressure → Temptation → Realization',
      }),
      learning_objectives: JSON.stringify([
        'Recognize that seeking stability in chaos is futile—adaptation matters more',
        'Understand that instability can be source of power when embraced',
        'Develop ability to stay centered amid multiple competing demands',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Faction politics crucial for series climax navigation',
        'Instability mastery essential for Book 9 reality reshaping',
        'Independence through chaos navigation (Francisco\'s unique approach)',
      ]),
    },
    {
      // Scene 2: Dancing in the Flux
      pages: 'Page 140 - 143',
      description: 'La Signora teaches Francisco to embrace timeline instability through dancing in constant flux, discovering that navigating chaos requires fluid adaptation and partnership with temporal magic rather than domination.',
      focus: 'Francisco learns to navigate pure timeline instability by moving with chaos rather than fighting it, fundamentally shifting his magic relationship',
      chapterSceneFocus: 'Ch50S2: Francisco learns to embrace instability as creative power through La Signora\'s teaching, discovers navigating chaos requires fluid adaptation not rigid control, shifts from domination to partnership with temporal magic',
      preliminarySceneFocus: 'Learning to move with chaos as source of strength',
      preliminarySceneDescription: 'Unstable timeline where ground shifts constantly forces Francisco to discover fluid strength through adaptation, like water gaining power by conforming to every container',
      narrativeFunction: 'Establishes Francisco\'s new approach to temporal magic—embracing uncertainty rather than controlling it, creating foundation for series mastery',
      sensoryDetail: 'Ground shifting between cobblestone, marble, dirt, and void, buildings appearing and vanishing mid-breath, laws of physics negotiating moment by moment, La Signora dancing through flux',
      internalConflict: 'Francisco\'s ingrained control-seeking versus learning to flow, fear of losing self in chaos versus discovery of strength through adaptation',
      characterGrowthElement: 'Francisco achieves breakthrough understanding that mastery comes from partnership with instability not domination of it',
      seriesConnectionResonance: 'Fluid adaptation approach becomes Francisco\'s defining magical style enabling unique solutions in later crisis moments',
      sceneCardProgression: 119,
      realWorldContext: 'Unstable timeline region where reality negotiates constantly, requiring moment-by-moment adaptation',
      timelineSignificance: 'Constant flux where no moment remains stable, perfect training ground for adaptability',
      saveTheCatBeat: 'Fun and Games - discovering creative power in uncertainty',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-fast dynamic - movement and discovery',
        tension_level: 'Moderate rising - fear transforming to exhilaration',
        emotional_arc: 'Fear → Struggle → Shift → Exhilaration',
      }),
      learning_objectives: JSON.stringify([
        'Develop fluid adaptation by reading rhythm of instability',
        'Transform relationship with temporal magic from control to partnership',
        'Discover that embracing uncertainty unlocks creative power',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Trionfi cards syncing with temporal fluctuations (evolved relationship)',
        'Water metaphor (adaptability while remaining self)',
        'Partnership with chaos (crucial for Book 9)',
      ]),
    },
    {
      // Scene 3: The Pressure Test
      pages: 'Page 144 - 147',
      description: 'Francisco demonstrates newfound instability mastery by standing firm at convergence point while factions struggle, claiming independence by navigating chaotic spaces they fear and establishing himself as different kind of player.',
      focus: 'Francisco claims independence by demonstrating mastery of timeline instability that factions fear, operating by different rules',
      chapterSceneFocus: 'Ch50S3: Francisco turns faction pressure against them by thriving in instability they fear, claims independence by mastering chaotic convergence point, establishes himself as player operating by different rules',
      preliminarySceneFocus: 'Demonstrating mastery by embracing what others fear',
      preliminarySceneDescription: 'Francisco standing calm at convergence point while factions struggle demonstrates Five of Cups core power—finding strength where others see only loss and chaos',
      narrativeFunction: 'Establishes Francisco\'s independence through demonstrated mastery, showing that his unique approach gives him leverage against traditional faction power',
      sensoryDetail: 'Architecture warping violently as Francisco moves with shifts, three timeline distortions meeting at convergence point, factions struggling for balance while Francisco stands calm',
      internalConflict: 'Francisco\'s terror for family safety versus trust in his newfound mastery, legitimate fear of faction power versus confidence in chaos navigation',
      characterGrowthElement: 'Francisco claims his independence through demonstrated competence, showing rather than arguing his right to walk alone',
      seriesConnectionResonance: 'Francisco\'s ability to operate in spaces factions cannot becomes crucial leverage for navigating series politics leading to Book 9',
      sceneCardProgression: 120,
      realWorldContext: 'Evening at faction meeting ground with instability surging in response to tension',
      timelineSignificance: 'Critical instability at convergence point creating space no faction can control',
      saveTheCatBeat: 'Fun and Games - claiming independence through mastery demonstration',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-fast tense - pressure building to triumphant resolution',
        tension_level: 'Extreme then releasing - threats peak then break',
        emotional_arc: 'Terror → Pressure → Discovery → Defiance',
      }),
      learning_objectives: JSON.stringify([
        'Demonstrate mastery by staying centered in chaos others fear',
        'Claim independence through competence not argument',
        'Recognize that unique approach provides leverage against traditional power',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco operating in spaces factions cannot (series-long advantage)',
        'Independence through demonstrated mastery (leadership style)',
        'Walking unstable paths (Book 9 unique solution approach)',
      ]),
    },
    {
      // Scene 4: Allies in Chaos
      pages: 'Page 148 - 150',
      description: 'Francisco builds informal network of faction rebels choosing adaptability over allegiance, establishing allies bound by shared chaos embrace rather than rigid authority, setting up unique leadership position.',
      focus: 'Francisco establishes informal alliance network bound by shared adaptability, creating unique position as chaos-navigator leader',
      chapterSceneFocus: 'Ch50S4: Francisco builds informal network of faction rebels choosing adaptability over allegiance, establishes allies bound by shared instability embrace not rigid authority, creates unique leadership position navigating chaos',
      preliminarySceneFocus: 'Building genuine connections through shared purpose in chaos',
      preliminarySceneDescription: 'Informal alliance represents Five of Cups hidden gift—apparent loss (no formal faction backing) reveals as gain (freedom for genuine connections born from chaos navigation)',
      narrativeFunction: 'Resolves chapter arc by establishing Francisco\'s unique alliance structure based on adaptability, setting up his unconventional leadership approach for series',
      sensoryDetail: 'Unstable zone beyond faction reach, rebels from different factions gathering quietly, La Signora appearing briefly with approval, shared purpose forming in chaotic space',
      internalConflict: 'Francisco\'s fear of responsibility for teaching others versus recognition of genuine shared purpose, worry about spies versus trust in chaos-seekers',
      characterGrowthElement: 'Francisco integrates understanding that building alliances based on shared values differs from faction allegiance, establishing his leadership style',
      seriesConnectionResonance: 'Informal chaos-navigator network becomes Francisco\'s power base enabling unique approaches to series challenges and Book 9 climax',
      sceneCardProgression: 121,
      realWorldContext: 'Night in neutral unstable zone where faction authority cannot reach, perfect space for informal alliance',
      timelineSignificance: 'Unstable zone between faction territories creating safe space for rebels',
      saveTheCatBeat: 'Fun and Games conclusion - establishing unique alliance structure',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium hopeful - building connection and purpose',
        tension_level: 'Moderate - surveillance risk versus shared hope',
        emotional_arc: 'Wariness → Recognition → Hope → Connection',
      }),
      learning_objectives: JSON.stringify([
        'Build alliances based on shared values not hierarchical allegiance',
        'Recognize that apparent loss can reveal hidden gain',
        'Develop leadership style embracing chaos rather than imposing order',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Informal chaos-navigator network (Francisco\'s power base through series)',
        'Unconventional leadership approach (crucial for Book 9)',
        'Shared purpose born from chaos (series alliance theme)',
      ]),
    },
  ];

  // Insert or update each scene
  for (let i = 0; i < scenesData.length; i++) {
    const sceneData = scenesData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);

    // Insert basic scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch50.id,
        chapterUniqueIdentifier: 'EA-050',
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.setup,
        symbolism: sceneData.symbolism,
        beatGoal: sceneData.beat_goal,
        pov: sceneData.pov,
        tense: sceneData.tense,
        core_emotion: truncate(sceneData.core_emotion, 255),
        scene_tone: truncate(sceneData.scene_tone, 255),
        timeline_date: sceneData.timeline_date,
        timeline_variant: sceneData.timeline_variant,
        location: sceneData.location,
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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 100),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all fields are populated
  console.log('\n\n🔍 Verifying field completion...\n');

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch50.id));

  const allFields = [
    'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
    'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
    'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
    'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
    'learning_objectives', 'foreshadowing_elements', 'sceneNumber', 'title', 'setup',
    'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_date',
    'timeline_variant', 'location', 'chapterUniqueIdentifier',
  ];

  for (const scene of chapterScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))) {
    const missingFields: string[] = [];
    const presentFields: string[] = [];

    for (const field of allFields) {
      const value = scene[field as keyof typeof scene];
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentFields.length}/${allFields.length}`);
    console.log(`   ❌ Missing: ${missingFields.length}/${allFields.length}`);

    if (missingFields.length > 0) {
      console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }
  }

  console.log('\n✅ EA-050 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
