#!/usr/bin/env python3
import json
import sys

def main():
    with open('scripts/ea-152-enhanced-scenes.json', 'r', encoding='utf-8') as f:
        enhanced_scenes = json.load(f)
    
    with open('data/l_outline.json', 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    def find_and_update(obj, target_id):
        if isinstance(obj, dict):
            if obj.get('id') == target_id:
                obj['scenes'] = enhanced_scenes
                return True
            for value in obj.values():
                if find_and_update(value, target_id):
                    return True
        elif isinstance(obj, list):
            for item in obj:
                if find_and_update(item, target_id):
                    return True
        return False
    
    if not find_and_update(outline, 'EA-152'):
        print("❌ EA-152 not found")
        sys.exit(1)
    
    with open('data/l_outline.json', 'w', encoding='utf-8') as f:
        json.dump(outline, f, indent=2, ensure_ascii=False)
    
    print("✅ EA-152 scenes replaced")
    for i, scene in enumerate(enhanced_scenes, 1):
        print(f"   {i}. {scene['title']}")

if __name__ == '__main__':
    main()
