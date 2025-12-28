import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Adding remaining fields to EA-023 scenes...\n');

  // Get EA-023 Chapter
  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-023 not found');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-023: ${chapter.title}\n`);

  // Get scenes
  const ea023Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Adding fields to ${ea023Scenes.length} scenes...\n`);

  // Data for each scene in the format of EA-001 to EA-022
  const sceneData = [
    {
      // Scene 1: The Divine Revelation
      sceneCardProgression: 23, // Chapter 23, Scene 1
      realWorldContext:
        'Divine revelation scene drawing from sacred grove traditions across cultures, particularly Eastern meditation gardens and Western mystery school initiation sites. The reflecting pool mirrors Jungian concepts of the Self reflected through divine encounter. La Signora\'s transformation echoes goddess theophany narratives from mythology and mystical literature.',
      timelineSignificance:
        'Marks Francisco and Zara\'s transition from tactical practitioners to spiritual initiates. La Signora\'s revelation as divine mentor establishes the cosmic stakes and shifts their understanding from localized challenges to universal responsibility.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited anchored in Francisco\'s consciousness. Show his intellectual framework shattering as he witnesses divine manifestation—render the moment his rationalist worldview expands to accommodate cosmic spirituality. Portray the physical sensations: air charged with divine energy, light bending impossibly, his heartbeat synchronizing with cosmic rhythms. When La Signora speaks, show how her words resonate not just aurally but vibrationally through his entire being. Capture the paradox of overwhelming awe mixed with profound recognition, as if remembering something his soul always knew.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s confident scholar-strategist identity. Escalate through shock and disorientation as reality expands beyond his categories. Peak at the moment of surrender—letting go of intellectual control to embrace experiential wisdom. Resolve in quiet transformation as he accepts his cosmic role with humility and purpose.',
        sudowrite_sensory_emphasis:
          'Emphasize visual transformation of the grove—trees shimmering with consciousness, pool reflecting infinite dimensions. Sound of divine voice carrying multiple harmonics. The scent of sacred incense mixed with ozone of cosmic energy. Temperature shifts as divine presence manifests.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s "The Miracle of Mindfulness" establishes that true power comes from present-moment awareness—Francisco learns that cosmic abilities require grounding in conscious attention. Goleman\'s "Emotional Intelligence" applies through Francisco recognizing that emotional mastery isn\'t suppression but conscious integration of feeling with action. Sinek\'s "Start with Why" manifests as Francisco discovering his deepest purpose: not accumulating power but directing it consciously toward universal balance.',
        terminal_objectives: [
          'Recognize that spiritual wisdom complements rather than contradicts intellectual understanding',
          'Integrate present-moment awareness as foundation for all cosmic action',
          'Identify personal cosmic purpose beyond tactical objectives',
        ],
      },
      foreshadowing_elements: [
        'La Signora\'s divine identity foreshadows her role as Francisco\'s spiritual guide throughout the series',
        'The emphasis on mindful direction sets up future challenges requiring conscious will over raw power',
        'The Sacred Grove as thin place between realms hints at future cross-dimensional conflicts',
        'The concept of "Master of Two Worlds" previews Francisco\'s ultimate journey arc',
        'References to emotional mastery as essential for cosmic leadership foreshadow tests requiring this skill',
        'The pool reflecting infinite realities suggests future timeline manipulation challenges',
      ],
    },
    {
      // Scene 2: The Temple of Present Moment
      sceneCardProgression: 24, // Chapter 23, Scene 2
      realWorldContext:
        'Temple design inspired by Zen meditation halls and crystalline sacred architecture. Time-stopping effect mirrors advanced meditation states described in contemplative traditions. The training mirrors real mindfulness-based stress reduction techniques adapted for cosmic-scale applications.',
      timelineSignificance:
        'Establishes mindfulness and emotional regulation as core competencies for cosmic leadership. This training becomes the foundation for all future high-stakes decision-making and conflict resolution throughout the series.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited from Zara\'s perspective. Show her warrior instincts conflicting with stillness requirements—the way her muscles want to move, how her mind races ahead to threats. Render her gradual shift: heartbeat slowing, breath deepening, awareness expanding from combat-focus to panoramic presence. When time stops in the temple, show the profound strangeness—not absence of motion but eternal now, where past and future collapse into pure present. Portray her realization that this stillness contains more power than her fastest reaction time.',
        sudowrite_emotional_arc:
          'Open with Zara\'s skepticism about meditation as viable training. Build tension through her frustration with "doing nothing" when instincts scream to act. Peak at breakthrough moment when she experiences protective power emerging from stillness rather than reaction. Resolve in quiet confidence as she integrates this new understanding.',
        sudowrite_sensory_emphasis:
          'Crystalline walls creating prisms of light. Profound silence that feels alive. The sensation of time\'s flow slowing, stopping. Temperature perfectly neutral, eliminating all physical distraction. The quality of awareness shifting from narrow focus to spacious presence.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s practices demonstrate that brief moments of conscious breathing anchor awareness in chaos—Zara learns to find stillness amid cosmic conflict. Goleman\'s self-regulation techniques show how emotional awareness prevents reactive decisions—crucial for guardian responsibilities. Sinek\'s purpose-driven approach manifests as Zara clarifying her "why": protecting not from fear but from conscious commitment to preserve cosmic balance.',
        terminal_objectives: [
          'Apply present-moment awareness during high-pressure situations',
          'Transform reactive protection into mindful guardianship',
          'Integrate emotional regulation with defensive capabilities',
        ],
      },
      foreshadowing_elements: [
        'The Temple of Present Moment will reappear as safe haven during future crises',
        'Time manipulation techniques hint at advanced temporal abilities to be developed',
        'Zara\'s integration of stillness and action foreshadows her evolution into perfect warrior-monk archetype',
        'References to "protection through awareness" preview future conflicts requiring this approach',
        'The emphasis on non-reactive response foreshadows diplomatic challenges ahead',
        'Mention of "maintaining center in universal chaos" previews scale of future threats',
      ],
    },
    {
      // Scene 3: The Integration of Magician Mastery
      sceneCardProgression: 25, // Chapter 23, Scene 3
      realWorldContext:
        'Integration test draws from ritual magic traditions where practitioners demonstrate mastery through synthesis. The synchronized working between Francisco and Zara mirrors tantric partnership practices. The afternoon timing reflects completion of initiatory cycle (dawn/morning/afternoon).',
      timelineSignificance:
        'Validates Francisco and Zara as legitimate cosmic operators embodying The Magician archetype. Their demonstrated integration of will, awareness, and purpose establishes them as qualified for greater cosmic responsibilities in subsequent chapters.',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited alternating between Francisco and Zara, showing their synchronized consciousness. Render the moment their minds align—not telepathy but deeper resonance of shared purpose and complementary skills. Show Francisco\'s intellectual understanding merging with intuitive knowing, Zara\'s protective instincts enhanced by strategic awareness. When they execute the test, portray the flow state where effort becomes effortless, individual identity expands to partnership, and cosmic forces respond to their unified intention.',
        sudowrite_emotional_arc:
          'Begin with individual determination to prove worthy. Build through moments of doubt when complexity exceeds individual capacity. Peak at breakthrough when partnership transcends limitation—two becoming more than sum of parts. Resolve in quiet triumph mixed with profound responsibility as they recognize the weight of their new power.',
        sudowrite_sensory_emphasis:
          'Golden afternoon light creating sacred atmosphere. Energy patterns becoming visible in air. The sensation of minds merging without losing individuality. Temperature rising slightly with channeled power. The smell of ozone mixed with incense. The profound silence before successful completion, then cascade of cosmic acknowledgment.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s teaching that mindfulness enhances rather than hinders action manifests in Francisco and Zara maintaining awareness while executing complex cosmic operations. Goleman\'s emphasis on social-emotional intelligence shows in their partnership synergy. Sinek\'s purpose clarity enables them to direct immense power without losing ethical compass—they know not just how to use power but why they should.',
        terminal_objectives: [
          'Demonstrate seamless integration of awareness, will, and purpose in cosmic action',
          'Apply partnership synergy to amplify individual capabilities',
          'Maintain ethical clarity while wielding significant cosmic power',
        ],
      },
      foreshadowing_elements: [
        'The Magician archetype mastery sets template for Francisco\'s ultimate role as Master of Two Worlds',
        'Partnership synchronization between Francisco and Zara previews deeper bond development',
        'References to "conscious will direction" foreshadow future conflicts requiring precision over power',
        'La Signora\'s satisfaction hints at her larger plan for Francisco and Zara\'s development',
        'The cosmic acknowledgment of their worthiness foreshadows acceptance by higher cosmic authorities',
        'Emphasis on integration over specialization previews Renaissance-person approach needed for series challenges',
      ],
    },
  ];

  // Update each scene
  for (let i = 0; i < ea023Scenes.length; i++) {
    const scene = ea023Scenes[i];
    const data = sceneData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        sceneCardProgression: data.sceneCardProgression,
        realWorldContext: data.realWorldContext,
        timelineSignificance: data.timelineSignificance,
        sudowrite_metadata: data.sudowrite_metadata,
        learning_objectives: data.learning_objectives,
        foreshadowing_elements: data.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✓ Scene Card Progression: ${data.sceneCardProgression}`);
    console.log(`   ✓ Real World Context added`);
    console.log(`   ✓ Timeline Significance added`);
    console.log(`   ✓ Sudowrite Metadata added`);
    console.log(`   ✓ Learning Objectives added`);
    console.log(`   ✓ Foreshadowing Elements added (${data.foreshadowing_elements.length} items)`);
    console.log('');
  }

  console.log('🔍 Final Verification:\n');

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  for (const scene of updatedScenes) {
    const allFieldsComplete =
      scene.sceneCardProgression !== null &&
      scene.realWorldContext !== null &&
      scene.timelineSignificance !== null &&
      scene.sudowrite_metadata !== null &&
      scene.learning_objectives !== null &&
      scene.foreshadowing_elements !== null;

    const status = allFieldsComplete ? '✅ COMPLETE' : '⚠️  MISSING FIELDS';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
  }

  console.log('\n🎉 EA-023 now has ALL fields matching EA-001 to EA-022 format!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
