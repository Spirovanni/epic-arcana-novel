# Database Migration Setup Guide

## 📋 Summary of Changes

We've successfully updated the database schema to support the rich hierarchical structure from the Book JSON files. Here's what was implemented:

### ✅ **Completed Changes**

1. **Enhanced Books Table** - Added 5 new fields
2. **New Task Masters Table** - Created hierarchical structure  
3. **New Major Task Groups Table** - Intermediate organizational layer
4. **Enhanced Chapters Table** - Added 12 new fields for specific task groups
5. **Migration Scripts** - Created complete migration files

## 🚀 **How to Apply These Changes**

### Step 1: Review the Schema Changes

The following files were modified:
- `/src/lib/schema.ts` - Updated with new table definitions
- `/drizzle/0003_add_book_hierarchy.sql` - Migration script
- `/drizzle/meta/_journal.json` - Migration tracking
- `/drizzle/meta/0003_snapshot.json` - Schema snapshot

### Step 2: Run the Migration

```bash
# Apply the migration to your database
npm run db:migrate
# or
npx drizzle-kit migrate

# Generate types if needed
npm run db:generate
```

### Step 3: Verify the Migration

Run this query to confirm new tables exist:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('task_masters', 'major_task_groups');
```

### Step 4: Check New Columns

```sql
-- Check new book fields
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'books' 
AND column_name IN ('epic_novel_plot', 'unique_theme', 'business_model_generation');

-- Check new chapter fields  
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'chapters' 
AND column_name IN ('focus_area', 'connection_to_major_task_group', 'terminal_learning_objectives');
```

## 📊 **New Database Structure**

### Hierarchical Relationships:
```
Books (enhanced)
├── Task Masters (new)
    ├── Major Task Groups (new)
        ├── Chapters (enhanced as Specific Task Groups)
            ├── Chapter Pages (existing)
```

### New Field Mapping:

#### **Books Table Additions:**
| JSON Field | Database Field | Type | Description |
|------------|---------------|------|-------------|
| `epic_novel_plot` | `epic_novel_plot` | varchar(255) | Plot type (e.g., "The Quest & Coming of age") |
| `unique_theme` | `unique_theme` | varchar(255) | Unique theme (e.g., "Combined Directives") |
| `business_model_generation` | `business_model_generation` | varchar(100) | Business model type |
| `business_model_you` | `business_model_you` | varchar(255) | Business model description |
| `type` | `type` | varchar(50) | Book type (e.g., "Major Task") |

#### **Task Masters Table:**
| Field | Type | Description |
|-------|------|-------------|
| `book_id` | uuid | References books.id |
| `unique_identifier` | varchar(50) | JSON identifier (e.g., "MT 1.1") |
| `title` | varchar(255) | Task master title |
| `color_name` | varchar(100) | Color theme name |
| `hex_code` | varchar(7) | Hex color code |
| `red`, `green`, `blue` | integer | RGB values |
| `fiction_novel_section_title` | varchar(255) | Fiction section title |
| `fiction_novel_section_books_influenced_by` | jsonb | Referenced books |

#### **Major Task Groups Table:**
| Field | Type | Description |
|-------|------|-------------|
| `task_master_id` | uuid | References task_masters.id |
| `unique_identifier` | varchar(50) | JSON identifier (e.g., "MTG 1.1.1") |
| `title` | varchar(255) | Major task group title |
| `books_influenced_by` | jsonb | Referenced books |

#### **Chapters Table Additions:**
| Field | Type | Description |
|-------|------|-------------|
| `major_task_group_id` | uuid | References major_task_groups.id |
| `focus_area` | varchar(100) | Focus area (e.g., "Mental Health") |
| `connection_to_major_task_group` | text | Connection explanation |
| `specific_task_group_books_influenced_by` | jsonb | Referenced books with learning objectives |
| `terminal_learning_objectives` | jsonb | Learning objectives |

## 🔧 **Next Steps After Migration**

### 1. Update API Endpoints
You'll need to update your API endpoints to handle the new fields:

```typescript
// Example: Update book creation endpoint
const createBook = async (bookData: {
  title: string;
  epicNovelPlot?: string;
  uniqueTheme?: string;
  businessModelGeneration?: string;
  // ... other new fields
}) => {
  // Implementation
};
```

### 2. Create Data Seeding Scripts
Create scripts to populate the new tables with data from your Book JSON files:

```typescript
// seed-book-hierarchy.ts
import { books, taskMasters, majorTaskGroups, chapters } from './src/lib/schema';
import bookData from './lore/book1_extracted.json';

// Seed implementation
```

### 3. Update UI Components
Update your UI components to display the new hierarchical structure:

```typescript
// Example: BookHierarchy component
const BookHierarchy = ({ bookId }: { bookId: string }) => {
  const taskMasters = useTaskMasters(bookId);
  const majorTaskGroups = useMajorTaskGroups(taskMasters);
  const chapters = useChapters(majorTaskGroups);
  
  return (
    <div className="book-hierarchy">
      {/* Render hierarchical structure */}
    </div>
  );
};
```

### 4. Test with Book 1 Data
Create a test script to verify that Book 1 data can be properly imported:

```bash
# Example test script
npm run test:book-import book1_extracted.json
```

## ⚠️ **Important Considerations**

### Data Integrity
- All new fields are nullable to ensure existing data remains valid
- Foreign key constraints ensure referential integrity
- Indexes are created for better query performance

### Performance
- New indexes on foreign keys improve query performance
- JSON fields (jsonb) provide efficient storage for complex data
- Consider adding materialized views for complex queries

### Rollback Plan
If you need to rollback these changes:

```sql
-- Rollback script (use with caution)
DROP TABLE IF EXISTS "major_task_groups" CASCADE;
DROP TABLE IF EXISTS "task_masters" CASCADE;
ALTER TABLE "books" DROP COLUMN IF EXISTS "epic_novel_plot";
ALTER TABLE "books" DROP COLUMN IF EXISTS "unique_theme";
ALTER TABLE "books" DROP COLUMN IF EXISTS "business_model_generation";
ALTER TABLE "books" DROP COLUMN IF EXISTS "business_model_you";
ALTER TABLE "books" DROP COLUMN IF EXISTS "type";
-- ... continue for chapter fields
```

## 🎯 **Success Metrics**

After successful migration, you should be able to:

1. ✅ Store complete Book 1 hierarchical data
2. ✅ Query books with enhanced metadata
3. ✅ Navigate task master → major task group → chapter relationships
4. ✅ Access learning objectives and book references
5. ✅ Display color themes and visual elements

## 📞 **Support**

If you encounter issues during migration:

1. Check the migration logs for errors
2. Verify database connection settings
3. Ensure all referenced tables exist
4. Check foreign key constraints
5. Validate JSON data structure

The migration is designed to be safe and reversible, but always backup your database before applying changes.

---

*This migration enables full support for the rich educational content structure present in your Book JSON files.*