#!/usr/bin/env python3
"""
Safe replacement script for EA-133 scenes in l_outline.json
Reads enhanced scenes from ea-133-enhanced-scenes.json and adds the scenes array
to the EA-133 chapter node without breaking JSON structure.
"""

import json
import sys
from pathlib import Path

def main():
    # Paths
    repo_root = Path(__file__).parent.parent
    outline_path = repo_root / "data" / "l_outline.json"
    enhanced_scenes_path = repo_root / "scripts" / "ea-133-enhanced-scenes.json"
    backup_path = repo_root / "data" / "l_outline.json.backup-ea133"
    
    print("🔄 EA-133 Scene Replacement Script")
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
    
    # Find EA-133 node recursively
    def find_ea_133(obj, path=""):
        """Recursively search for EA-133 node"""
        if isinstance(obj, dict):
            # Check if this is the EA-133 node
            if obj.get('id') == 'EA-133' and obj.get('unique_identifier') == 'MAT 4.1':
                return obj, path
            
            # Recurse through all dict values
            for key, value in obj.items():
                result, result_path = find_ea_133(value, f"{path}.{key}" if path else key)
                if result is not None:
                    return result, result_path
        
        elif isinstance(obj, list):
            # Recurse through list items
            for i, item in enumerate(obj):
                result, result_path = find_ea_133(item, f"{path}[{i}]")
                if result is not None:
                    return result, result_path
        
        return None, ""
    
    print("🔍 Locating EA-133 node in outline...")
    ea_133_node, node_path = find_ea_133(outline)
    
    if ea_133_node is None:
        print("❌ ERROR: EA-133 node not found in outline")
        sys.exit(1)
    
    print(f"   ✅ Found EA-133 at: {node_path}")
    old_scene_count = len(ea_133_node.get('scenes', []))
    print(f"   Current scenes count: {old_scene_count}")
    
    # Add/Replace scenes array
    print("🔄 Adding scenes array...")
    ea_133_node['scenes'] = enhanced_scenes
    
    print(f"   ✅ Added {len(enhanced_scenes)} enhanced scenes (was {old_scene_count})")
    
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
    print(f"   Scenes added: {old_scene_count} → {len(enhanced_scenes)}")
    print("\nNext step: Run import script")
    print("   npx tsx scripts/import-scenes-to-existing-chapters.ts 133")

if __name__ == '__main__':
    main()
