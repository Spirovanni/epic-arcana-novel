# LSA Builder

A comprehensive personality profile management system for Epic Arcana - a 360-profile personality assessment framework based on The Human Framework and integrated with the Laurasia fiction series.

## Overview

LSA Builder processes, validates, and manages 360 unique personality profiles organized into 9 Enneagram-based families, each containing 40 distinct personality variations. The system maps personality assessment results to specific profiles and ensures data integrity across the entire catalog.

### Key Features

- **360 Personality Profiles**: Complete catalog organized by chapters (1-360)
- **9-Family Structure**: Based on Enneagram types with 40 profiles each
- **Assessment Resolution**: Maps test results to specific personality profiles
- **Data Validation**: Schema-based validation with automatic repair
- **Multi-Source Integration**: Merges data from multiple JSON sources
- **Color & Theme Alignment**: Generates HSL/hex color codes and thematic associations

## Architecture

### Profile Structure
Each personality profile contains:
- **Position Data**: Family number, wing bin (0-7), development bin (0-4)
- **Identity**: Unique EA-ID, display name, theme, family classification
- **Traits**: Strengths, shadow aspects, growth focus areas
- **Associations**: Book series connections, chapter themes
- **Visual**: Color alignment with hue index, HSL, and hex values
- **Scoring**: Multi-dimensional personality scoring model
- **Engagement**: Daily prompts and story hooks

### Mapping System
```
Assessment Result → Chapter → Profile
(Type 1-9, Wing 0-7, Dev 0-4) → (1-360) → (Complete Profile)
```

## Installation

```bash
npm install
```

## Usage

### Build Process (Primary Command)
```bash
npm run build
```

Processes all source data and generates:
- `/dist/epic_arcana_personality_profiles_1-360_canonical.json` - Complete validated profiles
- `/dist/validation_report.json` - Detailed validation results  
- `/dist/mapping_summary.md` - Build statistics and family distribution

### Assessment Resolution
```bash
npm run cli resolve --type 8 --wing 3 --dev 4
```

**Parameters:**
- `--type`: Dominant Enneagram type (1-9)
- `--wing`: Wing bin classification (0-7)  
- `--dev`: Development level (0-4)

**Output:**
```
EA-ID: EA-339
Chapter: 339
Display Name: Warden of Winter Citadels
Theme: Steadfast Sovereignty
Family: Sovereignty / Protection
```

### Profile Validation
```bash
npm run cli validate --chapter 300
```

Validates and displays detailed information for a specific chapter's personality profile.

### Available Commands
```bash
npm run build       # Full build and validation process
npm run cli         # Interactive CLI interface
npm run test        # Run test suite
```

## Data Sources

The system processes multiple JSON data files from the `/data` directory:

- `epic_arcana_personalities_ch300-360.json` - Profiles for chapters 300-360
- `epic_arcana_personality_profiles_ch1-360_system_named.json` - System-named profiles
- `l_outline.json` - Chapter themes and outline structure
- Various chapter-range specific files (when available)

## Schema Validation

All profiles must conform to a strict TypeScript/Zod schema including:

### Required Fields
- **Position**: `family_number`, `idx40`, `wing_bin`, `development_bin`, `global_index`
- **Identity**: `id`, `chapter`, `display_name`, `theme`, `family`, `summary`
- **Traits**: Arrays of `strengths`, `shadow`, `growth_focus` (minimum 3 each)
- **Associations**: `book_association` with nonfiction/fiction series and chapter theme
- **Enneagram**: `enneagram_link` with family number and mapping note
- **Visual**: `color_alignment` with `hue_index`, `hsl`, `rgb_hex`
- **Scoring**: Complete `scoring_model` with 14 dimensions and match weights
- **Engagement**: `daily_prompt`, `story_hook`

### Color System
- **Hue Index**: 0-359 (maps to chapter - 1)
- **Saturation**: Fixed at 62%
- **Lightness**: Varies by development bin (74%, 68%, 60%, 52%, 46%)
- **Format**: `"hsl": "299,62%,46%"`, `"rgb_hex": "#A855C7"`

## Family Classifications

| Family # | Label | Description |
|----------|-------|-------------|
| 1 | Order / Systems | Structured, methodical personalities |
| 2 | Belonging / Care | Relationship-focused, supportive personalities |
| 3 | Ambition / Mastery | Achievement-oriented, goal-driven personalities |
| 4 | Authenticity / Expression | Creative, individualistic personalities |
| 5 | Insight / Knowledge | Analytical, knowledge-seeking personalities |
| 6 | Security / Loyalty | Security-focused, committed personalities |
| 7 | Freedom / Discovery | Adventure-seeking, optimistic personalities |
| 8 | Sovereignty / Protection | Power-focused, protective personalities |
| 9 | Harmony / Integration | Peace-seeking, harmonizing personalities |

## Development

### Project Structure
```
lsa-builder/
├── src/
│   ├── index.ts        # CLI interface and commands
│   ├── repair.ts       # Profile processing and validation
│   ├── mapping.ts      # Assessment-to-chapter mapping functions
│   ├── lookup.ts       # Profile resolution utilities
│   ├── schema.ts       # TypeScript/Zod validation schema
│   └── constants.ts    # Color conversion and family labels
├── data/               # Source JSON files
├── dist/               # Generated output files
├── test/               # Test files
└── package.json
```

### Key Functions

**Mapping Functions:**
```typescript
familyFromChapter(chapter: number): number
idx40FromChapter(chapter: number): number  
wingBinFromIdx40(idx40: number): number
devBinFromIdx40(idx40: number): number
chapterFromAssessment(result: AssessmentResult): number
```

**Lookup Functions:**
```typescript
resolveProfile(result: AssessmentResult): PersonalityProfile
getProfileByChapter(chapter: number): PersonalityProfile
getAllProfiles(): PersonalityProfile[]
```

### Testing
```bash
npm test
```

Tests cover the core mapping logic ensuring accurate assessment-to-chapter resolution.

## Output Files

### Generated Files
- **`epic_arcana_personality_profiles_1-360_canonical.json`**: Complete validated profile catalog
- **`validation_report.json`**: Detailed validation results and statistics  
- **`mapping_summary.md`**: Human-readable build summary

### Statistics (Latest Build)
- **Total Profiles**: 360
- **Validation Issues**: 0
- **Family Distribution**: 40 profiles per family (evenly distributed)
- **Created Profiles**: 299 (auto-generated with default content)
- **Source Profiles**: 61 (from existing data files)

## Error Handling

The system includes robust error handling and automatic repair for:
- Missing required fields (auto-generates defaults)
- Incomplete color alignments (calculates HSL/hex from hue index)
- Invalid scoring models (ensures required match_weights structure)
- Schema validation failures (detailed error reporting)

## Integration

This system is designed to integrate with:
- **The Human Framework**: Nonfiction personality development series
- **Laurasia**: Fiction series providing narrative context
- **Epic Arcana Assessment**: Personality testing application
- **Hero's Journey**: Character development framework

---

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test`
4. Build and validate: `npm run build`
5. Submit a pull request

For questions or support, please refer to the project documentation or create an issue.