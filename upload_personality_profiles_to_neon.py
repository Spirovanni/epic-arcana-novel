from __future__ import annotations

import json
import os
import uuid
from pathlib import Path
from typing import Any, Dict

import psycopg


def load_profiles(path: str | Path) -> Dict[str, Any]:
    """
    Load personality profiles from the JSON file.
    """
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def iter_personality_profiles(data: Dict[str, Any]):
    """
    Yield (canonical_id, profile, family_name) from the nested structure:
    data["families"][family_key]["personalities"]["personalities"][profile_key]

    Each yielded profile is ready for database insertion.
    """
    families = data.get("families", {})

    for family_key, family_data in families.items():
        family_name = family_data.get("family_name", "Unknown Family")
        personalities_container = family_data.get("personalities", {})
        personalities_dict = personalities_container.get("personalities", {})

        for profile_key, profile in personalities_dict.items():
            canonical_id = profile.get("canonical_id")
            if canonical_id:
                yield canonical_id, profile, family_name


def ensure_table(conn):
    """
    Create the personality_profiles table if it doesn't exist.
    """
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS personality_profiles (
      id UUID PRIMARY KEY,
      canonical_id TEXT UNIQUE NOT NULL,
      unique_identifier TEXT NOT NULL,
      display_name TEXT,
      theme TEXT,
      family TEXT,
      book_association JSONB,
      enneagram_link JSONB,
      color_alignment JSONB,
      scoring_model JSONB,
      specific_task_group_books_influenced_by JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    """

    with conn.cursor() as cur:
        cur.execute(create_table_sql)
    conn.commit()
    print("✓ Table 'personality_profiles' ensured.")


def upsert_profile(conn, profile_row: Dict[str, Any]) -> uuid.UUID:
    """
    Upsert a single personality profile into the database.
    Returns the UUID of the inserted/updated row.
    """
    upsert_sql = """
    INSERT INTO personality_profiles (
      id,
      canonical_id,
      unique_identifier,
      display_name,
      theme,
      family,
      book_association,
      enneagram_link,
      color_alignment,
      scoring_model,
      specific_task_group_books_influenced_by,
      created_at,
      updated_at
    ) VALUES (
      %(id)s,
      %(canonical_id)s,
      %(unique_identifier)s,
      %(display_name)s,
      %(theme)s,
      %(family)s,
      %(book_association)s::jsonb,
      %(enneagram_link)s::jsonb,
      %(color_alignment)s::jsonb,
      %(scoring_model)s::jsonb,
      %(specific_task_group_books_influenced_by)s::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (canonical_id) DO UPDATE
    SET
      unique_identifier = EXCLUDED.unique_identifier,
      display_name = EXCLUDED.display_name,
      theme = EXCLUDED.theme,
      family = EXCLUDED.family,
      book_association = EXCLUDED.book_association,
      enneagram_link = EXCLUDED.enneagram_link,
      color_alignment = EXCLUDED.color_alignment,
      scoring_model = EXCLUDED.scoring_model,
      specific_task_group_books_influenced_by = EXCLUDED.specific_task_group_books_influenced_by,
      updated_at = NOW()
    RETURNING id;
    """

    with conn.cursor() as cur:
        cur.execute(upsert_sql, profile_row)
        result = cur.fetchone()
        returned_id = result[0] if result else profile_row["id"]

    conn.commit()
    return returned_id


def main(
    profiles_path: str = "data/dist/new_personality_profile.json",
    output_map_path: str = "personality_profile_id_map.json",
):
    """
    Main function to load profiles, upsert them into Neon, and generate the ID map.
    """
    # 1) Connect to Neon using DATABASE_URL
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")

    print(f"Connecting to Neon database...")
    conn = psycopg.connect(database_url)

    try:
        # 2) Ensure table exists
        ensure_table(conn)

        # 3) Load JSON and iterate profiles
        print(f"Loading profiles from {profiles_path}...")
        profiles_data = load_profiles(profiles_path)

        profile_id_map = {}
        upsert_count = 0
        error_count = 0

        for canonical_id, profile, family_name in iter_personality_profiles(profiles_data):
            try:
                # Extract the fields we need
                profile_row = {
                    "id": str(uuid.uuid4()),
                    "canonical_id": canonical_id,
                    "unique_identifier": profile.get("unique_identifier"),
                    "display_name": profile.get("display_name"),
                    "theme": profile.get("theme"),
                    "family": profile.get("family"),
                    "book_association": json.dumps(profile.get("book_association") or {}),
                    "enneagram_link": json.dumps(profile.get("enneagram_link") or {}),
                    "color_alignment": json.dumps(profile.get("color_alignment") or {}),
                    "scoring_model": json.dumps(profile.get("scoring_model") or {}),
                    "specific_task_group_books_influenced_by": json.dumps(
                        profile.get("specific_task_group_books_influenced_by") or {}
                    ),
                }

                # Upsert the profile and get back the UUID
                returned_id = upsert_profile(conn, profile_row)

                # Build the mapping entry
                profile_id_map[canonical_id] = {
                    "id": str(returned_id),
                    "unique_identifier": profile.get("unique_identifier"),
                    "display_name": profile.get("display_name"),
                    "family": profile.get("family"),
                    "theme": profile.get("theme"),
                }

                upsert_count += 1
                print(f"  ✓ {canonical_id} ({profile.get('display_name')})")

            except Exception as e:
                error_count += 1
                print(f"  ✗ Error processing {canonical_id}: {e}")

        # 4) Write personality_profile_id_map.json
        output_path = Path(output_map_path)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(profile_id_map, f, indent=2, ensure_ascii=False)

        # 5) Print summary
        print("\n" + "=" * 60)
        print(f"✓ Successfully uploaded {upsert_count} personality profiles to Neon")
        if error_count > 0:
            print(f"⚠ {error_count} profiles had errors during processing")
        print(f"✓ Personality profile ID map written to {output_path}")
        print(f"  Total profiles in map: {len(profile_id_map)}")
        print("=" * 60)

    finally:
        conn.close()


if __name__ == "__main__":
    main()
