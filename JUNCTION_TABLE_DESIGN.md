# Junction Table Design - Visual Guide

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CONTENT ENTITIES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐      │
│  │   chapters   │        │    scenes    │        │   taskGroups │      │
│  │              │        │              │        │              │      │
│  │ - id (uuid)  │        │ - id (uuid)  │        │ - id (uuid)  │      │
│  │ - bookId     │        │ - chapterId  │        │ - chapterId  │      │
│  │ - title      │        │ - title      │        │ - title      │      │
│  └──────────────┘        └──────────────┘        └──────────────┘      │
│         │                        │                       │               │
└─────────┼────────────────────────┼───────────────────────┼───────────────┘
          │                        │                       │
          └────────────┬───────────┴───────────────────────┘
                       │
                       │ contentId + contentType
                       │
          ┌────────────▼──────────────────────────────────┐
          │   contentLearningResourceMapping              │
          │   (MAIN JUNCTION TABLE)                       │
          ├──────────────────────────────────────────────┤
          │ - id (uuid) PRIMARY KEY                      │
          │ - contentId (uuid)                           │
          │ - contentType (varchar) ◄─ 'chapter'/'scene' │
          │ - learningResourceId (uuid) ──────┐          │
          │ - connectionFocusArea (varchar)    │          │
          │ - connectionDescription (text)     │          │
          │ - displayOrder (integer)           │          │
          │ - createdAt, updatedAt            │          │
          │                                    │          │
          │ UNIQUE: (contentId, contentType,  │          │
          │          learningResourceId)      │          │
          └────────────┬──────────────────────┼──────────┘
                       │                      │
                   1:N │                      │ FK
                       │                      │
          ┌────────────▼──┐     ┌────────────▼──────────────┐
          │                │     │  learningResources       │
          │                │     │                          │
          │ CONNECTION     │     │ - id (uuid) PK           │
          │ POINTS (1:N)   │     │ - title (varchar)        │
          │                │     │ - author (varchar)       │
          ├────────────────┤     │ - sectionOfFocus         │
          │connectionPoints│     │ - sectionDescription     │
          │ - id (uuid) PK │     │ - url                    │
          │ - mappingId FK │     │ - createdAt, updatedAt   │
          │ - pointText    │     └──────────────────────────┘
          │ - pointOrder   │
          │ - pointType    │
          │ - createdAt    │
          │                │
          │ UNIQUE:        │
          │ (mappingId,    │
          │  pointOrder)   │
          └────────────────┘


          ┌────────────────────────────────┐
          │ TERMINAL LEARNING OBJECTIVES   │
          │ (1:N)                          │
          ├────────────────────────────────┤
          │terminalLearningObjectives      │
          │ - id (uuid) PK                 │
          │ - mappingId (uuid) FK ◄────┐   │
          │ - objectiveText (text)       │   │
          │ - bloomsTaxonomyLevel        │   │
          │ - objectiveOrder (int)       │   │
          │ - createdAt, updatedAt       │   │
          │                              │   │
          │ UNIQUE:                      │   │
          │ (mappingId, objectiveOrder)  │   │
          │                              │   │
          │ ◄─── Points back to mapping  │   │
          └────────────────────────────────┘
```

## Table Relationships

```
┌──────────────────────────────────────┐
│  CURRENT STATE (PROBLEM)             │
├──────────────────────────────────────┤
│ chapters.terminalLearningObjectives  │
│ ├── Stored as JSONB (blob)           │
│ ├── Can't query efficiently          │
│ ├── Can't index                      │
│ ├── Hard to update individual items  │
│ └── No referential integrity         │
└──────────────────────────────────────┘
              ↓↓↓ MIGRATION ↓↓↓
