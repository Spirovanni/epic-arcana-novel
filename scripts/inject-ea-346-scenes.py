#!/usr/bin/env python3
"""
Inject EA-346 enhanced scenes into data/l_outline.json
"""

import json
import sys
from pathlib import Path

def inject_ea346_scenes():
    # Paths
    project_root = Path(__file__).parent.parent
    outline_path = project_root / "data" / "l_outline.json"
    scenes_path = project_root / "scripts" / "ea-346-enhanced-scenes.json"
    
    print(f"📖 Injecting EA-346 enhanced scenes into l_outline.json...")
    print(f"   Outline: {outline_path}")
    print(f"   Scenes: {scenes_path}\n")
    
    # Load enhanced scenes
    with open(scenes_path, 'r', encoding='utf-8') as f:
        enhanced_scenes = json.load(f)
    
    print(f"✅ Loaded {len(enhanced_scenes)} enhanced scenes\n")
    
    # Load outline
    with open(outline_path, 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    print("✅ Loaded l_outline.json\n")
    
    # Find EA-346 recursively
    def find_chapter(obj, chapter_id="EA-346"):
        if isinstance(obj, dict):
            if obj.get('id') == chapter_id:
                return obj
            for value in obj.values():
                result = find_chapter(value, chapter_id)
                if result is not None:
                    return result
        elif isinstance(obj, list):
            for item in obj:
                result = find_chapter(item, chapter_id)
                if result is not None:
                    return result
        return None
    
    chapter = find_chapter(outline)
    
    if chapter is None:
        print("❌ Error: EA-346 not found in outline")
        sys.exit(1)
    
    print(f"✅ Found EA-346: {chapter.get('specific_task_group_title', 'Unknown')}")
    print(f"   Current scenes: {len(chapter.get('scenes', []))}\n")
    
    # Replace scenes array
    chapter['scenes'] = enhanced_scenes
    
    print(f"✅ Replaced scenes array with {len(enhanced_scenes)} enhanced scenes\n")
    
    # Save updated outline
    backup_path = outline_path.with_suffix('.json.backup-ea346')
    print(f"💾 Creating backup: {backup_path.name}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Saving updated outline...")
    with open(outline_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, ensure_ascii=False, indent=2)
    
    print("\n✅ EA-346 scenes successfully injected!")
    print(f"   📊 Scenes updated: {len(enhanced_scenes)}")
    print(f"   📖 Backup created: {backup_path.name}")
    
    # Verify the injection
    print("\n🔍 Verifying injection...")
    with open(outline_path, 'r', encoding='utf-8') as f:
        verify_outline = json.load(f)
    
    verify_chapter = find_chapter(verify_outline)
    if verify_chapter and len(verify_chapter.get('scenes', [])) == len(enhanced_scenes):
        print(f"✅ Verification passed: {len(enhanced_scenes)} scenes confirmed in outline")
        
        # Show scene titles
        print("\n📝 Enhanced scenes:")
        for scene in verify_chapter['scenes']:
            print(f"   {scene['scene_number']}. {scene['title']}")
    else:
        print("❌ Verification failed: scene count mismatch")
        sys.exit(1)

if __name__ == "__main__":
    inject_ea346_scenes()
