import { seedBook1ChapterGuidance } from './src/lib/seeds/seedBook1ChapterGuidance.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('🚀 Starting Book 1 Chapter Guidance Seeding...');
    
    const result = await seedBook1ChapterGuidance();
    
    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Results: ${result.success} successful, ${result.errors} errors`);
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

main(); 