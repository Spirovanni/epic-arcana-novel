#!/usr/bin/env python3
"""
Safe replacement script for EA-137 scenes in l_outline.json
"""

import json
import sys
from pathlib import Path

def main():
    repo_root = Path(__file__).parent.parent
    outline_path = repo_root / "data" / "l_outline.json"
    enhanced_scenes_path = repo_root / "scripts" / "ea-137-enhanced-scenes.json"
    backup_path = repo_root / "data" / "l_outline.json.backup-ea137"
    
    print("🔄 EA-137 Scene Replacement Script")
    print("=" * 50)
    
    with open(enhanced_scenes_path, 'r', encoding='utf-8') as f:
        enhanced_scenes = json.load(f)
    print(f"   ✅ Loaded {len(enhanced_scenes)} enhanced scenes")
    
    with open(outline_path, 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    def find_ea_137(obj, path=""):
        if isinstance(obj, dict):
            if obj.get('id') == 'EA-137' and obj.get('unique_identifier') == 'STG 4.2.2.1':
                return obj, path
            for key, value in obj.items():
                result, result_path = find_ea_137(value, f"{path}.{key}" if path else key)
                if result is not None:
                    return result, result_path
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                result, result_path = find_ea_137(item, f"{path}[{i}]")
                if result is not None:
                    return result, result_path
        return None, ""
    
    ea_137_node, node_path = find_ea_137(outline)
    
    if ea_137_node is None:
        print("❌ ERROR: EA-137 node not found")
        sys.exit(1)
    
    print(f"   ✅ Found EA-137")
    old_scene_count = len(ea_137_node.get('scenes', []))
    ea_137_node['scenes'] = enhanced_scenes
    
    for i, scene in enumerate(enhanced_scenes, 1):
        required_fields = ['scene_number', 'title', 'location', 'timeline_variant']
        missing = [f for f in required_fields if not scene.get(f)]
        if missing:
            print(f"   ⚠️  Scene {i} missing: {missing}")
        else:
            print(f"   ✅ Scene {i}: '{scene['title']}'")
    
    with open(outline_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Replacement complete! ({old_scene_count} → {len(enhanced_scenes)})")
    print("   Next: npx tsx scripts/import-scenes-to-existing-chapters.ts 137")

if __name__ == '__main__':
    main()
