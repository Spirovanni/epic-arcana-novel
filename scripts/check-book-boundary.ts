import { sql } from '@vercel/postgres'

async function checkBookBoundary() {
  try {
    // Check chapters around book boundary
    const chaptersResult = await sql`
      SELECT id, novel_book, chapter_number, icon_path 
      FROM chapters 
      WHERE chapter_number >= 38 OR (novel_book = 2 AND chapter_number <= 5)
      ORDER BY novel_book, chapter_number
    `
    
    console.log('=== CHAPTERS AROUND BOUNDARY ===')
    console.log(chaptersResult.rows)
    
    // Check personality mappings
    const personalitiesResult = await sql`
      SELECT canonical_id, all_chapter, novel_book, icon_path, color_name, personality_color
      FROM personality_chapter_mappings 
      WHERE all_chapter BETWEEN 38 AND 45
      ORDER BY all_chapter
    `
    
    console.log('\n=== PERSONALITY MAPPINGS 38-45 ===')
    console.log(personalitiesResult.rows)
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBookBoundary()
