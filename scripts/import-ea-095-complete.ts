import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-095: Focused Anguish (Book 3, Chapter 15)...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-095'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-095 not found. Run create-ea-095-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene 1: The Nightmare
  console.log('📝 Processing Scene 1: The Nightmare');
  const scene1Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-095',
    sceneNumber: 1,
    title: 'The Nightmare',
    setup: 'Francisco\'s room. 3 AM. He wakes from a vision of the Sanctuary burning. The Nine of Swords imagery—swords hanging over his bed. He can\'t go back to sleep. He feels the \'Anguish\' of potential failure.',
    symbolism: 'The Hanging Swords. The Sweat.',
    beatGoal: 'The Motivation. The internal threat.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Panic',
    scene_tone: 'Dark',
    timeline_date: '6/10/1321 - 3 AM',
    timeline_variant: 'Sanctuary',
    location: 'Quarters',
  };

  const [insertedScene1] = await db.insert(scenes).values(scene1Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene1.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 211 - 213',
      description: 'Francisco bed-thrashing 3AM vision-waking Sanctuary-burning swords-hanging overhead Nine-imagery sweat-drenched cannot-sleeping Anguish-feeling failure-potential dread-consuming room-dark candle-flickering vision-haunting return-impossible mind-racing defenses-checking threat-sensing Hierophant-burden cost-leadership awakening-violent gasping-breath.',
      focus: truncate('Francisco waking from nightmare unable to sleep.', 255),
      chapterSceneFocus: truncate('Ch95S1: Francisco bed-thrashing 3AM vision-waking Sanctuary-burning swords-hanging overhead Nine-imagery sweat-drenched cannot-sleeping Anguish-feeling failure-potential dread-consuming Hierophant-burden cost-leadership Part-2-beginning.', 255),
      preliminarySceneFocus: truncate('Francisco nightmare waking sleepless anguish', 255),
      preliminarySceneDescription: 'Francisco wakes from burning vision unable to return to sleep',
      narrativeFunction: 'Introduces Nine of Swords Focused Anguish through Francisco nightmare vision; demonstrates leadership toll Hook beginning Part 2 Children of the Voice; establishes sleepless vigilance theme Hierophant burden cost emotional regulation foundation acknowledging fear signal data processing anxiety transformation teaching.',
      sensoryDetail: 'Sweat-soaked sheets sticking to skin clammy cold, sword shadows on ceiling moonlight casting menacing shapes, breath ragged gasping panic-inducing heart pounding, candle wax smell filling room darkness pressing suffocating, bed frame creaking movement jarring silence breaking night-terror aftermath trembling.',
      internalConflict: 'Francisco battling between dismissing vision as nightmare versus trusting instinct as warning signal; anxiety burden versus leadership responsibility duty weighing heavy; desire for rest versus vigilance necessity protecting Order sleeping vulnerable; weakness fear versus strength preparation tension unresolved.',
      characterGrowthElement: 'Francisco beginning to recognize anxiety as data signal rather than weakness burden; Emotional Agility acknowledging fear as information navigating emotions mindfully; Nine of Swords teaching anguish can be focused channeled protective rather than destructive consuming; Hierophant responsibility accepting cost.',
      seriesConnectionResonance: 'EA-093 Hierophant oath leading to sleepless burden responsibility weighing; EA-094 Goal Setting plan creating now testing through night vigilance; prophetic dreams timeline bleeding hints establishing supernatural awareness growing; Vatican threat active presence looming shadow constant; Part 2 opening New World setup cost demonstrating.',
      sceneCardProgression: 294,
      realWorldContext: '1321 medieval night watches guard rotations, Sanctuary defenses magical wards protecting compound isolated location, Francisco quarters candle-lit sparse furnishing Magus workspace maps scrolls scattered planning constant, pre-dawn darkness deepest hour psychological vulnerability peak.',
      timelineSignificance: '6/10/1321 3 AM—night after EA-094 plan sealing evening before, Francisco Nine of Swords beginning sleepless vigilance Part 2 opening leadership cost demonstrating Hierophant burden manifesting physical mental toll anxiety channeling protective action foundation establishing.',
      saveTheCatBeat: 'New world (set-up) showing cost through nightmare',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Nine swords hanging overhead bed shadows casting',
        emotional_core: 'Dread consuming sleepless panic',
        character_state: 'Francisco sweat-drenched haunted vigilant'
      }),
      learning_objectives: JSON.stringify([
        'Emotional Agility by Susan David - Navigating Emotions - acknowledging fear signal as information rather than weakness',
        'The Upside of Stress by Kelly McGonigal - How to Love Stress - anxiety as data channeling protective action'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Vatican assassin threat imminent arriving dawn',
        'North wall ward weakness Francisco will discover',
        'Francisco prophetic vision accuracy validating anxiety as signal'
      ]),
    })
    .where(eq(scenes.id, insertedScene1.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 2: The Patrol
  console.log('📝 Processing Scene 2: The Patrol');
  const scene2Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-095',
    sceneNumber: 2,
    title: 'The Patrol',
    setup: 'Francisco walks the perimeter. The fog is thick. He checks the magical wards. He finds a hairline fracture in the north wall. A small thing, but fatal. He wakes the sentries. They are groggy, annoyed. He is intense, manic.',
    symbolism: 'The Crack in the Wall.',
    beatGoal: 'The Action. Preparation.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Urgency',
    scene_tone: 'Tense',
    timeline_date: '6/10/1321 - Pre-Dawn',
    timeline_variant: 'Sanctuary',
    location: 'North Wall',
  };

  const [insertedScene2] = await db.insert(scenes).values(scene2Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene2.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 214 - 217',
      description: 'Francisco perimeter-walking fog-thick visibility-poor ward-checking methodical North-wall reaching fracture-finding hairline-crack small-but-fatal flaw-detecting sentries-waking groggy-annoyed protests-muttering Francisco-intense manic-energy urgency-communicating doubt-facing credibility-testing preparation-insisting Action-demonstrating anxiety-channeling.',
      focus: truncate('Francisco finding ward crack waking annoyed sentries.', 255),
      chapterSceneFocus: truncate('Ch95S2: Francisco perimeter-walking fog-thick ward-checking North-wall fracture-finding hairline-crack small-but-fatal sentries-waking groggy-annoyed Francisco-intense manic-energy urgency-communicating preparation-insisting anxiety-channeling Action-demonstrating.', 255),
      preliminarySceneFocus: truncate('Francisco patrol discovering crack waking sentries', 255),
      preliminarySceneDescription: 'Francisco discovers fatal ward flaw waking annoyed guards',
      narrativeFunction: 'Develops Nine of Swords Focused Anguish through obsessive patrol ward checking; demonstrates anxiety channeling into protective action Conflict internal manifesting external resistance; establishes Francisco credibility testing through sentry doubt annoyed resistance leadership burden isolation experiencing.',
      sensoryDetail: 'Fog mist clinging to stone walls dampness penetrating cold seeping, torch flame sputtering wind-blown shadows dancing uncertain, ward magic humming faint detecting fracture energy disruption sensing, sentry eyes heavy sleep-filled doubt clear visible skepticism obvious, stone texture rough fingers tracing crack invisible to others hairline fatal.',
      internalConflict: 'Francisco knowing he appears paranoid manic versus trusting instinct ward flaw detecting; desire to be wrong versus certainty of threat real imminent; frustration at sentry doubt versus understanding their perspective exhaustion legitimate; isolation of vigilance burden carrying alone responsibility weighing.',
      characterGrowthElement: 'Francisco demonstrating Upside of Stress anxiety harnessing into meticulous attention detail protection; learning to persist despite social cost doubt facing credibility questioned; Nine of Swords teaching obsession can be focused productive when channeled correctly fear data processing action motivating.',
      seriesConnectionResonance: 'Scene 1 nightmare driving this patrol action anxiety channeling; EA-094 Goal Setting plan including defense preparation now testing; Scene 3 Intruder will validate this discovery ward crack exactly where assassin attempts entry; Francisco isolation Magus burden leadership cost accumulating.',
      sceneCardProgression: 295,
      realWorldContext: '1321 medieval fog common pre-dawn hours visibility limiting, magical ward systems protecting compounds energy-based detection requiring, sentry rotations night watches exhausting monotonous, torch-lit inspection limited visibility challenging, hairline cracks masonry requiring expert detection overlooked easily.',
      timelineSignificance: '6/10/1321 Pre-Dawn—hours after Scene 1 nightmare 3AM waking, Francisco sleepless patrol obsessive ward-checking discovering North wall flaw, Scene 3 dawn attack imminent minutes away preparation critical timing validation approaching.',
      saveTheCatBeat: 'New world (set-up) establishing paranoia as protection',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Mist clinging to stone torch sputtering crack invisible',
        emotional_core: 'Urgency manic doubt-facing isolation',
        character_state: 'Francisco intense sleep-deprived certain',
        key_visual_details: [
          'The mist clinging to the stone',
          'The torch sputtering',
          'The look of doubt in the sentry\'s eyes'
        ]
      }),
      learning_objectives: JSON.stringify([
        'The Upside of Stress by Kelly McGonigal - How to Love Stress - harnessing anxiety into meticulous protective attention',
        'Emotional Agility by Susan David - Navigating Emotions - persisting despite social cost doubt facing'
      ]),
      foreshadowing_elements: JSON.stringify([
        'North wall crack exactly where Scene 3 assassin will attack',
        'Sentry doubt will transform to respect Scene 4',
        'Francisco isolation burden increasing leadership cost mounting'
      ]),
    })
    .where(eq(scenes.id, insertedScene2.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 3: The Intruder
  console.log('📝 Processing Scene 3: The Intruder');
  const scene3Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-095',
    sceneNumber: 3,
    title: 'The Intruder',
    setup: 'Just before dawn. The mist shifts. A shadow moves at the North Wall—right where Francisco fixed the ward. The ward flares. Francisco is there instantly. A brief skirmish. The intruder escapes, but is marked. It was a Vatican assassin.',
    symbolism: 'The shadow in the fog.',
    beatGoal: 'The Validation. The fear was real.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Vindication',
    scene_tone: 'Action/Surprise',
    timeline_date: '6/10/1321 - Dawn',
    timeline_variant: 'Sanctuary',
    location: 'North Wall',
  };

  const [insertedScene3] = await db.insert(scenes).values(scene3Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene3.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 218 - 222',
      description: 'Dawn-breaking mist-shifting shadow-moving North-Wall exactly-where Francisco-fixed ward-flaring alarm-triggering Francisco-arriving instantly positioning-perfect skirmish-brief combat-magic assassin-Vatican marked-escaping blood-leaving evidence-providing Validation-complete fear-real threat-confirmed anxiety-justified anguish-focused protective-successful.',
      focus: truncate('Vatican assassin attacking exactly where Francisco predicted.', 255),
      chapterSceneFocus: truncate('Ch95S3: Dawn-breaking shadow-moving North-Wall exactly-where Francisco-fixed ward-flaring Francisco-arriving instantly skirmish-brief assassin-Vatican marked-escaping Validation-complete fear-real threat-confirmed anxiety-justified anguish-focused protective-successful Twist-delivering.', 255),
      preliminarySceneFocus: truncate('Assassin attacking ward Francisco instantly responding', 255),
      preliminarySceneDescription: 'Vatican assassin attacks exactly where Francisco predicted ward flaw',
      narrativeFunction: 'Resolves Nine of Swords Focused Anguish through Validation anxiety as accurate data threat real; delivers Twist revealing Vatican active hunting Sanctuary vulnerable; demonstrates Francisco vigilance justified protective anguish channeled successfully combat readiness paranoia vindicated; establishes external threat constant New World setup danger real.',
      sensoryDetail: 'Mist parting shadow-form revealing movement-sudden alarming, ward magic flaring bright blue-white energy crackling sound sharp, Francisco footsteps running stone-on-stone rapid approaching, combat brief intense magic-clashing steel-ringing breath-heavy exertion, assassin blood dark-red stone-staining mark-leaving evidence clear, dawn light breaking fog-thinning visibility improving aftermath-revealing.',
      internalConflict: 'Francisco feeling vindication mixed with horror threat-real confirmed, satisfaction at being-right versus anger at danger-present Order-threatened, relief at preparation-successful versus exhaustion at constant-vigilance necessity never-ending burden, triumph-brief overshadowed by realization this-is-just-beginning Vatican-relentless.',
      characterGrowthElement: 'Francisco learning anxiety vindicated as accurate threat-detection Upside of Stress validated data-processing successful; Nine of Swords anguish proving protective when focused channeled correctly preparation enabling; Rising Strong moment reckoning with leadership burden real cost accepting responsibility deepening; Emotional Agility navigating vindication without arrogance remaining vigilant.',
      seriesConnectionResonance: 'Scene 1 nightmare proving prophetic vision accurate timeline-bleeding hints; Scene 2 crack discovery saving Sanctuary assassin attacking exactly there validation complete; EA-091 scroll theft Vatican response now manifesting retribution hunting; EA-093 Hierophant burden cost physical demonstrating protection requiring sacrifice; Part 2 New World threat establishing constant danger reality.',
      sceneCardProgression: 296,
      realWorldContext: '1321 Vatican Inquisition reach extending assassins employing, magical combat brief intense decisive skill-based, dawn attack timing strategic visibility-poor defender-tired exploiting, mark-leaving blood-magic tracking enabling future-threat establishing, Sanctuary isolation providing distance but not immunity vulnerability remaining.',
      timelineSignificance: '6/10/1321 Dawn—minutes after Scene 2 ward-fixing preparation critical, Vatican assassin attacking North wall exactly where Francisco predicted crack-finding, Validation anxiety as data Nine of Swords teaching moment confirming anguish-focused protective successful threat-real establishing Part 2 danger constant.',
      saveTheCatBeat: 'New world (set-up) confirming threat real',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Shadow in fog ward flaring bright assassin marked',
        emotional_core: 'Vindication horror-mixed threat-confirmed',
        character_state: 'Francisco combat-ready vigilant vindicated'
      }),
      learning_objectives: JSON.stringify([
        'The Upside of Stress by Kelly McGonigal - How to Love Stress - anxiety vindicated as accurate threat-detection data',
        'Rising Strong by Brené Brown - The Reckoning - confronting leadership burden reality cost accepting'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Vatican pursuit relentless more attacks coming',
        'Assassin marked will return tracked',
        'Francisco burden increasing constant vigilance required sustainability questioned'
      ]),
    })
    .where(eq(scenes.id, insertedScene3.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 4: The Burden
  console.log('📝 Processing Scene 4: The Burden');
  const scene4Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-095',
    sceneNumber: 4,
    title: 'The Burden',
    setup: 'Morning. The Order sees the blood on the wall. They look at Francisco differently. Not with annoyance, but with awe (and pity). La Signora brings him coffee. \'You need to sleep,\' she says. \'Not yet,\' he replies. He is the focused guardian.',
    symbolism: 'The Coffee. The Blood.',
    beatGoal: 'Resolution. Acceptance of the burden.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Weariness',
    scene_tone: 'Somber',
    timeline_date: '6/10/1321 - Morning',
    timeline_variant: 'Sanctuary',
    location: 'Courtyard',
  };

  const [insertedScene4] = await db.insert(scenes).values(scene4Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene4.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 223 - 225',
      description: 'Morning-light Order-gathering blood-wall seeing Francisco-viewing differently annoyance-gone awe-pity replacing perception-shifted respect-earned La-Signora coffee-bringing concern-showing sleep-urging Francisco-refusing not-yet replying burden-accepting guardian-focused protection-prioritizing weariness-visible determination-unshaken Resolution-demonstrating Theme-stating sacrifice-leadership cost-accepting Nine-complete.',
      focus: truncate('Order recognizing Francisco burden accepting guardian role.', 255),
      chapterSceneFocus: truncate('Ch95S4: Morning Order blood-wall seeing Francisco-viewing differently awe-pity La-Signora coffee-bringing sleep-urging Francisco-refusing burden-accepting guardian-focused weariness-visible determination-unshaken Resolution Theme-stating sacrifice-leadership Nine-complete.', 255),
      preliminarySceneFocus: truncate('Order respecting burden Francisco accepting guardian', 255),
      preliminarySceneDescription: 'Order recognizes Francisco sacrifice accepting focused guardian burden',
      narrativeFunction: 'Resolves Nine of Swords Focused Anguish through burden acceptance Resolution demonstrating; Theme-stating I sleep so you don\'t have to unspoken understanding establishing; demonstrates Order perception shift annoyance to respect awe-pity Francisco isolation deepening despite validation; completes New World setup showing leadership cost sustainable-questioning ongoing-burden establishing Part 2 foundation.',
      sensoryDetail: 'Morning sun breaking through mist warmth-providing contrast night-terror previous, blood stain dark-brown dried wall-marking evidence visible permanent, coffee steam rising bitter-smell comforting ritual-gesture care-showing, Order faces mixed emotions awe-pity-respect complex shifting, Francisco hand trembling cup-holding exhaustion-physical obvious determination-mental unwavering visible, courtyard stones dew-wet footprints-showing night-patrol evidence.',
      internalConflict: 'Francisco recognizing burden accepted cost-understanding sleep-impossible vigilance-necessary versus longing-human rest-normal connection-regular craving; pride at validation-earned respect-Order versus isolation-deepening separation-creating role-Hierophant distance-requiring; determination to continue-protecting versus awareness sustainability-questioned long-term toll-accumulating.',
      characterGrowthElement: 'Francisco completing Nine of Swords teaching anguish-focused productive channeled protective burden-accepted cost-understood; demonstrating Rising Strong reckoning-complete burden-integrated identity-shifted from Francisco to Magus-Hierophant guardian-role embraced; Emotional Agility navigating weariness without surrender determination maintaining purpose-clear; leadership-cost accepting sacrifice-willing protection-prioritizing.',
      seriesConnectionResonance: 'Scene 3 Validation vindication leading to this respect-earned burden-recognized; EA-093 Hierophant transformation cost now physically-demonstrating oath-consequences real tangible; EA-094 Goal Setting plan requiring this vigilance-constant protection-ongoing leadership-demanding; Part 2 New World setup complete cost-established foundation-laid ongoing-struggle previewing future-sustainability questioning.',
      sceneCardProgression: 297,
      realWorldContext: '1321 medieval leadership isolation common burden-singular responsibility-concentrated, coffee ritual care-gesture cultural-comfort providing, blood evidence combat-proof visual-reminder danger-real persistent, courtyard communal-space gathering-natural public-acknowledgment setting, sleep-deprivation toll-physical medieval-understanding limited psychological-cost unrecognized era-appropriate.',
      timelineSignificance: '6/10/1321 Morning—hours after dawn Scene 3 combat-successful, Order witnessing aftermath blood-evidence Francisco-vindication respect-earning, Nine of Swords chapter-complete Focused Anguish teaching burden-accepting guardian-establishing Part 2 New World setup foundation-complete ongoing-cost previewing.',
      saveTheCatBeat: 'New world (set-up) establishing ongoing cost',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Blood on wall coffee steam hand trembling sun breaking',
        emotional_core: 'Weariness determination burden-accepted',
        character_state: 'Francisco exhausted-vigilant guardian-focused',
        key_character_moments: [
          'The trembling of his hand holding the cup',
          'The sun breaking through the mist',
          'The silent nod of the sentry'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Rising Strong by Brené Brown - The Reckoning - integrating burden into identity leadership cost accepting',
        'Emotional Agility by Susan David - Navigating Emotions - navigating weariness maintaining determination purpose-clear',
        'The Upside of Stress by Kelly McGonigal - How to Love Stress - completing anxiety channeling protective burden sustainable-questioning'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco sustainability questioned long-term toll accumulating',
        'Isolation deepening despite Order respect separation increasing',
        'Sleep deprivation consequences future chapters exploring health-impact pending'
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

  console.log('\n✅ EA-095 import complete!\n');
  console.log('📋 The Nine of Swords Focused Anguish - Sleepless vigilance protecting the Order!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
