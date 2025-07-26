import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/lib/schema.ts';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const updatedSummaries = {
  36: `Francisco and the Catalan Company gather in strategy rooms and collaboration centers across the realm, their loyalty tested as they prepare for the ultimate challenges ahead. In this pivotal chapter, Francisco demonstrates his mastery of collaborative leadership, orchestrating complex alliances while the Company's unbreakable bonds of unity become their greatest strength. The atmosphere is thick with anticipation and dedication as loved ones rally to support the cause, creating an intricate network of mutual support. As challenging environments test their commitment, Francisco's growth from a solitary law student to a collaborative leader is fully realized. The Catalan Company transforms into an unshakeable force, their loyalty demonstrated through trials that would break lesser partnerships. This chapter serves as the calm before the storm, where preparation meets dedication, and where the true depth of their shared purpose becomes the foundation for the climactic battles to come.`,
  
  37: `The climactic battleground erupts as Francisco faces the ultimate test of his transformation in Book 1, where courage transforms fear into raw power and doubt crystallizes into unshakeable certainty. This is the moment where potentiality becomes reality—Francisco's journey from an uncertain law student reaches its crescendo as he realizes his full potential in the face of overwhelming danger. The Catalan Company's collective courage manifests as their greatest weapon, their unity forged through countless trials now blazing like a beacon against the darkness. La Signora del Gioco stands beside Francisco as their partnership reaches its climactic expression, two minds and hearts working in perfect synchronization against forces that threaten everything they've built. The dangerous environment tests every ability Francisco has developed, every lesson learned, every relationship forged. This chapter captures the supreme moment where individual growth meets cosmic responsibility, where the stakes couldn't be higher, and where Francisco must prove that his transformation is complete and unshakeable.`,
  
  38: `When external forces threaten to overwhelm Francisco and the Catalan Company, salvation comes from an unexpected source—the deep well of inner knowledge Francisco has cultivated throughout his journey. At rescue convergence points where the mystical and mundane worlds intersect, Francisco's internal wisdom becomes the guiding light that coordinates unexpected aid from allies he didn't know he possessed. The Catalan Company's resilient determination shines through as they refuse to surrender despite seemingly insurmountable obstacles, their unwavering spirit attracting rescue from beyond their immediate circle. This chapter reveals how Francisco's inner transformation has created ripple effects across multiple realms, bringing together inner knowledge and external support in a symphony of salvation. The atmosphere pulses with revelation and rescue as Francisco discovers that his journey of self-discovery has unknowingly built a network of supporters and allies. It's a powerful reminder that true strength comes from the marriage of internal wisdom and external collaboration, where rescue arrives not as a deus ex machina, but as the natural consequence of authentic growth and genuine relationships.`,
  
  39: `In tranquil reflection spaces and ceremonial grounds of achievement, Francisco and the Catalan Company pause to contemplate the profound transformation their journey has wrought—not just in themselves, but in the world around them. Francisco's understanding of success undergoes its final evolution, shifting from personal ambition to collective benefit, as his gratitude becomes both a source of power and deep wisdom. The Catalan Company gathers in peaceful gardens and community centers, their shared reflection strengthening bonds that will endure beyond this current adventure. Community beneficiaries—people whose lives have been touched and changed by Francisco's transformation—join in celebrating achievements that extend far beyond individual victory. This chapter captures the rare and precious moment of genuine gratitude, where the journey itself is appreciated as much as the destination. Festival spaces and places of honor echo with the recognition that meaningful change has occurred, that lives have been enriched, and that the true measure of success lies not in what was gained, but in what was given. The atmosphere is one of deep fulfillment, where happiness comes not from conquest, but from service and authentic living.`,
  
  40: `In the final chapter of Book 1, Francisco achieves the rare distinction of becoming a Master of Two Worlds, seamlessly navigating between the ordinary realm of law and learning and the supernatural domain of cosmic responsibility. At the interface where these worlds meet, Francisco and the Catalan Company experience the profound fulfillment that comes from living authentically and serving something greater than themselves. Francisco's aspiration has evolved from personal ambition to universal service, his true happiness found in the perfect harmony between self-realization and selfless action. La Signora del Gioco and Francisco achieve a partnership that serves as a model for balanced collaboration, their relationship demonstrating how individual growth enhances rather than diminishes connection with others. The community transformation is evident everywhere—in fulfillment spaces that celebrate not conquest but contribution, in places where positive impact ripples outward like stones cast in still water. This concluding chapter radiates with true happiness and fulfillment, the sense of a complete journey accomplished while simultaneously opening the door to greater adventures ahead. Francisco has learned to embrace his authentic self while living in harmony with both the mundane and mystical worlds, preparing him for the cosmic challenges that await in the remaining eight books of the series.`
};

async function updateChapterSummaries() {
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('🚀 Starting to update Chapter 36-40 summaries...\n');
    console.log('🔄 Connecting to database...');
    
    // Find Book 1 in the database
    const book1 = await db.select().from(schema.books).where(eq(schema.books.bookNumber, 1)).limit(1);
    if (book1.length === 0) {
      throw new Error('Book 1 not found in database. Please seed books first.');
    }
    
    const book1Id = book1[0].id;
    console.log(`📚 Found Book 1 in database with ID: ${book1Id}\n`);

    let successCount = 0;
    let failureCount = 0;
    const failedChapters = [];

    // Update each chapter
    for (const [chapterNum, newSummary] of Object.entries(updatedSummaries)) {
      try {
        console.log(`${'='.repeat(50)}`);
        console.log(`Updating Chapter ${chapterNum} summary...`);
        console.log(`${'='.repeat(50)}`);
        
        // Find the chapter
        const chapter = await db
          .select()
          .from(schema.chapters)
          .where(and(
            eq(schema.chapters.bookId, book1Id),
            eq(schema.chapters.chapterNumber, parseInt(chapterNum))
          ))
          .limit(1);
        
        if (chapter.length === 0) {
          console.log(`❌ Chapter ${chapterNum} not found in database`);
          failureCount++;
          failedChapters.push(chapterNum);
          continue;
        }
        
        // Update the summary
        await db
          .update(schema.chapters)
          .set({ summary: newSummary })
          .where(eq(schema.chapters.id, chapter[0].id));
        
        console.log(`✅ Chapter ${chapterNum} summary updated successfully`);
        console.log(`   Preview: ${newSummary.substring(0, 100)}...`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Failed to update Chapter ${chapterNum}:`, error.message);
        failureCount++;
        failedChapters.push(chapterNum);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 UPDATE SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Successfully updated: ${successCount} chapters`);
    console.log(`❌ Failed to update: ${failureCount} chapters`);
    
    if (failedChapters.length > 0) {
      console.log(`📋 Failed chapters: ${failedChapters.join(', ')}`);
    }
    
    console.log(`\n🎉 Chapter 36-40 summary update process completed!`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateChapterSummaries();