#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Read the l_outline.json file
const outlineJsonPath = path.join(process.cwd(), 'lore', 'l_outline.json');
const outlineData = JSON.parse(fs.readFileSync(outlineJsonPath, 'utf-8'));

async function syncTimelineData() {
  console.log('🚀 Starting timeline data sync from l_outline.json...');
  
  try {
    // Navigate to the correct path in the JSON structure
    const trilogies = outlineData.SelfImprovementSeries?.Books?.trilogies;
    
    if (!trilogies) {
      console.error('❌ No trilogies found in l_outline.json');
      return;
    }
    
    let updatedScenes = 0;
    
    // Process each trilogy
    for (const [trilogyKey, trilogyData] of Object.entries(trilogies)) {
      const books = (trilogyData as any)?.trilogy_books;
      
      if (!books) {
        console.log(`⚠️  No trilogy_books found for ${trilogyKey}`);
        continue;
      }
      
      // Process each book
      for (const [bookKey, bookData] of Object.entries(books)) {
        const taskMasters = (bookData as any)?.task_masters;
        
        if (!taskMasters) {
          console.log(`⚠️  No task_masters found for ${bookKey}`);
          continue;
        }
        
        // Process each task master
        for (const [taskMasterKey, taskMasterData] of Object.entries(taskMasters)) {
          const majorTaskGroups = (taskMasterData as any)?.major_task_groups;
          
          if (!majorTaskGroups) {
            console.log(`⚠️  No major_task_groups found for ${taskMasterKey}`);
            continue;
          }
          
          // Process each major task group
          for (const [majorTaskGroupKey, majorTaskGroupData] of Object.entries(majorTaskGroups)) {
            const specificTaskGroups = (majorTaskGroupData as any)?.Specific_task_groups;
            
            if (!specificTaskGroups) {
              console.log(`⚠️  No Specific_task_groups found for ${majorTaskGroupKey}`);
              continue;
            }
            
            // Process each chapter (specific task group)
            for (const [chapterKey, chapterData] of Object.entries(specificTaskGroups)) {
              const chapterScenes = (chapterData as any)?.scenes;
              
              if (!chapterScenes) {
                console.log(`⚠️  No scenes found for ${chapterKey}`);
                continue;
              }
              
              console.log(`📖 Processing ${bookKey} - ${chapterKey} with ${chapterScenes.length} scenes`);
              
              // Process each scene in the chapter
              for (const sceneData of chapterScenes) {
          try {
            // Find existing scenes in the database that match by scene number and chapter
            // We'll need to match by scene title or scene number since we don't have direct IDs
            const existingScenes = await db
              .select()
              .from(scenes)
              .where(eq(scenes.sceneNumber, sceneData.scene_number));
            
            // Update each matching scene with timeline data
            for (const existingScene of existingScenes) {
              const updateData = {
                timeline_date: sceneData.timeline_date || null,
                timeline_variant: sceneData.timeline_variant || null,
                location: sceneData.location || null,
                pov: sceneData.pov || null,
                tense: sceneData.tense || null,
                core_emotion: sceneData.core_emotion || null,
                scene_tone: sceneData.scene_tone || null,
              };
              
              await db
                .update(scenes)
                .set(updateData)
                .where(eq(scenes.id, existingScene.id));
              
              console.log(`✅ Updated scene ${existingScene.sceneNumber}: ${existingScene.title} with timeline data`);
              updatedScenes++;
            }
          } catch (error) {
            console.error(`❌ Error processing scene ${sceneData.scene_number}:`, error);
          }
        }
      }
    }
  }
}
}
    
    console.log(`🎉 Timeline data sync completed! Updated ${updatedScenes} scenes.`);
    
  } catch (error) {
    console.error('❌ Error during timeline data sync:', error);
  }
}

// Run the sync
syncTimelineData()
  .then(() => {
    console.log('✅ Sync completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });

export { syncTimelineData };