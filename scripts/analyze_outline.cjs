const fs = require('fs');
const path = require('path');

const outlinePath = path.join(__dirname, '../data/l_outline.json');

try {
  const rawData = fs.readFileSync(outlinePath, 'utf8');
  const data = JSON.parse(rawData);

  const problematicSTGs = [];

  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;

    // Check if this is an STG
    if (obj.id && typeof obj.id === 'string' && /^EA-\d+$/.test(obj.id)) {
      analyzeSTG(obj);
    }

    // Recurse
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        traverse(obj[key]);
      }
    }
  }

  function analyzeSTG(stg) {
    const issues = [];

    if (!stg.scenes || !Array.isArray(stg.scenes) || stg.scenes.length === 0) {
      issues.push('Missing or empty scenes array');
    } else {
      stg.scenes.forEach((scene, index) => {
        const missingFields = [];

        const isPlaceholder = (val) => {
          if (!val) return true;
          if (val.trim() === '') return true;
          if (/^Scene \d+$/.test(val)) return true;
          if (val.toLowerCase().includes('symbolic elements of scene')) return true;
          if (val.toLowerCase().includes('advance the narrative')) return true;
          return false;
        };

        if (isPlaceholder(scene.scene_title) && isPlaceholder(scene.title)) missingFields.push('scene_title');
        if (isPlaceholder(scene.setup)) missingFields.push('setup');
        if (isPlaceholder(scene.symbolism)) missingFields.push('symbolism');
        if (isPlaceholder(scene.beat_goal)) missingFields.push('beat_goal');

        if (missingFields.length > 0) {
          issues.push(`Scene ${index + 1} missing/placeholder: ${missingFields.join(', ')}`);
        }
      });
    }

    if (issues.length > 0) {
      problematicSTGs.push({
        id: stg.id,
        all_chapter: parseInt(stg.all_chapter, 10),
        novel_book: stg.novel_book,
        chapter: stg.chapter,
        issues: issues
      });
    }
  }

  traverse(data);

  // Sort by all_chapter
  problematicSTGs.sort((a, b) => a.all_chapter - b.all_chapter);

  // Take top 5
  const top5 = problematicSTGs.slice(0, 5);

  console.log(JSON.stringify(top5, null, 2));

} catch (error) {
  console.error("Error processing file:", error);
}
