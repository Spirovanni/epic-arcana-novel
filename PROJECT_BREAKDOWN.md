# Epic Arcana Novel - Comprehensive Project Breakdown

**Last Updated:** February 14, 2026
**Version:** 1.0.4
**Repository:** `/Users/xaviermartinez/dev/cursor/epic-arcana-novel`

---

## 1. Project Overview

Epic Arcana Novel is a full-stack web application and content-management pipeline for **Laurasia**, a 9-book fantasy/fiction novel series spanning 360 chapters and 1,281 scenes. The project serves two purposes:

1. **Novel Outlining Engine** - A structured pipeline that transforms raw chapter metadata into story-heavy, scene-level outlines with active antagonism, parable-encoded themes, and Hero's Journey/Save the Cat beat integration.
2. **Interactive Web Application** - A Next.js web app with user authentication, personality assessments, character arc visualization, timeline exploration, and chapter-by-chapter reading/writing guidance.

The narrative follows **Francisco**, a cosmic reconciler navigating a universe governed by the Record Keepers (deterministic antagonists who "edit" reality). All underlying Human Framework concepts (self-improvement, leadership, psychology) are encoded as **parable, symbol, choice, and consequence** - never as direct advice.

---

## 2. Novel Structure

### 2.1 Series Architecture

| Trilogy | Books | Chapters | Description |
|---------|-------|----------|-------------|
| **1st Trilogy** | Book 1, 2, 3 | EA-001 to EA-104 | Foundation arc (37 + 27 + 40 chapters) |
| **2nd Trilogy** | Book 4, 5, 6 | EA-105 to EA-240 | Escalation arc (40 + 40 + 40 chapters) |
| **3rd Trilogy** | Book 7, 8, 9 | EA-241 to EA-360 | Resolution arc (38 + 40 + 40 chapters + 9 supplementary) |

### 2.2 Hierarchical Organization

Each book is organized into a nested hierarchy:

```
Novel Series
  -> Trilogy (1st, 2nd, 3rd)
    -> Book (1-9)
      -> Task Master (organizational sections)
        -> Major Task Group (thematic clusters)
          -> Specific Task Group = Chapter (EA-001 to EA-360)
            -> Scenes (3-5 per chapter)
```

### 2.3 Scene Count Summary

| Metric | Count |
|--------|-------|
| Total Books | 9 |
| Total Chapters | 360 |
| Total Scenes | 1,281 |
| Average Scenes/Chapter | ~3.6 |

### 2.4 Story Beats Integration

Every chapter maps to dual story-structure frameworks:

- **Hero's Journey** (Joseph Campbell): Ordinary World, Call to Adventure, Refusal of the Call, Supernatural Aid, Crossing the Threshold, etc.
- **Save the Cat** (Blake Snyder): Opening Image, Catalyst, Debate, Break into Two, B Story, etc.

### 2.5 Tarot Encoding

Each chapter has a Tarot card assignment (family + item) used as symbolic encoding:

- **Families:** Cups, Wands, Swords, Disks
- **Items:** Ace through King
- **Purpose:** Encodes thematic resonance without explicit exposition

---

## 3. Tech Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.6 | React framework (App Router) |
| **React** | 19.1.2 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **Radix UI** | Various | Accessible component primitives (Dialog, Tabs, Select, Accordion, etc.) |
| **Framer Motion** | 12.23.0 | Animations |
| **Three.js / React Three Fiber** | 0.178 / 9.3 | 3D character arc visualization |
| **Recharts** | 3.6.0 | Data visualization charts |
| **Lucide React** | 0.544 | Icon system |
| **Sonner** | 2.0.7 | Toast notifications |
| **Vaul** | 1.1.2 | Drawer component |
| **cmdk** | 1.1.1 | Command palette |
| **next-themes** | 0.4.6 | Dark/light mode |
| **Zustand** | 4.4.7 | Client state management |
| **React Hook Form + Zod** | 7.64 / 3.23 | Form handling and validation |
| **React DnD** | 16.0.1 | Drag and drop |

