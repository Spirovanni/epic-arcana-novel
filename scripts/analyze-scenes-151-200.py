#!/usr/bin/env python3
import json
import re
from pathlib import Path
from typing import List, Dict, Set, Any

def extract_all_scenes(outline_data: Dict) -> List[Dict]:
    """Extract all scenes from the outline in order."""
    all_scenes = []
    global_index = 0

    # Navigate through the structure
    books_data = outline_data.get('SelfImprovementSeries', {}).get('Books', {}).get('trilogies', {})

    # Process each trilogy
    for trilogy_key in sorted(books_data.keys()):
        trilogy = books_data[trilogy_key]
        trilogy_books = trilogy.get('trilogy_books', {})

        # Process each book in the trilogy
        for book_key in sorted(trilogy_books.keys()):
            book = trilogy_books[book_key]
            task_masters = book.get('task_masters', {})

            # Process each task master
            for tm_key in sorted(task_masters.keys()):
                task_master = task_masters[tm_key]
                major_task_groups = task_master.get('major_task_groups', {})

                # Process each major task group
                for mtg_key in sorted(major_task_groups.keys()):
                    major_task_group = major_task_groups[mtg_key]

                    # Check if this is a major_activity_theme (different structure)
                    if 'major_activity_theme' in mtg_key:
                        continue

                    specific_task_groups = major_task_group.get('Specific_task_groups', {})

                    # Process each specific task group (chapter)
                    for stg_key in sorted(specific_task_groups.keys()):
                        specific_task_group = specific_task_groups[stg_key]
                        chapter_id = specific_task_group.get('unique_identifier', '')
                        scenes = specific_task_group.get('scenes', [])

                        # Process each scene
                        for scene in scenes:
                            global_index += 1
                            scene_data = scene.copy()
                            scene_data['global_index'] = global_index
                            scene_data['chapter_id'] = chapter_id
                            scene_data['chapter_title'] = specific_task_group.get('chapter_title', '')
                            all_scenes.append(scene_data)

    return all_scenes

def extract_characters(scene: Dict) -> List[str]:
    """Extract character names from scene data."""
    characters = set()

    # Add POV character
    if scene.get('pov'):
        characters.add(scene['pov'])

    # Add from characters array if exists
    if scene.get('characters') and isinstance(scene['characters'], list):
        characters.update(scene['characters'])

    # Known characters to search for
    known_characters = [
        'Francisco', 'Zara', 'Roger', 'Maggie', 'Marcus', 'Kai', 'Elena',
        'Thomas', 'Sarah', 'David', 'Michael', 'Lisa', 'James', 'Amara',
        'Viktor', 'Isabella', 'Chen', 'Olivia', 'Nathan', 'Emma', 'Alex',
        'Sophie', 'Daniel', 'Rachel', 'Liam', 'Grace', 'Ethan', 'Maya',
        'Jordan', 'Chloe', 'Ryan', 'Ava', 'Noah', 'Mia', 'Lucas', 'Aria',
        'Dr. Martinez', 'Dr. Chen', 'Dr. Patel', 'Dr. Kim', 'Professor',
        'Coach', 'Mentor', 'Instructor', 'Director', 'Manager', 'CEO'
    ]

    # Search in text fields
    text_fields = ' '.join(filter(None, [
        scene.get('setup', ''),
        scene.get('description', ''),
        scene.get('focus', ''),
        scene.get('scene_title', ''),
        scene.get('title', ''),
        scene.get('internal_conflict', ''),
        scene.get('internalConflict', ''),
        scene.get('preliminary_scene_focus', ''),
        scene.get('preliminary_scene_description', ''),
        str(scene.get('character_arcs', '')),
        str(scene.get('interactions', ''))
    ]))

    for name in known_characters:
        if name in text_fields:
            characters.add(name)

    return sorted(list(characters))

