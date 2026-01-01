import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-099: Ambition (Book 3, Chapter 19)...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-099'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-099 not found. Run create-ea-099-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene 1: The Workshop
  console.log('📝 Processing Scene 1: The Workshop');
  const scene1Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-099',
    sceneNumber: 1,
    title: 'The Workshop',
    setup: 'The Armory. Heat. Noise. The Twin Scholars are enchanting arrows. Francisco inspects them. He rejects one. \'Do it again.\' The standard is perfection.',
    symbolism: 'The Hammer and Anvil.',
    beatGoal: 'The Standard. establishing stakes.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Excellence',
    scene_tone: 'Hard',
    timeline_date: '6/16/1321 - Day',
    timeline_variant: 'Sanctuary',
    location: 'Armory',
  };

  const [insertedScene1] = await db.insert(scenes).values(scene1Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene1.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 271 - 274',
      description: 'Armory-heat Noise-industrial Twin-Scholars arrows-enchanting Francisco inspecting-meticulous rejecting-one Do-it-again commanding standard-perfection demanding Eight-Disks energy-discipline hammering-crafting Ambition-not-dream but-discipline Excellence-requiring Hard-tone Hammer-Anvil symbolism Process-demonstrating mastery-demanding refugees-to-army transformation-continuing.',
      focus: truncate('Francisco demanding perfection armory crafting discipline.', 255),
      chapterSceneFocus: truncate('Ch99S1: Armory-heat Twin-Scholars enchanting Francisco inspecting rejecting Do-it-again standard-perfection Eight-Disks Ambition-discipline Excellence Hard Hammer-Anvil Process mastery-demanding refugees-army.', 255),
      preliminarySceneFocus: truncate('Francisco perfection demanding workshop discipline mastery', 255),
      preliminarySceneDescription: 'Francisco demands perfection in armory workshop establishing discipline',
      narrativeFunction: 'Introduces Eight of Disks Ambition through Process Standard-establishing discipline-not-dreams demonstrating; shows Road of Trials preparation-meticulous detail-work apprenticeship-mastery requiring; establishes Factory-Sanctuary transformation refugees-to-army professional-becoming; demonstrates logistics magic-requiring physical-components crafting-essential; sets-up calm-before-storm pacing preparation-relentless before climax-incoming.',
      sensoryDetail: 'Heat oppressive forge-fires blazing sweat-inducing atmosphere-intense, noise industrial hammering-metal ringing-anvil clanging-rhythmic workshop-cacophony, arrows magical enchantments-glowing runes-traced precision-requiring Twin-Scholars concentration-intense, Francisco eyes-critical inspecting-meticulous flaw-detecting single-imperfection rejecting, rejection arrow-discarded Do-it-again command-sharp Excellence-demanding tone-brooking-no-compromise, Hammer-Anvil sounds-rhythmic metal-working discipline-embodying craft-mastery.',
      internalConflict: 'Francisco believing perfection-necessary lives-depending mission-critical versus awareness team-exhausting burnout-risking La-Signora concern-valid; Ambition-disciplined Drive-mastery pursuing versus cost-human fatigue-accumulating; standard-high maintaining world-saving justifying versus compassion-lacking EA-098 coldness-continuing; taskmaster-role embracing versus relationship-cost recognizing warmth-still-absent.',
      characterGrowthElement: 'Francisco demonstrating Eight-Disks Ambition-disciplined apprenticeship-mastery detail-work perfection-requiring Drive-embodying; showing Ambition-not-dream but-discipline teaching hard-work glorifying preparation-meticulous valuing; taskmaster-effective becoming standard-high establishing army-professional building; continuing EA-098 weapon-state coldness-efficiency but purpose-noble mission-focused.',
      seriesConnectionResonance: 'EA-098 Focus-toxic spell-completed now applying preparation-beginning; EA-097 Keystone-discovered Crypt-location returning extraction-mission preparing; crafted-gear Book-4 using items-significant creating; refugees-army transformation EA-092 beginning now completing professional-force becoming; calm-before-storm All-is-Lost setup approaching climax-preparing.',
      sceneCardProgression: 310,
      realWorldContext: '1321 medieval armory workshop-essential military-preparation requiring, enchanting magical-crafting rune-work precision-demanding error-costly, apprenticeship mastery-through-discipline medieval-pedagogy standard, perfection military-necessity lives-depending equipment-failure fatal, heat forge-work intense physical-demanding conditions-harsh, Twin-Scholars magical-specialists expertise-technical collaboration-requiring.',
      timelineSignificance: '6/16/1321 Day—day after EA-098 evening emergence-cold, preparation-beginning Ambition-disciplined Workshop-establishing standard-perfection, days-of-work starting Road-of-Trials grinding-preparation calm-before-storm, Part-2 ending-approaching Climax-setup mission-launching imminent.',
      saveTheCatBeat: 'The Road of Trials preparation discipline',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Forge heat hammering anvil enchanted arrows inspection rejection',
        emotional_core: 'Excellence determination discipline perfection',
        character_state: 'Francisco demanding meticulous taskmaster cold-efficient'
      }),
      learning_objectives: JSON.stringify([
        'Drive mastery - perfection through discipline detail-work apprenticeship',
        'Eight of Disks Ambition - not dreams but disciplined hard-work preparation',
        'Logistics magic - physical components requiring crafting essential preparation'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Crafted gear Book 4 using items significance future',
        'Burnout danger La Signora seeing Scene 2-3 exhaustion mounting',
        'Trap unknown Scene 4 ominous Francisco unaware danger approaching',
        'All is Lost setup calm before storm climax imminent'
      ]),
    })
    .where(eq(scenes.id, insertedScene1.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 2: The Drill
  console.log('📝 Processing Scene 2: The Drill');
  const scene2Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-099',
    sceneNumber: 2,
    title: 'The Drill',
    setup: 'Training ground. They practice the formation for the Crypt. Again. And again. \'Ambition demands sweat.\' They are wet, muddy, angry. But they get it right.',
    symbolism: 'The Mud.',
    beatGoal: 'The Competence. Forging the team.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Exhaustion',
    scene_tone: 'Gritty',
    timeline_date: '6/18/1321 - Afternoon',
    timeline_variant: 'Sanctuary',
    location: 'Courtyard',
  };

  const [insertedScene2] = await db.insert(scenes).values(scene2Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene2.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 275 - 278',
      description: 'Training-ground formation-Crypt practicing-repeating Again-and-again relentless Ambition-demands-sweat declaring wet-muddy-angry team-suffering but-getting-right Competence-forging Hardening-team Mud-symbolism Exhaustion-feeling Gritty-tone steam-bodies shout-commander footsteps-synchronized discipline-building army-professional.',
      focus: truncate('Team drilling formation exhausted but competent emerging.', 255),
      chapterSceneFocus: truncate('Ch99S2: Training-ground formation-practicing Again-and-again Ambition-demands-sweat wet-muddy-angry getting-right Competence-forging Hardening Mud Exhaustion Gritty steam-bodies synchronized-footsteps.', 255),
      preliminarySceneFocus: truncate('Team drilling exhaustion competence forging hardening', 255),
      preliminarySceneDescription: 'Team drills formation repeatedly exhausted angry but achieving competence',
      narrativeFunction: 'Develops Eight-Disks Ambition through Hardening Competence-forging repetition-disciplined sweat-demanding; demonstrates Road-of-Trials grinding-preparation team-building professional-army creating; shows Exhaustion-cost burnout-danger La-Signora concern-validated fatigue-mounting; establishes Gritty-tone industrial-discipline harsh-but-necessary training-relentless; builds toward Scene-3 inspiration-needed morale-restoring purpose-realigning.',
      sensoryDetail: 'Training-ground mud-churned earth-soft slippery-footing challenging, bodies-wet sweat-soaked rain-possibly exertion-evident steam-rising heat-body cold-air meeting, mud-splattered uniforms-stained boots-heavy earth-clinging movement-impeding, shout-commander voice-hoarse commands-barking drill-calling relentless-driving, footsteps-synchronized rhythm-military precision-emerging chaos-to-order transformation, anger-visible faces-strained frustration-mounting exhaustion-physical mental-fatigue grinding, formation-Crypt tactical-movement coordinated-precise complexity-demanding practice-essential.',
      internalConflict: 'Francisco driving-relentless Ambition-demanding sweat-requiring versus awareness team-exhausted anger-mounting burnout-approaching; belief preparation-necessary lives-saving mission-success requiring versus compassion team-suffering acknowledging; Drive-mastery pursuing competence-achieving versus cost-human relationships-straining EA-098 coldness-persisting; pride in competence-emerging synchronized-movement versus concern fatigue-excessive sustainability-questioning.',
      characterGrowthElement: 'Francisco demonstrating Eight-Disks discipline-relentless Ambition-sweat demanding hard-work glorifying; showing Drive-mastery competence-forging through repetition-endless practice-disciplined; taskmaster-effective team-professional creating refugees-to-army transforming capability-building; but EA-098 coldness-continuing warmth-still-absent compassion-limited efficiency-prioritizing humanity-secondary.',
      seriesConnectionResonance: 'Scene-1 Workshop-perfection now Drill-competence building preparation-layered comprehensive; EA-097 Crypt-formation practicing return-mission preparing extraction-attempting; Scene-3 Speech-inspiration needed morale-restoring exhaustion-addressing; La-Signora burnout-concern Scene-1 mentioned now validating team-limit approaching; calm-before-storm tension-building All-is-Lost setup continuing.',
      sceneCardProgression: 311,
      realWorldContext: '1321 medieval military-training drill-formation essential coordinated-tactics requiring, repetition-endless muscle-memory building medieval-pedagogy physical, mud training-ground weather-exposed conditions-harsh realistic-combat simulating, exhaustion physical-limit testing endurance-building soldier-hardening, synchronized-movement formation-fighting effectiveness-military coordinated-discipline requiring, commander-shout drill-sergeant role-traditional authority-establishing.',
      timelineSignificance: '6/18/1321 Afternoon—days after Scene-1 workshop-beginning preparation-continuing grinding-relentless, team-drilling formation-Crypt competence-emerging exhaustion-mounting, Scene-3 night-before speech-approaching morale-needing, Road-of-Trials hardening-process Part-2 ending-nearing Climax-setup advancing.',
      saveTheCatBeat: 'The Road of Trials competence forging',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Mud steam bodies synchronized footsteps commander shouting',
        emotional_core: 'Exhaustion determination grit competence emerging',
        character_state: 'Team exhausted angry competent Francisco driving relentless',
        key_visual_details: [
          'The steam rising from bodies.',
          'The shout of the commander.',
          'The synchronized footsteps.'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Drive mastery - competence through repetition endless practice disciplined',
        'Eight of Disks Ambition sweat - hard work physical demanding discipline requiring',
        'Team forging - individual to collective transformation coordination building'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Exhaustion mounting Scene 3 inspiration desperately needed',
        'Burnout danger Scene 4 trap surviving questionable fatigue-impaired',
        'Competence achieved but cost high team-damaged morale-low',
        'Formation Crypt specific Scene 4 using mission executing'
      ]),
    })
    .where(eq(scenes.id, insertedScene2.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 3: The Speech
  console.log('📝 Processing Scene 3: The Speech');
  const scene3Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-099',
    sceneNumber: 3,
    title: 'The Speech',
    setup: 'Night before the mission. Francisco gathers them. He uses \'Ambition\' to inspire. \'We are not just surviving anymore. We are taking back tomorrow.\' He connects their hard work (8 of Disks) to the glorious potential.',
    symbolism: 'The Banner.',
    beatGoal: 'The Inspiration. Re-aligning purpose.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Hope',
    scene_tone: 'Rallying',
    timeline_date: '6/19/1321 - Night',
    timeline_variant: 'Sanctuary',
    location: 'Mess Hall',
  };

  const [insertedScene3] = await db.insert(scenes).values(scene3Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene3.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 279 - 282',
      description: 'Night-before-mission Francisco gathering-team Ambition-using inspire We-not-just-surviving-anymore We-taking-back-tomorrow declaring hard-work-Eight-Disks connecting glorious-potential linking Inspiration-delivering purpose-realigning Hope-restoring Rallying-tone Banner-symbolism Launchpad-creating Start-with-Why vision-casting morale-restoring exhaustion-transcending.',
      focus: truncate('Francisco inspiring team vision casting hope restoring.', 255),
      chapterSceneFocus: truncate('Ch99S3: Night-before Francisco gathering Ambition-inspire We-taking-back-tomorrow hard-work-to-potential connecting Inspiration purpose-realigning Hope Rallying Banner Launchpad Start-with-Why vision-casting.', 255),
      preliminarySceneFocus: truncate('Francisco speech inspiration hope vision casting', 255),
      preliminarySceneDescription: 'Francisco delivers inspiring speech connecting hard work to glorious vision',
      narrativeFunction: 'Resolves Eight-Disks Ambition through Inspiration Launchpad purpose-realigning vision-casting; demonstrates Start-with-Why leadership connecting hard-work-discipline to glorious-potential meaning-providing; shows Hope-restoring morale-rebuilding exhaustion-transcending mission-eve rallying; establishes Banner-symbolism collective-purpose united-vision army-cohesion creating; transitions toward Scene-4 Departure Part-2 ending mission-launching.',
      sensoryDetail: 'Mess-hall gathered team-assembled faces-tired anticipation-mixed night-before atmosphere-charged, Francisco standing-central commanding-presence voice-carrying speech-delivering passionate-controlled, Ambition-word resonating purpose-evoking not-just-surviving-anymore transformation-verbal articulating, taking-back-tomorrow phrase-powerful future-claiming agency-asserting hope-generating, hard-work connection-explicit Eight-Disks discipline-suffered now-meaningful potential-glorious linking sacrifice-justified, Banner-symbolism visual-implicit collective-rallying unity-forging purpose-shared vision-common.',
      internalConflict: 'Francisco recognizing exhaustion-team morale-low inspiration-needed versus authenticity speech-genuine belief-real; Drive-mastery achieved competence-built now-requiring Why-purpose meaning-providing motivation-intrinsic restoring; pride in preparation-complete army-built versus awareness trap-unknown danger-approaching confidence-fragile; EA-098 coldness-thawing slightly humanity-glimpsing connection-attempting warmth-partial not-full.',
      characterGrowthElement: 'Francisco demonstrating Start-with-Why leadership vision-casting purpose-providing Why-articulating not-just-What-How but-meaning deeper; showing Ambition-positive inspiring-motivating not-just-demanding but-connecting discipline-to-vision hard-work-to-potential; EA-098 coldness-slightly-thawing humanity-glimpsing team-connection attempting warmth-partial leadership-evolution; Eight-Disks completing apprenticeship-mastery now-purposeful mission-meaningful.',
      seriesConnectionResonance: 'Scene-1-2 grinding-preparation exhaustion-mounting now-transcending inspiration-providing purpose-restoring; EA-098 coldness-thawing slightly humanity-glimpsing connection-attempting; EA-092 warmth-lost now-partially-restoring hope-generating; Scene-4 Departure-imminent mission-launching Part-2 ending; We-taking-back-tomorrow vision-powerful Keystone-quest meaning-deeper timeline-protecting civilization-saving.',
      sceneCardProgression: 312,
      realWorldContext: '1321 medieval pre-battle speech-tradition morale-essential military-leadership inspiring, mess-hall communal-space gathering-natural social-cohesion building, night-before mission-eve atmosphere-charged anticipation-fear-hope mixing, Start-with-Why Simon-Sinek principle medieval-application vision-leadership timeless, Banner-symbolism medieval-heraldry collective-identity unity-visual representing, surviving-to-thriving transition refugee-to-agent transformation purpose-finding.',
      timelineSignificance: '6/19/1321 Night—night before Scene-4 dawn departure-imminent mission-eve critical, Francisco speech-delivering inspiration-providing morale-restoring exhaustion-transcending, days-of-preparation culminating purpose-realigning vision-casting, Part-2 Children-of-Voice ending-approaching Road-of-Trials completing Climax-launching tomorrow-dawn.',
      saveTheCatBeat: 'The Road of Trials inspiration purpose',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Mess hall gathered Francisco standing banner vision taking tomorrow',
        emotional_core: 'Hope inspiration purpose vision morale restored',
        character_state: 'Francisco inspiring passionate vision-casting humanity-glimpsing'
      }),
      learning_objectives: JSON.stringify([
        'Start with Why vision - purpose providing meaning deeper motivation intrinsic',
        'Ambition positive - not just demanding but inspiring connecting discipline to vision',
        'Leadership evolution - EA-098 coldness thawing humanity glimpsing connection attempting'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Taking back tomorrow vision powerful but trap unknown ironic',
        'Scene 4 departure dawn imminent Part 2 ending climax launching',
        'Trap he doesn\'t know about yet ominous confidence fragile',
        'Glorious potential contrasting All is Lost incoming reversal'
      ]),
    })
    .where(eq(scenes.id, insertedScene3.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 4: The Departure
  console.log('📝 Processing Scene 4: The Departure');
  const scene4Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-099',
    sceneNumber: 4,
    title: 'The Departure',
    setup: 'Dawn. They march out. They look like pros. Francisco watches them. He is tired but proud. His \'Ambition\' has built this. Now they just have to survive the trap he doesn\'t know about yet.',
    symbolism: 'The Rising Sun.',
    beatGoal: 'Resolution. Moving to the Climax.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Pride/Anxiety',
    scene_tone: 'Epic',
    timeline_date: '6/20/1321 - Dawn',
    timeline_variant: 'Gate',
    location: 'Sanctuary Exit',
  };

  const [insertedScene4] = await db.insert(scenes).values(scene4Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene4.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 283 - 285',
      description: 'Dawn-breaking marching-out professionals-looking Francisco watching-them tired-but-proud Ambition-built-this army-created refugees-transformed Now-survive-trap-unknown ominous-foreshadowing Resolution-achieving Climax-moving Part-2-ending Rising-Sun symbolism Epic-tone gear-clanking last-look-back jaw-setting determination-mixed-anxiety.',
      focus: truncate('Army departs professional Francisco proud trap unknown ominous.', 255),
      chapterSceneFocus: truncate('Ch99S4: Dawn marching-out professionals Francisco tired-proud Ambition-built Now-survive-trap-unknown Resolution Climax-moving Part-2-ending Rising-Sun Epic gear-clanking last-look jaw-setting.', 255),
      preliminarySceneFocus: truncate('Departure professional army trap-unknown ominous foreshadowing', 255),
      preliminarySceneDescription: 'Professional army departs dawn Francisco proud but trap unknown ominous',
      narrativeFunction: 'Resolves Eight-Disks Ambition through Resolution departure-achieving army-built mission-launching Part-2-ending; demonstrates Climax-moving Road-of-Trials completing All-is-Lost approaching setup-complete; shows Pride-earned Ambition-disciplined refugees-to-army transformation-complete professional-force created; establishes Anxiety-ominous trap-unknown foreshadowing disaster-approaching confidence-fragile irony-tragic; completes Part-2 Children-of-Voice ending Climax-Book-3 launching.',
      sensoryDetail: 'Dawn-light breaking horizon-orange sky-clearing new-day symbolic fresh-start illusion, marching-out synchronized-footsteps rhythm-military discipline-visible coordination-impressive professional-appearance army-real, gear-clanking metal-on-metal equipment-quality crafted-Scene-1 enchanted-arrows containment-box preparation-visible tangible, Francisco position-elevated watching-them commander-perspective exhaustion-visible face-lined pride-evident eyes-shining accomplishment-feeling, last-look-back home-sanctuary moment-poignant uncertainty-underlying departure-permanent-possibly emotional-weight, jaw-setting determination-visible anxiety-underlying Pride-Anxiety mixed trap-unknown ominous-ignorance bliss-false confidence-doomed.',
      internalConflict: 'Francisco feeling Pride-earned Ambition-built army-created refugees-transformed accomplishment-legitimate versus Anxiety-underlying trap-unknown danger-unaware confidence-false; satisfaction preparation-complete competence-achieved versus exhaustion-bone-deep fatigue-accumulated burnout-approaching; belief mission-success inevitable preparation-sufficient versus reality trap-waiting disaster-approaching All-is-Lost imminent; EA-098 Focus-spell trusting extraction-plan relying versus flaw-undetected consequences-catastrophic.',
      characterGrowthElement: 'Francisco completing Eight-Disks Ambition-disciplined apprenticeship-mastery army-built refugees-transformed professional-force created; demonstrating Drive-achievement mastery-earned competence-built through discipline-relentless preparation-meticulous; Pride-justified feeling accomplishment-real leadership-effective transformation-visible; but trap-unknown Anxiety-warranted confidence-false disaster-approaching irony-tragic hubris-remnant EA-097 consequences-delayed.',
      seriesConnectionResonance: 'Scene-1-2-3 preparation-grinding inspiring-rallying now-culminating departure-launching mission-beginning; EA-097 Crypt-location returning Keystone-extracting attempting; EA-098 Focus-spell extraction-plan using flaw-containing disaster-causing; Part-2 Children-of-Voice ending Road-of-Trials completing All-is-Lost approaching; trap-unknown ominous Climax-disaster foreshadowing crafted-gear Book-4 survivors-using implication-catastrophe; Rising-Sun ironic false-dawn disaster-approaching not-triumph.',
      sceneCardProgression: 313,
      realWorldContext: '1321 medieval army-departure dawn-symbolic new-beginning military-tradition optimistic, professional-appearance discipline-visible training-evident competence-demonstrated preparation-complete, gear-quality equipment-crafted enchanted-magical medieval-fantasy warfare-magical requiring, commander-watching leader-responsibility burden-visible pride-mixed-concern natural, last-look-back departure-ritual emotional-weight uncertainty-acknowledging mortality-aware, trap-military ambush-danger medieval-warfare common preparation-insufficient sometimes irony-tragic.',
      timelineSignificance: '6/20/1321 Dawn—departure-day mission-launching Crypt-returning Keystone-extracting attempting, Part-2 Children-of-Voice ending-complete Road-of-Trials finishing All-is-Lost approaching-imminent, trap-unknown disaster-waiting EA-098 spell-flaw consequences-catastrophic manifesting-soon, Book-3 Climax-launching turning-point critical triumph-to-disaster reversing preparation-insufficient revealed.',
      saveTheCatBeat: 'The Road of Trials resolution departure',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Dawn rising army marching synchronized gear clanking last look',
        emotional_core: 'Pride anxiety determination ominous tragic irony',
        character_state: 'Francisco proud tired determined anxious unknowing doomed',
        key_character_moments: [
          'The clanking of gear.',
          'The last look back at home.',
          'Francisco setting his jaw.'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Eight of Disks Ambition complete - disciplined preparation army built transformation achieved',
        'Drive mastery earned - competence demonstrated through relentless preparation',
        'Tragic irony - confidence false trap unknown disaster approaching preparation insufficient',
        'Part 2 ending - Road of Trials completing All is Lost setup complete'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Trap unknown ominous explicit disaster imminent All is Lost',
        'EA-098 spell flaw catastrophic consequences manifesting soon',
        'Crafted gear Book 4 survivors using implication disaster catastrophic',
        'Rising Sun ironic false dawn not triumph but disaster approaching',
        'Pride before fall again EA-097 hubris pattern repeating consequences delayed'
      ]),
    })
    .where(eq(scenes.id, insertedScene4.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Verify all scenes
  console.log('🔍 Verifying field completion...\n');
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = [
      'chapterId', 'chapterUniqueIdentifier', 'sceneNumber', 'title', 'setup',
      'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone',
      'timeline_date', 'timeline_variant', 'location', 'pages', 'description',
      'focus', 'chapterSceneFocus', 'preliminarySceneFocus', 'preliminarySceneDescription',
      'narrativeFunction', 'sensoryDetail', 'internalConflict', 'characterGrowthElement',
      'seriesConnectionResonance', 'sceneCardProgression', 'realWorldContext',
      'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
      'learning_objectives', 'foreshadowing_elements'
    ];

    const presentFields = fields.filter(field => {
      const value = scene[field as keyof typeof scene];
      return value !== null && value !== undefined && value !== '';
    });

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentFields.length}/${fields.length - 1}`);
  }

  console.log('\n✅ EA-099 import complete!\n');
  console.log('📋 The Eight of Disks Ambition - The army departs, but the trap awaits!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
