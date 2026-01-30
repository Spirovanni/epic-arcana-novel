import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define metadata for each chapter based on theme and emotional arc
const chapterMetadata: Record<string, {
  baseEmotion: string;
  baseTone: string;
  scenes: Array<{ emotion: string; tone: string }>;
}> = {
  'EA-312': { // Desolation
    baseEmotion: 'grief',
    baseTone: 'somber and cathartic',
    scenes: [
      { emotion: 'Raw grief mixed with dawning acceptance', tone: 'Heavy, vulnerable, with undertones of necessary release' },
      { emotion: 'Tentative vulnerability mixed with protective resistance', tone: 'Intimate and exposed, with undercurrents of healing tension' },
      { emotion: 'Bittersweet recognition mixed with transformative hope', tone: 'Reflective and nuanced, with undertones of earned wisdom' },
      { emotion: 'Integrated sorrow mixed with renewed purpose', tone: 'Grounded and resolute, with undercurrents of transformed strength' }
    ]
  },
  'EA-313': { // Take Charge
    baseEmotion: 'determination',
    baseTone: 'decisive and empowering',
    scenes: [
      { emotion: 'Decisive clarity mixed with responsibility weight', tone: 'Bold and commanding, with undertones of leadership gravity' },
      { emotion: 'Proactive momentum mixed with execution urgency', tone: 'Dynamic and action-driven, with undercurrents of strategic focus' },
      { emotion: 'Empowered confidence mixed with measured authority', tone: 'Steady and influential, with undertones of micro-level mastery' },
      { emotion: 'Authoritative integration mixed with command presence', tone: 'Powerful and consolidated, with undercurrents of ultimate control' }
    ]
  },
  'EA-314': { // Challenging Decision
    baseEmotion: 'resolve',
    baseTone: 'tense and consequential',
    scenes: [
      { emotion: 'Decision clarity mixed with stakes awareness', tone: 'Weighty and pivotal, with undertones of irreversible commitment' },
      { emotion: 'Courageous commitment mixed with risk acceptance', tone: 'Taut and purposeful, with undercurrents of calculated danger' },
      { emotion: 'Environmental discernment mixed with contextual wisdom', tone: 'Analytical and perceptive, with undertones of situational mastery' },
      { emotion: 'Decisive integration mixed with choice ownership', tone: 'Resolute and complete, with undercurrents of permanent transformation' }
    ]
  },
  'EA-315': { // Appreciating the Moment
    baseEmotion: 'gratitude',
    baseTone: 'celebratory and present',
    scenes: [
      { emotion: 'Achievement recognition mixed with humble pride', tone: 'Triumphant yet grounded, with undertones of earned celebration' },
      { emotion: 'Authentic presence mixed with genuine appreciation', tone: 'Warm and sincere, with undercurrents of unguarded openness' },
      { emotion: 'Joyful clarity mixed with present-moment fullness', tone: 'Vibrant and alive, with undertones of temporal richness' },
      { emotion: 'Integrated appreciation mixed with sustained gratitude', tone: 'Fulfilled and harmonious, with undercurrents of lasting contentment' }
    ]
  },
  'EA-316': { // Manifesting Vision
    baseEmotion: 'aspiration',
    baseTone: 'visionary and intentional',
    scenes: [
      { emotion: 'Visionary clarity mixed with ambitious purpose', tone: 'Expansive and forward-focused, with undertones of destiny calling' },
      { emotion: 'Disciplined commitment mixed with habitual focus', tone: 'Structured and persistent, with undercurrents of pattern-building' },
      { emotion: 'Growth-oriented determination mixed with evolutionary drive', tone: 'Progressive and transformative, with undertones of continuous ascent' },
      { emotion: 'Manifestation integration mixed with vision completion', tone: 'Realized and crystallized, with undercurrents of actualized potential' }
    ]
  },
  'EA-317': { // Abandonment
    baseEmotion: 'release',
    baseTone: 'liberating yet uncertain',
    scenes: [
      { emotion: 'Control recognition mixed with attachment resistance', tone: 'Tense and revealing, with undertones of necessary letting-go' },
      { emotion: 'Releasing tension mixed with trust-building courage', tone: 'Vulnerable and liberating, with undercurrents of method-abandonment' },
      { emotion: 'Resilient acceptance mixed with failure-embracing wisdom', tone: 'Paradoxical and mature, with undertones of antifragile strength' },
      { emotion: 'Abandonment integration mixed with surrender power', tone: 'Free and empowered, with undercurrents of control-transcendence' }
    ]
  },
  'EA-318': { // Conscious Mind
    baseEmotion: 'awareness',
    baseTone: 'illuminating and transformative',
    scenes: [
      { emotion: 'Conscious recognition mixed with awakening clarity', tone: 'Revelatory and sharp, with undertones of mental expansion' },
      { emotion: 'Wisdom-sharing urgency mixed with teaching purpose', tone: 'Generous and impactful, with undercurrents of knowledge transmission' },
      { emotion: 'Growth-oriented focus mixed with developmental drive', tone: 'Forward-momentum and purposeful, with undertones of continuous improvement' },
      { emotion: 'Consciousness integration mixed with mind mastery', tone: 'Lucid and complete, with undercurrents of ultimate awareness' }
    ]
  },
  'EA-319': { // Competition
    baseEmotion: 'drive',
    baseTone: 'competitive and excellence-focused',
    scenes: [
      { emotion: 'Competitive fire mixed with performance hunger', tone: 'Intense and striving, with undertones of excellence pursuit' },
      { emotion: 'Sustained effort mixed with endurance determination', tone: 'Relentless and grinding, with undercurrents of long-game commitment' },
      { emotion: 'Purposeful focus mixed with practice discipline', tone: 'Precise and methodical, with undertones of deliberate mastery' },
      { emotion: 'Competition integration mixed with victory mindset', tone: 'Triumphant and dominant, with undercurrents of earned supremacy' }
    ]
  },
  'EA-320': { // Meaningful
    baseEmotion: 'purpose',
    baseTone: 'profound and legacy-driven',
    scenes: [
      { emotion: 'Purpose recognition mixed with calling clarity', tone: 'Deep and resonant, with undertones of life-meaning discovery' },
      { emotion: 'Enduring commitment mixed with long-term vision', tone: 'Steadfast and timeless, with undercurrents of legacy-building' },
      { emotion: 'Integrity alignment mixed with principle-centered strength', tone: 'Noble and unwavering, with undertones of moral authority' },
      { emotion: 'Meaningful integration mixed with purpose fulfillment', tone: 'Complete and significant, with undercurrents of ultimate contribution' }
    ]
  },
  'EA-321': { // Acknowledge
    baseEmotion: 'recognition',
    baseTone: 'appreciative and aware',
    scenes: [
      { emotion: 'Emotional awareness mixed with feeling validation', tone: 'Perceptive and accepting, with undertones of inner attunement' },
      { emotion: 'Gratitude depth mixed with thankful presence', tone: 'Warm and generous, with undercurrents of abundance recognition' },
      { emotion: 'Radical acceptance mixed with reality-embracing peace', tone: 'Surrendered and whole, with undertones of unconditional presence' },
      { emotion: 'Acknowledgment integration mixed with full witnessing', tone: 'Complete and honoring, with undercurrents of total recognition' }
    ]
  },
  'EA-322': { // Ruin
    baseEmotion: 'fragility',
    baseTone: 'sobering and reconstructive',
    scenes: [
      { emotion: 'Fragility recognition mixed with vulnerability acceptance', tone: 'Exposed and stark, with undertones of impermanence awareness' },
      { emotion: 'Reframing courage mixed with perspective-shifting resolve', tone: 'Adaptive and resilient, with undercurrents of obstacle-transformation' },
      { emotion: 'Meaning-centered clarity mixed with purpose-anchoring strength', tone: 'Grounded and meaningful, with undertones of existential stability' },
      { emotion: 'Ruin integration mixed with phoenix-rising power', tone: 'Rebuilt and transformed, with undercurrents of destruction-transcendence' }
    ]
  },
  'EA-323': { // Dignity
    baseEmotion: 'honor',
    baseTone: 'noble and self-respecting',
    scenes: [
      { emotion: 'Integrity recognition mixed with self-honor awakening', tone: 'Dignified and proud, with undertones of intrinsic worth' },
      { emotion: 'Dignity protection mixed with boundary-maintaining strength', tone: 'Firm and respectful, with undercurrents of self-preservation' },
      { emotion: 'Purpose-aligned dignity mixed with meaning-centered honor', tone: 'Noble and principled, with undertones of higher calling' },
      { emotion: 'Dignity integration mixed with complete self-respect', tone: 'Regal and whole, with undercurrents of unshakeable worth' }
    ]
  },
  'EA-324': { // Study
    baseEmotion: 'curiosity',
    baseTone: 'inquisitive and methodical',
    scenes: [
      { emotion: 'Learning recognition mixed with cognitive excitement', tone: 'Alert and engaged, with undertones of intellectual hunger' },
      { emotion: 'Metalearning focus mixed with method-mastery drive', tone: 'Strategic and efficient, with undercurrents of learning optimization' },
      { emotion: 'Focus-diffuse clarity mixed with cognitive-mode wisdom', tone: 'Balanced and insightful, with undertones of mental flexibility' },
      { emotion: 'Study integration mixed with learning mastery', tone: 'Competent and complete, with undercurrents of knowledge consolidation' }
    ]
  },
  'EA-325': { // Respect
    baseEmotion: 'reverence',
    baseTone: 'respectful and dignified',
    scenes: [
      { emotion: 'Respectful awareness mixed with listening presence', tone: 'Attentive and honoring, with undertones of deep regard' },
      { emotion: 'Empathetic connection mixed with understanding depth', tone: 'Compassionate and perceptive, with undercurrents of emotional attunement' },
      { emotion: 'Honor clarity mixed with dignity recognition', tone: 'Noble and clear, with undertones of mutual respect' },
      { emotion: 'Respect integration mixed with leadership grace', tone: 'Authoritative yet humble, with undercurrents of earned respect' }
    ]
  },
  'EA-326': { // Strife
    baseEmotion: 'tension',
    baseTone: 'confrontational yet constructive',
    scenes: [
      { emotion: 'Conflict awareness mixed with dialogue courage', tone: 'Tense yet open, with undertones of necessary confrontation' },
      { emotion: 'Peace-seeking resolve mixed with mindset-shifting commitment', tone: 'Reconciling and purposeful, with undercurrents of harmony pursuit' },
      { emotion: 'Feedback receptivity mixed with growth-embracing humility', tone: 'Vulnerable and learning-oriented, with undertones of improvement desire' },
      { emotion: 'Strife integration mixed with conflict mastery', tone: 'Resolved and skillful, with undercurrents of relational wisdom' }
    ]
  },
  'EA-327': { // Benevolence
    baseEmotion: 'compassion',
    baseTone: 'kind and generous',
    scenes: [
      { emotion: 'Self-compassion awakening mixed with inner kindness', tone: 'Gentle and nurturing, with undertones of self-tenderness' },
      { emotion: 'Suffering-openness mixed with universal empathy', tone: 'Expansive and caring, with undercurrents of shared humanity' },
      { emotion: 'Empathetic clarity mixed with compassionate understanding', tone: 'Warm and insightful, with undertones of heartfelt connection' },
      { emotion: 'Benevolence integration mixed with loving presence', tone: 'Radiant and complete, with undercurrents of unconditional kindness' }
    ]
  },
  'EA-328': { // Intellectual Adventure
    baseEmotion: 'wonder',
    baseTone: 'exploratory and exhilarating',
    scenes: [
      { emotion: 'Broad-thinking excitement mixed with curiosity drive', tone: 'Adventurous and expansive, with undertones of discovery thrill' },
      { emotion: 'Deep-interest passion mixed with sustained fascination', tone: 'Engaged and absorbed, with undercurrents of intellectual immersion' },
      { emotion: 'Question-driven curiosity mixed with inquiry courage', tone: 'Inquisitive and bold, with undertones of truth-seeking' },
      { emotion: 'Adventure integration mixed with exploratory mastery', tone: 'Fulfilled and enriched, with undercurrents of knowledge abundance' }
    ]
  },
  'EA-329': { // Victory
    baseEmotion: 'triumph',
    baseTone: 'victorious and empowering',
    scenes: [
      { emotion: 'Effort recognition mixed with grit awareness', tone: 'Determined and resilient, with undertones of earned strength' },
      { emotion: 'Growth-mindset commitment mixed with adaptive courage', tone: 'Flexible and persistent, with undercurrents of challenge-embracing' },
      { emotion: 'Obstacle clarity mixed with adversity-transforming power', tone: 'Strategic and converting, with undertones of problem-solving mastery' },
      { emotion: 'Victory integration mixed with triumphant completion', tone: 'Conquering and complete, with undercurrents of ultimate success' }
    ]
  },
  'EA-330': { // Recuperation
    baseEmotion: 'restoration',
    baseTone: 'restful and rejuvenating',
    scenes: [
      { emotion: 'Rest recognition mixed with recovery acceptance', tone: 'Calm and restorative, with undertones of necessary pause' },
      { emotion: 'Rejuvenation focus mixed with renewal commitment', tone: 'Refreshing and revitalizing, with undercurrents of energy restoration' },
      { emotion: 'Stress-release clarity mixed with tension-dissolving relief', tone: 'Relaxed and unburdened, with undertones of freedom restoration' },
      { emotion: 'Recuperation integration mixed with complete renewal', tone: 'Restored and whole, with undercurrents of sustainable vitality' }
    ]
  },
  'EA-331': { // Creative Tactics
    baseEmotion: 'innovation',
    baseTone: 'inventive and playful',
    scenes: [
      { emotion: 'Creative recognition mixed with imaginative awakening', tone: 'Inspired and original, with undertones of innovative spark' },
      { emotion: 'Brainstorming energy mixed with generative flow', tone: 'Dynamic and prolific, with undercurrents of idea abundance' },
      { emotion: 'Remix excitement mixed with recombination joy', tone: 'Playful and experimental, with undertones of creative freedom' },
      { emotion: 'Tactical integration mixed with creative mastery', tone: 'Strategic and artistic, with undercurrents of innovation completion' }
    ]
  },
  'EA-332': { // Intellect
    baseEmotion: 'clarity',
    baseTone: 'sharp and analytical',
    scenes: [
      { emotion: 'Memory-mastery focus mixed with cognitive precision', tone: 'Sharp and disciplined, with undertones of mental excellence' },
      { emotion: 'Dual-mode awareness mixed with thinking flexibility', tone: 'Balanced and strategic, with undercurrents of cognitive optimization' },
      { emotion: 'Deliberate clarity mixed with judgment refinement', tone: 'Lucid and discerning, with undertones of intellectual rigor' },
      { emotion: 'Intellect integration mixed with mental supremacy', tone: 'Brilliant and complete, with undercurrents of cognitive mastery' }
    ]
  },
  'EA-333': { // Initiation
    baseEmotion: 'beginning',
    baseTone: 'ceremonial and transformative',
    scenes: [
      { emotion: 'Tribal recognition mixed with unity calling', tone: 'Gathering and connective, with undertones of collective purpose' },
      { emotion: 'Separation courage mixed with releasing strength', tone: 'Transitional and brave, with undercurrents of threshold-crossing' },
      { emotion: 'Transition clarity mixed with phase-honoring wisdom', tone: 'Patient and discerning, with undertones of authentic transformation' },
      { emotion: 'Initiation integration mixed with tribal authority', tone: 'Unified and complete, with undercurrents of leadership emergence' }
    ]
  },
  'EA-334': { // Sorrow
    baseEmotion: 'grief',
    baseTone: 'mournful yet transcendent',
    scenes: [
      { emotion: 'Meaning-seeking sorrow mixed with purposeful grief', tone: 'Heavy yet illuminating, with undertones of revelatory pain' },
      { emotion: 'Embodied grief mixed with somatic release', tone: 'Physical and emotional, with undercurrents of body-held mourning' },
      { emotion: 'Story-owning vulnerability mixed with narrative courage', tone: 'Exposed and honest, with undertones of struggle-sharing' },
      { emotion: 'Sorrow integration mixed with temporal transcendence', tone: 'Transformed and timeless, with undercurrents of grief-mastered wisdom' }
    ]
  },
  'EA-335': { // Prosperity
    baseEmotion: 'abundance',
    baseTone: 'prosperous and generative',
    scenes: [
      { emotion: 'Desire clarity mixed with intentional focus', tone: 'Purposeful and specific, with undertones of manifestation power' },
      { emotion: 'Abundance-action commitment mixed with consistent practice', tone: 'Disciplined and generative, with undercurrents of wealth-building' },
      { emotion: 'Skill-development dedication mixed with capacity-building drive', tone: 'Investing and growing, with undertones of competency expansion' },
      { emotion: 'Prosperity integration mixed with collective abundance', tone: 'Wealthy and unified, with undercurrents of shared manifestation' }
    ]
  }
};