### 3.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.3.6 | Serverless API endpoints (30+ routes) |
| **Drizzle ORM** | 0.44.2 | Type-safe PostgreSQL ORM |
| **Drizzle Kit** | 0.31.4 | Database migration tooling |
| **PostgreSQL (Neon)** | Serverless | Cloud database (Neon serverless Postgres) |
| **Clerk** | 6.23.3 | Authentication and user management |
| **Stripe** | 16.12.0 | Payment processing / membership tiers |
| **Svix** | 1.37.0 | Webhook management |

### 3.3 AI / LLM Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Anthropic SDK** | 0.52.0 | Claude AI integration |
| **OpenAI SDK** | 5.0.1 | GPT integration |
| **DeepSeek SDK** | 0.0.2 | DeepSeek model integration |

### 3.4 Data Pipeline / Tooling

| Technology | Version | Purpose |
|------------|---------|---------|
| **tsx** | 4.20.3 | TypeScript script execution |
| **ts-node** | 10.9.2 | TypeScript REPL / script runner |
| **Python 3** | System | JSON injection scripts, data extraction |
| **pdf-lib** | 1.17.1 | PDF generation |
| **dotenv** | 16.5.0 | Environment variable management |
| **Task Master AI** | 0.37.2 | Task management (dev dependency) |

### 3.5 Testing & Quality

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 1.6.1 | Unit testing framework |
| **ESLint** | 9.x | Code linting |
| **TypeScript** | 5.x | Static type checking |

### 3.6 Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Deployment platform |
| **Neon** | Serverless PostgreSQL database |
| **Clerk** | Auth provider |
| **Stripe** | Payment provider |
| **Git** | Version control |

---

## 4. Database Schema

The Neon PostgreSQL database contains **35+ tables** managed through Drizzle ORM (1,099-line schema file). Key table groups:

### 4.1 Novel Content Tables

| Table | Purpose |
|-------|---------|
| `novel_series` | Top-level series metadata |
| `books` | 9 books with themes, Enneagram types, Covey habits |
| `task_masters` | Organizational sections within books |
| `major_task_groups` | Thematic clusters within sections |
| `chapters` | 360 chapters with full metadata (tarot, color, focus area, character arcs, books influenced by) |
| `chapter_pages` | Written chapter page content |
| `chapter_tasks` | Task tracking per chapter |
| `scenes` | 1,281 scenes with 40+ fields per scene |

### 4.2 Scene Fields (Enhanced)

Each scene record contains approximately 40 fields:

**Core Fields:**
- `title`, `sceneNumber`, `focus`, `description`
- `chapterSceneFocus`, `preliminarySceneFocus`, `preliminarySceneDescription`

**Structure Fields:**
- `setup`, `sensoryDetail`, `internalConflict`, `beatGoal`
- `pages`, `symbolism`, `narrativeFunction`

**Timeline/Location Fields:**
- `location`, `timeline_variant`, `timeline_date`
- `timelineSignificance`, `chronologicalSequence`, `storySequence`

**Enhanced Fields (EA-123+):**
- `characterGrowthElement`, `seriesConnectionResonance`
- `sceneCardProgression`, `realWorldContext`
- `saveTheCatBeat`, `temporalPowerManifested`
- `sudowrite_metadata` (JSONB), `learning_objectives` (JSONB)

### 4.3 World-Building Tables

| Table | Purpose |
|-------|---------|
| `characters` | Character profiles (type, pronouns, personality, evolution, AI prompts) |
| `character_affinities` | Character-to-Trionfi card connections |
| `trionfi_cards` | Tarot-like card system (Major/Minor arcana) |
| `locations` | World locations with coordinates, factions, lore |
| `symbolic_objects` | Named artifacts and their thematic roles |
| `military_orders` | Factional military organizations |
| `timeline_events` | Historical and mythic timeline events |

### 4.4 Temporal World Tables

