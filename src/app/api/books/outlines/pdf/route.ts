import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  books,
  chapters,
  scenes,
  learningResources,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
} from '@/lib/schema';
import { db } from '@/lib/db';
import { and, asc, eq, inArray } from 'drizzle-orm';

export const runtime = 'nodejs';

type OutlineScene = {
  id: string;
  chapterId: string;
  sceneNumber: number;
  title: string | null;
  description?: string | null;
  setup?: string | null;
  beatGoal?: string | null;
  pov?: string | null;
  location?: string | null;
  timeline_date?: string | null;
  core_emotion?: string | null;
  scene_tone?: string | null;
  internalConflict?: string | null;
  sensoryDetail?: string | null;
  symbolism?: string | null;
  characterGrowthElement?: string | null;
  temporalPowerManifested?: string | null;
  timelineSignificance?: string | null;
};

type OutlineLearningResource = {
  title: string;
  author: string | null;
  connectionPoints: Array<{ pointNumber: number; description: string }>;
  objectives: Array<{ objectiveNumber: number; description: string; bloomLevel: string | null }>;
};

type OutlineChapter = {
  id: string;
  chapterNumber: number;
  title: string | null;
  summary?: string | null;
  description?: string | null;
  focusArea?: string | null;
  tarotFamily?: string | null;
  colorTheme?: {
    name?: string | null;
    hex?: string | null;
  } | null;
  scenes: OutlineScene[];
  learningResources: OutlineLearningResource[];
};

type BookOutline = {
  id: string;
  bookNumber: number;
  title: string;
  fictionNovelTitle: string | null;
  description: string | null;
  chapters: OutlineChapter[];
};

const formatSceneForSudowrite = (scene: OutlineScene): string => {
  const elements = [`SCENE ${scene.sceneNumber}: ${scene.title || 'Untitled Scene'}`];

  if (scene.description) elements.push(`DESCRIPTION: ${scene.description}`);
  if (scene.setup) elements.push(`SETUP: ${scene.setup}`);
  if (scene.beatGoal) elements.push(`SCENE GOAL: ${scene.beatGoal}`);
  if (scene.pov) elements.push(`POV: ${scene.pov}`);
  if (scene.core_emotion) elements.push(`CORE EMOTION: ${scene.core_emotion}`);
  if (scene.scene_tone) elements.push(`TONE: ${scene.scene_tone}`);
  if (scene.location) elements.push(`LOCATION: ${scene.location}`);
  if (scene.timeline_date) elements.push(`TIMELINE: ${scene.timeline_date}`);
  if (scene.temporalPowerManifested) elements.push(`TEMPORAL POWER: ${scene.temporalPowerManifested}`);
  if (scene.characterGrowthElement) elements.push(`CHARACTER GROWTH: ${scene.characterGrowthElement}`);
  if (scene.timelineSignificance) elements.push(`TIMELINE SIGNIFICANCE: ${scene.timelineSignificance}`);
  if (scene.symbolism) elements.push(`SYMBOLISM: ${scene.symbolism}`);
  if (scene.internalConflict) elements.push(`INTERNAL CONFLICT: ${scene.internalConflict}`);
  if (scene.sensoryDetail) elements.push(`SENSORY: ${scene.sensoryDetail}`);

  return elements.join(' | ');
};

// Helper to wrap text into lines that fit within a given width
const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

