import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('📋 Sample Database Records\n');
  console.log('='.repeat(80) + '\n');

  // Sample from EA-312 (First chapter)
  const [chapter312] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 312)).limit(1);
  const scenes312 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter312.id)).orderBy(scenes.sceneNumber).limit(1);

  console.log('EA-312 (Desolation) - Scene 1:');
  console.log(`  Title: ${scenes312[0].title}`);
  console.log(`  POV: ${scenes312[0].pov}`);
  console.log(`  Tense: ${scenes312[0].tense}`);
  console.log(`  Core Emotion: ${scenes312[0].coreEmotion}`);
  console.log(`  Scene Tone: ${scenes312[0].sceneTone}`);

  console.log('\n' + '='.repeat(80) + '\n');

  // Sample from EA-327 (Middle chapter - Benevolence)
  const [chapter327] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 327)).limit(1);
  const scenes327 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter327.id)).orderBy(scenes.sceneNumber).limit(1);

  console.log('EA-327 (Benevolence) - Scene 1:');
  console.log(`  Title: ${scenes327[0].title}`);
  console.log(`  POV: ${scenes327[0].pov}`);
  console.log(`  Tense: ${scenes327[0].tense}`);
  console.log(`  Core Emotion: ${scenes327[0].coreEmotion}`);
  console.log(`  Scene Tone: ${scenes327[0].sceneTone}`);

  console.log('\n' + '='.repeat(80) + '\n');

  // Sample from EA-335 (Last chapter - Prosperity)
  const [chapter335] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 335)).limit(1);
  const scenes335 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter335.id)).orderBy(scenes.sceneNumber).limit(1);

  console.log('EA-335 (Prosperity) - Scene 1:');
  console.log(`  Title: ${scenes335[0].title}`);
  console.log(`  POV: ${scenes335[0].pov}`);
  console.log(`  Tense: ${scenes335[0].tense}`);
  console.log(`  Core Emotion: ${scenes335[0].coreEmotion}`);
  console.log(`  Scene Tone: ${scenes335[0].sceneTone}`);

  console.log('\n' + '='.repeat(80));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
