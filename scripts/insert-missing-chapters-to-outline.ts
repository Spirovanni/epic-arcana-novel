import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the chapter data JSONs
const ea017Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'create-ea-017-chapter-data.json'), 'utf-8'));
const ea020Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'create-ea-020-chapter-data.json'), 'utf-8'));

async function main() {
  console.log('📖 Inserting EA-017 and EA-020 into outline file...\n');

  // Read the outline file
  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outlineContent = fs.readFileSync(outlinePath, 'utf-8');
  const outline = JSON.parse(outlineContent);

  let ea017Inserted = false;
  let ea020Inserted = false;

  // Navigate through the nested outline structure to find insertion points
  function insertChapters(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    // Check if this is an array of chapters
    if (Array.isArray(obj)) {
      const newArray = [];
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];

        // Add current item
        newArray.push(insertChapters(item));

        // Check if we should insert EA-017 after EA-016
        if (item.id === 'EA-016' && !ea017Inserted) {
          console.log('   ✅ Found EA-016, inserting EA-017 after it');
          newArray.push(ea017Data);
          ea017Inserted = true;
        }

        // Check if we should insert EA-020 after EA-019
        if (item.id === 'EA-019' && !ea020Inserted) {
          console.log('   ✅ Found EA-019, inserting EA-020 after it');
          newArray.push(ea020Data);
          ea020Inserted = true;
        }
      }
      return newArray;
    }

    // Recursively process nested objects
    const result: any = {};
    for (const key in obj) {
      result[key] = insertChapters(obj[key]);
    }
    return result;
  }

  const updatedOutline = insertChapters(outline);

  // Write updated outline back to file
  console.log('\n💾 Writing updated outline to file...');
  fs.writeFileSync(
    outlinePath,
    JSON.stringify(updatedOutline, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Insertion complete!`);
  if (ea017Inserted) console.log('   ✅ EA-017 inserted after EA-016');
  if (ea020Inserted) console.log('   ✅ EA-020 inserted after EA-019');
  console.log(`📁 File updated: ${outlinePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