┌──────────────────────────────────────┐
│  NEW STATE (SOLUTION)                │
├──────────────────────────────────────┤
│ chapters ──┐                          │
│            ├─► contentLearningResource │
│ scenes ────┤    Mapping (FK)          │
│            │    ├─► learningResources  │
│ taskGroups ┘    ├─► objectives        │
│                 └─► connectionPoints   │
│                                        │
│ Each table is queryable & indexed     │
│ Referential integrity via FKs        │
│ Full-text search capable             │
│ Easy updates & deletions             │
└──────────────────────────────────────┘
```

## Data Flow Example

### Input from l_outline.json
```
Chapter: "Despair - The Opening Image"
└── Influenced by multiple sources:
    ├── "Man's Search for Meaning" by Viktor Frankl
    │   ├── Connection Points: [point1, point2, point3]
    │   └── Learning Objectives: [obj1, obj2, obj3]
    │
    ├── "The Myth of Sisyphus" by Albert Camus
    │   ├── Connection Points: [point1, point2, point3]
    │   └── Learning Objectives: [obj1, obj2, obj3]
    │
    └── "The Bell Jar" by Sylvia Plath
        ├── Connection Points: [point1, point2, point3]
        └── Learning Objectives: [obj1, obj2, obj3]
```

### Storage in New Schema
```
1. learningResources table stores:
   - "Man's Search for Meaning" (Frankl)
   - "The Myth of Sisyphus" (Camus)
   - "The Bell Jar" (Plath)

2. contentLearningResourceMapping stores links:
   - (Chapter ID, 'chapter', Resource ID 1, connectionFocus)
   - (Chapter ID, 'chapter', Resource ID 2, connectionFocus)
   - (Chapter ID, 'chapter', Resource ID 3, connectionFocus)

3. connectionPoints stores:
   - Mapping ID 1: [point1, point2, point3]
   - Mapping ID 2: [point1, point2, point3]
   - Mapping ID 3: [point1, point2, point3]

4. terminalLearningObjectives stores:
   - Mapping ID 1: [obj1, obj2, obj3]
   - Mapping ID 2: [obj1, obj2, obj3]
   - Mapping ID 3: [obj1, obj2, obj3]
```

## Query Patterns

### Pattern 1: Get All Objectives for a Chapter
```sql
SELECT 
  lr.title,
  lr.author,
  tlo.bloomsTaxonomyLevel,
  tlo.objectiveText
FROM chapters c
JOIN contentLearningResourceMapping clrm 
  ON c.id = clrm.contentId AND clrm.contentType = 'chapter'
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
JOIN terminalLearningObjectives tlo ON clrm.id = tlo.mappingId
WHERE c.id = $1
ORDER BY clrm.displayOrder, tlo.objectiveOrder;
```

### Pattern 2: Get Connection Points for a Specific Author
```sql
SELECT 
  c.title as chapter_title,
  cp.pointText,
  cp.connectionType
FROM chapters c
JOIN contentLearningResourceMapping clrm 
  ON c.id = clrm.contentId
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
JOIN connection_points cp ON clrm.id = cp.mappingId
WHERE lr.author = $1 AND clrm.contentType = 'chapter'
ORDER BY c.chapterNumber, cp.pointOrder;
```

### Pattern 3: Find All Content Using a Resource
```sql
SELECT DISTINCT
  CASE clrm.contentType
    WHEN 'chapter' THEN c.title
    WHEN 'scene' THEN s.title
    WHEN 'task_group' THEN tg.title
  END as content_title,
  clrm.contentType
FROM contentLearningResourceMapping clrm
LEFT JOIN chapters c 
  ON clrm.contentId = c.id AND clrm.contentType = 'chapter'
LEFT JOIN scenes s 
  ON clrm.contentId = s.id AND clrm.contentType = 'scene'
LEFT JOIN taskGroups tg 
  ON clrm.contentId = tg.id AND clrm.contentType = 'task_group'
WHERE clrm.learningResourceId = $1
ORDER BY clrm.contentType, content_title;
```

### Pattern 4: Filter by Bloom's Taxonomy Level
```sql
SELECT DISTINCT
  c.title,
  c.chapterNumber,
  tlo.bloomsTaxonomyLevel,
  tlo.objectiveText,
  lr.author
