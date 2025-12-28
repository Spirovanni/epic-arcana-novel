#!/usr/bin/env tsx

import path from 'path';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import {
  buildSceneValuesFromOutline,
  loadOutlineScenes,
  OutlineSceneRecord,
  SceneValueDraft,
} from './lib/outlineToScenes';
import {
  loadImportState,
  persistImportState,
  resetImportState,
} from './lib/importState';

type SceneInsert = typeof scenes.$inferInsert;
type SceneSelect = typeof scenes.$inferSelect;

interface CliOptions {
  file: string;
  dryRun: boolean;
  force: boolean;
  runAll: boolean;
  resetState: boolean;
  skipExisting: boolean;
  limit?: number;
  chapterFilter?: string;
  chapterIdFilter?: string;
}

const scenePayloadSchema = z.object({
  chapterId: z.string().uuid(),
  sceneNumber: z.number().int().positive(),
  storySequence: z.number().int().positive(),
  chronologicalSequence: z.number().int().positive(),
});

const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    file: 'data/l_outline.json',
    dryRun: false,
    force: false,
    runAll: false,
    resetState: false,
    skipExisting: false,
    limit: undefined,
    chapterFilter: undefined,
    chapterIdFilter: undefined,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--file':
        options.file = args[i + 1] ?? options.file;
        i += 1;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--run-all':
        options.runAll = true;
        break;
      case '--reset-state':
        options.resetState = true;
        break;
      case '--skip-existing':
        options.skipExisting = true;
        break;
      case '--limit':
        options.limit = Number.parseInt(args[i + 1] ?? '', 10);
        i += 1;
        break;
      case '--chapter':
        options.chapterFilter = args[i + 1];
        i += 1;
        break;
      case '--chapter-id':
        options.chapterIdFilter = args[i + 1];
        i += 1;
        break;
      default:
        break;
    }
  }

  if (Number.isNaN(options.limit)) {
    options.limit = undefined;
  }
  if (options.limit && !options.runAll) {
    console.warn('⚠️  --limit is ignored unless --run-all is set.');
  }

  return options;
};

const toKey = (chapterId: string, sceneNumber: number) => `${chapterId}:${sceneNumber}`;

const computeChronologicalSequence = (
  draft: SceneValueDraft,
  storySequence: number,
): number => {
  if (draft.timeline_variant || draft.alternateTimelineVariant) {
    return storySequence;
  }
  return storySequence;
};

const isBlank = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const hasFillableGaps = (existing: SceneSelect | null, incoming: Partial<SceneInsert>): boolean => {
  if (!existing) return true;
  return Object.entries(incoming).some(([key, value]) => {
    if (value === undefined) return false;
    const current = (existing as Record<string, unknown>)[key];
    return isBlank(current) && !isBlank(value);
  });
};

const computeUpdates = (
  existing: SceneSelect | null,
  incoming: SceneInsert,
  force: boolean,
): { updates: Partial<SceneInsert>; changedFields: string[] } => {
  if (!existing) {
    return { updates: incoming, changedFields: Object.keys(incoming) };
  }

  const updates: Partial<SceneInsert> = {};
  const changedFields: string[] = [];

  const alwaysOverwrite: Array<keyof SceneInsert> = ['storySequence', 'chronologicalSequence'];

  Object.entries(incoming).forEach(([key, value]) => {
    if (value === undefined) return;
    if (key === 'createdAt' || key === 'id') return;

    const current = (existing as Record<string, unknown>)[key];
    const targetKey = key as keyof SceneInsert;
    const shouldUpdate =
      force ||
      alwaysOverwrite.includes(targetKey) ||
      isBlank(current);

    if (shouldUpdate && current !== value) {
      (updates as Record<string, unknown>)[key] = value;
      changedFields.push(key);
    }
  });

  if (changedFields.length) {
    updates.updatedAt = new Date();
  }

  return { updates, changedFields };
};

const resolveChapterId = (
  record: OutlineSceneRecord,
  chapterRows: Array<typeof chapters.$inferSelect>,
): { chapterId: string; matchedBy: string } => {
  const { chapterContext } = record;
  const byUnique = chapterContext.uniqueIdentifier
    ? chapterRows.find(
        (row) =>
          row.uniqueIdentifier &&
          row.uniqueIdentifier.toLowerCase() === chapterContext.uniqueIdentifier!.toLowerCase(),
      )
    : undefined;

  if (byUnique) {
    return { chapterId: byUnique.id, matchedBy: 'uniqueIdentifier' };
  }

  if (typeof chapterContext.chapterNumber === 'number') {
    const byNumber = chapterRows.find(
      (row) => row.chapterNumber === chapterContext.chapterNumber,
    );
    if (byNumber) {
      return { chapterId: byNumber.id, matchedBy: 'chapterNumber' };
    }
  }

  if (chapterContext.chapterTitle) {
    const lower = chapterContext.chapterTitle.toLowerCase();
    const byTitle = chapterRows.find(
      (row) => row.title && row.title.toLowerCase() === lower,
    );
    if (byTitle) {
      return { chapterId: byTitle.id, matchedBy: 'title' };
    }
  }

  throw new Error(
    `Unable to resolve chapter for outline entry ${chapterContext.chapterLabel ?? 'unknown'} (${chapterContext.chapterTitle ?? 'no title'})`,
  );
};

