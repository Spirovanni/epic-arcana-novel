import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books, scenes, taskGroups } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Define more specific types based on the schema
type Chapter = typeof chapters.$inferSelect;
type Book = typeof books.$inferSelect;
type Scene = typeof scenes.$inferSelect;
type TaskGroup = typeof taskGroups.$inferSelect;

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    
    // Get comprehensive chapter data
    const chapterData = await db
      .select({
        chapter: chapters,
        book: books
      })
      .from(chapters)
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(chapters.id, chapterId))
      .limit(1);
    
    if (chapterData.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    const { chapter, book } = chapterData[0];
    
    // Get scenes and task groups for context
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId));

    const chapterTaskGroups = await db
      .select()
      .from(taskGroups)
      .where(eq(taskGroups.chapterId, chapterId));

    // Generate AI writing prompts based on story data
    const prompts = generateWritingPrompts(chapter, book, chapterScenes, chapterTaskGroups);

    return NextResponse.json({ prompts });
  } catch (error) {
    const { chapterId } = await params;
    console.error(`Error generating AI prompts for chapter ${chapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function generateWritingPrompts(chapter: Chapter, book: Book, chapterScenes: Scene[], chapterTaskGroups: TaskGroup[]) {
  const prompts = [];

  // Story Structure Prompts
  prompts.push({
    category: 'Story Structure',
    title: 'Chapter Opening',
    prompt: `Write an opening for Chapter ${chapter.chapterNumber}: "${chapter.title}". This chapter focuses on ${chapter.focus}. The chapter is part of ${book.title} which deals with ${book.subject}. Set the scene according to the chapter's description: ${chapter.description}. The overall triumph theme is ${book.triumph}.`
  });

  prompts.push({
    category: 'Story Structure',
    title: 'Chapter Closing',
    prompt: `Write a compelling ending for Chapter ${chapter.chapterNumber}: "${chapter.title}". This chapter should conclude the focus on ${chapter.focus} while setting up anticipation for the next chapter. Consider the chapter's epic novel section: ${chapter.epicNovelSectionName}.`
  });

  // Tarot-Based Prompts
  if (chapter.tarotFamily && chapter.tarotCardItem) {
    prompts.push({
      category: 'Tarot Integration',
      title: 'Tarot Symbolism',
      prompt: `Incorporate the symbolism of ${chapter.tarotCardItem} from the ${chapter.tarotFamily} family into this scene. The tarot connection is: ${chapter.tarotCardLink}. Weave these mystical elements naturally into the narrative while maintaining the story's historical Renaissance setting.`
    });
  }

  // Scene-Based Prompts
  chapterScenes.forEach((scene) => {
    if (scene.heroJourneyStage) {
      prompts.push({
        category: 'Scene Development',
        title: `Scene ${scene.sceneNumber}: ${scene.title}`,
        prompt: `Write Scene ${scene.sceneNumber} titled "${scene.title}". This scene represents the ${scene.heroJourneyStage} stage of the hero's journey. Focus: ${scene.focus}. ${scene.description} ${scene.tarotSymbolism ? `Incorporate tarot symbolism: ${scene.tarotSymbolism}` : ''}`
      });
    }
  });

  // Character Development Prompts
  prompts.push({
    category: 'Character Development',
    title: 'Character Growth',
    prompt: `Develop Francisco's character growth in this chapter. Show how he embodies or struggles with the ${book.triumph} triumph theme. Consider his personality type (${book.personalityType}) and how the events of this chapter challenge or reinforce his core beliefs.`
  });

  // Task Group Based Prompts
  chapterTaskGroups.forEach(taskGroup => {
    if (taskGroup.type === 'Major Task Group') {
      prompts.push({
        category: 'Learning Integration',
        title: taskGroup.title,
        prompt: `Integrate the learning objectives of "${taskGroup.title}" into the narrative. Focus area: ${taskGroup.focusArea}. ${taskGroup.description} Show how the protagonist learns or demonstrates these concepts through action and dialogue.`
      });
    }
  });

  // Dialogue Prompts
  prompts.push({
    category: 'Dialogue',
    title: 'Character Dialogue',
    prompt: `Write authentic dialogue for this chapter set in Renaissance Italy. Characters should speak in a way that reflects their education, social status, and the time period. Incorporate period-appropriate language while keeping it accessible to modern readers.`
  });

  // Setting and Atmosphere Prompts
  prompts.push({
    category: 'Setting & Atmosphere',
    title: 'Historical Setting',
    prompt: `Describe the Renaissance Italian setting for this chapter. Include sensory details about architecture, clothing, food, sounds, and smells. The atmosphere should support the ${chapter.focus} focus and reflect the ${book.subject} theme.`
  });

  // Conflict and Tension Prompts
  prompts.push({
    category: 'Conflict & Tension',
    title: 'Rising Action',
    prompt: `Create tension and conflict in this chapter that advances the overall plot. Consider how this chapter's events contribute to the protagonist's journey toward mastering ${book.triumph}. Include both internal and external conflicts.`
  });

  return prompts;
}
