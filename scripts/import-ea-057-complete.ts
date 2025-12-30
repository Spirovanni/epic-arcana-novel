import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-057: Optimism (Book 2, Chapter 17)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-057'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-057 not found. Run create-ea-057-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Banquet of Knives',
      setup: 'Francisco arrives at the Palazzo Ducale. He is stripped of weapons (and magic dampeners are active). The court jeers at him—the \'Beggar King\' of the Sanctuary. Doge Venier toasts to his \'imminent failure\'. Francisco smiles. He uses \'Learned Optimism\' to reframe the insults as fears. \'They shout because they are afraid of what we represent.\' He doesn\'t defend himself; he compliments the wine. He compliments the architecture. He disarms them with aggressive civility. He spots the Doge\'s hidden weakness: a portrait of a lost son.',
      symbolism: 'The Two of Cups reversed—false friendship, treachery. The \'Banquet\' is a classic trap trope, subverted by the hero\'s refusal to be the victim. The \'Portrait\' is the key hole for empathy.',
      beat_goal: 'Survive the initial social assault. Identify the emotional lever needed to turn the table.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Cool under pressure',
      scene_tone: 'Lavish and hostile',
      timeline_date: '6/1/1320 - Morning',
      timeline_variant: 'Venice Prime (1450)',
      location: 'Banquet Hall of the Palazzo Ducale',
    },
    {
      scene_number: 2,
      scene_title: 'The Crucial Conversation',
      setup: 'Francisco maneuvers a private audience on the balcony. The Doge drops the pretense: \'Submit or be erased.\' Francisco ignores the threat and asks about the son (the portrait). The Doge freezes. It\'s a risk. Francisco speaks of legacy—of building something that lasts beyond the loop. He connects his Sanctuary (from the previous chapter) to the Doge\'s desire for permanence. He offers not submission, but a \'Union\' (Two of Cups). \'Venice rules the waves; we rule the winds of time. Together, we are the storm.\'',
      symbolism: 'The Two of Cups upright—offering the cup. The balcony represents the \'Bridge\'. The switch from \'War\' language to \'Legacy\' language is the \'Turn\'.',
      beat_goal: 'Shift the conflict from power (who is stronger) to value (what can we build together). Create the emotional connection.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Sincere vulnerability',
      scene_tone: 'Intimate and high-stakes',
      timeline_date: '6/1/1320 - Afternoon',
      timeline_variant: 'Venice Prime (1450)',
      location: 'The Doge\'s Balcony',
    },
    {
      scene_number: 3,
      scene_title: 'The Attack',
      setup: 'The faction opposed to the alliance (The Council of Ten) attacks. They realize the Doge is wavering and try to assassinate both of them. Suddenly, Francisco and the Doge are fighting back-to-back. Francisco uses his time-slowing (limited in the dampening field) to save the Doge. The Doge uses his knowledge of the palace traps to save Francisco. The physical battle cements the emotional bond formed in the previous scene. They are no longer negotiator and hostage; they are partners.',
      symbolism: 'The forging of the alliance in fire. The \'Two\' fighting as one. Trust built through action.',
      beat_goal: 'Cement the alliance. Prove Francisco\'s worthiness as a partner, not just a talker.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Adrenaline and synchronicity',
      scene_tone: 'Action-packed',
      timeline_date: '6/1/1320 - Evening',
      timeline_variant: 'Venice Prime (1450)',
      location: 'Palace Corridors / Bridge of Sighs',
    },
    {
      scene_number: 4,
      scene_title: 'The Wedding of Interests',
      setup: 'The dust settles. The assassins are captured. The Doge publicly embraces Francisco as \'Brother of the Republic\'. The alliance is signed. Venice will supply the Sanctuary; Francisco will protect Venice\'s timeline from Dagon. As Francisco leaves, he looks back. He didn\'t conquer Venice; he befriended it. He realizes that \'Optimism\' isn\'t blindness—it\'s the strategic choice to see potential friends in enemies.',
      symbolism: 'The Two of Cups realized—the pledge. The \'Wedding\' imagery (political, not romantic). The fleet of Venice turning their prows to support the Sanctuary.',
      beat_goal: 'Resolution. Verify the gain (resources + fleet). Validate the theme (Diplomacy > War).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Satisfaction and fatigue',
      scene_tone: 'Grand and triumphant',
      timeline_date: '6/2/1320 - Dawn',
      timeline_variant: 'Venice Prime',
      location: 'The Grand Canal Docks',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 241 - 245',
      description: 'Francisco arrives at Palazzo Ducale stripped of weapons and magic, facing jeering Venetian court that toasts his imminent failure—he uses Learned Optimism to reframe insults as fears, disarming hostility with aggressive civility while spotting the Doge\'s weakness: a portrait of his lost son.',
      focus: 'Surviving social assault and identifying emotional leverage for diplomatic turn.',
      chapterSceneFocus: 'Ch57S1: Francisco faces hostile Venetian court stripped of weapons and magic, using Learned Optimism to reframe jeers as fears and disarming through aggressive civility while identifying the Doge\'s emotional weakness—a portrait of his lost son.',
      preliminarySceneFocus: 'Diplomatic aikido at hostile banquet',
      preliminarySceneDescription: 'Francisco survives social assault at Palazzo Ducale through optimism',
      narrativeFunction: 'Establishes diplomatic crisis, demonstrates Francisco\'s non-violent conflict skills, identifies emotional leverage point.',
      sensoryDetail: 'Palazzo Ducale grandeur, magic dampeners active, court jeers, Doge\'s toast, wine and architecture compliments, portrait of lost son.',
      internalConflict: 'Francisco maintaining optimistic reframing under sustained social attack and humiliation.',
      characterGrowthElement: 'Francisco masters diplomatic aikido—using opponent\'s aggression to create connection rather than escalation.',
      seriesConnectionResonance: 'Establishes Francisco as statesman not just warrior; Venetian alliance crucial for Book 3 naval battles.',
      sceneCardProgression: 142,
      realWorldContext: 'Diplomatic hostility, social warfare, reframing attacks as defensive fears.',
      timelineSignificance: 'First major diplomatic summit for Sanctuary, establishing legitimacy beyond military strength.',
      saveTheCatBeat: truncate('Fun and Games - navigating diplomatic hostility with optimism', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'tense_civility',
        narrative_mode: 'diplomatic_warfare',
      }),
      learning_objectives: JSON.stringify([
        'Learned Optimism as diplomatic tool',
        'Reframing hostility as masked fear',
        'Identifying emotional leverage in adversaries',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Lost son as key to Doge\'s heart',
        'Legacy desire driving alliance possibility',
        'Council of Ten opposition to alliance',
      ]),
    },
    {
      pages: 'Page 245 - 249',
      description: 'In private balcony audience, Doge demands submission—Francisco risks asking about lost son, shifting conversation from power to legacy, offering Union where Venice rules waves and Sanctuary rules temporal winds, creating emotional connection through shared vision of permanence.',
      focus: 'Shifting conflict from power to value and creating emotional connection.',
      chapterSceneFocus: 'Ch57S2: Francisco maneuvers private audience where Doge demands submission, but Francisco risks asking about lost son, shifting from power talk to legacy vision and offering Union of Venice\'s waves and Sanctuary\'s temporal winds—partnership not conquest.',
      preliminarySceneFocus: 'Legacy conversation creates connection',
      preliminarySceneDescription: 'Private balcony talk shifts from power to shared vision',
      narrativeFunction: 'Pivots negotiation from coercion to partnership; demonstrates vulnerability as diplomatic strength.',
      sensoryDetail: 'Balcony privacy, Doge\'s \'submit or be erased\' threat, Francisco\'s risk asking about son, legacy talk, Union offering, bridge imagery.',
      internalConflict: 'Francisco\'s vulnerability gamble—risking total failure by touching Doge\'s deepest wound.',
      characterGrowthElement: 'Francisco demonstrates that sincere vulnerability creates stronger bonds than displays of strength.',
      seriesConnectionResonance: 'Two of Cups alliance pattern establishes diplomatic framework for later books; Venice as permanent ally.',
      sceneCardProgression: 143,
      realWorldContext: 'High-stakes negotiation pivot, finding shared values beyond power dynamics.',
      timelineSignificance: 'First major alliance formed through emotional connection rather than strategic necessity.',
      saveTheCatBeat: truncate('Fun and Games - discovering diplomacy through vulnerability', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'intimate_tension',
        narrative_mode: 'vulnerable_diplomacy',
      }),
      learning_objectives: JSON.stringify([
        'Shifting negotiation from power to value',
        'Vulnerability as diplomatic strength',
        'Finding shared vision in adversaries',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Council of Ten opposition escalating',
        'Alliance forming despite internal resistance',
        'Back-to-back fighting cementing bond',
      ]),
    },
    {
      pages: 'Page 249 - 252',
      description: 'Council of Ten attacks to prevent wavering alliance—Francisco and Doge fight back-to-back using time-slowing and palace traps to save each other, physical battle cementing emotional bond and transforming negotiator/hostage into partners through action-based trust.',
      focus: 'Cementing alliance through shared combat and proving partnership worthiness.',
      chapterSceneFocus: 'Ch57S3: Council of Ten attacks to prevent alliance, forcing Francisco and Doge to fight back-to-back—Francisco\'s time-slowing saves Doge while palace trap knowledge saves Francisco, cementing emotional bond through action-based trust.',
      preliminarySceneFocus: 'Alliance forged in combat fire',
      preliminarySceneDescription: 'Assassination attempt transforms negotiators into partners',
      narrativeFunction: 'Proves alliance through action not words; demonstrates Francisco as worthy partner; establishes trust through shared danger.',
      sensoryDetail: 'Council of Ten attack, back-to-back fighting, time-slowing in dampening field, palace trap mechanisms, synchronicity in combat.',
      internalConflict: 'Francisco balancing limited powers in dampening field while protecting both himself and Doge.',
      characterGrowthElement: 'Francisco demonstrates he\'s not just talker but worthy combat partner—validating diplomatic claims with action.',
      seriesConnectionResonance: 'Establishes combat partnership pattern; Council of Ten as recurring antagonists in Venetian politics.',
      sceneCardProgression: 144,
      realWorldContext: 'Alliance forged in fire, trust built through shared danger, action validating words.',
      timelineSignificance: 'Physical defense of alliance marks transition from theoretical to practical partnership.',
      saveTheCatBeat: truncate('Fun and Games - proving partnership through shared combat', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'action_climax',
        narrative_mode: 'synchronous_combat',
      }),
      learning_objectives: JSON.stringify([
        'Trust built through action not words',
        'Alliance validated in shared danger',
        'Partnership proven through mutual protection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Public alliance ceremony',
        'Venetian fleet support',
        'Francisco as recognized statesman',
      ]),
    },
    {
      pages: 'Page 252 - 255',
      description: 'After defeating assassins, Doge publicly embraces Francisco as Brother of Republic—alliance signed giving Sanctuary Venetian resources and fleet in exchange for timeline protection, as Francisco realizes optimism is the strategic choice to see potential friends in enemies, achieving diplomacy over conquest.',
      focus: 'Resolving alliance and validating diplomatic triumph over warfare.',
      chapterSceneFocus: 'Ch57S4: Doge publicly embraces Francisco as Brother of Republic, signing alliance that gives Sanctuary Venetian fleet and resources in exchange for timeline protection—Francisco realizes optimism means strategically choosing to see potential friends in enemies.',
      preliminarySceneFocus: 'Alliance formalized, diplomacy triumphs',
      preliminarySceneDescription: 'Public ceremony cements Venetian partnership',
      narrativeFunction: 'Resolves diplomatic arc; validates theme of diplomacy over war; secures critical resources and naval support.',
      sensoryDetail: 'Captured assassins, public embrace as Brother of Republic, alliance signing, Venetian fleet turning prows to Sanctuary, Grand Canal docks at dawn.',
      internalConflict: 'Francisco\'s satisfaction tempered by fatigue of constant diplomatic vigilance and strategic calculations.',
      characterGrowthElement: 'Francisco completes evolution to legitimate statesman who befriends rather than conquers.',
      seriesConnectionResonance: 'Venetian fleet provides naval power for Book 3; Francisco\'s diplomatic reputation crucial for future alliances.',
      sceneCardProgression: 145,
      realWorldContext: 'Political alliance ceremonies, securing resources through partnership, befriending over conquering.',
      timelineSignificance: 'Sanctuary transitions from isolated colony to diplomatic power with major ally and fleet support.',
      saveTheCatBeat: truncate('Fun and Games - mastering diplomatic game to secure alliance', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'triumphant_resolution',
        narrative_mode: 'ceremonial_closure',
      }),
      learning_objectives: JSON.stringify([
        'Optimism as strategic choice not blindness',
        'Diplomacy achieving what conquest cannot',
        'Partnership creating mutual benefit over domination',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Venetian fleet role in future conflicts',
        'Francisco\'s growing diplomatic network',
        'Resource security enabling expansion',
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
        chapterUniqueIdentifier: 'EA-057',
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

  console.log(`\n✅ EA-057 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
