import * as fs from 'fs';

const outline = JSON.parse(fs.readFileSync('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json', 'utf-8'));

function findBook4Chapters(obj) {
  const chapters = [];
  
  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item));
    } else {
      for (const key in obj) {
        if (key === 'unique_identifier' && typeof obj[key] === 'string' && obj[key].startsWith('STG 4.')) {
          if (obj.chapter) {
            const chapterNum = parseInt(obj.chapter.replace('Chapter ', ''));
            chapters.push(chapterNum);
          }
        }
        traverse(obj[key]);
      }
    }
  }
  
  traverse(obj);
  return chapters;
}

const chapters = findBook4Chapters(outline);
chapters.sort((a, b) => a - b);
console.log('Found chapters:', chapters);
console.log('Total found:', chapters.length);

for (let i = 1; i <= 40; i++) {
  if (chapters.indexOf(i) === -1) {
    console.log('Missing chapter:', i);
  }
}