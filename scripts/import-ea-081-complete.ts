import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-081: Radiance (Book 3, Chapter 1)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-081'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-081 not found. Run create-ea-081-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Lecture',
      setup: 'Francisco stands at the podium. He isn\'t reading notes. He is channeling. He speaks of \'Time as a River\'. He gestures, and the dust motes in the air freeze. The students gasp. He smiles. It feels good to be the Master.',
      symbolism: 'The Ace of Wands (The Torch). The Stage. The mesmerizing fire.',
      beat_goal: 'The Introduction. Establishing the new status quo.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Confidence',
      scene_tone: 'Inspiring',
      timeline_date: '5/8/1321 - Morning',
      timeline_variant: 'Bologna University',
      location: 'Lecture Hall',
    },
    {
      scene_number: 2,
      scene_title: 'The Aura',
      setup: 'Novella waits for him after class. She sees the students touching the hem of his robe (metaphorically). She pulls him into an alcove. \'You\'re doing it again.\' \'Doing what?\' \'Shining.\' She holds up a mirror. His eyes are literally glowing gold for a second before fading. \'You are a beacon, Francisco. Beacons attract storms.\'',
      symbolism: 'The Halo. The Mirror (again). The Warning.',
      beat_goal: 'The Complication. Power has side effects.',
      pov: '3rd Person Limited (Novella)',
      tense: 'Past Tense',
      core_emotion: 'Concern',
      scene_tone: 'Intimate tension',
      timeline_date: '5/8/1321 - Afternoon',
      timeline_variant: 'University Hallway',
      location: 'The Alcove',
    },
    {
      scene_number: 3,
      scene_title: 'The Spark',
      setup: 'Walking home. A beggar asks for alms. Francisco doesn\'t give a coin; he touches the beggar\'s cup. The cheap tin turns to silver. Pure transmutation. The beggar screams in fear/joy. Francisco walks on, feeling benevolent. He doesn\'t see the crowd gathering behind him. He just performed a miracle on a public street.',
      symbolism: 'The Midas Touch. Unchecked benevolence. The Ace manifesting.',
      beat_goal: 'The Escalation. A public display of power.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Hubris',
      scene_tone: 'Wonder/Danger',
      timeline_date: '5/8/1321 - Dusk',
      timeline_variant: 'Bologna Streets',
      location: 'The Piazza',
    },
    {
      scene_number: 4,
      scene_title: 'The Shadow',
      setup: 'Cardinal Colonna is watching from a carriage. He saw the silver cup. He fingers his rosary. \'It is time,\' he tells his driver. \'Bring him to the Palace. Tonight.\' The Ace of Wands has lit a signal fire, and the wolves are coming.',
      symbolism: 'The Spider in the Web. The Extinguisher.',
      beat_goal: 'The Threat. The antagonist moves.',
      pov: '3rd Person Limited (Colonna)',
      tense: 'Past Tense',
      core_emotion: 'Predatory anticipation',
      scene_tone: 'Ominous',
      timeline_date: '5/8/1321 - Night',
      timeline_variant: 'Bologna Streets',
      location: 'The Carriage',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 1 - 5',
      description: 'Francisco podium standing notes not-reading channeling—Time River speaking gesturing dust-motes freezing—students gasping smiling Master-feeling as Ace Wands Torch Stage mesmerizing fire introduces establishing new status-quo hook confident inspiring Presence commanding room charisma radiance begins Book 3 Ordinary World.',
      focus: 'Introduction establishing new status quo through radiance.',
      chapterSceneFocus: 'Ch81S1: Francisco podium channeling Time River gesturing dust freezing—students gasping Master-feeling as Ace Torch Stage fire introduces status-quo hook confident inspiring Presence commanding charisma radiance Book 3 Ordinary World begins.',
      preliminarySceneFocus: 'Ace Torch Stage mesmerizes fire',
      preliminarySceneDescription: 'Presence commands charisma radiates inspiring confidence',
      narrativeFunction: 'Establishes Book 3 Ordinary World; demonstrates Francisco\'s increased power; introduces Ace of Wands radiance; shows new status.',
      sensoryDetail: 'Podium standing, notes absence, channeling state, Time River speech, gesture making, dust motes, freezing air, student gasps, smile, Master feeling good, confidence, charisma, radiance filling room.',
      internalConflict: 'Francisco experiencing confidence bordering on hubris—enjoying Master role, feeling good about power display, high on own supply.',
      characterGrowthElement: 'Francisco embodying Ace of Wands radiance—commanding room with Presence, channeling rather than teaching, risking becoming The Guru through charisma.',
      seriesConnectionResonance: 'Book 3 opening; Ace Wands energy attracting antagonist; magical progression from Book 1; cult of personality beginning; social status transformed.',
      sceneCardProgression: 238,
      realWorldContext: 'Presence commanding attention, charisma leadership, teaching mastery.',
      timelineSignificance: '5/8/1321 morning—6 months post-rescue, Francisco teaching at University with increased power, Book 3 Ordinary World establishing.',
      saveTheCatBeat: truncate('Opening Image - radiant teacher mesmerizes', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'inspiring_mesmerizing',
        narrative_mode: 'confident_charisma',
      }),
      learning_objectives: JSON.stringify([
        'Presence commanding room technique',
        'Ace of Wands radiance channeling',
        'Charismatic teaching mastery',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Power side effects warning',
        'Glowing eyes revelation',
        'Storm attraction setup',
      ]),
    },
    {
      pages: 'Page 5 - 8',
      description: 'Novella class-waiting students robe-hem touching—alcove pulling \'doing again\' \'Shining\'—mirror holding eyes glowing gold fading—\'beacon Francisco. Beacons storms attract\' as Halo Mirror Warning complicates power side-effects checking concern intimate-tension golden iris-flecks static hair-rising alcove-stone dark light-contrasting Novella grounding.',
      focus: 'Complication showing power side effects through warning.',
      chapterSceneFocus: 'Ch81S2: Novella waiting students robe-touching alcove-pulling \'Shining\' mirror eyes glowing gold—\'beacon storms attract\' as Halo Mirror Warning complicates power side-effects concern intimate golden static hair alcove-dark light Novella grounds.',
      preliminarySceneFocus: 'Halo Mirror warns storms intimate',
      preliminarySceneDescription: 'Grounding wire checks power glowing concerned',
      narrativeFunction: 'Demonstrates power side effects; establishes Novella as grounding force; warns of danger; shows literal glowing.',
      sensoryDetail: 'Novella waiting, students touching robe hem metaphorically, alcove pulling, doing again question, Shining revelation, mirror holding, eyes glowing gold, fading, beacon warning, storms attracting, golden iris flecks, static electricity, Novella hair rising, dark alcove stone, light contrast.',
      internalConflict: 'Novella experiencing concern—seeing Francisco\'s transformation, worrying about power\'s effects, acting as grounding wire.',
      characterGrowthElement: 'Novella serving as Grounding Wire—keeping Francisco connected to reality, warning about beacon attracting storms, showing concern about transformation.',
      seriesConnectionResonance: 'Grounding wire establishing; power side effects demonstrating; storm attraction warning; cult of personality concern; Novella reality anchor.',
      sceneCardProgression: 239,
      realWorldContext: 'Power side effects recognition, grounding relationships, warning systems.',
      timelineSignificance: '5/8/1321 afternoon—post-lecture, Novella warning Francisco about literal glowing, storm attraction foreshadowing.',
      saveTheCatBeat: truncate('Opening Image - power glows attracts danger', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'intimate_tension',
        narrative_mode: 'concerned_warning',
      }),
      learning_objectives: JSON.stringify([
        'Power side effects awareness',
        'Grounding relationships value',
        'Warning signal recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Public miracle coming',
        'Transmutation display',
        'Cardinal observation setup',
      ]),
    },
    {
      pages: 'Page 8 - 12',
      description: 'Walking home beggar alms-asking—Francisco coin not-giving cup-touching tin-to-silver turning—pure transmutation beggar fear/joy screaming—benevolent-feeling walking crowd not-seeing gathering behind—public miracle street-performed as Midas Touch unchecked benevolence Ace manifesting escalates public-power display hubris wonder/danger Inciting Incident setup inverted Gifts Imperfection godhood-seeking.',
      focus: 'Escalation displaying power through public miracle.',
      chapterSceneFocus: 'Ch81S3: Walking home beggar asking Francisco cup-touching tin-to-silver transmuting—fear/joy screaming benevolent walking crowd not-seeing gathering—public miracle as Midas Touch unchecked Ace escalates public-power hubris wonder/danger Inciting setup godhood-seeking inverts.',
      preliminarySceneFocus: 'Midas Touch manifests unchecked hubris',
      preliminarySceneDescription: 'Public miracle escalates wonder-danger hubris',
      narrativeFunction: 'Escalates power display publicly; demonstrates transmutation; shows hubris growing; creates public spectacle; sets up Inciting Incident.',
      sensoryDetail: 'Walking home, beggar asking alms, Francisco cup touching, coin not-giving, tin turning silver, pure transmutation, beggar screaming fear and joy, benevolent feeling, walking on, crowd gathering behind unseen, public street miracle, Midas touch.',
      internalConflict: 'Francisco experiencing hubris—feeling benevolent while performing miracle, not seeing danger, seeking perfection/godhood unconsciously.',
      characterGrowthElement: 'Francisco demonstrating Ace of Wands manifesting—performing transmutation miracle publicly, showing unchecked benevolence, exhibiting hubris through Midas touch.',
      seriesConnectionResonance: 'Public miracle attracting attention; transmutation demonstrating; hubris establishing; Inciting Incident setup; Gifts of Imperfection inverted seeking godhood.',
      sceneCardProgression: 240,
      realWorldContext: 'Gifts of Imperfection inverted, unchecked power, public spectacle.',
      timelineSignificance: '5/8/1321 dusk—public transmutation miracle performed on street, attracting crowd and Cardinal\'s attention, Inciting Incident setup.',
      saveTheCatBeat: truncate('Opening Image - public miracle attracts wolves', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'wonder_danger_escalation',
        narrative_mode: 'hubris_benevolence',
      }),
      learning_objectives: JSON.stringify([
        'Gifts of Imperfection inverted understanding',
        'Unchecked power danger recognition',
        'Public spectacle consequences',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Cardinal watching',
        'Palace summons coming',
        'Wolves approaching',
      ]),
    },
    {
      pages: 'Page 12 - 15',
      description: 'Cardinal Colonna carriage-watching silver cup seeing—rosary fingering \'time\' driver-telling \'Palace bring. Tonight\'—Ace Wands signal-fire lit wolves coming as Spider Web Extinguisher threatens antagonist moves cliffhanger Ch 2 ominous predatory anticipation carriage velvet ring tapping window silver cup glinting street below.',
      focus: 'Threat moving antagonist through signal fire response.',
      chapterSceneFocus: 'Ch81S4: Cardinal Colonna carriage watching cup seeing rosary fingering \'time Palace tonight\'—Ace signal-fire lit wolves coming as Spider Extinguisher threatens antagonist moves cliffhanger ominous predatory carriage velvet ring tapping cup glinting observes.',
      preliminarySceneFocus: 'Spider Extinguisher threatens ominously predatory',
      preliminarySceneDescription: 'Antagonist moves wolves coming signal-fire response',
      narrativeFunction: 'Introduces antagonist Cardinal Colonna; demonstrates predatory observation; establishes threat; creates cliffhanger to Chapter 2.',
      sensoryDetail: 'Cardinal Colonna, carriage watching, silver cup seeing, rosary fingering, time declaration, driver telling, Palace bring command, Tonight urgency, Ace Wands signal fire, wolves coming, carriage velvet interior, Cardinal ring tapping window, silver cup glinting street below.',
      internalConflict: 'Cardinal Colonna experiencing predatory anticipation—seeing Francisco as weapon, timing intervention, moving to capture power.',
      characterGrowthElement: 'Cardinal Colonna revealed as Observer/Spider—seeing Francisco as potential weapon, timing Palace summons, representing Extinguisher to Francisco\'s Torch.',
      seriesConnectionResonance: 'Book 3 antagonist introduced; Ace Wands attracting wolves; weapon perception establishing; Palace summons setup; predatory threat beginning.',
      sceneCardProgression: 241,
      realWorldContext: 'Predatory observation, power as weapon perception, threat timing.',
      timelineSignificance: '5/8/1321 night—Cardinal Colonna ordering Francisco brought to Palace after witnessing miracle, Book 3 conflict beginning.',
      saveTheCatBeat: truncate('Opening Image - antagonist claims weapon', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'ominous_setup',
        narrative_mode: 'predatory_anticipation',
      }),
      learning_objectives: JSON.stringify([
        'Antagonist introduction establishing',
        'Power as weapon theme beginning',
        'Predatory timing demonstration',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Palace confrontation Chapter 2',
        'Cardinal manipulation coming',
        'Book 3 conflict escalation',
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
        chapterUniqueIdentifier: 'EA-081',
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

  console.log(`\n✅ EA-081 import complete!`);
  console.log(`\n🎉 BOOK 3 CHAPTER 1 COMPLETE! Francisco's radiance has attracted the wolves.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
