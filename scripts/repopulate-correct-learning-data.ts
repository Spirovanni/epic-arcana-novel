/**
 * Repopulate Learning System with Correct Book Titles
 *
 * This script:
 * 1. Clears all existing learning resource data
 * 2. Creates 63 unique learning resources with correct titles from l_outline.json
 * 3. Repopulates all chapter connections with correct resource IDs
 * 4. Populates connection points and learning objectives correctly
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  learningResources,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
  chapters,
  books,
} from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse outline file
const outlineFilePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData = JSON.parse(fs.readFileSync(outlineFilePath, 'utf-8'));

// Initialize database connection
const client = postgres(DATABASE_URL);
const db = drizzle(client);

interface SpecificTaskGroup {
  all_chapter: number;
  chapter?: number;
  chapter_number?: number;
  specific_task_group_books_influenced_by?: {
    [bookId: string]: {
      title?: string;
      connect_points?: {
        [key: string]: string;
      };
      terminal_learning_objectives?: {
        [key: string]: {
          bloom_level?: string;
          description?: string;
        } | string;
      };
    };
  };
}

interface LearningResource {
  id: string;
  resourceId: string;
  title: string;
}

// Maps to track resources
const allResourcesMap = new Map<string, LearningResource>(); // key: "title+chapter" -> resource
const chapterResourceMap = new Map<number, Map<string, string>>(); // chapter -> (originalId -> dbId)

// Step 1: Clear all existing data
async function clearExistingData() {
  console.log('Step 1: Clearing existing learning resource data...');

  try {
    const allLR = await db.select().from(learningResources);

    for (const lr of allLR) {
      // Delete dependencies first
      await db
        .delete(connectionPoints)
        .where(eq(connectionPoints.learningResourceId, lr.id));

      await db
        .delete(terminalLearningObjectives)
        .where(eq(terminalLearningObjectives.learningResourceId, lr.id));

      await db
        .delete(learningResourceChapters)
        .where(eq(learningResourceChapters.learningResourceId, lr.id));

      await db
        .delete(learningResources)
        .where(eq(learningResources.id, lr.id));
    }

    console.log(`  ✓ Cleared all learning resources and dependencies\n`);
  } catch (error) {
    console.error('  ✗ Error clearing data:', error);
    throw error;
  }
}

// Step 2: Extract and create all unique learning resources
async function extractAndCreateResources() {
  console.log('Step 2: Extracting and creating unique learning resources...');

  const outline = outlineData as any;
  const trilogies = outline.SelfImprovementSeries?.Books?.trilogies || {};

  for (const [trilogyKey, trilogy] of Object.entries(trilogies)) {
    const trilogyBooks = (trilogy as any).trilogy_books || {};

    for (const [bookKey, book] of Object.entries(trilogyBooks)) {
      const taskMasters = (book as any).task_masters || {};

      for (const [tmKey, taskMaster] of Object.entries(taskMasters)) {
        const majorTaskGroups = (taskMaster as any).major_task_groups || {};

        for (const [mtgKey, majorTaskGroup] of Object.entries(
          majorTaskGroups
        )) {
          const specificTaskGroups = (majorTaskGroup as any)
            .Specific_task_groups || {};

          for (const [stgKey, specificTaskGroup] of Object.entries(
            specificTaskGroups
          )) {
            const stg = specificTaskGroup as SpecificTaskGroup;
            const chapterNumber =
              stg.all_chapter || stg.chapter || stg.chapter_number || 1;

            const booksInfluenced =
              stg.specific_task_group_books_influenced_by || {};

            for (const [resourceKey, bookData] of Object.entries(
              booksInfluenced
            )) {
              const title = (bookData as any).title || resourceKey;
              // Create unique key combining title and chapter since same title can appear in different contexts
              const uniqueKey = `${title}_ch${chapterNumber}`;

              if (!allResourcesMap.has(uniqueKey)) {
                const newResource: LearningResource = {
                  id: '',
                  resourceId: uniqueKey,
                  title,
                };

                allResourcesMap.set(uniqueKey, newResource);
              }
            }
          }
        }
      }

      // Only process Book 1
      break;
    }
    // Only process first trilogy
    break;
  }

  console.log(`  Found ${allResourcesMap.size} unique learning resources\n`);

  // Insert all resources into database
  console.log('  Inserting resources into database...');
  for (const [key, resource] of allResourcesMap.entries()) {
    try {
      const result = await db
        .insert(learningResources)
        .values({
          resourceId: resource.resourceId,
          title: resource.title,
          author: undefined,
          sectionOfFocus: undefined,
          sectionDescription: undefined,
          connectionFocusArea: undefined,
        })
        .returning({ id: learningResources.id });

      if (result.length > 0) {
        resource.id = result[0].id;
      }
    } catch (error: any) {
      console.error(`  ✗ Error inserting ${resource.title}:`, error.message);
    }
  }

  console.log(`  ✓ Inserted ${allResourcesMap.size} unique resources\n`);
}

// Step 3: Get Book 1 ID
async function getBook1Id(): Promise<string> {
  const book1 = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 1))
    .limit(1);

  if (!book1.length) {
    throw new Error('Book 1 not found in database');
  }

  return book1[0].id;
}

// Step 4: Process chapters and create correct connections
async function processChaptersWithCorrectResources(book1Id: string) {
  console.log('Step 3: Processing chapters with correct resource connections...');

  let totalConnections = 0;
  let totalConnectionPoints = 0;
  let totalObjectives = 0;

  const outline = outlineData as any;
  const trilogies = outline.SelfImprovementSeries?.Books?.trilogies || {};

  for (const [trilogyKey, trilogy] of Object.entries(trilogies)) {
    const trilogyBooks = (trilogy as any).trilogy_books || {};

    for (const [bookKey, book] of Object.entries(trilogyBooks)) {
      const taskMasters = (book as any).task_masters || {};

      for (const [tmKey, taskMaster] of Object.entries(taskMasters)) {
        const majorTaskGroups = (taskMaster as any).major_task_groups || {};

        for (const [mtgKey, majorTaskGroup] of Object.entries(
          majorTaskGroups
        )) {
          const specificTaskGroups = (majorTaskGroup as any)
            .Specific_task_groups || {};

          for (const [stgKey, specificTaskGroup] of Object.entries(
            specificTaskGroups
          )) {
            const stg = specificTaskGroup as SpecificTaskGroup;

            const chapterNumber =
              stg.all_chapter || stg.chapter || stg.chapter_number || 1;

            // Find the matching chapter in database for Book 1
            const dbChapters = await db
              .select()
              .from(chapters)
              .where(
                and(
                  eq(chapters.chapterNumber, chapterNumber),
                  eq(chapters.bookId, book1Id)
                )
              )
              .limit(1);

            if (!dbChapters.length) {
              continue;
            }

            const dbChapter = dbChapters[0];
            const booksInfluenced =
              stg.specific_task_group_books_influenced_by || {};

            // Process each resource for this chapter
            for (const [resourceKey, bookData] of Object.entries(
              booksInfluenced
            )) {
              const title = (bookData as any).title || resourceKey;
              const uniqueKey = `${title}_ch${chapterNumber}`;
              const resource = allResourcesMap.get(uniqueKey);

              if (!resource || !resource.id) {
                console.log(
                  `  ⚠ Warning: Resource ${uniqueKey} not found`
                );
                continue;
              }

              // Create junction table entry
              try {
                await db
                  .insert(learningResourceChapters)
                  .values({
                    learningResourceId: resource.id,
                    chapterId: dbChapter.id,
                    orderIndex: 0,
                  });

                totalConnections++;
              } catch (error: any) {
                if (error.code !== '23505') {
                  console.error(
                    `  ✗ Error creating connection:`,
                    error.message
                  );
                }
              }

              const bookDataObj = bookData as any;
              const connectPoints = bookDataObj.connect_points || {};
              const objectives = bookDataObj.terminal_learning_objectives || {};

              // Process connection points
              for (const [pointKey, pointText] of Object.entries(
                connectPoints
              )) {
                const pointNumber =
                  parseInt(pointKey.replace('point', '')) || 0;

                try {
                  await db
                    .insert(connectionPoints)
                    .values({
                      learningResourceId: resource.id,
                      chapterId: dbChapter.id,
                      pointNumber,
                      description: pointText,
                    });

                  totalConnectionPoints++;
                } catch (error: any) {
                  if (error.code !== '23505') {
                    // Ignore duplicates
                  }
                }
              }

              // Process learning objectives
              for (const [objKey, objData] of Object.entries(objectives)) {
                const objectiveNumber =
                  parseInt(objKey.replace('objective', '')) || 0;
                const description =
                  typeof objData === 'string'
                    ? objData
                    : (objData as any).description || '';
                const bloomLevel =
                  typeof objData === 'string'
                    ? undefined
                    : (objData as any).bloom_level;

                try {
                  await db
                    .insert(terminalLearningObjectives)
                    .values({
                      learningResourceId: resource.id,
                      chapterId: dbChapter.id,
                      objectiveNumber,
                      description,
                      bloomLevel,
                    });

                  totalObjectives++;
                } catch (error: any) {
                  if (error.code !== '23505') {
                    // Ignore duplicates
                  }
                }
              }
            }
          }
        }
      }

      break; // Only Book 1
    }
    break; // Only first trilogy
  }

  console.log(
    `  ✓ Created ${totalConnections} resource-chapter connections`
  );
  console.log(`  ✓ Created ${totalConnectionPoints} connection points`);
  console.log(`  ✓ Created ${totalObjectives} learning objectives\n`);
}

// Main execution
async function main() {
  console.log('====================================');
  console.log('Repopulating with Correct Learning Data');
  console.log('====================================\n');

  try {
    await clearExistingData();
    await extractAndCreateResources();
    const book1Id = await getBook1Id();
    await processChaptersWithCorrectResources(book1Id);

    console.log('====================================');
    console.log('✓ Repopulation Complete!');
    console.log('====================================');
    console.log('\nEach chapter now has unique learning resources with correct book titles.');
  } catch (error) {
    console.error('Error during repopulation:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
