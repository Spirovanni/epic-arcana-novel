#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const MEDIA_DIR = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/public/icons/chapters/xl/media';
const CHAPTERS_DIR = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/public/icons/chapters';

async function organizeIcons() {
  console.log('Starting icon organization...');
  
  try {
    // Get all image files from the media directory
    const files = await fs.readdir(MEDIA_DIR);
    const imageFiles = files
      .filter(file => file.match(/^image\d+\.png$/))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)[0]);
        const bNum = parseInt(b.match(/\d+/)[0]);
        return aNum - bNum;
      });

    console.log(`Found ${imageFiles.length} image files`);

    let imageIndex = 0;
    
    // Process each book (1-9)
    for (let book = 1; book <= 9; book++) {
      console.log(`Processing Book ${book}...`);
      
      // Process each chapter (1-40)
      for (let chapter = 1; chapter <= 40; chapter++) {
        if (imageIndex >= imageFiles.length) {
          console.log(`Warning: Ran out of images at Book ${book}, Chapter ${chapter}`);
          break;
        }

        const sourceFile = path.join(MEDIA_DIR, imageFiles[imageIndex]);
        const targetDir = path.join(CHAPTERS_DIR, `book${book}`);
        const targetFile = path.join(targetDir, `chapter${chapter}.png`);

        try {
          // Copy the image to the correct location
          await fs.copyFile(sourceFile, targetFile);
          console.log(`✓ Copied ${imageFiles[imageIndex]} → book${book}/chapter${chapter}.png`);
        } catch (error) {
          console.error(`✗ Failed to copy ${imageFiles[imageIndex]}:`, error.message);
        }

        imageIndex++;
      }
      
      if (imageIndex >= imageFiles.length) {
        console.log(`Finished processing all ${imageFiles.length} images`);
        break;
      }
    }

    // Report any remaining images
    if (imageIndex < imageFiles.length) {
      console.log(`\nRemaining images (${imageFiles.length - imageIndex}):`);
      for (let i = imageIndex; i < imageFiles.length; i++) {
        console.log(`  - ${imageFiles[i]}`);
      }
    }

    console.log('\nIcon organization completed!');
    
    // Clean up extracted files
    console.log('Cleaning up temporary extraction files...');
    await fs.rm(path.join(CHAPTERS_DIR, 'xl'), { recursive: true, force: true });
    await fs.rm(path.join(CHAPTERS_DIR, '_rels'), { recursive: true, force: true });
    await fs.rm(path.join(CHAPTERS_DIR, 'docProps'), { recursive: true, force: true });
    await fs.unlink(path.join(CHAPTERS_DIR, '[Content_Types].xml')).catch(() => {});
    await fs.unlink(path.join(CHAPTERS_DIR, 'Mini-icons.zip')).catch(() => {});
    
    console.log('Cleanup completed!');

  } catch (error) {
    console.error('Error during organization:', error);
    process.exit(1);
  }
}

// Run the organization
organizeIcons();