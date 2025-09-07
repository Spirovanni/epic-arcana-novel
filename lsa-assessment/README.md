# LSA Assessment - Laurasian Scoring Assessment

A complete, story-based personality assessment that maps results to exactly one of 360 Epic Arcana personalities. This system combines narrative vignettes from the mystical realm of Laurasia with scientific personality assessment techniques.

## Overview

The LSA Assessment delivers:
- **54 assessment items**: 18 forced-choice vignettes + 36 Likert scale statements  
- **Story-driven experience**: All items reference locations and themes from Laurasia
- **Precise mapping**: Results map to exactly one of 360 Epic Arcana personalities (9 Enneagram types × 40 subtypes each)
- **Standards-based scoring**: 14-dimension vector, 9-type probabilities, instinct stack
- **Rich reporting**: JSON + Markdown reports with detailed personality analysis

## Quick Start

```bash
# Install dependencies
npm install

# Run CLI assessment
npm run run

# Start web server  
npm run serve

# Resolve specific type/wing/dev combination
npm run resolve -- --type 5 --wing 3 --dev 1

# Run tests
npm test
```

## Assessment Structure

### Part 1: Forced Choice Scenarios (18 items)
Story-driven vignettes where users select their MOST and LEAST preferred responses from three options. Each scenario takes place in evocative Laurasian locations:

- Northern Gates of the Winter Citadels
- Archive of Quiet Stars  
- Garden of Reflecting Pools
- Moonlit Commons where paths converge
- And 14 more mystical locations...

Example:
> **Location**: Northern Gates of the Winter Citadels  
> **Scenario**: A breach opens in the icewall as night falls. The guard looks to you.
> 
> Choose MOST and LEAST preferred:
> 1. Seal the gate and take command, posting sentries in layered arcs
> 2. Gather the wardens and settlers to agree on a shared watch  
> 3. Blueprint the weak points and re-route flows through a backup gate

### Part 2: Likert Statements (36 items)
Personal reflection statements rated 1-5, contextualized within Laurasian settings:

> **Location**: Archive of Quiet Stars  
> **Statement**: "Before acting, I map patterns others miss, even under pressure from the council."

## Scoring System

### 14 Core Dimensions
- Agency, Stability, Empathy, Openness
- Orderliness, Novelty Seeking, Abstract Reasoning  
- Emotional Intensity, Social Dominance, Cooperativeness
- Risk Tolerance, Conscientiousness, Adaptability, Imagination

### 9 Enneagram Type Probabilities
Softmax-normalized probabilities across all nine types with dimension-to-type weighting matrix.

### Instinct Stack (SP/SO/SX)
Self-Preservation, Social, and Sexual/One-to-One instinct scoring.

### Canonical Mapping
```
Chapters 1-40: Type 1    |  Chapters 201-240: Type 6
Chapters 41-80: Type 2   |  Chapters 241-280: Type 7  
Chapters 81-120: Type 3  |  Chapters 281-320: Type 8
Chapters 121-160: Type 4 |  Chapters 321-360: Type 9
Chapters 161-200: Type 5 |
```

Each 40-chapter block subdivided by:
- **Wing bins (0-7)**: Adjacent type influence  
- **Development bins (0-4)**: Maturity/integration level

## File Structure

```
lsa-assessment/
├── src/
│   ├── schema.ts              # Zod schemas for type safety
│   ├── constants.ts           # Core constants and mappings  
│   ├── items/
│   │   ├── items_forced.ts    # 18 forced-choice vignettes
│   │   └── items_likert.ts    # 36 Likert statements
│   ├── scoring/
│   │   ├── dimensions.ts      # 14-dimension calculation
│   │   ├── types.ts          # Type probabilities + wing bins
│   │   ├── instincts.ts      # SP/SO/SX calculation  
│   │   ├── bins.ts           # Development bin calculation
│   │   ├── color.ts          # HSL color generation
│   │   ├── resolve.ts        # Chapter/EA ID mapping
│   │   └── score_engine.ts   # Main scoring orchestration
│   ├── report/
│   │   └── build_report.ts   # JSON + Markdown report generation
│   ├── cli.ts                # Command-line interface
│   └── server.ts             # Web server + UI
├── test/
│   ├── mapping.spec.ts       # Chapter mapping tests
│   └── scoring.spec.ts       # Scoring logic tests
├── data/                     # Input data files
└── dist/reports/            # Generated assessment reports
```

## API Usage

### Programmatic Scoring

