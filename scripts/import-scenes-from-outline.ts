import fs from 'fs';
import path from 'path';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { books, chapters, scenes } from '@/lib/schema';

type OutlineScene = {
  scene_number: number;
  scene_title?: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
};

type SceneBundle = {
  bookNumber: number;
  chapterNumber: number;
  scenes: OutlineScene[];
};

const OUTLINE_PATH = path.join(process.cwd(), 'data', 'l_outline.json');

const loadOutline = () => {
  const raw = fs.readFileSync(OUTLINE_PATH, 'utf-8');
  return JSON.parse(raw);
};

// Recursively collect all nodes that look like chapter entries with scenes
const collectSceneBundles = (node: unknown, acc: SceneBundle[]) => {
  if (node && typeof node === 'object') {
    // If this node has the markers we need, capture it
    const maybeChapter = node as Record<string, unknown>;
    if (
      'novel_book' in maybeChapter &&
      'all_chapter' in maybeChapter &&
      Array.isArray((maybeChapter as { scenes?: unknown }).scenes)
    ) {
      const bookNumber = Number(maybeChapter.novel_book);
      const globalChapterNumber = Number(maybeChapter.all_chapter);
      const scenesArray = (maybeChapter.scenes as OutlineScene[]) ?? [];

      if (!Number.isNaN(bookNumber) && !Number.isNaN(globalChapterNumber)) {
        // Outline uses global chapter numbering across books (40 per book).
        const chapterNumber = globalChapterNumber - 40 * (bookNumber - 1);
        acc.push({ bookNumber, chapterNumber, scenes: scenesArray });
      }
    }

    // Continue walking
    for (const value of Object.values(maybeChapter)) {
      collectSceneBundles(value, acc);
    }
  } else if (Array.isArray(node)) {
    for (const value of node) {
      collectSceneBundles(value, acc);
    }
  }
};

const upsertScene = async (chapterId: string, scene: OutlineScene) => {
  const basePayload = {
    sceneNumber: scene.scene_number,
    title: scene.scene_title ?? null,
    setup: scene.setup ?? null,
    symbolism: scene.symbolism ?? null,
    beatGoal: scene.beat_goal ?? null,
    pov: scene.pov ?? null,
    tense: scene.tense ?? null,
    core_emotion: scene.core_emotion ?? null,
    scene_tone: scene.scene_tone ?? null,
    timeline_date: scene.timeline_date ?? null,
    timeline_variant: scene.timeline_variant ?? null,
    location: scene.location ?? null,
    // Keep description in sync with setup so the UI has a short blurb
    description: scene.setup ?? null,
  };

  const existing = await db
    .select({ id: scenes.id })
    .from(scenes)
    .where(and(eq(scenes.chapterId, chapterId), eq(scenes.sceneNumber, scene.scene_number)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(scenes).set(basePayload).where(eq(scenes.id, existing[0].id));
    return 'updated';
  }

  await db.insert(scenes).values({
    chapterId,
    ...basePayload,
  });
  return 'inserted';
};

async function main() {
  const outline = loadOutline();
  const bundles: SceneBundle[] = [];
  collectSceneBundles(outline, bundles);

  let inserted = 0;
  let updated = 0;
  let skippedChapters = 0;

  for (const bundle of bundles) {
    const bookRow = await db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.bookNumber, bundle.bookNumber))
      .limit(1);

    if (bookRow.length === 0) {
      console.warn(`[IMPORT] Skipping book ${bundle.bookNumber}: not found in DB`);
      skippedChapters += 1;
      continue;
    }

    const chapterRow = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(and(eq(chapters.bookId, bookRow[0].id), eq(chapters.chapterNumber, bundle.chapterNumber)))
      .limit(1);

    if (chapterRow.length === 0) {
      console.warn(
        `[IMPORT] Skipping chapter ${bundle.chapterNumber} (book ${bundle.bookNumber}): chapter not found in DB`
      );
      skippedChapters += 1;
      continue;
    }

    for (const scene of bundle.scenes) {
      const result = await upsertScene(chapterRow[0].id, scene);
      if (result === 'inserted') inserted += 1;
      else updated += 1;
    }
  }

  console.log(`[IMPORT] Done. Inserted: ${inserted}, Updated: ${updated}, Skipped chapters: ${skippedChapters}`);
}

main().catch((error) => {
  console.error('[IMPORT] Failed to import scenes from outline:', error);
  process.exit(1);
});
