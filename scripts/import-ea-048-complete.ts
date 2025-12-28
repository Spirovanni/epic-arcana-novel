import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-048: Disillusionment (Book 2, Chapter 8)...\n');

  // Get chapter EA-048
  const [ch48] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-048'))
    .limit(1);

  if (!ch48) {
    console.error('❌ EA-048 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch48.title} (ID: ${ch48.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Ideal Shatters',
      setup: 'Francisco arrives at the Alexandrian scholars\' hidden archive expecting to find wisdom and guidance about timeline manipulation, but instead discovers rows of temporal containment chambers—people trapped in repeating loops, their consciousness preserved but their freedom stolen. Francisco wants to believe this is a misunderstanding, that these are volunteers or necessary sacrifices; the lead scholar wants Francisco to understand their methods and join their preservation efforts. Opposition mounts from all sides: the trapped individuals\' desperate pleas echo through the chambers, La Signora\'s warning that "knowledge without wisdom corrupts" rings in his mind, and Francisco\'s own growing horror at seeing people reduced to living archives. But as he watches a woman trapped in a loop of her worst memory—reliving her child\'s death endlessly so the scholars can study grief—something breaks in Francisco. The Four of Cups\' disillusionment manifests: his idealistic vision of timeline manipulation as a tool for good crumbles, revealing the moral rot beneath. The scene lands on painful awakening.',
      symbolism: 'The Four of Cups embodies disillusionment: Francisco\'s idealized cup of timeline knowledge is revealed as poisoned, forcing him to see reality clearly. The temporal loops represent how good intentions can trap people in cycles of suffering when detached from empathy and moral grounding.',
      beat_goal: 'Francisco\'s idealistic notions about timeline manipulation shatter as he witnesses the Alexandrian scholars\' temporal prison, forcing him to confront that power without wisdom corrupts even those with good intentions.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Disillusionment and horror',
      scene_tone: 'Dark and revelatory',
      timeline_date: 'Post-Book 1 + 2 weeks',
      timeline_variant: 'Primary Timeline',
      location: 'Alexandrian Scholars\' Hidden Archive - Temporal Containment Chambers',
    },
    {
      scene_number: 2,
      scene_title: 'The Erased Battlefield',
      setup: 'Dante leads Francisco to an erased battlefield—a void in reality where the Byzantines fought a crucial battle that now never happened. The ground shifts between existence and nothingness, and Francisco can see ghostly echoes of soldiers who were erased when their timeline was destroyed. Francisco wants to understand why this was necessary, to find justification for such drastic action; Dante wants Francisco to see the full cost of timeline manipulation and the psychological toll it takes on those who wield it. Opposition intensifies through the void\'s disorienting effects (Francisco\'s sense of reality destabilizes), the ghostly soldiers\' silent accusations, and Francisco\'s own mounting guilt—he\'s used timeline manipulation himself, has he caused similar erasures? But Dante reveals the deeper truth: "Every timeline we destroy, every person we erase, chips away at our humanity. The Byzantines started with noble goals, but after decades of erasing enemies, they stopped seeing people as real." Francisco realizes the temporal prison and erased battlefield are two sides of the same corruption. The scene lands on understanding the cost.',
      symbolism: 'The erased battlefield represents the void left when reality is manipulated without regard for consequence—the Four of Cups\' empty cup showing what remains when idealism is stripped away. The ghostly soldiers symbolize the people who become abstractions to those who manipulate timelines too freely.',
      beat_goal: 'Francisco discovers the Byzantine warriors\' erased timelines and learns the psychological toll of timeline manipulation—users gradually lose empathy for people they see as \'temporary\' versions, revealing how power corrupts even well-intentioned wielders.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Horror and growing awareness',
      scene_tone: 'Haunting and unsettling',
      timeline_date: 'Post-Book 1 + 2 weeks (same day)',
      timeline_variant: 'Void Between Timelines',
      location: 'Erased Battlefield - Temporal Void',
    },
    {
      scene_number: 3,
      scene_title: 'La Signora\'s Burden',
      setup: 'Confronting La Signora about why she never interfered with these abuses, Francisco expects anger or defensiveness, but finds only profound weariness. La Signora reveals she\'s known about both the temporal prison and erased battlefields for decades, has watched good people become corrupted by timeline power, and chose not to stop them—not from weakness, but from understanding that direct intervention often makes things worse. Francisco wants her to take action now, to use her power to free the trapped and restore the erased; La Signora wants Francisco to understand that true change must come from within, that forcing morality through power only creates new forms of oppression. Opposition emerges from Francisco\'s frustration (why have power if not to help?), La Signora\'s painful wisdom (intervention creates dependency), and the trapped people\'s continued suffering demanding action. But as La Signora shows Francisco her own timeline scars—moments where her interventions caused unintended consequences—he begins to understand the burden of knowledge: knowing the right thing and having the power to do it doesn\'t always mean you should. The scene lands on accepting complexity.',
      symbolism: 'La Signora embodies the Four of Cups\' mature wisdom: she sees the empty cups of corrupted power but understands that simply filling them with her own intervention doesn\'t solve the deeper problem. Her burden represents the weight of knowledge without clear action—the disillusionment that comes from understanding that good intentions aren\'t enough.',
      beat_goal: 'La Signora reveals she\'s known about these abuses but chose not to interfere, teaching Francisco about the burden of knowledge and the complexity of moral action—that power without wisdom creates new problems even when solving old ones.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustration and growing understanding',
      scene_tone: 'Contemplative and weighty',
      timeline_date: 'Post-Book 1 + 2 weeks (evening)',
      timeline_variant: 'Primary Timeline',
      location: 'Neutral Meeting Ground - Temporal Nexus',
    },
    {
      scene_number: 4,
      scene_title: 'Grounding in Truth',
      setup: 'Alone with Dante after the revelations, Francisco grapples with the gap between his expectations and reality. He expected timeline manipulation to be a tool for good, but has discovered it corrupts even those who start with noble intentions. Francisco wants to find a way forward that doesn\'t repeat these mistakes, to use his power differently; Dante wants Francisco to understand that the path forward requires grounding actions in truth rather than idealism. Opposition comes from Francisco\'s despair (if even good people become corrupted, what hope is there?), the weight of the trapped and erased demanding immediate action, and Francisco\'s own fear that he\'s already too far gone. But Dante shares his own struggles with chronicle-keeping—the responsibility of recording history without interfering, of bearing witness to suffering without trying to fix everything. "The Four of Cups isn\'t just disillusionment," Dante explains, "it\'s the invitation to see clearly. You can\'t build on illusions. Ground your actions in truth, not ideals." Francisco realizes he must seek a different approach to timeline manipulation based on wisdom rather than power, on acceptance rather than control. The scene lands on commitment to a new path.',
      symbolism: 'The Four of Cups\' final meaning: after disillusionment comes the choice to see reality clearly and build from truth. Francisco\'s commitment to wisdom over power represents accepting the empty cup of corrupted methods and choosing to fill it with something genuine—grounded action based on truth rather than idealism.',
      beat_goal: 'Francisco accepts the complexity of moral action and commits to seeking a different approach to timeline manipulation based on wisdom rather than power, grounding his future actions in truth rather than idealism as he prepares for the road ahead.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Determination and acceptance',
      scene_tone: 'Reflective and resolute',
      timeline_date: 'Post-Book 1 + 2 weeks (night)',
      timeline_variant: 'Primary Timeline',
      location: 'Return to Zanetti Train - Private Quarters',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Ideal Shatters
      pages: 'Page 106 - 109',
      description: 'Francisco discovers the Alexandrian scholars trap people in temporal loops to preserve knowledge, witnessing a woman reliving her child\'s death endlessly, shattering his idealistic vision of timeline manipulation as a tool for good.',
      focus: 'Francisco\'s idealistic notions about timeline manipulation crumble as he witnesses the moral corruption of power without wisdom',
      chapterSceneFocus: 'Ch48S1: Francisco discovers Alexandrian temporal prison trapping people in repeating loops, witnesses woman reliving child\'s death for grief study, experiences idealistic vision of timeline manipulation shattering to reveal moral corruption',
      preliminarySceneFocus: 'Confronting the gap between expectation and reality',
      preliminarySceneDescription: 'The temporal containment chambers reveal how knowledge divorced from wisdom and empathy corrupts even those with good intentions',
      narrativeFunction: 'Shatters Francisco\'s remaining idealism about timeline manipulation, establishing that power corrupts regardless of initial intentions',
      sensoryDetail: 'Rows of temporal containment chambers glowing with ethereal light, desperate pleas echoing through archive, woman trapped in endless loop reliving worst memory, scholars coldly studying grief responses',
      internalConflict: 'Francisco torn between wanting to believe this is justified versus horror at seeing people reduced to living archives, idealistic hopes versus brutal reality',
      characterGrowthElement: 'Francisco\'s painful awakening forces him to abandon idealistic thinking and confront the dark reality of corrupted power',
      seriesConnectionResonance: 'Disillusionment about timeline manipulation sets up Francisco\'s moral complexity understanding crucial for Books 6-9 difficult choices',
      sceneCardProgression: 106,
      realWorldContext: 'Hidden Alexandrian archive where scholars preserve knowledge through temporal imprisonment',
      timelineSignificance: 'Two weeks post-Book 1, Francisco\'s idealism meets harsh reality',
      saveTheCatBeat: 'Fun and Games - exploring dark consequences of competing philosophies',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-slow - allowing horror to build gradually',
        tension_level: 'High - mounting horror at discovery',
        emotional_arc: 'Hope → Doubt → Disillusionment → Horror',
      }),
      learning_objectives: JSON.stringify([
        'Recognize when good intentions become divorced from moral grounding',
        'Understand that knowledge without wisdom and empathy corrupts',
        'Accept painful truths rather than clinging to comforting illusions',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Power corrupts theme that will define series arc',
        'Francisco\'s fear he may already be corrupted (tested in later books)',
        'Temporal loops causing psychological damage (explored in Book 4)',
      ]),
    },
    {
      // Scene 2: The Erased Battlefield
      pages: 'Page 110 - 113',
      description: 'Dante guides Francisco through an erased battlefield where the Byzantines destroyed a timeline, revealing how timeline manipulation erodes humanity as users stop seeing people as real, showing corruption from another angle.',
      focus: 'Francisco learns the psychological toll of timeline manipulation—how wielding temporal power gradually strips away empathy and moral compass',
      chapterSceneFocus: 'Ch48S2: Francisco witnesses erased battlefield void with ghostly soldier echoes, learns psychological toll as timeline manipulators lose empathy for "temporary" versions, recognizes temporal prison and erasure as two sides of corruption',
      preliminarySceneFocus: 'Understanding the cost of temporal power on the wielder',
      preliminarySceneDescription: 'Erased battlefield demonstrates how manipulating reality without consequence awareness chips away at humanity until people become abstractions',
      narrativeFunction: 'Reveals the psychological corruption of timeline manipulation—how power erodes empathy and moral grounding over time',
      sensoryDetail: 'Ground shifting between existence and nothingness, ghostly echoes of erased soldiers, reality destabilizing around Francisco, void where battle once existed',
      internalConflict: 'Francisco\'s mounting guilt about his own timeline use versus desire to find justification, need to understand versus fear of what he\'ll discover about himself',
      characterGrowthElement: 'Francisco recognizes the psychological cost of power—that wielding temporal manipulation gradually dehumanizes both victims and users',
      seriesConnectionResonance: 'Understanding how power corrupts the wielder becomes essential for Francisco resisting corruption in Books 4-9',
      sceneCardProgression: 107,
      realWorldContext: 'Void between timelines where Byzantine intervention erased entire historical event',
      timelineSignificance: 'Same day as temporal prison discovery—two perspectives on corruption',
      saveTheCatBeat: 'Fun and Games - exploring second dark consequence perspective',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium - building understanding through revelation',
        tension_level: 'High - mounting horror and personal guilt',
        emotional_arc: 'Confusion → Horror → Guilt → Understanding',
      }),
      learning_objectives: JSON.stringify([
        'Recognize how prolonged power use affects moral compass and empathy',
        'Understand that users become corrupted through dehumanizing others',
        'Accept that noble goals don\'t prevent psychological deterioration',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco\'s own timeline use raising questions about his corruption level',
        'Psychological toll theme (crucial for Book 5 crisis)',
        'People becoming abstractions to power users (Book 7 antagonist motivation)',
      ]),
    },
    {
      // Scene 3: La Signora's Burden
      pages: 'Page 114 - 117',
      description: 'La Signora reveals she\'s known about temporal abuses for decades but chose not to interfere, teaching Francisco that direct intervention often creates new problems and true change must come from within.',
      focus: 'Francisco learns the burden of knowledge—that having power and knowing the right thing doesn\'t always mean one should intervene',
      chapterSceneFocus: 'Ch48S3: La Signora reveals decades of knowledge about abuses without intervention, teaches burden of knowledge and moral complexity, shows Francisco her own timeline scars from unintended consequences of intervention',
      preliminarySceneFocus: 'Accepting the complexity of moral action and intervention',
      preliminarySceneDescription: 'La Signora\'s revelation that knowing and having power doesn\'t mandate action teaches Francisco about wisdom beyond simple intervention',
      narrativeFunction: 'Establishes the burden of knowledge theme and teaches that intervention without wisdom creates new forms of oppression',
      sensoryDetail: 'La Signora\'s profound weariness, her timeline scars visible as she shares intervention consequences, weight of decades of witness without action',
      internalConflict: 'Francisco\'s frustration at inaction versus growing understanding of complexity, desire for simple moral clarity versus acceptance of nuanced reality',
      characterGrowthElement: 'Francisco begins understanding that true wisdom includes knowing when not to act, accepting the burden of knowledge without reactive intervention',
      seriesConnectionResonance: 'Burden of knowledge theme becomes central to Francisco\'s character development and ultimate Book 9 choice about using/refusing power',
      sceneCardProgression: 108,
      realWorldContext: 'Neutral meeting ground where La Signora can reveal her decades of temporal witness',
      timelineSignificance: 'Evening of discovery day—processing revelations through La Signora\'s wisdom',
      saveTheCatBeat: 'Midpoint - false defeat as Francisco realizes even his mentor carries corruption\'s weight',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow contemplative - space for deep philosophical understanding',
        tension_level: 'Moderate - internal tension of grappling with complexity',
        emotional_arc: 'Frustration → Confusion → Resistance → Acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Understand that direct intervention often creates dependency and new problems',
        'Accept the burden of knowledge without requiring immediate action',
        'Recognize that forcing morality through power creates new oppression',
      ]),
      foreshadowing_elements: JSON.stringify([
        'La Signora\'s intervention scars (revealed more fully in Book 6)',
        'True change from within theme (crucial for Book 8 resolution)',
        'Burden of witness without action (Francisco\'s Book 9 dilemma)',
      ]),
    },
    {
      // Scene 4: Grounding in Truth
      pages: 'Page 118 - 120',
      description: 'Dante guides Francisco to ground future actions in truth rather than idealism, helping him commit to seeking wisdom-based approach to timeline manipulation and accepting reality clearly to build something genuine.',
      focus: 'Francisco commits to grounding actions in truth rather than idealism, choosing wisdom over power and acceptance over control',
      chapterSceneFocus: 'Ch48S4: Francisco accepts moral complexity with Dante\'s guidance, commits to wisdom-based approach over power-based methods, grounds future actions in truth not idealism, chooses to see reality clearly and build from genuine understanding',
      preliminarySceneFocus: 'Committing to truth-based action after disillusionment',
      preliminarySceneDescription: 'After idealistic illusions shatter, Francisco chooses to see clearly and build genuine approach based on truth and wisdom rather than power and control',
      narrativeFunction: 'Resolves chapter arc by establishing Francisco\'s commitment to wisdom over power, truth over idealism, setting foundation for series-long character development',
      sensoryDetail: 'Quiet conversation in train quarters, Dante sharing chronicle-keeper burdens, weight of responsibility settling on Francisco with new understanding',
      internalConflict: 'Francisco\'s despair that corruption is inevitable versus hope in finding different path, fear he\'s already corrupted versus determination to change approach',
      characterGrowthElement: 'Francisco commits to seeking wisdom-based approach, accepting that seeing clearly after disillusionment enables building something genuine and true',
      seriesConnectionResonance: 'Commitment to wisdom over power becomes Francisco\'s guiding principle through series, culminating in Book 9 ultimate choice',
      sceneCardProgression: 109,
      realWorldContext: 'Private quarters on Zanetti Train where Francisco can process and commit to new path',
      timelineSignificance: 'Night of revelation day—ending with commitment to different approach',
      saveTheCatBeat: 'Fun and Games conclusion - establishing philosophical foundation for wisdom-based path',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow reflective - space for commitment and resolution',
        tension_level: 'Low to moderate - internal resolution after crisis',
        emotional_arc: 'Despair → Dialogue → Understanding → Determination',
      }),
      learning_objectives: JSON.stringify([
        'Ground actions in truth and clear seeing rather than idealistic illusions',
        'Commit to wisdom-based approach valuing acceptance over control',
        'Recognize that disillusionment enables building something genuine',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Wisdom over power philosophy (tested throughout series)',
        'Chronicle-keeper responsibility theme (explored in Book 6)',
        'Building from truth after illusions shatter (Book 9 resolution foundation)',
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
        chapterId: ch48.id,
        chapterUniqueIdentifier: 'EA-048',
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
    .where(eq(scenes.chapterId, ch48.id));

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

  console.log('\n✅ EA-048 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
