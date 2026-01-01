import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
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
  primaryTarotCard?: string | null;
  internalConflict?: string | null;
  sensoryDetail?: string | null;
  symbolism?: string | null;
  tarotSymbolism?: string | null;
  tarotNarrativeRole?: string | null;
  heroJourneyStage?: string | null;
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
  if (scene.primaryTarotCard) elements.push(`TAROT CARD: ${scene.primaryTarotCard}`);
  if (scene.symbolism) elements.push(`SYMBOLISM: ${scene.symbolism}`);
  if (scene.internalConflict) elements.push(`INTERNAL CONFLICT: ${scene.internalConflict}`);
  if (scene.sensoryDetail) elements.push(`SENSORY: ${scene.sensoryDetail}`);

  return elements.join(' | ');
};

const buildPdfBuffer = async (bookOutlines: BookOutline[]): Promise<Buffer> => {
  return await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, autoFirstPage: false });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    bookOutlines.forEach((book) => {
      doc.addPage();

      doc.fontSize(20).fillColor('#111827').text(`Book ${book.bookNumber}: ${book.fictionNovelTitle || book.title}`, {
        align: 'left',
      });
      doc.moveDown(0.35);

      if (book.description) {
        doc.fontSize(11).fillColor('#374151').text(book.description, { width: 500 });
      } else {
        doc.fontSize(11).fillColor('#6b7280').text('No description available.', { width: 500 });
      }

      doc.moveDown(0.75);
      doc.fontSize(14).fillColor('#0f172a').text('Sudowrite Copy-Ready Outline', { underline: true });
      doc.moveDown(0.5);

      book.chapters.forEach((chapter) => {
        doc.fontSize(14).fillColor('#111827').text(`Chapter ${chapter.chapterNumber}: ${chapter.title || 'Untitled'}`, {
          indent: 8,
        });

        if (chapter.summary || chapter.description) {
          doc
            .fontSize(11)
            .fillColor('#374151')
            .text(chapter.summary || chapter.description || '', { indent: 12, width: 500 });
        }

        if (chapter.focusArea || chapter.tarotFamily) {
          const meta = [
            chapter.focusArea ? `Focus Area: ${chapter.focusArea}` : null,
            chapter.tarotFamily ? `Tarot Family: ${chapter.tarotFamily}` : null,
          ]
            .filter(Boolean)
            .join(' • ');
          if (meta) {
            doc.fontSize(10).fillColor('#6b7280').text(meta, { indent: 12 });
          }
        }

        if (chapter.scenes.length) {
          doc.moveDown(0.3);
          doc.fontSize(12).fillColor('#111827').text('Scenes', { indent: 12 });
          chapter.scenes.forEach((scene) => {
            doc
              .fontSize(10)
              .fillColor('#0f172a')
              .text(`• ${formatSceneForSudowrite(scene)}`, { indent: 18, width: 500 });
          });
        }

        if (chapter.learningResources.length) {
          doc.moveDown(0.3);
          doc.fontSize(12).fillColor('#111827').text('Learning Resources', { indent: 12 });

          chapter.learningResources.forEach((resource) => {
            doc
              .fontSize(10)
              .fillColor('#0f172a')
              .text(`- ${resource.title}${resource.author ? ` (${resource.author})` : ''}`, { indent: 18, width: 500 });

            if (resource.connectionPoints?.length) {
              const points = resource.connectionPoints
                .map((point) => `${point.pointNumber}. ${point.description}`)
                .join(' | ');
              doc.fontSize(9.5).fillColor('#374151').text(`Connection Points: ${points}`, { indent: 22, width: 500 });
            }

            if (resource.objectives?.length) {
              const objectives = resource.objectives
                .map((obj) => `${obj.objectiveNumber}. ${obj.description}${obj.bloomLevel ? ` (${obj.bloomLevel})` : ''}`)
                .join(' | ');
              doc.fontSize(9.5).fillColor('#4b5563').text(`Objectives: ${objectives}`, { indent: 22, width: 500 });
            }
          });
        }

        doc.moveDown(0.8);
      });
    });

    doc.end();
  });
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
          primaryTarotCard: scenes.primaryTarotCard,
          internalConflict: scenes.internalConflict,
          sensoryDetail: scenes.sensoryDetail,
          symbolism: scenes.symbolism,
          tarotSymbolism: scenes.tarotSymbolism,
          tarotNarrativeRole: scenes.tarotNarrativeRole,
          heroJourneyStage: scenes.heroJourneyStage,
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

    const pdfBuffer = await buildPdfBuffer(outlines);

    return new NextResponse(pdfBuffer, {
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

