import { db } from '../src/lib/db.js';
import { sql } from 'drizzle-orm';

async function checkSceneColumns() {
    console.log('🔍 Checking scenes table for metadata columns...\n');

    try {
        const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'scenes' 
      AND column_name IN ('sudowrite_metadata', 'learning_objectives', 'foreshadowing_elements')
      ORDER BY column_name
    `);

        const columns = result.rows as Array<{ column_name: string; data_type: string; is_nullable: string }>;

        const targetColumns = ['sudowrite_metadata', 'learning_objectives', 'foreshadowing_elements'];
        const foundColumns = new Set(columns.map(c => c.column_name));

        console.log('📊 Results:');
        console.log('─'.repeat(60));

        targetColumns.forEach(col => {
            if (foundColumns.has(col)) {
                const colInfo = columns.find(c => c.column_name === col)!;
                console.log(`✅ ${col}`);
                console.log(`   Type: ${colInfo.data_type}, Nullable: ${colInfo.is_nullable}`);
            } else {
                console.log(`❌ ${col} - NOT FOUND`);
            }
        });

        console.log('─'.repeat(60));

        const missingColumns = targetColumns.filter(col => !foundColumns.has(col));

        if (missingColumns.length === 0) {
            console.log('\n✅ All required columns exist! Ready to populate data.');
            process.exit(0);
        } else {
            console.log(`\n⚠️  Missing ${missingColumns.length} column(s): ${missingColumns.join(', ')}`);
            console.log('📝 Migration needed before populating data.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error checking database schema:', error);
        process.exit(1);
    }
}

checkSceneColumns();
