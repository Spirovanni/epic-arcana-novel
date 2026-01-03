#!/usr/bin/env python3
"""
Safe replacement script for EA-131 scenes in l_outline.json
Reads enhanced scenes from ea-131-enhanced-scenes.json and replaces the scenes array
in the EA-131 chapter node without breaking JSON structure.
"""

import json
import sys
from pathlib import Path

def main():
    # Paths
    repo_root = Path(__file__).parent.parent
    outline_path = repo_root / "data" / "l_outline.json"
    enhanced_scenes_path = repo_root / "scripts" / "ea-131-enhanced-scenes.json"
    backup_path = repo_root / "data" / "l_outline.json.backup-ea131"
    
    print("🔄 EA-131 Scene Replacement Script")
    print("=" * 50)
    
    # Load enhanced scenes
    print(f"📖 Reading enhanced scenes from: {enhanced_scenes_path}")
    with open(enhanced_scenes_path, 'r', encoding='utf-8') as f:
        enhanced_scenes = json.load(f)
    
    print(f"   ✅ Loaded {len(enhanced_scenes)} enhanced scenes")
    
    # Load outline
    print(f"📖 Reading outline from: {outline_path}")
    with open(outline_path, 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    # Create backup
    print(f"💾 Creating backup: {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    # Find EA-131 node recursively
    def find_ea_131(obj, path=""):
        """Recursively search for EA-131 node"""
        if isinstance(obj, dict):
            # Check if this is the EA-131 node
            if obj.get('id') == 'EA-131' and obj.get('unique_identifier') == 'STG 4.1.4.2':
                return obj, path
            
            # Recurse through all dict values
            for key, value in obj.items():
                result, result_path = find_ea_131(value, f"{path}.{key}" if path else key)
                if result is not None:
                    return result, result_path
        
        elif isinstance(obj, list):
            # Recurse through list items
            for i, item in enumerate(obj):
                result, result_path = find_ea_131(item, f"{path}[{i}]")
                if result is not None:
                    return result, result_path
        
        return None, ""
    
    print("🔍 Locating EA-131 node in outline...")
    ea_131_node, node_path = find_ea_131(outline)
    
    if ea_131_node is None:
        print("❌ ERROR: EA-131 node not found in outline")
        sys.exit(1)
    
    print(f"   ✅ Found EA-131 at: {node_path}")
    print(f"   Current scenes count: {len(ea_131_node.get('scenes', []))}")
    
    # Replace scenes array
    print("🔄 Replacing scenes array...")
    old_scene_count = len(ea_131_node.get('scenes', []))
    ea_131_node['scenes'] = enhanced_scenes
    
    print(f"   ✅ Replaced {old_scene_count} scenes with {len(enhanced_scenes)} enhanced scenes")
    
    # Verify structure
    print("🔍 Verifying scene structure...")
    for i, scene in enumerate(enhanced_scenes, 1):
        required_fields = ['scene_number', 'title', 'location', 'timeline_variant']
        missing = [f for f in required_fields if not scene.get(f)]
        if missing:
            print(f"   ⚠️  Scene {i} missing fields: {missing}")
        else:
            print(f"   ✅ Scene {i}: '{scene['title']}' - all required fields present")
    
    # Write updated outline
    print(f"💾 Writing updated outline to: {outline_path}")
    with open(outline_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Scene replacement complete!")
    print(f"   Backup saved to: {backup_path}")
    print(f"   Updated outline: {outline_path}")
    print(f"   Scenes replaced: {old_scene_count} → {len(enhanced_scenes)}")
    print("\nNext step: Run import script")
    print("   npx tsx scripts/import-scenes-to-existing-chapters.ts 131")

if __name__ == '__main__':
    main()
