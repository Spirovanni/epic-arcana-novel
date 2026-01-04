#!/usr/bin/env python3

import json
import os
import re
from typing import List, Dict, Any

# Common character names to look for
COMMON_NAMES = [
    'Francisco', 'Zara', 'Roger', 'Isabella', 'Maya', 'Alex',
    'Elena', 'Marcus', 'Sarah', 'David', 'Emma', 'James',
    'Olivia', 'Lucas', 'Sophia', 'Ethan', 'Ava', 'Noah',
    'Liam', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
    'Thomas', 'Henry', 'Sebastian', 'Victoria', 'Penelope',
    'Dr. Chen', 'Professor Martinez', 'Coach', 'Mentor',
    'Aria', 'Kai', 'Elijah', 'Grace', 'Owen', 'Lily',
    'Antonio', 'Maria', 'Carlos', 'Rosa', 'Luis', 'Carmen'
]

def extract_character_names(text: str) -> List[str]:
    """Extract character names from text."""
    found = set()
    lower_text = text.lower()

    for name in COMMON_NAMES:
        if name.lower() in lower_text:
            found.add(name)

    return sorted(list(found))

def clean_pov_name(pov: str) -> str:
    """Extract the actual character name from POV field."""
    # Handle cases like "Third Person Limited (Francisco)"
    match = re.search(r'\(([^)]+)\)', pov)
    if match:
        return match.group(1)
    # Remove common POV indicators
    pov = re.sub(r'(Third Person Limited|First Person|Second Person)\s*[-:]?\s*', '', pov, flags=re.IGNORECASE)
    return pov.strip()

def enhance_conflict_description(scene: Dict[str, Any], characters: List[str], clean_pov: str) -> str:
    """Generate enhanced conflict description."""
    pov = scene.get('pov', scene.get('POV', ''))
    current_conflict = scene.get('internalConflict', scene.get('internal_conflict', ''))
    setup = scene.get('setup', '')
    description = scene.get('description', '')
    focus = scene.get('focus', '')
    character_growth = scene.get('characterGrowthElement', '')

    # Start with current conflict if it exists
    if current_conflict:
        enhanced = current_conflict
    else:
        # Create a basic conflict description
        enhanced = f"{clean_pov} faces internal tensions during this scene" if clean_pov else "Internal tensions arise in this scene"

    # Analyze other characters involved (excluding POV character and their variations)
    other_characters = [c for c in characters if c != clean_pov and c != pov and not c.startswith('Third Person')]

    if len(other_characters) > 0:
        # Check if other characters are already mentioned in the conflict
        conflict_lower = enhanced.lower()
        mentioned_others = any(char.lower() in conflict_lower for char in other_characters)

        if not mentioned_others and len(enhanced) < 500:
            # Add information about other characters
            if len(other_characters) == 1:
                char_phrase = other_characters[0]
            elif len(other_characters) == 2:
                char_phrase = f"{other_characters[0]} and {other_characters[1]}"
            else:
                char_phrase = f"{', '.join(other_characters[:-1])}, and {other_characters[-1]}"

            # Look for relationship clues in the text
            combined_text = f"{setup} {description} {focus}".lower()

            if 'conflict' in combined_text or 'disagree' in combined_text or 'tension' in combined_text:
                enhanced += f" The presence and perspectives of {char_phrase} intensify this internal struggle, as their conflicting viewpoints challenge {clean_pov}'s assumptions and force difficult choices."
            elif 'support' in combined_text or 'help' in combined_text or 'ally' in combined_text:
                enhanced += f" While {char_phrase} offer support, their involvement complicates {clean_pov}'s internal landscape, as accepting help conflicts with {clean_pov}'s sense of self-reliance and identity."
            elif 'mentor' in combined_text or 'guide' in combined_text or 'teach' in combined_text:
                enhanced += f" The guidance from {char_phrase} creates internal friction as {clean_pov} struggles between accepting wisdom from others and trusting their own instincts."
            else:
                enhanced += f" Interactions with {char_phrase} add layers to {clean_pov}'s internal conflict, as each character's agenda and perspective forces {clean_pov} to confront their own beliefs and motivations."

    return enhanced

