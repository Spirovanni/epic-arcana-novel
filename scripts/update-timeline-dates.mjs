import { promises as fs } from 'fs';
import path from 'path';

const LORE_PATH = path.join(process.cwd(), 'lore', 'l_outline.json');

// Timeline mapping for chapters 11-19
const CHAPTER_TIMELINE = {
  11: {
    scenes: [
      { scene: 1, date: "1/23/1320", time: "Morning" },
      { scene: 2, date: "1/24/1320", time: "Afternoon" },
      { scene: 3, date: "1/25/1320", time: "Evening" }
    ]
  },
  12: {
    scenes: [
      { scene: 1, date: "1/26/1320", time: "Dawn" },
      { scene: 2, date: "1/27/1320", time: "Midday" },
      { scene: 3, date: "1/28/1320", time: "Night" }
    ]
  },
  13: {
    scenes: [
      { scene: 1, date: "1/29/1320", time: "Early Morning" }
    ]
  },
  14: {
    scenes: [
      { scene: 1, date: "2/1/1320", time: "Morning" },
      { scene: 2, date: "2/2/1320", time: "Afternoon" },
      { scene: 3, date: "2/3/1320", time: "Evening" }
    ]
  },
  15: {
    scenes: [
      { scene: 1, date: "2/4/1320", time: "Dawn" },
      { scene: 2, date: "2/5/1320", time: "Midday" },
      { scene: 3, date: "2/6/1320", time: "Sunset" }
    ]
  },
  16: {
    scenes: [
      { scene: 1, date: "2/7/1320", time: "Morning" },
      { scene: 2, date: "2/8/1320", time: "Afternoon" },
      { scene: 3, date: "2/9/1320", time: "Evening" }
    ]
  },
  17: {
    scenes: [
      { scene: 1, date: "2/10/1320", time: "Early Morning" },
      { scene: 2, date: "2/11/1320", time: "Morning" },
      { scene: 3, date: "2/12/1320", time: "Afternoon" }
    ]
  },
  18: {
    scenes: [
      { scene: 1, date: "2/13/1320", time: "Dawn" },
      { scene: 2, date: "2/13/1320", time: "Midday" },
      { scene: 3, date: "2/13/1320", time: "Afternoon" },
      { scene: 4, date: "2/13/1320", time: "Evening" },
      { scene: 5, date: "2/13/1320", time: "Night" }
    ]
  },
  19: {
    scenes: [
      { scene: 1, date: "2/14/1320", time: "Dawn" },
      { scene: 2, date: "2/14/1320", time: "Morning" },
      { scene: 3, date: "2/14/1320", time: "Afternoon" }
    ]
  }
};

async function updateTimelineDates() {
  console.log('📅 Starting timeline date updates for Chapters 11-19...\n');

  try {
    // Read the outline file
    const outlineContent = await fs.readFile(LORE_PATH, 'utf-8');
    let updatedContent = outlineContent;

    // Process each chapter
    for (const [chapterNum, chapterData] of Object.entries(CHAPTER_TIMELINE)) {
      console.log(`🔄 Processing Chapter ${chapterNum}...`);

      // Find all instances of this chapter in the file
      const chapterRegex = new RegExp(`"chapter":\\s*"Chapter ${chapterNum}"`, 'g');
      const chapterMatches = [...outlineContent.matchAll(chapterRegex)];

      console.log(`  Found ${chapterMatches.length} instances of Chapter ${chapterNum}`);

      // Process each scene for this chapter
      for (const sceneData of chapterData.scenes) {
        const { scene, date, time } = sceneData;

        // Create the new timeline date with time
        const newTimelineDate = `${date} - ${time}`;

        // Pattern to find and update timeline_date for specific scenes
        // Look for scene_number followed by timeline_date
        const scenePattern = new RegExp(
          `("scene_number":\\s*${scene}[\\s\\S]*?"timeline_date":\\s*")[^"]*(")`,'g'
        );

        // Update the timeline_date
        const beforeCount = (updatedContent.match(scenePattern) || []).length;
        updatedContent = updatedContent.replace(scenePattern, `$1${newTimelineDate}$2`);
        const afterCount = (updatedContent.match(scenePattern) || []).length;

        console.log(`    Scene ${scene}: Set to "${newTimelineDate}"`);
      }
    }

    // Also update the generic "Day X of Academy Training" patterns to actual dates
    console.log('\n🔄 Converting generic "Day X of Academy Training" to actual dates...');

    // Chapter 18 and 19 had generic day references, let's update them
    updatedContent = updatedContent.replace(
      /"Day 7 of Academy Training - Morning"/g, 
      `"2/13/1320 - Dawn"`
    );
    updatedContent = updatedContent.replace(
      /"Day 7 of Academy Training - Midday"/g, 
      `"2/13/1320 - Midday"`
    );
    updatedContent = updatedContent.replace(
      /"Day 7 of Academy Training - Afternoon"/g, 
      `"2/13/1320 - Afternoon"`
    );
    updatedContent = updatedContent.replace(
      /"Day 7 of Academy Training - Evening"/g, 
      `"2/13/1320 - Evening"`
    );
    updatedContent = updatedContent.replace(
      /"Day 7 of Academy Training - Night"/g, 
      `"2/13/1320 - Night"`
    );
    updatedContent = updatedContent.replace(
      /"Day 8 of Academy Training - Dawn"/g, 
      `"2/14/1320 - Dawn"`
    );
    updatedContent = updatedContent.replace(
      /"Day 8 of Academy Training - Morning"/g, 
      `"2/14/1320 - Morning"`
    );
    updatedContent = updatedContent.replace(
      /"Day 8 of Academy Training - Afternoon"/g, 
      `"2/14/1320 - Afternoon"`
    );

    // Write the updated content back to the file
    await fs.writeFile(LORE_PATH, updatedContent, 'utf-8');

    console.log('\n✅ Timeline dates successfully updated!');
    console.log('\n📊 Updated Timeline Summary:');
    console.log('Chapter 10: Ends 1/22/1320');
    console.log('Chapter 11: 1/23/1320 - 1/25/1320 (3 days)');
    console.log('Chapter 12: 1/26/1320 - 1/28/1320 (3 days)');
    console.log('Chapter 13: 1/29/1320 (1 day)');
    console.log('Chapter 14: 2/1/1320 - 2/3/1320 (3 days)');
    console.log('Chapter 15: 2/4/1320 - 2/6/1320 (3 days)');
    console.log('Chapter 16: 2/7/1320 - 2/9/1320 (3 days)');
    console.log('Chapter 17: 2/10/1320 - 2/12/1320 (3 days)');
    console.log('Chapter 18: 2/13/1320 (1 day - Sanctuary training)');
    console.log('Chapter 19: 2/14/1320 (1 day - Forge training)');
    console.log('\nAll chapters now have specific dates and times of day! 📅');

  } catch (error) {
    console.error('❌ Error updating timeline dates:', error);
    throw error;
  }
}

async function main() {
  try {
    await updateTimelineDates();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();