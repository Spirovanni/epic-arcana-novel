import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-088: Judgement (Book 3, Chapter 8)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-088'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-088 not found. Run create-ea-088-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Ambush',
      setup: 'The Inn at the Crossroads. Francisco enters, looking for rest. The door locks. The patrons vanish. Eight figures in grey robes stand up. Swords drawn (some literal, some magical). \'Francisco Petrarch, you are detained.\'',
      symbolism: 'The Eight of Swords (Surrounded). The Trap.',
      beat_goal: 'The Capture. Establish the threat level.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Alarm',
      scene_tone: 'Suspense',
      timeline_date: '6/3/1321 - Night',
      timeline_variant: 'The Inn',
      location: 'Common Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Indictment',
      setup: 'He is seated in the center. Blindfolded. Inquisitor Gallego lists the timeline deviations he caused. \'You are a chaos agent.\' They want him to sign a confession/contract. He feels the weight of their judgment.',
      symbolism: 'The Blindfold. Justice vs Law.',
      beat_goal: 'The Accusation. The stakes are set (servitude).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Doubt',
      scene_tone: 'Oppressive',
      timeline_date: '6/3/1321 - Night (Cont.)',
      timeline_variant: 'The Inn',
      location: 'The Circle',
    },
    {
      scene_number: 3,
      scene_title: 'The Whisper',
      setup: 'A Dagon agent (disguised as a guard) whispers to him. \'We can break the circle. Just say the word.\' It\'s a temptation. But Francisco discerns the trap within the trap. He refuses. He realizes the Swords aren\'t touching him; they are waiting for him to move.',
      symbolism: 'The Devil on the Shoulder. Discernment.',
      beat_goal: 'The Realization. The prison is voluntary.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Insight',
      scene_tone: 'Internal',
      timeline_date: '6/3/1321 - Night (Cont.)',
      timeline_variant: 'The Inn',
      location: 'The Circle',
    },
    {
      scene_number: 4,
      scene_title: 'The Verdict',
      setup: 'Francisco stands up. \'I am not your prisoner. I am the only one holding the timeline together.\' He removes the blindfold. The Inquisitor hesitates. Francisco cites an obscure Canon Law (bluffing slightly). He walks through the gap between the swords. They let him pass.',
      symbolism: 'The Walkout. Intellectual Dominance.',
      beat_goal: 'The Escape. Leaving on his own terms.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Confidence',
      scene_tone: 'Vindicated',
      timeline_date: '6/3/1321 - Dawn',
      timeline_variant: 'The Road',
      location: 'Outside the Inn',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 106 - 110',
      description: 'Crossroads Inn entering rest-seeking—door locking patrons vanishing—eight grey-robed figures standing swords drawing literal magical—Francisco-Petrarch detained as Eight Swords Surrounded Trap captures threat-establishes alarm suspense Thinking-Fast-Slow threat-assessing Pinch-Point EA-087-flare alerted Vatican-Swords encircling diplomatic-bind.',
      focus: 'Capture establishing threat through Eight Swords ambush.',
      chapterSceneFocus: 'Ch88S1: Crossroads Inn entering rest door locking patrons vanish eight grey-robed standing swords literal magical Francisco-Petrarch detained as Eight Swords Surrounded Trap captures threat-establishes alarm suspense Thinking-Fast threat-assesses Pinch alerted Vatican encircles bind.',
      preliminarySceneFocus: 'Eight Swords Surrounded alarm suspense',
      preliminarySceneDescription: 'Ambush captures threat establishing Trap surrounded',
      narrativeFunction: 'Establishes Eight of Swords capture; demonstrates consequence from EA-087 temporal flare; introduces Inquisitor Gallego antagonist; creates Pinch Point escalation.',
      sensoryDetail: 'Crossroads Inn entering, rest seeking, door locking, patrons vanishing, eight figures standing, grey robes, swords drawing, literal and magical, Francisco Petrarch detained declaration, surrounded feeling, trap springing.',
      internalConflict: 'Francisco experiencing alarm—surrounded by Eight Swords after temporal flare alerting Vatican, trapped in diplomatic bind recognizing consequences, assessing threat level quickly.',
      characterGrowthElement: 'Francisco entering Eight of Swords trial—consequences from EA-087 actions catching up, Vatican agents capturing diplomatically, Thinking Fast and Slow threat assessment activating under alarm.',
      seriesConnectionResonance: 'Great Trial Book 9 foreshadowing; Vatican Swords antagonist faction establishing; diplomatic neutral ground introducing; Canon Law temporal magic system revealing; consequences action demonstrating.',
      sceneCardProgression: 266,
      realWorldContext: 'Thinking Fast and Slow threat assessment, consequences facing, diplomatic capture.',
      timelineSignificance: '6/3/1321 night—day after EA-087 temporal flare, Francisco entering Crossroads Inn ambushed by Vatican Swords, Eight of Swords surrounded consequence beginning.',
      saveTheCatBeat: truncate('Consequence - captured by Vatican Swords', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'suspenseful_ambush',
        narrative_mode: 'alarmed_surrounded',
      }),
      learning_objectives: JSON.stringify([
        'Thinking Fast and Slow threat assessment practice',
        'Consequences action recognition',
        'Eight of Swords surrounded symbolism understanding',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Blindfold placement',
        'Timeline deviations listing',
        'Confession contract offering',
      ]),
    },
    {
      pages: 'Page 110 - 114',
      description: 'Center seated blindfolded—Inquisitor-Gallego timeline-deviations listing caused chaos-agent—confession contract signing wanting judgment-weight feeling as Blindfold Justice-Law accusation stakes-servitude oppressive doubt beeswax-candles smelling scribe-pen scratching temples-pressure psychological-low Canon-Law temporal-magic legal-system.',
      focus: 'Accusation setting stakes through blindfold judgment.',
      chapterSceneFocus: 'Ch88S2: Center seated blindfolded Inquisitor-Gallego timeline-deviations listing chaos-agent confession contract signing judgment-weight as Blindfold Justice-Law accusation stakes-servitude oppressive doubt beeswax-candles scribe-pen scratching temples-pressure psychological Canon-Law temporal legal.',
      preliminarySceneFocus: 'Blindfold Justice-Law oppressive doubt',
      preliminarySceneDescription: 'Indictment accuses stakes servitude judging oppressively',
      narrativeFunction: 'Demonstrates Canon Law temporal magic legal system; shows Inquisitor Gallego legalist character; creates psychological low point; establishes servitude stakes through confession contract.',
      sensoryDetail: 'Center seated, blindfolded, Inquisitor Gallego presence, timeline deviations listing, chaos agent accusation, confession contract, signing pressure, judgment weight, beeswax candles smell, scribe pen scratching, temples pressure, oppressive atmosphere.',
      internalConflict: 'Francisco experiencing doubt—blindfolded under judgment weight, timeline deviations listed publicly, chaos agent accused, servitude contract threatening, psychological pressure mounting.',
      characterGrowthElement: 'Francisco experiencing Eight of Swords oppression—blindfolded and surrounded by accusations, Canon Law temporal magic system constraining, psychological low point through judgment weight, doubt creeping under pressure.',
      seriesConnectionResonance: 'Canon Law temporal magic establishing universe rules; Inquisitor Gallego legalist antagonist defining; confession contract servitude stakes raising; psychological warfare demonstrating; Great Trial Book 9 foreshadowing mechanics.',
      sceneCardProgression: 267,
      realWorldContext: 'Canon Law legal systems, psychological pressure, judgment weight impact.',
      timelineSignificance: '6/3/1321 night continuing—Francisco blindfolded and judged, Inquisitor Gallego listing timeline deviations, servitude stakes established through confession contract pressure.',
      saveTheCatBeat: truncate('Consequence - judged accused servitude threatened', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'oppressive_accusation',
        narrative_mode: 'doubtful_pressured',
      }),
      learning_objectives: JSON.stringify([
        'Canon Law legal system understanding',
        'Psychological pressure resistance',
        'Judgment weight impact recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon agent whisper',
        'Trap within trap',
        'Voluntary prison realization',
      ]),
    },
    {
      pages: 'Page 114 - 117',
      description: 'Dagon-agent guard-disguised whispering circle-breaking word-saying—temptation trap-within-trap discerning refusing—Swords not-touching waiting-for-move realizing as Devil-Shoulder Discernment realization prison-voluntary insight internal Decisive widening-options twist mental-prison recognizing intellectual-agency discovering.',
      focus: 'Realization recognizing voluntary prison through discernment.',
      chapterSceneFocus: 'Ch88S3: Dagon-agent guard-disguised whispering circle-breaking word-saying temptation trap-within-trap discerning refusing Swords not-touching waiting-move realizing as Devil-Shoulder Discernment realization prison-voluntary insight internal Decisive widening-options twist mental-prison intellectual-agency.',
      preliminarySceneFocus: 'Devil-Shoulder Discernment insight internal',
      preliminarySceneDescription: 'Whisper tempts trap-within discerning voluntary realizing',
      narrativeFunction: 'Demonstrates Decisive widening options practice; shows trap within trap Dagon temptation; creates intellectual insight moment; establishes voluntary prison mental trap recognition.',
      sensoryDetail: 'Dagon agent presence, guard disguise, whispering voice, circle breaking offer, word saying requirement, temptation feeling, trap within trap recognition, Swords not touching realization, waiting for move understanding, voluntary prison insight.',
      internalConflict: 'Francisco experiencing insight—Dagon agent offering escape tempting but recognizing trap within trap, discerning voluntary prison nature, realizing Swords waiting for him to move first creating legal justification.',
      characterGrowthElement: 'Francisco achieving Discernment breakthrough—refusing Dagon temptation recognizing deeper trap, applying Decisive widening options principle seeing beyond false choice, realizing Eight of Swords prison voluntary mental construct.',
      seriesConnectionResonance: 'Dagon faction temptation introducing; trap within trap complexity showing; Decisive decision framework demonstrating; intellectual agency discovering; mental prison vs physical distinction establishing.',
      sceneCardProgression: 268,
      realWorldContext: 'Decisive widening options practice, discernment cultivation, mental prison recognition.',
      timelineSignificance: '6/3/1321 night continuing—Francisco experiencing Dagon temptation whisper, discerning trap within trap, realizing Eight of Swords voluntary mental prison nature through insight.',
      saveTheCatBeat: truncate('Consequence - voluntary prison realized discernment', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'internal_realization',
        narrative_mode: 'insightful_discerning',
      }),
      learning_objectives: JSON.stringify([
        'Decisive widening options mastery',
        'Discernment cultivation practice',
        'Mental prison recognition skill',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Canon Law citation bluffing',
        'Blindfold removal',
        'Walking through sword gap',
      ]),
    },
    {
      pages: 'Page 117 - 120',
      description: 'Francisco standing I-am-not-your-prisoner timeline-together holding-only—blindfold removing Inquisitor hesitating—Canon-Law obscure citing bluffing-slightly—swords-gap walking-through passing letting as Walkout Intellectual-Dominance escapes own-terms vindicated confidence Inquisitor sword-sheathing frustration Francisco cold-air breathing player-not-pawn realizing victory.',
      focus: 'Escape leaving own terms through intellectual dominance.',
      chapterSceneFocus: 'Ch88S4: Francisco standing not-prisoner timeline-together holding-only blindfold removing Inquisitor hesitating Canon-Law obscure citing bluffing swords-gap walking passing as Walkout Intellectual-Dominance escapes own-terms vindicated confidence Inquisitor sword-sheathing frustration cold-air breathing player-not-pawn victory.',
      preliminarySceneFocus: 'Walkout Intellectual-Dominance vindicated confident',
      preliminarySceneDescription: 'Verdict escapes own-terms dominating intellectually triumphant',
      narrativeFunction: 'Resolves Eight of Swords trial through intellectual dominance; demonstrates Canon Law knowledge bluffing; shows player not pawn transformation; creates vindication escape on own terms.',
      sensoryDetail: 'Francisco standing up, not your prisoner declaration, timeline together holding statement, blindfold removing, Inquisitor hesitating, Canon Law obscure citing, bluffing slightly, swords gap walking, passing through, letting pass, Inquisitor sword sheathing frustration, cold air breathing, player not pawn realization.',
      internalConflict: 'Francisco experiencing confidence—declaring autonomy refusing prisoner status, removing blindfold symbolically, citing Canon Law bluffing convincingly, walking through sword gap on own terms feeling vindicated.',
      characterGrowthElement: 'Francisco achieving Eight of Swords escape—using intellectual dominance and Canon Law knowledge to break mental prison, transforming from pawn to player through confident autonomy, leaving on own terms demonstrating agency.',
      seriesConnectionResonance: 'Player not pawn transformation establishing; Canon Law mastery demonstrating; intellectual dominance strategy showing; Eight of Swords mental prison breaking; Great Trial Book 9 preparation beginning; Vatican respect earning through law.',
      sceneCardProgression: 269,
      realWorldContext: 'Intellectual dominance strategy, Canon Law mastery, player agency claiming.',
      timelineSignificance: '6/3/1321 dawn—night into morning, Francisco escaping Eight of Swords trap through intellectual dominance, Canon Law citation breaking mental prison, walking free on own terms player transformation.',
      saveTheCatBeat: truncate('Consequence - escaped intellectually dominated', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'vindicated_escape',
        narrative_mode: 'confident_triumphant',
      }),
      learning_objectives: JSON.stringify([
        'Intellectual dominance strategy mastery',
        'Canon Law knowledge application',
        'Player agency transformation claiming',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Vatican relationship complexity',
        'Canon Law expertise continuing',
        'Player status maintaining challenges',
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
        chapterUniqueIdentifier: 'EA-088',
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

  console.log(`\n✅ EA-088 import complete!`);
  console.log(`\n⚔️ The Eight of Swords trap is broken - Francisco walks free, a player not a pawn!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
