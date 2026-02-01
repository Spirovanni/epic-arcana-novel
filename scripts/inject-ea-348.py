import json
import os
import shutil
import sys

# Load new scenes
with open('scripts/ea-348-enhanced-scenes.json', 'r') as f:
    new_scenes = json.load(f)

# Load outline
outline_path = 'data/l_outline.json'
with open(outline_path, 'r') as f:
    data = json.load(f)

# Backup
shutil.copy(outline_path, outline_path + '.backup-ea348-comprehensive')
print(f"Created backup at {outline_path}.backup-ea348-comprehensive")

# Find EA-348
def find_ea348_recursive(data, path=[]):
    if isinstance(data, dict):
        if data.get('id') == 'EA-348': # Exact ID match
            return path, data
        for key, value in data.items():
            result = find_ea348_recursive(value, path + [key])
            if result:
                return result
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            result = find_ea348_recursive(item, path + [idx])
            if result:
                return result
    return None

result = find_ea348_recursive(data)

if not result:
    print("EA-348 not found!")
    sys.exit(1)

path, chapter = result
print(f"Found EA-348 at path: {' -> '.join(str(p) for p in path)}")

# Update scenes
# Navigate to the object to modify it in place
current = data
for key in path[:-1]:
    current = current[key]

# Update the target object
target = current[path[-1]]
target['scenes'] = new_scenes
target['title'] = "Esprit De Corps" # Update title if needed

# Save
with open(outline_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Successfully injected EA-348 scenes into l_outline.json")
