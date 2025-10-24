#!/usr/bin/env python3
"""
Script to fix the position of specific_task_group_title in personality profiles.
It should be placed right after unique_identifier (as the third line) in each profile.
"""

import json
import sys
from typing import Dict, Any, List

def load_json_file(file_path: str) -> Dict[str, Any]:
    """Load and parse a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        sys.exit(1)

def save_json_file(file_path: str, data: Dict[str, Any]) -> None:
    """Save data to a JSON file with proper formatting."""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved updated data to {file_path}")
    except Exception as e:
        print(f"Error saving {file_path}: {e}")
        sys.exit(1)

def extract_task_titles_from_outline(outline_data: Dict[str, Any]) -> Dict[str, str]:
    """Extract specific_task_group_title for each unique_identifier from l_outline.json."""
    task_titles = {}
    
    def search_recursive(data):
        if isinstance(data, dict):
            # Check if this is a specific task group with the required fields
            if ("unique_identifier" in data and 
                "specific_task_group_title" in data):
                unique_id = data["unique_identifier"]
                title = data["specific_task_group_title"]
                task_titles[unique_id] = title
            
            # Recursively search in nested dictionaries
            for value in data.values():
                search_recursive(value)
        elif isinstance(data, list):
            # Recursively search in lists
            for item in data:
                search_recursive(item)
    
    search_recursive(outline_data)
    return task_titles

def fix_personality_profiles(profile_data: Dict[str, Any], task_titles: Dict[str, str]) -> Dict[str, Any]:
    """Fix the position of specific_task_group_title in personality profiles."""
    updated_count = 0
    
    # Process each personality profile
    for key, profile in profile_data.items():
        if key.startswith("personality_profile_") and isinstance(profile, dict):
            unique_id = profile.get("unique_identifier")
            if unique_id and unique_id in task_titles:
                title = task_titles[unique_id]
                
                # Check if specific_task_group_title exists and is in wrong position
                if "specific_task_group_title" in profile:
                    # Remove it from current position
                    del profile["specific_task_group_title"]
                
                # Create new profile with correct order
                new_profile = {}
                field_order = [
                    "canonical_id",
                    "unique_identifier", 
                    "specific_task_group_title",
                    "all_chapter",
                    "novel_book",
                    "chapter",
                    "chapter_title",
                    "type",
                    "display_name",
                    "theme",
                    "family",
                    "summary",
                    "tarot_family",
                    "tarot_card_item",
                    "tarot_symbolism"
                ]
                
                # Add fields in correct order
                for field in field_order:
                    if field in profile:
                        new_profile[field] = profile[field]
                    elif field == "specific_task_group_title":
                        new_profile[field] = title
                
                # Add remaining fields that weren't in the predefined order
                for field, value in profile.items():
                    if field not in new_profile:
                        new_profile[field] = value
                
                # Replace the profile
                profile_data[key] = new_profile
                updated_count += 1
                print(f"Fixed {key}: {unique_id} -> {title}")
    
    return profile_data

def main():
    # File paths
    outline_file = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json"
    profile_file = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/dist/new_personality_profile.json"
    
    print("Loading l_outline.json...")
    outline_data = load_json_file(outline_file)
    
    print("Loading new_personality_profile.json...")
    profile_data = load_json_file(profile_file)
    
    print("\nExtracting specific_task_group_title from l_outline.json...")
    task_titles = extract_task_titles_from_outline(outline_data)
    
    print(f"\nFound {len(task_titles)} task titles")
    
    print("\nFixing personality profiles...")
    updated_profile_data = fix_personality_profiles(profile_data, task_titles)
    
    print(f"\nFixed {len([k for k, v in updated_profile_data.items() if k.startswith('personality_profile_') and isinstance(v, dict) and 'specific_task_group_title' in v])} profiles")
    
    print("\nSaving updated new_personality_profile.json...")
    save_json_file(profile_file, updated_profile_data)
    
    print("\nTask completed successfully!")

if __name__ == "__main__":
    main()
