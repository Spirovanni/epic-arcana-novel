#!/bin/bash

# Sync Enhanced Scenes (Chapters 36-47) to Neon Database
# This script runs both the migration and seed in sequence

set -e  # Exit on error

echo "=================================================="
echo "  Syncing Enhanced Scenes (Chapters 36-47)"
echo "=================================================="
echo ""

# Load .env file if it exists
if [ -f .env ]; then
  echo "📁 Loading environment variables from .env file..."
  
  # Better method: source the .env file to handle complex values
  set -a  # Automatically export all variables
  source .env
  set +a
  
  echo "✓ Environment variables loaded"
  echo ""
else
  echo "⚠️  Warning: .env file not found in current directory"
  echo ""
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "   Please ensure your .env file contains:"
  echo "   DATABASE_URL='postgresql://user:pass@host.neon.tech/database?sslmode=require'"
  echo ""
  echo "   Or export it directly:"
  echo "   export DATABASE_URL='postgresql://user:pass@host/db'"
  exit 1
fi

echo "✓ DATABASE_URL is configured"
echo ""

# Step 1: Run migration
echo "📝 Step 1: Running database migration..."
echo "   Adding enhanced scene fields to scenes table..."
echo ""

if command -v psql &> /dev/null; then
  psql $DATABASE_URL -f add_enhanced_scene_fields.sql
  echo "✓ Migration complete"
else
  echo "⚠️  psql not found - skipping migration"
  echo "   Please run migration manually:"
  echo "   psql \$DATABASE_URL -f add_enhanced_scene_fields.sql"
fi

echo ""
echo "=================================================="
echo ""

# Step 2: Run seed script
echo "📊 Step 2: Seeding enhanced scenes..."
echo "   Processing chapters 36-47 (48 scenes)..."
echo ""

node seed-enhanced-scenes-36-47.mjs

echo ""
echo "=================================================="
echo "✅ SYNC COMPLETE"
echo "=================================================="
echo ""
echo "📚 Enhanced scenes for chapters 36-47 are now in your database!"
echo ""
echo "Next steps:"
echo "  • Verify: SELECT COUNT(*) FROM scenes WHERE chapter_id IN"
echo "           (SELECT id FROM chapters WHERE all_chapter BETWEEN 36 AND 47);"
echo "  • Export to Sudowrite/NovelCrafter for prose generation"
echo "  • Review ENHANCED_SCENES_SYNC_README.md for more details"
echo ""

