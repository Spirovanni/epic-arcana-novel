#!/usr/bin/env python3
import json

# Read the enhanced scenes
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/scripts/ea-143-enhanced-scenes.json', 'r') as f:
    enhanced_scenes = json.load(f)

# Read the full outline
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'r') as f:
    outline = json.load(f)

# Navigate to EA-143 and replace scenes
def find_and_replace_scenes(obj, target_id):
    if isinstance(obj, dict):
        if obj.get('id') == target_id:
            obj['scenes'] = enhanced_scenes
            return True
        for value in obj.values():
            if find_and_replace_scenes(value, target_id):
                return True
    elif isinstance(obj, list):
        for item in obj:
            if find_and_replace_scenes(item, target_id):
                return True
    return False

# Find and replace
if find_and_replace_scenes(outline, 'EA-143'):
    # Write back the outline
    with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'w') as f:
        json.dump(outline, f, indent=2)
    print("✅ Successfully replaced EA-143 scenes with enhanced versions")
else:
    print("❌ Could not find EA-143 in outline")
