import { promises as fs } from 'fs';
import path from 'path';
import { scenes } from '../../src/lib/schema';

type SceneInsert = typeof scenes.$inferInsert;

export type SceneValueDraft = Omit<
  SceneInsert,
  | 'id'
  | 'chapterId'
  | 'storySequence'
  | 'chronologicalSequence'
  | 'createdAt'
  | 'updatedAt'
> & {
  sceneNumber: number;
};

export interface OutlineChapterContext {
  chapterLabel?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  uniqueIdentifier?: string;
  outlineId?: string;
  focusArea?: string;
  epicNovelPages?: string;
  epicChapterFocus?: string;
  epicPreliminarySceneFocus?: string;
  epicPreliminarySceneDescription?: string;
  epicNovelChapterFocus?: string;
  connectionToMajorTaskGroup?: string;
}

export interface OutlineSceneRecord {
  chapterContext: OutlineChapterContext;
  raw: Record<string, any>;
  sceneNumber: number;
  chapterOrder: number;
  sceneOrder: number;
}

export interface LoadOutlineOptions {
  filePath: string;
  chapterFilter?: string;
}

export interface SceneBuildResult {
  values: SceneValueDraft;
  notes: string[];
}

const MAX_TITLE = 255;

const cleanse = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  return value.replace(/\s+/g, ' ').trim();
};

const truncate = (value: string | undefined, max = MAX_TITLE): string | undefined => {
  if (!value) return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
};

const parseChapterNumber = (chapterLabel?: string, fallback?: number): number | undefined => {
  if (typeof fallback === 'number' && Number.isInteger(fallback)) return fallback;
  if (!chapterLabel) return undefined;
  const match = chapterLabel.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : undefined;
};

const deterministicIndex = (seed: string, modulo: number): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
};

const pick = <T>(seed: string, options: T[]): T | undefined => {
  if (!options.length) return undefined;
  return options[deterministicIndex(seed, options.length)];
};

const normalizeArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanse(typeof item === 'string' ? item : JSON.stringify(item)))
      .filter(Boolean) as string[];
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n;]+/)
      .map((part) => cleanse(part))
      .filter(Boolean) as string[];
  }
  return [cleanse(JSON.stringify(value))].filter(Boolean) as string[];
};

const deriveMissingFields = (
  seed: string,
  base: SceneValueDraft,
  context: OutlineChapterContext,
): Partial<SceneValueDraft> => {
  const derived: Partial<SceneValueDraft> = {};
  const focusHint = base.focus || context.focusArea || context.epicChapterFocus || 'the central thread';

  // Only derive basic narrative fields when missing
  // NEVER derive timeline/temporal fields unless outline strongly implies them

  if (!base.setup) {
    derived.setup =
      pick(seed, [
        `Open with a grounded moment that reveals ${focusHint} in the current setting.`,
        `Frame the scene around a concrete choice that pressures ${focusHint}.`,
        `Let a small, sensory detail hint at the stakes behind ${focusHint}.`,
      ]) || undefined;
  }

  if (!base.sensoryDetail) {
    derived.sensoryDetail =
      pick(seed, [
        'Lean on textures and temperature to root the reader in the space.',
        'Use sound cues to contrast surface calm with underlying tension.',
        'Let light and shadow describe the emotional temperature of the room.',
      ]) || undefined;
  }

  if (!base.internalConflict) {
    derived.internalConflict =
      pick(seed, [
        `The protagonist wants progress on ${focusHint} but fears the cost.`,
        `Desire to protect others clashes with the need to reveal the truth.`,
        `Hope for change fights against dread that nothing can shift.`,
      ]) || undefined;
  }

  if (!base.beatGoal) {
    derived.beatGoal =
      pick(seed, [
        `Secure a small win that proves ${focusHint} matters.`,
        `Test loyalty through a vulnerable admission tied to ${focusHint}.`,
        `Force a decision that can't be deferred without consequence.`,
      ]) || undefined;
  }

  if (!base.symbolism) {
    derived.symbolism =
      pick(seed, [
        'A recurring motif of fractured mirrors hints at split loyalties.',
        'An unlit lamp symbolizes withheld truth and delayed clarity.',
        'A weather shift mirrors the character\'s unease.',
      ]) || undefined;
  }

  if (!base.core_emotion) {
    derived.core_emotion =
      pick(seed, [
        'uneasy resolve',
        'cautious optimism',
        'quiet dread',
        'focused determination',
      ]) || undefined;
  }

  if (!base.scene_tone) {
    derived.scene_tone =
      pick(seed, [
        'tense but intimate',
        'reflective with sharp edges',
        'urgent and breathless',
        'measured and watchful',
      ]) || undefined;
  }

  if (!base.characterGrowthElement) {
    derived.characterGrowthElement =
      pick(seed, [
        'learning to voice doubt without retreating',
        'inviting an ally into guarded plans',
        'accepting responsibility for unintended fallout',
      ]) || undefined;
  }

  // Only derive realWorldContext if there's NO timeline/temporal indication
  // Prefer NULL over generic context when temporal mechanics are involved
  const hasTemporalIndicators =
    base.timeline_variant ||
    base.alternateTimelineVariant ||
    base.temporalDivergencePoint ||
    base.temporalPowerManifested;

  if (!base.realWorldContext && !hasTemporalIndicators) {
    derived.realWorldContext =
      pick(seed, [
        'Contextualizes the moment against regional instability and travel risks.',
        'Anchors the beat in local cultural tension that complicates alliances.',
        'Connects the choice to broader whispers about shifting power.',
      ]) || undefined;
  }

  // NOTE: We do NOT derive timeline_variant, timeline_date, timeline_significance,
  // temporalPowerManifested, or any temporal fields. These must come from outline.
  // If missing in outline, they remain NULL.

  return derived;
};

