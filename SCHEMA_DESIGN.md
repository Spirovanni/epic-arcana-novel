# Normalized Schema Design for Learning Objectives & Connection Points

## Problem Statement
Currently, `terminal_learning_objectives` and `connect_points` are stored as JSONB blobs in the chapters table. This makes them:
- Not queryable individually
- Not filterable or searchable
- Not reusable across multiple chapters
- Difficult to update without replacing the entire object

## Solution: Normalized Relational Design

We're implementing a 4-table system that extracts relationships into queryable, reusable entities.

### Table 1: `learning_resources`
Master list of books/sources that influence chapters.

```sql
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id VARCHAR(50) UNIQUE NOT NULL,  -- "book1", "book2", etc.
  title VARCHAR(255) NOT NULL,              -- "Man's Search for Meaning"
  author VARCHAR(255),                      -- "Viktor Frankl"
  section_of_focus VARCHAR(255),            -- "Life in Concentration Camps"
  section_description TEXT,                 -- Full description
  connection_focus_area TEXT,               -- How it relates to the theme
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Unique `resource_id` for efficient linking (e.g., "book1", "book2")
- One master record per external resource
- Reusable across multiple chapters
- Searchable by title, author, or focus area

---

### Table 2: `learning_resource_chapters`
Junction table: Which chapters use which resources?

```sql
CREATE TABLE learning_resource_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,                -- Maintain order of resources
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(learning_resource_id, chapter_id), -- No duplicates
  INDEX idx_chapter(chapter_id),
  INDEX idx_resource(learning_resource_id)
);
```

**Key Features:**
- Flexible: One resource can appear in multiple chapters
- Maintains order through `order_index`
- Fast lookups by chapter or resource
- Referential integrity maintained

---

### Table 3: `connection_points`
Individual connection points extracted from JSONB.

```sql
CREATE TABLE connection_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  point_number INT NOT NULL,               -- 1, 2, 3...
  description TEXT NOT NULL,               -- The actual connection point text
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(learning_resource_id, chapter_id, point_number),
  INDEX idx_resource_chapter(learning_resource_id, chapter_id),
  INDEX idx_chapter(chapter_id)
);
```

**Key Features:**
- Each connection point is individually queryable
- Can be updated, deleted, added independently
- Full-text search possible
- Maintains relationship to source resource and chapter

---

### Table 4: `terminal_learning_objectives`
Individual learning objectives extracted from JSONB.

```sql
CREATE TABLE terminal_learning_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  objective_number INT NOT NULL,          -- 1, 2, 3...
  description TEXT NOT NULL,              -- The actual objective text
  bloom_level VARCHAR(50),                -- REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(learning_resource_id, chapter_id, objective_number),
  INDEX idx_resource_chapter(learning_resource_id, chapter_id),
  INDEX idx_chapter(chapter_id),
  INDEX idx_bloom_level(bloom_level)
);
```

**Key Features:**
- Each objective is individually queryable and updateable
- Full-text search possible
- Can be categorized by Bloom's taxonomy level
- Flexible for future educational metrics

---

## Data Relationships

```
learning_resources (Master)
    |
    ├── connection_points (one-to-many)
    |   └── For each chapter using this resource
    |
    ├── terminal_learning_objectives (one-to-many)
    |   └── For each chapter using this resource
    |
    └── learning_resource_chapters (junction)
        └── Tracks which chapters use this resource
        └── Maintains order and metadata
```

---

## Migration Strategy

### Phase 1: Create Tables (SQL)
```sql
-- In drizzle migration file
CREATE TABLE learning_resources (...);
CREATE TABLE learning_resource_chapters (...);
CREATE TABLE connection_points (...);
CREATE TABLE terminal_learning_objectives (...);
```

### Phase 2: Populate from l_outline.json
Run TypeScript script that:
1. Parses l_outline.json
2. Extracts unique resources → learning_resources
3. Links resources to chapters → learning_resource_chapters
4. Extracts connection points → connection_points
5. Extracts learning objectives → terminal_learning_objectives

### Phase 3: Schema Changes
- Remove JSONB fields from chapters table:
  - `terminalLearningObjectives`
  - Future: Remove hardcoded learning objectives from outline page component

### Phase 4: Update Components
- Update outline page to query from new tables
- Implement full-text search
- Add filtering by Bloom's level
- Add resource-specific views

---

## Query Examples

### Get all resources for a chapter
```sql
SELECT lr.*
FROM learning_resources lr
JOIN learning_resource_chapters lrc ON lr.id = lrc.learning_resource_id
WHERE lrc.chapter_id = $1
ORDER BY lrc.order_index;
```

### Get all connection points for a chapter
```sql
SELECT cp.*
FROM connection_points cp
WHERE cp.chapter_id = $1
ORDER BY cp.point_number;
```

### Get learning objectives by Bloom's level
```sql
SELECT tlo.*
FROM terminal_learning_objectives tlo
WHERE tlo.chapter_id = $1
AND tlo.bloom_level = 'UNDERSTAND'
ORDER BY tlo.objective_number;
```

### Full-text search across connection points
```sql
SELECT cp.*
FROM connection_points cp
WHERE cp.chapter_id = $1
AND cp.description @@ to_tsquery('english', $2);
```

---

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Query Speed | Must load entire JSONB | Direct indexed queries |
| Search | Not possible | Full-text search enabled |
| Updates | Replace entire JSONB | Update single row |
| Reusability | Duplicated per chapter | Single master record |
| Referential Integrity | None | Database enforced |
| Bloom's Taxonomy | Not stored | Stored & filterable |
| Data Validation | None | Database constraints |

---

## Implementation Order

1. **Create Drizzle schema definitions** (lib/schema.ts)
2. **Generate migration** (drizzle/XXXX_add_learning_system.sql)
3. **Create data population script** (scripts/populate-learning-data.ts)
4. **Test with sample data** from l_outline.json
5. **Update API endpoints** to query new tables
6. **Update UI components** to display data from new tables
7. **Remove legacy JSONB handling** after migration complete

---

## Long-term Considerations

- **Internationalization**: Add `language` field to objectives for multi-language support
- **Competency Mapping**: Link objectives to competency frameworks
- **Progress Tracking**: Add user_learning_progress table to track completion
- **Assessment**: Link to assessment/quiz questions
- **Resource Ratings**: Add community ratings/feedback on resources
