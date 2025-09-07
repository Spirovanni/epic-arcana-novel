import * as fs from 'fs';
import * as path from 'path';
import { ProfileSchema, PersonalityProfile } from './schema';
import { FAMILY_LABELS, hslToHex } from './constants';
import {
  familyFromChapter,
  idx40FromChapter,
  wingBinFromIdx40,
  devBinFromIdx40,
  hueIndexFromChapter,
  idFromChapter
} from './mapping';

interface ValidationIssue {
  chapter: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface RepairReport {
  totalProfiles: number;
  validationIssues: ValidationIssue[];
  createdProfiles: number[];
  repairedFields: { [chapter: number]: string[] };
  familyCounts: { [family: number]: number };
}

const SOURCE_FILES = [
  'epic_arcana_personality_profiles_ch1-150_system_named.json',
  'epic_arcana_personality_profiles_ch1-250_system_named.json',
  'epic_arcana_personality_profiles_ch131-150.json',
  'epic_arcana_personality_profiles_ch150-200.json',
  'epic_arcana_personality_profiles_ch210-250.json',
  'epic_arcana_personalities_ch300-360.json',
  'epic_arcana_personality_profiles_ch1-360_system_named.json'
];

const DEVELOPMENT_LIGHTNESS = {
  0: 74, // development_bin 0
  1: 68, // development_bin 1
  2: 60, // development_bin 2
  3: 52, // development_bin 3
  4: 46  // development_bin 4
};

async function loadOutlineThemes(): Promise<{ [chapter: number]: string }> {
  try {
    const outlinePath = path.join(__dirname, '../data/l_outline.json');
    const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
    
    const themes: { [chapter: number]: string } = {};
    
    // Extract themes from the outline structure
    // The outline has a complex nested structure with books containing chapters
    function extractThemes(obj: any, currentChapter = 1): number {
      if (Array.isArray(obj)) {
        for (const item of obj) {
          currentChapter = extractThemes(item, currentChapter);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.chapter && (obj.theme || obj.title)) {
          const chapterMatch = obj.chapter.match(/Chapter (\d+)/);
          if (chapterMatch) {
            const chapterNum = parseInt(chapterMatch[1]);
            const theme = obj.theme || obj.title || obj.major_task_group_title;
            if (theme) {
              themes[currentChapter] = theme;
              currentChapter++;
            }
          }
        }
        
        // Recursively search nested objects
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            currentChapter = extractThemes(obj[key], currentChapter);
          }
        }
      }
      
      return currentChapter;
    }
    
    extractThemes(outlineData);
    return themes;
  } catch (error) {
    console.warn('Failed to load outline themes:', error);
    return {};
  }
}

async function loadProfiles(): Promise<{ [chapter: number]: Partial<PersonalityProfile> }> {
  const merged: { [chapter: number]: Partial<PersonalityProfile> } = {};
  
  for (const filename of SOURCE_FILES) {
    const filePath = path.join(__dirname, '../data', filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filename} not found, skipping...`);
      continue;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const profiles = Array.isArray(data) ? data : [data];
      
      for (const profile of profiles) {
        if (profile.chapter && typeof profile.chapter === 'number') {
          const chapter = profile.chapter;
          
          // Merge profiles (last-in wins but don't delete non-empty fields)
          if (!merged[chapter]) {
            merged[chapter] = {};
          }
          
          Object.keys(profile).forEach(key => {
            const existingValue = merged[chapter][key as keyof PersonalityProfile];
            const newValue = profile[key];
            
            // Only overwrite if existing value is empty/null/undefined
            if (!existingValue || 
                (Array.isArray(existingValue) && existingValue.length === 0) ||
                (typeof existingValue === 'string' && existingValue.trim() === '') ||
                (typeof existingValue === 'object' && Object.keys(existingValue).length === 0)) {
              merged[chapter][key as keyof PersonalityProfile] = newValue;
            }
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to parse ${filename}:`, error);
    }
  }
  
  return merged;
}

