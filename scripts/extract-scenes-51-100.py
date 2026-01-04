#!/usr/bin/env python3
import json
import re
from pathlib import Path

# Read the outline file
outline_path = Path(__file__).parent.parent / 'data' / 'l_outline.json'
with open(outline_path, 'r') as f:
    outline_data = json.load(f)

# Extract all scenes with their chapter context
all_scenes = []

def extract_scenes_from_book(book_data, trilogy_name, book_name):
    """Extract scenes from a book's task_masters structure"""
    task_masters = book_data.get('task_masters', {})

    for tm_key, tm_value in task_masters.items():
        major_task_groups = tm_value.get('major_task_groups', {})

        for mtg_key, mtg_value in major_task_groups.items():
            specific_task_groups = mtg_value.get('Specific_task_groups', {})

            for stg_key, chapter in specific_task_groups.items():
                chapter_id = chapter.get('id', '')
                scenes = chapter.get('scenes', [])

                for scene in scenes:
                    scene_with_context = {
                        'scene_index': 0,  # Will be set after sorting
                        'trilogy': trilogy_name,
                        'book': book_name,
                        'chapter_id': chapter_id,
                        'scene_number': scene.get('scene_number', 0),
                        'title': scene.get('title', ''),
                        'pov': scene.get('pov', ''),
                        'setup': scene.get('setup', ''),
                        'description': scene.get('description', ''),
                        'focus': scene.get('focus', ''),
                        'current_internal_conflict': scene.get('internal_conflict') or scene.get('internalConflict', ''),
                        'characters_involved': scene.get('characters', []),
                        'scene_data': scene
                    }
                    all_scenes.append(scene_with_context)

# Navigate through the structure
series = outline_data.get('SelfImprovementSeries', {})
books_section = series.get('Books', {})
trilogies = books_section.get('trilogies', {})

# Process each trilogy
for trilogy_key, trilogy_data in trilogies.items():
    trilogy_books = trilogy_data.get('trilogy_books', {})

    # Process each book in the trilogy
    for book_key, book_data in trilogy_books.items():
        extract_scenes_from_book(book_data, trilogy_key, book_key)

# Sort scenes by chapter ID (EA-XXX) and then by scene number
def get_chapter_num(chapter_id):
    match = re.search(r'EA-(\d+)', chapter_id)
    return int(match.group(1)) if match else 0

all_scenes.sort(key=lambda s: (get_chapter_num(s['chapter_id']), s['scene_number']))

# Assign scene indices
for index, scene in enumerate(all_scenes):
    scene['scene_index'] = index + 1

# Extract scenes 51-100
scenes_51_to_100 = all_scenes[50:100]  # 0-indexed, so 50-99

print(f"Total scenes in outline: {len(all_scenes)}")
print(f"Extracting scenes 51-100 ({len(scenes_51_to_100)} scenes)")

# Save the extracted scenes for analysis
output_path = Path(__file__).parent / 'scenes-51-100-raw.json'
with open(output_path, 'w') as f:
    json.dump(scenes_51_to_100, f, indent=2)

print(f"Saved raw scenes to: {output_path}")

if scenes_51_to_100:
    print(f"\nFirst scene:")
    first = scenes_51_to_100[0]
    print(f"  Scene {first['scene_index']}: {first['chapter_id']} - {first['title']}")

    print(f"\nLast scene:")
    last = scenes_51_to_100[-1]
    print(f"  Scene {last['scene_index']}: {last['chapter_id']} - {last['title']}")
