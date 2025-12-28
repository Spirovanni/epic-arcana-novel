import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface EA025Data {
  id: string;
  title: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  plot_beat?: string;
  summary?: string;
  character_arcs?: string;
  story_gaps_addressed?: string;
  location_details?: string;
  series_connections?: string;
  epic_preliminary_scene_description?: string;
}

function findEA025Data(): EA025Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA025Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-025') return obj as EA025Data;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

function truncate(value: string | null | undefined, maxLength: number): string | null {
  if (!value) return null;
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength - 3) + '...';
}

async function main() {
  console.log('🎨 Completing EA-025 chapter-level fields...\n');

  const ea025Data = findEA025Data();

  if (!ea025Data) {
    console.error('❌ EA-025 not found in outline');
    process.exit(1);
  }

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-025'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-025 chapter not found in database');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-025: ${chapter.title}\n`);

  // Update chapter with all fields from outline
  const chapterUpdates = {
    title: ea025Data.title,
    epicNovelPages: truncate(ea025Data.epic_novel_pages, 50),
    epicChapterFocus: ea025Data.epic_chapter_focus || null,
    epicNovelChapterFocus: ea025Data.epic_novel_chapter_focus || null,
    tarotFamily: truncate(ea025Data.tarot_family, 100),
    tarotCardItem: truncate(ea025Data.tarot_card_item, 100),
    heroJourneyBeat: truncate(ea025Data.hero_journey_beat, 100),
    saveTheCatBeat: truncate(ea025Data.save_the_cat_beat, 100),
    plotBeat: truncate(ea025Data.plot_beat, 100),
    summary: ea025Data.summary || null,
    characterArcs: ea025Data.character_arcs || null,
    storyGapsAddressed: ea025Data.story_gaps_addressed || null,
    locationDetails: ea025Data.location_details || null,
    seriesConnections: ea025Data.series_connections || null,
    epicPreliminarySceneDescription: ea025Data.epic_preliminary_scene_description || null,
  };

  await db.update(chapters).set(chapterUpdates).where(eq(chapters.id, chapter.id));

  console.log('✅ Updated chapter fields:');
  console.log(`   📄 Epic Novel Pages: ${chapterUpdates.epicNovelPages || 'NULL'}`);
  console.log(`   🎯 Epic Chapter Focus: ${chapterUpdates.epicChapterFocus ? 'SET' : 'NULL'}`);
  console.log(`   🃏 Tarot Family: ${chapterUpdates.tarotFamily || 'NULL'}`);
  console.log(`   🎴 Tarot Card Item: ${chapterUpdates.tarotCardItem || 'NULL'}`);
  console.log(`   🦸 Hero Journey Beat: ${chapterUpdates.heroJourneyBeat || 'NULL'}`);
  console.log(`   🎬 Save The Cat Beat: ${chapterUpdates.saveTheCatBeat || 'NULL'}`);
  console.log(`   📖 Summary: ${chapterUpdates.summary ? 'SET' : 'NULL'}`);
  console.log(`   👥 Character Arcs: ${chapterUpdates.characterArcs ? 'SET' : 'NULL'}`);
  console.log(`   🔗 Story Gaps: ${chapterUpdates.storyGapsAddressed ? 'SET' : 'NULL'}`);
  console.log(`   📍 Location Details: ${chapterUpdates.locationDetails ? 'SET' : 'NULL'}`);
  console.log(`   🌐 Series Connections: ${chapterUpdates.seriesConnections ? 'SET' : 'NULL'}`);

  console.log('\n🎉 EA-025 chapter-level fields complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
