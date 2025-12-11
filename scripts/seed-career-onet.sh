#!/usr/bin/env bash
set -euo pipefail

# Seed the O*NET career data into Neon/Postgres from the MySQL export files.
# We isolate everything in a dedicated schema to avoid name collisions.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_DIR="$ROOT_DIR/data/career data/db_30_0_mysql"
SCHEMA_NAME="career_onet"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL is not set. Export it or add to .env before running." >&2
  exit 1
fi

echo "📦 Preparing schema \"$SCHEMA_NAME\"..."
psql "$DATABASE_URL" <<SQL
DROP SCHEMA IF EXISTS "$SCHEMA_NAME" CASCADE;
CREATE SCHEMA "$SCHEMA_NAME";
SET search_path TO "$SCHEMA_NAME", public;
SQL

echo "🚚 Seeding O*NET files into schema \"$SCHEMA_NAME\"..."
for file in "$SQL_DIR"/*.sql; do
  echo "  → $file"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<SQL
SET search_path TO "$SCHEMA_NAME", public;
\\i '$file'
SQL
done

echo "✅ Career data import complete."