const buildSudowriteMetadata = (raw: Record<string, any>, base: SceneValueDraft): SceneInsert['sudowrite_metadata'] => {
  const styleNotes: string[] = [];
  const visualPrompts: string[] = [];
  const writingTips: string[] = [];

  const pacing = cleanse(raw.sudowrite_pacing_guidance);
  const toneGuide = cleanse(raw.sudowrite_tone_guidance);
  const sensory = cleanse(raw.sudowrite_sensory_focus);
  const keyChallenge = cleanse(raw.sudowrite_key_challenge);
  const targetLength = cleanse(raw.sudowrite_target_length);
  const characterMoments = normalizeArray(raw.sudowrite_character_moments);

  if (pacing) styleNotes.push(pacing);
  if (toneGuide) styleNotes.push(toneGuide);
  if (keyChallenge) styleNotes.push(keyChallenge);
  if (targetLength) styleNotes.push(`Target length: ${targetLength}`);
  if (sensory) visualPrompts.push(sensory);
  if (characterMoments.length) writingTips.push(...characterMoments);

  return {
    pov: base.pov || cleanse(raw.sudowrite_pov_guidance) || base.pov,
    tense: base.tense || undefined,
    tone: base.scene_tone || toneGuide || undefined,
    coreEmotion: base.core_emotion || undefined,
    styleNotes,
    visualPrompts,
    writingTips,
  };
};

const buildLearningObjectives = (
  raw: Record<string, any>,
  context: OutlineChapterContext,
): SceneInsert['learning_objectives'] => {
  const objectives: string[] = [];

  const integration = cleanse(raw.learning_objective_integration);
  if (integration) {
    integration
      .split(/[.;]/)
      .map((part) => cleanse(part))
      .filter(Boolean)
      .forEach((item) => objectives.push(item!));
  }

  const chapterObjectives = context.connectionToMajorTaskGroup || context.epicChapterFocus;
  if (chapterObjectives) {
    objectives.push(chapterObjectives);
  }

  const uniqueObjectives = Array.from(new Set(objectives)).slice(0, 6);
  return uniqueObjectives;
};

const buildForeshadowing = (raw: Record<string, any>): SceneInsert['foreshadowing_elements'] => {
  const entries: string[] = [];
  if (raw.series_connections && typeof raw.series_connections === 'object') {
    Object.values(raw.series_connections)
      .map((val) => cleanse(typeof val === 'string' ? val : JSON.stringify(val)))
      .filter(Boolean)
      .forEach((item) => entries.push(item!));
  }
  return entries.slice(0, 5);
};