```typescript
import { scoreAssessment } from './src/scoring/score_engine.js';
import { getForcedChoiceItems } from './src/items/items_forced.js';
import { getLikertItems } from './src/items/items_likert.js';

const forcedChoiceItems = getForcedChoiceItems();
const likertItems = getLikertItems();

const answers = {
  forcedChoice: [
    { itemId: 'L-FC-001', best: 0, worst: 1 }
    // ... more answers
  ],
  likert: [
    { itemId: 'L-LK-001', rating: 4 }
    // ... more answers  
  ],
  meta: {
    startTime: '2024-01-01T00:00:00Z',
    endTime: '2024-01-01T00:10:00Z',
    userAgent: 'MyApp/1.0'
  }
};

const result = await scoreAssessment(answers, forcedChoiceItems, likertItems);
console.log(result.ea_id);     // "EA-157"
console.log(result.chapter);   // 157  
console.log(result.color);     // { hsl: "hsl(156, 62%, 60%)", rgb_hex: "#3D9970" }
```

### Direct Chapter Resolution

```typescript  
import { chapterFromAssessment, getCanonicalProfile } from './src/scoring/resolve.js';

const chapter = chapterFromAssessment({
  dominant_type: 5,
  wing_bin: 3, 
  development_bin: 1
});

const profile = await getCanonicalProfile(chapter);
console.log(profile.display_name); // Full personality profile
```

## Web Interface

The web UI provides a beautiful, story-driven assessment experience with:

- Immersive Laurasian theming with mystical color palette
- Progress tracking through the 54 questions
- Interactive forced-choice selection (best/worst)
- 5-point Likert scale rating
- Real-time results display with color swatches
- Downloadable Markdown reports

Start the server with `npm run serve` and visit `http://localhost:3000`.

## CLI Interface  

### Run Full Assessment
```bash
npm run run
```
Interactive terminal assessment that walks through all 54 questions and generates reports.

### Start Web Server
```bash  
npm run serve
```

### Resolve Type Combination
```bash
npm run resolve -- --type 7 --wing 2 --dev 4
# Output: Chapter 298, EA-298, display name and theme
```

## Testing

```bash
npm test
```

Tests cover:
- ✅ Chapter boundary validation (1-360) 
- ✅ Round-trip mapping consistency
- ✅ Softmax probability normalization
- ✅ Dimension score ranges [0,1]
- ✅ Wing bin calculations (0-7)  
- ✅ Development bin calculations (0-4)
- ✅ Instinct normalization

## Data Files

The system can use these optional data files from `./data/`:

- `epic_arcana_personality_profiles_1-360_canonical.json` - Full canonical profiles (from lsa-builder)
- `l_outline.json` - Chapter theme outlines  
- `personality-assessment-cleaned.json` - Reference item bank

If canonical profiles are missing, the system computes basic profiles on-demand.

## Sample Output

### Assessment Result
```json
{
  "ea_id": "EA-187",
  "chapter": 187,
  "dominant_type": 5,
  "wing_bin": 2,
  "development_bin": 1, 
  "color": {
    "hsl": "hsl(186, 55%, 68%)",
    "rgb_hex": "#52C4B3",
    "hue_index": 186
  },
  "instincts": { "SP": 0.45, "SO": 0.32, "SX": 0.23 },
  "type_probs": {
    "5": 0.34, "4": 0.18, "6": 0.15, "1": 0.12, 
    "7": 0.09, "9": 0.05, "2": 0.04, "3": 0.02, "8": 0.01
  }
}
```

### Generated Report
```markdown
# Epic Arcana Assessment Report  

## Core Identity
- **EA ID**: EA-187
- **Chapter**: 187  
- **Display Name**: Insight Explorer 2.1
- **Family**: Insight / Knowledge
- **Instinct Stack**: SP > SO > SX

## Development Pattern  
- **Wing Bin**: 2 (Slight left-wing influence)
- **Development Bin**: 1 (Developing skills)

*Complete personality analysis with strengths, shadows, and growth focus...*
```

## Technical Details

- **TypeScript** with strict typing and Zod schema validation
- **ESM modules** with Node.js compatibility  
- **Express server** for web interface
- **Commander.js** for CLI functionality
- **Vitest** for unit testing
- **No external personality libraries** - custom implementation

## Version

1.0.0 - Initial release of the complete LSA Assessment system

---

*Discover your Epic Arcana. Journey through Laurasia. Uncover your unique place among the 360.*