#!/usr/bin/env python3
"""
Extract all 'strengths' bullet points from new_personality_profile.json
and output a flattened dataset suitable for importing into NeonDB.

Usage:
    python extract_strengths.py

Outputs:
    - strengths.json
    - strengths.csv
"""

import json
import csv
from pathlib import Path
from typing import List, Dict, Any


def load_personality_profiles(json_path: Path) -> Dict[str, Any]:
    """Load and parse the personality profiles JSON file."""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_strengths(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extract all strengths from personality profiles.

    Returns a list of dictionaries, each representing one strength
    with metadata from its parent profile.
    """
    strengths_rows = []
    profiles_processed = 0
    profiles_skipped = 0

    # The JSON structure is: data -> families -> family_X -> personalities
    families = data.get('families', {})

    # Collect all personalities from all families
    all_personalities = {}
    for family_key, family_data in families.items():
        personalities = family_data.get('personalities', {})
        all_personalities.update(personalities)

    for profile_key, profile_data in all_personalities.items():
        profiles_processed += 1

        # Extract profile metadata
        canonical_id = profile_data.get('canonical_id', '')
        unique_identifier = profile_data.get('unique_identifier', '')
        specific_task_group_title = profile_data.get('specific_task_group_title', '')
        chapter_title = profile_data.get('chapter_title', '')
        display_name = profile_data.get('display_name', '')
        theme = profile_data.get('theme', '')

        # Check if traits and strengths exist
        traits = profile_data.get('traits')
        if not traits:
            print(f"⚠️  Warning: Profile '{profile_key}' has no 'traits' section. Skipping.")
            profiles_skipped += 1
            continue

        strengths_list = traits.get('strengths')
        if not strengths_list:
            print(f"⚠️  Warning: Profile '{profile_key}' has no 'strengths' in traits. Skipping.")
            profiles_skipped += 1
            continue

        if not isinstance(strengths_list, list):
            print(f"⚠️  Warning: Profile '{profile_key}' has non-list 'strengths'. Skipping.")
            profiles_skipped += 1
            continue

        # Create one row per strength
        for idx, strength_text in enumerate(strengths_list, start=1):
            row = {
                'canonical_id': canonical_id,
                'profile_key': profile_key,
                'unique_identifier': unique_identifier,
                'specific_task_group_title': specific_task_group_title,
                'chapter_title': chapter_title,
                'display_name': display_name,
                'theme': theme,
                'strength_index': idx,
                'strength_text': strength_text
            }
            strengths_rows.append(row)

    return strengths_rows, profiles_processed, profiles_skipped


def write_json_output(rows: List[Dict[str, Any]], output_path: Path) -> None:
    """Write the flattened strengths data to a JSON file."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)


def write_csv_output(rows: List[Dict[str, Any]], output_path: Path) -> None:
    """Write the flattened strengths data to a CSV file."""
    if not rows:
        print("⚠️  No rows to write to CSV.")
        return

    fieldnames = [
        'canonical_id',
        'profile_key',
        'unique_identifier',
        'specific_task_group_title',
        'chapter_title',
        'display_name',
        'theme',
        'strength_index',
        'strength_text'
    ]

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def pretty_print_sample(rows: List[Dict[str, Any]], num_rows: int = 3) -> None:
    """Pretty-print the first few rows for sanity checking."""
    print("\n" + "="*80)
    print(f"Sample of first {min(num_rows, len(rows))} rows:")
    print("="*80)

    for i, row in enumerate(rows[:num_rows], start=1):
        print(f"\n--- Row {i} ---")
        for key, value in row.items():
            # Truncate long values for readability
            if isinstance(value, str) and len(value) > 100:
                display_value = value[:97] + "..."
            else:
                display_value = value
            print(f"  {key:30s}: {display_value}")


def main():
    """Main execution function."""
    print("🚀 Starting strength extraction from new_personality_profile.json\n")

    # Define paths
    project_root = Path(__file__).parent
    input_json = project_root / 'data' / 'dist' / 'new_personality_profile.json'
    output_json = project_root / 'strengths.json'
    output_csv = project_root / 'strengths.csv'

    # Verify input file exists
    if not input_json.exists():
        print(f"❌ Error: Input file not found at {input_json}")
        return

    print(f"📂 Reading from: {input_json}")

    # Load data
    try:
        data = load_personality_profiles(input_json)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Failed to parse JSON: {e}")
        return
    except Exception as e:
        print(f"❌ Error: Failed to read file: {e}")
        return

    # Extract strengths
    print("\n🔍 Extracting strengths...\n")
    strengths_rows, profiles_processed, profiles_skipped = extract_strengths(data)

    total_strengths = len(strengths_rows)

    # Write outputs
    print(f"\n✍️  Writing JSON output to: {output_json}")
    write_json_output(strengths_rows, output_json)

    print(f"✍️  Writing CSV output to: {output_csv}")
    write_csv_output(strengths_rows, output_csv)

    # Summary
    print("\n" + "="*80)
    print("📊 SUMMARY")
    print("="*80)
    print(f"  Total profiles processed: {profiles_processed}")
    print(f"  Profiles skipped:         {profiles_skipped}")
    print(f"  Total strengths extracted: {total_strengths}")
    print(f"  Output files created:")
    print(f"    - {output_json}")
    print(f"    - {output_csv}")

    # Pretty-print sample
    if strengths_rows:
        pretty_print_sample(strengths_rows, num_rows=3)

    print("\n✅ Extraction complete!\n")


if __name__ == '__main__':
    main()