def enhance_internal_conflict(scene: Dict, characters: List[str]) -> str:
    """Create enhanced internal conflict that includes multi-character dynamics."""
    current_conflict = scene.get('internal_conflict') or scene.get('internalConflict', '')
    pov = scene.get('pov', 'Unknown POV')
    title = scene.get('scene_title') or scene.get('title', '')

    # If there's already a detailed conflict, check if it mentions other characters
    if current_conflict and len(current_conflict) > 100:
        has_other_characters = any(c != pov and c in current_conflict for c in characters)
        if has_other_characters:
            return current_conflict

    # Build enhanced conflict based on available information
    setup = scene.get('setup', '')
    description = scene.get('description', '')
    focus = scene.get('focus', '')
    preliminary_focus = scene.get('preliminary_scene_focus', '')
    preliminary_desc = scene.get('preliminary_scene_description', '')
    beat_goal = scene.get('beat_goal', '')
    core_emotion = scene.get('core_emotion', '')
    character_arcs = scene.get('character_arcs', '')

    enhanced = current_conflict or ''

    # Add context from other fields if conflict is minimal
    if len(enhanced) < 50:
        context_parts = []
        if beat_goal:
            context_parts.append(f"Goal: {beat_goal}")
        if core_emotion:
            context_parts.append(f"Emotion: {core_emotion}")
        if preliminary_focus:
            context_parts.append(preliminary_focus)
        if preliminary_desc:
            context_parts.append(preliminary_desc)
        if focus:
            context_parts.append(focus)
        if description:
            context_parts.append(description)
        if setup:
            context_parts.append(setup)
        if character_arcs:
            context_parts.append(f"Character arcs: {character_arcs}")

        if context_parts:
            enhanced = ' | '.join(context_parts)[:500]

    # Add character interaction context if multiple characters are present
    if len(characters) > 1:
        other_characters = [c for c in characters if c != pov]
        if other_characters and not any(oc in enhanced for oc in other_characters):
            enhanced += f" [Involves interactions with: {', '.join(other_characters)}]"

    # If still empty, create a placeholder
    if not enhanced:
        enhanced = f"[Scene {scene.get('global_index')}: {title}] - Internal conflict details needed. POV: {pov}"

    return enhanced

def main():
    # Read the outline file
    outline_path = Path(__file__).parent.parent / 'data' / 'l_outline.json'
    print(f"Reading outline from: {outline_path}")

    with open(outline_path, 'r', encoding='utf-8') as f:
        outline_data = json.load(f)

    # Extract all scenes
    print("Extracting all scenes...")
    all_scenes = extract_all_scenes(outline_data)
    print(f"Total scenes found: {len(all_scenes)}")

    # Extract scenes 151-200
    target_scenes = [s for s in all_scenes if 151 <= s['global_index'] <= 200]
    print(f"Scenes 151-200: {len(target_scenes)} scenes")

    if not target_scenes:
        print("No scenes found in range 151-200!")
        print(f"Available scene range: 1-{len(all_scenes)}")
        return

    # Analyze each scene
    analysis = []
    for scene in target_scenes:
        characters = extract_characters(scene)

        analysis_entry = {
            'scene_index': scene['global_index'],
            'chapter_id': scene['chapter_id'],
            'scene_number': scene.get('scene_number', 0),
            'title': scene.get('scene_title') or scene.get('title', 'Untitled'),
            'pov': scene.get('pov', 'Unknown'),
            'current_internal_conflict': scene.get('internal_conflict') or scene.get('internalConflict', ''),
            'characters_involved': characters,
            'proposed_enhanced_conflict': enhance_internal_conflict(scene, characters)
        }
        analysis.append(analysis_entry)

    # Write the analysis to output file
    output_path = Path(__file__).parent / 'scenes-151-200-analysis.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)

    print(f"\nAnalysis complete!")
    print(f"Output written to: {output_path}")
    print(f"\nSummary:")
    print(f"- Total scenes analyzed: {len(analysis)}")
    print(f"- Scenes with internal conflicts: {sum(1 for a in analysis if a['current_internal_conflict'])}")
    print(f"- Scenes with multiple characters: {sum(1 for a in analysis if len(a['characters_involved']) > 1)}")

    # Character distribution
    all_chars = set()
    for a in analysis:
        all_chars.update(a['characters_involved'])
    print(f"- Unique characters involved: {len(all_chars)}")
    print(f"- Characters: {', '.join(sorted(all_chars))}")

    # Print sample
    print(f"\nSample scenes:")
    for a in analysis[:5]:
        print(f"\nScene {a['scene_index']} ({a['chapter_id']}, Scene {a['scene_number']})")
        print(f"  Title: {a['title']}")
        print(f"  POV: {a['pov']}")
        print(f"  Characters: {', '.join(a['characters_involved'])}")
        conflict_preview = a['current_internal_conflict'][:100] if a['current_internal_conflict'] else 'None'
        print(f"  Current conflict: {conflict_preview}...")

if __name__ == '__main__':
    main()
