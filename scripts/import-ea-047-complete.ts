import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-047: Sophisticated (Book 2, Chapter 7)...\n');

  // Get chapter EA-047
  const [ch47] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-047'))
    .limit(1);

  if (!ch47) {
    console.error('❌ EA-047 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch47.title} (ID: ${ch47.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'The Alexandrian Approach',
      setup: 'The Zanetti Train arrives at a timeline where the famous Library of Alexandria was never burned—instead, it exists across multiple time periods simultaneously, a crystalline fortress of preserved knowledge from extinct timelines. Francisco, La Signora, Novella, and Gherardo are greeted by Alexandrian Scholars led by Hypatia Tertius (descended from the legendary mathematician), who argue passionately that timeline manipulation\'s highest purpose is knowledge preservation. They show Francisco rooms filled with lost texts, extinct languages, scientific discoveries from timelines that collapsed—all saved through careful temporal intervention. Francisco wants to understand if this preservation justifies timeline manipulation; the scholars want his support and his Trionfi\'s power to expand their preservation efforts. Opposition emerges from the scholars\' troubling admission: they\'ve let natural historical developments stagnate in favor of copying knowledge from other timelines, creating a civilization that hoards wisdom but produces nothing new. As Hypatia demonstrates how they\'ve "rescued" knowledge by allowing source timelines to die so artifacts could be extracted, Francisco\'s gratitude from the Terminal transforms into troubled uncertainty. Good intentions yielding terrible consequences. The scene lands on intellectual conflict and rising ethical doubt.',
      symbolism: 'The Queen of Swords embodies the chapter\'s discernment theme: clear-minded judgment cutting through emotional appeals to perceive truth. The Alexandrians represent sophisticated thinking that has become divorced from ethical wisdom—intellect without heart, preservation without understanding the cost to living timelines.',
      beat_goal: 'Francisco encounters Alexandrian Scholars who use timeline manipulation to preserve knowledge across realities, discovers they\'ve allowed source timelines to stagnate and die for extraction purposes, and begins developing nuanced judgment about how good intentions can yield terrible consequences, establishing the ethical complexity of temporal power.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Intellectual conflict and ethical doubt',
      scene_tone: 'Cerebral and troubling',
      timeline_date: 'Alexandria Timeline (Multi-Period Convergence)',
      timeline_variant: 'Preserved Alexandria Across Time',
      location: 'Library of Alexandria - Temporal Fortress',
    },
    {
      scene_number: 2,
      scene_title: 'The Byzantine Intervention',
      setup: 'Fleeing the Library\'s suffocating preservation, Francisco\'s group arrives at a Byzantine Stronghold existing at the intersection of multiple historical moments—warriors from different eras defending against temporal threats. General Constantine Dragases leads these interventionists who argue that timeline manipulation should prevent historical disasters: they\'ve stopped plagues, prevented wars, saved countless lives across realities. Francisco wants to believe in noble intervention; Constantine wants Francisco\'s emerging power to help them expand their protective reach. They demonstrate successes—showing timelines where their interventions prevented the Black Death, stopped the Mongol invasions, preserved civilizations. But La Signora forces Francisco to look deeper: each intervention created new problems, cascading consequences the Byzantines then tried to fix with more interventions, creating dependency cycles where civilizations never developed natural resilience. Opposition intensifies through Francisco\'s internal debate (both groups use compelling logic), external pressure (both demanding he choose sides), and his growing realization that neither approach is wise—both treat timelines as resources to manipulate rather than living systems to respect. The scene lands on paralyzing complexity and mounting pressure.',
      symbolism: 'The Queen wielding her sword in multiple directions: Francisco must balance intuition (Constantine\'s passion) with reason (seeing unintended consequences), learning to pause quick emotional judgments for deeper analysis, demonstrating that discernment requires recognizing when noble intentions mask flawed assumptions about control and intervention.',
      beat_goal: 'Francisco encounters Byzantine Warriors who use timeline manipulation to prevent historical disasters, discovers their interventions create cascading consequences and dependency cycles, faces pressure to choose sides, and recognizes that both Alexandrian and Byzantine approaches treat timelines as resources not living systems, developing sophisticated thinking about power requiring wisdom beyond good intentions.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Paralyzing complexity and mounting pressure',
      scene_tone: 'Intense and action-packed',
      timeline_date: 'Byzantine Stronghold (Multi-Era Intersection)',
      timeline_variant: 'Defensive Position Across Time',
      location: 'Byzantine Stronghold - War Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Butterfly\'s Wings',
      setup: 'As tensions escalate between Alexandrians and Byzantines (each demanding Francisco declare allegiance), La Signora guides him to a neutral observation point where they can witness the consequences of both philosophies. Using his Trionfi cards to perceive timeline ripples, Francisco traces how the Alexandrians\' knowledge extraction from a single timeline created seven cascading collapses, and how the Byzantines\' plague prevention in another timeline led to overpopulation, resource wars, and greater eventual death tolls. Francisco wants clear answers about the right approach; La Signora wants him to develop nuanced judgment beyond binary thinking. Novella perceives the timeline ribbons showing infinite causal chains; Gherardo struggles with the weight of these impossible choices. Opposition comes from Francisco\'s desire for simple rules (his legal training seeking clear precedent), both groups\' representatives arriving to press their cases, and his fear that any use of temporal power leads to disaster. But as he applies scenario mapping, pros-and-cons frameworks, and reflective dialogue with his companions, Francisco begins developing sophisticated discernment: timeline manipulation always has unintended consequences—the butterfly effect on cosmic scale—and wisdom means understanding limits, not just wielding power skillfully. The scene lands on emerging sophisticated understanding.',
      symbolism: 'The Queen surveying the battlefield with clarity: Francisco implements decision-making tools (scenario mapping, frameworks, reflective dialogue) to elevate judgment beyond impulse, demonstrating that sophisticated discernment requires recognizing cognitive biases, applying structured thinking to surface hidden assumptions, and accepting that some problems have no perfect solutions only wiser approaches.',
      beat_goal: 'Francisco witnesses cascading consequences of both Alexandrian and Byzantine approaches through timeline perception, applies structured decision-making tools (scenario mapping, frameworks, dialogue) to move beyond binary thinking, and develops sophisticated understanding that timeline manipulation always has unintended consequences requiring wisdom about limits not just skillful power use, establishing the core ethical framework for temporal responsibility.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Emerging clarity and sophisticated understanding',
      scene_tone: 'Contemplative and revelatory',
      timeline_date: 'Neutral Observation Point (Between Factions)',
      timeline_variant: 'Timeline Ripple Perception',
      location: 'Temporal Observatory - Neutral Ground',
    },
    {
      scene_number: 4,
      scene_title: 'The Third Way',
      setup: 'Armed with sophisticated discernment, Francisco returns to face both Alexandrians and Byzantines with his decision—he will not join either faction. Instead, he articulates a third approach: timeline manipulation should be used minimally, with deep respect for natural development, accepting that preventing all suffering means preventing all growth. Hypatia accuses him of abandoning knowledge; Constantine of allowing preventable tragedies. Francisco wants to maintain his ethical stance despite pressure; both factions want to change his mind through escalating tactics. Opposition peaks as they attempt to force Francisco\'s choice—Alexandrians threatening to seal knowledge from his timeline, Byzantines suggesting his refusal enables disasters he could prevent. But Francisco has developed nuanced judgment: he recognizes their emotional manipulation (detecting cognitive fallacies), implements his decision checklist (pause for analysis, surface assumptions, balance speed with accuracy), and trusts his calibrated intuition that both approaches are fundamentally flawed because they assume human wisdom can safely control cosmic systems. La Signora reveals this was her test—many timeline travelers align with one faction, losing themselves in false certainty. Francisco\'s sophistication lies in accepting complexity, limits, and uncertainty. As they return to the train, Francisco commits to developing decision-making frameworks that balance intervention and restraint. The scene lands on committed ethical sophistication despite ongoing uncertainty.',
      symbolism: 'The Queen sheathing her sword after careful judgment: Francisco demonstrates mature discernment by choosing neither preservation nor intervention but a third way of minimal manipulation with deep respect, proving that true sophistication means accepting complexity without seeking false certainty, implementing structured decision processes, and recognizing that wisdom includes knowing what not to do, establishing his ethical framework for the series.',
      beat_goal: 'Francisco articulates a third approach rejecting both Alexandrian preservation and Byzantine intervention in favor of minimal manipulation with respect for natural development, withstands faction pressure through sophisticated decision-making tools (detecting fallacies, implementing checklists, trusting calibrated intuition), passes La Signora\'s test by accepting complexity over false certainty, and commits to frameworks balancing intervention and restraint, establishing his core ethical philosophy that power requires wisdom about limits.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Committed ethical clarity and mature acceptance',
      scene_tone: 'Resolute and principled',
      timeline_date: 'Confrontation Moment (Decision Point)',
      timeline_variant: 'Faction Convergence',
      location: 'Neutral Meeting Ground / Return to Zanetti Train',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: The Alexandrian Approach
      pages: 'Page 91 - 95',
      description: 'Francisco encounters Alexandrian Scholars who preserve knowledge from extinct timelines, discovering they allow source realities to die for extraction, raising ethical questions about good intentions and terrible consequences.',
      focus: 'Francisco\'s first encounter with competing timeline manipulation philosophies and the discovery that knowledge preservation may justify timeline deaths',
      chapterSceneFocus: 'Ch47S1: Francisco encounters Alexandrian Scholars preserving knowledge across realities, discovers they allow source timelines to die for extraction, begins developing nuanced judgment about good intentions yielding terrible consequences',
      preliminarySceneFocus: 'Confronting ethical complexity of temporal power',
      preliminarySceneDescription: 'The Library of Alexandria across time reveals how sophisticated thinking divorced from ethical wisdom leads to preservation without understanding costs',
      narrativeFunction: 'Introduces first competing philosophy of timeline manipulation (preservation) and establishes ethical complexity requiring discernment beyond surface-level good intentions',
      sensoryDetail: 'Crystalline fortress spanning time periods, rooms filled with lost texts and extinct languages, Hypatia Tertius showing rescued knowledge from collapsed timelines',
      internalConflict: 'Francisco torn between admiration for knowledge preservation and horror at cost to living timelines, desire to support noble goals versus recognition of stagnation they create',
      characterGrowthElement: 'Francisco begins moving from binary good/bad thinking toward nuanced judgment recognizing unintended consequences of well-intentioned actions',
      seriesConnectionResonance: 'Alexandrian knowledge preservation approach influences Francisco\'s ultimate decision about temporal power use in Book 9',
      sceneCardProgression: 102,
      realWorldContext: '14th century scholar encountering multi-period Alexandria library preserving extinct timeline knowledge',
      timelineSignificance: 'Multi-period convergence where Alexandria never burned but exists across time',
      saveTheCatBeat: 'Fun and Games - exploring competing philosophies and their consequences',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium - balancing intellectual exploration with troubling revelations',
        tension_level: 'Moderate rising - admiration transforming to ethical doubt',
        emotional_arc: 'Wonder → Admiration → Troubled uncertainty',
      }),
      learning_objectives: JSON.stringify([
        'Develop discernment to recognize when good intentions mask flawed assumptions',
        'Apply nuanced judgment to evaluate unintended consequences of actions',
        'Understand that preserving knowledge may require sacrificing living development',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Knowledge extraction causing timeline collapses (butterfly effect established)',
        'Stagnation from relying on other timelines rather than developing naturally',
        'Francisco\'s legal training seeking clear precedent (will be challenged)',
      ]),
    },
    {
      // Scene 2: The Byzantine Intervention
      pages: 'Page 96 - 99',
      description: 'Francisco encounters Byzantine Warriors who prevent historical disasters through timeline intervention, discovering each intervention creates cascading consequences and dependency cycles that undermine natural resilience.',
      focus: 'Francisco faces the second competing philosophy—noble intervention—and recognizes both approaches treat timelines as resources rather than living systems',
      chapterSceneFocus: 'Ch47S2: Francisco encounters Byzantine Warriors preventing disasters through intervention, discovers cascading consequences and dependency cycles, faces pressure to choose sides while recognizing both factions treat timelines as resources not living systems',
      preliminarySceneFocus: 'Balancing intervention impulse with consequence awareness',
      preliminarySceneDescription: 'Byzantine Stronghold across eras demonstrates how preventing suffering through intervention creates new problems requiring more intervention',
      narrativeFunction: 'Introduces second competing philosophy (intervention) and intensifies ethical complexity by showing both preservation and intervention have fatal flaws',
      sensoryDetail: 'Fortress at intersection of historical moments, warriors from different eras, timelines showing prevented plagues and stopped invasions alongside cascading new problems',
      internalConflict: 'Francisco torn between desire to prevent suffering and recognition that intervention prevents natural resilience, pressure to choose sides versus growing sense neither approach is wise',
      characterGrowthElement: 'Francisco develops capacity to resist emotional manipulation through deeper analysis, recognizing noble intentions can mask control assumptions',
      seriesConnectionResonance: 'Byzantine intervention philosophy represents temptation Francisco will face in Books 4-5 when he has power to prevent tragedies',
      sceneCardProgression: 103,
      realWorldContext: 'Multi-era Byzantine stronghold defending against temporal threats with warriors across time',
      timelineSignificance: 'Intersection of multiple historical moments creating defensive position',
      saveTheCatBeat: 'Fun and Games - exploring second philosophy and mounting pressure',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium-fast - escalating tension through competing demands',
        tension_level: 'High - mounting pressure from both factions',
        emotional_arc: 'Hope → Pressure → Paralyzing complexity',
      }),
      learning_objectives: JSON.stringify([
        'Recognize how interventions create dependency cycles undermining resilience',
        'Balance intuition with reason when facing passionate appeals',
        'Develop capacity to pause quick judgments for deeper analysis',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Cascading consequences requiring more interventions (temporal addiction)',
        'Preventing suffering also prevents growth (theme for series)',
        'Both factions demanding Francisco choose (false binary he must transcend)',
      ]),
    },
    {
      // Scene 3: The Butterfly's Wings
      pages: 'Page 100 - 102',
      description: 'Francisco uses Trionfi cards to perceive timeline ripples, witnessing how both philosophies create cascading disasters, and develops sophisticated understanding through structured decision-making tools that wisdom means understanding limits.',
      focus: 'Francisco applies scenario mapping and reflective dialogue to develop nuanced discernment beyond binary thinking, establishing temporal butterfly effect',
      chapterSceneFocus: 'Ch47S3: Francisco witnesses cascading consequences through timeline perception, applies structured decision tools to move beyond binary thinking, develops sophisticated understanding that manipulation always has unintended consequences requiring wisdom about limits',
      preliminarySceneFocus: 'Implementing structured thinking to surface hidden assumptions',
      preliminarySceneDescription: 'Neutral observation point reveals infinite causal chains from both philosophies, requiring Francisco to develop discernment beyond simple rules',
      narrativeFunction: 'Establishes core ethical framework: timeline manipulation always has unintended consequences (butterfly effect at cosmic scale) and wisdom means understanding limits',
      sensoryDetail: 'Trionfi cards revealing timeline ripples, Novella perceiving ribbon-like causal chains, visual mapping of seven cascading collapses from single extraction, overpopulation cascades from plague prevention',
      internalConflict: 'Francisco\'s desire for clear legal precedent versus reality of irreducible complexity, fear any power use leads to disaster versus need to find wise approach',
      characterGrowthElement: 'Francisco implements sophisticated decision-making tools: scenario mapping, pros-and-cons frameworks, reflective dialogue to elevate judgment beyond impulse',
      seriesConnectionResonance: 'Butterfly effect understanding becomes crucial for Francisco\'s choices throughout series, especially Book 9 climax',
      sceneCardProgression: 104,
      realWorldContext: 'Neutral ground between factions where timeline ripples can be perceived and analyzed',
      timelineSignificance: 'Observation point revealing causal chains across multiple realities',
      saveTheCatBeat: 'Midpoint - false defeat as Francisco realizes no perfect solution exists',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow contemplative - space for deep thinking and revelation',
        tension_level: 'Moderate - internal tension of grappling with complexity',
        emotional_arc: 'Confusion → Analysis → Emerging clarity',
      }),
      learning_objectives: JSON.stringify([
        'Apply scenario mapping to surface unintended consequences',
        'Recognize cognitive biases seeking simple solutions to complex problems',
        'Accept that some problems have no perfect solutions, only wiser approaches',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Structured decision frameworks Francisco develops (used throughout series)',
        'Understanding limits of human wisdom to control cosmic systems',
        'Accepting uncertainty and complexity rather than seeking false certainty',
      ]),
    },
    {
      // Scene 4: The Third Way
      pages: 'Page 103 - 105',
      description: 'Francisco articulates a third approach rejecting both preservation and intervention, withstanding faction pressure through sophisticated decision tools, and commits to minimal manipulation with deep respect for natural development.',
      focus: 'Francisco passes La Signora\'s test by choosing the third way—accepting complexity over false certainty and establishing ethical framework for series',
      chapterSceneFocus: 'Ch47S4: Francisco articulates third approach of minimal manipulation with respect for natural development, withstands faction pressure through sophisticated tools, passes test by accepting complexity over false certainty, establishes core philosophy that power requires wisdom about limits',
      preliminarySceneFocus: 'Demonstrating mature discernment through principled choice',
      preliminarySceneDescription: 'Francisco\'s choice of third way reveals sophistication lies in accepting limits and uncertainty rather than aligning with either faction\'s false certainty',
      narrativeFunction: 'Establishes Francisco\'s core ethical framework for temporal responsibility that will guide series: minimal intervention, respect for natural development, acceptance of complexity',
      sensoryDetail: 'Francisco facing both factions with calm resolve, implementing decision checklist visibly, La Signora\'s approving observation, return to Zanetti Train with new commitment',
      internalConflict: 'Pressure to choose sides versus trust in third way, fear of enabling disasters by refusing intervention versus recognition that control assumptions are flawed',
      characterGrowthElement: 'Francisco demonstrates mature discernment: detecting emotional manipulation, implementing structured decision process, trusting calibrated intuition, accepting that wisdom includes knowing what not to do',
      seriesConnectionResonance: 'Francisco\'s third way philosophy becomes his guiding principle through series conflicts and ultimate choice in Book 9',
      sceneCardProgression: 105,
      realWorldContext: 'Confrontation moment where Francisco must articulate and defend his ethical stance',
      timelineSignificance: 'Decision point creating divergence from both established faction paths',
      saveTheCatBeat: 'Fun and Games conclusion - establishing philosophical foundation for journey ahead',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium - balancing confrontation with resolution',
        tension_level: 'High then releasing - pressure peaks then resolves with choice',
        emotional_arc: 'Pressure → Clarity → Committed resolution',
      }),
      learning_objectives: JSON.stringify([
        'Implement decision checklists to maintain clarity under pressure',
        'Detect cognitive fallacies and emotional manipulation tactics',
        'Demonstrate that true sophistication means accepting complexity without false certainty',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Third way philosophy will be tested repeatedly throughout series',
        'La Signora\'s test reveals she\'s been guiding Francisco toward this wisdom',
        'Frameworks balancing intervention and restraint (crucial for later books)',
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
        chapterId: ch47.id,
        chapterUniqueIdentifier: 'EA-047',
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
    .where(eq(scenes.chapterId, ch47.id));

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

  console.log('\n✅ EA-047 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
