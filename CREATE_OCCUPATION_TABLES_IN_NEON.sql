-- ==============================================================================
-- CAREER DATA TABLES FOR NEON (O*NET 30.0 aligned)
-- ==============================================================================
-- Run this SQL in your Neon SQL Editor (or via psql) to create the base schema
-- for occupations, aliases, and the narrative layer (guilds/vocations).
-- ==============================================================================

-- UUID helpers for aliases/vocations/guilds
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------ 
-- Hierarchy containers (major / minor / broad groups)
-- ------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS occupation_groups (
  code VARCHAR(10) PRIMARY KEY,
  name TEXT,
  level VARCHAR(10) NOT NULL CHECK (level IN ('major', 'minor', 'broad')),
  parent_code VARCHAR(10) REFERENCES occupation_groups(code),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occupation_groups_level ON occupation_groups(level);

-- ------------------------------------------------------------------------------ 
-- Canonical occupations (one row per O*NET onetsoc_code)
-- ------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS occupations (
  onetsoc_code VARCHAR(10) PRIMARY KEY,
  normalized_code VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  major_group_code VARCHAR(10) REFERENCES occupation_groups(code),
  minor_group_code VARCHAR(10) REFERENCES occupation_groups(code),
  broad_group_code VARCHAR(10) REFERENCES occupation_groups(code),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occupations_major ON occupations(major_group_code);
CREATE INDEX IF NOT EXISTS idx_occupations_minor ON occupations(minor_group_code);
CREATE INDEX IF NOT EXISTS idx_occupations_broad ON occupations(broad_group_code);
CREATE INDEX IF NOT EXISTS idx_occupations_text_search
  ON occupations USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));

-- ------------------------------------------------------------------------------ 
-- Aliases / reported titles for searchability and story mapping
-- ------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS occupation_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onetsoc_code VARCHAR(10) REFERENCES occupations(onetsoc_code) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_type VARCHAR(20) NOT NULL CHECK (alias_type IN ('alternate', 'reported')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (onetsoc_code, alias, alias_type)
);
CREATE INDEX IF NOT EXISTS idx_occupation_aliases_code ON occupation_aliases(onetsoc_code);
CREATE INDEX IF NOT EXISTS idx_occupation_aliases_search
  ON occupation_aliases USING gin (to_tsvector('english', alias));

-- ------------------------------------------------------------------------------ 
-- Narrative layer scaffolding (for guilds/vocations mapping)
-- ------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  calling_theme TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vocation_occupations (
  vocation_id UUID REFERENCES vocations(id) ON DELETE CASCADE,
  onetsoc_code VARCHAR(10) REFERENCES occupations(onetsoc_code) ON DELETE CASCADE,
  fit_strength VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (vocation_id, onetsoc_code)
);
CREATE INDEX IF NOT EXISTS idx_vocation_occupations_code ON vocation_occupations(onetsoc_code);
