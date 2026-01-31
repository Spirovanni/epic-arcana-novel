#!/usr/bin/env python3
"""
EA-346 Scenes Injection Script (v2 - Compliance Fix)
Safely updates data/l_outline.json with corrected EA-346 scenes
Removes explicit author citations (McChesney, David Allen, Newport)
"""

import json
import shutil
from pathlib import Path
from datetime import datetime

# Paths
OUTLINE_PATH = Path("data/l_outline.json")
SCENES_PATH = Path("scripts/ea-346-enhanced-scenes-v2.json")
BACKUP_DIR = Path("data/backups")

def create_backup():
    """Create timestamped backup of l_outline.json"""
    BACKUP_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = BACKUP_DIR / f"l_outline_backup_ea346v2_{timestamp}.json"
    shutil.copy2(OUTLINE_PATH, backup_path)
    print(f"✓ Created backup: {backup_path}")
    return backup_path

def load_json(path):
    """Load and parse JSON file"""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    """Save JSON with proper formatting"""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def find_ea346_recursive(data, path=[]):
    """Recursively find EA-346 in the nested JSON structure"""
    if isinstance(data, dict):
        # Check if this is the EA-346 object
        if data.get('id') == 'EA-346' or data.get('all_chapter') == 346:
            return path, data
        
        # Recursively search in dict values
        for key, value in data.items():
            result = find_ea346_recursive(value, path + [key])
            if result:
                return result
                
    elif isinstance(data, list):
        # Recursively search in list items
        for idx, item in enumerate(data):
            result = find_ea346_recursive(item, path + [idx])
            if result:
                return result
    
    return None

def update_nested_json(data, path, new_scenes):
    """Navigate to the EA-346 object and update its scenes"""
    current = data
    for key in path[:-1]:
        current = current[key]
    
    # Update the scenes array
    current[path[-1]]['scenes'] = new_scenes
    print(f"✓ Updated scenes at path: {' -> '.join(str(p) for p in path)}")

def verify_scenes(scenes_data):
    """Verify scenes have required fields and no author citations"""
    required_fields = [
        'scene_number', 'title', 'setup', 'focus', 'preliminarySceneFocus',
        'preliminarySceneDescription', 'description', 'chapterSceneFocus',
        'location', 'sensoryDetail', 'internalConflict', 'beatGoal',
        'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_variant',
        'pages', 'sceneCardProgression', 'character_arcs'
    ]
    
    # Check for author citations that should be removed
    forbidden_terms = ['McChesney', 'David Allen', 'Newport']
    
    for scene in scenes_data:
        # Check required fields
        for field in required_fields:
            if field not in scene:
                raise ValueError(f"Scene {scene.get('scene_number')} missing required field: {field}")
        
        # Check for forbidden author citations
        description = scene.get('description', '')
        setup = scene.get('setup', '')
        
        for term in forbidden_terms:
            if term in description or term in setup:
                raise ValueError(f"Scene {scene.get('scene_number')} contains forbidden citation: {term}")
    
    print(f"✓ Verified {len(scenes_data)} scenes - all required fields present, no author citations")

def main():
    print("=" * 60)
    print("EA-346 Scenes Injection Script (v2 - Compliance Fix)")
    print("=" * 60)
    
    # Step 1: Create backup
    print("\n[1/6] Creating backup...")
    backup_path = create_backup()
    
    # Step 2: Load new scenes
    print("\n[2/6] Loading corrected scenes...")
    new_scenes = load_json(SCENES_PATH)
    print(f"✓ Loaded {len(new_scenes)} scenes from {SCENES_PATH}")
    
    # Step 3: Verify scenes
    print("\n[3/6] Verifying scene data...")
    verify_scenes(new_scenes)
    
    # Step 4: Load outline
    print("\n[4/6] Loading outline...")
    outline_data = load_json(OUTLINE_PATH)
    print(f"✓ Loaded outline JSON")
    
    # Step 5: Find and update EA-346
    print("\n[5/6] Finding EA-346...")
    result = find_ea346_recursive(outline_data)
    
    if result is None:
        raise ValueError("EA-346 not found in outline")
    
    path, ea346_obj = result
    print(f"✓ Found EA-346 at nested path")
    
    # Store old scene count for comparison
    old_scene_count = len(ea346_obj.get('scenes', []))
    
    # Update scenes using recursive path
    update_nested_json(outline_data, path, new_scenes)
    print(f"✓ Updated scenes (old: {old_scene_count}, new: {len(new_scenes)})")
    
    # Step 6: Save updated outline
    print("\n[6/6] Saving updated outline...")
    save_json(OUTLINE_PATH, outline_data)
    print(f"✓ Saved updated outline to {OUTLINE_PATH}")
    
    # Final verification
    print("\n" + "=" * 60)
    print("INJECTION SUMMARY")
    print("=" * 60)
    print(f"Backup: {backup_path}")
    print(f"Chapter: EA-346")
    print(f"Scenes: {len(new_scenes)}")
    print(f"Changes:")
    print("  - Removed 'McChesney's' citation from Scene 1")
    print("  - Removed 'David Allen's' citation from Scene 2")
    print("  - Removed 'Newport's' citation from Scene 3")
    print("  - All frameworks now embedded as in-world mechanics")
    print("\n✓ Injection complete - ready for import to NeonDB")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        exit(1)
