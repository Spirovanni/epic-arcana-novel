import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Fixing JSON typography issues...\n');

// Read the file
const content = readFileSync('./data/l_outline.json', 'utf8');

// Replace problematic characters
let fixed = content;

// Replace em dashes with double hyphens
fixed = fixed.replace(/—/g, '--');
console.log('✓ Fixed em dashes');

// Replace curly quotes with straight quotes (escaped for JSON)
fixed = fixed.replace(/"/g, '\\"');
fixed = fixed.replace(/"/g, '\\"');
console.log('✓ Fixed curly double quotes');

// Replace curly apostrophes with straight apostrophes
fixed = fixed.replace(/'/g, "'");
fixed = fixed.replace(/'/g, "'");
console.log('✓ Fixed curly single quotes/apostrophes');

// Write back
writeFileSync('./data/l_outline.json', fixed);
console.log('\n✅ File updated');

// Validate
try {
  JSON.parse(fixed);
  console.log('✓ JSON is now valid!\n');
} catch (e) {
  console.error('❌ JSON still has errors:', e.message);
  process.exit(1);
}