| Table | Purpose |
|-------|---------|
| `zanetti_train_components` | The Zanetti temporal train system |
| `temporal_stations` | Major/minor temporal stops |
| `temporal_technology` | Chronological devices and equipment |
| `temporal_economy` | Economic systems |
| `temporal_law` | Legal and governance frameworks |
| `temporal_education` | Training programs and research institutions |

### 4.5 User & Assessment Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (Clerk integration, membership tiers) |
| `app_users` | Application user profiles |
| `webhook_events` | Clerk webhook processing |
| `pos_assessments` | Personality assessment sessions |
| `pos_assessment_answers` | Individual assessment responses |
| `pos_assessment_results` | Computed personality results |
| `assessment_sessions_v2` | V2 assessment system |
| `assessment_answers_v2` | V2 answer storage |
| `assessment_results_v2` | V2 computed results |

---

## 5. Application Features

### 5.1 Web Application Pages

| Route | Feature |
|-------|---------|
| `/` | Landing page |
| `/books` | Book browser |
| `/chapters` | Chapter explorer |
| `/scenes` | Scene viewer |
| `/characters` | Character profiles |
| `/timeline` / `/timelines` | Timeline visualization |
| `/outline` | Book outline viewer |
| `/dashboard` | User dashboard |
| `/assessment` | Personality assessment |
| `/pos` | POS assessment |
| `/results` | Assessment results |
| `/personality` / `/personalities` | Personality profiles |
| `/profile` | User profile |
| `/settings` | User settings |
| `/calendar` | HF Calendar |
| `/careers` | Career pathways |
| `/admin` | Admin panel |
| `/landing` | Marketing landing |
| `/trilogies` | Trilogy overview |
| `/neon-shield` | Feature page |

### 5.2 API Endpoints (30+ routes)

| Category | Endpoints |
|----------|-----------|
| **Books & Chapters** | `/api/books`, `/api/chapters`, `/api/outline` |
| **Scenes** | `/api/scenes` |
| **Characters** | `/api/characters`, `/api/character-arcs-3d` |
| **Assessment** | `/api/assessment/start`, `/api/assessment/question`, `/api/assessment/score`, `/api/assessment/calculate-results`, `/api/assessment/resume` |
| **POS Assessment** | `/api/pos` |
| **User System** | `/api/user-journey`, `/api/user-assignments`, `/api/settings`, `/api/profiles` |
| **World Building** | `/api/locations`, `/api/timeline`, `/api/day-signs` |
| **Admin** | `/api/admin/characters`, `/api/setup/*` |
| **Infrastructure** | `/api/health`, `/api/webhooks`, `/api/clerk`, `/api/billing` |
| **Content** | `/api/dashboard`, `/api/learning-objectives`, `/api/personalities`, `/api/hf-calendar` |
| **Import/Export** | `/api/import-export`, `/api/overrides` |

### 5.3 Feature Modules

| Feature | Technology | Description |
|---------|-----------|-------------|
| **3D Character Arcs** | Three.js / React Three Fiber | Interactive 3D visualization of character evolution |
| **World Map** | SVG + Canvas | Interactive map with region extraction, coordinate systems |
| **Location Explorer** | Image + Data | Location browsing with AI-generated images |
| **Assessment Engine** | Custom scoring | Multi-dimensional personality assessment with Likert/forced-choice items |
| **Personal Style** | Template engine | Personalized style recommendations based on assessment results |
| **Membership System** | Stripe + Clerk | Tiered access (free, basic, premium, ultimate) |

---

## 6. Scene Pipeline (Content Generation)

### 6.1 Pipeline Overview

The core content-creation workflow transforms raw chapter metadata into story-heavy enhanced scenes:

```
l_outline.json (source of truth)
    |
    v
[Read Chapter Metadata]
    |
    v
[Create Enhanced Scenes JSON] -> scripts/ea-<N>-enhanced-scenes.json
    |
    v
[Inject into Outline] -> scripts/inject-ea-<N>-scenes.py
    |
    v
[Import to Neon DB] -> npx tsx scripts/import-scenes-to-existing-chapters.ts <N>
    |
    v
[Verify Import] -> scripts/verify-ea-<N>-simple.ts
    |
    v
[Confirmed in Database]
```

