#!/usr/bin/env python3
"""
Script to add missing specific_task_group_title fields to personality profiles 34+.
The field should be placed right after unique_identifier (as the third line).
"""

import json
import sys
from typing import Dict, Any

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

def add_missing_task_titles(profile_data: Dict[str, Any], task_titles: Dict[str, str]) -> Dict[str, Any]:
    """Add missing specific_task_group_title to personality profiles 34+."""
    updated_count = 0
    
    # Focus on personality profiles 34 and onwards
    for profile_num in range(34, 50):  # Check profiles 34-49
        profile_key = f"personality_profile_{profile_num}"
        
        if profile_key in profile_data:
            profile = profile_data[profile_key]
            if isinstance(profile, dict):
                unique_id = profile.get("unique_identifier")
                
                if unique_id and unique_id in task_titles:
                    title = task_titles[unique_id]
                    
                    # Check if specific_task_group_title is missing or in wrong position
                    if "specific_task_group_title" not in profile:
                        # Create new profile with correct field order
                        new_profile = {}
                        
                        # Add canonical_id first
                        if "canonical_id" in profile:
                            new_profile["canonical_id"] = profile["canonical_id"]
                        
                        # Add unique_identifier second
                        if "unique_identifier" in profile:
                            new_profile["unique_identifier"] = profile["unique_identifier"]
                        
                        # Add specific_task_group_title third
                        new_profile["specific_task_group_title"] = title
                        
                        # Add all other fields
                        for key, value in profile.items():
                            if key not in ["canonical_id", "unique_identifier", "specific_task_group_title"]:
                                new_profile[key] = value
                        
                        # Replace the profile
                        profile_data[profile_key] = new_profile
                        updated_count += 1
                        print(f"Added specific_task_group_title to {profile_key}: {unique_id} -> {title}")
                    else:
                        print(f"{profile_key} already has specific_task_group_title")
    
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
    
    # Show the titles we're looking for
    print("\nLooking for these specific identifiers:")
    target_ids = ["STG 1.3.4.2", "STG 1.3.4.3", "STG 1.3.5.1", "STG 1.3.5.2", "MAT 1.3", "STG 1.3.6.1"]
    for target_id in target_ids:
        if target_id in task_titles:
            print(f"  {target_id}: {task_titles[target_id]}")
        else:
            print(f"  {target_id}: NOT FOUND")
    
    print("\nAdding missing specific_task_group_title to personality profiles...")
    updated_profile_data = add_missing_task_titles(profile_data, task_titles)
    
    print(f"\nUpdated {updated_profile_data} profiles")
    
    print("\nSaving updated new_personality_profile.json...")
    save_json_file(profile_file, updated_profile_data)
    
    print("\nTask completed successfully!")

if __name__ == "__main__":
    main()