/**
 * Detects if the outline data strongly implies timeline divergence/time travel mechanics.
 * Only returns true when there's explicit evidence in the data.
 */
const hasTimelineDivergenceIndicators = (raw: Record<string, any>): boolean => {
  const timelineKeywords = [
    'timeline',
    'temporal',
    'time travel',
    'divergence',
    'fracture',
    'variant',
    'paradox',
    'chronological',
  ];

  // Check explicit timeline fields
  if (raw.timeline_variant || raw.timeline_date || raw.alternate_timeline_variant) {
    return true;
  }

  // Check if temporal power is explicitly mentioned
  if (raw.temporal_power_manifested || raw.temporal_divergence_point) {
    return true;
  }

  // Check if description/focus mentions timeline mechanics
  const textFields = [
    raw.preliminary_scene_description,
    raw.description,
    raw.setup,
    raw.narrative_function,
  ].filter(Boolean);

  return textFields.some((text) => {
    const lower = String(text).toLowerCase();
    return timelineKeywords.some((keyword) => lower.includes(keyword));
  });
};

const extractChapterContext = (node: Record<string, any>): OutlineChapterContext => ({
  chapterLabel: cleanse(node.chapter),
  chapterNumber: parseChapterNumber(node.chapter, node.all_chapter),
  chapterTitle: cleanse(node.chapter_title),
  uniqueIdentifier: cleanse(node.chapter_unique_identifier || node.unique_identifier),
  outlineId: cleanse(node.id),
  focusArea: cleanse(node.focus_area || node.focus),
  epicNovelPages: cleanse(node.epic_novel_pages),
  epicChapterFocus: cleanse(node.epic_chapter_focus),
  epicPreliminarySceneFocus: cleanse(node.epic_preliminary_scene_focus),
  epicPreliminarySceneDescription: cleanse(node.epic_preliminary_scene_description),
  epicNovelChapterFocus: cleanse(node.epic_novel_chapter_focus),
  connectionToMajorTaskGroup: cleanse(node.connection_to_the_major_task_group),
});

const shouldKeepChapter = (context: OutlineChapterContext, filter?: string): boolean => {
  if (!filter) return true;
  const needle = filter.toLowerCase();
  return (
    (context.chapterLabel && context.chapterLabel.toLowerCase().includes(needle)) ||
    (context.chapterTitle && context.chapterTitle.toLowerCase().includes(needle)) ||
    (context.uniqueIdentifier && context.uniqueIdentifier.toLowerCase().includes(needle))
  );
};

export async function loadOutlineScenes(options: LoadOutlineOptions): Promise<OutlineSceneRecord[]> {
  const outlinePath = path.resolve(process.cwd(), options.filePath);
  const raw = await fs.readFile(outlinePath, 'utf8');
  const json = JSON.parse(raw);

  const chaptersWithScenes: OutlineSceneRecord[] = [];
  let chapterOrder = 0;

  const traverse = (node: any): void => {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node.scenes)) {
      const context = extractChapterContext(node);
      if (shouldKeepChapter(context, options.chapterFilter)) {
        const scenesList = node.scenes as Array<Record<string, any>>;
        scenesList.forEach((sceneNode, idx) => {
          const explicitNumber = Number.isInteger(sceneNode.scene_number)
            ? Number(sceneNode.scene_number)
            : undefined;
          const sceneNumber = explicitNumber ?? (scenesList.length === 1 ? 1 : idx + 1);

          chaptersWithScenes.push({
            chapterContext: context,
            raw: sceneNode,
            sceneNumber,
            chapterOrder,
            sceneOrder: idx,
          });
        });
      }
      chapterOrder += 1;
    }

    for (const value of Object.values(node)) {
      if (value && typeof value === 'object') {
        traverse(value);
      }
    }
  };

  traverse(json);

  return chaptersWithScenes.sort((a, b) => {
    if (a.chapterOrder !== b.chapterOrder) return a.chapterOrder - b.chapterOrder;
    if (a.sceneNumber !== b.sceneNumber) return a.sceneNumber - b.sceneNumber;
    return a.sceneOrder - b.sceneOrder;
  });
}

