import { sql } from '@/lib/neon';

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Update all traits with capitalized first letters
 */
async function capitalizeAllTraits() {
  try {
    console.log('Starting trait capitalization process...\n');

    // Update strengths
    console.log('Updating strengths table...');
    const strengthsResult = await sql`
      UPDATE strengths
      SET strength_text =
        CASE
          WHEN strength_text IS NOT NULL AND strength_text != ''
          THEN CONCAT(UPPER(SUBSTRING(strength_text, 1, 1)), SUBSTRING(strength_text, 2))
          ELSE strength_text
        END,
        updated_at = NOW()
      WHERE strength_text IS NOT NULL
        AND strength_text != ''
        AND strength_text !~ '^[A-Z]'
      RETURNING id, strength_text
    `;
    const strengthsCount = (strengthsResult as any[])?.length || 0;
    console.log(`✓ Updated ${strengthsCount} strength entries\n`);

    // Update shadow
    console.log('Updating shadow table...');
    const shadowResult = await sql`
      UPDATE shadow
      SET shadow_text =
        CASE
          WHEN shadow_text IS NOT NULL AND shadow_text != ''
          THEN CONCAT(UPPER(SUBSTRING(shadow_text, 1, 1)), SUBSTRING(shadow_text, 2))
          ELSE shadow_text
        END,
        updated_at = NOW()
      WHERE shadow_text IS NOT NULL
        AND shadow_text != ''
        AND shadow_text !~ '^[A-Z]'
      RETURNING id, shadow_text
    `;
    const shadowCount = (shadowResult as any[])?.length || 0;
    console.log(`✓ Updated ${shadowCount} shadow entries\n`);

    // Update growth_focus
    console.log('Updating growth_focus table...');
    const growthResult = await sql`
      UPDATE growth_focus
      SET growth_text =
        CASE
          WHEN growth_text IS NOT NULL AND growth_text != ''
          THEN CONCAT(UPPER(SUBSTRING(growth_text, 1, 1)), SUBSTRING(growth_text, 2))
          ELSE growth_text
        END,
        updated_at = NOW()
      WHERE growth_text IS NOT NULL
        AND growth_text != ''
        AND growth_text !~ '^[A-Z]'
      RETURNING id, growth_text
    `;
    const growthCount = (growthResult as any[])?.length || 0;
    console.log(`✓ Updated ${growthCount} growth_focus entries\n`);

    const totalUpdated = strengthsCount + shadowCount + growthCount;
    console.log('════════════════════════════════════════');
    console.log(`Total traits updated: ${totalUpdated}`);
    console.log('Strengths: ' + strengthsCount);
    console.log('Shadow: ' + shadowCount);
    console.log('Growth Focus: ' + growthCount);
    console.log('════════════════════════════════════════');
    console.log('✓ Trait capitalization complete!\n');

  } catch (error) {
    console.error('Error capitalizing traits:', error);
    throw error;
  }
}

// Run the script
capitalizeAllTraits().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