def extract_all_scenes(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract all scenes from the nested JSON structure."""
    all_scenes = []

    try:
        trilogies = data['SelfImprovementSeries']['Books']['trilogies']

        for trilogy_key in ['1st_trilogy', '2nd_trilogy', '3rd_trilogy']:
            if trilogy_key not in trilogies:
                continue

            trilogy = trilogies[trilogy_key]
            trilogy_books = trilogy.get('trilogy_books', {})

            for book_key in ['Book1', 'Book2', 'Book3']:
                if book_key not in trilogy_books:
                    continue

                book = trilogy_books[book_key]
                task_masters = book.get('task_masters', {})

                for tm_key in ['task_master_1', 'task_master_2', 'task_master_3']:
                    if tm_key not in task_masters:
                        continue

                    task_master = task_masters[tm_key]
                    major_task_groups = task_master.get('major_task_groups', {})

                    for mtg_key in major_task_groups.keys():
                        major_task_group = major_task_groups[mtg_key]
                        specific_task_groups = major_task_group.get('Specific_task_groups', {})

                        for stg_key in specific_task_groups.keys():
                            specific_task_group = specific_task_groups[stg_key]

                            # Get chapter info
                            chapter_id = specific_task_group.get('chapter', 'Unknown')
                            chapter_number = specific_task_group.get('all_chapter', 0)

                            # Extract scenes
                            scenes = specific_task_group.get('scenes', [])
                            for scene in scenes:
                                scene_copy = scene.copy()
                                scene_copy['chapter_id'] = chapter_id
                                scene_copy['chapter_number'] = chapter_number
                                all_scenes.append(scene_copy)

    except Exception as e:
        print(f"Error extracting scenes: {e}")
        import traceback
        traceback.print_exc()

    return all_scenes

def analyze_scene(scene: Dict[str, Any], index: int) -> Dict[str, Any]:
    """Analyze a single scene."""
    # Combine text fields for character extraction
    combined_text = ' '.join(str(v) for v in [
        scene.get('setup', ''),
        scene.get('description', ''),
        scene.get('focus', ''),
        scene.get('internalConflict', ''),
        scene.get('internal_conflict', ''),
        scene.get('conflict', ''),
        scene.get('chapterSceneFocus', ''),
        scene.get('characterGrowthElement', ''),
        scene.get('preliminarySceneDescription', '')
    ] if v)

    # Extract characters
    characters_involved = scene.get('characters', [])
    if not characters_involved:
        characters_involved = extract_character_names(combined_text)

    # Get and clean POV
    pov_raw = scene.get('pov', scene.get('POV', 'Unknown'))
    pov_clean = clean_pov_name(pov_raw)

    # Ensure POV character is in the list (using clean name)
    if pov_clean and pov_clean not in characters_involved:
        characters_involved.insert(0, pov_clean)

    # Remove POV variations from character list
    characters_involved = [c for c in characters_involved if not c.startswith('Third Person')]

    # Generate enhanced conflict
    proposed_conflict = enhance_conflict_description(scene, characters_involved, pov_clean)

    return {
        'scene_index': index + 1,
        'chapter_id': scene.get('chapter_id', 'Unknown'),
        'scene_number': scene.get('scene_number', 0),
        'title': scene.get('title', scene.get('scene_title', 'Untitled')),
        'pov': pov_clean,
        'current_internal_conflict': scene.get('internalConflict', scene.get('internal_conflict', scene.get('conflict', ''))),
        'characters_involved': characters_involved,
        'proposed_enhanced_conflict': proposed_conflict
    }

def main():
    # Read the outline file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    outline_path = os.path.join(script_dir, '../data/l_outline.json')

    print(f"Reading outline from: {outline_path}")

    with open(outline_path, 'r') as f:
        outline = json.load(f)

    # Extract all scenes
    all_scenes = extract_all_scenes(outline)

    # Sort scenes by chapter number, then scene number
    all_scenes.sort(key=lambda s: (s.get('chapter_number', 0), s.get('scene_number', 0)))

    # Take first 50 scenes
    first_50 = all_scenes[:50]

    print(f"Found {len(all_scenes)} total scenes")
    print(f"Processing first {len(first_50)} scenes...")

    # Analyze each scene
    analysis = []
    for i, scene in enumerate(first_50):
        analyzed = analyze_scene(scene, i)
        analysis.append(analyzed)

    # Write output
    output_path = os.path.join(script_dir, 'first-50-scenes-analysis.json')
    with open(output_path, 'w') as f:
        json.dump(analysis, f, indent=2)

    print(f"\nAnalysis complete!")
    print(f"Output written to: {output_path}")
    print(f"\nSummary:")
    print(f"- Total scenes analyzed: {len(analysis)}")
    print(f"- Scenes with internal conflicts: {len([a for a in analysis if a['current_internal_conflict']])}")
    print(f"- Scenes with multiple characters: {len([a for a in analysis if len(a['characters_involved']) > 1])}")
    print(f"- Unique POV characters: {len(set(a['pov'] for a in analysis))}")

    # Print first few scenes as preview
    print(f"\nFirst 5 scenes preview:")
    for i in range(min(5, len(analysis))):
        a = analysis[i]
        print(f"\n{i + 1}. {a['chapter_id']} Scene {a['scene_number']}: {a['title']}")
        print(f"   POV: {a['pov']}")
        print(f"   Characters: {', '.join(a['characters_involved']) if a['characters_involved'] else 'None detected'}")
        conflict_preview = a['current_internal_conflict'][:100]
        if len(a['current_internal_conflict']) > 100:
            conflict_preview += '...'
        print(f"   Current conflict: {conflict_preview if conflict_preview else 'None'}")

if __name__ == '__main__':
    main()
