#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { repairProfiles } from './repair';
import { resolveProfile } from './lookup';
import { eaIdFromAssessment, chapterFromAssessment } from './mapping';

yargs(hideBin(process.argv))
  .command('build', 'Runs repair/merge/validate/write outputs', {}, async () => {
    try {
      console.log('Starting LSA Builder...');
      await repairProfiles();
      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  })
  .command('resolve', 'Prints the EA-ID, chapter, and display_name for assessment result', {
    type: {
      description: 'Dominant type (1-9)',
      type: 'number' as const,
      demandOption: true,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    wing: {
      description: 'Wing bin (0-7)', 
      type: 'number' as const,
      demandOption: true,
      choices: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    dev: {
      description: 'Development bin (0-4)',
      type: 'number' as const,
      demandOption: true,
      choices: [0, 1, 2, 3, 4]
    }
  }, (argv) => {
    try {
      const assessmentResult = {
        dominant_type: argv.type as 1|2|3|4|5|6|7|8|9,
        wing_bin: argv.wing,
        development_bin: argv.dev
      };
      
      const eaId = eaIdFromAssessment(assessmentResult);
      const chapter = chapterFromAssessment(assessmentResult);
      const profile = resolveProfile(assessmentResult);
      
      console.log(`EA-ID: ${eaId}`);
      console.log(`Chapter: ${chapter}`);
      console.log(`Display Name: ${profile?.display_name || 'Profile not found'}`);
      
      if (profile) {
        console.log(`Theme: ${profile.theme}`);
        console.log(`Family: ${profile.family}`);
      }
    } catch (error) {
      console.error('❌ Resolution failed:', error);
      process.exit(1);
    }
  })
  .command('validate', 'Validate a specific chapter profile', {
    chapter: {
      description: 'Chapter number (1-360)',
      type: 'number' as const,
      demandOption: true
    }
  }, async (argv) => {
    try {
      const profiles = await repairProfiles();
      const profile = profiles.find(p => p.chapter === argv.chapter);
      
      if (!profile) {
        console.log(`❌ Chapter ${argv.chapter} not found`);
        return;
      }
      
      console.log(`✅ Chapter ${argv.chapter} validation:`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Display Name: ${profile.display_name}`);
      console.log(`   Theme: ${profile.theme}`);
      console.log(`   Family: ${profile.family} (Type ${profile.position.family_number})`);
      console.log(`   Position: idx40=${profile.position.idx40}, wing=${profile.position.wing_bin}, dev=${profile.position.development_bin}`);
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  })
  .demandCommand(1, 'Please specify a command')
  .strict()
  .help()
  .argv;