const buildPdfBuffer = async (bookOutlines: BookOutline[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612; // Letter size
  const pageHeight = 792;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 14;
  const smallLineHeight = 12;

  for (const book of bookOutlines) {
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (y - requiredSpace < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    };

    // Book Title
    const bookTitle = `Book ${book.bookNumber}: ${book.fictionNovelTitle || book.title}`;
    page.drawText(bookTitle, {
      x: margin,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0.07, 0.09, 0.15),
    });
    y -= 28;

    // Book Description
    if (book.description) {
      const descLines = wrapText(book.description, 85);
      for (const line of descLines) {
        addNewPageIfNeeded(lineHeight);
        page.drawText(line, {
          x: margin,
          y,
          size: 10,
          font,
          color: rgb(0.22, 0.25, 0.32),
        });
        y -= lineHeight;
      }
    }
    y -= 16;

    // Section Header
    addNewPageIfNeeded(24);
    page.drawText('SUDOWRITE COPY-READY OUTLINE', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.06, 0.09, 0.16),
    });
    y -= 24;

    for (const chapter of book.chapters) {
      // Chapter Title
      addNewPageIfNeeded(36);
      const chapterTitle = `Chapter ${chapter.chapterNumber}: ${chapter.title || 'Untitled'}`;
      page.drawText(chapterTitle, {
        x: margin + 8,
        y,
        size: 12,
        font: boldFont,
        color: rgb(0.07, 0.09, 0.15),
      });
      y -= 18;

      // Chapter summary/description
      const chapterDesc = chapter.summary || chapter.description;
      if (chapterDesc) {
        const descLines = wrapText(chapterDesc, 80);
        for (const line of descLines) {
          addNewPageIfNeeded(smallLineHeight);
          page.drawText(line, {
            x: margin + 12,
            y,
            size: 9,
            font,
            color: rgb(0.22, 0.25, 0.32),
          });
          y -= smallLineHeight;
        }
      }

      // Focus Area / Tarot Family
      const metaParts: string[] = [];
      if (chapter.focusArea) metaParts.push(`Focus Area: ${chapter.focusArea}`);
      if (chapter.tarotFamily) metaParts.push(`Tarot Family: ${chapter.tarotFamily}`);
      if (metaParts.length) {
        addNewPageIfNeeded(smallLineHeight);
        page.drawText(metaParts.join(' • '), {
          x: margin + 12,
          y,
          size: 8,
          font,
          color: rgb(0.42, 0.45, 0.49),
        });
        y -= smallLineHeight + 4;
      }

      // Scenes
      if (chapter.scenes.length) {
        addNewPageIfNeeded(18);
        page.drawText('Scenes:', {
          x: margin + 12,
          y,
          size: 10,
          font: boldFont,
          color: rgb(0.07, 0.09, 0.15),
        });
        y -= 14;

        for (const scene of chapter.scenes) {
          const sceneText = `• ${formatSceneForSudowrite(scene)}`;
          const sceneLines = wrapText(sceneText, 78);
          for (const line of sceneLines) {
            addNewPageIfNeeded(smallLineHeight);
            page.drawText(line, {
              x: margin + 18,
              y,
              size: 8,
              font,
              color: rgb(0.06, 0.09, 0.16),
            });
            y -= smallLineHeight;
          }
        }
      }

      // Learning Resources
      if (chapter.learningResources.length) {
        y -= 6;
        addNewPageIfNeeded(18);
        page.drawText('Learning Resources:', {
          x: margin + 12,
          y,
          size: 10,
          font: boldFont,
          color: rgb(0.07, 0.09, 0.15),
        });
        y -= 14;

        for (const resource of chapter.learningResources) {
          const resourceTitle = `- ${resource.title}${resource.author ? ` (${resource.author})` : ''}`;
          addNewPageIfNeeded(smallLineHeight);
          page.drawText(resourceTitle, {
            x: margin + 18,
            y,
            size: 8,
            font,
            color: rgb(0.06, 0.09, 0.16),
          });
          y -= smallLineHeight;

          if (resource.connectionPoints?.length) {
            const points = resource.connectionPoints
              .map((p) => `${p.pointNumber}. ${p.description}`)
              .join(' | ');
            const pointsText = `Connection Points: ${points}`;
            const pointsLines = wrapText(pointsText, 75);
            for (const line of pointsLines) {
              addNewPageIfNeeded(10);
              page.drawText(line, {
                x: margin + 22,
                y,
                size: 7,
                font,
                color: rgb(0.22, 0.25, 0.32),
              });
              y -= 10;
            }
          }

          if (resource.objectives?.length) {
            const objectives = resource.objectives
              .map((o) => `${o.objectiveNumber}. ${o.description}${o.bloomLevel ? ` (${o.bloomLevel})` : ''}`)
              .join(' | ');
            const objText = `Objectives: ${objectives}`;
            const objLines = wrapText(objText, 75);
            for (const line of objLines) {
              addNewPageIfNeeded(10);
              page.drawText(line, {
                x: margin + 22,
                y,
                size: 7,
                font,
                color: rgb(0.29, 0.34, 0.39),
              });
              y -= 10;
            }
          }
        }
      }

      y -= 16; // Space between chapters
    }
  }

  return await pdfDoc.save();
};