async function main() {
  console.log('📝 Populating scene metadata for EA-312 to EA-335...\n');

  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  let updateCount = 0;

  function updateScenes(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    if (obj.id && chapterMetadata[obj.id] && obj.scenes && Array.isArray(obj.scenes)) {
      const metadata = chapterMetadata[obj.id];
      console.log(`✅ Found ${obj.id}: ${obj.specific_task_group_title || obj.title}`);

      obj.scenes.forEach((scene: any, index: number) => {
        if (scene && metadata.scenes[index]) {
          // Set consistent POV and tense for all scenes
          scene.pov = 'Third Person Limited (Francisco)';
          scene.tense = 'Past Tense';

          // Set scene-specific emotion and tone
          scene.core_emotion = metadata.scenes[index].emotion;
          scene.scene_tone = metadata.scenes[index].tone;

          updateCount++;
          console.log(`   Updated Scene ${scene.scene_number}: ${scene.title}`);
        }
      });

      return true;
    }

    for (const key in obj) {
      updateScenes(obj[key]);
    }

    return false;
  }

  updateScenes(outline);

  const backupPath = path.join(__dirname, '../data/l_outline.backup-metadata-update.json');
  fs.copyFileSync(outlinePath, backupPath);
  console.log(`\n💾 Backup created: ${backupPath}`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`\n✅ Updated ${updateCount} scenes across 24 chapters`);
  console.log('✨ Complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
