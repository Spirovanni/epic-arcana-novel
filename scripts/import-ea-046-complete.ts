import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-046: Gracious (Book 2, Chapter 6)...\n');

  // Get or create chapter EA-046
  const [ch46] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-046'))
    .limit(1);

  if (!ch46) {
    console.error('❌ EA-046 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch46.title} (ID: ${ch46.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Terminal Between Worlds',
      setup: 'The Zanetti Train shudders to a stop at the Timeline Terminal—a vast station existing in the space between realities, its architecture impossibly blending Gothic arches, Art Deco columns, and crystalline structures from futures yet to come. Francisco, La Signora, and Novella disembark into a cavern filled with travelers from across time and space: a Roman centurion bargaining with a woman in future-tech armor, a medieval merchant examining artifacts from timelines where magic evolved differently. Francisco wants to understand this waystation\'s purpose and rules; La Signora wants him to release his academic need for comprehension and simply experience wonder. Opposition arises from Francisco\'s overwhelm (too much impossibility too fast), his fear that leaving the train means losing his anchor to home, and the subtle realization creeping in: he could stay here forever, exploring infinite possibilities, never returning to Bologna\'s burdens. But a spark of possibility compels him forward—a vendor selling Trionfi cards from alternate timelines, each set showing different symbolic evolutions. As Francisco examines cards where The Fool never begins his journey, where The Tower represents creation instead of destruction, gratitude unexpectedly blooms: his journey, with all its pain, is uniquely his. The scene lands on wonder opening his heart.',
      symbolism: 'The Queen of Disks embodies the chapter\'s gratitude theme: nurturing abundance through appreciative recognition of resources at hand. The Terminal represents support and abundance surrounding Francisco—he must learn to recognize and be grateful for the gift of timeline sight rather than focusing on its burdens.',
      beat_goal: 'Francisco encounters the first Timeline Terminal waystation between realities, experiences overwhelming possibility and the temptation to escape burdens by exploring infinite timelines, but begins cultivating gratitude for his unique journey when examining alternate Trionfi, establishing tests of appreciation amid wonder.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Wonder and grateful recognition',
      scene_tone: 'Wondrous and expansive',
      timeline_date: 'Between Timelines (Terminal Time)',
      timeline_variant: 'Timeline Terminal (Neutral Ground)',
      location: 'Timeline Terminal - Grand Concourse',
    },
    {
      scene_number: 2,
      scene_title: 'Stories of the Displaced',
      setup: 'In the Terminal\'s marketplace—a bazaar of possibilities where vendors sell artifacts and knowledge from different timelines—Francisco encounters timeline travelers with stories both tragic and triumphant. An elderly woman who fled her timeline when temporal manipulation destroyed her family, now trading memories as currency. A young soldier who accidentally shifted timelines mid-battle and cannot find home. A joyous couple who found each other across dimensions and chose to remain in the Terminal rather than risk separation. Francisco wants to help them all, to fix their tragedies; La Signora wants him to listen and learn. Opposition comes from the stories\' emotional weight (each displaced traveler a reminder of what his own mistakes might cause), his growing awareness that timeline travel is addictive (many travelers have been here years, decades, unwilling to commit to any single reality), and his survivor\'s guilt about possessing powers that ruined these lives. But as he listens—truly listens—Francisco begins practicing gratitude journaling in his mind: grateful for La Signora\'s guidance, for Novella\'s companionship, for his family still safe in Bologna, even for the burdens that keep him anchored. Fear transforms into appreciation for both wonders and dangers. The scene lands on compassionate understanding through gratitude.',
      symbolism: 'The Queen nurturing her garden: Francisco must practice thanksgiving amid uncertainty by recognizing support (La Signora, Novella) and abundance (his anchors to home) around him, transforming adversity into growth by appreciating rather than resenting the weight of responsibility that prevents timeline addiction.',
      beat_goal: 'Francisco meets displaced timeline travelers with tragic and triumphant stories, learns that timeline travel is dangerously addictive, experiences survivor\'s guilt but practices mental gratitude journaling for his supports and anchors, transforming fear into appreciation and establishing that gratitude for burdens prevents the temptation to escape into alternate realities.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Compassionate gratitude and humble appreciation',
      scene_tone: 'Poignant and reflective',
      timeline_date: 'Timeline Terminal (Extended Stay)',
      timeline_variant: 'Marketplace Between Realities',
      location: 'Timeline Terminal - Marketplace',
    },
    {
      scene_number: 3,
      scene_title: 'Gherardo\'s Wonder',
      setup: 'Francisco discovers Gherardo has secretly followed him onto the train, driven by jealousy but now standing in the Terminal\'s Grand Concourse with eyes wide in awestruck wonder. Gherardo wants Francisco to explain everything, to share this cosmic scope his brother has been hiding; Francisco wants to protect Gherardo from the dangers while honoring his courage in following. Opposition emerges from their fraught relationship (Gherardo\'s resentment of being left behind, Francisco\'s guilt for excluding his brother), the Terminal\'s seductive pull (Gherardo immediately drawn to alternate-self possibilities—versions where he\'s the talented one, the cosmic guardian), and Francisco\'s fear that Gherardo isn\'t ready for this burden. But watching his brother experience genuine wonder—the first unguarded joy Francisco has seen from Gherardo since childhood—Francisco feels profound gratitude. Gratitude that Gherardo cares enough to follow, that their bond survived jealousy, that wonder can still crack through resentment\'s armor. He takes Gherardo\'s hand and begins explaining, not as superior to inferior, but as brothers navigating impossible vastness together. La Signora observes with approval: gratitude as bridge. The scene lands on reconnection through shared appreciation.',
      symbolism: 'The Queen offering abundance to another: Francisco demonstrates graciousness toward self (forgiving his exclusion of Gherardo) and other (honoring brother\'s courage), pairing gratitude with forgiveness to build strength in their relationship and transform adversity of jealousy into growth opportunity through shared wonder and vulnerable connection.',
      beat_goal: 'Francisco discovers Gherardo followed onto the train driven by jealousy but experiencing wonder, navigates their fraught relationship through gratitude for Gherardo\'s courage and their surviving bond, and begins sharing timeline knowledge as equals rather than hierarchically, establishing that gratitude bridges divides and transforms resentment into connection through appreciation and forgiveness.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grateful reconnection and brotherly warmth',
      scene_tone: 'Tender and hopeful',
      timeline_date: 'Timeline Terminal (Reunion Moment)',
      timeline_variant: 'Grand Concourse Observation',
      location: 'Timeline Terminal - Grand Concourse / Brotherhood Restored',
    },
    {
      scene_number: 4,
      scene_title: 'The Gift of Sight',
      setup: 'As the Zanetti Train prepares for departure, Francisco gathers with La Signora, Novella, and Gherardo to process the Terminal\'s lessons. The conductor appears with final wisdom: many travelers never leave, addicted to exploring alternate versions of their lives, unable to choose commitment to any single timeline. Francisco wants to ensure he won\'t fall into that trap; the conductor wants him to understand that gratitude is the antidote. La Signora guides Francisco through a gratitude practice: list three things he\'s grateful for about his timeline—his family\'s love despite not understanding him, Bologna\'s beauty even amid temporal chaos, and the very burden of power that forces him to grow. Novella adds her gratitude for Francisco\'s guidance; Gherardo, hesitantly, for being included in this wonder. Opposition dissolves as Francisco realizes: his timeline sight isn\'t a burden to escape but a gift to appreciate. The difficult moments contain hidden gifts—every challenge has strengthened him, every setback revealed support, every fear forced growth. As the train departs the Terminal, Francisco commits to a gratitude journal practice, recognizing that cultivating thankfulness amid uncertainty anchors resilience and opens his heart to new challenges. The scene lands on resilient gratitude and strengthened purpose.',
      symbolism: 'The Queen\'s garden flourishing: Francisco constructs a resilience plan anchored in gratitude, recognizing emergent strengths from setbacks (Terminal taught appreciation), leveraging social support to express thankfulness (La Signora, Novella, Gherardo bonds), developing growth narratives fueled by gratitude (sight as gift not burden), demonstrating that graciousness transforms adversity into sustainable perseverance through thanksgiving.',
      beat_goal: 'Francisco learns gratitude is the antidote to timeline addiction, practices listing three grateful things about his timeline despite burdens, commits to gratitude journaling as resilience anchor, and transforms his perspective on timeline sight from burden to gift through recognition of hidden gifts in difficulties, establishing that cultivating thankfulness amid uncertainty opens his heart to challenges and prevents escape temptations.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Resilient gratitude and committed purpose',
      scene_tone: 'Reflective and purposeful',
      timeline_date: 'Timeline Terminal (Departure)',
      timeline_variant: 'Train Platform / Returning to Journey',
      location: 'Timeline Terminal - Departure Platform / Zanetti Train',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Terminal Between Worlds
      pages: 'Page 76 - 79',
      description: 'Francisco arrives at the Timeline Terminal and experiences overwhelming wonder and temptation as he encounters travelers from across time and space, ultimately finding gratitude for his unique journey.',
      focus: 'Francisco\'s first encounter with the Timeline Terminal and the recognition that his journey, with all its pain, is uniquely his',
      chapterSceneFocus: 'Ch46S1: Francisco encounters Timeline Terminal waystation, experiences overwhelming possibility and escape temptation, but cultivates gratitude for unique journey through alternate Trionfi examination',
      preliminarySceneFocus: 'Spark of possibility beyond familiar comforts',
      preliminarySceneDescription: 'The Timeline Terminal introduces Francisco to infinite possibilities while testing his ability to appreciate rather than escape his burdens',
      narrativeFunction: 'Introduces Timeline Terminal as waystation between realities and establishes gratitude as antidote to escape temptation',
      sensoryDetail: 'Gothic arches blending with Art Deco columns and crystalline future-structures, Roman centurions bargaining with future-armored warriors, alternate Trionfi cards showing different symbolic evolutions',
      internalConflict: 'Francisco torn between overwhelm at impossibility and wonder at possibility, fear of losing his anchor to home versus curiosity about infinite timelines',
      characterGrowthElement: 'Francisco begins shifting from viewing timeline sight as burden to recognizing it as unique gift through examining alternate card sets',
      seriesConnectionResonance: 'Timeline Terminal introduction sets up addiction danger (Books 4-5) and gratitude theme crucial for Book 9 ultimate choice',
      sceneCardProgression: 98,
      realWorldContext: 'Early 14th century traveler encountering way-station transcending temporal boundaries',
      timelineSignificance: 'First Timeline Terminal experience - neutral ground between realities',
      saveTheCatBeat: 'Fun and Games - experiencing the "promise of the premise" through terminal wonders',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-slow to allow wonder absorption',
        tension_level: 'Moderate - possibility both enticing and overwhelming',
        emotional_arc: 'Overwhelm → Wonder → Grateful recognition',
      }),
      learning_objectives: JSON.stringify([
        'Practice recognizing abundance and support in present circumstances',
        'Transform perspective from burden to gift through gratitude',
        'Understand temptation to escape versus commitment to growth',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Timeline addiction danger - many never leave the Terminal',
        'Alternate Trionfi cards hint at different symbolic evolution paths',
        'Gratitude as anchor preventing escape into alternate realities',
      ]),
    },
    {
      // Scene 2: Stories of the Displaced
      pages: 'Page 79 - 82',
      description: 'Francisco listens to displaced timeline travelers\' tragic and triumphant stories, learning about timeline addiction while practicing mental gratitude journaling to transform fear into appreciation.',
      focus: 'Francisco encounters displaced travelers and learns gratitude for his anchors through their stories of loss and addiction',
      chapterSceneFocus: 'Ch46S2: Francisco meets displaced travelers with tragic stories, learns timeline addiction danger, practices mental gratitude journaling to transform fear into appreciation for supports and anchors',
      preliminarySceneFocus: 'Learning through listening to others\' experiences',
      preliminarySceneDescription: 'Terminal marketplace stories teach Francisco to appreciate his supports and burdens that prevent timeline addiction',
      narrativeFunction: 'Reveals timeline travel addiction danger through displaced travelers while demonstrating gratitude practice in action',
      sensoryDetail: 'Bazaar of possibilities, elderly woman trading memories as currency, young soldier\'s desperation to find home, joyous couple choosing Terminal over separation risk',
      internalConflict: 'Francisco\'s desire to fix all tragedies versus need to listen and learn, survivor\'s guilt about possessing powers that ruined lives versus appreciation for anchors preventing addiction',
      characterGrowthElement: 'Francisco practices mental gratitude journaling, transforming fear into appreciation for supports (La Signora, Novella) and burdens (responsibility anchoring him)',
      seriesConnectionResonance: 'Timeline addiction theme establishes danger Francisco will face in Books 4-5 when tempted to explore alternate life versions',
      sceneCardProgression: 99,
      realWorldContext: 'Marketplace between realities where temporal displacement creates permanent refugees',
      timelineSignificance: 'Extended stay in Terminal revealing addiction patterns across decades',
      saveTheCatBeat: 'Fun and Games - exploring premise through displaced travelers\' stories',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow reflective - space for emotional processing',
        tension_level: 'High emotional weight - tragic stories building awareness',
        emotional_arc: 'Compassion → Guilt → Grateful appreciation',
      }),
      learning_objectives: JSON.stringify([
        'Practice thanksgiving amid uncertainty by recognizing supports',
        'Transform adversity (burdens) into growth through appreciation',
        'Understand that gratitude for anchors prevents escape temptation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Timeline travel addiction - travelers lost in Terminal for years/decades',
        'Memory trading as currency hints at identity loss through timeline shifts',
        'Burdens as protective anchors preventing dangerous exploration',
      ]),
    },
    {
      // Scene 3: Gherardo's Wonder
      pages: 'Page 83 - 86',
      description: 'Francisco discovers his brother Gherardo followed him onto the train, and through shared wonder at the Terminal, they reconnect as brothers navigating vastness together rather than in hierarchical rivalry.',
      focus: 'Francisco and Gherardo reconnect through gratitude, wonder, and forgiveness, transforming jealousy into brotherhood',
      chapterSceneFocus: 'Ch46S3: Francisco discovers Gherardo followed onto train, navigates fraught relationship through gratitude for brother\'s courage, shares timeline knowledge as equals to transform resentment into connection',
      preliminarySceneFocus: 'Relationship healing through shared appreciation',
      preliminarySceneDescription: 'Gherardo\'s courage to follow and Francisco\'s gratitude create bridge healing their fraught relationship through wonder',
      narrativeFunction: 'Heals Francisco-Gherardo relationship through gratitude practice, establishing brotherhood theme for series',
      sensoryDetail: 'Gherardo\'s eyes wide with awestruck wonder in Grand Concourse, brothers\' hands joined navigating impossibility, La Signora\'s approving observation',
      internalConflict: 'Francisco torn between protecting Gherardo from danger and honoring his courage, guilt for excluding brother versus gratitude for their surviving bond',
      characterGrowthElement: 'Francisco demonstrates graciousness toward self (forgiving exclusion) and other (honoring courage), pairing gratitude with forgiveness',
      seriesConnectionResonance: 'Francisco-Gherardo relationship healing sets foundation for brothers\' alliance in later books when facing temporal threats together',
      sceneCardProgression: 100,
      realWorldContext: 'Brothers from 14th century Bologna encountering multiverse scope together',
      timelineSignificance: 'Reunion moment in Terminal - relationship transformation point',
      saveTheCatBeat: 'Fun and Games - promise fulfilled through shared wonder and reconnection',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium - balancing emotion with relationship building',
        tension_level: 'Moderate - fraught history transforming to tender connection',
        emotional_arc: 'Surprise → Guilt → Gratitude → Reconnection',
      }),
      learning_objectives: JSON.stringify([
        'Practice graciousness toward self through forgiveness',
        'Honor others\' courage even when protective instincts arise',
        'Use gratitude as bridge to transform resentment into connection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Gherardo drawn to alternate-self possibilities (future temptation)',
        'Brothers navigating vastness together (alliance in later books)',
        'Wonder cracking through resentment (transformation theme)',
      ]),
    },
    {
      // Scene 4: The Gift of Sight
      pages: 'Page 87 - 90',
      description: 'Francisco commits to gratitude journaling practice, learning that cultivating thankfulness is the antidote to timeline addiction and transforms his perspective from burden to gift.',
      focus: 'Francisco commits to gratitude practice as resilience anchor, transforming timeline sight from burden to appreciated gift',
      chapterSceneFocus: 'Ch46S4: Francisco learns gratitude as timeline addiction antidote, practices listing grateful recognitions, commits to gratitude journaling as resilience anchor transforming perspective from burden to gift',
      preliminarySceneFocus: 'Committing to thanksgiving practice amid uncertainty',
      preliminarySceneDescription: 'Departure from Terminal with gratitude practice established as anchor preventing addiction and transforming perspective on burdens',
      narrativeFunction: 'Establishes gratitude journaling as Francisco\'s resilience practice and transforms his relationship with timeline sight from burden to gift',
      sensoryDetail: 'Zanetti Train preparing for departure, conductor\'s final wisdom, La Signora guiding gratitude practice, group sharing grateful recognitions',
      internalConflict: 'Francisco\'s fear of falling into addiction trap versus trust in gratitude as antidote, viewing powers as burden versus recognizing them as gift',
      characterGrowthElement: 'Francisco constructs resilience plan anchored in gratitude, develops growth narrative (sight as gift not burden), commits to ongoing practice',
      seriesConnectionResonance: 'Gratitude journaling practice established here becomes crucial tool when Francisco faces temptation in Books 4-5 and makes ultimate choice in Book 9',
      sceneCardProgression: 101,
      realWorldContext: 'Departing temporal waystation with new spiritual practice for navigating burdens',
      timelineSignificance: 'Departure from Terminal - returning to journey with transformed perspective',
      saveTheCatBeat: 'Midpoint - false victory of gratitude practice established (will be tested in later books)',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow reflective - space for practice and commitment',
        tension_level: 'Low - resolution and peace through gratitude',
        emotional_arc: 'Fear → Practice → Recognition → Commitment',
      }),
      learning_objectives: JSON.stringify([
        'Construct resilience plan anchored in gratitude practice',
        'Recognize emergent strengths from setbacks through thanksgiving',
        'Develop growth narrative transforming burdens into gifts',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Gratitude as antidote to timeline addiction (tested in Books 4-5)',
        'Hidden gifts in difficulties (theme throughout series)',
        'Cultivating thankfulness opens heart to challenges (Book 9 choice)',
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
        chapterId: ch46.id,
        chapterUniqueIdentifier: 'EA-046',
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
    .where(eq(scenes.chapterId, ch46.id));

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

  console.log('\n✅ EA-046 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
