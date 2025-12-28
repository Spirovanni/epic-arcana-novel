import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

function truncate(str: string | null | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('🔍 Searching for EA-044 in outline...\n');

  // EA-044 Data extracted from outline
  const ea044Data = {
    unique_identifier: 'STG 2.1.2.1',
    title: 'Thrive',
    specific_task_group_title: 'Thrive',
    epic_novel_pages: 'Pages 46 - 60',
    epic_chapter_focus: 'Immediate Reaction',
    epic_novel_chapter_focus: 'Scene II: The Call to Adventure',
    tarot_family: 'Disks',
    tarot_card_item: 'King',
    hero_journey_beat: 'Refusal of the Call',
    save_the_cat_beat: 'Catalyst',
    summary: "Confronted with fresh challenges as the temporal storm subsides, Francisco's instincts are tested as he must respond swiftly to new threats. The Medici banking family arrives in Bologna, claiming they've been tracking temporal irregularities for centuries and demanding Francisco surrender his Trionfi cards for the 'greater good.'",
    character_arcs: {
      Francisco: 'First major test of his new leadership - must decide whether to trust authority figures or follow his own judgment.',
      Medici_Representatives: 'Introduction of the temporal conspiracy - they present themselves as protectors but have hidden agendas.',
      Roger_de_Flor: 'Returns with the Catalan Company, offering military protection against the Medici.',
    },
    story_gaps_addressed: {
      world_geography: 'Introduction of the Medici temporal banking system that spans multiple timelines and controls economic flow across realities.',
      power_systems: 'Reveals that other groups have been using temporal manipulation for centuries, not just individuals like Francisco.',
      stakes_clarification: "The Medici's arrival shows that Francisco's actions have attracted attention from powerful organizations.",
    },
    location_details: {
      medici_temporal_vault: 'A building that exists partially outside normal time, filled with artifacts from multiple timelines.',
      bologna_recovery: 'The city slowly returning to normal, but with subtle changes - some buildings are newer, others older, reflecting the temporal disruption.',
    },
    series_connections: {
      medici_conspiracy: 'Sets up the banking/economic control aspect of the temporal manipulation that will be revealed in Books 3-4.',
      roger_importance: "Establishes Roger as Francisco's primary military ally, crucial for his multiple deaths across timelines.",
    },
    scenes: [
      {
        scene_number: 1,
        scene_title: "Storm's Aftermath",
        symbolism: "The King of Disks embodies the chapter's resilience theme: mastery of material reality through established authority and structured power. The Medici represent pressure that Francisco must transform into opportunity, testing whether he can flourish under adversity rather than merely survive it.",
        beat_goal: "The temporal storm's aftermath reveals Francisco's success but introduces new pressure—the Medici's arrival—establishing that his actions have attracted powerful organizations' attention and setting up the test of whether to trust authority or follow his own judgment.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Wary exhaustion and rising tension',
        scene_tone: 'Tense and foreboding',
        timeline_date: 'Post-Book 1 + 5 days (dawn)',
        timeline_variant: 'Prime Timeline (Altered)',
        location: 'Bologna - Recovering City / Piazza Maggiore',
      },
      {
        scene_number: 2,
        scene_title: 'The Medici Demand',
        symbolism: "The King representing established authority demanding tribute: Francisco must choose whether to thrive under pressure by maintaining autonomy or submit to others' definition of the 'greater good,' revealing that resilience requires reframing adversity as catalyst for growth rather than threat to survive.",
        beat_goal: "The Medici reveal their temporal banking conspiracy and demand Francisco's cards, establishing that temporal manipulation has been used by organizations for centuries, testing Francisco's first major leadership decision—trust authority or follow judgment—and prompting his refusal of the call through instinctive recognition of hidden agendas.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Instinctive resistance and mounting defiance',
        scene_tone: 'Tense and politically charged',
        timeline_date: 'Post-Book 1 + 5 days (morning)',
        timeline_variant: 'Medici Temporal Vault (Outside Normal Time)',
        location: 'Bologna - Medici Temporal Vault',
      },
      {
        scene_number: 3,
        scene_title: "Roger's Alternative",
        symbolism: "The King challenged by the Knight: Francisco must cultivate his own optimistic resilience rather than accept others' structures, demonstrating that thriving under pressure requires building authentic support networks and reframing setbacks as opportunities for self-determined growth, not submission to established power.",
        beat_goal: "Roger de Flor offers military protection as alternative to Medici control, revealing larger temporal conspiracies and establishing Roger as Francisco's future military ally, while Francisco's refusal of both factions demonstrates adaptive resilience strategy—choosing autonomy and self-built networks over submission, flourishing through self-determination despite pressure.",
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Determined autonomy and clarity',
        scene_tone: 'Defiant and empowered',
        timeline_date: 'Post-Book 1 + 5 days (afternoon)',
        timeline_variant: 'Prime Timeline with Military Manifestation',
        location: 'Bologna - Piazza Maggiore / Catalan Company Encampment',
      },
      {
        scene_number: 4,
        scene_title: 'Thriving Through Choice',
        symbolism: "The King building his own kingdom: Francisco demonstrates that true thriving requires redefining success beyond conventional metrics—not accumulating power but cultivating well-being, meaning, and authentic relationships—proving that resilience flourishes through self-care, gratitude practices, and supportive networks that enable growth under pressure rather than mere survival.",
        beat_goal: 'Francisco completes his refusal of the call by building his own independent support network and reframing pressure as growth opportunity, demonstrating adaptive resilience through self-determined structures, rest integration, gratitude cultivation, and relationship-based thriving, establishing his path to flourish beyond adversity rather than merely survive it.',
        pov: '3rd Person Limited (Francisco)',
        tense: 'Past Tense',
        core_emotion: 'Optimistic determination and grounded purpose',
        scene_tone: 'Hopeful and resolute',
        timeline_date: 'Post-Book 1 + 5 days (evening)',
        timeline_variant: "Prime Timeline (Francisco's Sanctuary)",
        location: "Bologna - Francisco's Family Home / Independent Network Formation",
      },
    ],
  };

  const title = ea044Data.specific_task_group_title || ea044Data.title || 'Thrive';

  console.log(`✅ Found EA-044: ${title}`);
  console.log(`   Scenes: ${ea044Data.scenes?.length || 0}\n`);

  // Find chapter 44 in database
  const allChapters = await db.select().from(chapters);
  let ch44 = allChapters.find(ch => ch.chapterNumber === 44);

  if (!ch44) {
    console.error(`❌ Chapter 44 not found in database`);
    console.log(`   Available chapter numbers: ${[...new Set(allChapters.map(ch => ch.chapterNumber))].sort((a, b) => a! - b!).join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ Found Chapter 44: ${ch44.title}\n`);

  // Check if scenes already exist for this chapter and delete them
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch44.id));

  if (existingScenes.length > 0) {
    console.log(`🗑️  Deleting ${existingScenes.length} existing scenes for EA-044...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, ch44.id));
  }

  // Update chapter with EA-044 data
  await db
    .update(chapters)
    .set({
      uniqueIdentifier: 'EA-044',
      title: title,
      epicNovelPages: truncate(ea044Data.epic_novel_pages, 50),
      epicChapterFocus: ea044Data.epic_chapter_focus,
      epicNovelChapterFocus: ea044Data.epic_novel_chapter_focus,
      tarotFamily: truncate(ea044Data.tarot_family, 100),
      tarotCardItem: truncate(ea044Data.tarot_card_item, 100),
      heroJourneyBeat: ea044Data.hero_journey_beat?.substring(0, 99) || null,
      saveTheCatBeat: ea044Data.save_the_cat_beat?.substring(0, 100) || null,
      summary: ea044Data.summary,
      characterArcs: typeof ea044Data.character_arcs === 'string'
        ? ea044Data.character_arcs
        : JSON.stringify(ea044Data.character_arcs),
      storyGapsAddressed: typeof ea044Data.story_gaps_addressed === 'string'
        ? ea044Data.story_gaps_addressed
        : JSON.stringify(ea044Data.story_gaps_addressed),
      locationDetails: typeof ea044Data.location_details === 'string'
        ? ea044Data.location_details
        : JSON.stringify(ea044Data.location_details),
      seriesConnections: typeof ea044Data.series_connections === 'string'
        ? ea044Data.series_connections
        : JSON.stringify(ea044Data.series_connections),
    })
    .where(eq(chapters.id, ch44.id));

  console.log('✅ Updated chapter with EA-044 data\n');

  // Import scenes with basic data from outline
  console.log('📝 Importing scenes with basic data...\n');

  const insertedScenes = [];

  for (const sceneData of ea044Data.scenes) {
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch44.id,
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.symbolism,
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

    console.log(`✅ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
    insertedScenes.push(insertedScene);
  }

  console.log('\n📝 Adding comprehensive scene fields...\n');

  // Enhanced scene data with all 30 fields
  const sceneEnhancements = [
    {
      // Scene 1: Storm's Aftermath
      pages: 'Page 46 - 49',
      description: "Dawn breaks over Bologna transformed—the temporal storm has subsided but left the city subtly altered, some buildings inexplicably newer, others older than they should be, and citizens awakening with fragmentary memories of lives they never lived. Francisco's makeshift team (Novella, his father, Gherardo) has successfully stabilized the three convergence points, but exhaustion weighs on them all. Francisco wants to rest and process what they've accomplished; the city wants explanations for the impossible night. Opposition emerges from the aftermath itself: authorities demanding answers Francisco cannot provide without revealing temporal mechanics, citizens frightened by their altered memories, and Francisco's own instinct warning him the storm's subsiding feels too convenient, too orchestrated. As he walks Bologna's recovering streets with Dante, La Signora appears with ominous words: 'You've proven yourself capable. Now others will take notice—not all of them friends.' Before Francisco can respond, a procession of elegantly dressed figures enters the Piazza, bearing the Medici crest and an aura of temporal power far older and more refined than Francisco's raw willpower. The scene lands on wary anticipation.",
      focus: "Francisco's success stabilizing temporal storm attracts Medici attention, testing whether to trust authority",
      chapterSceneFocus: truncate("Ch44S1: Temporal storm's aftermath introduces Medici arrival as new pressure, establishing that Francisco's actions have attracted powerful organizations' attention", 255),
      preliminarySceneFocus: "Temporal storm aftermath reveals Francisco's success but introduces new pressure through Medici arrival",
      preliminarySceneDescription: "Dawn breaks over Bologna transformed—temporal storm subsided but city subtly altered, some buildings inexplicably newer, others older, citizens awakening with fragmentary memories of lives never lived. Francisco's team (Novella, father, Gherardo) successfully stabilized convergence points but exhaustion weighs. Francisco wants rest; city wants explanations. Opposition from authorities demanding answers Francisco can't provide, citizens frightened by altered memories, Francisco's instinct warning storm's subsiding feels orchestrated. Walking Bologna's recovering streets with Dante, La Signora appears: 'You've proven yourself capable. Now others will take notice—not all of them friends.' Before Francisco responds, procession of elegantly dressed figures enters Piazza bearing Medici crest and aura of temporal power far older than Francisco's raw willpower. Wary anticipation.",
      narrativeFunction: "Establishes the immediate aftermath of EA-043's temporal storm while introducing the chapter's central conflict: the Medici's arrival as consequence of Francisco's success. This scene transitions from willpower-based survival to political/organizational pressure, demonstrating that thriving under adversity requires more than raw determination—it demands strategic response to powerful factions seeking control.",
      sensoryDetail: "Dawn light revealing Bologna's subtle transformations—buildings with architectural styles from wrong centuries standing side by side. Citizens stumbling from homes with confused expressions, whispering about dreams that felt too real. Exhaustion weighing Francisco's limbs, vision blurring from sleepless night. The Piazza's cobblestones familiar yet somehow different. Then elegant figures approaching, their clothing impossibly fine, bearing Medici crest. The aura of temporal power radiating from them feels ancient, refined, utterly unlike Francisco's raw channeling—like comparing master craftwork to amateur improvisation.",
      internalConflict: "Francisco struggles with exhaustion's pull toward rest versus the immediate new threat the Medici represent. He grapples with pride in his success stabilizing the storm battling against instinctive warning that their arrival feels orchestrated, as if the storm was test rather than accident. The conflict between wanting to trust authority figures who claim protective intentions versus his gut sense that their refined temporal power carries hidden agendas. La Signora's warning intensifies his uncertainty about whether he's earned respect or merely attracted predators.",
      characterGrowthElement: "Francisco begins learning that success attracts consequences—his achievement stabilizing Bologna has marked him as significant player in temporal politics beyond his understanding. He's forced to recognize that thriving requires more than solving immediate crises; it demands navigating the attention and pressure that capability generates. This scene starts his journey from reactive problem-solver to strategic decision-maker who must evaluate powerful factions' true motives.",
      seriesConnectionResonance: "Introduces the Medici temporal banking conspiracy that will span Books 2-4, establishing them as major antagonistic force representing institutional control versus Francisco's independent path. La Signora's warning foreshadows the recurring pattern: Francisco's growth attracts notice from ancient powers. The altered Bologna establishes that timeline manipulation has lasting consequences affecting entire populations, raising stakes from individual survival to societal impact.",
      sceneCardProgression: 90,
      realWorldContext: "The scene mirrors real-world experience of success attracting unwanted attention—accomplishment making you visible to authorities, organizations, or competitors who want to control, recruit, or neutralize your capability. The exhaustion after crisis resolution reflects how solving one problem often immediately reveals the next. The instinctive warning about orchestrated events applies to situations where apparent solutions feel too convenient, suggesting hidden manipulation.",
      timelineSignificance: "Marks transition from Prime Timeline (Altered) where Francisco's willpower-based intervention has left lasting changes to Bologna's physical reality and citizens' memories. The Medici's arrival from outside normal time introduces temporal manipulation at organizational/institutional scale, contrasting Francisco's individual heroics with centuries-old systems of control. Dawn of Post-Book 1 + 5 days establishes brief recovery period before new pressures emerge.",
      saveTheCatBeat: truncate('Catalyst - New Threat Introduced', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on exhaustion weighing limbs and vision from sleepless night, walking Bologna's transformed streets with buildings from wrong centuries, citizens' confused whispers about too-real dreams, La Signora's ominous warning about attention earned, and the Medici procession's arrival with their ancient refined temporal power aura. Show the shift from accomplished exhaustion to wary tension as new threat materializes.",
        sudowrite_emotional_arc: 'Begins with exhausted satisfaction over storm stabilization, moves through wary concern as city reveals lasting alterations, escalates with La Signora\'s warning about unwanted attention, peaks with Medici arrival bringing refined threat. The emotional journey is from accomplished exhaustion through rising unease to wary anticipation of new pressure.',
        sudowrite_sensory_emphasis: 'Emphasize dawn light revealing architectural anachronisms, citizens stumbling with fragmented alternate-life memories, exhaustion blurring vision, familiar Piazza feeling subtly wrong, elegant Medici figures approaching with impossibly fine clothing, ancient refined temporal power aura radiating (master craftwork versus amateur improvisation contrast).',
      },
      learning_objectives: {
        integration: 'Success Attracts Consequences and Political Pressure Navigation',
        terminal_objectives: [
          "Recognize that success and capability attract attention from powerful organizations seeking to control, recruit, or neutralize independent actors",
          "Understand that thriving requires navigating the pressure and expectations that accomplishment generates, not just solving immediate problems",
          "Develop instinct for evaluating whether apparently helpful authority figures have hidden agendas versus genuine protective intentions",
        ],
      },
      foreshadowing_elements: [
        "La Signora's warning about unwanted attention foreshadows recurring pattern of Francisco's growth attracting ancient powers",
        "The Medici's refined temporal power aura foreshadows their centuries-old manipulation systems revealed in later scenes",
        "Bologna's lasting alterations foreshadow the societal-scale consequences of timeline manipulation explored across Book 2",
      ],
    },
    {
      // Scene 2: The Medici Demand
      pages: 'Page 50 - 54',
      description: "In the Medici Temporal Vault—a building that exists partially outside normal time, its interior simultaneously Gothic and Renaissance and inexplicably modern—Francisco faces Cardinal Lorenzo de' Medici and his sister Contessina, who command temporal banking operations spanning centuries and timelines. They claim they've been tracking temporal irregularities for generations and present themselves as protectors of reality's fabric. Francisco wants to understand their true motives and maintain control of his Trionfi cards; the Medici want Francisco to surrender the cards 'for the greater good,' revealing they possess artifacts from multiple timelines as evidence of their authority. Opposition intensifies through their sophisticated manipulation (offering gold, political protection, veiled threats about his family's safety), their revelation that other groups have used temporal power for centuries (Francisco is not unique, merely untrained), and Francisco's self-doubt—perhaps they're right, perhaps he's reckless with forces beyond his comprehension. But as Cardinal Lorenzo reaches for The World card, Francisco's instinct screams danger. La Signora's presence (invisible to the Medici but felt by Francisco) whispers resilience strategies: reframe the pressure as opportunity to define his own path, recognize their 'protection' as control. The scene lands on Francisco's instinctive refusal.",
      focus: 'Medici reveal temporal banking conspiracy demanding Francisco\'s cards, prompting his refusal of the call',
      chapterSceneFocus: truncate("Ch44S2: Medici demand Francisco's cards revealing centuries-old temporal manipulation systems, testing his first major leadership decision through instinctive refusal", 255),
      preliminarySceneFocus: "Medici reveal temporal banking conspiracy and demand cards 'for greater good,' prompting Francisco's instinctive refusal",
      preliminarySceneDescription: "In Medici Temporal Vault—building existing partially outside normal time, interior simultaneously Gothic, Renaissance, and modern—Francisco faces Cardinal Lorenzo de' Medici and sister Contessina commanding temporal banking across centuries and timelines. They claim tracking temporal irregularities for generations, presenting as reality's fabric protectors. Francisco wants true motives understanding and card control; Medici want card surrender 'for greater good,' revealing artifacts from multiple timelines as authority evidence. Opposition through sophisticated manipulation (gold offers, political protection, veiled family threats), revelation that other groups used temporal power for centuries (Francisco not unique, merely untrained), and Francisco's self-doubt—perhaps they're right, perhaps he's reckless. But as Cardinal Lorenzo reaches for The World card, Francisco's instinct screams danger. La Signora's presence (invisible to Medici, felt by Francisco) whispers resilience strategies: reframe pressure as path-defining opportunity, recognize 'protection' as control. Instinctive refusal.",
      narrativeFunction: "Reveals the Medici temporal banking conspiracy as major antagonistic force representing institutional control of timeline manipulation for economic/political power. This scene establishes Francisco's first major leadership test—whether to trust authority claiming protective intentions or follow instinct recognizing hidden agendas. His refusal of their demand demonstrates the 'Refusal of the Call' beat while setting up the chapter's resilience theme: thriving under pressure requires maintaining autonomy despite sophisticated manipulation.",
      sensoryDetail: "The Vault's interior defying temporal logic—Gothic arches flowing into Renaissance columns into sleek modern steel, all coexisting impossibly. Cardinal Lorenzo's robes simultaneously medieval and contemporary, Contessina's jewelry glittering with stones that shouldn't exist yet. Artifacts from multiple timelines displayed like trophies: Roman coins bearing dates centuries future, medieval manuscripts describing technologies not yet invented. The offered gold feeling heavy and wrong in Francisco's hand. Cardinal Lorenzo's reach toward The World card triggering visceral alarm—Francisco's gut screaming danger despite no visible threat. La Signora's invisible presence like warm pressure against his awareness.",
      internalConflict: "Francisco battles between self-doubt (are they right that he's dangerously untrained and reckless?) versus instinctive recognition of manipulation beneath their protective rhetoric. He grapples with the tempting offer of support, training, resources against the warning that accepting means surrendering autonomy. The revelation that he's not unique—other groups have used temporal power for centuries—challenges his sense of significance while simultaneously warning him these aren't benevolent guardians but power-seekers. His instinct's screaming alarm wars against intellectual argument that refusing powerful allies is foolish.",
      characterGrowthElement: "Francisco takes his first major step toward leadership by trusting his instinct over sophisticated authority figures offering seemingly reasonable demands. He learns that thriving under pressure requires recognizing when 'help' is actually control, when 'protection' means submission. This scene demonstrates his growth from reactive survivor to strategic decision-maker who evaluates motives beneath surface claims. His refusal establishes the pattern: he'll build his own path rather than accept others' definitions of 'greater good.'",
      seriesConnectionResonance: "Establishes the Medici temporal banking conspiracy as core antagonistic force across Books 2-4—institutional manipulation of timelines for economic/political control. Cardinal Lorenzo and Contessina become recurring adversaries representing temptation toward 'safe' submission to established power. La Signora's resilience guidance positions her as mentor teaching Francisco to thrive through autonomy. The Vault's existence outside normal time foreshadows the architectural/spatial manipulation explored in later books.",
      sceneCardProgression: 91,
      realWorldContext: "The scene mirrors real-world pressure from institutions, authorities, or established powers demanding individuals surrender autonomy 'for the greater good'—whether corporate structures requiring loyalty over independence, political systems demanding conformity, or social pressures to accept others' definitions of success. The sophisticated manipulation (offers mixed with veiled threats, appeals to inexperience) reflects how power structures recruit or neutralize independent actors. Francisco's instinctive refusal models trusting gut warning over intellectual argument.",
      timelineSignificance: "The Medici Temporal Vault exists Outside Normal Time, revealing that institutional temporal manipulation operates at different scale than Francisco's individual interventions—entire buildings existing across multiple timeline states simultaneously. Morning of Post-Book 1 + 5 days marks Francisco's first encounter with organized temporal power systems predating his awakening by centuries, shifting his understanding from unique individual to small player in ancient conflicts.",
      saveTheCatBeat: truncate('Catalyst - Refusal of the Call', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on the Vault's impossible temporal architecture (Gothic/Renaissance/modern coexisting), Cardinal Lorenzo and Contessina's anachronistic clothing and jewelry, displayed artifacts from multiple timelines, offered gold feeling heavy and wrong, Cardinal Lorenzo's reach toward The World card triggering visceral alarm, La Signora's invisible warm pressure, and the instinctive refusal despite self-doubt. Show the tension between intellectual argument and gut warning.",
        sudowrite_emotional_arc: 'Begins with wary curiosity about Medici claims, descends through self-doubt as they reveal his non-uniqueness and present sophisticated arguments, intensifies with temptation of offered support battling instinctive alarm, peaks with visceral danger response to card-touching, resolves with instinctive refusal. The emotional journey is from uncertain evaluation through mounting pressure to decisive rejection based on gut warning.',
        sudowrite_sensory_emphasis: 'Emphasize Vault defying temporal logic (architectural styles coexisting impossibly), Cardinal Lorenzo and Contessina wearing temporally impossible clothing/jewelry, timeline artifacts displayed as trophies, offered gold heavy and wrong-feeling, reaching hand triggering visceral alarm, La Signora as invisible warm awareness-pressure.',
      },
      learning_objectives: {
        integration: 'Institutional Manipulation Recognition and Autonomous Decision-Making',
        terminal_objectives: [
          "Recognize when authority figures' protective rhetoric masks control agendas—'help' that requires surrendering autonomy is manipulation, not support",
          "Trust instinctive warning over intellectual argument when sophisticated pressure appeals to self-doubt or inexperience",
          "Understand that thriving under pressure demands maintaining autonomy and building independent path rather than accepting others' definitions of 'greater good'",
        ],
      },
      foreshadowing_elements: [
        "The Medici's temporal banking conspiracy foreshadows economic/political control revelations in Books 3-4",
        "Cardinal Lorenzo's reach toward The World card foreshadows his recurring attempts to claim Francisco's power",
        "La Signora's resilience strategies whisper foreshadows her ongoing role as mentor teaching thriving through autonomy",
      ],
    },
    {
      // Scene 3: Roger's Alternative
      pages: 'Page 55 - 58',
      description: "Francisco flees the vault with his cards, emerging into Bologna's Piazza to find a military encampment suddenly manifested—the Catalan Company under Roger de Flor, the legendary mercenary who serves as temporal enforcer for forces opposed to the Medici. Roger, scarred and charismatic, offers Francisco protection and training, revealing that the Medici's 'greater good' means controlling all temporal power for their economic empire. Francisco wants to understand the larger conflict he's stumbled into; Roger wants to recruit Francisco's raw power for his own causes. Opposition comes from all sides: the Medici demanding he return, Roger pressuring alliance, Dante urging caution, and Francisco's exhaustion threatening his judgment. But Roger offers something compelling—not control of Francisco's cards but partnership, teaching him to thrive under pressure rather than merely survive it. As Gherardo watches his brother courted by powerful factions, his jealousy deepens into something darker. La Signora manifests fully, visible to all, revealing herself as neither Medici nor Catalan but something older: 'True thriving means building your own support network, not choosing between masters.' The scene lands on Francisco rejecting both offers, choosing autonomy.",
      focus: "Roger offers military alliance as alternative to Medici, but Francisco chooses autonomous path",
      chapterSceneFocus: truncate("Ch44S3: Roger de Flor offers military protection alternative revealing larger temporal conflicts, but Francisco's autonomy choice demonstrates adaptive resilience over submission", 255),
      preliminarySceneFocus: "Roger offers military protection as Medici alternative, but Francisco chooses autonomy over both factions",
      preliminarySceneDescription: "Francisco flees vault with cards, emerging into Bologna's Piazza finding military encampment suddenly manifested—Catalan Company under Roger de Flor, legendary mercenary serving as temporal enforcer for anti-Medici forces. Roger, scarred and charismatic, offers protection and training, revealing Medici's 'greater good' means controlling all temporal power for economic empire. Francisco wants larger conflict understanding; Roger wants recruiting Francisco's raw power. Opposition from all sides: Medici demanding return, Roger pressuring alliance, Dante urging caution, exhaustion threatening judgment. But Roger offers compelling partnership—not card control but teaching thriving under pressure versus mere survival. Gherardo watching brother courted by powerful factions, jealousy deepening darker. La Signora manifests fully, visible to all, revealing herself as neither Medici nor Catalan but older: 'True thriving means building your own support network, not choosing between masters.' Francisco rejecting both offers, choosing autonomy.",
      narrativeFunction: "Introduces Roger de Flor as Francisco's future military ally while demonstrating the chapter's core lesson: thriving requires building authentic support networks rather than choosing between powerful masters. This scene completes the 'Refusal of the Call' by having Francisco reject both Medici control and Catalan recruitment, establishing his path toward independent network-building. La Signora's full manifestation reveals her role as guide toward autonomous resilience rather than factional tool.",
      sensoryDetail: "Emerging from Vault into Piazza suddenly crowded with Catalan Company encampment—military tents appearing as if they'd always been there, soldiers moving with disciplined efficiency. Roger de Flor scarred face telling stories of countless battles, charismatic presence commanding attention despite—or because of—his mercenary brutality. The clash of Medici elegance behind versus Catalan military pragmatism ahead creating pressure from both sides. Gherardo's face twisted with jealousy watching powerful factions court his brother. Then La Signora fully manifesting, visible to everyone, her presence older and stranger than either faction can comprehend—like glimpsing force predating all their conflicts.",
      internalConflict: "Francisco struggles with exhaustion making Roger's offer of partnership and training incredibly tempting—finally someone offering to teach rather than control or recruit. He grapples with the seductive logic that choosing one faction over the other constitutes independent choice, versus the deeper recognition that both options mean surrendering autonomy to others' agendas. The conflict intensifies through Dante's cautionary wisdom battling Roger's compelling charisma, while Gherardo's darkening jealousy adds guilt to Francisco's decision calculus. Ultimately he must recognize that 'thriving' isn't about picking the right master but building his own support.",
      characterGrowthElement: "Francisco achieves critical growth by recognizing that true autonomy means rejecting both factions—the choice isn't which master to serve but whether to serve at all. He learns that thriving under pressure requires building authentic support networks based on genuine relationships (Dante, Novella, La Signora, family) rather than accepting powerful allies' partnership offers that still ultimately mean following their agendas. His rejection of Roger despite the compelling training offer demonstrates maturity: understanding that growth through submission isn't growth at all.",
      seriesConnectionResonance: "Establishes Roger de Flor as Francisco's primary military ally across the series—but on Francisco's terms, not Roger's recruitment. This scene sets the pattern: Francisco will work with powerful figures but never for them, maintaining autonomy while building cooperative networks. Gherardo's deepening jealousy foreshadows the sibling conflict arc spanning Books 2-3. La Signora's full manifestation positions her as ancient force beyond factional conflicts, guiding Francisco toward self-determined thriving.",
      sceneCardProgression: 92,
      realWorldContext: "The scene mirrors real-world pressure where rejecting one bad option leads to immediately facing another 'alternative' that seems better but still demands submission—the illusion of choice between limited options presented by powerful entities. Roger's offer represents the seductive logic of picking 'lesser evil' or 'more aligned' master rather than maintaining true autonomy. Francisco's rejection models recognizing that thriving means building own support networks, not choosing between others' agendas. Applies to career decisions, political affiliations, social allegiances.",
      timelineSignificance: "Afternoon of Post-Book 1 + 5 days in Prime Timeline with Military Manifestation shows how temporal power allows instant deployment of entire military forces—the Catalan Company appearing in Piazza as if always present. This demonstrates organizational-scale timeline manipulation beyond Francisco's individual interventions. The Military Manifestation timeline variant establishes that multiple factions can simultaneously manipulate same location's reality, creating competing pressures Francisco must navigate.",
      saveTheCatBeat: truncate('Debate - Choosing Autonomy', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on emerging from Vault into Piazza suddenly filled with Catalan encampment, Roger de Flor's scarred charismatic presence offering compelling partnership, pressure from both sides (Medici elegance versus Catalan pragmatism), Gherardo's jealousy-twisted face, exhaustion making training offer seductive, La Signora fully manifesting visible to all as ancient force beyond factions, and the clarity of rejecting both offers. Show the shift from exhausted temptation to autonomous determination.",
        sudowrite_emotional_arc: 'Begins with exhausted relief fleeing Medici, shifts through surprise at Catalan manifestation, temptation at Roger\'s compelling training offer, pressure from all sides demanding choice, guilt over Gherardo\'s jealousy, resolves with clarity choosing autonomy over masters. The emotional journey is from desperate escape through seductive alternatives to determined self-determination.',
        sudowrite_sensory_emphasis: 'Emphasize Catalan encampment appearing as if always present, Roger\'s battle-scarred charismatic face, clash of Medici elegance behind versus military pragmatism ahead creating pressure, Gherardo\'s jealousy-twisted expression, La Signora fully manifesting as ancient presence predating all conflicts (visible to everyone), clarity of autonomous choice.',
      },
      learning_objectives: {
        integration: 'Autonomous Network-Building Over Factional Submission',
        terminal_objectives: [
          "Recognize that choosing between powerful factions' limited options isn't true autonomy—thriving requires rejecting both and building own support networks",
          "Understand that compelling 'partnership' offers from powerful entities still mean following their agendas rather than self-determined path",
          "Learn to reframe pressure as opportunity to define independent values and relationships rather than selecting 'lesser evil' master",
        ],
      },
      foreshadowing_elements: [
        "Roger de Flor's introduction foreshadows his recurring role as military ally on Francisco's terms, not recruitment",
        "Gherardo's deepening jealousy foreshadows sibling conflict arc in Books 2-3",
        "La Signora manifesting as ancient force beyond factions foreshadows her true nature revealed later in series",
      ],
    },
    {
      // Scene 4: Thriving Through Choice
      pages: 'Page 59 - 60',
      description: "That evening, Francisco gathers his true support network—not ancient conspiracies or military powers, but Dante, Novella, La Signora, his family, and reluctantly Gherardo—in his home sanctuary to process the day's revelations. Francisco wants to articulate his choice to forge an independent path; his network wants to commit to supporting his autonomy. The Medici and Roger both send final messages: join us or face consequences. Opposition dissolves as Francisco reframes the entire situation: the pressure isn't a threat to survive but an opportunity to define what thriving means on his own terms. He proposes building an independent network focused on protecting reality without controlling it, using temporal power for flourishing rather than accumulation. Novella commits her perception abilities; Dante his knowledge; La Signora her ancient wisdom; even Gherardo, struggling with jealousy, acknowledges he'd rather support his brother's autonomy than watch him become someone else's tool. As Francisco integrates rest rituals into his practice (La Signora's insistence), cultivates gratitude for his support bonds, and reinterprets the day's stress as signals for deliberate growth, he discovers true resilience. The scene lands on optimistic determination—Francisco has refused the call to become pawn or weapon and instead chosen to thrive as independent guardian.",
      focus: 'Francisco builds independent support network, reframing pressure as growth opportunity and choosing to thrive autonomously',
      chapterSceneFocus: truncate('Ch44S4: Francisco completes refusal of the call by building independent network and reframing pressure as growth, establishing autonomous thriving path', 255),
      preliminarySceneFocus: 'Francisco gathers true support network and reframes pressure as opportunity, choosing independent guardian path',
      preliminarySceneDescription: "Evening, Francisco gathers true support network—not conspiracies or military powers but Dante, Novella, La Signora, family, reluctantly Gherardo—in home sanctuary processing day's revelations. Francisco wants articulating independent path choice; network wants committing to supporting autonomy. Medici and Roger send final messages: join or face consequences. Opposition dissolves as Francisco reframes entire situation: pressure isn't threat to survive but opportunity defining thriving on own terms. Proposes building independent network protecting reality without controlling it, using temporal power for flourishing versus accumulation. Novella commits perception abilities; Dante knowledge; La Signora ancient wisdom; even Gherardo, struggling jealousy, acknowledges preferring supporting brother's autonomy over watching him become tool. Francisco integrates rest rituals (La Signora's insistence), cultivates gratitude for support bonds, reinterprets stress as growth signals, discovering true resilience. Optimistic determination—refused call to become pawn/weapon, chosen thriving as independent guardian.",
      narrativeFunction: "Completes the chapter's 'Refusal of the Call' arc by demonstrating what thriving truly means: building authentic support networks based on genuine relationships rather than accepting powerful factions' offers. This scene establishes Francisco's independent guardian path—protecting reality without controlling it, using temporal power for flourishing rather than accumulation. The integration of rest rituals, gratitude practices, and stress reframing demonstrates adaptive resilience strategies that transform pressure into growth opportunity.",
      sensoryDetail: "Evening light warm in Francisco's home sanctuary, his true network gathered—Dante's scholarly presence, Novella's perceptive quiet, La Signora's ancient warmth, family's concerned support, even Gherardo's reluctant participation despite jealousy. The Medici and Roger's messages arriving as temporal pressure (feeling like weights attempting to crush choice), Francisco consciously reframing them as opportunities clarifying his values. Rest settling into bones as he finally allows exhaustion acknowledgment. Gratitude warming chest as each network member commits support. The stress signals transforming from threats into growth indicators through deliberate reinterpretation.",
      internalConflict: "Francisco battles final temptation—the messages from both factions threatening consequences create fear about facing powerful enemies alone. He grapples with doubt whether his small network of genuine relationships can withstand institutional and military pressure. The conflict between exhaustion urging acceptance of offered support versus recognition that rest and autonomy matter more than powerful allies. Ultimately he must choose to trust that thriving through authentic bonds and self-determined values will prove stronger than submission to established power, even facing consequences.",
      characterGrowthElement: "Francisco achieves the chapter's core growth: understanding that true resilience and thriving come from building support networks based on authentic relationships, integrating self-care practices, cultivating gratitude, and reframing pressure as growth opportunity rather than accepting powerful allies' agendas. He learns that protecting reality doesn't require controlling it, that temporal power can serve flourishing rather than accumulation. His choice to face consequences of autonomy rather than submit demonstrates mature leadership—valuing self-determined thriving over security through submission.",
      seriesConnectionResonance: "Establishes Francisco's independent guardian network that becomes the foundation for his journey across Books 2-4: Dante, Novella, La Signora, family, and eventually Gherardo as core support rather than institutional backing. The philosophy of protecting reality without controlling it, using power for flourishing versus accumulation, defines his approach throughout the series. Rest integration, gratitude cultivation, and stress reframing as adaptive resilience strategies recur as tools for sustainable guardianship rather than burnout heroics.",
      sceneCardProgression: 93,
      realWorldContext: "The scene mirrors real-world recognition that thriving comes from building authentic support networks based on genuine relationships rather than accepting powerful entities' offers requiring submission. Francisco's rest integration, gratitude practices, and stress reframing model adaptive resilience strategies applicable to any high-pressure situation—recognizing that sustainable success requires self-care and deliberate growth orientation rather than just toughing through. Choosing autonomy despite facing consequences applies to career independence, value-based decisions, authentic relationship building.",
      timelineSignificance: "Evening of Post-Book 1 + 5 days in Prime Timeline (Francisco's Sanctuary) marks the establishment of his home as independent network hub—a timeline anchor point defined by authentic relationships and self-determined values rather than institutional or military control. This Sanctuary variant becomes stable reference point across timeline fluctuations in later chapters, demonstrating that genuine bonds create temporal stability through meaning rather than power.",
      saveTheCatBeat: truncate('Debate - Independent Path Chosen', 100),
      sudowrite_metadata: {
        sudowrite_pov_guidance: "Francisco's POV: Focus on evening warmth in home sanctuary with gathered network (Dante, Novella, La Signora, family, reluctant Gherardo), temporal pressure of threatening messages consciously reframed as value-clarifying opportunities, rest settling into exhausted bones, gratitude warming chest as commitments given, stress signals transforming into growth indicators through deliberate reinterpretation, and optimistic determination choosing autonomous thriving over submission. Show the shift from pressured doubt to grounded purpose.",
        sudowrite_emotional_arc: 'Begins with gathering network amid threatening messages creating fear, moves through doubt about small network facing powerful enemies, transforms with deliberate pressure reframing into opportunity, deepens with gratitude as commitments solidify authentic bonds, resolves with optimistic determination and grounded purpose. The emotional journey is from threatened uncertainty through deliberate resilience cultivation to self-determined thriving.',
        sudowrite_sensory_emphasis: 'Emphasize evening light warmth in sanctuary, network members gathered (each bringing distinct presence—Dante scholarly, Novella perceptive, La Signora ancient, family concerned, Gherardo reluctant), threatening messages as temporal weight-pressure, rest settling into bones, gratitude warming chest, stress transforming into growth signals through reinterpretation.',
      },
      learning_objectives: {
        integration: 'Authentic Network-Building and Adaptive Resilience Through Self-Care',
        terminal_objectives: [
          "Build support networks based on authentic relationships and shared values rather than accepting powerful allies requiring submission to their agendas",
          "Integrate rest rituals, gratitude practices, and stress reframing as adaptive resilience strategies enabling sustainable thriving under pressure",
          "Redefine success and thriving through self-determined metrics—flourishing, meaning, authentic bonds—rather than conventional power/control accumulation",
        ],
      },
      foreshadowing_elements: [
        "Francisco's independent network (Dante, Novella, La Signora, family, Gherardo) foreshadows core support throughout Books 2-4",
        "Philosophy of protecting reality without controlling it foreshadows his guardian approach across series",
        "Rest integration and gratitude cultivation foreshadow sustainable practices preventing burnout in later challenges",
      ],
    },
  ];

  for (let i = 0; i < insertedScenes.length; i++) {
    const scene = insertedScenes[i];
    const enhancement = sceneEnhancements[i];

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
        sudowrite_metadata: JSON.stringify(enhancement.sudowrite_metadata),
        learning_objectives: JSON.stringify(enhancement.learning_objectives),
        foreshadowing_elements: JSON.stringify(enhancement.foreshadowing_elements),
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${i + 1}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-044 complete import finished!');
  console.log('👑 THRIVE - Independent Guardian Path Chosen!\n');

  // Verify all fields are populated
  console.log('\n📊 Verifying scene completion...\n');

  for (let i = 0; i < insertedScenes.length; i++) {
    const scene = insertedScenes[i];
    const [verifiedScene] = await db
      .select()
      .from(scenes)
      .where(eq(scenes.id, scene.id));

    const fields = [
      'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
      'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
      'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
      'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
      'learning_objectives', 'foreshadowing_elements', 'sceneNumber', 'title', 'setup',
      'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_date',
      'timeline_variant', 'location',
    ];

    const populatedCount = fields.filter(field => verifiedScene[field as keyof typeof verifiedScene] != null).length;
    console.log(`Scene ${i + 1}: ${populatedCount}/${fields.length} fields populated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
