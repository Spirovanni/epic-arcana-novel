# Task Management System - Deployment Guide

## Prerequisites
- [ ] Local testing completed successfully
- [ ] All changes committed to git
- [ ] Production DATABASE_URL available
- [ ] Clerk production keys available (`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)

## Production Deployment Steps

### 1. Deploy Code to Vercel

```bash
# Commit all changes
git add -A
git commit -m "feat: Task management system with database persistence"
git push origin main
```

Vercel will automatically:
- Build the new code
- Deploy to epicarcana.com
- This usually takes 2-3 minutes

### 2. Create Production Database Table

**Option A: Using the script**

```bash
# Set production DATABASE_URL and run
DATABASE_URL="your-production-database-url" node scripts/create-chapter-tasks-table.mjs
```

**Option B: Using Neon SQL Editor**

1. Go to [Neon Dashboard](https://console.neon.tech/)
2. Select your project
3. Open SQL Editor
4. Run this SQL:

```sql
-- Create chapter_tasks table
CREATE TABLE IF NOT EXISTS chapter_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    task_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP,
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (chapter_id, task_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_chapter_tasks_chapter_id 
ON chapter_tasks(chapter_id);

-- Verify table creation
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'chapter_tasks'
ORDER BY ordinal_position;
```

### 3. Verify Deployment

After both steps complete:

1. Visit: https://www.epicarcana.com/chapters/b600d880-d034-46ce-b753-fe13a4c241f5?tab=tasks
2. Open browser console (F12)
3. Check a task
4. Should see: `[TaskChecklist] Task updated successfully`
5. Refresh page
6. Task should remain checked ✅

### 4. Test Multiple Chapters

Verify tasks work across all chapters:
- Each chapter gets its own set of tasks
- Tasks persist independently per chapter
- Progress is tracked per user via Clerk ID

## What's New

### Database
- **New Table:** `chapter_tasks` - Stores task completion state
- **Columns:** id, chapter_id, task_id, title, description, category, completed, completed_at, user_id, timestamps
- **Constraints:** Unique (chapter_id, task_id), Foreign key to chapters

### API Routes
- `GET /api/chapters/[chapterId]/tasks` - List all tasks
- `POST /api/chapters/[chapterId]/tasks` - Create/update task
- `GET /api/chapters/[chapterId]/tasks/[taskId]` - Get task status
- `PUT /api/chapters/[chapterId]/tasks/[taskId]` - Update completion

### Features
- ✅ Auto-initializes tasks on first visit
- ✅ Persists completion to database
- ✅ Tracks who completed each task
- ✅ Records completion timestamp
- ✅ Real-time UI updates
- ✅ Works offline (fallback to local state)

## Authentication / Assessment API Environment
- Use Clerk production keys on production domains: set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to your `pk_live_…` key and `CLERK_SECRET_KEY` to the matching secret.
- Ensure `DATABASE_URL` points to the production database; `/api/assessment/progress` relies on it for saving/loading assessment answers.
- After updating env vars in Vercel, redeploy and verify `/assessment` no longer returns 500s and that Clerk loads without the “development keys” warning.

## Rollback Plan

If issues arise:

```bash
# Revert the commit
git revert HEAD
git push origin main

# Or drop the table if needed
DROP TABLE IF EXISTS chapter_tasks;
```

## Support

If tasks don't persist after deployment:
1. Check Vercel deployment logs
2. Verify DATABASE_URL is set in Vercel environment
3. Confirm chapter_tasks table exists in production DB
4. Check browser console for API errors
