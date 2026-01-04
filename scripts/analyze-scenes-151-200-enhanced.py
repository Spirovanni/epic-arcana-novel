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

def extract_characters_advanced(scene: Dict) -> Dict[str, List[str]]:
    """Extract character names with more detail, including mentions in different contexts."""
    pov = scene.get('pov', 'Unknown POV')

    # Clean up POV
    if '(' in pov and ')' in pov:
        # Extract character name from "3rd Person Limited (Francisco)"
        match = re.search(r'\(([^)]+)\)', pov)
        if match:
            pov_clean = match.group(1)
        else:
            pov_clean = pov
    else:
        pov_clean = pov

    characters = {
        'pov': pov_clean,
        'mentioned': [],
        'interacting': []
    }

    # Comprehensive list of known characters
    known_characters = [
        # Main characters
        'Francisco', 'Zara', 'Roger', 'Maggie', 'Marcus', 'Kai', 'Elena',
        'Thomas', 'Sarah', 'David', 'Michael', 'Lisa', 'James', 'Amara',
        'Viktor', 'Isabella', 'Chen', 'Olivia', 'Nathan', 'Emma', 'Alex',
        'Sophie', 'Daniel', 'Rachel', 'Liam', 'Grace', 'Ethan', 'Maya',
        'Jordan', 'Chloe', 'Ryan', 'Ava', 'Noah', 'Mia', 'Lucas', 'Aria',
        # Professionals
        'Dr. Martinez', 'Dr. Chen', 'Dr. Patel', 'Dr. Kim', 'Dr. Anderson',
        'Professor', 'Coach', 'Mentor', 'Instructor', 'Director', 'Manager', 'CEO',
        # Family/relationships
        'Novella', 'Father', 'Mother', 'Sister', 'Brother', 'Wife', 'Husband',
        # Groups
        'Team', 'Crew', 'Squad', 'Group', 'Council'
    ]

    # Search in all text fields
    text_fields = {
        'setup': scene.get('setup', ''),
        'description': scene.get('description', ''),
        'focus': scene.get('focus', ''),
        'scene_title': scene.get('scene_title', ''),
        'title': scene.get('title', ''),
        'internal_conflict': scene.get('internal_conflict', ''),
        'internalConflict': scene.get('internalConflict', ''),
        'preliminary_scene_focus': scene.get('preliminary_scene_focus', ''),
        'preliminary_scene_description': scene.get('preliminary_scene_description', ''),
        'character_arcs': str(scene.get('character_arcs', '')),
        'interactions': str(scene.get('interactions', '')),
        'beat_goal': scene.get('beat_goal', ''),
        'symbolism': scene.get('symbolism', ''),
    }

    all_text = ' '.join(text_fields.values())

    # Look for interaction keywords
    interaction_keywords = [
        'with', 'talks to', 'meets', 'confronts', 'argues with', 'helps',
        'challenges', 'supports', 'disagrees with', 'works with', 'team',
        'together', 'collaboration', 'conflict with', 'versus', 'against'
    ]

    for name in known_characters:
        if name in all_text and name != pov_clean:
            characters['mentioned'].append(name)

            # Check if there's interaction context
            for keyword in interaction_keywords:
                if keyword in all_text.lower():
                    characters['interacting'].append(name)
                    break

    # Remove duplicates
    characters['mentioned'] = list(set(characters['mentioned']))
    characters['interacting'] = list(set(characters['interacting']))

    return characters

def create_enhanced_conflict(scene: Dict, character_data: Dict) -> str:
    """Create enhanced internal conflict that emphasizes multi-character dynamics."""
    current_conflict = scene.get('internal_conflict') or scene.get('internalConflict', '')
    pov = character_data['pov']
    title = scene.get('scene_title') or scene.get('title', '')

    # Get all relevant scene information
    setup = scene.get('setup', '')
    description = scene.get('description', '')
    focus = scene.get('focus', '')
    preliminary_focus = scene.get('preliminary_scene_focus', '')
    preliminary_desc = scene.get('preliminary_scene_description', '')
    beat_goal = scene.get('beat_goal', '')
    core_emotion = scene.get('core_emotion', '')
    character_arcs = scene.get('character_arcs', '')

    # Build enhanced conflict
    enhanced = current_conflict if current_conflict else ''

    # If there are interacting characters, emphasize that
    if character_data['interacting']:
        interacting = ', '.join(character_data['interacting'])

        # Check if the conflict already mentions these characters
        has_character_mention = any(char in enhanced for char in character_data['interacting'])

        if not has_character_mention and len(enhanced) < 200:
            # Analyze the text to find relationship context
            all_text = f"{setup} {description} {focus} {preliminary_focus} {preliminary_desc}"

            # Look for relationship/conflict indicators
            conflict_indicators = []
            if 'team' in all_text.lower():
                conflict_indicators.append(f"team dynamics with {interacting}")
            if any(word in all_text.lower() for word in ['challenge', 'conflict', 'tension', 'disagree']):
                conflict_indicators.append(f"tension involving {interacting}")
            if any(word in all_text.lower() for word in ['help', 'support', 'collaborate', 'work with']):
                conflict_indicators.append(f"collaboration with {interacting}")
            if any(word in all_text.lower() for word in ['lead', 'manage', 'direct', 'command']):
                conflict_indicators.append(f"leadership challenges with {interacting}")

            if conflict_indicators:
                enhanced += f" [{'; '.join(conflict_indicators)}]"
            else:
                enhanced += f" [Involves: {interacting}]"

    elif character_data['mentioned']:
        # Characters are mentioned but not clearly interacting
        mentioned = ', '.join(character_data['mentioned'])
        if not any(char in enhanced for char in character_data['mentioned']):
            enhanced += f" [Context includes: {mentioned}]"

    # If still minimal, build from available data
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

        if context_parts:
            enhanced = ' | '.join(context_parts)[:500]

    # Final fallback
    if not enhanced:
        enhanced = f"[Scene {scene.get('global_index')}: {title}] - POV: {pov}. Internal conflict details needed."

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
        character_data = extract_characters_advanced(scene)

        # Build characters_involved list
        all_chars = [character_data['pov']]
        all_chars.extend(character_data['mentioned'])
        all_chars = sorted(list(set(all_chars)))

        analysis_entry = {
            'scene_index': scene['global_index'],
            'chapter_id': scene['chapter_id'],
            'scene_number': scene.get('scene_number', 0),
            'title': scene.get('scene_title') or scene.get('title', 'Untitled'),
            'pov': character_data['pov'],
            'current_internal_conflict': scene.get('internal_conflict') or scene.get('internalConflict', ''),
            'characters_involved': all_chars,
            'proposed_enhanced_conflict': create_enhanced_conflict(scene, character_data)
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

    # Print detailed sample
    print(f"\nDetailed sample scenes:")
    for a in analysis[:5]:
        print(f"\n{'='*80}")
        print(f"Scene {a['scene_index']} ({a['chapter_id']}, Scene {a['scene_number']})")
        print(f"Title: {a['title']}")
        print(f"POV: {a['pov']}")
        print(f"Characters: {', '.join(a['characters_involved'])}")
        print(f"\nCurrent internal conflict:")
        print(f"  {a['current_internal_conflict']}")
        print(f"\nProposed enhanced conflict:")
        print(f"  {a['proposed_enhanced_conflict']}")

if __name__ == '__main__':
    main()
