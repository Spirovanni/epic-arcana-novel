/**
 * Populate Learning System Tables for Book 1
 *
 * This script parses l_outline.json and populates learning resources for all Book 1 chapters:
 * - learning_resource_chapters: Junction table (resource to chapter)
 * - connection_points: Individual connection points
 * - terminal_learning_objectives: Individual learning objectives
 *
 * It reuses existing learning resources (book1, book2, book3) that are already in the database.
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

// Map to cache learning resources
const resourcesMap = new Map<string, LearningResource>();

// Step 1: Fetch existing learning resources from database
async function fetchExistingResources() {
  console.log('Step 1: Fetching existing learning resources from database...');

  try {
    const existingResources = await db.select().from(learningResources);

    for (const resource of existingResources) {
      resourcesMap.set(resource.resourceId, {
        id: resource.id,
        resourceId: resource.resourceId,
        title: resource.title || '',
      });
      console.log(
        `  ✓ Found: ${resource.resourceId} (ID: ${resource.id}, Title: ${resource.title})`
      );
    }

    console.log(`Total resources found: ${resourcesMap.size}\n`);
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

// Step 2: Get Book 1 ID from database
async function getBook1Id(): Promise<string> {
  console.log('Step 2: Getting Book 1 ID from database...');

  try {
    const book1 = await db
      .select()
      .from(books)
      .where(eq(books.bookNumber, 1))
      .limit(1);

    if (!book1.length) {
      throw new Error('Book 1 not found in database');
    }

    console.log(`  ✓ Book 1 ID: ${book1[0].id}\n`);
    return book1[0].id;
  } catch (error) {
    console.error('Error getting Book 1:', error);
    throw error;
  }
}

// Step 3: Process Book 1 chapters and create connections
async function processBook1Chapters(book1Id: string) {
  console.log('Step 3: Processing Book 1 chapters and creating connections...');

  let totalConnections = 0;
  let totalConnectionPoints = 0;
  let totalObjectives = 0;

  const outline = outlineData as any;
  const trilogies = outline.SelfImprovementSeries?.Books?.trilogies || {};

  // Navigate to Book 1 (first book)
  for (const [trilogyKey, trilogy] of Object.entries(trilogies)) {
    const trilogyBooks = (trilogy as any).trilogy_books || {};

    // Get first book (Book 1)
    const firstBookKey = Object.keys(trilogyBooks)[0];
    if (!firstBookKey) {
      console.log('  ⚠ Warning: No books found in trilogy');
      continue;
    }

    const book = trilogyBooks[firstBookKey];
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

          // Determine chapter number - try multiple fields
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
            // Skip chapters not in Book 1
            continue;
          }

          const dbChapter = dbChapters[0];
          const booksInfluenced =
            stg.specific_task_group_books_influenced_by || {};

          // Process each resource for this chapter
          for (const [resourceKey, bookData] of Object.entries(
            booksInfluenced
          )) {
            const resource = resourcesMap.get(resourceKey);
            if (!resource || !resource.id) {
              console.log(
                `  ⚠ Warning: Resource ${resourceKey} not found in database`
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
                // Ignore duplicate errors
                console.error(
                  `  ✗ Error creating connection for chapter ${chapterNumber}:`,
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

    // Only process the first trilogy (Book 1)
    break;
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
  console.log('Book 1 Learning System Data Population');
  console.log('====================================\n');

  try {
    await fetchExistingResources();
    const book1Id = await getBook1Id();
    await processBook1Chapters(book1Id);

    console.log('====================================');
    console.log('✓ Population Complete!');
    console.log('====================================');
  } catch (error) {
    console.error('Error during population:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
