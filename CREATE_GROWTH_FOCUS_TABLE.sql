-- Create growth_focus table in Neon DB
-- Run this SQL directly in the Neon web console SQL editor

CREATE TABLE IF NOT EXISTS growth_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_id VARCHAR(20) NOT NULL,
  profile_key VARCHAR(50),
  unique_identifier VARCHAR(50),
  specific_task_group_title TEXT,
  chapter_title TEXT,
  display_name TEXT,
  theme TEXT,
  growth_index INTEGER NOT NULL,
  growth_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_growth_focus_canonical_id ON growth_focus(canonical_id);
CREATE INDEX IF NOT EXISTS idx_growth_focus_profile_key ON growth_focus(profile_key);
CREATE INDEX IF NOT EXISTS idx_growth_focus_task_group ON growth_focus(specific_task_group_title);
CREATE INDEX IF NOT EXISTS idx_growth_focus_canonical_idx ON growth_focus(canonical_id, growth_index);
CREATE INDEX IF NOT EXISTS idx_growth_focus_text_search ON growth_focus USING GIN (to_tsvector('english', growth_text));

-- Verify table was created
SELECT 'growth_focus table created successfully!' as status;
SELECT COUNT(*) as record_count FROM growth_focus;
