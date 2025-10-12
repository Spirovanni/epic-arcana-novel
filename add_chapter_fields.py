import json
import re

# Load the JSON file
with open('data/l_outline.json', 'r', encoding='utf-8') as f:
    content = f.read()
    data = json.load(open('data/l_outline.json', 'r', encoding='utf-8'))

# Track all chapters to understand the pattern
chapters_info = []

def find_chapters_with_path(obj, path='', parent_path=''):
    """Recursively find all chapters with their JSON path"""
    if isinstance(obj, dict):
        if 'unique_identifier' in obj and isinstance(obj.get('unique_identifier'), str) and obj['unique_identifier'].startswith('STG'):
            # Extract book number from unique_identifier (e.g., STG 2.2.6.1 -> book "2")
            uid = obj.get('unique_identifier', '')
            match = re.match(r'STG\s+(\d+)\.', uid)
            book_number = match.group(1) if match else None
            
            chapters_info.append({
                'unique_identifier': uid,
                'id': obj.get('id'),
                'all_chapter': obj.get('all_chapter'),
                'book': obj.get('book'),
                'chapter': obj.get('chapter'),
                'book_number_from_uid': book_number,
                'path': path,
                'obj': obj
            })
        for k, v in obj.items():
            find_chapters_with_path(v, path + '.' + k if path else k, path)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_chapters_with_path(item, path + f'[{i}]', path)

find_chapters_with_path(data)

print(f"Total chapters found: {len(chapters_info)}\n")

# Find the starting point (STG 2.2.6.1) and process next 50 chapters
start_idx = None
for i, ch in enumerate(chapters_info):
    if ch['unique_identifier'] == 'STG 2.2.6.1':
        start_idx = i
        break

if start_idx is None:
    print("Could not find STG 2.2.6.1")
    exit(1)

print(f"Starting from chapter at index {start_idx + 1}: {chapters_info[start_idx + 1]['unique_identifier']}")
print(f"Will process 50 chapters from index {start_idx + 1} to {start_idx + 50}\n")

# Determine the starting all_chapter number
# Look at the last chapter with all_chapter defined before the missing ones
last_all_chapter = None
for i in range(start_idx, -1, -1):
    if chapters_info[i]['all_chapter'] and chapters_info[i]['all_chapter'] != 'MISSING':
        try:
            last_all_chapter = int(chapters_info[i]['all_chapter'])
            break
        except (ValueError, TypeError):
            pass

if last_all_chapter is None:
    print("Could not determine last all_chapter number")
    exit(1)

print(f"Last known all_chapter: {last_all_chapter}")
print(f"Will start numbering from: {last_all_chapter + 1}\n")

# Process the next 50 chapters
updates = []
current_all_chapter = last_all_chapter + 1

for i in range(start_idx + 1, min(start_idx + 51, len(chapters_info))):
    ch = chapters_info[i]
    needs_update = False
    
    # Check if any fields are missing
    if not ch['id'] or ch['id'] == 'MISSING':
        needs_update = True
    if not ch['all_chapter'] or ch['all_chapter'] == 'MISSING':
        needs_update = True
    if not ch['book'] or ch['book'] == 'MISSING':
        needs_update = True
    
    if needs_update:
        # Determine values
        new_id = f"EA-{current_all_chapter:03d}"
        new_all_chapter = current_all_chapter
        new_book = ch['book_number_from_uid']
        
        updates.append({
            'chapter': ch,
            'new_id': new_id,
            'new_all_chapter': new_all_chapter,
            'new_book': new_book
        })
        
        print(f"Chapter {i - start_idx}: {ch['unique_identifier']:20s} -> id: {new_id}, all_chapter: {new_all_chapter}, book: {new_book}")
    
    # Increment for next chapter, whether we updated or not
    current_all_chapter += 1

print(f"\nTotal chapters that need updates: {len(updates)}")

# Now apply the updates to the actual JSON data
for update in updates:
    ch_obj = update['chapter']['obj']
    
    # Find the position where to insert the fields (after unique_identifier)
    if 'id' not in ch_obj or not ch_obj['id']:
        ch_obj['id'] = update['new_id']
    if 'all_chapter' not in ch_obj or not ch_obj['all_chapter']:
        ch_obj['all_chapter'] = update['new_all_chapter']
    if 'book' not in ch_obj or not ch_obj['book']:
        ch_obj['book'] = update['new_book']

# Save the updated JSON
with open('data/l_outline.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nFile updated successfully!")

