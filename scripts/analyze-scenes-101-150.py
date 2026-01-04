#!/usr/bin/env python3
import json
import re
from typing import List, Set, Dict, Any

def extract_characters(scene: Dict[str, Any]) -> List[str]:
    """Extract character names from scene data."""
    characters = set()

    # Add POV character
    if scene.get('pov'):
        characters.add(scene['pov'])

    # Check characters array if it exists
    if scene.get('characters') and isinstance(scene['characters'], list):
        for c in scene['characters']:
            if isinstance(c, str):
                characters.add(c)
            elif isinstance(c, dict) and c.get('name'):
                characters.add(c['name'])

    # Extract from setup, description, focus
    text = ' '.join([
        scene.get('setup', ''),
        scene.get('description', ''),
        scene.get('focus', '')
    ])

    # Common character names to look for
    name_patterns = [
        'Francisco', 'Zara', 'Roger', 'Elise', 'Marcus', 'Sarah',
        'Elena', 'David', 'Michael', 'Julia', 'Carlos', 'Ana',
        'Thomas', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer',
        'William', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Barbara',
        'Charles', 'Elizabeth', 'Christopher', 'Susan', 'Daniel', 'Jessica',
        'Matthew', 'Karen', 'Anthony', 'Nancy', 'Mark', 'Betty',
        'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna',
        'Andrew', 'Carol', 'Joshua', 'Ruth', 'Kenneth', 'Sharon',
        'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Edward',
        'Ronald', 'Deborah', 'Timothy', 'Amy', 'Jason', 'Angela',
        'Jeffrey', 'Melissa', 'Ryan', 'Brenda', 'Alexandra', 'Victoria',
        'Sophie', 'Isabella', 'Emma', 'Olivia', 'Ava', 'Mia',
        'Ethan', 'Noah', 'Liam', 'Mason', 'Lucas', 'Oliver'
    ]

    for name in name_patterns:
        if re.search(r'\b' + re.escape(name) + r'\b', text, re.IGNORECASE):
            characters.add(name)

    return sorted(list(characters))

def generate_enhanced_conflict(scene: Dict[str, Any], characters: List[str]) -> str:
    """Generate enhanced internal conflict text."""
    pov = scene.get('pov', 'the protagonist')
    current_conflict = scene.get('internal_conflict', '')

    # Analyze the scene content
    text = ' '.join([
        scene.get('setup', ''),
        scene.get('description', ''),
        scene.get('focus', '')
    ]).lower()

    enhanced = current_conflict

    # If there's no current conflict, generate one based on scene content
    if not current_conflict or not current_conflict.strip():
        if 'leadership' in text or 'lead' in text:
            enhanced = f"{pov} struggles with self-doubt about their leadership abilities"
        elif 'decision' in text or 'choose' in text or 'choice' in text:
            enhanced = f"{pov} faces internal turmoil over difficult choices"
        elif 'trust' in text or 'betray' in text:
            enhanced = f"{pov} battles with trust issues and fear of betrayal"
        elif 'fear' in text or 'afraid' in text or 'anxiety' in text:
            enhanced = f"{pov} confronts deep-seated fears and anxieties"
        elif 'conflict' in text or 'tension' in text:
            enhanced = f"{pov} navigates internal tension and conflicting values"
        elif 'responsibility' in text or 'duty' in text:
            enhanced = f"{pov} wrestles with the weight of responsibility and duty"
        elif 'identity' in text or 'self' in text:
            enhanced = f"{pov} questions their sense of identity and purpose"
        elif 'power' in text or 'control' in text:
            enhanced = f"{pov} struggles with the ethics of power and control"
        else:
            enhanced = f"{pov} grapples with personal challenges and growth"

    # Enhance with other character conflicts if multiple characters present
    if len(characters) > 1:
        other_chars = [c for c in characters if c != pov]

        if other_chars:
            # Look for relationship indicators
            if 'mentor' in text or 'guide' in text or 'teach' in text:
                enhanced += f", complicated by tension with their mentor {other_chars[0]} whose methods challenge their beliefs"
            elif 'team' in text or 'group' in text or 'collaborate' in text or 'together' in text:
                if len(other_chars) >= 2:
                    enhanced += f", while navigating team dynamics and conflicting priorities among {other_chars[0]} and {other_chars[1]}"
                else:
                    enhanced += f", while navigating team dynamics with {other_chars[0]}"
            elif 'oppose' in text or 'disagree' in text or 'argument' in text or 'dispute' in text:
                enhanced += f", intensified by disagreement with {other_chars[0]} over the best path forward"
            elif 'relationship' in text or 'romance' in text or 'love' in text or 'attraction' in text:
                enhanced += f", further complicated by evolving feelings toward {other_chars[0]} that challenge professional boundaries"
            elif 'rival' in text or 'competition' in text or 'compete' in text:
                enhanced += f", exacerbated by competitive tension with {other_chars[0]} that forces self-examination"
            elif 'family' in text or 'parent' in text or 'sibling' in text:
                enhanced += f", deepened by unresolved family dynamics with {other_chars[0]} that surface old wounds"
            elif 'authority' in text or 'superior' in text or 'boss' in text:
                enhanced += f", complicated by conflicting directives from {other_chars[0]} that challenge their judgment"
            elif len(other_chars) >= 2:
                enhanced += f", complicated by interpersonal tensions between {other_chars[0]} and {other_chars[1]} that force {pov} to navigate conflicting loyalties"
            elif len(other_chars) == 1:
                enhanced += f", while {other_chars[0]}'s contrasting approach highlights {pov}'s internal doubts"

    return enhanced

def main():
    # Read the raw scenes data
    with open('/tmp/scenes_101_150_raw.json', 'r') as f:
        raw_scenes = json.load(f)

    # Process each scene
    analysis = []
    for index, scene in enumerate(raw_scenes):
        scene_index = 101 + index
        characters = extract_characters(scene)

        analysis.append({
            'scene_index': scene_index,
            'chapter_id': scene.get('chapter_id', ''),
            'scene_number': scene.get('scene_number', 0),
            'title': scene.get('title', f"Scene {scene.get('scene_number', scene_index)}"),
            'pov': scene.get('pov', 'Unknown'),
            'current_internal_conflict': scene.get('internal_conflict', ''),
            'characters_involved': characters,
            'proposed_enhanced_conflict': generate_enhanced_conflict(scene, characters)
        })

    # Write the analysis to the output file
    output_path = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/scripts/scenes-101-150-analysis.json'
    with open(output_path, 'w') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)

    print(f"Analysis complete! Processed {len(analysis)} scenes.")
    print(f"Output written to: {output_path}")

    # Print summary statistics
    scenes_with_conflict = sum(1 for s in analysis if s['current_internal_conflict'])
    scenes_with_multiple_chars = sum(1 for s in analysis if len(s['characters_involved']) > 1)

    print(f"\nSummary Statistics:")
    print(f"  Scenes with existing internal conflict: {scenes_with_conflict}/{len(analysis)}")
    print(f"  Scenes with multiple characters: {scenes_with_multiple_chars}/{len(analysis)}")

if __name__ == '__main__':
    main()