### 6.2 Pipeline Artifacts

| Artifact | Count | Purpose |
|----------|-------|---------|
| Enhanced Scene JSONs | 242 files | Scene data per chapter |
| Injection Scripts (Python) | 82 files | Safe JSON outline updates |
| Verification Scripts (TypeScript) | 282 files | Import validation |
| Outline Backups | 35+ files | `l_outline.backup-EA-*.json` snapshots |

### 6.3 Scene Formatting Standards (5 Critical Fields)

Every scene must conform to these exact patterns:

| Field | Format | Example |
|-------|--------|---------|
| **focus** | 3 sentences: mechanism + "versus" tension + "Permanent consequence:" | `"Truth-avoidance weaponized as reality-destroyer forcing delusion-paralysis. Comfort-preservation versus fact-confrontation tension. Permanent consequence: truth-facing protocol established (enabling reality-clarity despite comfort-loss)."` |
| **preliminarySceneFocus** | Stage tag + colon + tension + em dash + requirement (no period) | `"Call to adventure initiation: vision-resistance weaponized as clarity-destroyer—achieving vision-reception enabling cosmic-purpose-clarity"` |
| **preliminarySceneDescription** | Stage tag + colon + WHO + WHAT + WHY + em dash + NEXT (period) | `"Call to adventure initiation: Francisco confronts sensory-limitation preventing cosmic-vision—vision-reception discipline enabling purpose-clarity."` |
| **description** | 6-10 sentence paragraph: context -> pressure -> parable -> antagonist -> choice -> consequence -> hook | Dense 900-1600 character mini-outline |
| **chapterSceneFocus** | `Ch<N>S<N>: Title teaches/completes cause-effect—demand` | `"Ch245S1: Avoided Truth Confrontation teaches reality-clarity versus comfort-preservation—fact-facing refines journey-approach"` |

### 6.4 Content Rules

- **Story-heavy priority:** Plot clarity + tension + consequence first
- **Active antagonism:** Record Keepers adapt; determinism "edits" reality
- **Parable encoding:** Themes as symbol/choice/consequence, never direct advice
- **Hard required fields:** `location` and `timeline_variant` must never be blank
- **Field naming:** camelCase for DB-mapped fields (`chapterSceneFocus`, `preliminarySceneFocus`, etc.)

---

## 7. Current Progress

### 7.1 Outline Completion

| Metric | Status |
|--------|--------|
| Chapters outlined | **360 / 360** (100%) |
| Chapters with scenes | **360 / 360** (100%) |
| Chapters with enhanced (story-heavy) scenes | **360 / 360** (100%) |
| Total scenes authored | **1,281** |
| Enhanced scene JSON files created | **242** |

### 7.2 Per-Book Status

| Book | Chapters | Scenes in Outline | Enhanced | Status |
|------|----------|-------------------|----------|--------|
| Book 1 | 37 | All | All | Complete |
| Book 2 | 36 (27+9) | All | All | Complete |
| Book 3 | 40 | All | All | Complete |
| Book 4 | 40 | All | All | Complete |
| Book 5 | 40 | All | All | Complete |
| Book 6 | 40 | All | All | Complete |
| Book 7 | 38 | All | All | Complete |
| Book 8 | 40 | All | All | Complete |
| Book 9 | 40 | All | All | Complete |

### 7.3 Most Recent Work (Story-Heavy Pipeline)

The most recent story-heavy scene pipeline sessions have processed:

- **EA-241** "Renewed Hope" (Book 7, Ordinary World) - 4 scenes (655-658)
- **EA-242** "Recovery" (Book 7, Ordinary World) - 4 scenes (659-662)
- **EA-243** "Optimistic" (Book 7, Ordinary World) - 4 scenes (663-666)
- **EA-244** "Vision" (Book 7, Call to Adventure) - 4 scenes (667-670)
- **EA-245** "Truth Finder" (Book 7, Call to Adventure) - 3 scenes (671-673)
- **EA-246** "Purity" (Book 7, Refusal of Call) - 3 scenes (674-676)
- **EA-247** "Diligence" (Book 7, Refusal of Call) - 3 scenes (677-679)

