#!/usr/bin/env tsx

/**
 * Master sync script to update database with l_outline.json data
 * This script ensures that l_outline.json is the source of truth
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCRIPTS_DIR = resolve(__dirname);

async function runScript(scriptPath: string, description: string) {
  console.log(`\n🔄 ${description}...`);
  console.log(`   Running: ${scriptPath}`);
  
  try {
    execSync(`tsx "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '..')
    });
    console.log(`✅ ${description} completed successfully!`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    throw error;
  }
}

async function syncFromOutline() {
  console.log('🚀 Starting comprehensive sync from l_outline.json');
  console.log('📋 This will update the database to match l_outline.json as the source of truth');
  console.log('⚠️  Any conflicting data in the database will be overwritten');
  
  try {
    // Run Epic Arcana sync (includes books, task masters, major task groups, and chapters)
    await runScript(
      resolve(SCRIPTS_DIR, 'sync-epic-arcana-from-outline.ts'),
      'Syncing ALL Epic Arcana data from l_outline.json'
    );
    
    console.log('\n🎉 All sync operations completed successfully!');
    console.log('📊 Database has been updated with l_outline.json data');
    console.log('🔄 l_outline.json is now the authoritative source of truth');
    
  } catch (error) {
    console.error('\n💥 Sync operation failed:', error);
    process.exit(1);
  }
}

// Run the master sync
syncFromOutline().catch(console.error);