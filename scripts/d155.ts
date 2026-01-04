import {db} from '../src/lib/db'; import {chapters,scenes} from '../src/lib/schema'; import {eq} from 'drizzle-orm';
(async()=>{const [c]=await db.select().from(chapters).where(eq(chapters.chapterNumber,155)).limit(1);
if(c)await db.delete(scenes).where(eq(scenes.chapterId,c.id));})().then(()=>process.exit(0));
