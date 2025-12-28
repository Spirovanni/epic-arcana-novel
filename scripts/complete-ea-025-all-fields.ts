import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Completing ALL EA-025 scene fields...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-025'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-025 not found');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-025: ${chapter.title}\n`);

  const ea025Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Adding all fields to ${ea025Scenes.length} scenes...\n`);

  // Complete data for all three scenes
  const sceneData = [
    {
      // Scene 1: The Council's Recognition
      pages: 'Page 361 - 365',
      description:
        'At dawn, Francisco and Zara are summoned to the Council of Masters\' private sanctum for recognition of their harmonic leadership achievements. Master Cornelius reveals they are only the eighth and ninth students in three centuries to qualify for the Phoenix Protocol—the Academy\'s most sacred initiation transforming students into cosmic agents. Francisco and Zara feel both honored and apprehensive about this profound life transition.',
      focus: 'Francisco and Zara receive formal recognition as candidates for the Phoenix Protocol transformation',
      chapterSceneFocus: 'Ch25S1: Understanding that true advancement requires dying to old identities to be reborn into greater service',
      preliminarySceneFocus: 'Dawn recognition reveals Francisco and Zara\'s readiness for sacred transformation from students to cosmic agents',
      preliminarySceneDescription:
        'At dawn in the Council sanctum, Master Cornelius reveals that Francisco and Zara have earned the rare honor of the Phoenix Protocol—only seven students in three centuries have received this recognition. The Protocol represents the Academy\'s most sacred initiation for those ready to transcend studenthood and serve as cosmic agents. Francisco and Zara experience the profound weight of this recognition, understanding that accepting means surrendering their current identities for transformation into something greater.',
      narrativeFunction:
        'Establishes the Phoenix Protocol as the mechanism for Francisco and Zara\'s transition from students to cosmic agents. This scene frames transformation not as gradual evolution but as death-rebirth requiring conscious surrender of familiar identity.',
      sensoryDetail:
        'Dawn light breaking through sanctum\'s ancient stained glass, creating patterns of colored light on ceremonial floor. The weight of centuries in the room\'s atmosphere. Master Cornelius\'s solemn voice carrying reverence. The visual beauty of the phoenix symbol carved in marble at the chamber\'s center. Temperature cool and still, creating sense of sacred pause.',
      internalConflict:
        'Francisco struggles between pride at recognition and fear of losing his carefully constructed scholar identity. He must decide whether to cling to the safety of being a student or surrender to uncertain transformation, trusting the process despite not knowing who he\'ll become.',
      characterGrowthElement:
        'Francisco confronts the ultimate growth challenge: willingness to die to his current self. He learns that the greatest transformations require releasing attachment to familiar identities, even successful ones, to make space for cosmic purpose.',
      seriesConnectionResonance:
        'The Phoenix Protocol establishes the death-rebirth pattern that Francisco and Zara will face repeatedly throughout the series. Each major advancement requires releasing old identities, making this their foundational training in transformation.',
      sceneCardProgression: 30,
      realWorldContext:
        'The Phoenix Protocol mirrors real initiation ceremonies across cultures—vision quests, ordination rites, doctoral defenses, military commissions—where individuals formally transition from one identity to another. Draws from psychological research on identity transformation showing that lasting change requires conscious release of old self-concepts. References Campbell\'s "death and rebirth" as essential heroic journey element.',
      timelineSignificance:
        'Being recognized for the Phoenix Protocol establishes Francisco and Zara as extraordinary even among cosmic practitioners. This recognition opens doors to cosmic councils and responsibilities reserved for proven transformational leaders.',
      saveTheCatBeat: 'The Reward - Recognition and the Threshold of Transformation',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited anchored in Francisco\'s consciousness. Show his mixed emotions: pride at recognition, fear of losing familiar identity, curiosity about who he\'ll become. Render the physical sensations of dawn sanctum—cool air, colored light patterns, the presence of Masters\' accumulated wisdom. Portray his intellectual understanding that transformation requires death warring with his emotional attachment to his scholar self. When Master Cornelius names the Phoenix Protocol, show Francisco\'s recognition that his life is about to fundamentally change.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s pride and surprise at being summoned to sanctum. Build through growing awareness of the honor\'s magnitude as Council explains Phoenix Protocol\'s rarity. Peak at the moment of choice: accept transformation or remain a student. Resolve in courageous acceptance despite fear, trusting the process.',
        sudowrite_sensory_emphasis:
          'Emphasize dawn light quality creating sacred atmosphere. Colored glass patterns on floor. Ancient sanctum smell—old stone, ceremonial incense. Sound of Master Cornelius\'s reverent voice. The carved phoenix symbol catching morning light. Temperature shift from cool exterior to warm sanctum interior.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s teaching on "letting go" manifests as Francisco and Zara must release attachment to student identity. Goleman\'s work on emotional courage shows in their willingness to face transformation\'s uncertainty. Sinek\'s "Infinite Game" mindset appears in recognizing that growth requires continuous identity evolution rather than clinging to achievement.',
        terminal_objectives: [
          'Recognize when current identity, however successful, limits greater service and purpose',
          'Demonstrate courage to accept profound transformation despite fear and uncertainty',
          'Honor recognition while maintaining humility about the work transformation requires',
        ],
      },
      foreshadowing_elements: [
        'The Phoenix Protocol\'s death-rebirth structure previews the pattern of all major series transformations',
        'Only seven previous initiates hints at both the rarity and dangers of cosmic agent transformation',
        'Master Cornelius\'s solemnity foreshadows the genuine difficulty of identity death',
        'References to "cosmic agents" preview Francisco and Zara\'s expanding role beyond Academy',
        'The phoenix symbol\'s centrality hints at recurring rebirth cycles throughout their cosmic service',
        'Dawn timing emphasizes this as beginning of new life chapter, with many more dawns ahead',
      ],
    },
    {
      // Scene 2: The Death of Students
      pages: 'Page 366 - 370',
      description:
        'Morning light filters through the Phoenix Chamber\'s crystalline walls as Francisco and Zara descend into the Academy\'s most sacred space. Master Cordelia, their Phoenix Guide, explains that rebirth requires genuine identity death—releasing attachment to being students, needing approval, and relying on external validation. Francisco struggles to release his scholar identity and safety of guidance. Zara faces releasing her Academy protector role for greater cosmic duties. Through meditation and ritual, they consciously let their old selves die as the phoenix symbol glows brighter.',
      focus: 'Francisco and Zara release their student identities through sacred ritual of conscious death',
      chapterSceneFocus: 'Ch25S2: Learning that transformation requires genuinely releasing old identities, not just adding new capabilities',
      preliminarySceneFocus: 'Morning ritual of identity death as Francisco and Zara surrender student selves in Phoenix Chamber',
      preliminarySceneDescription:
        'In the crystalline Phoenix Chamber, Master Cordelia guides Francisco and Zara through the death phase of transformation. She explains that true rebirth requires genuine identity death—not of body but of the student identities limiting their cosmic purpose. Francisco must release his attachment to scholar identity and need for teacher validation. Zara must surrender her Academy protector role to embrace cosmic-scale guardianship. Through meditation, ritual, and symbolic release, they experience the profound grief and liberation of conscious identity death as the phoenix symbol glows with increasing intensity.',
      narrativeFunction:
        'Demonstrates the actual process of identity death, showing that transformation isn\'t metaphorical but requires genuine psychological and spiritual release. This scene proves Francisco and Zara\'s commitment by making them experience real loss before gain.',
      sensoryDetail:
        'Morning light refracted through crystalline walls creating rainbow patterns throughout chamber. The phoenix symbol\'s pulsing glow increasing as ritual progresses. Sound of Master Cordelia\'s gentle guidance voice. Tears on faces as grief for ending identities flows. Temperature warming as transformation energy builds. The quality of silence deepening during meditation.',
      internalConflict:
        'Zara must reconcile her protective instincts with the need to release her Academy protector identity. She fears that letting go of this role means abandoning those she\'s committed to guard, struggling to trust that cosmic guardianship encompasses rather than abandons local protection.',
      characterGrowthElement:
        'Zara learns that true protection sometimes means releasing protective roles that have become identity attachments. She discovers that the deepest service requires dying to limited versions of herself to be reborn with capacity for greater guardianship.',
      seriesConnectionResonance:
        'This conscious identity death becomes Zara\'s template for future transformations. Throughout the series, she will repeatedly face the need to release protective identities that become too narrow for her expanding cosmic responsibilities.',
      sceneCardProgression: 31,
      realWorldContext:
        'Identity death mirrors real psychological processes studied in transformative learning theory—moments when existing self-concepts must be released for new capacities to emerge. Draws from meditation traditions teaching "death before dying" as path to liberation. References liminal space research showing that transition requires genuine release of old identity before new one emerges.',
      timelineSignificance:
        'Successfully completing identity death proves Francisco and Zara capable of the profound transformations required for cosmic leadership. This willingness to die to self becomes their signature trait, enabling transformations other cosmic agents avoid.',
      saveTheCatBeat: 'The Ordeal - The Death of Old Identity',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited from Zara\'s perspective. Show her dual experience: the grief of releasing her Academy protector identity and the liberation of surrendering limiting self-concepts. Render the physical sensations of identity death—the loosening of familiar patterns, the disorientation of self-concept dissolution, the surprising relief beneath the grief. Portray her witnessing Francisco\'s parallel struggle while facing her own. When the phoenix symbol glows brighter, show her recognition that genuine death is occurring.',
        sudowrite_emotional_arc:
          'Open with Zara\'s courage warring with reluctance as ritual begins. Build through increasing grief as she feels her protector identity loosening. Peak at the moment of complete surrender when she releases attachment to her role. Resolve in unexpected peace as death completes and she rests in the void between identities.',
        sudowrite_sensory_emphasis:
          'Morning light quality shifting as it passes through crystals. Rainbow patterns moving across walls and floor. The warmth building in the chamber. Sound of breathing deepening during meditation. Tears flowing freely. The phoenix symbol\'s glow intensifying from soft to brilliant. Energy quality shifting from stable to transformative.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s practice of "letting go of views" manifests literally as Francisco and Zara release their self-views as students. Goleman\'s emotional regulation enables them to process grief without resistance. Sinek\'s infinite mindset shows in recognizing that identity is fluid, meant to evolve continuously rather than remain fixed.',
        terminal_objectives: [
          'Release attachment to successful identities when they limit greater purpose',
          'Process grief of endings without resistance, allowing genuine transformation',
          'Trust the void between identities, resting in not-knowing before rebirth',
        ],
      },
      foreshadowing_elements: [
        'The grief-liberation pattern establishes emotional template for future transformations',
        'Master Cordelia\'s gentle guidance previews mentor relationships supporting future deaths and rebirths',
        'The phoenix symbol\'s responsive glow hints at cosmic forces watching and validating transformation',
        'References to "cosmic-scale" duties foreshadow the magnitude of responsibilities ahead',
        'The crystalline chamber becoming significant location for future initiations',
        'Zara\'s struggle with releasing protection role previews ongoing tension between local and cosmic duties',
      ],
    },
    {
      // Scene 3: The Birth of Cosmic Agents
      pages: 'Page 371 - 375',
      description:
        'Afternoon brings the Phoenix Protocol\'s culmination as Francisco and Zara experience miraculous rebirth into cosmic agent roles. The Phoenix Chamber fills with cosmic fire burning away final limitations while igniting new capabilities. Francisco\'s scholarly nature evolves into cosmic wisdom—perceiving deeper universal patterns. Zara\'s protective instincts expand into cosmic guardianship—sensing threats to universal balance. Master Cordelia formally recognizes them as Cosmic Agents. They emerge transformed with new depths of wisdom and power as Academy bells celebrate the newest cosmic agents.',
      focus: 'Francisco and Zara complete transformation, emerging as Cosmic Agents with enhanced capabilities',
      chapterSceneFocus: 'Ch25S3: Demonstrating that death to old identity creates space for rebirth into greater purpose and capability',
      preliminarySceneFocus: 'Afternoon rebirth completes transformation as Francisco and Zara emerge as Cosmic Agents with new capabilities',
      preliminarySceneDescription:
        'As afternoon light fills the Phoenix Chamber, Francisco and Zara experience the miraculous rebirth completing the Phoenix Protocol. Cosmic fire fills the chamber, burning away final vestiges of limitation while igniting profound new capabilities. Francisco discovers his scholarly nature has evolved into cosmic wisdom—the ability to perceive deeper patterns connecting all knowledge for universal harmony. Zara finds her protective instincts expanded into cosmic guardianship—sensing threats to universal balance and intervening in cosmic-scale conflicts. Master Cordelia formally recognizes them as Cosmic Agent Francisco and Cosmic Agent Zara. They emerge transformed as Academy bells ring celebration of the newest cosmic agents taking their first steps into expanded service.',
      narrativeFunction:
        'Completes the transformation arc by showing successful rebirth with enhanced capabilities, proving that identity death enables rather than destroys. This scene demonstrates that surrendering limits unleashes dormant cosmic potential.',
      sensoryDetail:
        'Afternoon sunlight streaming through crystalline walls with new vibrancy. Cosmic fire manifesting as visible waves of energy throughout chamber. The phoenix symbol blazing brilliantly before settling into steady glow. Temperature intense but not burning—purifying heat. Sound of Academy bells ringing in celebration. New light in Francisco and Zara\'s eyes reflecting cosmic awareness.',
      internalConflict:
        'Francisco must integrate his expanded cosmic wisdom without losing humility, recognizing that greater capability means greater responsibility rather than superiority. He struggles to accept his new power while maintaining servant orientation.',
      characterGrowthElement:
        'Francisco learns that rebirth into greater capability requires maintaining humility and service orientation. He integrates cosmic wisdom with conscious purpose, ensuring power serves universal harmony rather than personal aggrandizement.',
      seriesConnectionResonance:
        'This successful rebirth establishes the pattern: death to limited identity enables emergence of cosmic capabilities. Throughout the series, Francisco and Zara will repeatedly experience death-rebirth cycles, each unlocking new levels of cosmic service.',
      sceneCardProgression: 32,
      realWorldContext:
        'Rebirth with enhanced capabilities mirrors real transformative experiences—graduating from apprentice to master, earning credentials that unlock new responsibilities, spiritual awakenings that expand consciousness. Draws from research on peak experiences and flow states where individuals access previously dormant capabilities. References transpersonal psychology\'s work on self-transcendence enabling higher functioning.',
      timelineSignificance:
        'Becoming Cosmic Agents fundamentally changes Francisco and Zara\'s cosmic status and responsibilities. They can now participate in cosmic councils, access restricted knowledge, and intervene in universal conflicts previously beyond their authority.',
      saveTheCatBeat: 'The Resurrection - Rebirth as Cosmic Agents',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited back to Francisco\'s consciousness. Show his experience of rebirth: cosmic fire burning away limitations he didn\'t know constrained him, new perceptions flooding awareness, the profound expansion of his scholarly nature into cosmic wisdom. Render the physical sensations: energy coursing through his being, vision expanding to perceive deeper patterns, awareness stretching to encompass universal harmonies. Portray the moment Master Cordelia names him Cosmic Agent—the weight and joy of the new identity settling into place.',
        sudowrite_emotional_arc:
          'Begin with Francisco in the void after death, not-knowing who he\'ll become. Build through cosmic fire\'s arrival and the surge of transformation energy. Peak at the moment of rebirth when new capabilities ignite and he recognizes his cosmic agent identity. Resolve in profound gratitude mixed with eager readiness for expanded service.',
        sudowrite_sensory_emphasis:
          'Afternoon light quality seeming more vibrant post-rebirth. Cosmic fire\'s visual manifestation—waves of energy in multiple colors. The phoenix symbol\'s triumphant blaze. Temperature intense but purifying. Sound of bells celebrating throughout Academy. The quality of air changed, charged with transformation energy. New depth in Francisco and Zara\'s eyes visible to each other.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s "interbeing" expands as Francisco perceives cosmic interconnections his previous identity couldn\'t grasp. Goleman\'s work on multiple intelligences manifests as Francisco and Zara integrate new forms of cosmic awareness. Sinek\'s "Start with Why" grounds their expanded power in conscious purpose—serving universal harmony.',
        terminal_objectives: [
          'Integrate enhanced capabilities with humility and service orientation',
          'Recognize that greater power requires greater responsibility and ethical clarity',
          'Accept new identity while honoring the death that made space for rebirth',
        ],
      },
      foreshadowing_elements: [
        'Cosmic Agent status opens access to cosmic councils and conflicts in future books',
        'Francisco\'s cosmic wisdom ability becomes central to solving universal-scale problems',
        'Zara\'s cosmic guardianship sensing enables prevention of timeline catastrophes',
        'Master Cordelia\'s formal recognition previews Francisco and Zara eventually guiding others through Phoenix Protocol',
        'Academy bells\' celebration hints at their growing legendary status in cosmic communities',
        'The afternoon completion suggests full maturity of this transformation phase, with new cycles ahead',
      ],
    },
  ];

  // Update each scene
  for (let i = 0; i < ea025Scenes.length; i++) {
    const scene = ea025Scenes[i];
    const data = sceneData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        pages: data.pages,
        description: data.description,
        focus: data.focus,
        chapterSceneFocus: data.chapterSceneFocus,
        preliminarySceneFocus: data.preliminarySceneFocus,
        preliminarySceneDescription: data.preliminarySceneDescription,
        narrativeFunction: data.narrativeFunction,
        sensoryDetail: data.sensoryDetail,
        internalConflict: data.internalConflict,
        characterGrowthElement: data.characterGrowthElement,
        seriesConnectionResonance: data.seriesConnectionResonance,
        sceneCardProgression: data.sceneCardProgression,
        realWorldContext: data.realWorldContext,
        timelineSignificance: data.timelineSignificance,
        saveTheCatBeat: data.saveTheCatBeat,
        sudowrite_metadata: data.sudowrite_metadata,
        learning_objectives: data.learning_objectives,
        foreshadowing_elements: data.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   📄 Pages: ${data.pages}`);
    console.log(`   🎯 Focus: ${data.focus.substring(0, 50)}...`);
    console.log(`   🎬 Save The Cat Beat: ${data.saveTheCatBeat}`);
    console.log(`   ✓ All 16 fields updated`);
    console.log('');
  }

  console.log('🎉 EA-025 all fields complete and uploaded to Neon DB!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
