import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const LORE_PATH = path.join(process.cwd(), 'lore');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

async function extractColorsFromOutline() {
  console.log('🎨 Extracting color data from outline...');
  const outlineData = await loadJSON(path.join(LORE_PATH, 'l_outline.json'));
  
  const colorMap = new Map(); // chapterNumber -> color data
  
  // Navigate through the outline to find chapter color data
  const seriesData = outlineData.SelfImprovementSeries;
  if (!seriesData || !seriesData.Books) {
    console.log('⚠️  No books data found in outline');
    return colorMap;
  }
  
  // Search through all trilogies and books
  for (const trilogyKey in seriesData.Books.trilogies) {
    const trilogy = seriesData.Books.trilogies[trilogyKey];
    
    if (trilogy.trilogy_books) {
      for (const bookKey in trilogy.trilogy_books) {
        const book = trilogy.trilogy_books[bookKey];
        
        // Navigate through task masters to find chapters
        if (book.task_masters) {
          for (const taskMasterKey in book.task_masters) {
            const taskMaster = book.task_masters[taskMasterKey];
            
            if (taskMaster.major_task_groups) {
              for (const majorGroupKey in taskMaster.major_task_groups) {
                const majorGroup = taskMaster.major_task_groups[majorGroupKey];
                
                if (majorGroup.Specific_task_groups) {
                  for (const specificGroupKey in majorGroup.Specific_task_groups) {
                    const specificGroup = majorGroup.Specific_task_groups[specificGroupKey];
                    
                    // Extract chapter number and color data
                    if (specificGroup.chapter) {
                      const chapterMatch = specificGroup.chapter.match(/Chapter (\d+)/);
                      if (chapterMatch && specificGroup.hex_code) {
                        const chapterNum = parseInt(chapterMatch[1]);
                        const rgb = hexToRgb(specificGroup.hex_code);
                        
                        colorMap.set(chapterNum, {
                          colorName: specificGroup.color_name,
                          hexCode: specificGroup.hex_code,
                          red: rgb?.r || specificGroup.red || 128,
                          green: rgb?.g || specificGroup.green || 128,
                          blue: rgb?.b || specificGroup.blue || 128
                        });
                        
                        console.log(`  Chapter ${chapterNum}: ${specificGroup.color_name} (${specificGroup.hex_code})`);
                      }
                    }
                    
                    // Check for major activity themes
                    if (specificGroup.major_activity_theme_1) {
                      const majorActivity = specificGroup.major_activity_theme_1;
                      if (majorActivity.chapter && majorActivity.hex_code) {
                        const chapterMatch = majorActivity.chapter.match(/Chapter (\d+)/);
                        if (chapterMatch) {
                          const chapterNum = parseInt(chapterMatch[1]);
                          const rgb = hexToRgb(majorActivity.hex_code);
                          
                          colorMap.set(chapterNum, {
                            colorName: majorActivity.color_name,
                            hexCode: majorActivity.hex_code,
                            red: rgb?.r || majorActivity.red || 128,
                            green: rgb?.g || majorActivity.green || 128,
                            blue: rgb?.b || majorActivity.blue || 128
                          });
                          
                          console.log(`  Chapter ${chapterNum}: ${majorActivity.color_name} (${majorActivity.hex_code})`);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  console.log(`🎨 Found color data for ${colorMap.size} chapters`);
  return colorMap;
}

// Define default color mapping for all 40 chapters if not found in outline
function getDefaultChapterColors() {
  const colorMap = new Map();
  
  const defaultColors = [
    { name: "Scarlet", hex: "#FF2400", r: 255, g: 36, b: 0 },
    { name: "Crimson", hex: "#DC143C", r: 220, g: 20, b: 60 },
    { name: "Azure", hex: "#007FFF", r: 0, g: 127, b: 255 },
    { name: "Emerald", hex: "#50C878", r: 80, g: 200, b: 120 },
    { name: "Amber", hex: "#FFBF00", r: 255, g: 191, b: 0 },
    { name: "Violet", hex: "#8B00FF", r: 139, g: 0, b: 255 },
    { name: "Orange", hex: "#FFA500", r: 255, g: 165, b: 0 },
    { name: "Teal", hex: "#008080", r: 0, g: 128, b: 128 },
    { name: "Rose", hex: "#FF007F", r: 255, g: 0, b: 127 },
    { name: "Gold", hex: "#FFD700", r: 255, g: 215, b: 0 },
    { name: "Indigo", hex: "#4B0082", r: 75, g: 0, b: 130 },
    { name: "Coral", hex: "#FF7F50", r: 255, g: 127, b: 80 },
    { name: "Turquoise", hex: "#40E0D0", r: 64, g: 224, b: 208 },
    { name: "Magenta", hex: "#FF00FF", r: 255, g: 0, b: 255 },
    { name: "Lime", hex: "#00FF00", r: 0, g: 255, b: 0 },
    { name: "Sapphire", hex: "#0F52BA", r: 15, g: 82, b: 186 },
    { name: "Ruby", hex: "#E0115F", r: 224, g: 17, b: 95 },
    { name: "Jade", hex: "#00A86B", r: 0, g: 168, b: 107 },
    { name: "Topaz", hex: "#FFC87C", r: 255, g: 200, b: 124 },
    { name: "Amethyst", hex: "#9966CC", r: 153, g: 102, b: 204 },
    { name: "Copper", hex: "#B87333", r: 184, g: 115, b: 51 },
    { name: "Silver", hex: "#C0C0C0", r: 192, g: 192, b: 192 },
    { name: "Platinum", hex: "#E5E4E2", r: 229, g: 228, b: 226 },
    { name: "Bronze", hex: "#CD7F32", r: 205, g: 127, b: 50 },
    { name: "Pearl", hex: "#F0EAD6", r: 240, g: 234, b: 214 },
    { name: "Opal", hex: "#A8C3BC", r: 168, g: 195, b: 188 },
    { name: "Onyx", hex: "#353839", r: 53, g: 56, b: 57 },
    { name: "Diamond", hex: "#B9F2FF", r: 185, g: 242, b: 255 },
    { name: "Obsidian", hex: "#3C4142", r: 60, g: 65, b: 66 },
    { name: "Quartz", hex: "#D9D9D9", r: 217, g: 217, b: 217 },
    { name: "Garnet", hex: "#733635", r: 115, g: 54, b: 53 },
    { name: "Beryl", hex: "#7FFFD4", r: 127, g: 255, b: 212 },
    { name: "Citrine", hex: "#E4D00A", r: 228, g: 208, b: 10 },
    { name: "Peridot", hex: "#E6E200", r: 230, g: 226, b: 0 },
    { name: "Alexandrite", hex: "#93527F", r: 147, g: 82, b: 127 },
    { name: "Moonstone", hex: "#3AA8C1", r: 58, g: 168, b: 193 },
    { name: "Labradorite", hex: "#6E7F94", r: 110, g: 127, b: 148 },
    { name: "Malachite", hex: "#0BDA51", r: 11, g: 218, b: 81 },
    { name: "Lapis", hex: "#26619C", r: 38, g: 97, b: 156 },
    { name: "Celestite", hex: "#87CEEB", r: 135, g: 206, b: 235 }
  ];
  
  for (let i = 1; i <= 40; i++) {
    const color = defaultColors[i - 1];
    colorMap.set(i, {
      colorName: color.name,
      hexCode: color.hex,
      red: color.r,
      green: color.g,
      blue: color.b
    });
  }
  
  return colorMap;
}

async function updateChapterColors() {
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('Connecting to database...');
    
    // Get color data from outline
    let outlineColors = await extractColorsFromOutline();
    
    // Get default colors for chapters not found in outline
    const defaultColors = getDefaultChapterColors();
    
    // Merge outline colors with defaults
    const colorMap = new Map([...defaultColors, ...outlineColors]);
    
    console.log(`\n🎨 Using colors for ${colorMap.size} chapters`);
    
    // Get all chapters that need color updates
    const allChapters = await db.select().from(schema.chapters);
    
    console.log(`\n📚 Found ${allChapters.length} chapters to update`);
    
    let updatedCount = 0;
    
    for (const chapter of allChapters) {
      const colorData = colorMap.get(chapter.chapterNumber);
      
      if (colorData) {
        // Update chapter with correct colors
        await db
          .update(schema.chapters)
          .set({
            colorName: colorData.colorName,
            hexCode: colorData.hexCode,
            red: colorData.red,
            green: colorData.green,
            blue: colorData.blue
          })
          .where(eq(schema.chapters.id, chapter.id));
        
        updatedCount++;
        
        if (updatedCount <= 10) {
          console.log(`  ✅ Chapter ${chapter.chapterNumber}: ${colorData.colorName} (${colorData.hexCode})`);
        }
      }
    }
    
    if (updatedCount > 10) {
      console.log(`  ✅ Updated ${updatedCount} chapters with proper colors`);
    }
    
    console.log(`\n🎉 Successfully updated colors for ${updatedCount} chapters!`);
    
  } catch (error) {
    console.error('❌ Error updating chapter colors:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    console.log('🚀 Starting to fix chapter colors...\n');
    
    await updateChapterColors();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();