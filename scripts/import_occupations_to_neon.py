from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple

import psycopg

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_PATH = ROOT / "data" / "career data" / "occupation_data_latest.json"


def detect_level(code: str) -> str:
    digits = code.split("-")[1].split(".")[0]
    if digits.endswith("0000"):
        return "major"
    if digits.endswith("00"):
        return "minor"
    return "broad"


def ensure_tables(conn) -> None:
    ddl = """
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS occupation_groups (
      code VARCHAR(10) PRIMARY KEY,
      name TEXT,
      level VARCHAR(10) NOT NULL CHECK (level IN ('major', 'minor', 'broad')),
      parent_code VARCHAR(10) REFERENCES occupation_groups(code),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_occupation_groups_level ON occupation_groups(level);

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
    """
    with conn.cursor() as cur:
        cur.execute(ddl)
    conn.commit()
    print("✓ Ensured occupation tables exist.")


def load_dataset(path: Path) -> List[Dict]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_group_rows(entries: List[Dict]) -> Dict[str, Dict[str, str]]:
    groups: Dict[str, Dict[str, str]] = {}
    for entry in entries:
        major = entry["groups"]["major"]["code"]
        minor = entry["groups"]["minor"]["code"]
        broad = entry["groups"]["broad"]["code"]

        def upsert_group(code: str, name: str | None, parent: str | None):
            level = detect_level(code)
            existing = groups.get(code)
            if not existing or (not existing["name"] and name):
                groups[code] = {
                    "code": code,
                    "name": name,
                    "level": level,
                    "parent_code": parent,
                }

        upsert_group(major, entry["groups"]["major"]["name"], None)
        upsert_group(minor, entry["groups"]["minor"]["name"], major)
        upsert_group(broad, entry["groups"]["broad"]["name"], minor)
    return groups


def upsert_groups(conn, groups: Dict[str, Dict[str, str]]) -> None:
    order = {"major": 0, "minor": 1, "broad": 2}
    sorted_groups = sorted(groups.values(), key=lambda g: (order[g["level"]], g["code"]))
    sql = """
    INSERT INTO occupation_groups (code, name, level, parent_code, created_at, updated_at)
    VALUES (%(code)s, %(name)s, %(level)s, %(parent_code)s, now(), now())
    ON CONFLICT (code) DO UPDATE
    SET name = COALESCE(EXCLUDED.name, occupation_groups.name),
        parent_code = EXCLUDED.parent_code,
        level = EXCLUDED.level,
        updated_at = now();
    """
    with conn.cursor() as cur:
        cur.executemany(sql, sorted_groups)
    conn.commit()
    print(f"✓ Upserted {len(sorted_groups)} group rows.")


def upsert_occupations(conn, entries: List[Dict]) -> None:
    sql = """
    INSERT INTO occupations (
      onetsoc_code, normalized_code, title, description,
      major_group_code, minor_group_code, broad_group_code,
      created_at, updated_at
    ) VALUES (
      %(onetsoc_code)s, %(normalized_code)s, %(title)s, %(description)s,
      %(major_group_code)s, %(minor_group_code)s, %(broad_group_code)s,
      now(), now()
    )
    ON CONFLICT (onetsoc_code) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        major_group_code = EXCLUDED.major_group_code,
        minor_group_code = EXCLUDED.minor_group_code,
        broad_group_code = EXCLUDED.broad_group_code,
        updated_at = now();
    """
    rows = []
    for entry in entries:
        rows.append(
            {
                "onetsoc_code": entry["onetsoc_code"],
                "normalized_code": entry["normalized_code"],
                "title": entry["title"],
                "description": entry["description"],
                "major_group_code": entry["groups"]["major"]["code"],
                "minor_group_code": entry["groups"]["minor"]["code"],
                "broad_group_code": entry["groups"]["broad"]["code"],
            }
        )
    with conn.cursor() as cur:
        cur.executemany(sql, rows)
    conn.commit()
    print(f"✓ Upserted {len(rows)} occupations.")


def upsert_aliases(conn, entries: List[Dict]) -> None:
    sql = """
    INSERT INTO occupation_aliases (onetsoc_code, alias, alias_type, created_at, updated_at)
    VALUES (%(onetsoc_code)s, %(alias)s, %(alias_type)s, now(), now())
    ON CONFLICT (onetsoc_code, alias, alias_type)
    DO UPDATE SET updated_at = now();
    """
    alias_rows: List[Dict[str, str]] = []
    for entry in entries:
        code = entry["onetsoc_code"]
        alias_rows.extend(
            {"onetsoc_code": code, "alias": alias, "alias_type": "alternate"}
            for alias in entry.get("alternate_titles", [])
        )
        alias_rows.extend(
            {"onetsoc_code": code, "alias": alias, "alias_type": "reported"}
            for alias in entry.get("reported_titles", [])
        )

    with conn.cursor() as cur:
        cur.executemany(sql, alias_rows)
    conn.commit()
    print(f"✓ Upserted {len(alias_rows)} aliases.")


def main(data_path: Path = DEFAULT_DATA_PATH):
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is not set.")

    entries = load_dataset(data_path)
    print(f"Loaded {len(entries)} occupations from {data_path}")

    conn = psycopg.connect(database_url)
    try:
        ensure_tables(conn)
        groups = build_group_rows(entries)
        upsert_groups(conn, groups)
        upsert_occupations(conn, entries)
        upsert_aliases(conn, entries)
    finally:
        conn.close()
        print("Connection closed.")


if __name__ == "__main__":
    main()
