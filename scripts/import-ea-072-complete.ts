import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-072: Seek Prosperity (Book 2, Chapter 32)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-072'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-072 not found. Run create-ea-072-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Harvest',
      setup: 'A convoy of \'Timeline Nomads\' creates a trade route to the Redoubt. They bring rare crystals, food, and energy cells. The base goes from \'Starvation Mode\' to feast. People are celebrating. Francisco watches. He sees the relief, but also the slackening of discipline. A guard leaves his post to trade for wine. The \'Boon\' is dangerous.',
      symbolism: 'The Horn of Plenty. The unexpected feast. The loosening of the belt.',
      beat_goal: 'Introduce the new resource. Establish the conflict: Comfort vs. Vigilance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Wary gratitude',
      scene_tone: 'Festive',
      timeline_date: '8/29/1320 - Afternoon',
      timeline_variant: 'The New Market',
      location: 'The Courtyard',
    },
    {
      scene_number: 2,
      scene_title: 'The Investment',
      setup: 'Novella suggests stockpiling the new resources. \'Hoard it for the next siege.\' Francisco disagrees. \'Money is energy. It has to move.\' He uses \'Rich Dad Poor Dad\' thinking (Assets vs Liabilities). He decides to invest the resources in upgrading the Nomads\' wagons and weapons, making them better traders/fighters. He turns a one-time gift into a recurring revenue stream.',
      symbolism: 'Planting the seed instead of eating it. The flow of water/gold.',
      beat_goal: 'The Strategy. Turning wealth into growth.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Strategic ambition',
      scene_tone: 'Business-like',
      timeline_date: '9/2/1320 - Afternoon',
      timeline_variant: 'Command Tent',
      location: 'Command Tent',
    },
    {
      scene_number: 3,
      scene_title: 'The Garden',
      setup: 'Francisco takes a moment for himself. He finds a quiet spot on the roof. He uses a bit of the new magic to grow a single, perfect rose (or timeline equivalent). He sits with it. He wears a fine cloak he was gifted. He embodies the Nine of Disks—solitary enjoyment of success. He realizes he doesn\'t need to be miserable to be a hero. It is okay to enjoy the fruit of his labor. This recharges him.',
      symbolism: 'The Nine of Disks card art (woman in a vineyard). The Rose. The moment of beauty in a war zone.',
      beat_goal: 'Character Beat. Self-care as a strategic asset.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Peaceful',
      scene_tone: 'Luxurious and quiet',
      timeline_date: '9/9/1320 - Evening',
      timeline_variant: 'The Roof Garden',
      location: 'The Roof',
    },
    {
      scene_number: 4,
      scene_title: 'The Golden Hour',
      setup: 'The Redoubt is booming. It is now a \'City on a Hill\'. Francisco looks out over it. He has not just saved them; he has made them prosperous. But the feeling of peace is interrupted. The Nomads bring news: Dagon is moving again. The \'Golden Hour\' is over. But this time, they are not a ragtag band; they are a wealthy, well-fed power. Francisco turns from the view. \'Time to spend our capital.\'',
      symbolism: 'The Sunset. The turning of the season. The Gold transforming back into Steel.',
      beat_goal: 'Resolution. Transition to the next conflict.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Ready',
      scene_tone: 'Epic',
      timeline_date: '9/29/1320 - Afternoon',
      timeline_variant: 'The Balcony',
      location: 'The Balcony',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 466 - 470',
      description: 'Timeline Nomads convoy creating trade route bringing rare crystals, food, energy cells—base shifting from Starvation Mode to feast with celebration—Francisco watching relief but seeing discipline slackening as guard leaves post for wine trading—recognizing dangerous Boon of comfort versus vigilance conflict through Horn of Plenty unexpected feast.',
      focus: 'Introducing new resources establishing Comfort vs. Vigilance conflict.',
      chapterSceneFocus: 'Ch72S1: Nomad convoy trade route bringing crystals food energy—Starvation to feast celebration—Francisco seeing relief but discipline slackening guard abandoning post for wine—recognizing dangerous Boon Comfort-Vigilance conflict as Horn of Plenty loosens belt unexpectedly.',
      preliminarySceneFocus: 'Horn loosens belt dangerously festive',
      preliminarySceneDescription: 'Comfort threatens vigilance discipline slackening',
      narrativeFunction: 'Introduces prosperity as new challenge; establishes comfort-vigilance tension; shows immediate discipline impact.',
      sensoryDetail: 'Nomad convoy, trade route, rare crystals, food abundance, energy cells, Starvation to feast, celebration, relief observation, discipline slackening, guard post abandonment, wine trading, bright silks on blast walls, roasting meat smell, ozone masking, gold coins exchange.',
      internalConflict: 'Francisco experiencing wary gratitude—grateful for relief but concerned about comfort breeding complacency.',
      characterGrowthElement: 'Francisco integrating Nine of Disks—experiencing prosperity\'s satisfaction while recognizing luxury as test requiring vigilance maintenance.',
      seriesConnectionResonance: 'Think and Grow Rich transmutation; resource management foundation; temptation of peace exploration; wealth as power establishment.',
      sceneCardProgression: 202,
      realWorldContext: 'Resource influx management, comfort-vigilance balance, prosperity temptation.',
      timelineSignificance: 'Post-Siege + 1 month (8/29/1320)—prosperity arrival testing Redoubt with comfort versus vigilance tension.',
      saveTheCatBeat: truncate('Break into 3 - prosperity reward brings new challenge', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'festive_wary',
        narrative_mode: 'cautious_gratitude',
      }),
      learning_objectives: JSON.stringify([
        'Prosperity as test not just reward',
        'Comfort threatening vigilance',
        'Resource management beginning',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Investment strategy coming',
        'Rich Dad Poor Dad thinking',
        'Abundance multiplication',
      ]),
    },
    {
      pages: 'Page 470 - 473',
      description: 'Novella suggesting stockpiling \"Hoard it for next siege\"—Francisco disagreeing \"Money is energy. It has to move.\" using Rich Dad Poor Dad Assets versus Liabilities thinking—deciding to invest in upgrading Nomad wagons and weapons making them better traders/fighters—turning one-time gift into recurring revenue stream planting seed not eating as water/gold flows.',
      focus: 'Strategy turning wealth into growth through investment.',
      chapterSceneFocus: 'Ch72S2: Novella\'s hoard proposal rejected by Francisco\'s \"Money is energy\" Rich Dad Assets-Liabilities thinking—investing in Nomad wagon weapon upgrades creating better traders/fighters—turning gift to recurring revenue planting seed not eating as Strategic flow decision.',
      preliminarySceneFocus: 'Seed planting flows gold water',
      preliminarySceneDescription: 'Investment multiplies gift to revenue stream',
      narrativeFunction: 'Demonstrates strategic wealth management; shows Rich Dad Poor Dad principles; establishes investment over hoarding.',
      sensoryDetail: 'Stockpile suggestion, hoard proposal, next siege preparation, Money energy declaration, Rich Dad thinking, Assets versus Liabilities analysis, Nomad wagon upgrades, weapon improvements, trader-fighter enhancement, recurring revenue creation, seed planting, water-gold flow.',
      internalConflict: 'Francisco choosing growth investment over security hoarding—trusting abundance mindset over scarcity thinking.',
      characterGrowthElement: 'Francisco embodying Nine of Disks strategic prosperity—using Abundance Code mindset to multiply resources not consume them.',
      seriesConnectionResonance: 'Rich Dad Poor Dad demonstration; Abundance Code mindset; trade route spy networks for Book 4; economic resistance power.',
      sceneCardProgression: 203,
      realWorldContext: 'Strategic investment, assets vs liabilities, abundance mindset.',
      timelineSignificance: 'Post-Siege + 5 weeks (9/2/1320)—Francisco establishing investment strategy multiplying prosperity into sustainable growth.',
      saveTheCatBeat: truncate('Break into 3 - strategic investment over hoarding', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'businesslike_strategic',
        narrative_mode: 'strategic_ambition',
      }),
      learning_objectives: JSON.stringify([
        'Rich Dad Poor Dad assets thinking',
        'Abundance Code mindset shift',
        'Investment over hoarding',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Personal garden moment coming',
        'Self-care as strategy',
        'Nine Disks solitary enjoyment',
      ]),
    },
    {
      pages: 'Page 473 - 476',
      description: 'Francisco taking moment for himself finding quiet roof spot—using new magic to grow single perfect rose sitting with it—wearing gifted fine cloak embodying Nine of Disks solitary success enjoyment—realizing heroism doesn\'t require misery, okay enjoying labor fruit—recharging through Nine Disks vineyard woman Rose beauty in war zone moment.',
      focus: 'Character Beat showing self-care as strategic asset.',
      chapterSceneFocus: 'Ch72S3: Francisco taking roof quiet moment growing magic rose—wearing fine cloak embodying Nine Disks solitary enjoyment—realizing heroism allowing enjoyment not requiring misery—recharging through labor fruit as vineyard woman Rose creates war zone beauty strategic self-care.',
      preliminarySceneFocus: 'Rose vineyard recharges luxuriously quiet',
      preliminarySceneDescription: 'Self-care strategic not indulgent recharge',
      narrativeFunction: 'Provides character development moment; demonstrates self-care importance; shows Nine of Disks integration.',
      sensoryDetail: 'Roof quiet spot, magic rose growing, single perfect flower, fine cloak wearing, solitary enjoyment, success embodiment, heroism realization, labor fruit enjoyment, recharge feeling, impossible flower color, velvet cloak texture, clear stars above.',
      internalConflict: 'Francisco accepting deserved rest—overcoming belief that heroism requires perpetual suffering.',
      characterGrowthElement: 'Francisco completing Nine of Disks integration—accepting self-care as strategic necessity not weakness, enjoying earned prosperity.',
      seriesConnectionResonance: 'Nine of Disks vineyard imagery; self-care as strategic asset; beauty in war zone creating resilience.',
      sceneCardProgression: 204,
      realWorldContext: 'Self-care importance, earned rest, strategic recharging.',
      timelineSignificance: 'Post-Siege + 6 weeks (9/9/1320)—Francisco taking strategic rest recharging through solitary prosperity enjoyment.',
      saveTheCatBeat: truncate('Break into 3 - self-care as strategic necessity', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'luxurious_quiet',
        narrative_mode: 'peaceful_recharge',
      }),
      learning_objectives: JSON.stringify([
        'Self-care as strategic asset',
        'Earned rest importance',
        'Beauty sustaining resilience',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Golden Hour ending',
        'Dagon return news',
        'Prosperity to steel transformation',
      ]),
    },
    {
      pages: 'Page 476 - 480',
      description: 'Redoubt booming as City on Hill—Francisco viewing prosperity having made them not just saved—peace interrupted by Nomad news Dagon moving again—Golden Hour ending but facing him as wealthy well-fed power not ragtag band—turning from view declaring \"Time to spend our capital\" as Sunset season turns Gold transforming to Steel.',
      focus: 'Resolution transitioning to next conflict from prosperity position.',
      chapterSceneFocus: 'Ch72S4: City on Hill Redoubt booming with Francisco viewing prosperity achievement—Nomad news interrupting peace with Dagon return—Golden Hour ending but wealthy power not ragtag facing him—capital spending declaration as Sunset Gold transforms to Steel transitioning conflict warning.',
      preliminarySceneFocus: 'Sunset transforms Gold to Steel',
      preliminarySceneDescription: 'Prosperous power faces renewed conflict ready',
      narrativeFunction: 'Resolves prosperity arc; transitions to next conflict; establishes stronger position for upcoming challenge.',
      sensoryDetail: 'Redoubt booming, City on Hill, prosperity viewing, peace feeling, Nomad news interruption, Dagon movement, Golden Hour ending, wealthy power, well-fed confidence, ragtag transformation, view turning, capital spending declaration, sunset symbolism, season turning, Gold to Steel transformation.',
      internalConflict: 'Francisco transitioning from peaceful satisfaction to combat readiness—accepting prosperity\'s purpose as fuel for resistance.',
      characterGrowthElement: 'Francisco demonstrating Nine of Disks wisdom—using prosperity strategically as asset for defense, not hoarding or wasting, ready to spend capital.',
      seriesConnectionResonance: 'Assets versus Liabilities payoff; wealth as resistance power validated; City on Hill establishing Book 3 foundation; economic strength strategic advantage.',
      sceneCardProgression: 205,
      realWorldContext: 'Strategic capital deployment, prosperity as fuel, position of strength.',
      timelineSignificance: 'Post-Siege + 2 months (9/29/1320)—prosperity period ending with Dagon return, Redoubt facing threat from position of strength not desperation.',
      saveTheCatBeat: truncate('Break into 3 - ready from strength position', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'epic_transition',
        narrative_mode: 'ready_confidence',
      }),
      learning_objectives: JSON.stringify([
        'Assets for defense deployment',
        'Prosperity as strategic fuel',
        'Strength position advantage',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Next conflict beginning',
        'Wealthy resistance advantage',
        'Book 2 climax approaching',
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
        chapterUniqueIdentifier: 'EA-072',
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

  console.log(`\n✅ EA-072 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
