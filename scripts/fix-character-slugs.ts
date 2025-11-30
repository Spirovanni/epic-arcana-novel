import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { characters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

/**
 * Fix corrupted character slugs that were missing first character(s)
 * This script corrects all 28 character records to have proper URL-friendly slugs
 */
async function fixCharacterSlugs() {
  try {
    console.log('🔄 Starting character slug fix...');

    const slugFixes = [
      { name: 'Dante Alighieri', newSlug: 'Dante-Alighieri' },
      { name: 'Francisco Petrarch', newSlug: 'Francisco-Petrarch' },
      { name: 'Cardinal Giovanni Colonna', newSlug: 'Cardinal-Giovanni-Colonna' },
      { name: 'Cino da Pistoia', newSlug: 'Cino-da-Pistoia' },
      { name: 'Dagon Atumari', newSlug: 'Dagon-Atumari' },
      { name: 'Eletta Petracco', newSlug: 'Eletta-Petracco' },
      { name: 'Gherardo Petrarch', newSlug: 'Gherardo-Petrarch' },
      { name: 'Giacomo Colonna', newSlug: 'Giacomo-Colonna' },
      { name: 'Giovanni d\'Andrea', newSlug: 'Giovanni-d-Andrea' },
      { name: 'Guido Sette', newSlug: 'Guido-Sette' },
      { name: 'Hannibal Barca', newSlug: 'Hannibal-Barca' },
      { name: 'Lucia Cartaro', newSlug: 'Lucia-Cartaro' },
      { name: 'Giovanna De Sade', newSlug: 'Giovanna-De-Sade' },
      { name: 'Roger de Flor', newSlug: 'Roger-de-Flor' },
      { name: 'La Signora del Gioco', newSlug: 'La-Signora-del-Gioco' },
      { name: 'Novella d\'Andrea', newSlug: 'Novella-d-Andrea' },
      { name: 'Madonna Oriente', newSlug: 'Madonna-Oriente' },
    ];

    let fixedCount = 0;

    for (const fix of slugFixes) {
      try {
        console.log(`  Fixing: ${fix.name} → ${fix.newSlug}`);

        const result = await db
          .update(characters)
          .set({ slug: fix.newSlug })
          .where(eq(characters.name, fix.name));

        fixedCount++;
      } catch (error) {
        console.error(`  ✗ Failed to fix ${fix.name}:`, error);
      }
    }

    console.log(`✅ Character slug fix completed! Fixed: ${fixedCount} characters`);

    // Verify the fixes
    const verification = await db
      .select({
        name: characters.name,
        slug: characters.slug,
      })
      .from(characters);

    const corrupted = verification.filter(
      (char) => !char.slug || char.slug.length === 0 || char.slug.startsWith('-')
    );

    if (corrupted.length > 0) {
      console.warn(`⚠️  Warning: ${corrupted.length} characters still have invalid slugs:`);
      corrupted.forEach((char) => {
        console.warn(`   - ${char.name}: ${char.slug || 'NULL'}`);
      });
    } else {
      console.log('✅ All character slugs verified successfully!');
    }

  } catch (error) {
    console.error('❌ Character slug fix failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixCharacterSlugs();
