import { db } from '../src/lib/db';

async function addChapterTitleColumn() {
  try {
    await db.execute('ALTER TABLE chapters ADD COLUMN chapter_title varchar(255);');
    console.log('✅ Added chapter_title column to chapters table.');
  } catch (err) {
    console.error('❌ Error adding chapter_title column:', err);
  } finally {
    process.exit(0);
  }
}

addChapterTitleColumn(); 