import { AssessmentResult } from '../schema.js';
import { getCanonicalProfile } from '../scoring/resolve.js';
import { FAMILY_LABELS } from '../constants.js';
import * as fs from 'fs';
import * as path from 'path';

export async function buildReport(
  result: AssessmentResult,
  anonId: string = 'anonymous'
): Promise<{ jsonPath: string; markdownPath: string }> {
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const reportDir = path.join(process.cwd(), 'dist', 'reports');
  
  // Ensure reports directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const baseFileName = `${timestamp}_${anonId}`;
  const jsonPath = path.join(reportDir, `${baseFileName}.json`);
  const markdownPath = path.join(reportDir, `${baseFileName}.md`);
  
  // Get canonical profile
  const profile = await getCanonicalProfile(result.chapter);
  
  // Write JSON report
  const jsonReport = {
    ...result,
    canonical_profile: profile
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
  
  // Build Markdown report
  const markdownContent = await buildMarkdownReport(result, profile);
  fs.writeFileSync(markdownPath, markdownContent);
  
  return { jsonPath, markdownPath };
}

async function buildMarkdownReport(
  result: AssessmentResult,
  profile: any
): Promise<string> {
  
  const family = FAMILY_LABELS[Math.floor((result.chapter - 1) / 40) + 1];
  const instinctStack = getInstinctStack(result.instincts);
  
  return `# Epic Arcana Assessment Report

## Core Identity
- **EA ID**: ${result.ea_id}
- **Chapter**: ${result.chapter}
- **Display Name**: ${profile?.display_name || `${family} Explorer`}
- **Theme**: ${profile?.theme || `Exploring ${family.toLowerCase()}`}
- **Family**: ${family}

## Visual Identity
- **Color**: ${result.color.rgb_hex}
- **HSL**: ${result.color.hsl}

## Personality Profile

### Enneagram Type Probabilities
${Object.entries(result.type_probs)
  .sort(([,a], [,b]) => b - a)
  .map(([type, prob]) => `- **Type ${type}**: ${(prob * 100).toFixed(1)}% ${type === result.dominant_type.toString() ? '← **Dominant**' : ''}`)
  .join('\n')}

### Instinct Stack
**${instinctStack}**
- **Self-Preservation (SP)**: ${(result.instincts.SP * 100).toFixed(1)}%
- **Social (SO)**: ${(result.instincts.SO * 100).toFixed(1)}%
- **Sexual/One-to-One (SX)**: ${(result.instincts.SX * 100).toFixed(1)}%

### Development Pattern
- **Wing Bin**: ${result.wing_bin} (${getWingDescription(result.wing_bin)})
- **Development Bin**: ${result.development_bin} (${getDevelopmentDescription(result.development_bin)})

${profile?.strengths ? `
### Top 3 Strengths
${profile.strengths.slice(0, 3).map((s: string) => `- ${s}`).join('\n')}
` : ''}

${profile?.shadows ? `
### Shadow Aspects  
${profile.shadows.slice(0, 3).map((s: string) => `- ${s}`).join('\n')}
` : ''}

${profile?.growth_focus ? `
### Growth Focus Areas
${profile.growth_focus.slice(0, 3).map((s: string) => `- ${s}`).join('\n')}
` : ''}

## Dimensional Profile
${Object.entries(result.dimensions)
  .sort(([,a], [,b]) => b - a)
  .map(([dim, score]) => `- **${formatDimensionName(dim)}**: ${(score * 100).toFixed(0)}%`)
  .join('\n')}

## Key Assessment Signals
The following items had the strongest influence on your results:

${result.top_signal_items.map(itemId => `- ${itemId}`).join('\n')}

## Assessment Metadata
- **Duration**: ${result.meta.duration_sec} seconds
- **Form**: ${result.meta.form}
- **Version**: ${result.meta.version}
- **Generated**: ${new Date().toISOString()}

---

*This report represents your Epic Arcana personality profile based on the Laurasian Scoring Assessment (LSA). Each of the 360 chapters represents a unique combination of Enneagram type, wing development, and growth stage.*
`;
}

function getInstinctStack(instincts: { SP: number; SO: number; SX: number }): string {
  const sorted = Object.entries(instincts)
    .sort(([,a], [,b]) => b - a)
    .map(([key]) => key);
  
  return sorted.join(' > ');
}

function getWingDescription(wing_bin: number): string {
  const descriptions = [
    'Strong left-wing influence',
    'Moderate left-wing influence', 
    'Slight left-wing influence',
    'Minimal left-wing influence',
    'Minimal right-wing influence',
    'Slight right-wing influence',
    'Moderate right-wing influence',
    'Strong right-wing influence'
  ];
  
  return descriptions[wing_bin] || 'Unknown wing pattern';
}

function getDevelopmentDescription(development_bin: number): string {
  const descriptions = [
    'Emerging awareness',
    'Developing skills',
    'Applied competence',
    'Refined mastery', 
    'Transcendent integration'
  ];
  
  return descriptions[development_bin] || 'Unknown development stage';
}

function formatDimensionName(dim: string): string {
  return dim.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}