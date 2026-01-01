import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-098: Focus (Book 3, Chapter 18)...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-098'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-098 not found. Run create-ea-098-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene 1: The Shut In
  console.log('📝 Processing Scene 1: The Shut In');
  const scene1Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-098',
    sceneNumber: 1,
    title: 'The Shut In',
    setup: 'Francisco slams the door. \'Disturb me and we fail.\' He begins the calculations. The Ace of Swords—cutting away the noise. The noise is his friends.',
    symbolism: 'The Locked Door. The Knife.',
    beatGoal: 'The Withdrawal. Entering the deep state.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Detachment',
    scene_tone: 'Claustrophobic',
    timeline_date: '6/13/1321 - Day 1',
    timeline_variant: 'Study',
    location: 'Quarters',
  };

  const [insertedScene1] = await db.insert(scenes).values(scene1Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene1.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 256 - 259',
      description: 'Francisco door-slamming Disturb-me-and-we-fail declaring calculations-beginning Ace-Swords cutting-noise-away noise-being-friends isolation-choosing Withdrawal-entering deep-state-beginning Locked-Door symbolism Knife-sharp focus-singular Detachment-feeling Claustrophobic-tone study-darkening obsession-beginning EA-097 hubris-reversal toxic-Focus emerging humanity-sacrificing.',
      focus: truncate('Francisco isolating himself beginning toxic obsession.', 255),
      chapterSceneFocus: truncate('Ch98S1: Francisco door-slamming Disturb-me-fail calculations-beginning Ace-Swords cutting-noise friends-rejecting Withdrawal deep-state Locked-Door Knife Detachment Claustrophobic study-darkening obsession-beginning toxic-Focus.', 255),
      preliminarySceneFocus: truncate('Francisco isolating detachment withdrawal beginning', 255),
      preliminarySceneDescription: 'Francisco slams door isolating himself beginning obsessive calculations',
      narrativeFunction: 'Introduces Ace of Swords Focus toxic-extreme through Withdrawal Shift-Negative; reverses EA-097 Triumph celebration showing hubris-consequence isolation-destructive; demonstrates Build-up setup magical-cost dangerous-mental-states requiring; establishes Deep Work dark-side concentration-extreme humanity-sacrificing relationships-abandoning; begins team-friction EA-092 warmth-ending honeymoon-over.',
      sensoryDetail: 'Door slamming wood-impacting frame-shaking sound-final decisive separating, lock clicking metal-on-metal isolation-sealing withdrawal-physical, study air stale confined breathing-shallow space-closing claustrophobic-pressing, candlelight flickering shadows-dancing parchment-illuminating calculations-complex, Francisco breath steady controlled entering-trance deep-state-beginning detachment-emerging emotions-suppressing, silence oppressive complete friends-absence noise-eliminated focus-absolute.',
      internalConflict: 'Francisco believing isolation-necessary success-requiring total-focus versus awareness friends-needing leadership-requiring connection-human; determination Keystone-extraction solving world-saving versus cost-personal relationships-sacrificing; Ace-Swords clarity-demanding noise-cutting versus noise-being-people care-who; Deep Work achieving productivity-maximum versus humanity-losing balance-abandoning toxic-becoming.',
      characterGrowthElement: 'Francisco demonstrating Ace of Swords extreme-clarity focus-singular achieving but humanity-sacrificing; Deep Work dark-side showing concentration-absolute productivity-maximum but relationships-destroying isolation-toxic; EA-097 hubris-reversal arrogance leading to obsession-dangerous Nothing-can-stop-us becoming self-fulfilling-isolation; losing-himself work-consuming identity-eroding.',
      seriesConnectionResonance: 'EA-097 Scene 4 Hubris-celebration reversing sharply toxic-isolation contrasting; EA-092 Abundance-warmth camaraderie now ending team-friction beginning; EA-093 Hierophant-burden leadership-cost now manifesting isolation-destructive neglect-cruel; magical-cost theme establishing high-level-magic dangerous-mental-states requiring; extraction-spell developing flaw-containing later-biting consequence-foreshadowing.',
      sceneCardProgression: 306,
      realWorldContext: '1321 medieval magical-study requiring isolation-extreme concentration-absolute distractions-eliminating, scholar-life monastic-discipline self-imposed hermitage-temporary, deep-state trance-like flow-state achieving ancient-practice meditation-related, locked-door physical-boundary establishing social-withdrawal symbolic, calculations-complex mathematical-magical rune-work precision-requiring error-fatal stakes-high.',
      timelineSignificance: '6/13/1321 Day 1—day after EA-097 night celebration-hubris, Francisco isolation-beginning door-slamming withdrawal-entering, three-day obsession-period starting Build-up setup Road-of-Trials advancement, Ace-Swords Focus toxic-extreme demonstrating magical-cost paying humanity-sacrificing.',
      saveTheCatBeat: 'Build-up (set-up) withdrawal isolation beginning',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Door slamming locked candlelight calculations parchment',
        emotional_core: 'Detachment isolation withdrawal obsession beginning',
        character_state: 'Francisco detached withdrawn entering trance'
      }),
      learning_objectives: JSON.stringify([
        'Deep Work dark side - concentration extreme but relationships destroying isolation toxic',
        'The One Thing toxic application - focus singular everything else eliminating including people',
        'Ace of Swords clarity - cutting away noise but noise being friends humanity sacrificing'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Three day isolation Scene 2-3 escalating Scene 4 emergence cold',
        'Extraction spell developing flaw later consequences',
        'Francisco losing humanity weapon becoming Scene 4 Machine symbolism',
        'Team friction beginning EA-092 warmth ending permanently damaged'
      ]),
    })
    .where(eq(scenes.id, insertedScene1.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 2: The Interruption
  console.log('📝 Processing Scene 2: The Interruption');
  const scene2Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-098',
    sceneNumber: 2,
    title: 'The Interruption',
    setup: 'A novice knocks. \'Master, the scouts...\' Francisco blasts the door with a silencing ward. He doesn\'t even answer. He is tracing a complex rune. A mistake means death.',
    symbolism: 'The Silence.',
    beatGoal: 'The Rejection. Choosing work over people.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Annoyance',
    scene_tone: 'Hostile',
    timeline_date: '6/14/1321 - Day 2',
    timeline_variant: 'Study',
    location: 'Quarters',
  };

  const [insertedScene2] = await db.insert(scenes).values(scene2Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene2.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 260 - 263',
      description: 'Novice-knocking Master-scouts reporting-attempting Francisco silencing-ward blasting door-magical answer-refusing rune-tracing complex mistake-death-meaning Rejection-demonstrating work-over-people choosing Silence-symbolism Annoyance-feeling Hostile-tone Escalation-building dark-circles eyes ink-stains fingers food-uneaten tray-ignored deterioration-physical obsession-deepening.',
      focus: truncate('Francisco rejecting interruption with hostile magic.', 255),
      chapterSceneFocus: truncate('Ch98S2: Novice-knocking Francisco silencing-ward blasting answer-refusing rune-tracing mistake-death Rejection work-over-people Silence Annoyance Hostile Escalation dark-circles ink-stains food-uneaten deterioration-physical.', 255),
      preliminarySceneFocus: truncate('Francisco hostile rejection ward blasting escalation', 255),
      preliminarySceneDescription: 'Francisco blasts door with silencing ward refusing to answer novice',
      narrativeFunction: 'Develops Ace of Swords Focus toxic-obsession through Rejection Escalation work-over-people prioritizing; demonstrates magical-cost physical-deterioration mental-state dangerous requiring; shows team-friction honeymoon-over novice-intimidated scouts-information ignored leadership-failing; establishes Hostile-tone Annoyance-emotion francisco-humanity eroding compassion-losing; builds toward Scene 3 Breakdown confrontation-inevitable.',
      sensoryDetail: 'Knocking sound timid hesitant door-wood tapping interruption-unwanted intrusion-perceived, silencing-ward magic-blast purple-energy flaring door-shuddering repelling-force violent-response disproportionate, novice voice cutting-off mid-sentence silence-sudden oppressive magic-suppressing communication-refusing, rune-tracing ink-wet precision-requiring hand-steady trembling-slight exhaustion-fighting concentration-absolute, dark-circles eyes purple-black skin-pale sickly deterioration-visible, ink-stains fingers black-blue permanent work-evidence obsession-marking, food-tray corner-abandoned bread-moldy water-stagnant untouched-days self-neglect extreme.',
      internalConflict: 'Francisco feeling Annoyance-interruption shattering-concentration flow-state breaking versus awareness scouts-information potentially-important duty-neglecting; belief work-justifying any-cost including hostility-toward-subordinates versus recognition behavior-inappropriate cruel-becoming; rune-precision requiring error-fatal stakes-real versus isolation-choice relationships-sacrificing unnecessary; Deep-Work defending versus humanity-losing acknowledging-refusing.',
      characterGrowthElement: 'Francisco demonstrating Ace-Swords extreme-focus but compassion-losing empathy-eroding Hostile-response disproportionate; physical-deterioration showing magical-cost high-level-work demanding dark-circles food-refusal self-care abandoning; Rejection-choosing work-over-people systematically isolating becoming-weapon Machine-transformation beginning; Deep-Work dark-side escalating productivity-obsession health-sacrificing relationships-destroying.',
      seriesConnectionResonance: 'Scene 1 Withdrawal-isolation now Escalation-hostility deepening deterioration-accelerating; Scene 3 Breakdown-confrontation approaching La-Signora intervention-necessary; scouts-information ignored tactical-negligence leadership-failing EA-096 Mental-Agility abandoning; EA-092 warmth-team contrast-sharp hostility-now shocking; extraction-spell progress-making but cost-mounting consequences-building.',
      sceneCardProgression: 307,
      realWorldContext: '1321 medieval master-apprentice hierarchy novice-subordinate relationship-disrespected, silencing-ward magical-violence communication-suppressing authority-abusing, rune-work precision-demanding error-fatal magical-consequences real deadly, physical-deterioration scholar-neglect medieval-common health-secondary work-primary, food-preservation limited molding-quick days-passing visible, deep-work flow-state interruption-catastrophic concentration-fragile context-switching costly.',
      timelineSignificance: '6/14/1321 Day 2—second day isolation-continuing deterioration-accelerating, Francisco Hostile-escalation novice-rejecting scouts-ignoring leadership-failing, Scene 3 Day-3 breakdown-approaching confrontation-imminent, Build-up setup magical-cost demonstrating physical-mental toll-mounting Ace-Swords toxic-Focus deepening.',
      saveTheCatBeat: 'Build-up (set-up) escalation hostility',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Silencing ward purple blast dark circles ink stains uneaten food',
        emotional_core: 'Annoyance hostility rejection obsession deepening',
        character_state: 'Francisco deteriorating hostile obsessed',
        key_visual_details: [
          'The dark circles under his eyes',
          'The ink stains on his fingers',
          'The uneaten tray of food'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Deep Work dark side escalation - hostility toward interruption disproportionate humanity losing',
        'The One Thing toxic - ignoring scouts information duty neglecting people rejecting',
        'Physical cost magical work - deterioration visible health sacrificing obsession demanding'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Scene 3 La Signora key using forced entry intervention',
        'Physical deterioration unsustainable collapse approaching',
        'Scouts information ignored tactical consequences later',
        'Novice fear Francisco reputation damaged leadership credibility eroding'
      ]),
    })
    .where(eq(scenes.id, insertedScene2.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 3: The Breakdown
  console.log('📝 Processing Scene 3: The Breakdown');
  const scene3Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-098',
    sceneNumber: 3,
    title: 'The Breakdown',
    setup: 'La Signora enters (she has a key). She sees his state. \'This is not Focus, Francisco. This is madness.\' He holds up the parchment. \'It is done.\' He expects praise. She gives him pity. \'At what cost?\'',
    symbolism: 'The Completed Equation.',
    beatGoal: 'The Confrontation. Reality check.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Confusion',
    scene_tone: 'Dramatic',
    timeline_date: '6/15/1321 - Day 3',
    timeline_variant: 'Study',
    location: 'Quarters',
  };

  const [insertedScene3] = await db.insert(scenes).values(scene3Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene3.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 264 - 267',
      description: 'La-Signora key-using entering state-seeing This-not-Focus-this-madness declaring Francisco parchment-holding It-is-done announcing praise-expecting pity-receiving At-what-cost questioning Confrontation-delivering Reality-check providing Completed-Equation symbolism Confusion-feeling Dramatic-tone Climax-Interpersonal achievement-hollow cost-revealed The-One-Thing ignoring-everything-else toxic-application.',
      focus: truncate('La Signora confronts Francisco reality check delivered.', 255),
      chapterSceneFocus: truncate('Ch98S3: La-Signora entering This-not-Focus-madness Francisco parchment-holding praise-expecting pity-receiving At-what-cost Confrontation Reality-check Completed-Equation Confusion Dramatic Climax-Interpersonal achievement-hollow cost-revealed.', 255),
      preliminarySceneFocus: truncate('La-Signora confrontation madness-not-focus cost questioning', 255),
      preliminarySceneDescription: 'La Signora confronts Francisco madness questioning achievement cost',
      narrativeFunction: 'Resolves Ace-Swords Focus toxic-extreme through Confrontation Climax-Interpersonal Reality-check delivering; demonstrates The-One-Thing dark-side ignoring-everything-else including-humanity sanity-mental relationships-team; reveals achievement-hollow spell-completed but cost-devastating people-lost trust-damaged; shows La-Signora wisdom-tarot EA-097 reversed-Nine prophecy-validated; establishes Confusion-Francisco disconnect-reality expectations-praise receiving-pity tragic-irony.',
      sensoryDetail: 'Key turning lock-clicking door-opening intrusion-necessary intervention-forced, La-Signora face-shocked horror-visible concern-deep state-assessing Francisco deterioration-extreme, study room-disaster parchments-scattered ink-spilled candles-burned-low wax-pooled chaos-controlled obsession-evidence, parchment-completed equations-complex runes-intricate triumph-technical achievement-hollow, Francisco hand-trembling holding-up pride-misplaced expecting-validation disconnect-tragic, La-Signora eyes-pitying not-praising sadness-deep At-what-cost voice-soft devastating judgment-gentle, Confusion-Francisco face-showing expecting-different reality-clashing perception-warped.',
      internalConflict: 'Francisco feeling Confusion-profound expecting-praise receiving-pity disconnect-reality obsession-warping perception-distorting; pride in achievement-technical spell-completed world-saving justifying-cost versus reality-check cost-too-high people-lost relationships-damaged; belief Focus-necessary productivity-maximum versus recognition madness-crossed-line sanity-sacrificed; defending-choices I-am-saving-world versus confronting-truth At-what-cost answering-unable.',
      characterGrowthElement: 'Francisco experiencing Reality-check Confrontation-necessary La-Signora delivering wisdom-providing; demonstrating The-One-Thing toxic-extreme everything-else ignored including-sanity humanity relationships; Confusion-emotion showing self-awareness lacking obsession-blinding judgment-impairing disconnect-reality dangerous; achievement-hollow learning spell-completed but victory-pyrrhic cost-devastating people-lost; beginning-recognize madness-not-Focus possibly.',
      seriesConnectionResonance: 'Scene 1-2 isolation-hostility culminating here Confrontation-breaking-point; La-Signora EA-097 Scene-4 reversed-Nine prophecy now validated At-what-cost question-answered; EA-092 Abundance-celebration warmth-team now lost-completely friction-maximum; Scene 4 will show aftermath-cold emergence-weapon Machine-Francisco; extraction-spell completed-technically but flawed-consequence later-biting; magical-cost theme-peak physical-mental toll-maximum.',
      sceneCardProgression: 308,
      realWorldContext: '1321 medieval friendship-bonds La-Signora key-possessing trust-indicating intervention-necessary, madness-versus-genius thin-line scholar-obsession common dangerous, achievement-pyrrhic victory-hollow cost-excessive classical-tragedy theme, Reality-check intervention-friend necessary perspective-external obsession-blinding, pity-not-praise response-unexpected tragic-irony highlighting disconnect-reality, three-day isolation extreme-dangerous health-mental physical-deterioration severe.',
      timelineSignificance: '6/15/1321 Day 3—third day isolation-culmination Confrontation-breaking-point, Francisco spell-completing achievement-technical but cost-revealed devastating, La-Signora intervention-forcing Reality-check delivering, Scene 4 same-evening emergence-cold aftermath-showing Machine-transformation complete, Build-up climax-interpersonal team-friction peak-maximum relationships-damaged possibly-irreparably.',
      saveTheCatBeat: 'Build-up (set-up) confrontation reality check',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Key turning parchment completed pity not praise chaos study',
        emotional_core: 'Confusion disconnect tragic-irony cost-revealed',
        character_state: 'Francisco confused deteriorated expecting-validation receiving-pity'
      }),
      learning_objectives: JSON.stringify([
        'The One Thing toxic extreme - ignoring everything else including sanity humanity relationships',
        'Reality check necessity - external perspective obsession blinding self-awareness lacking',
        'Pyrrhic victory - achievement hollow cost too high success technical failure human'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Extraction spell flaw later consequences Scene 4 using',
        'Relationships damaged possibly irreparable team friction permanent',
        'Francisco weapon transformation Scene 4 Machine completing humanity lost',
        'Cost revealed devastating people starving metaphorically literally Scene 4 cruelty'
      ]),
    })
    .where(eq(scenes.id, insertedScene3.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 4: The Cold Truth
  console.log('📝 Processing Scene 4: The Cold Truth');
  const scene4Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-098',
    sceneNumber: 4,
    title: 'The Cold Truth',
    setup: 'He emerges. He gives the spell to the Scribe. \'Prepare the ritual.\' He walks past the others without a word. He is a weapon now (Ace of Swords). The team follows, but the warmth of EA-092 is gone.',
    symbolism: 'The Machine.',
    beatGoal: 'Resolution. The tool is ready.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Numbness',
    scene_tone: 'Chilling',
    timeline_date: '6/15/1321 - Evening',
    timeline_variant: 'Sanctuary',
    location: 'Hallway',
  };

  const [insertedScene4] = await db.insert(scenes).values(scene4Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene4.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 268 - 270',
      description: 'Francisco emerging spell-delivering Scribe Prepare-ritual commanding walking-past others-ignoring word-without weapon-now Ace-Swords personified Machine-symbolism team-following warmth-EA-092-gone Resolution-cold tool-ready Numbness-feeling Chilling-tone Setup-Finale stiff-shoulders eyes-averted wind-cold humanity-lost transformation-complete.',
      focus: truncate('Francisco emerges cold weapon-like warmth gone.', 255),
      chapterSceneFocus: truncate('Ch98S4: Francisco emerging spell-delivering Prepare-ritual walking-past ignoring weapon-now Ace-Swords Machine team-following warmth-EA-092-gone Resolution tool-ready Numbness Chilling Setup-Finale humanity-lost.', 255),
      preliminarySceneFocus: truncate('Francisco weapon-emerged cold numbness warmth-gone', 255),
      preliminarySceneDescription: 'Francisco emerges weapon-like delivering spell ignoring team coldly',
      narrativeFunction: 'Resolves Ace-Swords Focus toxic-extreme through Resolution-cold Machine-transformation complete weapon-Francisco established; demonstrates Setup-Finale tool-ready spell-completed mission-advancing but cost-permanent humanity-lost warmth-gone; shows team-following but EA-092 camaraderie-destroyed friction-permanent damage-irreparable; embodies Numbness-emotion detachment-complete feelings-suppressed weapon-efficiency prioritizing; completes Build-up setup magical-cost paid consequences-lasting character-changed.',
      sensoryDetail: 'Francisco emergence door-opening posture-stiff mechanical movements-precise emotion-absent zombie-like, spell-parchment handing-off Scribe transaction-cold businesslike warmth-lacking command-terse Prepare-ritual efficiency-only, walking-past team corridor-traversing eye-contact avoiding acknowledgment-refusing presence-ignoring cold-shoulder literal-figurative, team faces-watching eyes-averted fear-respect-mixture warmth-absent following-duty not-love obligation-remaining, shoulders-stiff tension-holding body-language closed defensive isolated-despite-proximity, wind-blowing cold-metaphor literal chill-air-evening atmosphere-matching tone-ominous warmth-EA-092 memory-distant irretrievable-now.',
      internalConflict: 'Francisco feeling Numbness-protective emotions-suppressed cost-acknowledging refusing versus awareness-buried humanity-lost relationships-destroyed irreparable-possibly; pride in spell-completion tool-ready mission-advancing versus emptiness-hollow achievement-technical success-human-failure; belief sacrifice-necessary world-saving justifying versus recognition cost-too-high people-lost forever-maybe; weapon-efficiency embracing versus humanity-mourning unconsciously.',
      characterGrowthElement: 'Francisco completing Ace-Swords transformation weapon-becoming Machine-symbolism humanity-sacrificed efficiency-prioritized; demonstrating toxic-Focus consequence-permanent character-changed relationships-damaged warmth-lost numbness-embraced; Resolution-achieving tool-ready spell-completed but victory-pyrrhic cost-devastating self-lost; Deep-Work dark-side culmination productivity-maximum humanity-minimum trade-off completing extreme-unsustainable.',
      seriesConnectionResonance: 'Scene 3 Confrontation-aftermath this emergence-cold showing La-Signora warning-validated madness-confirmed; EA-092 Abundance-warmth camaraderie-celebration now contrasting-sharply coldness-isolation permanent-loss; EA-097 Hubris-celebration leading through toxic-Focus to this weapon-state transformation-tragic; extraction-spell ready-now finale-approaching Keystone-retrieval imminent but flaw-containing consequences-future; Build-up complete Setup-Finale established team-damaged tool-ready mission-advancing cost-paid.',
      sceneCardProgression: 309,
      realWorldContext: '1321 medieval leader-transformation charismatic-to-tyrant possible obsession-consuming, weapon-metaphor soldier-mentality human-connection sacrificing mission-prioritizing, team-dynamics damaged-permanently trust-broken warmth-lost following-duty not-loyalty, evening-cold temperature-dropping metaphor-literal atmosphere-matching mood-chilling, ritual-preparation magical-operation major-undertaking spell-complex Keystone-extraction attempting dangerous-risky.',
      timelineSignificance: '6/15/1321 Evening—same-day Scene 3 Confrontation-afternoon hours-later emergence-cold, Francisco spell-delivering tool-ready ritual-preparation commanding Setup-Finale establishing, three-day isolation-ending transformation-complete weapon-Francisco emerged humanity-lost, Build-up setup complete magical-cost paid team-damaged Keystone-extraction imminent consequences-approaching.',
      saveTheCatBeat: 'Build-up (set-up) resolution tool ready',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Stiff shoulders averted eyes cold wind spell delivery mechanical',
        emotional_core: 'Numbness coldness emptiness warmth-lost',
        character_state: 'Francisco numb mechanical weapon-like detached',
        key_character_moments: [
          'The stiff set of his shoulders',
          'The averted eyes of the novices',
          'The wind blowing cold'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Ace of Swords weapon transformation - humanity sacrificed efficiency prioritized Machine becoming',
        'Toxic Focus consequence permanent - relationships damaged warmth lost character changed irreparable',
        'Pyrrhic victory completion - tool ready mission advancing but cost devastating self lost',
        'Deep Work dark side culmination - productivity maximum humanity minimum unsustainable extreme'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Extraction spell flaw will cause disaster finale',
        'Team damaged warmth never fully returning trust broken',
        'Francisco weapon-state consequences future chapters exploring',
        'Keystone retrieval imminent finale approaching climax building',
        'Cost permanent humanity lost transformation irreversible possibly'
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

  console.log('\n✅ EA-098 import complete!\n');
  console.log('📋 The Ace of Swords Focus - The tool is ready, but humanity is lost!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
