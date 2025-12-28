import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';

async function main() {
  console.log('📝 Adding missing fields to EA-030 scenes...\n');

  const ea030Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterUniqueIdentifier, 'EA-030'))
    .orderBy(scenes.sceneNumber);

  const sceneData = [
    {
      // Scene 1: The Assessment of Damage
      core_emotion: 'Honest evaluation mixed with the discomfort of holding contradictory truths simultaneously',
      scene_tone: 'Serious but not punitive, with compassionate accountability that demands genuine self-examination balanced by recognition that growth often emerges from failure',
      timeline_date: '2/25/1320 - Dawn',
      timeline_variant: 'Prime Timeline',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the weight of responsibility without crushing shame, the struggle to accept accountability while maintaining self-worth. Show him learning to hold failure and innovation as simultaneous truths.',
        sudowrite_emotional_arc: 'Begins with defensive tension, moves through the discomfort of honest assessment, culminates in the relief of accountability without shame. The emotional journey is from fear of judgment to acceptance of paradoxical truth.',
        sudowrite_sensory_emphasis: 'Emphasize the shimmer of holographic projections showing destruction and creation, the hum of diagnostic systems, the warmth of La Signora\'s compassionate firmness, the physical sensation of holding opposing truths in tension.',
      },
      learning_objectives: {
        integration: 'Compassionate Accountability and Balanced Assessment',
        terminal_objectives: [
          'Hold paradoxical truths (catastrophic failure AND genuine innovation) in balanced tension without collapsing into guilt or denial',
          'Accept full responsibility for consequences while maintaining faith in growth and learning',
          'Develop emotional maturity to face assessment with accountability rather than defensiveness or shame',
        ],
      },
      foreshadowing_elements: [
        'The holographic reconstruction showing both destruction and innovation foreshadows the balanced choice they must make',
        'La Signora\'s compassionate accountability establishes the pattern for how cosmic service handles mistakes',
        'The paradoxical truths they must hold foreshadow the difficult choice in the Chamber of Balanced Choices',
      ],
    },
    {
      // Scene 2: The Chamber of Balanced Choices
      core_emotion: 'Careful deliberation mixed with the discomfort of choosing among imperfect options',
      scene_tone: 'Thoughtful and strategic, with the weight of consequential decision-making balanced by growing clarity about values and priorities',
      timeline_date: '2/25/1320 - Morning',
      timeline_variant: 'Prime Timeline',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the temptation of safety versus the call of sustainable wisdom, the fear of trusting those he harmed, the weight of choosing imperfection over control. Show him learning to embrace collaborative partnership.',
        sudowrite_emotional_arc: 'Begins with the overwhelm of imperfect choices, moves through the temptation of easy solutions, culminates in the courageous choice of difficult sustainable partnership. The emotional journey is from control-seeking to trust-embracing.',
        sudowrite_sensory_emphasis: 'Emphasize the crystalline visualization of future consequences, the glow and pulse of each restoration path, the weight of decision in the air, the physical sensation of choosing vulnerability over safety.',
      },
      learning_objectives: {
        integration: 'Balanced Decision-Making and Sustainable Choice',
        terminal_objectives: [
          'Choose sustainable partnership over immediate control when facing imperfect restoration options',
          'Accept that wisdom includes selecting difficult long-term solutions rather than easy short-term fixes',
          'Develop the courage to trust collaborative healing even when it requires vulnerability with those they harmed',
        ],
      },
      foreshadowing_elements: [
        'The choice of Collaborative Healing foreshadows the partnership approach they will implement in Scene 3',
        'The visible consequences of each path foreshadow the ongoing development of decision-making wisdom',
        'The vulnerability required for Option 3 foreshadows the trust and apology needed for restoration',
      ],
    },
    {
      // Scene 3: The Restoration Begins
      core_emotion: 'Collaborative accomplishment mixed with profound recognition that sustainable healing emerges from partnership rather than rescue',
      scene_tone: 'Purposeful and healing, with the difficulty of honest accountability balanced by the satisfaction of empowering others and the growing evidence that collaborative approaches create resilience impossible through imposed solutions',
      timeline_date: '2/25/1320 - Afternoon',
      timeline_variant: 'Prime Timeline',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the humility of genuine apology, the surrender of control in collaborative partnership, the joy of co-creation with those he harmed. Show him learning that shared responsibility is more powerful than individual mastery.',
        sudowrite_emotional_arc: 'Begins with the vulnerability of returning to face those they harmed, moves through the relief of genuine partnership, culminates in the deep satisfaction of collaborative restoration. The emotional journey is from apprehension to authentic connection.',
        sudowrite_sensory_emphasis: 'Emphasize the shimmer of gradually stabilizing dimensions, the weaving patterns of collaborative repair, the vibration of merged wisdom traditions, the organic growth of sustainable restoration like roots spreading.',
      },
      learning_objectives: {
        integration: 'Collaborative Restoration and Shared Responsibility',
        terminal_objectives: [
          'Offer genuine apology without defensiveness, accepting impact over intention in taking responsibility for harm',
          'Practice humble collaborative partnership that honors local wisdom and expertise over cosmic mastery',
          'Create sustainable restoration through shared responsibility and co-creation rather than unilateral fixing',
        ],
      },
      foreshadowing_elements: [
        'The collaborative restoration template foreshadows future cosmic service approaches throughout the series',
        'The integration of cosmic technique with indigenous wisdom foreshadows ongoing partnerships with local communities',
        'The sustainable resilience created through shared responsibility foreshadows the long-term impact of partnership-based cosmic service',
      ],
    },
  ];

  for (let i = 0; i < ea030Scenes.length; i++) {
    const scene = ea030Scenes[i];
    const data = sceneData[i];

    await db
      .update(scenes)
      .set({
        core_emotion: data.core_emotion?.substring(0, 255) || null,
        scene_tone: data.scene_tone?.substring(0, 255) || null,
        timeline_date: data.timeline_date?.substring(0, 50) || null,
        timeline_variant: data.timeline_variant?.substring(0, 100) || null,
        sudowrite_metadata: data.sudowrite_metadata,
        learning_objectives: data.learning_objectives,
        foreshadowing_elements: data.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: Added missing fields`);
  }

  console.log('\n📊 Verifying completion...\n');

  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterUniqueIdentifier, 'EA-030'))
    .orderBy(scenes.sceneNumber);

  const allFields = [
    'title',
    'setup',
    'symbolism',
    'beatGoal',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'timeline_date',
    'timeline_variant',
    'location',
    'pages',
    'description',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'preliminarySceneDescription',
    'narrativeFunction',
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
  ];

  for (const scene of finalScenes) {
    const populatedCount = allFields.filter((field) => {
      const value = (scene as any)[field];
      return value !== null && value !== undefined;
    }).length;

    console.log(`Scene ${scene.sceneNumber}: ${populatedCount}/${allFields.length} fields populated`);
  }

  console.log('\n🎉 EA-030 complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
