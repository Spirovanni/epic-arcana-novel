import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-056: Adversity (Book 2, Chapter 16)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-056'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-056 not found. Run create-ea-056-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Lights Go Out',
      setup: 'Hours after the Sanctuary is stabilized, the ambient light begins to fail. The warmth sucks out of the air. Francisco rushes to the monitors: Dagon hasn\'t attacked; he has simply turned off the tap. All connections to the resource-rich timelines are severed. The Sanctuary is a closed system with dwindling entropy. Panic sets in instantly—the Medicis complain of the cold, the Alexandrians hoard data pads before the batteries die. The external enemy has become an internal crisis.',
      symbolism: 'The Five of Disks imagery: two beggared figures in the snow outside a lit church. The Sanctuary is the church, but the lights are going out. The cold represents the physical reality of \'Adversity\' stripping away the conceptual victory of \'Creativity\'.',
      beat_goal: 'Establish the siege. Move the conflict from \'Magical/Abstract\' to \'Physical/Visceral\'. Show the fragility of their new creation.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Cold fear',
      scene_tone: 'Dark and chilling',
      timeline_date: '5/18/1320 - Night',
      timeline_variant: 'The Sanctuary (Besieged)',
      location: 'Sanctuary Control Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Feast of Crumbs',
      setup: 'Days pass. Rations (both food and energy) are critical. The factions are segregating, protecting their own. Francisco sees the end: not death by Dagon, but death by civil war. He calls a general assembly in the freezing piazza. He puts his last energy crystal on the table—a personal heirloom. He asks, \'Who next?\' It\'s a gamble. He is asking them to sacrifice their personal reserves for the collective. A standoff ensues. Then, the Knight of Pentacles (patient, grounded) aspect kicks in: he waits. He doesn\'t preach; he just waits in the cold with his offering.',
      symbolism: 'The \'Stone Soup\' fable reimagined. The single crystal is the \'stone\'. The Five of Disks reversed—finding spiritual wealth in material poverty. The \'Wait\' is the core of the \'Patient Leads\' (STG 2.2.1.4 foreshadowing) but here it\'s an act of \'Grit\'.',
      beat_goal: 'Break the selfishness born of scarcity. Francisco leads by example (sacrifice). A shift from \'hoarding\' to \'pooling\'.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grim hope',
      scene_tone: 'Quiet tension',
      timeline_date: '5/25/1320 - Morning',
      timeline_variant: 'The Sanctuary (Freezing)',
      location: 'The Central Piazza',
    },
    {
      scene_number: 3,
      scene_title: 'Cannibalizing the Past',
      setup: 'With the pooled resources, they don\'t have enough to repower the status quo. Francisco realizes: \'We have too much legacy junk.\' They begin stripping down their ships, their robes, their ceremonial staffs. They tear apart the \'sacred\' technologies of their individual factions to build a crude, hybrid generator. It\'s blasphemy to the scholars, but survival to the soldiers. As they break down their past glories to fuel their present survival, they realize those things were weighing them down anyway. The act of destruction becomes an act of liberation.',
      symbolism: 'Breaking the \'Disks\' (Pentacles/Material possessions). Antifragility: the system improves because it is forced to shed inefficiency. The hybrid generator is a physical symbol of their Unity—ugly, cobbled together, but working.',
      beat_goal: 'The Solution. Implementing the \'remix\' strategy under pressure. Validating that they can survive without the Empire\'s supply lines.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Manic productivity',
      scene_tone: 'Industrial and sweaty (warming up)',
      timeline_date: '5/25/1320 - Afternoon',
      timeline_variant: 'The Sanctuary (Industrializing)',
      location: 'The Foundry (converted library)',
    },
    {
      scene_number: 4,
      scene_title: 'The Warmth of Independence',
      setup: 'The Sanctuary hums with a new, self-sustained frequency. It\'s not as bright as before, but it\'s theirs. Dagon\'s siege has failed; he can\'t starve what feeds itself. Francisco stands on the ramparts looking out at the Void. He realizes they are no longer just refugees; they are a colony. They have passed the test of Adversity. The hardship didn\'t break them; it calcified their bond. They are harder, leaner, and more dangerous now.',
      symbolism: 'The Five of Disks resolved: moving from \'destitution\' to \'endurance\'. The \'calcification\' represents the \'Disks\' element (Earth/Stone)—solidifying the liquid emotions of the previous chapter. The \'Colony\' implies permanence.',
      beat_goal: 'Resolution. Affirm the new strength. Set up the next phase (Diplomacy/Expansion).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Pride and weariness',
      scene_tone: 'Solid and enduring',
      timeline_date: '5/25/1320 - Evening',
      timeline_variant: 'The Sanctuary (Independent)',
      location: 'Sanctuary Ramparts',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 226 - 230',
      description: 'Hours after the Sanctuary stabilizes, Dagon cuts all temporal supply lines—lights fail, warmth drains, and panic erupts as factions begin hoarding resources, transforming the external enemy into an internal crisis of scarcity and cold fear.',
      focus: 'Establishing the siege and moving conflict from abstract to visceral physical reality.',
      chapterSceneFocus: 'Ch56S1: Hours after stabilization, Dagon cuts temporal supply lines causing lights to fail and warmth to drain from the Sanctuary, triggering panic as factions hoard resources and the external enemy transforms into internal crisis of scarcity.',
      preliminarySceneFocus: 'Dagon\'s siege begins with resource cutoff',
      preliminarySceneDescription: 'Temporal supply lines severed, Sanctuary plunged into darkness and cold',
      narrativeFunction: 'Establishes siege, shifts conflict from magical/abstract to physical/visceral, shows fragility of creation.',
      sensoryDetail: 'Failing ambient light, draining warmth, cold air, monitors showing severed connections, Medici complaints about cold, Alexandrians hoarding data pads, dwindling batteries.',
      internalConflict: 'Francisco confronting that his creative triumph is fragile against physical deprivation tactics.',
      characterGrowthElement: 'Francisco must pivot from Creator (King of Cups) to Sustainer (Five of Disks)—providing gritty solutions not just hope.',
      seriesConnectionResonance: 'Introduces resource economy driving war effort in later books; tests loyalty determining which factions stay.',
      sceneCardProgression: 138,
      realWorldContext: 'Siege warfare, resource scarcity causing social breakdown, infrastructure collapse.',
      timelineSignificance: 'First siege of the Sanctuary, demonstrating vulnerability of emotion-based reality to resource deprivation.',
      saveTheCatBeat: truncate('Fun and Games - discovering harsh rules of new world under siege', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'rapid_deterioration',
        narrative_mode: 'siege_crisis',
      }),
      learning_objectives: JSON.stringify([
        'Resource mechanics in temporal warfare',
        'How scarcity triggers social breakdown',
        'Physical vs. abstract conflict dynamics',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Factional segregation under pressure',
        'Civil war as greater threat than external enemy',
        'Need for sacrifice and pooling resources',
      ]),
    },
    {
      pages: 'Page 230 - 233',
      description: 'Days into the siege, factions segregate and hoard as civil war looms—Francisco calls assembly in freezing piazza, places his last energy crystal on the table as sacrifice, and simply waits in the cold, leading by example to break scarcity-born selfishness.',
      focus: 'Breaking selfishness through sacrificial leadership and patient example.',
      chapterSceneFocus: 'Ch56S2: As factions segregate and hoard during siege, Francisco calls assembly in freezing piazza, places his last energy crystal as sacrifice, and waits silently in the cold—leading by example to shift from hoarding to pooling resources.',
      preliminarySceneFocus: 'Stone Soup sacrifice and waiting',
      preliminarySceneDescription: 'Francisco\'s sacrificial leadership breaks scarcity selfishness',
      narrativeFunction: 'Demonstrates leadership through sacrifice; initiates shift from hoarding to pooling; Stone Soup fable reimagined.',
      sensoryDetail: 'Freezing piazza, segregated factions protecting reserves, Francisco\'s energy crystal heirloom on table, silent waiting in cold, standoff tension.',
      internalConflict: 'Francisco gambling that his sacrifice will inspire others rather than being wasted on selfishness.',
      characterGrowthElement: 'Francisco embodies patient, grounded Knight of Pentacles—leading by example rather than preaching.',
      seriesConnectionResonance: 'Establishes Francisco\'s sacrificial leadership pattern crucial for later books; loyalty crucible moment.',
      sceneCardProgression: 139,
      realWorldContext: 'Stone Soup fable, sacrificial leadership, breaking prisoner\'s dilemma through example.',
      timelineSignificance: 'Critical shift from competitive hoarding to cooperative pooling under siege conditions.',
      saveTheCatBeat: truncate('Fun and Games - finding spiritual wealth in material poverty', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'tense_patience',
        narrative_mode: 'sacrificial_leadership',
      }),
      learning_objectives: JSON.stringify([
        'Sacrificial leadership vs. preaching',
        'Breaking scarcity mindset through example',
        'Stone Soup as collective resource strategy',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Transition from hoarding to pooling',
        'Cannibalizing legacy systems',
        'Finding strength in letting go of past',
      ]),
    },
    {
      pages: 'Page 233 - 237',
      description: 'With pooled resources insufficient, Francisco realizes they carry too much legacy junk—factions strip ships, robes, ceremonial artifacts to build crude hybrid generator, discovering that destroying past glories liberates them from inefficiency and creates ugly but functional unity symbol.',
      focus: 'Implementing antifragile solution by cannibalizing legacy systems under pressure.',
      chapterSceneFocus: 'Ch56S3: Pooled resources prove insufficient, so Francisco leads factions in cannibalizing their sacred technologies—ships, robes, ceremonial staffs—to build crude hybrid generator, discovering that destroying past glories liberates them from weighing inefficiency.',
      preliminarySceneFocus: 'Cannibalizing legacy for survival',
      preliminarySceneDescription: 'Sacred faction technologies dismantled for hybrid generator',
      narrativeFunction: 'Demonstrates antifragile principle—system improves by shedding inefficiency under stress; validates independence from supply lines.',
      sensoryDetail: 'Ships being stripped, robes torn apart, ceremonial staffs dismantled, scholars\' blasphemy horror, soldiers\' survival pragmatism, crude hybrid generator construction, warming foundry.',
      internalConflict: 'Francisco balancing respect for traditions with brutal pragmatism of survival necessity.',
      characterGrowthElement: 'Francisco demonstrates \'The Obstacle Is the Way\'—turning resource scarcity into liberation from inefficiency.',
      seriesConnectionResonance: 'Establishes remix/cannibalize strategy pattern; hybrid generator symbolizes Unity physically.',
      sceneCardProgression: 140,
      realWorldContext: 'Creative destruction, letting go of sunk costs, antifragile systems strengthening through stress.',
      timelineSignificance: 'Creation of self-sustaining energy system, achieving independence from external timeline resources.',
      saveTheCatBeat: truncate('Fun and Games - mastering survival through creative destruction', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'manic_productive',
        narrative_mode: 'industrial_transformation',
      }),
      learning_objectives: JSON.stringify([
        'Antifragile systems strengthening through stress',
        'Creative destruction as liberation',
        'Shedding inefficiency under pressure',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Self-sustaining system emerging',
        'Unity as ugly but functional collaboration',
        'Independence from external dependencies',
      ]),
    },
    {
      pages: 'Page 237 - 240',
      description: 'The Sanctuary hums with self-sustained frequency—dimmer but independent—as Dagon\'s siege fails against those who feed themselves, and Francisco realizes they\'ve transformed from refugees to colony, hardened and calcified by adversity into something more dangerous.',
      focus: 'Affirming new strength and establishing colony permanence after surviving siege.',
      chapterSceneFocus: 'Ch56S4: The Sanctuary achieves self-sustained frequency after defeating Dagon\'s siege through independence, as Francisco realizes they\'ve transformed from refugees to colony—harder, leaner, and more dangerous after adversity calcified their bond.',
      preliminarySceneFocus: 'Independence achieved, colony established',
      preliminarySceneDescription: 'Self-sustaining Sanctuary defeats siege, transforms into permanent colony',
      narrativeFunction: 'Resolves siege arc; affirms antifragile strength; establishes Sanctuary as permanent colony; sets up expansion phase.',
      sensoryDetail: 'Self-sustained hum, dimmer but stable light, Francisco on ramparts overlooking Void, warmth of independence, calcified bonds, leaner stronger presence.',
      internalConflict: 'Francisco\'s pride tempered by weariness of constant vigilance and leadership burden.',
      characterGrowthElement: 'Francisco completes transition from Creator to Sustainer—proving leadership feeds people with gritty solutions.',
      seriesConnectionResonance: 'Sanctuary as colony becomes permanent base for Books 3-6; establishes resource independence crucial for war effort.',
      sceneCardProgression: 141,
      realWorldContext: 'Colony establishment, self-sufficiency triumph, hardening through adversity.',
      timelineSignificance: 'Sanctuary transitions from refugee shelter to permanent independent colony, changing strategic landscape.',
      saveTheCatBeat: truncate('Fun and Games - proving mastery of adversity in new world', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'resolving_triumph',
        narrative_mode: 'enduring_strength',
      }),
      learning_objectives: JSON.stringify([
        'Antifragile resolution—stronger after stress',
        'Self-sufficiency as ultimate defense',
        'Colony permanence vs. refugee temporariness',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Expansion and diplomacy phase beginning',
        'Hardened colony as strategic threat to Dagon',
        'Resource independence enabling offensive operations',
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
        chapterUniqueIdentifier: 'EA-056',
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

  console.log(`\n✅ EA-056 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
