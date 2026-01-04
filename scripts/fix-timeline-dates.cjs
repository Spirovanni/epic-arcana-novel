const fs = require('fs');
const path = require('path');

// Read the outline
const outlinePath = path.join(__dirname, '../data/l_outline.json');
const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

// Track changes
let changesCount = 0;
const changes = [];

// Helper to convert various date formats to M/D/YYYY - TimeOfDay
function normalizeTimelineDate(currentValue, chapterId, sceneIndex) {
  if (!currentValue) return null;

  // If already in correct format (M/D/YYYY or MM/DD/YYYY followed by - and time), check if we need to simplify
  const correctFormatRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(.+)$/;
  const match = currentValue.match(correctFormatRegex);

  if (match) {
    const [, month, day, year, timeOfDay] = match;

    // Normalize time of day to simple values
    const normalizedTime = normalizeTimeOfDay(timeOfDay);

    // Remove leading zeros from month and day
    const normalizedMonth = parseInt(month, 10);
    const normalizedDay = parseInt(day, 10);

    return `${normalizedMonth}/${normalizedDay}/${year} - ${normalizedTime}`;
  }

  // Handle spelled-out month formats like "July 16, 1323 - Something"
  const spelledOutRegex = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*-\s*(.+)$/;
  const spelledMatch = currentValue.match(spelledOutRegex);

  if (spelledMatch) {
    const [, monthName, day, year, timeOfDay] = spelledMatch;
    const monthNumber = getMonthNumber(monthName);
    const normalizedTime = normalizeTimeOfDay(timeOfDay);

    return `${monthNumber}/${parseInt(day, 10)}/${year} - ${normalizedTime}`;
  }

  // Handle date ranges like "11/24-25/1347 - Something" (use first date)
  const dateRangeRegex = /^(\d{1,2})\/(\d{1,2})-\d{1,2}\/(\d{4})\s*-\s*(.+)$/;
  const rangeMatch = currentValue.match(dateRangeRegex);

  if (rangeMatch) {
    const [, month, day, year, timeOfDay] = rangeMatch;
    const normalizedTime = normalizeTimeOfDay(timeOfDay);
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year} - ${normalizedTime}`;
  }

  // Handle month ranges like "December 1323 - June 1324 - Something" (use first month)
  const monthRangeRegex = /^([A-Za-z]+)\s+(\d{4})\s*-\s*[A-Za-z]+\s+\d{4}\s*-\s*(.+)$/;
  const monthRangeMatch = currentValue.match(monthRangeRegex);

  if (monthRangeMatch) {
    const [, monthName, year, description] = monthRangeMatch;
    const monthNumber = getMonthNumber(monthName);
    const normalizedTime = normalizeTimeOfDay(description);
    return `${monthNumber}/1/${year} - ${normalizedTime}`;
  }

  // Handle dates without time of day like "01/25/1328"
  const dateOnlyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const dateOnlyMatch = currentValue.match(dateOnlyRegex);

  if (dateOnlyMatch) {
    const [, month, day, year] = dateOnlyMatch;
    // Default to Afternoon if no time specified
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year} - Afternoon`;
  }

  // If we can't parse it, return null to indicate it needs manual review
  console.warn(`⚠️  Could not parse timeline_date in ${chapterId} scene ${sceneIndex + 1}: "${currentValue}"`);
  return null;
}

function getMonthNumber(monthName) {
  const months = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };

  return months[monthName.toLowerCase()] || 1;
}

function normalizeTimeOfDay(timeOfDay) {
  const lower = timeOfDay.toLowerCase().trim();

  // Map various descriptions to standard time periods
  if (lower.includes('morn') || lower.includes('dawn') || lower.includes('sunrise')) {
    return 'Morning';
  }
  if (lower.includes('noon') || lower.includes('midday')) {
    return 'Noon';
  }
  if (lower.includes('afternoon') || lower.includes('late afternoon')) {
    return 'Afternoon';
  }
  if (lower.includes('evening') || lower.includes('dusk') || lower.includes('sunset')) {
    return 'Evening';
  }
  if (lower.includes('night') || lower.includes('midnight')) {
    return 'Night';
  }

  // If it's a specific description, default to a reasonable time
  // Check if it starts with "Day" (like "Day 1", "Day 2")
  if (/^day\s*\d*$/i.test(lower)) {
    return 'Afternoon';
  }

  // Default to keeping first word capitalized if we can't categorize
  const words = timeOfDay.split(/\s+/);
  const firstWord = words[0];

  // If it's something like "The Ultimatum" or descriptive, use "Afternoon" as default
  if (lower.startsWith('the ') || words.length > 2) {
    return 'Afternoon';
  }

  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

// Recursively process the outline
function processOutline(obj, path = '') {
  if (typeof obj === 'object' && obj !== null) {
    // Check if this is a chapter
    if (obj.id && obj.id.startsWith('EA-')) {
      const chapterNum = parseInt(obj.id.split('-')[1]);

      // Process chapters after EA-097
      if (chapterNum > 97 && obj.scenes && Array.isArray(obj.scenes)) {
        obj.scenes.forEach((scene, idx) => {
          if (scene.timeline_date) {
            const normalized = normalizeTimelineDate(scene.timeline_date, obj.id, idx);

            if (normalized && normalized !== scene.timeline_date) {
              changes.push({
                chapter: obj.id,
                scene: idx + 1,
                old: scene.timeline_date,
                new: normalized
              });

              scene.timeline_date = normalized;
              changesCount++;
            }
          }
        });
      }
    }

    // Recurse through all properties
    for (const key in obj) {
      processOutline(obj[key], path + '.' + key);
    }
  }
}

// Process the outline
console.log('🔍 Scanning for timeline_date fields after EA-097...\n');
processOutline(outline);

// Show changes
if (changes.length > 0) {
  console.log(`📝 Found ${changes.length} timeline_date fields to update:\n`);

  changes.slice(0, 20).forEach(change => {
    console.log(`${change.chapter} Scene ${change.scene}:`);
    console.log(`  Old: "${change.old}"`);
    console.log(`  New: "${change.new}"`);
    console.log('');
  });

  if (changes.length > 20) {
    console.log(`... and ${changes.length - 20} more changes\n`);
  }

  // Write back the outline
  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`✅ Successfully updated ${changesCount} timeline_date fields in l_outline.json`);
} else {
  console.log('✅ No timeline_date fields needed updating');
}