**Next chapter in pipeline queue:** EA-248 "Abundant Emotion"

### 7.4 Database Import Status

All 360 chapters and their scenes have been imported to the Neon PostgreSQL database with full enhanced field sets.

---

## 8. Key Data Files

### 8.1 Source of Truth

| File | Size | Purpose |
|------|------|---------|
| `data/l_outline.json` | 17.6 MB / 109K lines | Canonical chapter metadata and scene arrays |

### 8.2 Supporting Data

| File/Directory | Purpose |
|----------------|---------|
| `data/scenes.csv` | Reference formatting patterns for scene fields |
| `lore/book*_expanded_codex.json` | World-building codex per book (9 files) |
| `lore/book*_extracted.json` | Extracted book data (9 files) |
| `growth_focus.json` / `growth_focus.csv` | Growth focus data (~932KB) |
| `strengths.json` / `strengths.csv` | Character strengths data (~983KB) |
| `shadow.json` / `shadow.csv` | Shadow archetype data (~929KB) |
| `personality_profile_id_map.json` | Personality profile mappings |
| `book1_chapters.csv/json` | Book 1 chapter data |

### 8.3 Configuration

| File | Purpose |
|------|---------|
| `.env` | Environment variables (DB URL, API keys, Clerk, Stripe) |
| `drizzle.config.ts` | Drizzle ORM database configuration |
| `next.config.ts` | Next.js configuration (image optimization, CSP, webpack) |
| `tailwind.config.mjs` | Tailwind CSS theme configuration |
| `tsconfig.json` | TypeScript compiler options |
| `vercel.json` | Vercel deployment configuration |

---

## 9. Scripts Inventory

### 9.1 Data Sync Scripts

| Script | Purpose |
|--------|---------|
| `scripts/sync-from-outline.ts` | Sync chapters from l_outline.json |
| `scripts/sync-books-from-outline.ts` | Sync book metadata |
| `scripts/sync-task-masters-from-outline.ts` | Sync task master hierarchy |
| `scripts/sync-comprehensive-from-outline.ts` | Full comprehensive sync |
| `scripts/sync-epic-arcana-from-outline.ts` | Epic Arcana specific sync |
| `scripts/import-scenes-to-existing-chapters.ts` | Import scenes to database |
| `scripts/importNextSceneFromOutline.ts` | Sequential scene importer |

### 9.2 Scene Pipeline Scripts (Per-Chapter)

| Pattern | Count | Purpose |
|---------|-------|---------|
| `scripts/ea-<N>-enhanced-scenes.json` | 242 | Enhanced scene data |
| `scripts/inject-ea-<N>-scenes.py` | 82 | Safe JSON injection |
| `scripts/verify-ea-<N>-simple.ts` | 282 | Import verification |
| `scripts/reimport-ea-<N>-scenes.ts` | ~5 | Delete + re-import helpers |

### 9.3 Data Extraction Scripts

| Script | Purpose |
|--------|---------|
| `extract_chapter_data.py` | Extract chapter data from JSON |
| `extract_epic_arcana.py` | Extract Epic Arcana content |
| `extract_strengths.py` | Extract character strengths |
| `extract_shadow.py` | Extract shadow archetypes |
| `extract_growth_focus.py` | Extract growth focus data |

### 9.4 Other Scripts

| Script | Purpose |
|--------|---------|
| `scripts/seed-character-arcs-data.ts` | Seed 3D character arc data |
| `scripts/uploadPersonalityProfiles.ts` | Upload personality data to Neon |
| `scripts/backfillClerkUsers.ts` | Backfill Clerk user records |
| `sync-enhanced-scenes.sh` | Shell script for batch scene sync |
| `generate_display_names.py` | Generate human-readable names |
| `fix_all_unescaped_quotes.py` | JSON quote fixing utilities |