const fetchBookOutline = async (bookRow: { id: string; bookNumber: number; title: string; fictionNovelTitle: string | null; description: string | null }): Promise<BookOutline> => {
  const bookChapters = await db
    .select({
      id: chapters.id,
      chapterNumber: chapters.chapterNumber,
      title: chapters.title,
      summary: chapters.summary,
      description: chapters.description,
      focusArea: chapters.focusArea,
      tarotFamily: chapters.tarotFamily,
      colorTheme: chapters.colorTheme,
    })
    .from(chapters)
    .where(eq(chapters.bookId, bookRow.id))
    .orderBy(asc(chapters.chapterNumber));

  const chapterIds = bookChapters.map((chapter) => chapter.id);

  const allScenes = chapterIds.length
    ? await db
      .select({
        id: scenes.id,
        chapterId: scenes.chapterId,
        sceneNumber: scenes.sceneNumber,
        title: scenes.title,
        description: scenes.description,
        setup: scenes.setup,
        beatGoal: scenes.beatGoal,
        pov: scenes.pov,
        location: scenes.location,
        timeline_date: scenes.timeline_date,
        core_emotion: scenes.core_emotion,
        scene_tone: scenes.scene_tone,
        internalConflict: scenes.internalConflict,
        sensoryDetail: scenes.sensoryDetail,
        symbolism: scenes.symbolism,
        characterGrowthElement: scenes.characterGrowthElement,
        temporalPowerManifested: scenes.temporalPowerManifested,
        timelineSignificance: scenes.timelineSignificance,
      })
      .from(scenes)
      .where(inArray(scenes.chapterId, chapterIds))
      .orderBy(asc(scenes.sceneNumber))
    : [];

  const scenesByChapter = allScenes.reduce<Map<string, OutlineScene[]>>((acc, scene) => {
    const bucket = acc.get(scene.chapterId) ?? [];
    bucket.push(scene);
    acc.set(scene.chapterId, bucket);
    return acc;
  }, new Map());

  const chaptersWithDetails: OutlineChapter[] = [];

  for (const chapter of bookChapters) {
    const learningResourcesByChapter = await db
      .select({
        id: learningResources.id,
        title: learningResources.title,
        author: learningResources.author,
      })
      .from(learningResourceChapters)
      .innerJoin(learningResources, eq(learningResourceChapters.learningResourceId, learningResources.id))
      .where(eq(learningResourceChapters.chapterId, chapter.id));

    const resourcesWithDetails: OutlineLearningResource[] = [];

    for (const resource of learningResourcesByChapter) {
      const points = await db
        .select({
          pointNumber: connectionPoints.pointNumber,
          description: connectionPoints.description,
        })
        .from(connectionPoints)
        .where(and(eq(connectionPoints.learningResourceId, resource.id), eq(connectionPoints.chapterId, chapter.id)))
        .orderBy(asc(connectionPoints.pointNumber));

      const objectives = await db
        .select({
          objectiveNumber: terminalLearningObjectives.objectiveNumber,
          description: terminalLearningObjectives.description,
          bloomLevel: terminalLearningObjectives.bloomLevel,
        })
        .from(terminalLearningObjectives)
        .where(and(eq(terminalLearningObjectives.learningResourceId, resource.id), eq(terminalLearningObjectives.chapterId, chapter.id)))
        .orderBy(asc(terminalLearningObjectives.objectiveNumber));

      resourcesWithDetails.push({
        title: resource.title,
        author: resource.author,
        connectionPoints: points,
        objectives,
      });
    }

    chaptersWithDetails.push({
      ...chapter,
      colorTheme: chapter.colorTheme as OutlineChapter['colorTheme'],
      scenes: scenesByChapter.get(chapter.id) || [],
      learningResources: resourcesWithDetails,
    });
  }

  return {
    id: bookRow.id,
    bookNumber: bookRow.bookNumber,
    title: bookRow.title,
    fictionNovelTitle: bookRow.fictionNovelTitle,
    description: bookRow.description,
    chapters: chaptersWithDetails,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookIdFilter = searchParams.get('bookId');
    const bookNumberFilter = searchParams.get('bookNumber');

    const allBooks = await db
      .select({
        id: books.id,
        bookNumber: books.bookNumber,
        title: books.title,
        fictionNovelTitle: books.fictionNovelTitle,
        description: books.description,
      })
      .from(books)
      .orderBy(asc(books.bookNumber));

    const filteredBooks = allBooks.filter((book) => {
      if (bookIdFilter && book.id !== bookIdFilter) return false;
      if (bookNumberFilter && Number(bookNumberFilter) !== book.bookNumber) return false;
      return true;
    });

    const booksToUse = filteredBooks.length > 0 ? filteredBooks : allBooks;

    if (booksToUse.length === 0) {
      return new NextResponse('No books found', { status: 404 });
    }

    const outlines: BookOutline[] = [];
    for (const book of booksToUse) {
      const outline = await fetchBookOutline(book);
      outlines.push(outline);
    }

    const pdfBytes = await buildPdfBuffer(outlines);

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="epic-arcana-sudowrite-outline.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating outline PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
