import { db } from './src/lib/db';
import { chapters, books, chapterPages, majorTaskGroups, taskMasters, characterArcs, characters } from './src/lib/schema';
import { eq, asc, and, sql } from 'drizzle-orm';

async function debugAPIRoute(chapterId: string) {
  console.log(`=== DEBUGGING API ROUTE FOR CHAPTER ID: ${chapterId} ===`);
  
  try {
    console.log('1. Testing main chapter query...');
    
    // Get chapter with book information (exactly like the API)
    const chapterData = await db
      .select({
        chapter: chapters,
        book: books
      })
      .from(chapters)
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(chapters.id, chapterId))
      .limit(1);
    
    console.log(`   Query returned ${chapterData.length} results`);
    
    if (chapterData.length === 0) {
      console.log('❌ No chapter found - API would return 404');
      console.log('   Let me check if this chapter ID exists at all...');
      
      const directCheck = await db.select().from(chapters).where(eq(chapters.id, chapterId));
      console.log(`   Direct chapter check: ${directCheck.length} results`);
      
      if (directCheck.length > 0) {
        console.log('   Chapter exists but join failed');
        console.log('   Chapter data:', directCheck[0]);
      } else {
        console.log('   Chapter ID does not exist in database');
      }
      return;
    }

    const { chapter, book } = chapterData[0];
    console.log('✅ Chapter and book found successfully');
    console.log(`   Chapter: ${chapter.title} (${chapter.chapterNumber})`);
    console.log(`   Book: ${book?.title} (${book?.bookNumber})`);
    
    console.log('\n2. Testing major task group query...');
    let majorTaskGroupData = null;
    if (chapter.majorTaskGroupId) {
      console.log(`   Chapter has majorTaskGroupId: ${chapter.majorTaskGroupId}`);
      const majorTaskGroupResult = await db
        .select({
          majorTaskGroup: majorTaskGroups,
          taskMaster: taskMasters
        })
        .from(majorTaskGroups)
        .leftJoin(taskMasters, eq(majorTaskGroups.taskMasterId, taskMasters.id))
        .where(eq(majorTaskGroups.id, chapter.majorTaskGroupId))
        .limit(1);
      
      console.log(`   Major task group query returned ${majorTaskGroupResult.length} results`);
      if (majorTaskGroupResult.length > 0) {
        majorTaskGroupData = majorTaskGroupResult[0];
        console.log(`   Found: ${majorTaskGroupData.majorTaskGroup?.title}`);
      }
    } else {
      console.log('   Chapter has no majorTaskGroupId');
    }

    console.log('\n3. Testing chapter pages query...');
    const pages = await db
      .select()
      .from(chapterPages)
      .where(eq(chapterPages.chapterId, chapterId))
      .orderBy(asc(chapterPages.pageNumber));

    console.log(`   Found ${pages.length} pages`);

    console.log('\n4. Testing character arcs query...');
    const characterArcsData = await db
      .select({
        character: characters,
        arc: characterArcs
      })
      .from(characterArcs)
      .leftJoin(characters, eq(characterArcs.characterId, characters.id));

    console.log(`   Found ${characterArcsData.length} character arc entries`);

    console.log('\n✅ All API route queries completed successfully');
    console.log('   This suggests the API route logic should work');
    
    // Test the actual response structure
    const response = {
      chapter: {
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.specificTaskGroupDescription || chapter.description,
        focus: chapter.focus,
        focusArea: chapter.focusArea,
        tagline: chapter.specificTaskGroupTagline,
        epicNovelPages: chapter.epicNovelPages,
        epicChapterFocus: chapter.epicChapterFocus,
        epicNovelChapterFocus: chapter.epicNovelChapterFocus,
        epicNovelSectionName: chapter.epicNovelSectionName,
        tarotCardLink: chapter.tarotCardLink,
        tarotFamily: chapter.tarotFamily,
        tarotCardItem: chapter.tarotCardItem,
        connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup,
        terminalLearningObjectives: chapter.terminalLearningObjectives,
        booksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy,
        colorTheme: {
          name: chapter.colorName,
          hex: chapter.hexCode,
          rgb: [chapter.red, chapter.green, chapter.blue]
        },
        iconPath: chapter.iconPath
      },
      book,
      majorTaskGroup: majorTaskGroupData?.majorTaskGroup || null,
      taskMaster: majorTaskGroupData?.taskMaster || null,
      scenes: [],
      taskGroups: {
        major: [],
        specific: [],
        all: []
      },
      pages,
      characterGuidance: [],
      stats: {
        sceneCount: 0,
        taskGroupCount: 0,
        majorTaskGroupCount: majorTaskGroupData ? 1 : 0,
        specificTaskGroupCount: 0,
        pageCount: pages.length,
        wordCount: 0,
        characterArcsCount: 0
      }
    };
    
    console.log('\n📊 Response structure created successfully');
    console.log(`   Response keys: ${Object.keys(response).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error in API route debugging:', error);
    console.error('   Error type:', error.constructor.name);
    console.error('   Error message:', error.message);
    if (error.stack) {
      console.error('   Stack trace:', error.stack);
    }
  }
}

// Test with the known chapter ID
const testChapterId = '0bae977b-6bcb-4390-9a01-a01f62799dd9';
debugAPIRoute(testChapterId).then(() => {
  console.log('\n=== Debug complete ===');
  process.exit(0);
}).catch(err => {
  console.error('Debug failed:', err);
  process.exit(1);
});