function generateDefaultTraits(chapter: number): { strengths: string[]; shadow: string[]; growth_focus: string[] } {
  return {
    strengths: [
      `Core strength related to chapter ${chapter}`,
      `Secondary strength for this personality`,
      `Tertiary strength characteristic`
    ],
    shadow: [
      `Primary shadow aspect for chapter ${chapter}`,
      `Secondary shadow tendency`,
      `Tertiary shadow pattern`
    ],
    growth_focus: [
      `Primary growth area for development`,
      `Secondary development focus`,
      `Tertiary growth opportunity`
    ]
  };
}

function generateDefaultScoringModel(chapter: number) {
  return {
    dimensions: {
      agency: Math.random() * 10,
      stability: Math.random() * 10,
      empathy: Math.random() * 10,
      openness: Math.random() * 10,
      orderliness: Math.random() * 10,
      novelty_seeking: Math.random() * 10,
      abstract_reasoning: Math.random() * 10,
      emotional_intensity: Math.random() * 10,
      social_dominance: Math.random() * 10,
      cooperativeness: Math.random() * 10,
      risk_tolerance: Math.random() * 10,
      conscientiousness: Math.random() * 10,
      adaptability: Math.random() * 10,
      imagination: Math.random() * 10
    },
    match_weights: {
      agency: 0.3,
      stability: 0.4,
      conscientiousness: 0.3
    },
    threshold: 0.7,
    top_signal_items: [`Q${chapter * 3 - 2}`, `Q${chapter * 3 - 1}`]
  };
}

