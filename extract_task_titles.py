#!/usr/bin/env python3
"""
Script to extract specific_task_group_title from l_outline.json and add it to 
corresponding personality profiles in new_personality_profile.json
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
                print(f"Found: {unique_id} -> {title}")
            
            # Recursively search in nested dictionaries
            for value in data.values():
                search_recursive(value)
        elif isinstance(data, list):
            # Recursively search in lists
            for item in data:
                search_recursive(item)
    
    search_recursive(outline_data)
    return task_titles

def add_task_titles_to_profiles(profile_data: Dict[str, Any], task_titles: Dict[str, str]) -> Dict[str, Any]:
    """Add specific_task_group_title to personality profiles based on unique_identifier."""
    updated_count = 0
    
    def update_recursive(data):
        nonlocal updated_count
        
        if isinstance(data, dict):
            # Check if this is a personality profile with unique_identifier
            if "unique_identifier" in data and "canonical_id" in data:
                unique_id = data["unique_identifier"]
                if unique_id in task_titles:
                    # Add the specific_task_group_title after unique_identifier
                    title = task_titles[unique_id]
                    data["specific_task_group_title"] = title
                    updated_count += 1
                    print(f"Updated profile {data.get('canonical_id', 'unknown')}: {unique_id} -> {title}")
            
            # Recursively update nested dictionaries
            for value in data.values():
                update_recursive(value)
        elif isinstance(data, list):
            # Recursively update lists
            for item in data:
                update_recursive(item)
    
    update_recursive(profile_data)
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
    
    print(f"\nFound {len(task_titles)} task titles:")
    for unique_id, title in task_titles.items():
        print(f"  {unique_id}: {title}")
    
    print("\nAdding specific_task_group_title to personality profiles...")
    updated_profile_data = add_task_titles_to_profiles(profile_data, task_titles)
    
    print(f"\nUpdated {len([k for k, v in updated_profile_data.items() if isinstance(v, dict) and 'specific_task_group_title' in v])} profiles")
    
    print("\nSaving updated new_personality_profile.json...")
    save_json_file(profile_file, updated_profile_data)
    
    print("\nTask completed successfully!")

if __name__ == "__main__":
    main()