---

## 10. Architecture Diagram

```
                    +-------------------+
                    |   Vercel (Host)   |
                    +-------------------+
                            |
              +-------------+-------------+
              |                           |
    +---------v---------+    +------------v-----------+
    |   Next.js 15      |    |   Neon PostgreSQL      |
    |   (App Router)     |    |   (Serverless)         |
    |                    |    |                        |
    | - 20+ Pages        |    | - 35+ Tables           |
    | - 30+ API Routes   |<-->| - 360 Chapters         |
    | - SSR + Client     |    | - 1,281 Scenes         |
    | - Middleware        |    | - Characters, Lore     |
    +---------+----------+    | - Assessments          |
              |               +------------------------+
              |
    +---------v----------+
    |   External Services |
    |                     |
    | - Clerk (Auth)      |
    | - Stripe (Payments) |
    | - Claude AI         |
    | - OpenAI            |
    | - DeepSeek          |
    +---------------------+

    +------------------------------------------+
    |        Content Pipeline (Offline)         |
    |                                          |
    | l_outline.json -> Enhanced Scenes JSON   |
    |     -> Python Inject -> Import to Neon   |
    |     -> TypeScript Verify                 |
    +------------------------------------------+
```

---

## 11. Key Narrative Concepts

### 11.1 Human Framework Encoding Rules

All underlying concepts from referenced books must be encoded as:
- **Parable** - Story within story teaching through metaphor
- **Symbol** - Concrete objects/places representing abstract concepts
- **Choice** - Characters facing dilemmas that embody the concept
- **Consequence** - Outcomes that demonstrate the concept's truth

**Never as:** Direct advice, coaching language, self-help terminology

### 11.2 Referenced Books (Per Chapter)

Each chapter references 3 books that influence its themes:

| Book Type | Examples |
|-----------|----------|
| **Hero's Journey** | The Hero with a Thousand Faces (Campbell) |
| **Psychology** | Thinking, Fast and Slow (Kahneman), Grit (Duckworth) |
| **Business/Leadership** | Start with Why (Sinek), Essentialism (McKeown) |
| **Habits/Growth** | Atomic Habits (Clear), Deep Work (Newport) |
| **Communication** | Radical Candor (Scott), Crucial Conversations |
| **Vision/Strategy** | Visioneering (Stanley), The Lean Startup |

### 11.3 Antagonist System

- **Record Keepers** - Primary antagonists who weaponize limitations
- **Determinism** - Reality-editing force that creates paralysis patterns
- Each scene features an **active antagonist adaptation** that forces the protagonist's choice

---

## 12. Development Notes

### 12.1 Key Architectural Decisions

1. **l_outline.json as Single Source of Truth** - All chapter/scene metadata lives in one 17.6MB JSON file. Database is populated from this file via import scripts.
2. **Python for JSON Injection, TypeScript for DB Operations** - Python handles safe JSON manipulation; TypeScript (via tsx) handles Drizzle ORM database operations.
3. **One Chapter at a Time Pipeline** - Scene enhancement follows a strict sequential process to maintain continuity.
4. **CamelCase Field Naming** - Database-mapped fields use camelCase (`chapterSceneFocus`, `preliminarySceneFocus`) matching Drizzle schema conventions.

### 12.2 Migration History

20+ Drizzle migrations have evolved the schema from basic chapter storage to the current comprehensive system including:
- Book hierarchy (series -> book -> task master -> major task group -> chapter)
- Enhanced scene fields (40+ per scene)
- Assessment system (v1 and v2)
- Character image generation
- Timeline divergence tracking

### 12.3 Environment Requirements

- Node.js (see `.nvmrc`)
- Python 3.11+
- PostgreSQL connection (Neon serverless)
- Clerk API keys
- Stripe API keys (for membership)
- AI API keys (Anthropic, OpenAI, DeepSeek)

---

*Generated on February 14, 2026 by Claude Code*
