#!/usr/bin/env node

import { program } from 'commander';
import * as readline from 'readline';
import { getForcedChoiceItems } from './items/items_forced.js';
import { getLikertItems } from './items/items_likert.js';
import { scoreAssessment } from './scoring/score_engine.js';
import { buildReport } from './report/build_report.js';
import { chapterFromAssessment, eaIdFromChapter, getCanonicalProfile } from './scoring/resolve.js';
import { AssessmentAnswers, ForcedChoiceAnswer, LikertAnswer } from './schema.js';

program
  .name('lsa-assessment')
  .description('Laurasian Scoring Assessment - Epic Arcana personality test')
  .version('1.0.0');

program
  .command('serve')
  .description('Start web UI server')
  .action(async () => {
    console.log('Starting LSA Assessment web server...');
    const { startServer } = await import('./server.js');
    startServer();
  });

program
  .command('run')
  .description('Run assessment in terminal')
  .action(async () => {
    await runTerminalAssessment();
  });

program
  .command('resolve')
  .description('Resolve type/wing/dev to EA profile')
  .option('--type <number>', 'Enneagram type (1-9)', parseInt)
  .option('--wing <number>', 'Wing bin (0-7)', parseInt)  
  .option('--dev <number>', 'Development bin (0-4)', parseInt)
  .action(async (options) => {
    if (!options.type || options.wing === undefined || options.dev === undefined) {
      console.error('All options required: --type <1-9> --wing <0-7> --dev <0-4>');
      process.exit(1);
    }
    
    const chapter = chapterFromAssessment({
      dominant_type: options.type,
      wing_bin: options.wing,
      development_bin: options.dev
    });
    
    const ea_id = eaIdFromChapter(chapter);
    const profile = await getCanonicalProfile(chapter);
    
    console.log(`\nChapter: ${chapter}`);
    console.log(`EA ID: ${ea_id}`);
    console.log(`Display Name: ${profile?.display_name || 'Unknown'}`);
    console.log(`Theme: ${profile?.theme || 'Unknown'}`);
    console.log(`Family: ${profile?.family || 'Unknown'}`);
  });

async function runTerminalAssessment() {
  console.log('\n🌟 Welcome to the Epic Arcana Personality Assessment 🌟');
  console.log('Discover your unique place among the 360 archetypes of Laurasia\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const forcedChoiceItems = getForcedChoiceItems();
  const likertItems = getLikertItems();
  
  const startTime = new Date().toISOString();
  const forcedChoiceAnswers: ForcedChoiceAnswer[] = [];
  const likertAnswers: LikertAnswer[] = [];

  // Forced choice section
  console.log('='.repeat(60));
  console.log('PART 1: STORY SCENARIOS (18 questions)');
  console.log('For each scenario, choose the option that MOST appeals to you (Best)');
  console.log('and the option that LEAST appeals to you (Worst)');
  console.log('='.repeat(60));

  for (let i = 0; i < forcedChoiceItems.length; i++) {
    const item = forcedChoiceItems[i];
    
    console.log(`\n[${i + 1}/${forcedChoiceItems.length}] ${item.location}`);
    console.log(`${item.vignette}\n`);
    
    item.options.forEach((option, index) => {
      console.log(`${index + 1}. ${option.label}`);
    });
    
    const best = await askQuestion(rl, '\nWhich option appeals to you MOST? (1-3): ');
    const worst = await askQuestion(rl, 'Which option appeals to you LEAST? (1-3): ');
    
    const bestNum = parseInt(best) - 1;
    const worstNum = parseInt(worst) - 1;
    
    if (bestNum >= 0 && bestNum < 3 && worstNum >= 0 && worstNum < 3 && bestNum !== worstNum) {
      forcedChoiceAnswers.push({
        itemId: item.id,
        best: bestNum,
        worst: worstNum
      });
    } else {
      console.log('Invalid choices, please try again.');
      i--; // Retry this question
    }
  }

  // Likert section
  console.log('\n' + '='.repeat(60));
  console.log('PART 2: PERSONAL STATEMENTS (36 questions)');
  console.log('Rate each statement from 1 (strongly disagree) to 5 (strongly agree)');
  console.log('='.repeat(60));

  for (let i = 0; i < likertItems.length; i++) {
    const item = likertItems[i];
    
    console.log(`\n[${i + 1}/${likertItems.length}] ${item.location}`);
    console.log(`"${item.statement}"\n`);
    console.log('1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree');
    
    const rating = await askQuestion(rl, 'Your rating (1-5): ');
    const ratingNum = parseInt(rating);
    
    if (ratingNum >= 1 && ratingNum <= 5) {
      likertAnswers.push({
        itemId: item.id,
        rating: ratingNum
      });
    } else {
      console.log('Invalid rating, please try again.');
      i--; // Retry this question
    }
  }

  rl.close();

  console.log('\n⚡ Processing your responses...');

  const endTime = new Date().toISOString();
  const answers: AssessmentAnswers = {
    forcedChoice: forcedChoiceAnswers,
    likert: likertAnswers,
    meta: {
      startTime,
      endTime,
      userAgent: 'CLI'
    }
  };

  try {
    const result = await scoreAssessment(answers, forcedChoiceItems, likertItems);
    const { jsonPath, markdownPath } = await buildReport(result);
    
    console.log('\n🎉 Assessment Complete! 🎉');
    console.log(`\nYour Epic Arcana ID: ${result.ea_id}`);
    console.log(`Chapter: ${result.chapter}`);
    console.log(`Dominant Type: ${result.dominant_type}`);
    console.log(`Color: ${result.color.rgb_hex}`);
    
    console.log(`\n📊 Reports generated:`);
    console.log(`JSON: ${jsonPath}`);
    console.log(`Markdown: ${markdownPath}`);
    
    console.log(`\n✨ Thank you for exploring your Epic Arcana profile! ✨`);
    
  } catch (error) {
    console.error('Error processing assessment:', error);
    process.exit(1);
  }
}

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

program.parse();