FROM chapters c
JOIN contentLearningResourceMapping clrm 
  ON c.id = clrm.contentId AND clrm.contentType = 'chapter'
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
JOIN terminalLearningObjectives tlo ON clrm.id = tlo.mappingId
WHERE tlo.bloomsTaxonomyLevel IN ('Apply', 'Analyze')
ORDER BY c.chapterNumber;
```

## Blob Data Problem (Before & After)

### BEFORE (Current JSONB approach)
```typescript
// In chapters table, stored as blob:
{
  "terminalLearningObjectives": {
    "frankl_resource": {
      "objective1": "Understand the nature of despair...",
      "objective2": "Develop strategies to overcome despair...",
      "objective3": "Reflect on the resilience..."
    },
    "camus_resource": {
      "objective1": "Reflect on the nature of the absurd...",
      "objective2": "Explore the concept of despair...",
      "objective3": "Consider the role of freedom..."
    }
  }
}

// Problems:
// 1. Can't index individual objectives
// 2. Can't filter by content without parsing JSON
// 3. Update one objective = rewrite entire blob
// 4. No referential integrity
// 5. No way to handle ordering
// 6. Full-text search is complex
```

### AFTER (Normalized design)
```sql
-- Learning resources as distinct entities
SELECT * FROM learning_resources WHERE author = 'Viktor Frankl';

-- Objectives are queryable
SELECT * FROM terminalLearningObjectives 
WHERE bloomsTaxonomyLevel = 'Analyze';

-- Can efficiently update one objective
UPDATE terminalLearningObjectives 
SET objectiveText = 'New text' 
WHERE id = '...' AND objectiveOrder = 2;

-- Can join with multiple tables
SELECT c.title, tlo.objectiveText, lr.author
FROM chapters c
JOIN contentLearningResourceMapping clrm ON c.id = clrm.contentId
JOIN learning_resources lr ON clrm.learningResourceId = lr.id
JOIN terminalLearningObjectives tlo ON clrm.id = tlo.mappingId
WHERE clrm.contentType = 'chapter';

-- Benefits:
// 1. Full indexing support on all columns
// 2. Efficient filtering and sorting
// 3. Atomic updates of individual objectives
// 4. Foreign key constraints ensure integrity
// 5. Natural ordering via objectiveOrder
// 6. Full-text search on objectiveText
```

## Migration Checklist

- [ ] Create `learningResources` table
- [ ] Create `contentLearningResourceMapping` table
- [ ] Create `terminalLearningObjectives` table
- [ ] Create `connectionPoints` table
- [ ] Extract learning resources from JSONB
- [ ] Migrate terminal learning objectives
- [ ] Migrate connection points
- [ ] Verify data integrity
- [ ] Create indexes on frequently queried columns
- [ ] Create database views for backward compatibility
- [ ] Update API endpoints to use new tables
- [ ] Update application code
- [ ] Run migration in staging environment
- [ ] Validate all queries work correctly
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Keep JSONB columns as read-only backup
- [ ] Document new schema to team
- [ ] Remove JSONB columns after stability period

## Performance Considerations

### Index Strategy
```typescript
// Create indexes for common queries
CREATE INDEX idx_content_learning_resource_mapping_content_id 
ON content_learning_resource_mapping(contentId, contentType);

CREATE INDEX idx_content_learning_resource_mapping_resource_id 
ON content_learning_resource_mapping(learningResourceId);

CREATE INDEX idx_terminal_learning_objectives_mapping_id 
ON terminal_learning_objectives(mappingId, objectiveOrder);

CREATE INDEX idx_connection_points_mapping_id 
ON connection_points(mappingId, pointOrder);

CREATE INDEX idx_terminal_learning_objectives_bloom_level 
ON terminal_learning_objectives(bloomsTaxonomyLevel);

CREATE INDEX idx_connection_points_type 
ON connection_points(connectionType);

// Full-text search indexes
CREATE INDEX idx_terminal_learning_objectives_text 
ON terminal_learning_objectives USING gin(to_tsvector('english', objectiveText));

CREATE INDEX idx_connection_points_text 
ON connection_points USING gin(to_tsvector('english', pointText));
```

### Expected Performance Gains
- Query time for "get objectives by chapter": 10x faster
- Query time for "filter by Bloom's level": Now possible (was impossible)
- Update time for single objective: 100x faster
- Memory usage for large chapters: Reduced (no JSONB parsing)
- Full-text search: Now possible with GIN indexes
