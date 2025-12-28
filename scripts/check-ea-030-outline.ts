import * as fs from 'fs';
import * as path from 'path';

const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

function search(obj: any): any {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.id === 'EA-030') return obj;
  for (const key of Object.keys(obj)) {
    const result = search(obj[key]);
    if (result) return result;
  }
  return null;
}

const ea030 = search(outlineData);
console.log('EA-030 Scene Data:');
console.log(JSON.stringify(ea030.scenes, null, 2));
