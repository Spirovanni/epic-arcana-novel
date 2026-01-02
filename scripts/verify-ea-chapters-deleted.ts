#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { like } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verify() {
  const result = await db
    .select({ 
      id: chapters.id, 
      uniqueIdentifier: chapters.uniqueIdentifier, 
      title: chapters.title 
    })
    .from(chapters)
    .where(like(chapters.uniqueIdentifier, 'EA-%'));
  
  console.log(`Remaining chapters with unique_identifier starting with 'EA-': ${result.length}`);
  
  if (result.length > 0) {
    console.log('\nChapters still in database:');
    result.forEach(ch => {
      console.log(`  - ${ch.uniqueIdentifier}: ${ch.title || 'No title'}`);
    });
  } else {
    console.log('✅ All chapters with EA- unique_identifier have been deleted!');
  }
  
  process.exit(0);
}

verify().catch(console.error);

