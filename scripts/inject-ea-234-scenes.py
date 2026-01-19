#!/usr/bin/env python3
"""
Safely inject EA-234 enhanced scenes into data/l_outline.json
Preserves all chapter metadata and only replaces the scenes array.
"""

import json
import sys
from pathlib import Path

def inject_ea_234_scenes():
    """Replace EA-234 scenes in l_outline.json with enhanced versions."""
    
    # File paths
    outline_path = Path("data/l_outline.json")
    scenes_path = Path("scripts/ea-234-enhanced-scenes.json")
    backup_path = Path("data/l_outline.backup-ea-234.json")
    
    # Verify files exist
    if not outline_path.exists():
        print(f"❌ Error: {outline_path} not found")
        sys.exit(1)
    
    if not scenes_path.exists():
        print(f"❌ Error: {scenes_path} not found")
        sys.exit(1)
    
    # Load enhanced scenes
    print(f"📖 Loading enhanced scenes from {scenes_path}...")
    with open(scenes_path, 'r', encoding='utf-8') as f:
        enhanced_scenes = json.load(f)
    
    print(f"✅ Loaded {len(enhanced_scenes)} enhanced scenes")
    
    # Load outline
    print(f"📖 Loading outline from {outline_path}...")
    with open(outline_path, 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    # Create backup
    print(f"💾 Creating backup at {backup_path}...")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    # Find EA-234 in the outline structure
    print("🔍 Locating EA-234 in outline...")
    found = False
    
    # The outline structure follows the pattern seen in the file
    def find_and_replace_ea234(obj):
        """Recursively search for EA-234 and replace its scenes."""
        nonlocal found
        
        if isinstance(obj, dict):
            # Check if this object is EA-234
            if obj.get('id') == 'EA-234':
                print(f"✅ Found EA-234 at {obj.get('unique_identifier')}")
                print(f"   Current scene count: {len(obj.get('scenes', []))}")
                
                # Replace scenes array
                obj['scenes'] = enhanced_scenes
                
                print(f"   New scene count: {len(enhanced_scenes)}")
                found = True
                return True
            
            # Recursively search in all dict values
            for key, value in obj.items():
                if find_and_replace_ea234(value):
                    return True
                    
        elif isinstance(obj, list):
            # Recursively search in all list items
            for item in obj:
                if find_and_replace_ea234(item):
                    return True
        
        return False
    
    find_and_replace_ea234(outline)
    
    if not found:
        print("❌ Error: Could not find EA-234 in outline structure")
        sys.exit(1)
    
    # Write updated outline
    print(f"💾 Writing updated outline to {outline_path}...")
    with open(outline_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    print("✅ Successfully injected EA-234 enhanced scenes")
    print(f"   Backup saved to: {backup_path}")
    print(f"   Outline updated: {outline_path}")

if __name__ == "__main__":
    inject_ea_234_scenes()
