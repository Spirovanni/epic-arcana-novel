import { promises as fs } from 'fs';
import path from 'path';

const LORE_PATH = path.join(process.cwd(), 'lore');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function exploreStructure() {
  console.log('Reading l_outline.json file...');
  const outlineData = await loadJSON(path.join(LORE_PATH, 'l_outline.json'));
  
  // Navigate to the SelfImprovementSeries structure
  const seriesData = outlineData.SelfImprovementSeries;
  const book1Data = seriesData.Books?.trilogies?.["1st_trilogy"]?.trilogy_books?.Book1;
  
  console.log(`Found Book 1: ${book1Data.title}`);

  // Let's explore the task_masters structure
  const taskMaster1 = book1Data.task_masters?.task_master_1;
  console.log('\nTask Master 1 keys:', Object.keys(taskMaster1 || {}));
  
  const majorGroup1 = taskMaster1?.major_task_groups?.major_task_group_1;
  console.log('\nMajor Group 1 keys:', Object.keys(majorGroup1 || {}));
  
  const specificGroup1 = majorGroup1?.Specific_task_groups?.specific_task_group_1;
  console.log('\nSpecific Group 1 keys:', Object.keys(specificGroup1 || {}));
  
  // Check for chapter 13 references anywhere in the structure
  console.log('\n--- Searching for Chapter 13 references ---');
  
  function searchForChapter13(obj, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string' && value.includes('Chapter 13')) {
          console.log(`Found "Chapter 13" at: ${currentPath} = "${value}"`);
        }
        
        if (key.toLowerCase().includes('chapter') && value === 13) {
          console.log(`Found chapter number 13 at: ${currentPath} = ${value}`);
        }
        
        if (typeof value === 'object') {
          searchForChapter13(value, currentPath);
        }
      }
    }
  }
  
  searchForChapter13(book1Data, 'Book1');
}

exploreStructure().catch(console.error);