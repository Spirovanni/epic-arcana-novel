#!/usr/bin/env python3
"""
Script to merge specific_task_group_title from l_outline.json into new_personality_profile.json
"""

import json
import re

def load_json_file(filepath):
    """Load JSON file and return the data"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json_file(filepath, data):
    """Save data to JSON file with proper formatting"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def extract_task_titles_from_outline(outline_data):
    """Extract specific_task_group_title for each unique_identifier from outline"""
    task_titles = {}
    
    # Navigate through the outline structure to find specific task groups
    if 'SelfImprovementSeries' in outline_data:
        series = outline_data['SelfImprovementSeries']
        
        # Look for specific task groups in the structure
        for book_key, book_data in series.items():
            if isinstance(book_data, dict):
                for chapter_key, chapter_data in book_data.items():
                    if isinstance(chapter_data, dict) and 'Specific_task_groups' in chapter_data:
                        specific_groups = chapter_data['Specific_task_groups']
                        for group_key, group_data in specific_groups.items():
                            if isinstance(group_data, dict) and 'unique_identifier' in group_data:
                                unique_id = group_data['unique_identifier']
                                if 'specific_task_group_title' in group_data:
                                    task_titles[unique_id] = group_data['specific_task_group_title']
    
    return task_titles

def add_task_titles_to_profiles(profile_data, task_titles, limit=10):
    """Add specific_task_group_title to personality profiles"""
    added_count = 0
    
    # Navigate through the profile structure
    if 'families' in profile_data:
        for family_key, family_data in profile_data['families'].items():
            if isinstance(family_data, dict) and 'personalities' in family_data:
                personalities = family_data['personalities']
                if isinstance(personalities, dict) and 'personalities' in personalities:
                    profile_list = personalities['personalities']
                    
                    for profile_key, profile_data in profile_list.items():
                        if isinstance(profile_data, dict) and 'unique_identifier' in profile_data:
                            unique_id = profile_data['unique_identifier']
                            
                            if unique_id in task_titles and added_count < limit:
                                # Add the specific_task_group_title after unique_identifier
                                task_title = task_titles[unique_id]
                                
                                # Create a new ordered dict to maintain structure
                                new_profile = {}
                                for key, value in profile_data.items():
                                    new_profile[key] = value
                                    if key == 'unique_identifier':
                                        new_profile['specific_task_group_title'] = task_title
                                
                                # Replace the profile data
                                profile_list[profile_key] = new_profile
                                added_count += 1
                                
                                print(f"Added '{task_title}' to {unique_id}")
    
    return added_count

def main():
    # File paths
    outline_file = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json'
    profile_file = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/dist/new_personality_profile.json'
    output_file = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/dist/new_personality_profile_updated.json'
    
    print("Loading outline data...")
    outline_data = load_json_file(outline_file)
    
    print("Extracting task titles from outline...")
    task_titles = extract_task_titles_from_outline(outline_data)
    print(f"Found {len(task_titles)} task titles")
    
    print("Loading profile data...")
    profile_data = load_json_file(profile_file)
    
    print("Adding task titles to profiles (first 10)...")
    added_count = add_task_titles_to_profiles(profile_data, task_titles, limit=10)
    
    print(f"Added {added_count} task titles to profiles")
    
    print("Saving updated profile data...")
    save_json_file(output_file, profile_data)
    
    print(f"Updated profiles saved to: {output_file}")

if __name__ == "__main__":
    main()