export function buildSceneValuesFromOutline(
  record: OutlineSceneRecord,
  seed: string,
): SceneBuildResult {
  const { raw, chapterContext, sceneNumber } = record;
  const notes: string[] = [];

  // Map fields from outline following the spec's priority order
  // ONLY including fields that exist in the actual database
  const base: SceneValueDraft = {
    sceneNumber,
    chapterUniqueIdentifier: chapterContext.uniqueIdentifier || chapterContext.outlineId,

    // Title field
    title: truncate(cleanse(raw.scene_title || raw.title)) || undefined,

    // Focus fields (priority: focus → focus_area → epic_chapter_focus)
    focus: cleanse(raw.focus || raw.focus_area || chapterContext.focusArea || chapterContext.epicChapterFocus),
    chapterSceneFocus: cleanse(raw.chapter_scene_focus || chapterContext.epicNovelChapterFocus),

    // Preliminary scene fields
    preliminarySceneFocus: cleanse(raw.preliminary_scene_focus || raw.epic_preliminary_scene_focus || chapterContext.epicPreliminarySceneFocus),
    preliminarySceneDescription: cleanse(
      raw.preliminary_scene_description || raw.epic_preliminary_scene_description || chapterContext.epicPreliminarySceneDescription,
    ),

    // Description (epic_preliminary_scene_description takes priority per spec)
    description: cleanse(
      raw.description ||
      raw.epic_preliminary_scene_description ||
      chapterContext.epicPreliminarySceneDescription,
    ),

    // Scene structure fields
    setup: cleanse(raw.setup),
    sensoryDetail: cleanse(raw.sensory_detail),
    internalConflict: cleanse(raw.internal_conflict),
    beatGoal: cleanse(raw.beat_goal),

    // Pages (priority: pages → epic_novel_pages)
    pages: cleanse(raw.pages || raw.epic_novel_pages || chapterContext.epicNovelPages),

    symbolism: cleanse(raw.symbolism),

    // Save the Cat beat
    saveTheCatBeat: cleanse(raw.save_the_cat_beat || chapterContext.epicChapterFocus),

    // Temporal/timeline fields - ONLY from outline, never invented
    temporalPowerManifested: cleanse(raw.temporal_power_manifested),
    characterGrowthElement: cleanse(raw.character_growth_element),
    sceneCardProgression: raw.scene_card_progression,

    // Timeline coordination
    realWorldContext: cleanse(raw.real_world_context),
    timelineSignificance: cleanse(raw.timeline_significance),
    timeline_date: cleanse(raw.timeline_date),
    timeline_variant: cleanse(raw.timeline_variant),

    // Scene metadata
    location: cleanse(raw.location),
    pov: cleanse(raw.pov),
    tense: cleanse(raw.tense),
    core_emotion: cleanse(raw.core_emotion),
    scene_tone: cleanse(raw.scene_tone),
    seriesConnectionResonance: cleanse(raw.series_connection_resonance),

    // JSONB fields (built separately)
    sudowrite_metadata: undefined,
    learning_objectives: undefined,
    foreshadowing_elements: undefined,

    // Narrative function (connection_to_major_task_group per spec)
    narrativeFunction: cleanse(raw.narrative_function || chapterContext.connectionToMajorTaskGroup),
  };

  // Detect timeline divergence indicators
  const hasTimelineDivergence = hasTimelineDivergenceIndicators(raw);
  if (hasTimelineDivergence) {
    notes.push('Timeline divergence indicators detected in outline data');
  }

  // Apply deterministic fills for missing basic narrative fields
  const derived = deriveMissingFields(seed, base, chapterContext);
  const merged: SceneValueDraft = { ...base, ...derived };

  // Build JSONB fields
  merged.sudowrite_metadata = buildSudowriteMetadata(raw, merged);
  merged.learning_objectives = buildLearningObjectives(raw, chapterContext);
  merged.foreshadowing_elements = buildForeshadowing(raw);

  // Ensure title is present
  if (!merged.title) {
    merged.title = truncate(`Scene ${sceneNumber} — ${chapterContext.chapterTitle ?? 'Untitled'}`);
    notes.push('Derived fallback title');
  }

  return { values: merged, notes };
}