async function repairProfiles(): Promise<PersonalityProfile[]> {
  const mergedProfiles = await loadProfiles();
  const outlineThemes = await loadOutlineThemes();
  const repairedProfiles: PersonalityProfile[] = [];
  const validationIssues: ValidationIssue[] = [];
  const createdProfiles: number[] = [];
  const repairedFields: { [chapter: number]: string[] } = {};
  const familyCounts: { [family: number]: number } = {};
  
  // Initialize family counts
  for (let i = 1; i <= 9; i++) {
    familyCounts[i] = 0;
  }
  
  for (let chapter = 1; chapter <= 360; chapter++) {
    const profile = mergedProfiles[chapter] || {};
    const repairs: string[] = [];
    
    // Compute canonical values
    const family_number = familyFromChapter(chapter);
    const idx40 = idx40FromChapter(chapter);
    const wing_bin = wingBinFromIdx40(idx40);
    const development_bin = devBinFromIdx40(idx40);
    const global_index = chapter;
    const id = idFromChapter(chapter);
    const hue_index = hueIndexFromChapter(chapter);
    
    // Create or repair position object
    if (!profile.position || 
        profile.position.family_number !== family_number ||
        profile.position.idx40 !== idx40 ||
        profile.position.wing_bin !== wing_bin ||
        profile.position.development_bin !== development_bin ||
        profile.position.global_index !== global_index) {
      profile.position = {
        family_number,
        idx40,
        wing_bin,
        development_bin,
        global_index
      };
      repairs.push('position');
    }
    
    // Repair basic fields
    if (!profile.id || profile.id !== id) {
      profile.id = id;
      repairs.push('id');
    }
    
    if (!profile.chapter || profile.chapter !== chapter) {
      profile.chapter = chapter;
      repairs.push('chapter');
    }
    
    // Ensure family matches canonical
    if (!profile.family || profile.family !== FAMILY_LABELS[family_number]) {
      profile.family = FAMILY_LABELS[family_number];
      repairs.push('family');
    }
    
    // Use outline theme if available
    if (outlineThemes[chapter]) {
      if (!profile.theme || profile.theme.includes('Theme_') || profile.theme.includes('Placeholder')) {
        profile.theme = outlineThemes[chapter];
        repairs.push('theme');
      }
      if (!profile.book_association?.chapter_theme || 
          profile.book_association?.chapter_theme.includes('Theme_')) {
        if (!profile.book_association) profile.book_association = {} as any;
        profile.book_association!.chapter_theme = outlineThemes[chapter];
        repairs.push('book_association.chapter_theme');
      }
    }
    
    // Ensure required book associations
    if (!profile.book_association) {
      profile.book_association = {
        nonfiction_series: "The Human Framework",
        fiction_series: "Laurasia",
        chapter_theme: profile.theme || `Chapter ${chapter} Theme`
      };
      repairs.push('book_association');
    } else {
      if (profile.book_association!.nonfiction_series !== "The Human Framework") {
        profile.book_association!.nonfiction_series = "The Human Framework";
        repairs.push('book_association.nonfiction_series');
      }
      if (profile.book_association!.fiction_series !== "Laurasia") {
        profile.book_association!.fiction_series = "Laurasia";
        repairs.push('book_association.fiction_series');
      }
    }
    
    // Repair enneagram link
    if (!profile.enneagram_link || profile.enneagram_link.family_number !== family_number) {
      profile.enneagram_link = {
        family_number,
        note: profile.enneagram_link?.note || `Mapped to Enneagram Type ${family_number} via canonical 9×40 grid.`
      };
      repairs.push('enneagram_link');
    }
    
    // Repair color alignment
    if (!profile.color_alignment || 
        profile.color_alignment.hue_index !== hue_index ||
        !profile.color_alignment.hsl ||
        !profile.color_alignment.rgb_hex) {
      const lightness = DEVELOPMENT_LIGHTNESS[development_bin as keyof typeof DEVELOPMENT_LIGHTNESS];
      const hsl = `${hue_index},62%,${lightness}%`;
      const rgb_hex = hslToHex(hue_index, 62, lightness);
      
      profile.color_alignment = {
        hue_index,
        hsl,
        rgb_hex,
        ...(profile.color_alignment?.name && { name: profile.color_alignment.name }),
        ...(profile.color_alignment?.palette_locked && { palette_locked: profile.color_alignment.palette_locked }),
        ...(profile.color_alignment?.palette_hex && { palette_hex: profile.color_alignment.palette_hex })
      };
      repairs.push('color_alignment');
    }
    
    // Ensure minimum trait arrays
    if (!profile.traits) {
      profile.traits = generateDefaultTraits(chapter);
      repairs.push('traits');
    } else {
      if (!profile.traits.strengths || profile.traits.strengths.length < 3) {
        const defaults = generateDefaultTraits(chapter);
        profile.traits.strengths = [...(profile.traits.strengths || [])];
        while (profile.traits.strengths.length < 3) {
          profile.traits.strengths.push(defaults.strengths[profile.traits.strengths.length]);
        }
        repairs.push('traits.strengths');
      }
      
      if (!profile.traits.shadow || profile.traits.shadow.length < 3) {
        const defaults = generateDefaultTraits(chapter);
        profile.traits.shadow = [...(profile.traits.shadow || [])];
        while (profile.traits.shadow.length < 3) {
          profile.traits.shadow.push(defaults.shadow[profile.traits.shadow.length]);
        }
        repairs.push('traits.shadow');
      }
      
      if (!profile.traits.growth_focus || profile.traits.growth_focus.length < 3) {
        const defaults = generateDefaultTraits(chapter);
        profile.traits.growth_focus = [...(profile.traits.growth_focus || [])];
        while (profile.traits.growth_focus.length < 3) {
          profile.traits.growth_focus.push(defaults.growth_focus[profile.traits.growth_focus.length]);
        }
        repairs.push('traits.growth_focus');
      }
    }
    
    // Ensure scoring model
    if (!profile.scoring_model) {
      profile.scoring_model = generateDefaultScoringModel(chapter);
      repairs.push('scoring_model');
    } else {
      if (!profile.scoring_model.top_signal_items || profile.scoring_model.top_signal_items.length < 2) {
        profile.scoring_model.top_signal_items = [`Q${chapter * 3 - 2}`, `Q${chapter * 3 - 1}`];
        repairs.push('scoring_model.top_signal_items');
      }
      
      // Ensure match_weights has the required schema fields
      if (!profile.scoring_model.match_weights || 
          profile.scoring_model.match_weights.agency === undefined ||
          profile.scoring_model.match_weights.stability === undefined ||
          profile.scoring_model.match_weights.conscientiousness === undefined) {
        profile.scoring_model.match_weights = {
          agency: 0.3,
          stability: 0.4,
          conscientiousness: 0.3
        };
        repairs.push('scoring_model.match_weights');
      }
    }
    
    // Ensure signals map
    if (!profile.signals_map) {
      profile.signals_map = {};
      profile.scoring_model.top_signal_items.forEach((item, index) => {
        profile.signals_map![item] = {
          dimension: index === 0 ? 'agency' : 'stability',
          polarity: 1
        };
      });
      repairs.push('signals_map');
    }
    
    // Provide defaults for missing required fields
    if (!profile.display_name || profile.display_name.includes('Placeholder')) {
      profile.display_name = `Chapter ${chapter} Personality`;
      repairs.push('display_name');
      createdProfiles.push(chapter);
    }
    
    if (!profile.theme) {
      profile.theme = `Chapter ${chapter} Theme`;
      repairs.push('theme');
    }
    
    if (!profile.summary || profile.summary.length < 10) {
      profile.summary = `This personality embodies the essence of Chapter ${chapter}, reflecting the core themes and lessons from The Human Framework. It integrates seamlessly with the Hero's Journey arc and provides guidance for personal development.`;
      repairs.push('summary');
    }
    
    if (!profile.daily_prompt || profile.daily_prompt.length < 5) {
      profile.daily_prompt = `How did you embody the essence of Chapter ${chapter} today?`;
      repairs.push('daily_prompt');
    }
    
    if (!profile.story_hook || profile.story_hook.length < 10) {
      profile.story_hook = `A scene in Laurasia where the themes of Chapter ${chapter} become a pivotal choice.`;
      repairs.push('story_hook');
    }
    
    // Track repairs and family counts
    if (repairs.length > 0) {
      repairedFields[chapter] = repairs;
    }
    
    familyCounts[family_number]++;
    
    // Validate the repaired profile
    try {
      const validatedProfile = ProfileSchema.parse(profile);
      repairedProfiles.push(validatedProfile);
    } catch (error: any) {
      validationIssues.push({
        chapter,
        field: 'general',
        message: error.message,
        severity: 'error'
      });
      
      // Still add the profile for debugging
      repairedProfiles.push(profile as PersonalityProfile);
    }
  }
  
  // Generate reports
  const report: RepairReport = {
    totalProfiles: repairedProfiles.length,
    validationIssues,
    createdProfiles,
    repairedFields,
    familyCounts
  };
  
  // Write output files
  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Write canonical profiles
  fs.writeFileSync(
    path.join(distDir, 'epic_arcana_personality_profiles_1-360_canonical.json'),
    JSON.stringify(repairedProfiles, null, 2)
  );
  
  // Write validation report
  fs.writeFileSync(
    path.join(distDir, 'validation_report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Write mapping summary
  const mappingSummary = `# LSA Builder Mapping Summary

## Profile Statistics
- Total profiles: ${report.totalProfiles}
- Created profiles: ${report.createdProfiles.length}
- Validation issues: ${report.validationIssues.length}

## Family Distribution
${Object.entries(report.familyCounts)
  .map(([family, count]) => `- Family ${family} (${FAMILY_LABELS[parseInt(family)]}): ${count} profiles`)
  .join('\n')}

## Repairs Summary
- Profiles repaired: ${Object.keys(report.repairedFields).length}
- Most common repairs: ${
  Object.values(report.repairedFields)
    .flat()
    .reduce((acc, repair) => {
      acc[repair] = (acc[repair] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
}

## Validation Issues
${report.validationIssues.length === 0 ? 'No validation issues found!' : 
  report.validationIssues.map(issue => 
    `- Chapter ${issue.chapter}: ${issue.field} - ${issue.message}`
  ).join('\n')}
`;
  
  fs.writeFileSync(
    path.join(distDir, 'mapping_summary.md'),
    mappingSummary
  );
  
  console.log(`Successfully processed ${repairedProfiles.length} profiles`);
  console.log(`Created ${createdProfiles.length} new profiles`);
  console.log(`Found ${validationIssues.length} validation issues`);
  
  return repairedProfiles;
}

// Run if called directly
if (require.main === module) {
  repairProfiles().catch(console.error);
}

export { repairProfiles };