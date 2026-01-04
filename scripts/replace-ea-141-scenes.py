#!/usr/bin/env python3
import json, sys
from pathlib import Path

repo_root = Path(__file__).parent.parent
outline_path = repo_root / "data" / "l_outline.json"
enhanced_path = repo_root / "scripts" / "ea-141-enhanced-scenes.json"
backup_path = repo_root / "data" / "l_outline.json.backup-ea141"

print("🔄 EA-141 Scene Replacement")
print("=" * 50)

with open(enhanced_path, 'r') as f:
    enhanced_scenes = json.load(f)
print(f"   ✅ Loaded {len(enhanced_scenes)} scenes")

with open(outline_path, 'r') as f:
    outline = json.load(f)

with open(backup_path, 'w') as f:
    json.dump(outline, f, indent=2, ensure_ascii=False)

def find_ea_141(obj, path=""):
    if isinstance(obj, dict):
        if obj.get('id') == 'EA-141' and obj.get('unique_identifier') == 'STG 4.2.3.2':
            return obj, path
        for key, value in obj.items():
            result, rpath = find_ea_141(value, f"{path}.{key}" if path else key)
            if result: return result, rpath
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            result, rpath = find_ea_141(item, f"{path}[{i}]")
            if result: return result, rpath
    return None, ""

node, _ = find_ea_141(outline)
if not node:
    print("❌ EA-141 not found")
    sys.exit(1)

print("   ✅ Found EA-141")
old_count = len(node.get('scenes', []))
node['scenes'] = enhanced_scenes

for i, scene in enumerate(enhanced_scenes, 1):
    print(f"   ✅ Scene {i}: '{scene['title']}'")

with open(outline_path, 'w') as f:
    json.dump(outline, f, indent=2, ensure_ascii=False)

print(f"\n✅ Complete! ({old_count} → {len(enhanced_scenes)})")
