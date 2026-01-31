#!/usr/bin/env python3
"""
Inject comprehensive EA-346 scenes into data/l_outline.json
"""
import json
from pathlib import Path
from datetime import datetime

def find_ea346_recursive(data, path=[]):
    """Recursively search for EA-346 chapter"""
    if isinstance(data, dict):
        if data.get('id') == 'EA-346' or data.get('chapter_number') == 346:
            return path, data
        for key, value in data.items():
            result = find_ea346_recursive(value, path + [key])
            if result:
                return result
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            result = find_ea346_recursive(item, path + [idx])
            if result:
                return result
    return None

def update_nested_json(data, path, new_scenes):
    """Navigate nested structure and update scenes"""
    current = data
    for key in path[:-1]:
        current = current[key]
    current[path[-1]]['scenes'] = new_scenes
    print(f"✓ Updated scenes at path: {' -> '.join(str(p) for p in path)}")

def main():
    # Paths
    outline_path = Path('data/l_outline.json')
    scenes_path = Path('scripts/ea-346-comprehensive-scenes.json')
    backup_path = Path('data/l_outline.json.backup-ea346-comprehensive')
    
    # Load new scenes
    print(f"Loading comprehensive scenes from {scenes_path}...")
    with open(scenes_path, 'r') as f:
        new_scenes = json.load(f)
    print(f"✓ Loaded {len(new_scenes)} scenes")
    
    # Load outline
    print(f"Loading outline from {outline_path}...")
    with open(outline_path, 'r') as f:
        outline_data = json.load(f)
    print(f"✓ Loaded outline")
    
    # Find EA-346
    print("Searching for EA-346...")
    result = find_ea346_recursive(outline_data)
    if not result:
        print("✗ EA-346 not found!")
        return 1
    
    path, chapter_data = result
    print(f"✓ Found EA-346 at: {' -> '.join(str(p) for p in path)}")
    print(f"  Title: {chapter_data.get('title', 'N/A')}")
    print(f"  Current scenes: {len(chapter_data.get('scenes', []))}")
    
    # Backup
    print(f"Creating backup at {backup_path}...")
    with open(backup_path, 'w') as f:
        json.dump(outline_data, f, indent=2)
    print(f"✓ Backup created")
    
    # Update scenes
    print("Updating scenes...")
    update_nested_json(outline_data, path, new_scenes)
    
    # Save
    print(f"Saving updated outline to {outline_path}...")
    with open(outline_path, 'w') as f:
        json.dump(outline_data, f, indent=2)
    print(f"✓ Saved updated outline")
    
    print("\n✓ EA-346 comprehensive scenes injection complete!")
    print(f"  Scenes updated: {len(new_scenes)}")
    print(f"  Backup location: {backup_path}")
    
    return 0

if __name__ == '__main__':
    exit(main())
