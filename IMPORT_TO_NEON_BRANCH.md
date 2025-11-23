# Import Tables to Your Neon Branch

## Problem
The `strengths` and `shadow` tables were created in a **different database branch** than the one you're viewing in Neon Console. This is why you see "relation does not exist" errors.

## Solution - Run in 2 Steps

### Step 1: Create Tables in Your Current Branch

1. **Open Neon Console** → Go to **SQL Editor**
2. **Copy and paste** the entire contents of `CREATE_TABLES_IN_NEON.sql`
3. **Click "Run"**
4. You should see:
   ```
   status: Tables created successfully!
   table_name  | record_count
   -----------|-------------
   strengths   | 0
   shadow      | 0
   ```

### Step 2: Import Data to Your Branch

After the tables are created, we need to import the data. You have two options:

#### Option A: Using our import scripts (Recommended)

First, make sure your `.env` file points to the correct Neon branch URL. Then run:

```bash
# Import strengths
npx tsx scripts/import-strengths.ts

# Import shadow
npx tsx scripts/import-shadow-resume.ts

# Add indexes
npx tsx scripts/add-strengths-indexes.ts
npx tsx scripts/add-shadow-indexes.ts

# Verify
npx tsx scripts/show-tables-summary.ts
```

#### Option B: Using psql with CSV files

If you want to import directly via SQL:

```bash
# Import strengths
psql "$DATABASE_URL" -c "\COPY strengths(canonical_id, profile_key, unique_identifier, specific_task_group_title, chapter_title, display_name, theme, strength_index, strength_text) FROM 'strengths.csv' WITH (FORMAT csv, HEADER true);"

# Import shadow
psql "$DATABASE_URL" -c "\COPY shadow(canonical_id, profile_key, unique_identifier, specific_task_group_title, chapter_title, display_name, theme, shadow_index, shadow_text) FROM 'shadow.csv' WITH (FORMAT csv, HEADER true);"
```

### Step 3: Verify in Neon Console

Go back to **SQL Editor** and run:

```sql
-- Check counts
SELECT 'strengths' as table, COUNT(*) as records FROM strengths
UNION ALL
SELECT 'shadow' as table, COUNT(*) as records FROM shadow;

-- Should return:
-- strengths | 2000
-- shadow    | 1914
```

---

## Why This Happened

Neon databases support **branching** (like Git branches). You likely have:
- **Main branch**: Where you're viewing in the console (tables don't exist there)
- **Dev/other branch**: Where we created the tables via `drizzle-kit push` (tables exist there)

## Solutions Going Forward

### Option 1: Switch to the correct branch in Neon Console
1. In Neon Console, check the **branch dropdown** (top of page)
2. Switch to the branch where the tables exist
3. You should see the tables and data

### Option 2: Import to your main branch
1. Run the SQL script above in your main branch
2. Import the data using one of the methods above

### Option 3: Merge branches in Neon
1. Go to Neon Console → **Branches**
2. Find the branch with your tables
3. Merge it into your main branch

---

## Quick Check: Which Branch Has the Tables?

Run this locally to see which database your app is using:

```bash
# Check your current DATABASE_URL
echo $DATABASE_URL

# List tables in that database
psql "$DATABASE_URL" -c "\dt" | grep -E "(strengths|shadow)"
```

If you see the tables listed, that's the branch where they exist!

---

## Need Help?

The tables and data definitely exist - they're just in a different Neon branch than the one you're viewing. Follow the steps above to either:
1. Create them in your viewing branch, OR
2. Switch to the branch where they already exist

Both approaches will work!
