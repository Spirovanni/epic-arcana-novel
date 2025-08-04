import { db } from '../src/lib/db.ts';
import { chapters } from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

interface ChapterData {
  chapterNumber: number;
  chapter: string;
  title: string;
  terminalLearningObjectives?: {
    [key: string]: string;
  };
}

async function seedLearningObjectives() {
  try {
    console.log('🎯 Starting to seed learning objectives...');

    // Read the book1 chapters JSON file
    const book1DataPath = path.join(process.cwd(), 'tmp', 'book1_chapters_1_40.json');
    
    if (!fs.existsSync(book1DataPath)) {
      console.error('❌ Book 1 chapters JSON file not found at:', book1DataPath);
      return;
    }

    const book1Data = JSON.parse(fs.readFileSync(book1DataPath, 'utf8'));
    
    // Extract chapter data
    const chapterEntries = Object.entries(book1Data) as [string, ChapterData][];
    
    console.log(`📚 Found ${chapterEntries.length} chapters in JSON file`);
    
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [chapterKey, chapterData] of chapterEntries) {
      const chapterNumber = chapterData.chapterNumber;
      
      if (!chapterData.terminalLearningObjectives) {
        console.log(`⚠️  No learning objectives found for chapter ${chapterNumber}, skipping...`);
        skippedCount++;
        continue;
      }

      // Find the chapter in the database
      const existingChapters = await db.select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, chapterNumber));

      if (existingChapters.length === 0) {
        console.log(`⚠️  Chapter ${chapterNumber} not found in database, skipping...`);
        skippedCount++;
        continue;
      }

      // Update each matching chapter (there might be multiple with the same number)
      for (const existingChapter of existingChapters) {
        const currentObjectives = existingChapter.terminalLearningObjectives as any;
        
        // Only update if objectives are not already set or are different
        const newObjectives = chapterData.terminalLearningObjectives;
        
        if (!currentObjectives || JSON.stringify(currentObjectives) !== JSON.stringify(newObjectives)) {
          await db.update(chapters)
            .set({
              terminalLearningObjectives: newObjectives
            })
            .where(eq(chapters.id, existingChapter.id));
          
          console.log(`✅ Updated learning objectives for chapter ${chapterNumber} (${existingChapter.title || 'Untitled'})`);
          updatedCount++;
        } else {
          console.log(`ℹ️  Learning objectives already up to date for chapter ${chapterNumber}`);
          skippedCount++;
        }
      }
    }

    console.log('\n🎉 Learning objectives seeding completed!');
    console.log(`✅ Updated: ${updatedCount} chapters`);
    console.log(`⏭️  Skipped: ${skippedCount} chapters`);
    
  } catch (error) {
    console.error('❌ Error seeding learning objectives:', error);
    throw error;
  }
}

// Run the seeding function
seedLearningObjectives()
  .then(() => {
    console.log('🏁 Learning objectives seeding finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Learning objectives seeding failed:', error);
    process.exit(1);
  });