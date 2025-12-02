# Database Schema & Data Structure Analysis

## Executive Summary

This document provides a comprehensive examination of:
1. Current database schema structure (books, chapters, and existing relationship tables)
2. L_outline.json file structure and organization
3. How terminal_learning_objectives and connection points are currently structured
4. Recommendations for efficient junction table design
5. Sample data showing relationships to capture

---

## 1. Current Database Schema Structure

### A. Core Content Tables

#### `books` table
```typescript
export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  seriesId: uuid('series_id').references(() => novelSeries.id).notNull(),
  bookNumber: integer('book_number').notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  title: varchar('title', { length: 255 }).notNull(),
  // ... other 40+ columns including themes, metadata
  terminalLearningObjectives: jsonb('terminal_learning_objectives'), // NOTE: Currently stored as JSONB
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `chapters` table
```typescript
export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  majorTaskGroupId: uuid('major_task_group_id').references(() => majorTaskGroups.id),
  chapterNumber: integer('chapter_number').notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  title: varchar('title', { length: 255 }).notNull(),
  // ... 30+ other columns
  terminalLearningObjectives: jsonb('terminal_learning_objectives'), // NOTE: Currently stored as JSONB
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `scenes` table
```typescript
export const scenes = pgTable('scenes', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  sceneNumber: integer('scene_number').notNull(),
  title: varchar('title', { length: 255 }),
  // ... 40+ columns including tarot integration, timeline data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### Task Hierarchy Tables
```typescript
export const taskMasters = pgTable('task_masters', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  // ...
});

