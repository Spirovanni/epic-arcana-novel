import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-076: Ambitious Circle (Book 2, Chapter 36)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-076'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-076 not found. Run create-ea-076-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Silos',
      setup: 'Work on the Beacon is stalled. The Engineers aren\'t talking to the Mystics. Both think the other is useless. Francisco sees the \'Silo Effect\'. He interrupts the argument. \'You are trying to solve the whole problem alone. Stop.\' He forces them to swap roles for an hour. Empathy facilitates flow.',
      symbolism: 'The Babel Tower (confusion) vs. The Hive (coordination).',
      beat_goal: 'The Friction. Identifying the team failure.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustrated patience',
      scene_tone: 'Argumentative',
      timeline_date: '11/2/1320 - Morning',
      timeline_variant: 'The Work Site',
      location: 'Beacon Site',
    },
    {
      scene_number: 2,
      scene_title: 'The Network',
      setup: 'Francisco restructures the team. He creates a \'Shared Consciousness\' daily briefing. Everyone knows what everyone else is doing. The Knight of Disks approach: methodical, unglamorous, effective. The work speed triples. The Beacon rises—a mix of twisted metal and glowing runes. It is ugly but perfect.',
      symbolism: 'The Geodesic Dome (many parts, one structure). The Knight of Disks plodding forward.',
      beat_goal: 'The Solution. The team gels.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Flow',
      scene_tone: 'Harmonious',
      timeline_date: '11/4/1320 - Afternoon',
      timeline_variant: 'The Work Site',
      location: 'Beacon Site',
    },
    {
      scene_number: 3,
      scene_title: 'The Signal',
      setup: 'The moment of truth. They activate the Beacon. It draws massive power (The Energy Audit comes later). The beam shoots into the purple sky. They wait. Minutes pass. The Skeptics sneer. \'It failed.\' Then, the static clears. A pattern emerges. A voice. It is faint, but clear. \'Identify. Identify.\'',
      symbolism: 'The Lighthouse. The Thread in the dark.',
      beat_goal: 'The Climax (of the chapter). Success.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Awe',
      scene_tone: 'Tense silence',
      timeline_date: '11/6/1320 - Evening',
      timeline_variant: 'The Comms Desk',
      location: 'Base Zero',
    },
    {
      scene_number: 4,
      scene_title: 'The Contact',
      setup: 'Francisco takes the mic. He gives the code. The voice confirms. It is General [Name Redacted - Book 1 Cameo]. \'Hold fast. We have your coordinates. Rescue is inbound. ETA 12 hours.\' The camp erupts in cheers. But Francisco sees the sensors spike. The signal didn\'t just attract friends; it attracted *everything*.',
      symbolism: 'The Handshake across time. The Warning Light.',
      beat_goal: 'Resolution. Hope mixed with new danger.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Relief and dread',
      scene_tone: 'Celebratory but ominous',
      timeline_date: '11/6/1320 - Evening',
      timeline_variant: 'The Comms Desk',
      location: 'Base Zero',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 526 - 530',
      description: 'Beacon work stalled—Engineers and Mystics not talking both thinking other useless—Francisco seeing Silo Effect interrupting argument \"solving whole problem alone. Stop\"—forcing role swap for hour—empathy facilitating flow as Babel Tower confusion versus Hive coordination friction identifies team failure obstacle frustrated patiently argumentatively.',
      focus: 'Friction identifying team failure through silo breaking.',
      chapterSceneFocus: 'Ch76S1: Stalled Beacon Engineers-Mystics not talking mutual uselessness—Francisco Silo Effect interrupting \"whole problem alone Stop\"—role swap forcing empathy flow as Babel Hive friction identifies team failure argumentative frustrated patience obstacle.',
      preliminarySceneFocus: 'Babel Hive friction identifies failure',
      preliminarySceneDescription: 'Silo breaking facilitates empathy flow argumentatively',
      narrativeFunction: 'Establishes team dysfunction; demonstrates Team of Teams silo-breaking; shows leadership intervention necessity.',
      sensoryDetail: 'Beacon stalling, Engineer-Mystic silence, mutual uselessness perception, Silo Effect recognition, argument interruption, whole problem solving alone, Stop command, role swap forcing, empathy facilitation, flow enabling.',
      internalConflict: 'Francisco maintaining frustrated patience—recognizing systemic failure while trusting empathy-building intervention.',
      characterGrowthElement: 'Francisco acting as Connector—building human network recognizing Knight of Disks requires collaboration over individual heroics, breaking silos.',
      seriesConnectionResonance: 'Team of Teams silo-breaking demonstration; cross-timeline communication foundation; team dynamics unit functioning establishing.',
      sceneCardProgression: 218,
      realWorldContext: 'Silo Effect breaking, cross-functional collaboration, empathy-building.',
      timelineSignificance: '11/2/1320—Post-Crash + 3 days, team dysfunction threatening beacon construction requiring intervention.',
      saveTheCatBeat: truncate('Finale - team silos threaten rescue signal', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'argumentative_friction',
        narrative_mode: 'frustrated_patience',
      }),
      learning_objectives: JSON.stringify([
        'Team of Teams silo-breaking',
        'Cross-functional empathy building',
        'Systemic dysfunction recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Shared Consciousness briefing',
        'Network restructuring',
        'Work speed tripling',
      ]),
    },
    {
      pages: 'Page 530 - 533',
      description: 'Francisco restructuring team creating Shared Consciousness daily briefing—everyone knowing everyone doing—Knight Disks approach methodical unglamorous effective—work speed tripling—Beacon rising twisted metal glowing runes ugly but perfect as Geodesic Dome many-parts one-structure Knight plodding solution team gels harmoniously flowing build.',
      focus: 'Solution showing team gels through network methodology.',
      chapterSceneFocus: 'Ch76S2: Team restructure Shared Consciousness briefing everyone knowing—Knight Disks methodical unglamorous effective—speed tripling Beacon rising metal-runes ugly perfect as Geodesic many-to-one Knight plodding solution team flow harmonious build gels.',
      preliminarySceneFocus: 'Geodesic Knight plods harmoniously building',
      preliminarySceneDescription: 'Shared Consciousness triples methodical effectiveness flowing',
      narrativeFunction: 'Implements Team of Teams solution; demonstrates Knight of Disks methodology; achieves collaborative breakthrough.',
      sensoryDetail: 'Team restructuring, Shared Consciousness briefing, everyone knowing others, Knight Disks methodology, methodical approach, unglamorous effective, speed tripling, Beacon rising, twisted metal, glowing runes, ugly perfection, sparks rhythm flying, magic-generator hum alignment, rival handshakes.',
      internalConflict: 'Francisco experiencing flow—trusting eyes-on hands-off delegation, enabling team self-organization.',
      characterGrowthElement: 'Francisco embodying Knight of Disks Connector—creating Shared Consciousness network enabling methodical collaborative effectiveness tripling productivity.',
      seriesConnectionResonance: 'Knight of Disks hard work reliability detail; network protocols for Book 3; team unit functioning validated; industrious collaboration.',
      sceneCardProgression: 219,
      realWorldContext: 'Shared consciousness methodology, collaborative flow, network effects.',
      timelineSignificance: '11/4/1320—Post-Crash + 5 days, network restructuring tripling speed toward beacon completion.',
      saveTheCatBeat: truncate('Finale - network methodology enables breakthrough', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'harmonious_building',
        narrative_mode: 'collaborative_flow',
      }),
      learning_objectives: JSON.stringify([
        'Shared Consciousness implementation',
        'Knight of Disks methodology',
        'Collaborative flow enabling',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Beacon activation moment',
        'Signal breakthrough',
        'Cross-timeline contact',
      ]),
    },
    {
      pages: 'Page 533 - 537',
      description: 'Truth moment activating Beacon drawing massive power—beam shooting purple sky—waiting minutes Skeptics sneering \"failed\"—static clearing pattern emerging voice faint clear \"Identify. Identify.\" as Lighthouse Thread dark climax success breakthrough awe tense silence collaboration synergy results reflecting.',
      focus: 'Climax success through collaborative synergy breakthrough.',
      chapterSceneFocus: 'Ch76S3: Beacon activation massive power beam purple sky—wait minutes Skeptic sneer \"failed\"—static clearing pattern voice faint \"Identify\" as Lighthouse Thread dark climax success breakthrough collaboration synergy awe tense silence results reflecting.',
      preliminarySceneFocus: 'Lighthouse Thread breaks dark silence',
      preliminarySceneDescription: 'Collaboration synergy achieves breakthrough success awe',
      narrativeFunction: 'Delivers chapter climax; validates collaborative methodology; achieves rescue signal breakthrough.',
      sensoryDetail: 'Activation moment, Beacon drawing power, massive energy, beam shooting, purple sky, waiting minutes, Skeptic sneering, failure claim, static clearing, pattern emerging, voice faint, Identify call, clarity.',
      internalConflict: 'Francisco experiencing awe—validating collaborative trust while recognizing vulnerability of exposed signal.',
      characterGrowthElement: 'Francisco achieving Knight of Disks breakthrough—collaborative synergy creating results beyond individual capacity, Rescue from Without initiated.',
      seriesConnectionResonance: 'Collaboration synergy validation; cross-timeline communication achieved; Book 1 cameo incoming; network protocols establishing.',
      sceneCardProgression: 220,
      realWorldContext: 'Collaborative breakthrough, synergy validation, network effects.',
      timelineSignificance: '11/6/1320 evening—Post-Crash + 1 week, beacon successfully punching through dimensional static achieving contact.',
      saveTheCatBeat: truncate('Finale - collaborative signal breaks through', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'tense_silence_breakthrough',
        narrative_mode: 'awe_validation',
      }),
      learning_objectives: JSON.stringify([
        'Collaboration synergy achieving results',
        'Network breakthrough validation',
        'Collective capacity exceeding individual',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 1 General cameo',
        'Rescue coordinates confirmation',
        'Enemy signal detection',
      ]),
    },
    {
      pages: 'Page 537 - 540',
      description: 'Francisco taking mic giving code—voice confirming General Book 1 cameo \"Hold fast. Coordinates. Rescue inbound. ETA 12 hours\"—camp erupting cheers—Francisco seeing sensor spike—signal attracting friends and everything as Handshake Warning Light resolves hope-danger mixed celebratory ominous relief dread setup next chapter.',
      focus: 'Resolution mixing hope with new danger through contact.',
      chapterSceneFocus: 'Ch76S4: Francisco code-giving voice confirming General cameo \"Rescue 12 hours\"—camp cheering Francisco sensor-spike seeing—signal attracting all as Handshake Warning resolves hope-danger celebratory ominous relief-dread next setup mixing.',
      preliminarySceneFocus: 'Handshake Warning mixes hope danger',
      preliminarySceneDescription: 'Rescue confirmed but enemies attracted ominously',
      narrativeFunction: 'Resolves rescue signal; delivers Book 1 cameo payoff; introduces new threat complication; sets up final battle.',
      sensoryDetail: 'Mic taking, code giving, voice confirmation, General identity, Hold fast order, coordinates confirmation, Rescue inbound, ETA 12 hours, camp cheering eruption, sensor spike observation, signal universal attraction, Francisco table gripping white knuckles, Novella tears, red threat radar blinking.',
      internalConflict: 'Francisco experiencing relief and dread simultaneously—achieving rescue while recognizing signal\'s double-edged consequence.',
      characterGrowthElement: 'Francisco completing Knight of Disks Rescue from Without—accepting that collaborative success brings both salvation and new challenges requiring preparation.',
      seriesConnectionResonance: 'Book 1 General cameo establishing continuity; network protocols for Book 3 climax; rescue-but-battle setup; collaborative success double-edge.',
      sceneCardProgression: 221,
      realWorldContext: 'Success complications, double-edged breakthroughs, hope-danger balance.',
      timelineSignificance: '11/6/1320 evening—Rescue confirmed 12 hours but enemy forces converging, final battle setup for Book 2 climax.',
      saveTheCatBeat: truncate('Finale - rescue confirmed enemies converging', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'celebratory_ominous',
        narrative_mode: 'relief_dread_mixed',
      }),
      learning_objectives: JSON.stringify([
        'Success double-edged nature',
        'Collaborative breakthrough complications',
        'Hope-danger balance management',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Final battle next chapter',
        '12-hour countdown',
        'Enemy convergence threat',
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
        chapterUniqueIdentifier: 'EA-076',
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

    const requiredFields = 31;
    const presentCount = populatedFields.length;
    const missingCount = requiredFields - presentCount;

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentCount}/${requiredFields}`);
    if (missingCount > 0) {
      console.log(`   ❌ Missing: ${missingCount}/${requiredFields}`);
    }
  }

  console.log(`\n✅ EA-076 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
