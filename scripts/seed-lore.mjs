import { promises as fs } from 'fs';
import path from 'path';
import { db } from '../src/lib/db.ts';
import {
  novelSeries,
  books,
  chapters,
  taskGroups,
  timelineEvents,
  characters,
  trionfiCards,
  locations,
  symbolicObjects,
  militaryOrders,
  zanettiTrainComponents,
  temporalStations,
  temporalTechnology,
  temporalEconomy,
  temporalLaw,
  temporalEducation,
  characterAffinities,
  uniqueCombinations,
  uniqueCombinationCards,
  characterArcs,
  characterTriumphMapping,
  storyGaps,
  characterThematicElements,
  sceneTimelineMapping,
  historicalCharacterMapping,
  timelineDivergencePoints,
  scenes,
} from '../src/lib/schema.ts';
import { eq, asc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const LORE_PATH = path.join(process.cwd(), 'lore', 'json');

async function loadJSON(filePath: string): Promise<any> {
  const data = await fs.readFile(filePath, 'utf-8');
  if (filePath.endsWith('laurasia_outline.json')) {
    const splitMarker = '}\n}\n\n\n\n{';
    if (data.includes(splitMarker)) {
      const parts = data.split(splitMarker);
      return JSON.parse(parts[0] + '}\n}');
    }
  }
  return JSON.parse(data);
}

async function seedNovelSeries(db: NodePgDatabase<typeof import('../src/lib/schema.ts')>, seriesData: any): Promise<string> {
  console.log('Seeding novel series...');
  await db.delete(novelSeries);
  const result = await db.insert(novelSeries).values({
    title: seriesData.title,
    tagline: seriesData.tagline,
    logline: seriesData.logline,
    synopsis: seriesData.synopsis,
    secondarySynopsis: seriesData.secondary_synopsis,
    description: seriesData.description,
    summary: seriesData.summary,
    genres: seriesData.genres,
    themes: seriesData.themes,
    keyThemes: seriesData.keythemes,
    positioning: seriesData.positioning,
    tone: seriesData.tone,
    style: seriesData.style,
    targetAudience: seriesData.target_audience,
    keywords: seriesData.keywords,
    tropes: seriesData.tropes,
    coverThemeConcepts: seriesData.cover_theme_concepts,
    settings: seriesData.Setting,
  }).returning({ id: novelSeries.id });
  console.log('Novel series seeded.');
  return result[0].id;
}

async function seedBooksAndChapters(db: NodePgDatabase<typeof import('../src/lib/schema.ts')>, seriesId: string, booksData: any, seriesStructure: any) {
  console.log('Seeding books and chapters...');
  await db.delete(books);
  await db.delete(chapters);

  for (const [bookKey, bookData] of Object.entries(booksData)) {
    const bookNumber = parseInt((bookKey as string).replace('Book', ''));
    const triumphInfo = seriesStructure[bookNumber - 1] || '';
    const triumph = triumphInfo.split('(')[1]?.replace(')', '') || 'Unknown';

    const insertedBook = await db.insert(books).values({
      seriesId: seriesId,
      bookNumber: bookNumber,
      uniqueIdentifier: (bookData as any).unique_identifier,
      title: (bookData as any).title,
      fictionNovelTitle: (bookData as any).fiction_novel_title,
      subject: (bookData as any).subject,
      focus: (bookData as any).focus,
      tagline: (bookData as any).tagline,
      logline: (bookData as any).logline,
      description: (bookData as any).description,
      themes: (bookData as any).themes,
      keyThemes: (bookData as any).key_themes,
      triumph: triumph,
      militaryComponent: (bookData as any).military_component,
      businessModel: (bookData as any).business_model_generation,
      personalityType: (bookData as any).personality_type,
      enneagramType: (bookData as any).ennegram_name,
      enneagramDescription: (bookData as any).ennegram_description,
      coveryCoveyHabit: (bookData as any)['9_habits_covey'],
      associatedSin: (bookData as any).sin,
    }).returning({ id: books.id });

    const bookId = insertedBook[0].id;

    if ((bookData as any).task_masters) {
      for (const taskMaster of Object.values((bookData as any).task_masters)) {
        const processMajorGroup = async (majorGroup: any) => {
          if (majorGroup.Specific_task_groups) {
            for (const specificTaskGroup of Object.values(majorGroup.Specific_task_groups)) {
              await db.insert(chapters).values({
                bookId: bookId,
                chapterNumber: parseInt((specificTaskGroup as any).chapter.replace('Chapter ', '')),
                uniqueIdentifier: (specificTaskGroup as any).unique_identifier,
                title: (specificTaskGroup as any).specific_task_group_title,
                focus: (specificTaskGroup as any).focus_area,
                epicNovelPages: (specificTaskGroup as any).epic_novel_pages,
                epicChapterFocus: (specificTaskGroup as any).epic_chapter_focus,
                epicNovelChapterFocus: (specificTaskGroup as any).epic_novel_chapter_focus,
                epicNovelSectionName: (specificTaskGroup as any).epic_novel_section_name,
                description: (specificTaskGroup as any).specific_task_group_description,
                tarotCardLink: (specificTaskGroup as any).tarot_card_link,
                tarotFamily: (specificTaskGroup as any).tarot_family,
                tarotCardItem: (specificTaskGroup as any).tarot_card_item,
                colorTheme: {
                  name: (specificTaskGroup as any).color_name,
                  hex: (specificTaskGroup as any).hex_code,
                  rgb: [(specificTaskGroup as any).red, (specificTaskGroup as any).green, (specificTaskGroup as any).blue]
                }
              });
            }
          }
        };

        if ((taskMaster as any).major_task_groups) {
          for (const majorTaskGroup of Object.values((taskMaster as any).major_task_groups)) {
            await processMajorGroup(majorTaskGroup);
          }
        }
        
        for (const key in (taskMaster as any)) {
            if (key.startsWith('major_activity_theme_')) {
                await processMajorGroup((taskMaster as any)[key]);
            }
        }
      }
    }
  }
  console.log('Books and chapters seeded.');
}


async function seedTaskGroups(db: NodePgDatabase<typeof import('../src/lib/schema.ts')>, booksData: any) {
    console.log('Seeding task groups (story outline)...');
    await db.delete(taskGroups);

    const allBooks = await db.select().from(books);

    for (const book of allBooks) {
        const bookData = booksData[`Book${book.bookNumber}`];
        if (!bookData || !bookData.task_masters) continue;

        for (const taskMaster of Object.values(bookData.task_masters)) {
            const insertedTaskMaster = await db.insert(taskGroups).values({
                uniqueIdentifier: (taskMaster as any).unique_identifier,
                type: (taskMaster as any).type,
                title: (taskMaster as any).title,
                description: (taskMaster as any).description,
                tagline: (taskMaster as any).tagline,
            }).returning({ id: taskGroups.id });
            const taskMasterId = insertedTaskMaster[0].id;

            if ((taskMaster as any).major_task_groups) {
                for (const majorTaskGroup of Object.values((taskMaster as any).major_task_groups)) {
                    const isActivityTheme = (majorTaskGroup as any).type === 'Major Activity Theme';
                    const title = isActivityTheme ? (majorTaskGroup as any).specific_task_group_title : (majorTaskGroup as any).major_task_group_title;
                    const description = isActivityTheme ? (majorTaskGroup as any).specific_task_group_description : (majorTaskGroup as any).major_task_group_description;
                    const tagline = isActivityTheme ? (majorTaskGroup as any).specific_task_group_tagline : (majorTaskGroup as any).major_task_group_tagline;
                    const influencedByBooks = isActivityTheme ? (majorTaskGroup as any).specific_task_group_books_influenced_by : (majorTaskGroup as any).major_task_group_books_influenced_by;

                    const insertedMajorTaskGroup = await db.insert(taskGroups).values({
                        parentTaskGroupId: taskMasterId,
                        uniqueIdentifier: (majorTaskGroup as any).unique_identifier,
                        type: (majorTaskGroup as any).type,
                        title: title || 'Untitled',
                        description: description || '',
                        tagline: tagline || '',
                        influencedByBooks: influencedByBooks,
                    }).returning({ id: taskGroups.id });
                    const majorTaskGroupId = insertedMajorTaskGroup[0].id;

                    if ((majorTaskGroup as any).Specific_task_groups) {
                        for (const specificTaskGroup of Object.values((majorTaskGroup as any).Specific_task_groups)) {
                            const chapter = await db.query.chapters.findFirst({
                                where: eq(chapters.uniqueIdentifier, (specificTaskGroup as any).unique_identifier)
                            });

                            await db.insert(taskGroups).values({
                                parentTaskGroupId: majorTaskGroupId,
                                chapterId: chapter?.id,
                                uniqueIdentifier: (specificTaskGroup as any).unique_identifier,
                                type: (specificTaskGroup as any).type,
                                title: (specificTaskGroup as any).specific_task_group_title || 'Untitled',
                                description: (specificTaskGroup as any).specific_task_group_description || '',
                                tagline: (specificTaskGroup as any).specific_task_group_tagline || '',
                                focusArea: (specificTaskGroup as any).focus_area,
                                connectionToMajorTaskGroup: (specificTaskGroup as any).connection_to_the_major_task_group,
                                influencedByBooks: (specificTaskGroup as any).specific_task_group_books_influenced_by,
                                learningObjectives: (specificTaskGroup as any).terminal_learning_objectives,
                            });
                        }
                    }
                }
            }
        }
    }
    console.log('Task groups seeded.');
}


async function seed() {
  try {
    const outlineData = await loadJSON(path.join(LORE_PATH, 'storyline', 'laurasia_outline.json'));
    const seriesData = outlineData.epic_novel_series;

    // Clear all data first in reverse order of dependency
    console.log('Clearing old data...');
    await db.delete(taskGroups);
    await db.delete(scenes);
    await db.delete(characterArcs);
    await db.delete(chapters);
    await db.delete(books);
    await db.delete(novelSeries);
    console.log('Old data cleared.');

    const seriesId = await seedNovelSeries(db, seriesData);
    await seedBooksAndChapters(db, seriesId, seriesData.Books, seriesData.series_structure);
    await seedTaskGroups(db, seriesData.Books);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:');
    console.error(error);
    process.exit(1);
  }
}

seed();
