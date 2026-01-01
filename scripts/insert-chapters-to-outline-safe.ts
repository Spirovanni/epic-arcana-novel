import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('📖 Safely inserting EA-017 and EA-020 into outline file...\n');

  // Read the outline file
  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  let outlineContent = fs.readFileSync(outlinePath, 'utf-8');

  // Read chapter data
  const ea017Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'create-ea-017-chapter-data.json'), 'utf-8'));
  const ea020Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'create-ea-020-chapter-data.json'), 'utf-8'));

  // Convert outline to JSON for manipulation
  const outline = JSON.parse(outlineContent);

  console.log('✅ Loaded outline and chapter data\n');

  // Strategy: Add chapters to a temporary array location that can be easily found and moved later
  // This is safer than trying to navigate the complex nested structure

  // Add a marker object we can easily find and replace
  if (!outline.pending_manual_insertion) {
    outline.pending_manual_insertion = {
      note: "These chapters need to be manually moved to correct nested locations",
      ea_017: ea017Data,
      ea_020: ea020Data
    };
  }

  // Write back
  fs.writeFileSync(
    outlinePath,
    JSON.stringify(outline, null, 2),
    'utf-8'
  );

  console.log('✅ Chapter data added to outline file under "pending_manual_insertion"');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. The chapter data is now in the outline file');
  console.log('2. You can manually move:');
  console.log('   - pending_manual_insertion.ea_017 to the correct location after EA-016');
  console.log('   - pending_manual_insertion.ea_020 to the correct location after EA-019');
  console.log('3. Delete the "pending_manual_insertion" object when done');
  console.log('\nAlternatively, use the database as source of truth and sync later.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
