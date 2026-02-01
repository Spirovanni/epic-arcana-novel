import * as fs from 'fs';
import * as path from 'path';

const OUTLINE_PATH = path.join(process.cwd(), 'data', 'l_outline.json');
const ENHANCED_SCENES_PATH = path.join(process.cwd(), 'scripts', 'ea-355-enhanced-scenes.json');
const BACKUP_PATH = path.join(process.cwd(), 'data', 'l_outline.backup.json');

interface Scene {
  scene_number: number;
  title: string;
  [key: string]: any;
}

interface OutlineStructure {
  [key: string]: any;
}

async function injectScenes() {
  try {
    console.log('Reading outline file...');
    const outlineContent = fs.readFileSync(OUTLINE_PATH, 'utf-8');
    const outline: OutlineStructure = JSON.parse(outlineContent);

    console.log('Reading enhanced scenes...');
    const enhancedScenesContent = fs.readFileSync(ENHANCED_SCENES_PATH, 'utf-8');
    const enhancedScenes: Scene[] = JSON.parse(enhancedScenesContent);

    console.log(`Loaded ${enhancedScenes.length} enhanced scenes for EA-355`);

    // Create backup
    console.log('Creating backup...');
    fs.writeFileSync(BACKUP_PATH, outlineContent, 'utf-8');
    console.log(`Backup created at ${BACKUP_PATH}`);

    // Find and update EA-355
    let found = false;
    function traverse(obj: any): boolean {
      if (obj && typeof obj === 'object') {
        if (obj.id === 'EA-355') {
          console.log('Found EA-355 chapter');
          console.log(`Current scene count: ${obj.scenes?.length || 0}`);
          
          obj.scenes = enhancedScenes;
          
          console.log(`Updated scene count: ${obj.scenes.length}`);
          console.log('Scene titles:');
          obj.scenes.forEach((scene: Scene, idx: number) => {
            console.log(`  ${idx + 1}. ${scene.title}`);
          });
          
          return true;
        }

        for (const key in obj) {
          if (traverse(obj[key])) {
            return true;
          }
        }
      }
      return false;
    }

    found = traverse(outline);

    if (!found) {
      console.error('ERROR: EA-355 chapter not found in outline');
      process.exit(1);
    }

    console.log('Writing updated outline...');
    fs.writeFileSync(OUTLINE_PATH, JSON.stringify(outline, null, 2), 'utf-8');
    console.log('✓ Successfully injected enhanced scenes into EA-355');
    console.log(`✓ Backup available at: ${BACKUP_PATH}`);

  } catch (error) {
    console.error('Error during injection:', error);
    process.exit(1);
  }
}

injectScenes();