const main = async () => {
  const options = parseArgs();
  const outlineScenes = await loadOutlineScenes({
    filePath: options.file,
    chapterFilter: options.chapterFilter,
  });

  if (!outlineScenes.length) {
    console.log('No scenes found in outline with current filters.');
    return;
  }

  if (options.resetState) {
    await resetImportState();
  }

  const [dbMaxRow] = await db
    .select({ max: sql<number>`max(${scenes.storySequence})` })
    .from(scenes);
  const dbMaxStorySequence = Number(dbMaxRow?.max ?? 0);

  const state = await loadImportState(options.resetState);
  const lastStateSeq = state.lastStorySequence ?? 0;
  let storySequenceCounter = Math.max(dbMaxStorySequence, lastStateSeq);

  if (dbMaxStorySequence > lastStateSeq) {
    await persistImportState({
      ...state,
      lastStorySequence: dbMaxStorySequence,
    });
  }

  const chapterRows = await db
    .select({
      id: chapters.id,
      uniqueIdentifier: chapters.uniqueIdentifier,
      chapterNumber: chapters.chapterNumber,
      title: chapters.title,
    })
    .from(chapters);

  let processed = 0;
  const maxToProcess = options.runAll ? options.limit ?? outlineScenes.length : 1;

  for (const record of outlineScenes) {
    if (processed >= maxToProcess) break;

    let resolution: { chapterId: string; matchedBy: string };
    try {
      resolution = resolveChapterId(record, chapterRows);
    } catch (error) {
      console.error(`❌ ${error}`);
      continue;
    }

    if (options.chapterIdFilter && resolution.chapterId !== options.chapterIdFilter) {
      continue;
    }

    const seed = `${resolution.chapterId}:${record.sceneNumber}`;
    const { values: outlineValues, notes } = buildSceneValuesFromOutline(record, seed);

    const existing = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, resolution.chapterId),
          eq(scenes.sceneNumber, record.sceneNumber),
        ),
      )
      .limit(1);

    const existingRow = existing[0] ?? null;

    if (existingRow && options.skipExisting) {
      continue;
    }

    const draft: SceneInsert = {
      ...outlineValues,
      chapterId: resolution.chapterId,
      storySequence: storySequenceCounter + 1,
      chronologicalSequence: computeChronologicalSequence(
        outlineValues,
        storySequenceCounter + 1,
      ),
      updatedAt: new Date(),
    };

    scenePayloadSchema.parse({
      chapterId: draft.chapterId,
      sceneNumber: draft.sceneNumber,
      storySequence: draft.storySequence,
      chronologicalSequence: draft.chronologicalSequence,
    });

    const missingSequences =
      !existingRow ||
      isBlank(existingRow.storySequence) ||
      isBlank(existingRow.chronologicalSequence);

    const needsProcessing =
      missingSequences || options.force || hasFillableGaps(existingRow, outlineValues);

    if (!needsProcessing) {
      continue;
    }

    if (options.dryRun) {
      console.log('\n--- DRY RUN ---');
      console.log(
        `Next scene: Chapter ${record.chapterContext.chapterLabel ?? '?'} (${resolution.chapterId}) Scene ${record.sceneNumber}`,
      );
      console.log(`story_sequence -> ${draft.storySequence}`);
      console.log(`chronological_sequence -> ${draft.chronologicalSequence}`);
      console.log('payload:', JSON.stringify(draft, null, 2));
      console.log('notes:', notes);
      // Do not advance counters or state on dry run
      break;
    }

    let applied = false;

    await db.transaction(async (tx) => {
      const [freshExisting] = await tx
        .select()
        .from(scenes)
        .where(
          and(
            eq(scenes.chapterId, resolution.chapterId),
            eq(scenes.sceneNumber, record.sceneNumber),
          ),
        )
        .limit(1);

      const mergeResult = computeUpdates(freshExisting ?? null, draft, options.force);

      if (!freshExisting) {
        await tx.insert(scenes).values(draft);
        applied = true;
      } else if (mergeResult.changedFields.length) {
        await tx
          .update(scenes)
          .set(mergeResult.updates)
          .where(
            and(
              eq(scenes.chapterId, resolution.chapterId),
              eq(scenes.sceneNumber, record.sceneNumber),
            ),
          );
        applied = true;
      } else {
        return;
      }
    });

    if (applied) {
      storySequenceCounter += 1;
      await persistImportState({
        lastProcessed: {
          chapterId: resolution.chapterId,
          sceneNumber: record.sceneNumber,
        },
        lastStorySequence: storySequenceCounter,
      });

      console.log(
        `✅ Imported Scene ${record.sceneNumber} (${record.chapterContext.chapterLabel ?? 'chapter'}) -> story_sequence ${storySequenceCounter}`,
      );
      if (notes.length) {
        console.log(`Notes: ${notes.join(' | ')}`);
      }
      processed += 1;
    } else {
      console.log(
        `ℹ️  Scene ${record.sceneNumber} already up to date for chapter ${record.chapterContext.chapterLabel ?? 'unknown'}.`,
      );
    }

    if (!options.runAll) break;
  }

  if (processed === 0) {
    console.log('No eligible scenes were processed. All caught up or filtered out.');
  } else {
    console.log(`Finished processing ${processed} scene(s).`);
  }
};

main().catch((error) => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});