export const majorTaskGroups = pgTable('major_task_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskMasterId: uuid('task_master_id').references(() => taskMasters.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  // ...
});
```

### B. Existing Relationship/Junction Tables

The codebase currently uses several junction table patterns:

#### `characterAffinities` (Many-to-Many Example)
```typescript
export const characterAffinities = pgTable('character_affinities', {
    characterId: uuid('character_id').references(() => characters.id).notNull(),
    cardId: uuid('card_id').references(() => trionfiCards.id).notNull(),
    affinityType: affinityTypeEnum('affinity_type').notNull(),
});
```

#### `sceneTimelineMapping` (Advanced Junction Table)
```typescript
export const sceneTimelineMapping = pgTable('scene_timeline_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  sceneId: uuid('scene_id').references(() => scenes.id).notNull(),
  timelineEventId: uuid('timeline_event_id').references(() => timelineEvents.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }),
  temporalDistance: varchar('temporal_distance', { length: 50 }),
  divergenceImpact: text('divergence_impact'),
  narrativeSignificance: text('narrative_significance'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `characterArcRelationships` (Complex Relationship Junction)
```typescript
export const characterArcRelationships = pgTable('character_arc_relationships', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceCharacterId: uuid('source_character_id').references(() => characters.id).notNull(),
  targetCharacterId: uuid('target_character_id').references(() => characters.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }).notNull(),
  strength: integer('strength').default(1),
  chaptersActive: jsonb('chapters_active'),
  description: text('description'),
  visualStyle: jsonb('visual_style'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## 2. L_outline.json File Structure

### A. Overall Hierarchy
```
l_outline.json
└── SelfImprovementSeries
    └── Books
        └── trilogies
            └── 1st_trilogy
                └── trilogy_books
                    ├── Book1
                    ├── Book2
                    └── Book3
```

### B. Book Structure
```typescript
interface BookOutline {
  title: string
  subject: string
  focus: string
  logline: string
  key_themes: string[]
  personality_type: string
  ennegram_name: string
  task_masters: {
    [key: string]: TaskMaster
  }
}
```

### C. Task Master Structure
```typescript
interface TaskMaster {
  unique_identifier: string
  title: string
  description: string
  color_name: string
  hex_code: string
  major_task_groups: {
    [key: string]: MajorTaskGroup
  }
}
```

### D. Major Task Group Structure
```typescript
interface MajorTaskGroup {
  unique_identifier: string
  major_task_group_title: string
  major_task_group_description: string
  major_task_group_tagline: string
  major_task_group_books_influenced_by: {}
  Specific_task_groups: {
    [key: string]: SpecificTaskGroup
  }
}
```

### E. Specific Task Group Structure (Most Important)
```typescript
interface SpecificTaskGroup {
  unique_identifier: string           // e.g., "STG 1.1.1.1"
  chapter: string                      // e.g., "Chapter 1"
  type: string
  title: string
  focus_area: string
  description: string
  tagline: string
  
  // Connection to influenced books - THIS IS KEY
  specific_task_group_books_influenced_by: {
    [bookKey: string]: InfluencedBook
  }
  
  // Other fields like scene, hero_journey_beat, etc.
}
```

### F. Influenced Book Connection Structure
```typescript
interface InfluencedBook {
  title: string                  // e.g., "Man's Search for Meaning"
  author: string                 // e.g., "Viktor Frankl"
  section_of_focus: string       // Specific section referenced
  section_description: string    // What section is about
  connection_focus_area: string  // How it connects thematically
  
  // CONNECTION POINTS - Multiple entry points to the influencing material
  connect_points: {
    point1: string     // First connection point to the material
    point2: string     // Second connection point
    point3: string     // Third connection point
    // ... more points
  }
  
  // TERMINAL LEARNING OBJECTIVES - Learning outcomes
  terminal_learning_objectives: {
    objective1: string
    objective2: string
    objective3: string
    // ... more objectives
  }
}
```

---

## 3. Current Data Organization Examples

### A. Terminal Learning Objectives (Current Format)

From l_outline.json - Book 1, Chapter 1, Specific Task Group 1:

```json
{
  "specific_task_group_books_influenced_by": {
    "book1": {
      "title": "Man's Search for Meaning",
      "author": "Viktor Frankl",
      "section_of_focus": "Experiences in a Concentration Camp",
      "section_description": "Viktor Frankl's account of his experiences...",
      
      "terminal_learning_objectives": {
        "objective1": "Understand the nature of despair and its impact on mental health.",
        "objective2": "Develop strategies to overcome despair and regain a sense of hope and resilience.",
        "objective3": "Reflect on the resilience of the human spirit and the importance of maintaining hope and purpose in challenging times."
      }
    },
    "book2": {
      "title": "The Myth of Sisyphus",
      "author": "Albert Camus",
      "terminal_learning_objectives": {
        "objective1": "Reflect on the nature of the absurd and its implications for human existence.",
        "objective2": "Explore the concept of despair in the context of an indifferent universe.",
        "objective3": "Consider the role of freedom and authenticity in confronting despair..."
      }
    }
  }
}
```

**Current Storage Issue**: These are stored as JSONB in chapters and books tables, making them:
- Hard to query
- Hard to update individual objectives
- Hard to create relationships with other entities
- Difficult to use in full-text search

### B. Connection Points (Current Format)

```json
{
  "connect_points": {
    "point1": "Viktor Frankl's account of his experiences in a concentration camp during World War II provides a powerful example of how individuals can find meaning and purpose in the face of extreme suffering and adversity.",
    "point2": "Through his reflections on the nature of human suffering and the search for meaning, Frankl offers readers valuable insights into the resilience of the human spirit...",
    "point3": "The theme of despair is deeply explored through Frankl's experiences, providing insights into overcoming extreme adversity and finding meaning in the face of suffering."
  }
}
```

**Current Storage Issue**: Same as above - stuck in JSONB, difficult to manage

---

## 4. Existing Many-to-Many Patterns in Schema

### Pattern 1: Simple Junction Table (characterAffinities)
```typescript
export const characterAffinities = pgTable('character_affinities', {
    characterId: uuid('character_id').references(() => characters.id).notNull(),
    cardId: uuid('card_id').references(() => trionfiCards.id).notNull(),
    affinityType: affinityTypeEnum('affinity_type').notNull(),
});
// No composite primary key, assumes duplicates prevent themselves
```

**Lessons**:
- Simple structure for straightforward relationships
- Missing composite primary key constraint (BEST PRACTICE: add unique constraint)
- Includes metadata (affinityType) in junction table

### Pattern 2: Complex Junction with Metadata (sceneTimelineMapping)
```typescript
export const sceneTimelineMapping = pgTable('scene_timeline_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),  // Has explicit ID
  sceneId: uuid('scene_id').references(() => scenes.id).notNull(),
  timelineEventId: uuid('timeline_event_id').references(() => timelineEvents.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }),
  temporalDistance: varchar('temporal_distance', { length: 50 }),
  divergenceImpact: text('divergence_impact'),
  narrativeSignificance: text('narrative_significance'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Lessons**:
- More sophisticated relationships require explicit ID
- Stores substantial metadata about the relationship
- Includes audit timestamps
- Good candidate for what we need

### Pattern 3: Self-Referential Relationship (characterArcRelationships)
```typescript
export const characterArcRelationships = pgTable('character_arc_relationships', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceCharacterId: uuid('source_character_id').references(() => characters.id).notNull(),
  targetCharacterId: uuid('target_character_id').references(() => characters.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }).notNull(),
  strength: integer('strength').default(1),
  chaptersActive: jsonb('chapters_active'),  // Still uses JSONB for arrays
  description: text('description'),
  visualStyle: jsonb('visual_style'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Lessons**:
- Handles relationships between same entity type
- Still uses JSONB for complex data (arrays, style objects)
- Uses integers for strength/metadata

---

## 5. Recommendations for Junction Table Design

### A. For Terminal Learning Objectives

**RECOMMENDED TABLE DESIGN:**

```typescript
// Table to store external learning sources/books
export const learningResources = pgTable('learning_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }),
  sectionOfFocus: varchar('section_of_focus', { length: 255 }),
  sectionDescription: text('section_description'),
  url: varchar('url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Junction table: Connect content items (chapters, scenes) to learning resources
export const contentLearningResourceMapping = pgTable('content_learning_resource_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content being influenced (flexible: chapter, scene, task group, etc.)
  contentId: uuid('content_id').notNull(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'chapter', 'scene', 'task_group'
  
  // Learning resource being referenced
  learningResourceId: uuid('learning_resource_id').notNull().references(() => learningResources.id),
  
  // Context of connection
  connectionFocusArea: varchar('connection_focus_area', { length: 255 }),
  connectionDescription: text('connection_description'),
  
  // Ordering
  displayOrder: integer('display_order').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  unique('content_learning_resource_unique').on(table.contentId, table.contentType, table.learningResourceId)
]);

// Terminal learning objectives (separate, queryable table)
export const terminalLearningObjectives = pgTable('terminal_learning_objectives', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Connection to the mapping
  mappingId: uuid('mapping_id').notNull().references(() => contentLearningResourceMapping.id, { onDelete: 'cascade' }),
  
  // Objective content
  objectiveText: text('objective_text').notNull(),
  
  // Metadata
  bloomsTaxonomyLevel: varchar('blooms_taxonomy_level', { length: 50 }), // Remember, Understand, Apply, Analyze, Evaluate, Create
  objectiveOrder: integer('objective_order').notNull(), // 1, 2, 3, etc.
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  unique('objective_mapping_order_unique').on(table.mappingId, table.objectiveOrder)
]);
```

**ADVANTAGES:**
- Terminal learning objectives are NOW QUERYABLE
- Can filter by Bloom's taxonomy level
- Maintains relationship to learning resources
- Can update individual objectives without JSON manipulation
- Easy to join for reporting and analysis

### B. For Connection Points

**RECOMMENDED TABLE DESIGN:**

```typescript
// Connection points (specific entry points into learning material)
export const connectionPoints = pgTable('connection_points', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Link to mapping
  mappingId: uuid('mapping_id').notNull().references(() => contentLearningResourceMapping.id, { onDelete: 'cascade' }),
  
  // Connection content
  pointText: text('point_text').notNull(),
  
  // Metadata
  pointOrder: integer('point_order').notNull(), // 1, 2, 3, etc.
  connectionType: varchar('connection_type', { length: 100 }), // 'thematic', 'narrative', 'character', 'structural'
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  unique('connection_point_unique').on(table.mappingId, table.pointOrder)
]);
```

**ADVANTAGES:**
- Connection points are NOW QUERYABLE
- Can filter by connection type
- Can order by sequence
- Easy to update individual connection points
- Enables full-text search on connection content

### C. Composite Pattern - All Together

```
contentLearningResourceMapping (junction table)
  ├── learningResources (FK)
  ├── contentId + contentType (flexible content link)
  └── Contains metadata

  ├── terminalLearningObjectives (1:N relationship)
  │   └── One objective per row
  │   └── Bloom's taxonomy level
  │   └── Queryable, sortable by order
  │
  └── connectionPoints (1:N relationship)
      └── One point per row
      └── Connection type
      └── Queryable, sortable by order
```

---

## 6. Sample Data to Show Relationships

### Sample 1: Chapter with Multiple Learning Resources

```sql
-- Chapter to map to multiple learning resources
INSERT INTO chapters (id, bookId, chapterNumber, title, ...)
VALUES (
  'uuid-chapter-1',
  'uuid-book-1',
  1,
  'Despair: The Opening Image',
  ...
);

-- Learning resources this chapter is influenced by
INSERT INTO learning_resources (id, title, author, section_of_focus, section_description)
VALUES
  (
    'uuid-resource-1',
    'Man''s Search for Meaning',
    'Viktor Frankl',
    'Experiences in a Concentration Camp',
    'Viktor Frankl''s account of his experiences in a concentration camp during World War II...'
  ),
  (
    'uuid-resource-2',
    'The Myth of Sisyphus',
    'Albert Camus',
    'Exploration of the Absurd',
    'Albert Camus'' philosophical essay on the nature of the absurd...'
  ),
  (
    'uuid-resource-3',
    'The Bell Jar',
    'Sylvia Plath',
    'Exploration of Depression',
    'Sylvia Plath''s semi-autobiographical novel explores...'
  );

-- Map chapter to resources
INSERT INTO content_learning_resource_mapping 
  (id, contentId, contentType, learningResourceId, connectionFocusArea, displayOrder)
VALUES
  (
    'uuid-mapping-1',
    'uuid-chapter-1',
    'chapter',
    'uuid-resource-1',
    'Despair is the feeling of utter hopelessness and dejection...',
    1
  ),
  (
    'uuid-mapping-2',
    'uuid-chapter-1',
    'chapter',
    'uuid-resource-2',
    'Camus'' exploration of the absurd resonates with the theme of despair...',
    2
  ),
  (
    'uuid-mapping-3',
    'uuid-chapter-1',
    'chapter',
    'uuid-resource-3',
    'Plath''s exploration of depression resonates with the theme of despair...',
    3
  );

-- Terminal learning objectives for resource 1 mapping
INSERT INTO terminal_learning_objectives 
  (id, mappingId, objectiveText, bloomsTaxonomyLevel, objectiveOrder)
VALUES
  (
    'uuid-obj-1-1',
    'uuid-mapping-1',
    'Understand the nature of despair and its impact on mental health.',
    'Understand',
    1
  ),
  (
    'uuid-obj-1-2',
    'uuid-mapping-1',
    'Develop strategies to overcome despair and regain a sense of hope and resilience.',
    'Apply',
    2
  ),
  (
    'uuid-obj-1-3',
    'uuid-mapping-1',
    'Reflect on the resilience of the human spirit and the importance of maintaining hope and purpose in challenging times.',
    'Evaluate',
    3
  );

-- Connection points for resource 1 mapping
INSERT INTO connection_points 
  (id, mappingId, pointText, connectionType, pointOrder)
VALUES
  (
    'uuid-point-1-1',
    'uuid-mapping-1',
    'Viktor Frankl''s account of his experiences in a concentration camp during World War II provides a powerful example of how individuals can find meaning and purpose in the face of extreme suffering and adversity.',
    'narrative',
    1
  ),
  (
    'uuid-point-1-2',
    'uuid-mapping-1',
    'Through his reflections on the nature of human suffering and the search for meaning, Frankl offers readers valuable insights into the resilience of the human spirit and the importance of maintaining hope and purpose in the darkest of times.',
    'thematic',
    2
  ),
  (
    'uuid-point-1-3',
    'uuid-mapping-1',
    'The theme of despair is deeply explored through Frankl''s experiences, providing insights into overcoming extreme adversity and finding meaning in the face of suffering.',
    'thematic',
    3
  );

-- Similar structure for resources 2 and 3...
```

### Sample 2: Query Examples (Why This Design is Better)

```sql
-- Get all terminal learning objectives for a chapter
SELECT tlo.objectiveText, tlo.bloomsTaxonomyLevel, lr.title
FROM terminal_learning_objectives tlo
JOIN content_learning_resource_mapping clrm ON tlo.mappingId = clrm.id
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
WHERE clrm.contentId = 'uuid-chapter-1'
  AND clrm.contentType = 'chapter'
ORDER BY clrm.displayOrder, tlo.objectiveOrder;

-- Get all connection points for a specific learning resource used in a chapter
SELECT cp.pointText, cp.connectionType, lr.author, lr.title
FROM connection_points cp
JOIN content_learning_resource_mapping clrm ON cp.mappingId = clrm.id
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
WHERE clrm.contentId = 'uuid-chapter-1'
  AND clrm.contentType = 'chapter'
  AND lr.author = 'Viktor Frankl'
ORDER BY cp.pointOrder;

-- Find all chapters influenced by a specific author
SELECT DISTINCT c.title, c.chapterNumber, lr.author
FROM chapters c
JOIN content_learning_resource_mapping clrm ON c.id = clrm.contentId
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
WHERE clrm.contentType = 'chapter'
  AND lr.author = 'Viktor Frankl'
ORDER BY c.chapterNumber;

-- Get all "Apply" level Bloom's taxonomy objectives
SELECT c.title, tlo.objectiveText, lr.title AS resource_title
FROM chapters c
JOIN content_learning_resource_mapping clrm ON c.id = clrm.contentId
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
JOIN terminal_learning_objectives tlo ON clrm.id = tlo.mappingId
WHERE clrm.contentType = 'chapter'
  AND tlo.bloomsTaxonomyLevel = 'Apply'
ORDER BY c.chapterNumber, clrm.displayOrder, tlo.objectiveOrder;

-- Impossible with current JSONB approach: 
--   Can't easily filter by Bloom's level
--   Can't easily sort/order
--   Can't do proper JOINs
--   Full-text search is awkward
```

### Sample 3: Complex Query - Multi-Level Content

```sql
-- Get learning resources and their objectives for all chapters in a book
WITH chapter_resources AS (
  SELECT 
    c.id as chapter_id,
    c.title as chapter_title,
    c.chapterNumber,
    lr.id as resource_id,
    lr.title as resource_title,
    lr.author,
    clrm.id as mapping_id,
    clrm.displayOrder as resource_order
  FROM chapters c
  JOIN content_learning_resource_mapping clrm 
    ON c.id = clrm.contentId AND clrm.contentType = 'chapter'
  JOIN learning_resources lr ON clrm.learningResourceId = lr.id
  WHERE c.bookId = 'uuid-book-1'
)
SELECT 
  cr.chapter_title,
  cr.chapterNumber,
  cr.resource_title,
  cr.author,
  tlo.bloomsTaxonomyLevel,
  tlo.objectiveText,
  cp.connectionType,
  cp.pointText
FROM chapter_resources cr
LEFT JOIN terminal_learning_objectives tlo 
  ON cr.mapping_id = tlo.mappingId
LEFT JOIN connection_points cp 
  ON cr.mapping_id = cp.mappingId
ORDER BY cr.chapterNumber, cr.resource_order, tlo.objectiveOrder, cp.pointOrder;
```

---

## 7. Migration Path from Current JSONB to New Schema

### Phase 1: Create New Tables
```typescript
// Add the new normalized tables
export const learningResources = pgTable(...);
export const contentLearningResourceMapping = pgTable(...);
export const terminalLearningObjectives = pgTable(...);
export const connectionPoints = pgTable(...);
```

### Phase 2: Data Migration Strategy
```sql
-- Step 1: Extract unique learning resources from JSONB
-- Step 2: Create mappings for each chapter/scene
-- Step 3: Extract objectives and connection points
-- Step 4: Validate data integrity
-- Step 5: Keep JSONB as backup during transition period
-- Step 6: Create views for backward compatibility if needed
-- Step 7: Update application code to use new tables
-- Step 8: Remove JSONB columns after verification
```

### Phase 3: Deprecation
- Keep old JSONB columns read-only for 1-2 releases
- Update all API endpoints to use new tables
- Remove JSONB columns after full cutover

---

## 8. Summary of Current Issues and Benefits of New Design

### Current Issues with JSONB Storage:
1. Cannot efficiently query individual objectives
2. Cannot filter by Bloom's taxonomy level
3. Difficult to update single objectives without rewriting entire JSONB
4. No full-text search capability
5. Cannot create indexes on objective content
6. Difficult to generate reports
7. Hard to maintain referential integrity
8. Difficult to version/track changes to objectives

### Benefits of Normalized Junction Table Design:
1. Objectives are first-class database entities
2. Full queryability and sortability
3. Efficient indexing support
4. Full-text search capability
5. Easy to update individual records
6. Referential integrity via foreign keys
7. Audit trail (createdAt/updatedAt)
8. Easy to add new metadata (Bloom's level, etc.)
9. Reusable learning resources across content
10. Follows database normalization best practices

---

## 9. Related Existing Patterns to Maintain Consistency

The codebase already uses these patterns effectively:
- UUID primary keys with `.defaultRandom()`
- Composite unique constraints where needed
- References with `onDelete: 'cascade'` for cleanup
- Audit timestamps (createdAt, updatedAt)
- Enum types for constrained values
- Integer ordering for display sequences

The recommended design follows all these established patterns.

